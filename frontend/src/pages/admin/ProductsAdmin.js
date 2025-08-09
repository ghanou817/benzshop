import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ProductForm from './ProductForm';

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    fetch('https://abdelghani.pythonanywhere.com/core/api/products/')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => {
        setError('تعذر تحميل المنتجات');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = (form, stopLoading) => {
    fetch('https://abdelghani.pythonanywhere.com/core/api/products/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        stopLoading();
        if (data.success) {
          setOpenAdd(false);
          fetchProducts();
        }
      })
      .catch(() => stopLoading());
  };

  const handleEdit = (product) => {
    setEditProduct(product);
  };

  const handleEditSubmit = (form, stopLoading) => {
    fetch(`https://abdelghani.pythonanywhere.com/core/api/products/${editProduct.id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        stopLoading();
        if (data.success) {
          setEditProduct(null);
          fetchProducts();
        }
      })
      .catch(() => stopLoading());
  };

  const handleDelete = (id) => {
    if (!window.confirm('هل أنت متأكد من حذف المنتج؟')) return;
    fetch(`https://abdelghani.pythonanywhere.com/core/api/products/${id}/`, { method: 'DELETE' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) fetchProducts();
      });
  };

  if (loading) return <Typography align="center">جاري التحميل...</Typography>;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <>
      <Typography variant="h5" gutterBottom align="right">كل المنتجات</Typography>
      <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => setOpenAdd(true)}>
        إضافة منتج جديد
      </Button>
      <ProductForm open={openAdd} onClose={() => setOpenAdd(false)} onSubmit={handleAddProduct} />
      {editProduct && (
        <ProductForm open={!!editProduct} onClose={() => setEditProduct(null)} onSubmit={handleEditSubmit} initial={editProduct} />
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">#</TableCell>
              <TableCell align="right">الاسم</TableCell>
              <TableCell align="right">الفئة</TableCell>
              <TableCell align="right">السعر</TableCell>
              <TableCell align="right">الكمية</TableCell>
              <TableCell align="right">الحالة</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, idx) => (
              <TableRow key={product.id}>
                <TableCell align="right">{idx + 1}</TableCell>
                <TableCell align="right">{product.name}</TableCell>
                <TableCell align="right">{product.category}</TableCell>
                <TableCell align="right">{product.price} دج</TableCell>
                <TableCell align="right">{product.stock_qty}</TableCell>
                <TableCell align="right" style={{ color: product.is_published ? 'green' : 'red' }}>
                  {product.is_published ? 'منشور' : 'غير منشور'}
                </TableCell>
                <TableCell align="right">
                  <Button size="small" color="primary" onClick={() => handleEdit(product)}>تعديل</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(product.id)}>حذف</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProductsAdmin;
