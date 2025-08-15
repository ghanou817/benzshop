from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.sessions.models import Session
from .forms import RegisterForm, LoginForm
from .models import User
from django.http import HttpResponse

def home(request):
    return HttpResponse("مرحباً بك في موقع BenzShop! 🚀")

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.password_hash = form.cleaned_data['password']
            user.save()
            messages.success(request, 'تم إنشاء الحساب بنجاح. يمكنك تسجيل الدخول الآن.')
            return redirect('login')
    else:
        form = RegisterForm()
    return render(request, 'register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            user = form.cleaned_data['user']
            request.session['user_id'] = user.id
            request.session['user_name'] = user.first_name
            messages.success(request, 'تم تسجيل الدخول بنجاح.')
            return redirect('home')
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})

def logout_view(request):
    request.session.flush()
    messages.success(request, 'تم تسجيل الخروج بنجاح.')
    return redirect('login')

from django.http import JsonResponse
from .models import Product, ProductImage, Flavor, Category, About, Contact, Cart, CartItem
from django.views.decorators.csrf import csrf_exempt
import json

# cart_api, login_api, register_api have been removed by user request.

@csrf_exempt
def login_api(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        data = json.loads(request.body.decode())
        phone = data.get('phone')
        password = data.get('password')
        from django.contrib.auth.hashers import check_password
        from .models import User
        user = User.objects.get(phone=phone)
        if not check_password(password, user.password_hash):
            return JsonResponse({'error': 'كلمة المرور غير صحيحة'}, status=400)
        request.session['user_id'] = user.id
        return JsonResponse({'success': True, 'user': {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone': user.phone,
            'is_admin': user.is_admin,
        }})
    except User.DoesNotExist:
        return JsonResponse({'error': 'رقم الهاتف غير مسجل'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def register_api(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        data = json.loads(request.body.decode())
        from django.contrib.auth.hashers import make_password
        from .models import User
        if User.objects.filter(phone=data.get('phone')).exists():
            return JsonResponse({'error': 'رقم الهاتف مسجل بالفعل'}, status=400)
        user = User(
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            state=data.get('state', ''),
            commune=data.get('commune', ''),
            shop_address=data.get('shop_address', ''),
            shop_type=data.get('shop_type', ''),
            phone=data.get('phone'),
            password_hash=make_password(data.get('password')),
        )
        user.save()
        request.session['user_id'] = user.id
        return JsonResponse({'success': True, 'user': {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone': user.phone,
            'is_admin': user.is_admin,
        }})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

    # Auth: user_id in session
    user_id = request.session.get('user_id')
    if not user_id:
        return JsonResponse({'error': 'يجب تسجيل الدخول أولاً'}, status=403)
    from django.db.models import F
    try:
        from .models import User
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({'error': 'المستخدم غير موجود'}, status=404)

    # Get or create cart for user
    cart, _ = Cart.objects.get_or_create(user=user)

    if request.method == 'GET':
        items = [
            {
                'id': item.id,
                'product_id': item.product.id,
                'product_name': item.product.name,
                'price': float(item.product.price),
                'quantity': item.quantity,
                'image': item.product.images.first().image.url if item.product.images.exists() else '',
            }
            for item in cart.items.select_related('product').all()
        ]
        return JsonResponse({'items': items})

    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode())
            product_id = data.get('product_id')
            qty = int(data.get('qty', 1))
            product = Product.objects.get(id=product_id)
            item, created = CartItem.objects.get_or_create(cart=cart, product=product)
            if not created:
                item.quantity = F('quantity') + qty
            else:
                item.quantity = qty
            item.save()
            item.refresh_from_db()
            return JsonResponse({'success': True, 'item_id': item.id, 'quantity': item.quantity})
        except Product.DoesNotExist:
            return JsonResponse({'error': 'المنتج غير موجود'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    if request.method == 'DELETE':
        try:
            data = json.loads(request.body.decode())
            item_id = data.get('item_id')
            item = CartItem.objects.get(id=item_id, cart=cart)
            item.delete()
            return JsonResponse({'success': True})
        except CartItem.DoesNotExist:
            return JsonResponse({'error': 'العنصر غير موجود في السلة'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)

from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def login_api(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        data = json.loads(request.body.decode())
        phone = data.get('phone')
        password = data.get('password')
        from django.contrib.auth.hashers import check_password
        from .models import User
        user = User.objects.get(phone=phone)
        if not check_password(password, user.password_hash):
            return JsonResponse({'error': 'كلمة المرور غير صحيحة'}, status=400)
        # Set user_id in session for authentication
        request.session['user_id'] = user.id
        return JsonResponse({'success': True, 'user': {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone': user.phone,
            'is_admin': user.is_admin,
        }})
    except User.DoesNotExist:
        return JsonResponse({'error': 'رقم الهاتف غير مسجل'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def register_api(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        data = json.loads(request.body.decode())
        from django.contrib.auth.hashers import make_password
        from .models import User
        if User.objects.filter(phone=data.get('phone')).exists():
            return JsonResponse({'error': 'رقم الهاتف مسجل بالفعل'}, status=400)
        user = User(
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', ''),
            state=data.get('state', ''),
            commune=data.get('commune', ''),
            shop_address=data.get('shop_address', ''),
            shop_type=data.get('shop_type', ''),
            phone=data.get('phone'),
            password_hash=make_password(data.get('password')),
        )
        user.save()
        return JsonResponse({'success': True, 'user': {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'phone': user.phone,
            'is_admin': user.is_admin,
        }})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def products_api(request):
    products = Product.objects.filter(is_published=True)
    data = []
    for product in products:
        images = list(product.images.values_list('image', flat=True))
        flavors = list(product.flavors.values_list('name', flat=True))
        data.append({
            'id': product.id,
            'name': product.name,
            'category': product.category.name if product.category else '',
            'description': product.description,
            'price': float(product.price),
            'stock_qty': product.stock_qty,
            'images': images,
            'flavors': flavors,
        })
    return JsonResponse({'products': data})

def product_detail_api(request, product_id):
    try:
        product = Product.objects.get(id=product_id, is_published=True)
        images = list(product.images.values_list('image', flat=True))
        flavors = list(product.flavors.values_list('name', flat=True))
        data = {
            'id': product.id,
            'name': product.name,
            'category': product.category.name if product.category else '',
            'description': product.description,
            'price': float(product.price),
            'stock_qty': product.stock_qty,
            'images': images,
            'flavors': flavors,
        }
        return JsonResponse({'product': data})
    except Product.DoesNotExist:
        return JsonResponse({'error': 'المنتج غير موجود'}, status=404)

def about_api(request):
    about = About.objects.order_by('-last_updated').first()
    return JsonResponse({'content': about.content if about else ''})

@csrf_exempt
def direct_order_api(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        data = json.loads(request.body.decode())
        # Expected fields
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        phone = data.get('phone', '').strip()
        products = data.get('products', [])  # [{product_id, qty}, ...]
        state = data.get('state', '').strip()
        commune = data.get('commune', '').strip()
        shop_address = data.get('shop_address', '').strip()
        shop_name = data.get('shop_name', '').strip()  # optional
        # Basic validation
        if not (first_name and last_name and phone and products and state and commune and shop_address):
            return JsonResponse({'error': 'يرجى ملء جميع البيانات المطلوبة'} , status=400)
        # Save order (simple: print/log, or extend to DB)
        # For now, just log to console/server for demo
        import logging
        logging.warning(f"طلب جديد: {first_name} {last_name}, هاتف: {phone}, منتجات: {products}, ولاية: {state}, بلدية: {commune}, عنوان: {shop_address}, اسم المحل: {shop_name}")
        # يمكنك هنا لاحقاً إضافة حفظ للطلب في قاعدة البيانات أو إرسال إشعار
        return JsonResponse({'success': True, 'msg': 'تم استقبال الطلب بنجاح'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

def contact_api(request):
    contact = Contact.objects.order_by('-last_updated').first()
    return JsonResponse({'content': contact.content if contact else ''})
