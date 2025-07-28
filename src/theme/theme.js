import { createTheme } from '@mui/material/styles';

// Paleta de colores inspirada en la cultura guatemalteca
const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513', // Terracota/Barro - color principal de cazuelas
      light: '#A0522D',
      dark: '#654321',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#228B22', // Verde jade guatemalteco
      light: '#32CD32',
      dark: '#006400',
      contrastText: '#ffffff',
    },
    background: {
      default: '#FFF8DC', // Crema suave como masa de maíz
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2E2E2E',
      secondary: '#666666',
    },
    warning: {
      main: '#FF8C00', // Naranja como chile pimiento
      light: '#FFA500',
      dark: '#FF6347',
    },
    info: {
      main: '#4682B4', // Azul cobalto maya
      light: '#87CEEB',
      dark: '#2F4F4F',
    },
    success: {
      main: '#32CD32',
      light: '#90EE90',
      dark: '#228B22',
    },
    error: {
      main: '#DC143C',
      light: '#FF6B6B',
      dark: '#B22222',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#2E2E2E',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: '#2E2E2E',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: '#2E2E2E',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#2E2E2E',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#2E2E2E',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#2E2E2E',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
      color: '#666666',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#8B4513',
          boxShadow: '0 2px 8px rgba(139, 69, 19, 0.15)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(139, 69, 19, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 20px',
        },
        contained: {
          boxShadow: '0 2px 8px rgba(139, 69, 19, 0.2)',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(139, 69, 19, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#8B4513',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
});

export default theme;