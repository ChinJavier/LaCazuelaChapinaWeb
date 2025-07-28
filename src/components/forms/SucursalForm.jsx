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
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';

const ESTADOS_SUCURSAL = [
  { value: 'activa', label: 'Activa' },
  { value: 'inactiva', label: 'Inactiva' },
  { value: 'mantenimiento', label: 'En Mantenimiento' },
];

const DEPARTAMENTOS_GUATEMALA = [
  { value: 'guatemala', label: 'Guatemala' },
  { value: 'sacatepequez', label: 'Sacatepéquez' },
  { value: 'chimaltenango', label: 'Chimaltenango' },
  { value: 'escuintla', label: 'Escuintla' },
  { value: 'santa_rosa', label: 'Santa Rosa' },
  { value: 'solola', label: 'Sololá' },
  { value: 'totonicapan', label: 'Totonicapán' },
  { value: 'quetzaltenango', label: 'Quetzaltenango' },
  { value: 'suchitepequez', label: 'Suchitepéquez' },
  { value: 'retalhuleu', label: 'Retalhuleu' },
  { value: 'san_marcos', label: 'San Marcos' },
  { value: 'huehuetenango', label: 'Huehuetenango' },
  { value: 'quiche', label: 'Quiché' },
  { value: 'baja_verapaz', label: 'Baja Verapaz' },
  { value: 'alta_verapaz', label: 'Alta Verapaz' },
  { value: 'peten', label: 'Petén' },
  { value: 'izabal', label: 'Izabal' },
  { value: 'zacapa', label: 'Zacapa' },
  { value: 'chiquimula', label: 'Chiquimula' },
  { value: 'jalapa', label: 'Jalapa' },
  { value: 'jutiapa', label: 'Jutiapa' },
  { value: 'el_progreso', label: 'El Progreso' },
];

