import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Navbar = () => {
  return (
    <AppBar position="static" color="primary" sx={{ direction: 'rtl' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'right', fontFamily: 'Cairo, Tahoma, Arial, sans-serif' }}>
          BenzShop
        </Typography>
        <Box>
          <Button color="inherit" href="/">الرئيسية</Button>
          <Button color="inherit" href="/products">المنتجات</Button>
          <Button color="inherit" href="/cart">السلة</Button>
          <Button color="inherit" href="/login">دخول</Button>
          <Button color="inherit" href="/register">تسجيل</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
