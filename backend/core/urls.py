from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('api/products/', views.products_api, name='products_api'),
    path('api/products/<int:product_id>/', views.product_detail_api, name='product_detail_api'),
]