export default function SucursalForm({ sucursal, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    departamento: '',
    telefono: '',
    email: '',
    gerente: '',
    empleados: '',
    metaMensual: '',
    horarioApertura: '',
    horarioCierre: '',
    estado: 'activa',
    tieneDelivery: true,
    tieneParqueo: false,
    observaciones: '',
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEditing = !!sucursal?.id;

  useEffect(() => {
    if (sucursal && sucursal.id) {
      setFormData({
        nombre: sucursal.nombre || '',
        direccion: sucursal.direccion || '',
        departamento: sucursal.departamento || 'guatemala',
        telefono: sucursal.telefono || '',
        email: sucursal.email || '',
        gerente: sucursal.gerente || '',
        empleados: sucursal.empleados?.toString() || '',
        metaMensual: sucursal.metaMes?.toString() || '',
        horarioApertura: sucursal.horarioApertura || '06:00',
        horarioCierre: sucursal.horarioCierre || '22:00',
        estado: sucursal.estado || 'activa',
        tieneDelivery: sucursal.tieneDelivery ?? true,
        tieneParqueo: sucursal.tieneParqueo ?? false,
        observaciones: sucursal.observaciones || '',
      });
    }
  }, [sucursal]);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre de la sucursal es requerido';
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }

    if (!formData.departamento) {
      newErrors.departamento = 'El departamento es requerido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{4}-\d{4}$/.test(formData.telefono)) {
      newErrors.telefono = 'Formato: 1234-5678';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.gerente.trim()) {
      newErrors.gerente = 'El nombre del gerente es requerido';
    }

    if (!formData.empleados || isNaN(parseInt(formData.empleados)) || parseInt(formData.empleados) < 1) {
      newErrors.empleados = 'Debe tener al menos 1 empleado';
    }

    if (!formData.metaMensual || isNaN(parseFloat(formData.metaMensual)) || parseFloat(formData.metaMensual) <= 0) {
      newErrors.metaMensual = 'La meta mensual debe ser mayor a 0';
    }

    if (!formData.horarioApertura) {
      newErrors.horarioApertura = 'La hora de apertura es requerida';
    }

    if (!formData.horarioCierre) {
      newErrors.horarioCierre = 'La hora de cierre es requerida';
    }

    // Validar que el horario de cierre sea después del de apertura
    if (formData.horarioApertura && formData.horarioCierre) {
      const apertura = new Date(`2000-01-01T${formData.horarioApertura}:00`);
      const cierre = new Date(`2000-01-01T${formData.horarioCierre}:00`);
      
      if (cierre <= apertura) {
        newErrors.horarioCierre = 'El horario de cierre debe ser después del de apertura';
      }
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
        empleados: parseInt(formData.empleados),
        metaMensual: parseFloat(formData.metaMensual),
        fechaCreacion: isEditing ? sucursal.fechaCreacion : new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
      };
      
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error al guardar sucursal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isEditing ? 'Editar Sucursal' : 'Nueva Sucursal'}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Información Básica */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
              Información Básica
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre de la Sucursal"
              value={formData.nombre}
              onChange={handleChange('nombre')}
              error={!!errors.nombre}
              helperText={errors.nombre || 'Ej: La Cazuela Chapina - Centro'}
              required
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Dirección Completa"
              value={formData.direccion}
              onChange={handleChange('direccion')}
              error={!!errors.direccion}
              helperText={errors.direccion}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth error={!!errors.departamento}>
              <InputLabel>Departamento *</InputLabel>
              <Select
                value={formData.departamento}
                onChange={handleChange('departamento')}
                label="Departamento *"
              >
                {DEPARTAMENTOS_GUATEMALA.map((dept) => (
                  <MenuItem key={dept.value} value={dept.value}>
                    {dept.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.departamento && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.departamento}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Teléfono"
              value={formData.telefono}
              onChange={handleChange('telefono')}
              error={!!errors.telefono}
              helperText={errors.telefono || 'Formato: 2234-5678'}
              placeholder="2234-5678"
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email (opcional)"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>

          {/* Información Operativa */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
              Información Operativa
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Gerente Responsable"
              value={formData.gerente}
              onChange={handleChange('gerente')}
              error={!!errors.gerente}
              helperText={errors.gerente}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Número de Empleados"
              type="number"
              value={formData.empleados}
              onChange={handleChange('empleados')}
              error={!!errors.empleados}
              helperText={errors.empleados}
              inputProps={{ min: 1 }}
              required
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                value={formData.estado}
                onChange={handleChange('estado')}
                label="Estado"
              >
                {ESTADOS_SUCURSAL.map((estado) => (
                  <MenuItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Meta Mensual (Q)"
              type="number"
              value={formData.metaMensual}
              onChange={handleChange('metaMensual')}
              error={!!errors.metaMensual}
              helperText={errors.metaMensual}
              inputProps={{ min: 0, step: 100 }}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Hora de Apertura"
              type="time"
              value={formData.horarioApertura}
              onChange={handleChange('horarioApertura')}
              error={!!errors.horarioApertura}
              helperText={errors.horarioApertura}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Hora de Cierre"
              type="time"
              value={formData.horarioCierre}
              onChange={handleChange('horarioCierre')}
              error={!!errors.horarioCierre}
              helperText={errors.horarioCierre}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          {/* Servicios Adicionales */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
              Servicios Adicionales
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.tieneDelivery}
                  onChange={handleChange('tieneDelivery')}
                  color="primary"
                />
              }
              label="Servicio de Delivery"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.tieneParqueo}
                  onChange={handleChange('tieneParqueo')}
                  color="primary"
                />
              }
              label="Parqueo Disponible"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Observaciones"
              value={formData.observaciones}
              onChange={handleChange('observaciones')}
              multiline
              rows={3}
              helperText="Información adicional, instrucciones especiales, etc."
            />
          </Grid>
        </Grid>

        {/* Vista previa del horario */}
        {formData.horarioApertura && formData.horarioCierre && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Vista Previa:
            </Typography>
            <Typography variant="body2">
              <strong>Horario:</strong> {formData.horarioApertura} - {formData.horarioCierre}
            </Typography>
            <Typography variant="body2">
              <strong>Servicios:</strong> 
              {formData.tieneDelivery && ' • Delivery'}
              {formData.tieneParqueo && ' • Parqueo'}
              {!formData.tieneDelivery && !formData.tieneParqueo && ' Ninguno adicional'}
            </Typography>
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
          {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Sucursal'}
        </Button>
      </DialogActions>
    </form>
  );
}