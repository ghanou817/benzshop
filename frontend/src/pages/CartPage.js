import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import { useEffect, useState } from 'react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://abdelghani.pythonanywhere.com/core/api/cart/')
      .then((res) => {
        if (!res.ok) throw new Error('خطأ في جلب السلة');
        return res.json();
      })
      .then((data) => {
        setCartItems(data.items || []);
        setLoading(false);
      })
      .catch(() => {
        setError('تعذر تحميل السلة');
        setLoading(false);
      });
  }, []);

  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderError, setOrderError] = useState(null);

  const handleDelete = (id) => {
    fetch(`https://abdelghani.pythonanywhere.com/core/api/cart/${id}/`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) throw new Error();
        setCartItems(cartItems.filter((item) => item.id !== id));
      })
      .catch(() => setError('تعذر حذف المنتج من السلة'));
  };

  const handleConfirmOrder = () => {
    setLoading(true);
    setOrderSuccess(null);
    setOrderError(null);
    fetch('https://abdelghani.pythonanywhere.com/core/api/orders/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrderSuccess('تم تأكيد الطلب بنجاح!');
          setCartItems([]);
        } else {
          setOrderError(data.error || 'حدث خطأ أثناء تأكيد الطلب');
        }
        setLoading(false);
      })
      .catch(() => {
        setOrderError('تعذر الاتصال بالخادم');
        setLoading(false);
      });
  };

  const total = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" color="primary" gutterBottom align="center">
        سلة المشتريات
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">المنتج</TableCell>
              <TableCell align="right">الكمية</TableCell>
              <TableCell align="right">السعر للوحدة</TableCell>
              <TableCell align="right">الإجمالي</TableCell>
              <TableCell align="right">إجراء</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell align="right">{item.name}</TableCell>
                <TableCell align="right">{item.qty}</TableCell>
                <TableCell align="right">{item.price} دج</TableCell>
                <TableCell align="right">{item.qty * item.price} دج</TableCell>
                <TableCell align="right">
                  <Button color="error" size="small" onClick={() => handleDelete(item.id)}>حذف</Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} align="left"><b>الإجمالي الكلي</b></TableCell>
              <TableCell align="right"><b>{total} دج</b></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button variant="contained" color="primary" onClick={handleConfirmOrder} disabled={loading || cartItems.length === 0}>
          {loading ? 'جاري التأكيد...' : 'تأكيد الطلب'}
        </Button>
        {orderSuccess && <Typography color="success.main" align="center" sx={{ mt: 2 }}>{orderSuccess}</Typography>}
        {orderError && <Typography color="error.main" align="center" sx={{ mt: 2 }}>{orderError}</Typography>}
      </Box>
    </Box>
  );
};

export default CartPage;
