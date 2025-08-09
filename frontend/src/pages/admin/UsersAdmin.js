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

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    fetch('https://abdelghani.pythonanywhere.com/core/api/users/')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => {
        setError('تعذر تحميل المستخدمين');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('هل أنت متأكد من حذف المستخدم؟')) return;
    fetch(`https://abdelghani.pythonanywhere.com/core/api/users/${id}/`, { method: 'DELETE' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) fetchUsers();
      });
  };

  if (loading) return <Typography align="center">جاري التحميل...</Typography>;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <>
      <Typography variant="h5" gutterBottom align="right">كل المستخدمين</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">#</TableCell>
              <TableCell align="right">الاسم</TableCell>
              <TableCell align="right">رقم الهاتف</TableCell>
              <TableCell align="right">الولاية</TableCell>
              <TableCell align="right">البلدية</TableCell>
              <TableCell align="right">مكان المحل</TableCell>
              <TableCell align="right">دور</TableCell>
              <TableCell align="right">إجراء</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, idx) => (
              <TableRow key={user.id}>
                <TableCell align="right">{idx + 1}</TableCell>
                <TableCell align="right">{user.full_name}</TableCell>
                <TableCell align="right">{user.phone}</TableCell>
                <TableCell align="right">{user.wilaya}</TableCell>
                <TableCell align="right">{user.commune}</TableCell>
                <TableCell align="right">{user.shop_address}</TableCell>
                <TableCell align="right">{user.is_staff ? 'مدير' : 'عميل'}</TableCell>
                <TableCell align="right">
                  {!user.is_staff && (
                    <Button size="small" color="error" onClick={() => handleDelete(user.id)}>حذف</Button>
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

export default UsersAdmin;
