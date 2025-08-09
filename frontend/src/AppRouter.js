import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AboutContactPage from './pages/AboutContactPage';
import ProductDetailPage from './pages/ProductDetailPage';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const HomePage = () => (
  <Box dir="rtl" sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 4 }}>
    <Typography variant="h3" color="primary" gutterBottom align="center">
      مرحبًا بكم في BenzShop
    </Typography>
    <Typography variant="h5" color="secondary" align="center">
      منصة بيع بالجملة للحلويات والمواد الغذائية
    </Typography>
  </Box>
);

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about" element={<AboutContactPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
