import { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  Box,
  Alert,
  Chip,
} from '@mui/material';
import {
  Save as SaveIcon,
  Close as CloseIcon,
  TrendingUp as EntradaIcon,
  TrendingDown as SalidaIcon,
  Warning as MermaIcon,
} from '@mui/icons-material';

const MOTIVOS_ENTRADA = [
  { value: 'compra', label: 'Compra a Proveedor' },
  { value: 'devolucion', label: 'Devolución de Cliente' },
  { value: 'ajuste_positivo', label: 'Ajuste de Inventario (+)' },
  { value: 'produccion', label: 'Producción Interna' },
  { value: 'otros', label: 'Otros' },
];

const MOTIVOS_SALIDA = [
  { value: 'venta', label: 'Venta a Cliente' },
  { value: 'produccion', label: 'Uso en Producción' },
  { value: 'devolucion_proveedor', label: 'Devolución a Proveedor' },
  { value: 'ajuste_negativo', label: 'Ajuste de Inventario (-)' },
  { value: 'otros', label: 'Otros' },
];

const MOTIVOS_MERMA = [
  { value: 'vencimiento', label: 'Producto Vencido' },
  { value: 'dano_fisico', label: 'Daño Físico' },
  { value: 'contaminacion', label: 'Contaminación' },
  { value: 'deterioro', label: 'Deterioro Natural' },
  { value: 'robo', label: 'Robo o Pérdida' },
  { value: 'otros', label: 'Otros' },
];

const getMovimientoConfig = (tipo) => {
  switch (tipo) {
    case 'entrada':
      return {
        title: 'Registrar Entrada',
        icon: <EntradaIcon />,
        color: 'success',
        motivos: MOTIVOS_ENTRADA,
        label: 'Cantidad a Ingresar',
      };
    case 'salida':
      return {
        title: 'Registrar Salida',
        icon: <SalidaIcon />,
        color: 'warning',
        motivos: MOTIVOS_SALIDA,
        label: 'Cantidad a Retirar',
      };
    case 'merma':
      return {
        title: 'Registrar Merma',
        icon: <MermaIcon />,
        color: 'error',
        motivos: MOTIVOS_MERMA,
        label: 'Cantidad Perdida',
      };
    default:
      return {
        title: 'Registrar Movimiento',
        icon: null,
        color: 'primary',
        motivos: [],
        label: 'Cantidad',
      };
  }
};

