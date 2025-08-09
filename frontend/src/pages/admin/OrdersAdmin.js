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

const statusLabels = {
  pending: 'قيد الانتظار',
  confirmed: 'تم التأكيد',
  delivered: 'تم التسليم',
  cancelled: 'ملغى',
};

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    fetch('https://abdelghani.pythonanywhere.com/core/api/orders/')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      })
      .catch(() => {
        setError('تعذر تحميل الطلبات');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = (id, newStatus) => {
    fetch(`https://abdelghani.pythonanywhere.com/core/api/orders/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) fetchOrders();
      });
  };

  if (loading) return <Typography align="center">جاري التحميل...</Typography>;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <>
      <Typography variant="h5" gutterBottom align="right">كل الطلبات</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">#</TableCell>
              <TableCell align="right">المستخدم</TableCell>
              <TableCell align="right">الحالة</TableCell>
              <TableCell align="right">تاريخ الإنشاء</TableCell>
              <TableCell align="right">إجراء</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, idx) => (
              <TableRow key={order.id}>
                <TableCell align="right">{idx + 1}</TableCell>
                <TableCell align="right">{order.user_name}</TableCell>
                <TableCell align="right">{statusLabels[order.status] || order.status}</TableCell>
                <TableCell align="right">{order.created_at}</TableCell>
                <TableCell align="right">
                  {order.status === 'pending' && (
                    <Button size="small" color="primary" onClick={() => handleStatusChange(order.id, 'confirmed')}>تأكيد</Button>
                  )}
                  {order.status === 'confirmed' && (
                    <Button size="small" color="success" onClick={() => handleStatusChange(order.id, 'delivered')}>تسليم</Button>
                  )}
                  {order.status !== 'cancelled' && (
                    <Button size="small" color="error" onClick={() => handleStatusChange(order.id, 'cancelled')}>إلغاء</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default OrdersAdmin;
