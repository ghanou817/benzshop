from django import forms
from .models import User
from django.contrib.auth.hashers import make_password, check_password

class RegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    confirm_password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'state', 'commune', 'shop_address', 'shop_type', 'phone', 'password']

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password')
        confirm_password = cleaned_data.get('confirm_password')
        if password != confirm_password:
            raise forms.ValidationError('كلمتا المرور غير متطابقتين')
        cleaned_data['password'] = make_password(password)
        return cleaned_data

class LoginForm(forms.Form):
    phone = forms.CharField(max_length=20)
    password = forms.CharField(widget=forms.PasswordInput)

    def clean(self):
        cleaned_data = super().clean()
        phone = cleaned_data.get('phone')
        password = cleaned_data.get('password')
        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            raise forms.ValidationError('رقم الهاتف غير مسجل')
        if not check_password(password, user.password_hash):
            raise forms.ValidationError('كلمة المرور غير صحيحة')
        cleaned_data['user'] = user
        return cleaned_data
