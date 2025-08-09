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
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const NotificationsAdmin = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const fetchNotifications = () => {
    setLoading(true);
    fetch('https://abdelghani.pythonanywhere.com/core/api/notifications/')
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data.notifications || []);
        setLoading(false);
      })
      .catch(() => {
        setError('تعذر تحميل الإشعارات');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;
    setSending(true);
    fetch('https://abdelghani.pythonanywhere.com/core/api/notifications/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSending(false);
        if (data.success) {
          setMessage('');
          fetchNotifications();
        }
      })
      .catch(() => setSending(false));
  };

  const handleDelete = (id) => {
    fetch(`https://abdelghani.pythonanywhere.com/core/api/notifications/${id}/`, { method: 'DELETE' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) fetchNotifications();
      });
  };

  if (loading) return <Typography align="center">جاري التحميل...</Typography>;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <>
      <Typography variant="h5" gutterBottom align="right">كل الإشعارات</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="نص الإشعار"
          value={message}
          onChange={e => setMessage(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleSend} disabled={sending || !message.trim()}>
          إرسال
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">#</TableCell>
              <TableCell align="right">النص</TableCell>
              <TableCell align="right">تاريخ الإرسال</TableCell>
              <TableCell align="right">إجراء</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((notif, idx) => (
              <TableRow key={notif.id}>
                <TableCell align="right">{idx + 1}</TableCell>
                <TableCell align="right">{notif.message}</TableCell>
                <TableCell align="right">{notif.created_at}</TableCell>
                <TableCell align="right">
                  <Button size="small" color="error" onClick={() => handleDelete(notif.id)}>حذف</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default NotificationsAdmin;
