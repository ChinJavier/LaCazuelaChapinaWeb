import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
} from '@mui/icons-material';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'long',
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
    case 0: return 'success';
    case 1: return 'info';
    case 2: return 'warning';
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
    case 0: return 'warning';
    case 1: return 'success';
    case 2: return 'error';
    default: return 'default';
  }
};

export default function VentaDetalleModal({ venta, ventaDetalle, onClose }) {
  if (!venta) return null;

  const handlePrint = () => {
    // Implementar lógica de impresión
    window.print();
  };

  return (
    <>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Detalle de Venta
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {venta.numeroVenta}
            </Typography>
          </Box>
          <Chip
            label={getEstadoVentaText(venta.estadoVenta)}
            color={getEstadoVentaColor(venta.estadoVenta)}
          />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Información general de la venta */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Información de la Venta
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Número de Venta:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {venta.numeroVenta}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Fecha:
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(venta.fechaVenta)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Sucursal:
                    </Typography>
                    <Typography variant="body2">
                      {venta.sucursalNombre}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Método de Pago:
                    </Typography>
                    <Chip
                      label={getTipoPagoText(venta.tipoPago)}
                      color={getTipoPagoColor(venta.tipoPago)}
                      size="small"
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Información del Cliente
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Nombre:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {ventaDetalle ? ventaDetalle.clienteNombre : venta.clienteNombre}
                    </Typography>
                  </Box>
                  
                  {ventaDetalle?.clienteTelefono && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Teléfono:
                      </Typography>
                      <Typography variant="body2">
                        {ventaDetalle.clienteTelefono}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Items:
                    </Typography>
                    <Typography variant="body2">
                      {venta.cantidadItems}
                    </Typography>
                  </Box>
                  
                  {ventaDetalle?.esVentaOffline && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Tipo:
                      </Typography>
                      <Chip
                        label="Venta Offline"
                        color="warning"
                        size="small"
                      />
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Detalles de productos */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Productos Vendidos
            </Typography>

            {!ventaDetalle ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell>Variante</TableCell>
                      <TableCell align="center">Cantidad</TableCell>
                      <TableCell align="right">Precio Unit.</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ventaDetalle.detalles?.map((detalle, index) => (
                      <TableRow key={detalle.id || index}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {detalle.productoNombre}
                            </Typography>
                            {detalle.notas && (
                              <Typography variant="caption" color="text.secondary">
                                Notas: {detalle.notas}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {detalle.varianteNombre}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {detalle.cantidad}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {formatCurrency(detalle.precioUnitario)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(detalle.subtotal)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Personalizaciones */}
            {ventaDetalle?.detalles?.some(d => d.personalizaciones?.length > 0) && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Personalizaciones
                </Typography>
                
                {ventaDetalle.detalles.map((detalle, detalleIndex) => (
                  detalle.personalizaciones?.length > 0 && (
                    <Box key={detalleIndex} sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        {detalle.productoNombre} - {detalle.varianteNombre}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, ml: 2 }}>
                        {detalle.personalizaciones.map((pers, persIndex) => (
                          <Chip
                            key={persIndex}
                            label={`${pers.tipoAtributoNombre}: ${pers.opcionNombre}${pers.precioAdicional > 0 ? ` (+${formatCurrency(pers.precioAdicional)})` : ''}`}
                            size="small"
                            variant="outlined"
                            color={pers.precioAdicional > 0 ? 'primary' : 'default'}
                          />
                        ))}
                      </Box>
                    </Box>
                  )
                ))}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Resumen de totales */}
        <Card variant="outlined" sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Resumen de Pago
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  Subtotal:
                </Typography>
                <Typography variant="body2">
                  {formatCurrency(ventaDetalle ? ventaDetalle.subtotal : venta.total)}
                </Typography>
              </Box>
              
              {ventaDetalle?.descuento > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="error">
                    Descuento:
                  </Typography>
                  <Typography variant="body2" color="error">
                    -{formatCurrency(ventaDetalle.descuento)}
                  </Typography>
                </Box>
              )}
              
              <Divider sx={{ my: 1 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {formatCurrency(venta.total)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
        >
          Cerrar
        </Button>
        
        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
        >
          Imprimir
        </Button>
        
        <Button
          variant="contained"
          startIcon={<ReceiptIcon />}
          onClick={handlePrint}
        >
          Generar Recibo
        </Button>
      </DialogActions>
    </>
  );
}