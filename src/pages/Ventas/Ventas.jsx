import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useVentas, useVentaMutation } from '../../hooks/useData';
import VentaForm from '../../components/forms/VentaForm';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
  }).format(amount);
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'completada':
      return 'success';
    case 'pendiente':
      return 'warning';
    case 'cancelada':
      return 'error';
    default:
      return 'default';
  }
};

export default function Ventas() {
  const [openVentaForm, setOpenVentaForm] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);

  const { data: ventas, isLoading, error } = useVentas();
  const ventaMutation = useVentaMutation();

  const handleCreateVenta = () => {
    setOpenVentaForm(true);
  };

  const handleViewVenta = (venta) => {
    setSelectedVenta(venta);
  };

  const handleCloseForm = () => {
    setOpenVentaForm(false);
  };

  const handleSubmitVenta = async (data) => {
    try {
      await ventaMutation.mutateAsync(data);
      handleCloseForm();
    } catch (error) {
      console.error('Error al crear venta:', error);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error al cargar las ventas. Por favor, inténtalo de nuevo.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Gestión de Ventas
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Registro y seguimiento de ventas diarias
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateVenta}
          sx={{ borderRadius: 2 }}
        >
          Nueva Venta
        </Button>
      </Box>

      {/* Métricas rápidas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary.main">
                Ventas Hoy
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {formatCurrency(ventas?.ventasHoy || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="secondary.main">
                Órdenes Hoy
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {ventas?.ordenesHoy || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="info.main">
                Promedio por Orden
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {formatCurrency(ventas?.promedioOrden || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                Top Producto
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {ventas?.topProducto || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de ventas */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Historial de Ventas
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Productos</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Cargando ventas...
                    </TableCell>
                  </TableRow>
                ) : ventas?.data?.length > 0 ? (
                  ventas.data.map((venta) => (
                    <TableRow key={venta.id} hover>
                      <TableCell>#{venta.id}</TableCell>
                      <TableCell>{formatDate(venta.fecha)}</TableCell>
                      <TableCell>{venta.cliente || 'Cliente General'}</TableCell>
                      <TableCell>
                        {venta.productos?.length || 0} productos
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {formatCurrency(venta.total)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={venta.estado}
                          color={getStatusColor(venta.estado)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleViewVenta(venta)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="secondary"
                        >
                          <ReceiptIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No hay ventas registradas
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Formulario de nueva venta */}
      <Dialog
        open={openVentaForm}
        onClose={handleCloseForm}
        maxWidth="lg"
        fullWidth
      >
        <VentaForm
          onClose={handleCloseForm}
          onSubmit={handleSubmitVenta}
        />
      </Dialog>
    </Box>
  );
}