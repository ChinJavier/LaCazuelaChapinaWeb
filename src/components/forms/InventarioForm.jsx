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
} from '@mui/material';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';

const CATEGORIAS_MATERIAS_PRIMAS = [
  { value: 'masas', label: 'Masas' },
  { value: 'condimentos', label: 'Condimentos y Especias' },
  { value: 'envolturas', label: 'Envolturas' },
  { value: 'proteinas', label: 'Proteínas' },
  { value: 'granos', label: 'Granos y Cereales' },
  { value: 'endulzantes', label: 'Endulzantes' },
  { value: 'otros', label: 'Otros' },
];

const CATEGORIAS_EMPAQUES = [
  { value: 'bolsas', label: 'Bolsas y Envases' },
  { value: 'vasos', label: 'Vasos y Recipientes' },
  { value: 'servilletas', label: 'Servilletas y Papel' },
  { value: 'utensilios', label: 'Utensilios Desechables' },
  { value: 'otros', label: 'Otros' },
];

const UNIDADES_MEDIDA = [
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'libras', label: 'Libras (lb)' },
  { value: 'gramos', label: 'Gramos (g)' },
  { value: 'litros', label: 'Litros (L)' },
  { value: 'galones', label: 'Galones (gal)' },
  { value: 'unidades', label: 'Unidades (ud)' },
  { value: 'docenas', label: 'Docenas (doc)' },
  { value: 'paquetes', label: 'Paquetes (paq)' },
];

