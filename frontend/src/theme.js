import { createTheme } from '@mui/material/styles';
import { arSD } from '@mui/material/locale';

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Cairo, Tahoma, Arial, sans-serif',
  },
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
    background: { default: '#f7f7fa' },
  },
}, arSD);

export default theme;
