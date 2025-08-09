import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

const AboutContactPage = () => {
  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom align="center">
          من نحن
        </Typography>
        <Typography variant="body1" align="center">
          BenzShop هو متجر إلكتروني متخصص في بيع الحلويات والمواد الغذائية بالجملة لأصحاب المحلات مع خدمة توصيل مجانية.
        </Typography>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" color="secondary" gutterBottom align="center">
          اتصل بنا
        </Typography>
        <form>
          <TextField fullWidth label="اسمك" name="name" sx={{ mb: 2 }} />
          <TextField fullWidth label="بريدك الإلكتروني" name="email" sx={{ mb: 2 }} />
          <TextField fullWidth label="رسالتك" name="message" multiline rows={4} sx={{ mb: 2 }} />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            إرسال
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AboutContactPage;
