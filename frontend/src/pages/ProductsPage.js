import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://abdelghani.pythonanywhere.com/core/api/products/')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <Typography align="center">جاري التحميل...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" color="primary" gutterBottom align="center">
        المنتجات المتوفرة
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="150"
                image={product.images && product.images.length > 0 ? `/media/${product.images[0]}` : 'https://via.placeholder.com/200x150'}
                alt={product.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">الفئات: {product.category}</Typography>
                <Typography variant="body2" color="text.secondary">النكهات: {product.flavors && product.flavors.length > 0 ? product.flavors.join(', ') : 'بدون نكهات'}</Typography>
                <Typography variant="body2" color="text.secondary">السعر: {product.price} دج</Typography>
                <Typography variant="body2" color={product.stock_qty > 0 ? 'success.main' : 'error.main'}>
                  {product.stock_qty > 0 ? 'متوفر' : 'غير متوفر'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" disabled={product.stock_qty === 0}>أضف إلى السلة</Button>
                <Button size="small" color="primary" href={`/products/${product.id}`}>تفاصيل المنتج</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductsPage;