export default function MovimientoForm({ item, tipo, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    cantidad: '',
    motivo: '',
    descripcion: '',
    costo: '',
    responsable: '',
    documento: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const config = getMovimientoConfig(tipo);

  useEffect(() => {
    // Pre-llenar costo para entradas
    if (tipo === 'entrada' && item?.costoPromedio) {
      setFormData(prev => ({
        ...prev,
        costo: item.costoPromedio.toString(),
      }));
    }
  }, [tipo, item]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.cantidad || isNaN(parseFloat(formData.cantidad)) || parseFloat(formData.cantidad) <= 0) {
      newErrors.cantidad = 'La cantidad debe ser un número mayor a 0';
    }

    if (!formData.motivo) {
      newErrors.motivo = 'El motivo es requerido';
    }

    // Validar que no exceda el stock actual para salidas y mermas
    if ((tipo === 'salida' || tipo === 'merma') && item?.stock) {
      const cantidadMovimiento = parseFloat(formData.cantidad);
      if (cantidadMovimiento > item.stock) {
        newErrors.cantidad = `No puede exceder el stock actual (${item.stock} ${item.unidad})`;
      }
    }

    // Para entradas, el costo es requerido
    if (tipo === 'entrada') {
      if (!formData.costo || isNaN(parseFloat(formData.costo)) || parseFloat(formData.costo) <= 0) {
        newErrors.costo = 'El costo es requerido para las entradas';
      }
    }

    if (!formData.responsable.trim()) {
      newErrors.responsable = 'El responsable es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateNewStock = () => {
    if (!item?.stock || !formData.cantidad) return null;
    
    const currentStock = item.stock;
    const movimiento = parseFloat(formData.cantidad);
    
    switch (tipo) {
      case 'entrada':
        return currentStock + movimiento;
      case 'salida':
      case 'merma':
        return currentStock - movimiento;
      default:
        return currentStock;
    }
  };

  const calculateTotalValue = () => {
    if (!formData.cantidad || !formData.costo) return null;
    return parseFloat(formData.cantidad) * parseFloat(formData.costo);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        itemId: item?.id,
        tipo,
        cantidad: parseFloat(formData.cantidad),
        motivo: formData.motivo,
        descripcion: formData.descripcion,
        costo: formData.costo ? parseFloat(formData.costo) : null,
        valorTotal: calculateTotalValue(),
        responsable: formData.responsable,
        documento: formData.documento,
        fecha: new Date().toISOString(),
        stockAnterior: item?.stock,
        stockNuevo: calculateNewStock(),
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
    } finally {
      setLoading(false);
    }
  };

  const newStock = calculateNewStock();
  const totalValue = calculateTotalValue();

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: '50%', 
            bgcolor: `${config.color}.light`,
            color: `${config.color}.main` 
          }}>
            {config.icon}
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {config.title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Información del producto */}
        {item && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {item.nombre}
            </Typography>
            <Typography variant="body2">
              Stock actual: <strong>{item.stock} {item.unidad}</strong>
              {item.costoPromedio && (
                <> • Costo promedio: <strong>Q{item.costoPromedio}</strong></>
              )}
            </Typography>
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={config.label}
              type="number"
              value={formData.cantidad}
              onChange={handleChange('cantidad')}
              error={!!errors.cantidad}
              helperText={errors.cantidad || `En ${item?.unidad || 'unidades'}`}
              inputProps={{ min: 0, step: 0.1 }}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.motivo}>
              <InputLabel>Motivo *</InputLabel>
              <Select
                value={formData.motivo}
                onChange={handleChange('motivo')}
                label="Motivo *"
              >
                {config.motivos.map((motivo) => (
                  <MenuItem key={motivo.value} value={motivo.value}>
                    {motivo.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.motivo && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.motivo}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {tipo === 'entrada' && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Costo Unitario (Q)"
                type="number"
                value={formData.costo}
                onChange={handleChange('costo')}
                error={!!errors.costo}
                helperText={errors.costo || 'Costo por unidad de medida'}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />
            </Grid>
          )}

          <Grid item xs={12} md={tipo === 'entrada' ? 6 : 12}>
            <TextField
              fullWidth
              label="Responsable del Movimiento"
              value={formData.responsable}
              onChange={handleChange('responsable')}
              error={!!errors.responsable}
              helperText={errors.responsable || 'Nombre de quien realiza el movimiento'}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción / Observaciones"
              value={formData.descripcion}
              onChange={handleChange('descripcion')}
              multiline
              rows={3}
              helperText="Detalles adicionales sobre el movimiento"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Número de Documento"
              value={formData.documento}
              onChange={handleChange('documento')}
              helperText="Factura, recibo, orden de compra, etc. (opcional)"
            />
          </Grid>
        </Grid>

        {/* Vista previa del movimiento */}
        {formData.cantidad && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Vista Previa del Movimiento:
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Stock Actual:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {item?.stock || 0} {item?.unidad}
                </Typography>
              </Grid>
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Nuevo Stock:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    color: newStock < (item?.stockMinimo || 0) ? 'error.main' : 'success.main'
                  }}
                >
                  {newStock} {item?.unidad}
                  {newStock < (item?.stockMinimo || 0) && (
                    <Chip 
                      label="¡Stock Crítico!" 
                      color="error" 
                      size="small" 
                      sx={{ ml: 1 }} 
                    />
                  )}
                </Typography>
              </Grid>

              {totalValue && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Valor del Movimiento:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Q{totalValue.toFixed(2)}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading}
          color={config.color}
        >
          {loading ? 'Procesando...' : 'Registrar Movimiento'}
        </Button>
      </DialogActions>
    </form>
  );
}