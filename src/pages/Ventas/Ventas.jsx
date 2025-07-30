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
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Receipt as ReceiptIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useVentasPorSucursal, useVenta, useVentaMutation, useSucursales } from '../../hooks/useData';
import VentaForm from '../../components/forms/VentaForm';
import VentaDetalleModal from '../../components/modals/VentaDetalleModal';

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

// Mapear los valores numéricos a texto legible
const getTipoPagoText = (tipoPago) => {
  switch (tipoPago) {
    case 0: return 'Efectivo';
    case 1: return 'Tarjeta';
    case 2: return 'Transferencia';
    default: return 'Desconocido';
  }
};

const getTipoPagoColor = (tipoPago) => {
  switch (tipoPago) {
    case 0: return 'success'; // Efectivo
    case 1: return 'info';    // Tarjeta
    case 2: return 'warning'; // Transferencia
    default: return 'default';
  }
};

const getEstadoVentaText = (estadoVenta) => {
  switch (estadoVenta) {
    case 0: return 'Pendiente';
    case 1: return 'Completada';
    case 2: return 'Cancelada';
    default: return 'Desconocido';
  }
};

const getEstadoVentaColor = (estadoVenta) => {
  switch (estadoVenta) {
    case 0: return 'warning';  // Pendiente
    case 1: return 'success';  // Completada
    case 2: return 'error';    // Cancelada
    default: return 'default';
  }
};

export default function Ventas() {
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(1); // Sucursal por defecto
  const [paginaActual, setPaginaActual] = useState(1);
  const [tamañoPagina] = useState(20);
  const [openVentaForm, setOpenVentaForm] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [openDetalleModal, setOpenDetalleModal] = useState(false);

  // Hooks para datos
  const { data: sucursales } = useSucursales();
  const { 
    data: ventasData, 
    isLoading, 
    error,
    refetch 
  } = useVentasPorSucursal(sucursalSeleccionada, {
    pagina: paginaActual,
    tamanoPagina: tamañoPagina,
  });

  const { data: ventaDetalle } = useVenta(ventaSeleccionada?.id);
  const ventaMutation = useVentaMutation();

  const handleCreateVenta = () => {
    setOpenVentaForm(true);
  };

  const handleViewVenta = (venta) => {
    setVentaSeleccionada(venta);
    setOpenDetalleModal(true);
  };

  const handleCloseForm = () => {
    setOpenVentaForm(false);
  };

  const handleCloseDetalle = () => {
    setOpenDetalleModal(false);
    setVentaSeleccionada(null);
  };

  const handleSubmitVenta = async (data) => {
    try {
      await ventaMutation.mutateAsync(data);
      handleCloseForm();
    } catch (error) {
      console.error('Error al crear venta:', error);
    }
  };

  const handleSucursalChange = (event) => {
    setSucursalSeleccionada(event.target.value);
    setPaginaActual(1); // Reset a la primera página
  };

  const handlePaginaChange = (event, nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  // Calcular métricas rápidas basadas en las ventas actuales
  const calcularMetricas = () => {
    if (!ventasData?.ventas) return { ventasHoy: 0, ordenesHoy: 0, promedioOrden: 0 };
    
    const hoy = new Date().toDateString();
    const ventasHoy = ventasData.ventas.filter(venta => 
      new Date(venta.fechaVenta).toDateString() === hoy && venta.estadoVenta === 1
    );
    
    const totalVentasHoy = ventasHoy.reduce((sum, venta) => sum + venta.total, 0);
    const ordenesHoy = ventasHoy.length;
    const promedioOrden = ordenesHoy > 0 ? totalVentasHoy / ordenesHoy : 0;

    return {
      ventasHoy: totalVentasHoy,
      ordenesHoy,
      promedioOrden,
    };
  };

  const metricas = calcularMetricas();

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al cargar las ventas. Por favor, inténtalo de nuevo.
          <Button onClick={() => refetch()} sx={{ ml: 2 }}>
            Reintentar
          </Button>
        </Alert>
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
            Registro y seguimiento de ventas por sucursal
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Sucursal</InputLabel>
            <Select
              value={sucursalSeleccionada}
              onChange={handleSucursalChange}
              label="Sucursal"
            >
              {sucursales?.map((sucursal) => (
                <MenuItem key={sucursal.id} value={sucursal.id}>
                  {sucursal.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Tooltip title="Actualizar datos">
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateVenta}
            sx={{ borderRadius: 2 }}
          >
            Nueva Venta
          </Button>
        </Box>
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
                {formatCurrency(metricas.ventasHoy)}
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
                {metricas.ordenesHoy}
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
                {formatCurrency(metricas.promedioOrden)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                Total Ventas
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {ventasData?.totalVentas || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de ventas */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Historial de Ventas
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Página {ventasData?.paginaActual || 1} de {ventasData?.totalPaginas || 1}
            </Typography>
          </Box>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No. Venta</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Pago</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      Cargando ventas...
                    </TableCell>
                  </TableRow>
                ) : ventasData?.ventas?.length > 0 ? (
                  ventasData.ventas.map((venta) => (
                    <TableRow key={venta.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {venta.numeroVenta}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatDate(venta.fechaVenta)}</TableCell>
                      <TableCell>{venta.clienteNombre || 'Cliente General'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={`${venta.cantidadItems} items`} 
                          size="small" 
                          variant="outlined" 
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        {formatCurrency(venta.total)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getTipoPagoText(venta.tipoPago)}
                          color={getTipoPagoColor(venta.tipoPago)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getEstadoVentaText(venta.estadoVenta)}
                          color={getEstadoVentaColor(venta.estadoVenta)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            onClick={() => handleViewVenta(venta)}
                            color="primary"
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Imprimir recibo">
                          <IconButton
                            size="small"
                            color="secondary"
                          >
                            <ReceiptIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Box sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          No hay ventas registradas para esta sucursal
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          {ventasData?.totalPaginas > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={ventasData.totalPaginas}
                page={paginaActual}
                onChange={handlePaginaChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
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
          sucursalId={sucursalSeleccionada}
        />
      </Dialog>

      {/* Modal de detalle de venta */}
      <Dialog
        open={openDetalleModal}
        onClose={handleCloseDetalle}
        maxWidth="md"
        fullWidth
      >
        <VentaDetalleModal
          venta={ventaSeleccionada}
          ventaDetalle={ventaDetalle}
          onClose={handleCloseDetalle}
        />
      </Dialog>
    </Box>
  );
}