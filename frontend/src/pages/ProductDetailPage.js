import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://abdelghani.pythonanywhere.com/core/api/products/${id}/`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Typography align="center">جاري التحميل...</Typography>;
  if (!product) return <Typography align="center" color="error">المنتج غير موجود</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          {product.images && product.images.length > 0 ? (
            <Card>
              <CardMedia
                component="img"
                height="350"
                image={`/media/${product.images[0]}`}
                alt={product.name}
              />
            </Card>
          ) : (
            <Box sx={{ height: 350, bgcolor: '#eee' }} />
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" color="primary" gutterBottom>{product.name}</Typography>
          <Typography variant="body1" gutterBottom>{product.description}</Typography>
          <Typography variant="body2" color="secondary">الفئة: {product.category}</Typography>
          <Typography variant="body2">النكهات: {product.flavors && product.flavors.length > 0 ? product.flavors.join(', ') : 'بدون نكهات'}</Typography>
          <Typography variant="body2">السعر: {product.price} دج</Typography>
          <Typography variant="body2" color={product.stock_qty > 0 ? 'success.main' : 'error.main'}>
            {product.stock_qty > 0 ? 'متوفر' : 'غير متوفر'}
          </Typography>
          <Button variant="contained" color="primary" size="large" sx={{ mt: 2 }} disabled={product.stock_qty === 0}>
            أضف إلى السلة
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductDetailPage;
