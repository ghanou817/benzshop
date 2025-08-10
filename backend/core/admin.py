from django.contrib import admin
from .models import Product, Category, Flavor, ProductImage, Order, OrderItem, Notification, Setting, User

admin.site.register(Product)
admin.site.register(Category)
admin.site.register(Flavor)
admin.site.register(ProductImage)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Notification)
admin.site.register(Setting)
admin.site.register(User)
