import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

const ProductForm = ({ open, onClose, onSubmit, initial }) => {
  const [form, setForm] = useState(initial || {
    name: '',
    category: '',
    price: '',
    stock_qty: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    onSubmit(form, () => setLoading(false));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="اسم المنتج" name="name" value={form.name} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="الفئة" name="category" value={form.category} onChange={handleChange} required />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="السعر" name="price" value={form.price} onChange={handleChange} required type="number" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="الكمية" name="stock_qty" value={form.stock_qty} onChange={handleChange} required type="number" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="الوصف" name="description" value={form.description} onChange={handleChange} multiline rows={2} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>إلغاء</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'جاري الحفظ...' : (initial ? 'تعديل' : 'إضافة')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;