export default function InventarioForm({ item, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    stock: '',
    stockMinimo: '',
    stockMaximo: '',
    unidad: '',
    costoPromedio: '',
    proveedor: '',
    descripcion: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isMateriaPrima = item?.tipo === 'materia_prima';
  const isEditing = !!item?.id;

  useEffect(() => {
    if (item && item.id) {
      setFormData({
        nombre: item.nombre || '',
        categoria: item.categoria || '',
        stock: item.stock?.toString() || '',
        stockMinimo: item.stockMinimo?.toString() || '',
        stockMaximo: item.stockMaximo?.toString() || '',
        unidad: item.unidad || '',
        costoPromedio: item.costoPromedio?.toString() || '',
        proveedor: item.proveedor || '',
        descripcion: item.descripcion || '',
      });
    }
  }, [item]);

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

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    }

    if (!formData.unidad) {
      newErrors.unidad = 'La unidad de medida es requerida';
    }

    if (!formData.stock || isNaN(parseFloat(formData.stock)) || parseFloat(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser un número válido';
    }

    if (!formData.stockMinimo || isNaN(parseFloat(formData.stockMinimo)) || parseFloat(formData.stockMinimo) < 0) {
      newErrors.stockMinimo = 'El stock mínimo debe ser un número válido';
    }

    if (!formData.stockMaximo || isNaN(parseFloat(formData.stockMaximo)) || parseFloat(formData.stockMaximo) < 0) {
      newErrors.stockMaximo = 'El stock máximo debe ser un número válido';
    }

    if (parseFloat(formData.stockMinimo) >= parseFloat(formData.stockMaximo)) {
      newErrors.stockMinimo = 'El stock mínimo debe ser menor al máximo';
      newErrors.stockMaximo = 'El stock máximo debe ser mayor al mínimo';
    }

    if (!formData.costoPromedio || isNaN(parseFloat(formData.costoPromedio)) || parseFloat(formData.costoPromedio) <= 0) {
      newErrors.costoPromedio = 'El costo debe ser un número mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        stock: parseFloat(formData.stock),
        stockMinimo: parseFloat(formData.stockMinimo),
        stockMaximo: parseFloat(formData.stockMaximo),
        costoPromedio: parseFloat(formData.costoPromedio),
        valorTotal: parseFloat(formData.stock) * parseFloat(formData.costoPromedio),
        tipo: item?.tipo || 'materia_prima',
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error al guardar item:', error);
    } finally {
      setLoading(false);
    }
  };

  const categorias = isMateriaPrima ? CATEGORIAS_MATERIAS_PRIMAS : CATEGORIAS_EMPAQUES;

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isEditing 
            ? `Editar ${isMateriaPrima ? 'Materia Prima' : 'Empaque'}` 
            : `Nueva ${isMateriaPrima ? 'Materia Prima' : 'Empaque'}`
          }
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre del Producto"
              value={formData.nombre}
              onChange={handleChange('nombre')}
              error={!!errors.nombre}
              helperText={errors.nombre}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.categoria}>
              <InputLabel>Categoría *</InputLabel>
              <Select
                value={formData.categoria}
                onChange={handleChange('categoria')}
                label="Categoría *"
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.value} value={categoria.value}>
                    {categoria.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.categoria && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.categoria}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.unidad}>
              <InputLabel>Unidad de Medida *</InputLabel>
              <Select
                value={formData.unidad}
                onChange={handleChange('unidad')}
                label="Unidad de Medida *"
              >
                {UNIDADES_MEDIDA.map((unidad) => (
                  <MenuItem key={unidad.value} value={unidad.value}>
                    {unidad.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.unidad && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.unidad}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Control de Stock
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Stock Actual"
              type="number"
              value={formData.stock}
              onChange={handleChange('stock')}
              error={!!errors.stock}
              helperText={errors.stock}
              inputProps={{ min: 0, step: 0.1 }}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Stock Mínimo"
              type="number"
              value={formData.stockMinimo}
              onChange={handleChange('stockMinimo')}
              error={!!errors.stockMinimo}
              helperText={errors.stockMinimo || 'Alerta cuando esté por debajo'}
              inputProps={{ min: 0, step: 0.1 }}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Stock Máximo"
              type="number"
              value={formData.stockMaximo}
              onChange={handleChange('stockMaximo')}
              error={!!errors.stockMaximo}
              helperText={errors.stockMaximo || 'Capacidad máxima de almacenamiento'}
              inputProps={{ min: 0, step: 0.1 }}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Información Económica
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Costo Promedio (Q)"
              type="number"
              value={formData.costoPromedio}
              onChange={handleChange('costoPromedio')}
              error={!!errors.costoPromedio}
              helperText={errors.costoPromedio || 'Costo por unidad de medida'}
              inputProps={{ min: 0, step: 0.01 }}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Valor Total Estimado (Q)"
              type="number"
              value={
                formData.stock && formData.costoPromedio
                  ? (parseFloat(formData.stock) * parseFloat(formData.costoPromedio)).toFixed(2)
                  : ''
              }
              InputProps={{ readOnly: true }}
              helperText="Calculado automáticamente: Stock × Costo Promedio"
            />
          </Grid>

          {isMateriaPrima && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Proveedor Principal"
                value={formData.proveedor}
                onChange={handleChange('proveedor')}
                helperText="Nombre del proveedor habitual"
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción / Notas"
              value={formData.descripcion}
              onChange={handleChange('descripcion')}
              multiline
              rows={3}
              helperText="Características adicionales, instrucciones de almacenamiento, etc."
            />
          </Grid>
        </Grid>

        {/* Vista previa de cálculos */}
        {formData.stock && formData.stockMinimo && formData.stockMaximo && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Vista Previa:
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Nivel de Stock Actual:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {((parseFloat(formData.stock) / parseFloat(formData.stockMaximo)) * 100).toFixed(1)}%
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Estado:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    color: parseFloat(formData.stock) <= parseFloat(formData.stockMinimo) 
                      ? 'error.main' 
                      : 'success.main'
                  }}
                >
                  {parseFloat(formData.stock) <= parseFloat(formData.stockMinimo) 
                    ? 'Stock Crítico' 
                    : 'Stock Normal'
                  }
                </Typography>
              </Grid>
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
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </form>
  );
}