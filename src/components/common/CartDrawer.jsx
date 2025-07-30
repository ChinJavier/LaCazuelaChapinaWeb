import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  TextField,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Receipt as ReceiptIcon,
  CreditCard as PaymentIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useState, useCallback, memo } from 'react';
import { useCart } from '../../context/CartContext';

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
  }).format(price);
};

// ✅ Componente completamente memoizado para CheckoutForm
const CheckoutForm = memo(({ 
  clienteInfo, 
  formErrors, 
  itemCount, 
  total, 
  processing,
  onClienteInfoChange,
  onBackToCart,
  onProceedToCheckout 
}) => {
  console.log('CheckoutForm render'); // Para debugging
  
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={onBackToCart} size="small">
          <BackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Información del Cliente
        </Typography>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Nombre del Cliente"
          value={clienteInfo.nombre}
          onChange={(e) => onClienteInfoChange('nombre', e.target.value)}
          error={!!formErrors.nombre}
          helperText={formErrors.nombre || 'Nombre completo del cliente'}
          sx={{ mb: 2 }}
          required
          autoComplete="name"
        />
        
        <TextField
          fullWidth
          label="Teléfono"
          value={clienteInfo.telefono}
          onChange={(e) => onClienteInfoChange('telefono', e.target.value)}
          error={!!formErrors.telefono}
          helperText={formErrors.telefono || 'Opcional (ej: 2234-5678)'}
          placeholder="2234-5678"
          sx={{ mb: 2 }}
          autoComplete="tel"
        />
        
        <FormControl fullWidth error={!!formErrors.tipoPago}>
          <InputLabel>Método de Pago *</InputLabel>
          <Select
            value={clienteInfo.tipoPago}
            onChange={(e) => onClienteInfoChange('tipoPago', Number(e.target.value))}
            label="Método de Pago *"
          >
            <MenuItem value="0">Efectivo</MenuItem>
            <MenuItem value="1">Tarjeta</MenuItem>
            <MenuItem value="2">Transferencia</MenuItem>
          </Select>
          {formErrors.tipoPago && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
              {formErrors.tipoPago}
            </Typography>
          )}
        </FormControl>
      </Box>

      {/* Resumen de la venta */}
      <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
        <CardContent sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Resumen de la Venta
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Productos:</Typography>
            <Typography variant="body2">{itemCount} items</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Cliente:</Typography>
            <Typography variant="body2">
              {clienteInfo.nombre || 'Sin especificar'}
            </Typography>
          </Box>
          {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Pago:</Typography>
            <Typography variant="body2">{clienteInfo.tipoPago}</Typography>
          </Box> */}
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Total:
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {formatPrice(total)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={onBackToCart}
          fullWidth
          startIcon={<BackIcon />}
        >
          Volver
        </Button>
        <Button
          variant="contained"
          onClick={onProceedToCheckout}
          disabled={processing || !clienteInfo.nombre.trim()}
          startIcon={processing ? <CircularProgress size={20} /> : <ReceiptIcon />}
          fullWidth
        >
          {processing ? 'Procesando...' : 'Confirmar Venta'}
        </Button>
      </Box>
    </Box>
  );
});

