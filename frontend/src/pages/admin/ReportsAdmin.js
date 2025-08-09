import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportsAdmin = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://abdelghani.pythonanywhere.com/core/api/reports/')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Typography align="center">جاري تحميل التقارير...</Typography>;
  if (!stats) return <Typography align="center">لا توجد بيانات تقارير متاحة حالياً.</Typography>;

  return (
    <>
      <Typography variant="h5" gutterBottom align="right">التقارير والإحصائيات</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">إجمالي المبيعات</Typography>
            <Typography variant="h4" color="primary.main">{stats.total_sales} دج</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">عدد الطلبات</Typography>
            <Typography variant="h4" color="secondary.main">{stats.orders_count}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6">عدد العملاء</Typography>
            <Typography variant="h4" color="success.main">{stats.users_count}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>المبيعات الشهرية</Typography>
            <Bar
              data={{
                labels: stats.monthly_sales.labels,
                datasets: [
                  {
                    label: 'المبيعات (دج)',
                    data: stats.monthly_sales.data,
                    backgroundColor: 'rgba(63, 81, 181, 0.6)',
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false },
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ReportsAdmin;
