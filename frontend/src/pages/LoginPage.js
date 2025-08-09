import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { useState } from 'react';

const LoginPage = () => {
  const [form, setForm] = useState({ phone: '', password: '' });
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
    fetch('https://abdelghani.pythonanywhere.com/core/api/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSuccess('تم تسجيل الدخول بنجاح!');
        } else {
          setError(data.error || 'بيانات الدخول غير صحيحة');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('تعذر الاتصال بالخادم');
        setLoading(false);
      });
  };

  return (
    <Box sx={{ maxWidth: 350, mx: 'auto', p: 3 }}>
      <Typography variant="h4" color="primary" gutterBottom align="center">
        تسجيل الدخول
      </Typography>
      {success && <Typography color="success.main" align="center">{success}</Typography>}
      {error && <Typography color="error.main" align="center">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="رقم الهاتف" name="phone" value={form.phone} onChange={handleChange} required sx={{ mb: 2 }} />
        <TextField fullWidth label="كلمة المرور" name="password" type="password" value={form.password} onChange={handleChange} required sx={{ mb: 2 }} />
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          {loading ? 'جاري الدخول...' : 'دخول'}
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;