// ✅ Componente CartItem completamente separado y memoizado
const CartItem = memo(({ item, onQuantityChange, onRemoveItem }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {item.productoNombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.varianteNombre}
          </Typography>
          {item.comboNombre && (
            <Chip
              label={`Combo: ${item.comboNombre}`}
              size="small"
              color="secondary"
              sx={{ mt: 0.5 }}
            />
          )}
        </Box>
        <IconButton
          size="small"
          onClick={() => onRemoveItem(item.id)}
          color="error"
          sx={{ ml: 1 }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      {item.descripcionPersonalizaciones && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>
          {item.descripcionPersonalizaciones}
        </Typography>
      )}

      {item.notas && (
        <Typography variant="body2" color="warning.main" sx={{ mb: 1, fontStyle: 'italic', fontSize: '0.75rem' }}>
          Nota: {item.notas}
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            onClick={() => onQuantityChange(item.id, item.cantidad - 1)}
            disabled={item.cantidad <= 1}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          
          <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center', fontWeight: 600 }}>
            {item.cantidad}
          </Typography>
          
          <IconButton
            size="small"
            onClick={() => onQuantityChange(item.id, item.cantidad + 1)}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {formatPrice(item.precioUnitario)} c/u
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {formatPrice(item.precioUnitario * item.cantidad)}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
));

// ✅ EmptyCart también memoizado
const EmptyCart = memo(() => (
  <Box sx={{ 
    flexGrow: 1, 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center',
    textAlign: 'center',
    p: 4
  }}>
    <CartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
      Tu carrito está vacío
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Agrega algunos productos para comenzar
    </Typography>
  </Box>
));

export default function CartDrawer({ open, onClose, onProceedToCheckout }) {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [clienteInfo, setClienteInfo] = useState({
    nombre: '',
    telefono: '',
    tipoPago: '0',
  });
  const [processing, setProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  console.log('CartDrawer render'); // Para debugging

  // ✅ Handlers memoizados
  const handleQuantityChange = useCallback((itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  }, [updateQuantity]);

  const handleRemoveItem = useCallback((itemId) => {
    removeItem(itemId);
  }, [removeItem]);

  const handleClearCart = useCallback(() => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      clearCart();
      setShowCheckoutForm(false);
    }
  }, [clearCart]);

  // ✅ Handler simplificado que evita recrear funciones
  const handleClienteInfoChange = useCallback((field, value) => {
  
    setClienteInfo(prev => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar errores cuando el usuario empiece a escribir
    setFormErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};

    if (!clienteInfo.nombre || clienteInfo.nombre.trim().length === 0) {
      errors.nombre = 'El nombre del cliente es obligatorio';
    } else if (clienteInfo.nombre.trim().length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (clienteInfo.telefono && clienteInfo.telefono.trim().length > 0) {
      const telefonoRegex = /^[0-9]{4}-?[0-9]{4}$/;
      if (!telefonoRegex.test(clienteInfo.telefono.replace(/\s/g, ''))) {
        errors.telefono = 'Formato de teléfono inválido (ej: 2234-5678)';
      }
    }

    if (!clienteInfo.tipoPago) {
      errors.tipoPago = 'Debe seleccionar un método de pago';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [clienteInfo]);

  const handleProceedToCheckout = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setProcessing(true);
    try {
      await onProceedToCheckout(clienteInfo);
      setClienteInfo({
        nombre: '',
        telefono: '',
        tipoPago: '0',
      });
      setShowCheckoutForm(false);
    } catch (error) {
      console.error('Error al procesar venta:', error);
      alert('Error al procesar la venta. Por favor, inténtalo de nuevo.');
    } finally {
      setProcessing(false);
    }
  }, [validateForm, onProceedToCheckout, clienteInfo]);

  const handleBackToCart = useCallback(() => {
    setShowCheckoutForm(false);
    setFormErrors({});
  }, []);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100vw',
        },
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CartIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {showCheckoutForm ? 'Finalizar Venta' : 'Carrito de Compras'}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            {/* Indicador de estado */}
            {!showCheckoutForm && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  {itemCount} {itemCount === 1 ? 'producto' : 'productos'} en el carrito
                </Typography>
              </Alert>
            )}

            {/* Contenido principal */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
              {showCheckoutForm ? (
                <CheckoutForm
                  clienteInfo={clienteInfo}
                  formErrors={formErrors}
                  itemCount={itemCount}
                  total={total}
                  processing={processing}
                  onClienteInfoChange={handleClienteInfoChange}
                  onBackToCart={handleBackToCart}
                  onProceedToCheckout={handleProceedToCheckout}
                />
              ) : (
                <>
                  {items.map((item) => (
                    <CartItem 
                      key={item.id} 
                      item={item} 
                      onQuantityChange={handleQuantityChange}
                      onRemoveItem={handleRemoveItem}
                    />
                  ))}
                  
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleClearCart}
                    sx={{ mb: 2, width: '100%' }}
                    size="small"
                  >
                    Vaciar Carrito
                  </Button>
                </>
              )}
            </Box>

            {/* Footer - Total y acciones */}
            {!showCheckoutForm && (
              <Box sx={{ mt: 'auto' }}>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total:
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {formatPrice(total)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<PaymentIcon />}
                  onClick={() => setShowCheckoutForm(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Proceder al Pago
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Drawer>
  );
}