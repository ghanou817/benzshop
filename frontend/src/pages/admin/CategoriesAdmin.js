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

const CategoriesAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [sending, setSending] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    fetch('https://abdelghani.pythonanywhere.com/core/api/categories/')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch(() => {
        setError('تعذر تحميل الفئات');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    if (!name.trim()) return;
    setSending(true);
    fetch('https://abdelghani.pythonanywhere.com/core/api/categories/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSending(false);
        if (data.success) {
          setName('');
          fetchCategories();
        }
      })
      .catch(() => setSending(false));
  };

  const handleDelete = (id) => {
    fetch(`https://abdelghani.pythonanywhere.com/core/api/categories/${id}/`, { method: 'DELETE' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) fetchCategories();
      });
  };

  if (loading) return <Typography align="center">جاري التحميل...</Typography>;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <>
      <Typography variant="h5" gutterBottom align="right">كل الفئات</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="اسم الفئة"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleAdd} disabled={sending || !name.trim()}>
          إضافة
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">#</TableCell>
              <TableCell align="right">الاسم</TableCell>
              <TableCell align="right">إجراء</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat, idx) => (
              <TableRow key={cat.id}>
                <TableCell align="right">{idx + 1}</TableCell>
                <TableCell align="right">{cat.name}</TableCell>
                <TableCell align="right">
                  <Button size="small" color="error" onClick={() => handleDelete(cat.id)}>حذف</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CategoriesAdmin;
