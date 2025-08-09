import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'benzshop.settings')
django.setup()

from core.models import User

phone = '0776804502'
password = 'abdouabdou'
full_name = 'عبد الغاني'
wilaya = '---'
commune = '---'
shop_address = '---'

if User.objects.filter(phone=phone).exists():
    user = User.objects.get(phone=phone)
    user.full_name = full_name
    user.wilaya = wilaya
    user.commune = commune
    user.shop_address = shop_address
    user.is_staff = True
    user.is_superuser = True
    user.set_password(password)
    user.save()
    print('تم تحديث حساب المدير بنجاح.')
else:
    user = User.objects.create_user(
        phone=phone,
        password=password,
        full_name=full_name,
        wilaya=wilaya,
        commune=commune,
        shop_address=shop_address,
    )
    user.is_staff = True
    user.is_superuser = True
    user.save()
    print('تم إنشاء حساب المدير بنجاح.')
