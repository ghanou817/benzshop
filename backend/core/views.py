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
