import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ProductsAdmin from './ProductsAdmin';
import OrdersAdmin from './OrdersAdmin';
import UsersAdmin from './UsersAdmin';
import NotificationsAdmin from './NotificationsAdmin';
import ReportsAdmin from './ReportsAdmin';
import CategoriesAdmin from './CategoriesAdmin';

const sections = [
  { key: 'products', label: 'إدارة المنتجات' },
  { key: 'categories', label: 'إدارة الفئات' },
  { key: 'orders', label: 'الطلبات' },
  { key: 'users', label: 'المستخدمون' },
  { key: 'notifications', label: 'الإشعارات' },
  { key: 'reports', label: 'التقارير' },
];

const AdminDashboard = () => {
  const [selected, setSelected] = useState('products');

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Drawer variant="permanent" anchor="right" sx={{ width: 220, flexShrink: 0, '& .MuiDrawer-paper': { width: 220, boxSizing: 'border-box', bgcolor: '#f5f5f5' } }}>
        <Typography variant="h6" align="center" sx={{ my: 2, color: 'primary.main' }}>لوحة الإدارة</Typography>
        <List>
          {sections.map((section) => (
            <ListItem key={section.key} disablePadding>
              <ListItemButton selected={selected === section.key} onClick={() => setSelected(section.key)}>
                <ListItemText primary={section.label} sx={{ textAlign: 'right' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 4 }}>
        {selected === 'products' && <ProductsAdmin />}
        {selected === 'orders' && <OrdersAdmin />}
        {selected === 'users' && <UsersAdmin />}
        {selected === 'notifications' && <NotificationsAdmin />}
        {selected === 'reports' && <ReportsAdmin />}
        {selected === 'categories' && <CategoriesAdmin />}
        {/* سيتم إضافة باقي الأقسام لاحقاً */}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
