import { createTheme } from '@mui/material/styles';

const paletteGrey = {
  50: '#f7f7f7',
  100: '#e0e0e0',
  200: '#c7c7c7',
  300: '#aeaeae',
  400: '#949494',
  500: '#7b7b7b',
  600: '#616161',
  700: '#484848',
  800: '#2f2f2f',
  900: '#161616'
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: paletteGrey[800]
    },
    secondary: {
      main: paletteGrey[500]
    },
    background: {
      default: paletteGrey[50],
      paper: '#ffffff'
    },
    text: {
      primary: paletteGrey[900],
      secondary: paletteGrey[500]
    }
  },
  shape: {
    borderRadius: 12
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          color: paletteGrey[900],
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#ffffff'
        }
      }
    }
  }
});

export default theme;
