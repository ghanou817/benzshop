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
from .models import Product, ProductImage, Flavor, Category
from django.views.decorators.csrf import csrf_exempt
import json

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
