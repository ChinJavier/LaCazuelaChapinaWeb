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
  IconButton,
  Chip,
  Dialog,
  Alert,
  Tabs,
  Tab,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Store as StoreIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as ReportIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useSucursales, useSucursalMutation } from '../../hooks/useData';
import SucursalForm from '../../components/forms/SucursalForm';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`sucursales-tabpanel-${index}`}
      aria-labelledby={`sucursales-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
  }).format(amount);
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'activa':
      return 'success';
    case 'inactiva':
      return 'error';
    case 'mantenimiento':
      return 'warning';
    default:
      return 'default';
  }
};

export default function Sucursales() {
  const [tabValue, setTabValue] = useState(0);
  const [openSucursalForm, setOpenSucursalForm] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState(null);
  const [viewReports, setViewReports] = useState(null);

  const { data: sucursales, isLoading, error } = useSucursales();
  const sucursalMutation = useSucursalMutation();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCreateSucursal = () => {
    setSelectedSucursal(null);
    setOpenSucursalForm(true);
  };

  const handleEditSucursal = (sucursal) => {
    setSelectedSucursal(sucursal);
    setOpenSucursalForm(true);
  };

  const handleViewReports = (sucursal) => {
    setViewReports(sucursal);
    setTabValue(1); // Cambiar a tab de reportes
  };

  const handleCloseForm = () => {
    setOpenSucursalForm(false);
    setSelectedSucursal(null);
  };

  const handleSubmitSucursal = async (data) => {
    try {
      const action = selectedSucursal ? 'update' : 'create';
      const id = selectedSucursal?.id;
      await sucursalMutation.mutateAsync({ action, id, data });
      handleCloseForm();
    } catch (error) {
      console.error('Error al guardar sucursal:', error);
    }
  };

  // Datos mock para demostración
  const sucursalesData = sucursales || [
    {
      id: 1,
      nombre: 'La Cazuela Chapina - Centro',
      direccion: '5ta Avenida 12-34, Zona 1, Guatemala',
      telefono: '2234-5678',
      gerente: 'María González',
      estado: 'activa',
      ventasHoy: 1250.00,
      ventasMes: 28500.00,
      metaMes: 35000.00,
      ordenesHoy: 45,
      empleados: 8,
      horario: '6:00 AM - 10:00 PM',
      fechaApertura: '2020-03-15',
    },
    {
      id: 2,
      nombre: 'La Cazuela Chapina - Zona Rosa',
      direccion: '14 Calle 3-25, Zona 10, Guatemala',
      telefono: '2456-7890',
      gerente: 'Carlos Pérez',
      estado: 'activa',
      ventasHoy: 980.00,
      ventasMes: 22400.00,
      metaMes: 25000.00,
      ordenesHoy: 32,
      empleados: 6,
      horario: '7:00 AM - 9:00 PM',
      fechaApertura: '2021-08-20',
    },
    {
      id: 3,
      nombre: 'La Cazuela Chapina - Mixco',
      direccion: '1ra Calle 8-45, Mixco, Guatemala',
      telefono: '2567-8901',
      gerente: 'Ana Morales',
      estado: 'mantenimiento',
      ventasHoy: 0.00,
      ventasMes: 18900.00,
      metaMes: 20000.00,
      ordenesHoy: 0,
      empleados: 5,
      horario: 'Cerrado temporalmente',
      fechaApertura: '2022-01-10',
    },
  ];

  const SucursalCard = ({ sucursal }) => {
    const progresoMeta = (sucursal.ventasMes / sucursal.metaMes) * 100;
    
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: getStatusColor(sucursal.estado) + '.main',
                width: 56,
                height: 56,
              }}
            >
              <StoreIcon />
            </Avatar>
            
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {sucursal.nombre}
              </Typography>
              <Chip
                label={sucursal.estado}
                color={getStatusColor(sucursal.estado)}
                size="small"
                sx={{ mb: 1 }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LocationIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {sucursal.direccion}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <PhoneIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {sucursal.telefono}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <PersonIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              Gerente: {sucursal.gerente}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Rendimiento del Mes
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2">
                {formatCurrency(sucursal.ventasMes)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Meta: {formatCurrency(sucursal.metaMes)}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(progresoMeta, 100)}
              color={progresoMeta >= 100 ? 'success' : progresoMeta >= 75 ? 'warning' : 'error'}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary">
              {progresoMeta.toFixed(1)}% de la meta mensual
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Ventas Hoy
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {formatCurrency(sucursal.ventasHoy)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Órdenes
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {sucursal.ordenesHoy}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>

        <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            size="small"
            startIcon={<ViewIcon />}
            onClick={() => handleViewReports(sucursal)}
          >
            Ver Reportes
          </Button>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEditSucursal(sucursal)}
          >
            <EditIcon />
          </IconButton>
        </Box>
      </Card>
    );
  };

  const ReporteComparativo = () => {
    const totalVentas = sucursalesData.reduce((sum, s) => sum + s.ventasMes, 0);
    const sucursalesActivas = sucursalesData.filter(s => s.estado === 'activa').length;
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary.main">
                Ventas Totales (Mes)
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {formatCurrency(totalVentas)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sucursalesActivas} sucursales activas
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="secondary.main">
                Mejor Sucursal
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {sucursalesData.reduce((prev, current) => 
                  prev.ventasMes > current.ventasMes ? prev : current
                ).nombre.split(' - ')[1]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatCurrency(Math.max(...sucursalesData.map(s => s.ventasMes)))}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="info.main">
                Promedio por Sucursal
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {formatCurrency(totalVentas / sucursalesData.length)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Comparativo de Sucursales
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sucursal</TableCell>
                      <TableCell>Estado</TableCell>
                      <TableCell>Ventas Hoy</TableCell>
                      <TableCell>Ventas Mes</TableCell>
                      <TableCell>% Meta</TableCell>
                      <TableCell>Órdenes</TableCell>
                      <TableCell>Empleados</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sucursalesData.map((sucursal) => {
                      const progresoMeta = (sucursal.ventasMes / sucursal.metaMes) * 100;
                      return (
                        <TableRow key={sucursal.id} hover>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {sucursal.nombre.split(' - ')[1]}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={sucursal.estado}
                              color={getStatusColor(sucursal.estado)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {formatCurrency(sucursal.ventasHoy)}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>
                            {formatCurrency(sucursal.ventasMes)}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {progresoMeta >= 100 ? (
                                <TrendingUpIcon color="success" fontSize="small" />
                              ) : (
                                <TrendingDownIcon color="error" fontSize="small" />
                              )}
                              <Typography
                                variant="body2"
                                color={progresoMeta >= 100 ? 'success.main' : 'error.main'}
                                sx={{ fontWeight: 600 }}
                              >
                                {progresoMeta.toFixed(1)}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{sucursal.ordenesHoy}</TableCell>
                          <TableCell>{sucursal.empleados}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al cargar las sucursales. Por favor, inténtalo de nuevo.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
          Gestión de Sucursales
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Control y seguimiento de todas las sucursales
        </Typography>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab 
              icon={<StoreIcon />} 
              label="Sucursales" 
              iconPosition="start"
            />
            <Tab 
              icon={<ReportIcon />} 
              label="Reportes Comparativos" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Panel de Sucursales */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">
              Sucursales Registradas ({sucursalesData.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateSucursal}
            >
              Nueva Sucursal
            </Button>
          </Box>

          {isLoading ? (
            <Grid container spacing={3}>
              {[1, 2, 3].map((item) => (
                <Grid item xs={12} md={6} lg={4} key={item}>
                  <Card sx={{ height: 400 }}>
                    <CardContent>
                      <Typography color="text.secondary">Cargando...</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={3}>
              {sucursalesData.map((sucursal) => (
                <Grid item xs={12} md={6} lg={4} key={sucursal.id}>
                  <SucursalCard sucursal={sucursal} />
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Panel de Reportes */}
        <TabPanel value={tabValue} index={1}>
          <ReporteComparativo />
        </TabPanel>
      </Card>

      {/* Formulario de Sucursal */}
      <Dialog
        open={openSucursalForm}
        onClose={handleCloseForm}
        maxWidth="md"
        fullWidth
      >
        <SucursalForm
          sucursal={selectedSucursal}
          onClose={handleCloseForm}
          onSubmit={handleSubmitSucursal}
        />
      </Dialog>
    </Box>
  );
}