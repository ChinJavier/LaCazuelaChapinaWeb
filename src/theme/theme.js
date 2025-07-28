// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

// Paleta de colores inspirada en Guatemala y tamales
const cazuelaColors = {
  // Colores principales inspirados en la bandera guatemalteca y tamales
  primary: {
    50: '#f3f8ff',
    100: '#e6f0ff',
    200: '#b8d9ff',
    300: '#8ac2ff',
    400: '#2e7dd6',
    500: '#1976d2', // Azul Guatemala (bandera)
    600: '#1565c0',
    700: '#0d47a1',
    800: '#083593',
    900: '#042a75',
  },
  
  // Verde Guatemala (bandera) para acentos
  secondary: {
    50: '#f1f8e9',
    100: '#dcedc8',
    200: '#c5e1a5',
    300: '#aed581',
    400: '#9ccc65',
    500: '#8bc34a', // Verde Guatemala
    600: '#7cb342',
    700: '#689f38',
    800: '#558b2f',
    900: '#33691e',
  },
  
  // Colores de tamales (dorados y tierra)
  tamal: {
    masa: '#f4e4a7', // Color masa de maíz
    hojaPlantano: '#4a6741', // Verde hoja de plátano
    recadoRojo: '#d32f2f', // Rojo del recado
    chipilín: '#66bb6a', // Verde chipilín
    cacao: '#5d4037', // Marrón cacao
    atol: '#fff8e1', // Crema del atol
  },
  
  // Grises neutros
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  }
};

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: cazuelaColors.primary[500],
      light: cazuelaColors.primary[300],
      dark: cazuelaColors.primary[700],
      contrastText: '#ffffff',
    },
    secondary: {
      main: cazuelaColors.secondary[500],
      light: cazuelaColors.secondary[300],
      dark: cazuelaColors.secondary[700],
      contrastText: '#ffffff',
    },
    error: {
      main: cazuelaColors.tamal.recadoRojo,
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: cazuelaColors.primary[400],
    },
    success: {
      main: cazuelaColors.secondary[600],
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    // Colores personalizados para La Cazuela Chapina
    tamal: cazuelaColors.tamal,
    neutral: cazuelaColors.neutral,
  },
  
  typography: {
    fontFamily: [
      'Roboto',
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: cazuelaColors.primary[800],
    },
    
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: cazuelaColors.primary[700],
    },
    
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: cazuelaColors.primary[700],
    },
    
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
      color: cazuelaColors.primary[600],
    },
    
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: cazuelaColors.neutral[700],
    },
    
    button: {
      fontWeight: 600,
      textTransform: 'none', // No uppercase en botones
    },
  },
  
  shape: {
    borderRadius: 12, // Bordes más redondeados para look moderno
  },
  
  shadows: [
    'none',
    '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
    '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)',
    '0px 10px 20px rgba(0, 0, 0, 0.19), 0px 6px 6px rgba(0, 0, 0, 0.23)',
    '0px 14px 28px rgba(0, 0, 0, 0.25), 0px 10px 10px rgba(0, 0, 0, 0.22)',
    // ... más sombras según sea necesario
  ],
  
  components: {
    // Customización de componentes MUI
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '0.95rem',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.24)',
          },
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: cazuelaColors.primary[600],
          backgroundImage: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        },
      },
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
        },
      },
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
});

// Extender el tema con colores personalizados
theme.palette.gradient = {
  primary: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  secondary: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
  tamal: `linear-gradient(135deg, ${cazuelaColors.tamal.masa} 0%, ${cazuelaColors.tamal.cacao} 100%)`,
};

export default theme;