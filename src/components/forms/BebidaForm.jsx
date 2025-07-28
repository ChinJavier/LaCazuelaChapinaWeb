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
  Box,
  Typography,
  FormControlLabel,
  Switch,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';

const TIPOS_BEBIDA = [
  { value: 'atol_elote', label: 'Atol de Elote' },
  { value: 'atole_shuco', label: 'Atole Shuco' },
  { value: 'pinol', label: 'Pinol' },
  { value: 'cacao_batido', label: 'Cacao Batido' },
];

const TIPOS_ENDULZANTE = [
  { value: 'panela', label: 'Panela' },
  { value: 'miel', label: 'Miel' },
  { value: 'sin_azucar', label: 'Sin Azúcar' },
];

const TOPPINGS_DISPONIBLES = [
  'Malvaviscos',
  'Canela',
  'Ralladura de Cacao',
  'Coco Rallado',
  'Almendras',
];

export default function BebidaForm({ bebida, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: '',
    endulzante: '',
    toppings: [],
    precioVaso: '',
    precioJarro: '',
    disponible: true,
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bebida) {
      setFormData({
        nombre: bebida.nombre || '',
        descripcion: bebida.descripcion || '',
        tipo: bebida.tipo || '',
        endulzante: bebida.endulzante || '',
        toppings: bebida.toppings || [],
        precioVaso: bebida.precioVaso?.toString() || '',
        precioJarro: bebida.precioJarro?.toString() || '',
        disponible: bebida.disponible ?? true,
      });
    }
  }, [bebida]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
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

  const handleToppingsChange = (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      toppings: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.tipo) {
      newErrors.tipo = 'El tipo de bebida es requerido';
    }

    if (!formData.endulzante) {
      newErrors.endulzante = 'El endulzante es requerido';
    }

    if (!formData.precioVaso || isNaN(parseFloat(formData.precioVaso)) || parseFloat(formData.precioVaso) <= 0) {
      newErrors.precioVaso = 'El precio del vaso debe ser un número mayor a 0';
    }

    if (!formData.precioJarro || isNaN(parseFloat(formData.precioJarro)) || parseFloat(formData.precioJarro) <= 0) {
      newErrors.precioJarro = 'El precio del jarro debe ser un número mayor a 0';
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
        precioVaso: parseFloat(formData.precioVaso),
        precioJarro: parseFloat(formData.precioJarro),
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error al guardar bebida:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {bebida ? 'Editar Bebida' : 'Nueva Bebida'}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre de la Bebida"
              value={formData.nombre}
              onChange={handleChange('nombre')}
              error={!!errors.nombre}
              helperText={errors.nombre}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Descripción"
              value={formData.descripcion}
              onChange={handleChange('descripcion')}
              multiline
              rows={3}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.tipo}>
              <InputLabel>Tipo de Bebida *</InputLabel>
              <Select
                value={formData.tipo}
                onChange={handleChange('tipo')}
                label="Tipo de Bebida *"
              >
                {TIPOS_BEBIDA.map((tipo) => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.tipo && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.tipo}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.endulzante}>
              <InputLabel>Endulzante *</InputLabel>
              <Select
                value={formData.endulzante}
                onChange={handleChange('endulzante')}
                label="Endulzante *"
              >
                {TIPOS_ENDULZANTE.map((tipo) => (
                  <MenuItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.endulzante && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.endulzante}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Toppings Disponibles</InputLabel>
              <Select
                multiple
                value={formData.toppings}
                onChange={handleToppingsChange}
                input={<OutlinedInput label="Toppings Disponibles" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {TOPPINGS_DISPONIBLES.map((topping) => (
                  <MenuItem key={topping} value={topping}>
                    {topping}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Precios
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Precio Vaso 12oz (Q)"
              type="number"
              value={formData.precioVaso}
              onChange={handleChange('precioVaso')}
              error={!!errors.precioVaso}
              helperText={errors.precioVaso}
              inputProps={{ min: 0, step: 0.25 }}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Precio Jarro 1L (Q)"
              type="number"
              value={formData.precioJarro}
              onChange={handleChange('precioJarro')}
              error={!!errors.precioJarro}
              helperText={errors.precioJarro}
              inputProps={{ min: 0, step: 0.25 }}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.disponible}
                  onChange={handleChange('disponible')}
                  color="primary"
                />
              }
              label="Disponible para venta"
            />
          </Grid>
        </Grid>
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