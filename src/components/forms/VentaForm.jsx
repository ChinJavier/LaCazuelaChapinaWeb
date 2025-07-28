import { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Divider,
  Chip,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useTamales, useBebidas, useCombos } from '../../hooks/useData';

const TIPOS_CLIENTE = [
  { value: 'general', label: 'Cliente General' },
  { value: 'frecuente', label: 'Cliente Frecuente' },
  { value: 'mayorista', label: 'Mayorista' },
];

const METODOS_PAGO = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'mixto', label: 'Mixto' },
];

export default function VentaForm({ onClose, onSubmit }) {
  const [cliente, setCliente] = useState({
    nombre: '',
    telefono: '',
    tipo: 'general',
  });
  
  const [productosVenta, setProductosVenta] = useState([]);
  const [combosVenta, setCombosVenta] = useState([]);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [descuento, setDescuento] = useState(0);
  const [notas, setNotas] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Datos de productos disponibles
  const { data: tamales } = useTamales();
  const { data: bebidas } = useBebidas();
  const { data: combos } = useCombos();

  // Productos combinados para autocompletado
  const todosProductos = [
    ...(tamales?.map(t => ({ ...t, tipo: 'tamal' })) || []),
    ...(bebidas?.map(b => ({ ...b, tipo: 'bebida' })) || []),
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(price);
  };

  const agregarProducto = (producto, cantidad = 1, tipoVenta = 'unidad') => {
    const existeIndex = productosVenta.findIndex(
      p => p.id === producto.id && p.tipo === producto.tipo && p.tipoVenta === tipoVenta
    );

    if (existeIndex >= 0) {
      // Si ya existe, actualizar cantidad
      const nuevosProductos = [...productosVenta];
      nuevosProductos[existeIndex].cantidad += cantidad;
      setProductosVenta(nuevosProductos);
    } else {
      // Agregar nuevo producto
      let precioUnitario;
      if (producto.tipo === 'tamal') {
        switch (tipoVenta) {
          case 'unidad':
            precioUnitario = producto.precioUnidad;
            break;
          case 'media_docena':
            precioUnitario = producto.precioMediaDocena / 6;
            break;
          case 'docena':
            precioUnitario = producto.precioDocena / 12;
            break;
          default:
            precioUnitario = producto.precioUnidad;
        }
      } else {
        precioUnitario = tipoVenta === 'vaso' ? producto.precioVaso : producto.precioJarro;
      }

      const nuevoProducto = {
        ...producto,
        cantidad,
        tipoVenta,
        precioUnitario,
        subtotal: precioUnitario * cantidad,
      };

      setProductosVenta([...productosVenta, nuevoProducto]);
    }
  };

  const actualizarCantidadProducto = (index, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarProducto(index);
      return;
    }

    const nuevosProductos = [...productosVenta];
    nuevosProductos[index].cantidad = nuevaCantidad;
    nuevosProductos[index].subtotal = nuevosProductos[index].precioUnitario * nuevaCantidad;
    setProductosVenta(nuevosProductos);
  };

  const eliminarProducto = (index) => {
    const nuevosProductos = productosVenta.filter((_, i) => i !== index);
    setProductosVenta(nuevosProductos);
  };

  const agregarCombo = (combo, cantidad = 1) => {
    const existeIndex = combosVenta.findIndex(c => c.id === combo.id);

    if (existeIndex >= 0) {
      const nuevosCombos = [...combosVenta];
      nuevosCombos[existeIndex].cantidad += cantidad;
      nuevosCombos[existeIndex].subtotal = nuevosCombos[existeIndex].precio * nuevosCombos[existeIndex].cantidad;
      setCombosVenta(nuevosCombos);
    } else {
      const nuevoCombo = {
        ...combo,
        cantidad,
        subtotal: combo.precio * cantidad,
      };
      setCombosVenta([...combosVenta, nuevoCombo]);
    }
  };

  const eliminarCombo = (index) => {
    const nuevosCombos = combosVenta.filter((_, i) => i !== index);
    setCombosVenta(nuevosCombos);
  };

  const calcularTotales = () => {
    const subtotalProductos = productosVenta.reduce((total, producto) => total + producto.subtotal, 0);
    const subtotalCombos = combosVenta.reduce((total, combo) => total + combo.subtotal, 0);
    const subtotal = subtotalProductos + subtotalCombos;
    const montoDescuento = (subtotal * descuento) / 100;
    const total = subtotal - montoDescuento;

    return {
      subtotal,
      descuento: montoDescuento,
      total,
    };
  };

  const validarFormulario = () => {
    const newErrors = {};

    if (productosVenta.length === 0 && combosVenta.length === 0) {
      newErrors.productos = 'Debe agregar al menos un producto o combo';
    }

    if (!cliente.nombre.trim()) {
      newErrors.clienteNombre = 'El nombre del cliente es requerido';
    }

    if (descuento < 0 || descuento > 100) {
      newErrors.descuento = 'El descuento debe estar entre 0% y 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      const totales = calcularTotales();
      const ventaData = {
        cliente,
        productos: productosVenta,
        combos: combosVenta,
        metodoPago,
        subtotal: totales.subtotal,
        descuento: totales.descuento,
        total: totales.total,
        notas,
        fecha: new Date().toISOString(),
      };

      await onSubmit(ventaData);
    } catch (error) {
      console.error('Error al procesar venta:', error);
    } finally {
      setLoading(false);
    }
  };

  const totales = calcularTotales();

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CartIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Nueva Venta
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ minHeight: '70vh', p: 0 }}>
        <Grid container sx={{ height: '100%' }}>
          {/* Panel Izquierdo - Agregar Productos */}
          <Grid item xs={12} md={6} sx={{ p: 3, borderRight: { md: 1 }, borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Agregar Productos
            </Typography>

            {/* Selector de Productos */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Productos Individuales
                </Typography>
                
                <Autocomplete
                  options={todosProductos}
                  getOptionLabel={(option) => `${option.nombre} (${option.tipo})`}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {option.nombre}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.tipo === 'tamal' 
                            ? `Unidad: ${formatPrice(option.precioUnidad)}`
                            : `Vaso: ${formatPrice(option.precioVaso)} | Jarro: ${formatPrice(option.precioJarro)}`
                          }
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  onChange={(event, producto) => {
                    if (producto) {
                      agregarProducto(producto);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Buscar producto" size="small" />
                  )}
                />

                {/* Botones rápidos para tamales */}
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tamales?.slice(0, 3).map((tamal) => (
                    <Chip
                      key={tamal.id}
                      label={tamal.nombre}
                      onClick={() => agregarProducto(tamal)}
                      clickable
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Selector de Combos */}
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Combos Especiales
                </Typography>
                
                {combos?.map((combo) => (
                  <Box key={combo.id} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {combo.nombre}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {combo.descripcion}
                        </Typography>
                        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                          {formatPrice(combo.precio)}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => agregarCombo(combo)}
                      >
                        Agregar
                      </Button>
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Panel Derecho - Carrito y Cliente */}
          <Grid item xs={12} md={6} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Detalles de la Venta
            </Typography>

            {/* Información del Cliente */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Cliente
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nombre del Cliente"
                      value={cliente.nombre}
                      onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })}
                      error={!!errors.clienteNombre}
                      helperText={errors.clienteNombre}
                      size="small"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      value={cliente.telefono}
                      onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Tipo de Cliente</InputLabel>
                      <Select
                        value={cliente.tipo}
                        onChange={(e) => setCliente({ ...cliente, tipo: e.target.value })}
                        label="Tipo de Cliente"
                      >
                        {TIPOS_CLIENTE.map((tipo) => (
                          <MenuItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Carrito de Compras */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Carrito de Compras
                </Typography>

                {errors.productos && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.productos}
                  </Alert>
                )}

                {/* Productos */}
                {productosVenta.map((producto, index) => (
                  <Box key={`${producto.id}-${producto.tipo}-${producto.tipoVenta}-${index}`} 
                       sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {producto.nombre}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {producto.tipoVenta} - {formatPrice(producto.precioUnitario)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => actualizarCantidadProducto(index, producto.cantidad - 1)}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      
                      <Typography variant="body2" sx={{ minWidth: 24, textAlign: 'center' }}>
                        {producto.cantidad}
                      </Typography>
                      
                      <IconButton 
                        size="small" 
                        onClick={() => actualizarCantidadProducto(index, producto.cantidad + 1)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 60, textAlign: 'right' }}>
                      {formatPrice(producto.subtotal)}
                    </Typography>

                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => eliminarProducto(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}

                {/* Combos */}
                {combosVenta.map((combo, index) => (
                  <Box key={`combo-${combo.id}-${index}`} 
                       sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, p: 1, bgcolor: 'primary.light', borderRadius: 1, color: 'white' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {combo.nombre}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Combo - {formatPrice(combo.precio)}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2">
                      x{combo.cantidad}
                    </Typography>

                    <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 60, textAlign: 'right' }}>
                      {formatPrice(combo.subtotal)}
                    </Typography>

                    <IconButton 
                      size="small" 
                      sx={{ color: 'white' }}
                      onClick={() => eliminarCombo(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}

                {productosVenta.length === 0 && combosVenta.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No hay productos en el carrito
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Totales y Pago */}
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Resumen de Pago
                </Typography>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Descuento (%)"
                      type="number"
                      value={descuento}
                      onChange={(e) => setDescuento(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                      inputProps={{ min: 0, max: 100, step: 0.1 }}
                      size="small"
                      error={!!errors.descuento}
                      helperText={errors.descuento}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Método de Pago</InputLabel>
                      <Select
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        label="Método de Pago"
                      >
                        {METODOS_PAGO.map((metodo) => (
                          <MenuItem key={metodo.value} value={metodo.value}>
                            {metodo.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Subtotal:</Typography>
                  <Typography variant="body2">{formatPrice(totales.subtotal)}</Typography>
                </Box>

                {totales.descuento > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="error">Descuento ({descuento}%):</Typography>
                    <Typography variant="body2" color="error">-{formatPrice(totales.descuento)}</Typography>
                  </Box>
                )}

                <Divider sx={{ my: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Total:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {formatPrice(totales.total)}
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  label="Notas adicionales"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  multiline
                  rows={2}
                  size="small"
                  placeholder="Comentarios especiales, instrucciones de entrega, etc."
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          disabled={loading}
          size="large"
        >
          Cancelar
        </Button>
        
        <Button
          type="submit"
          variant="contained"
          startIcon={<ReceiptIcon />}
          disabled={loading || (productosVenta.length === 0 && combosVenta.length === 0)}
          size="large"
          sx={{ minWidth: 140 }}
        >
          {loading ? 'Procesando...' : `Procesar Venta`}
        </Button>
      </DialogActions>
    </form>
  );
}