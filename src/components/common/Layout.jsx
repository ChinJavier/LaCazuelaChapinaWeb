import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  ShoppingCart as VentasIcon,
  Category as CombosIcon,
  Inventory as InventoryIcon,
  Psychology as IAIcon,
  Store as SucursalesIcon,
  Settings as ConfigIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { useVentaMutation } from '../../hooks/useData';
import CartDrawer from './CartDrawer';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Productos', icon: <RestaurantIcon />, path: '/productos' },
  { text: 'Ventas', icon: <VentasIcon />, path: '/ventas' },
  { text: 'Combos', icon: <CombosIcon />, path: '/combos' },
  { text: 'Inventario', icon: <InventoryIcon />, path: '/inventario' },
  { text: 'IA Asistente', icon: <IAIcon />, path: '/ia' },
  { text: 'Sucursales', icon: <SucursalesIcon />, path: '/sucursales' },
  { text: 'Configuración', icon: <ConfigIcon />, path: '/configuracion' },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const { itemCount, clearCart, getCartForAPI } = useCart();
  const ventaMutation = useVentaMutation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  const handleProceedToCheckout = async (clienteInfo) => {
    try {
      const ventaData = getCartForAPI(clienteInfo, 1);
      
      console.log('Enviando venta:', ventaData);
      
      await ventaMutation.mutateAsync(ventaData);
      clearCart();
      setCartOpen(false);
      setSuccessMessage('¡Venta procesada exitosamente!');
      navigate('/ventas');
      
    } catch (error) {
      console.error('Error al procesar venta:', error);
      throw error;
    }
  };

  const drawer = (
    <Box>
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundColor: 'primary.main',
          color: 'white',
        }}
      >
        <Avatar
          sx={{
            bgcolor: 'secondary.main',
            width: 48,
            height: 48,
            fontSize: '1.5rem',
          }}
        >
          🍲
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'white' }}>
            La Cazuela
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Chapina
          </Typography>
        </Box>
      </Box>
      
      <Divider />
      
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? 'primary.main' : 'transparent',
                  color: isActive ? 'white' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive 
                      ? 'primary.dark' 
                      : 'rgba(139, 69, 19, 0.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'white' : 'primary.main',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h4" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600, color: 'primary.contrastText' }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Carrito de compras">
              <IconButton color="inherit" onClick={handleCartOpen}>
                <Badge badgeContent={itemCount} color="secondary">
                  <CartIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notificaciones">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Perfil">
              <IconButton
                color="inherit"
                onClick={handleProfileMenuOpen}
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
      >
        <MenuItem>
          <ListItemIcon>
            <AccountCircle fontSize="small" />
          </ListItemIcon>
          Mi Perfil
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>

      <CartDrawer
        open={cartOpen}
        onClose={handleCartClose}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccessMessage('')} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}