import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  Dialog,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  LocalShipping as ShippingIcon,
  Assessment as ReportIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Edit as EditIcon,
  TrendingDown as TrendingDownIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useInventario, useInventarioMutation } from '../../hooks/useData';
import InventarioForm from '../../components/forms/InventarioForm';
import MovimientoForm from '../../components/forms/MovimientoForm';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`inventario-tabpanel-${index}`}
      aria-labelledby={`inventario-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const getStockColor = (nivel) => {
  if (nivel >= 50) return 'success';
  if (nivel >= 20) return 'warning';
  return 'error';
};

const getStockIcon = (tendencia) => {
  if (tendencia > 0) return <TrendingUpIcon color="success" />;
  if (tendencia < 0) return <TrendingDownIcon color="error" />;
  return null;
};

export default function Inventario() {
  const [tabValue, setTabValue] = useState(0);
  const [openInventarioForm, setOpenInventarioForm] = useState(false);
  const [openMovimientoForm, setOpenMovimientoForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [tipoMovimiento, setTipoMovimiento] = useState('entrada');

  const { materiasPrimas, empaques } = useInventario();
  const inventarioMutation = useInventarioMutation();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditItem = (item, tipo) => {
    setSelectedItem({ ...item, tipo });
    setOpenInventarioForm(true);
  };

  const handleMovimiento = (item, tipo) => {
    setSelectedItem(item);
    setTipoMovimiento(tipo);
    setOpenMovimientoForm(true);
  };

  const handleCloseDialogs = () => {
    setOpenInventarioForm(false);
    setOpenMovimientoForm(false);
    setSelectedItem(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(amount);
  };

  // Datos mock para demostración
  const materiasData = materiasPrimas.data || [
    {
      id: 1,
      nombre: 'Masa de Maíz Amarillo',
      categoria: 'Masas',
      stock: 45,
      stockMinimo: 20,
      stockMaximo: 100,
      unidad: 'kg',
      costoPromedio: 8.50,
      valorTotal: 382.50,
      proveedor: 'Molino San José',
      tendencia: -5,
    },
    {
      id: 2,
      nombre: 'Recado Rojo',
      categoria: 'Condimentos',
      stock: 12,
      stockMinimo: 15,
      stockMaximo: 50,
      unidad: 'libras',
      costoPromedio: 25.00,
      valorTotal: 300.00,
      proveedor: 'Especias Chapinas',
      tendencia: -8,
    },
    {
      id: 3,
      nombre: 'Hojas de Plátano',
      categoria: 'Envolturas',
      stock: 85,
      stockMinimo: 30,
      stockMaximo: 150,
      unidad: 'docenas',
      costoPromedio: 3.50,
      valorTotal: 297.50,
      proveedor: 'Finca La Esperanza',
      tendencia: 2,
    },
  ];

  const empaquesData = empaques.data || [
    {
      id: 1,
      nombre: 'Bolsas Plásticas Grandes',
      stock: 150,
      stockMinimo: 50,
      stockMaximo: 300,
      unidad: 'unidades',
      costoPromedio: 0.25,
      valorTotal: 37.50,
    },
    {
      id: 2,
      nombre: 'Vasos Desechables 12oz',
      stock: 75,
      stockMinimo: 100,
      stockMaximo: 500,
      unidad: 'unidades',
      costoPromedio: 0.15,
      valorTotal: 11.25,
    },
  ];

  const alertasStock = [
    ...materiasData.filter(item => item.stock <= item.stockMinimo),
    ...empaquesData.filter(item => item.stock <= item.stockMinimo),
  ];

  const InventarioTable = ({ data, tipo }) => (
    <TableContainer component={Paper} variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell>Stock Actual</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Costo Promedio</TableCell>
            <TableCell>Valor Total</TableCell>
            <TableCell>Tendencia</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => {
            const nivelStock = (item.stock / item.stockMaximo) * 100;
            return (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.proveedor && (
                        <Typography variant="caption" color="text.secondary">
                          • {item.proveedor}
                        </Typography>

                      )}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.stock} {item.unidad}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(nivelStock, 100)}
                      color={getStockColor(nivelStock)}
                      sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip
                    label={
                      item.stock <= item.stockMinimo
                        ? 'Stock Crítico'
                        : item.stock >= item.stockMaximo * 0.8
                          ? 'Stock Alto'
                          : 'Stock Normal'
                    }
                    color={getStockColor(nivelStock)}
                    size="small"
                    icon={item.stock <= item.stockMinimo ? <WarningIcon /> : undefined}
                  />
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {formatCurrency(item.costoPromedio)}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(item.valorTotal)}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {getStockIcon(item.tendencia)}
                    <Typography
                      variant="caption"
                      color={item.tendencia > 0 ? 'success.main' : item.tendencia < 0 ? 'error.main' : 'text.secondary'}
                    >
                      {item.tendencia > 0 ? '+' : ''}{item.tendencia}%
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Entrada">
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleMovimiento(item, 'entrada')}
                      >
                        <TrendingUpIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Salida">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleMovimiento(item, 'salida')}
                      >
                        <TrendingDownIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditItem(item, tipo)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
          Gestión de Inventario
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Control de stock, materias primas y empaques
        </Typography>
      </Box>

      {/* Alertas de Stock Crítico */}
      {alertasStock.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Alertas de Stock Crítico ({alertasStock.length})
          </Typography>
          {alertasStock.map((item, index) => (
            <Typography key={index} variant="body2">
              • {item.nombre}: {item.stock} {item.unidad} (Mínimo: {item.stockMinimo})
            </Typography>
          ))}
        </Alert>
      )}

      {/* Métricas Rápidas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary.main">
                Valor Total Inventario
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {formatCurrency(
                  [...materiasData, ...empaquesData].reduce((total, item) => total + item.valorTotal, 0)
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">
                Items en Stock Crítico
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {alertasStock.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="secondary.main">
                Total de Productos
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {materiasData.length + empaquesData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="info.main">
                Movimientos Hoy
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                12
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs de Inventario */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab
              icon={<CategoryIcon />}
              label="Materias Primas"
              iconPosition="start"
            />
            <Tab
              icon={<ShippingIcon />}
              label="Empaques"
              iconPosition="start"
            />
            <Tab
              icon={<ReportIcon />}
              label="Reportes"
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Panel de Materias Primas */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">
              Materias Primas ({materiasData.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedItem({ tipo: 'materia_prima' });
                setOpenInventarioForm(true);
              }}
            >
              Nueva Materia Prima
            </Button>
          </Box>

          <InventarioTable data={materiasData} tipo="materia_prima" />
        </TabPanel>

        {/* Panel de Empaques */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">
              Empaques y Material ({empaquesData.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedItem({ tipo: 'empaque' });
                setOpenInventarioForm(true);
              }}
            >
              Nuevo Empaque
            </Button>
          </Box>

          <InventarioTable data={empaquesData} tipo="empaque" />
        </TabPanel>

        {/* Panel de Reportes */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Reporte de Mermas (Esta Semana)
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total en Mermas:
                    </Typography>
                    <Typography variant="h5" color="error.main" sx={{ fontWeight: 600 }}>
                      {formatCurrency(245.50)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Masa de maíz vencida</Typography>
                      <Typography variant="body2" color="error">Q125.00</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Hojas dañadas</Typography>
                      <Typography variant="body2" color="error">Q45.50</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Recado desperdiciado</Typography>
                      <Typography variant="body2" color="error">Q75.00</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Movimientos Recientes
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <TrendingUpIcon color="success" />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Entrada - Masa de Maíz
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Hace 2 horas • +25 kg
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <TrendingDownIcon color="warning" />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Salida - Recado Rojo
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Hace 4 horas • -3 libras
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <WarningIcon color="error" />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Merma - Hojas de Plátano
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Ayer • -5 docenas (dañadas)
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => {
                      setTipoMovimiento('merma');
                      setOpenMovimientoForm(true);
                    }}
                  >
                    Registrar Merma
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>

      {/* Diálogos */}
      <Dialog
        open={openInventarioForm}
        onClose={handleCloseDialogs}
        maxWidth="md"
        fullWidth
      >
        <InventarioForm
          item={selectedItem}
          onClose={handleCloseDialogs}
          onSubmit={async (data) => {
            const action = selectedItem?.id ? 'updateMateriaPrima' : 'createMateriaPrima';
            await inventarioMutation.mutateAsync({ action, id: selectedItem?.id, data });
            handleCloseDialogs();
          }}
        />
      </Dialog>

      <Dialog
        open={openMovimientoForm}
        onClose={handleCloseDialogs}
        maxWidth="sm"
        fullWidth
      >
        <MovimientoForm
          item={selectedItem}
          tipo={tipoMovimiento}
          onClose={handleCloseDialogs}
          onSubmit={async (data) => {
            const action = `registrar${tipoMovimiento.charAt(0).toUpperCase() + tipoMovimiento.slice(1)}`;
            await inventarioMutation.mutateAsync({ action, data });
            handleCloseDialogs();
          }}
        />
      </Dialog>
    </Box>
  );
}