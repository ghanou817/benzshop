import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import { useState } from 'react';

const RegisterPage = () => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    state: '',
    commune: '',
    shop_address: '',
    shop_type: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    fetch('https://abdelghani.pythonanywhere.com/core/api/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccess('تم إنشاء الحساب بنجاح!');
          setForm({
            first_name: '', last_name: '', state: '', commune: '', shop_address: '', shop_type: '', phone: '', password: ''
          });
        } else {
          setError(data.error || 'حدث خطأ أثناء التسجيل');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('تعذر الاتصال بالخادم');
        setLoading(false);
      });
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 3 }}>
      <Typography variant="h4" color="primary" gutterBottom align="center">
        إنشاء حساب جديد
      </Typography>
      {success && <Typography color="success.main" align="center">{success}</Typography>}
      {error && <Typography color="error.main" align="center">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="الاسم" name="first_name" value={form.first_name} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="اللقب" name="last_name" value={form.last_name} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="الولاية" name="state" value={form.state} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="البلدية" name="commune" value={form.commune} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="مكان المحل (العنوان)" name="shop_address" value={form.shop_address} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="نوع المحل" name="shop_type" value={form.shop_type} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="رقم الهاتف" name="phone" value={form.phone} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="كلمة المرور" name="password" type="password" value={form.password} onChange={handleChange} required />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? 'جاري التسجيل...' : 'إنشاء الحساب'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default RegisterPage;
