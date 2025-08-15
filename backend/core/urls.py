from django.urls import path
from . import views
from .views import direct_order_api

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    # RESTful API endpoints for frontend


    path('api/products/', views.products_api, name='products_api'),
    path('api/products/<int:product_id>/', views.product_detail_api, name='product_detail_api'),

    path('api/about/', views.about_api, name='about_api'),
    path('api/contact/', views.contact_api, name='contact_api'),
    path('api/direct_order/', direct_order_api, name='direct_order_api'),
]
