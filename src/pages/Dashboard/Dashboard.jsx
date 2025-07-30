import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Restaurant,
  LocalDrink,
  AttachMoney,
  Inventory,
  Refresh,
  Schedule,
} from '@mui/icons-material';
import { useDashboard } from '../../hooks/useData';
import MetricCard from '../../components/cards/MetricCard';
import SalesChart from '../../components/charts/SalesChart';
import ProductsChart from '../../components/charts/ProductsChart';
import HourlyChart from '../../components/charts/HourlyChart';

export default function Dashboard() {
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const { indicadores } = useDashboard(sucursalSeleccionada);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const isLoading = indicadores.isLoading;
  const hasError = indicadores.error;

  if (hasError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al cargar los datos del dashboard. Por favor, inténtalo de nuevo.
        </Alert>
      </Box>
    );
  }

  // Procesar datos para los gráficos
  const ventasPorHora = indicadores.data?.bebidasPorHorario || [];

  // Procesar tamales más vendidos para ProductsChart (gráfico de pie)
  const productosPopulares = (indicadores.data?.tamalesMasVendidos || []).map(tamal => ({
    name: tamal.nombre,
    value: tamal.cantidadVendida,
    monto: tamal.montoTotal,
    porcentaje: tamal.porcentajeDelTotal,
    variante: tamal.varianteMasVendida
  }));

  const utilidadesPorLinea = indicadores.data?.utilidadesPorLinea || [];

  // Procesar datos de ventas semanales para el gráfico (formato para SalesChart)
  const ventasSemanales = (indicadores.data?.ventasUltimos7Dias || []).map(dia => ({
    name: new Date(dia.fecha).toLocaleDateString('es-GT', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    }),
    utilidad: dia.montoVentas, // SalesChart espera 'utilidad' como dataKey
    ventas: dia.montoVentas,
    transacciones: dia.cantidadTransacciones,
    ticketPromedio: dia.ticketPromedio
  }));

  // Procesar utilidades por línea para el gráfico
  const utilidadesChart = (indicadores.data?.utilidadesPorLinea || []).map(linea => ({
    name: linea.linea,
    utilidad: linea.utilidadEstimada,
    ingresos: linea.ingresos,
    costos: linea.costosEstimados,
    margen: linea.margenPorcentaje
  }));

  // Calcular totales de tamales y bebidas vendidos
  const totalTamalesVendidos = (indicadores.data?.tamalesMasVendidos || []).reduce((sum, tamal) => sum + (tamal.cantidadVendida || 0), 0);
  const totalBebidasVendidas = (indicadores.data?.bebidasPorHorario || []).reduce((sum, bebida) => sum + (bebida.cantidadVendida || 0), 0);

  // Calcular nivel de inventario (basado en métricas disponibles)
  const inventarioData = indicadores.data?.metricasInventario;
  const nivelInventario = inventarioData ?
    Math.max(0, 100 - (inventarioData.materialesStockBajo + inventarioData.materialesAgotados) * 10) : 0;

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Resumen de actividades de La Cazuela Chapina
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            icon={<Schedule />}
            label={`Última actualización: ${new Date(indicadores.data?.fechaGeneracion || new Date()).toLocaleTimeString()}`}
            variant="outlined"
            size="small"
          />
          <Tooltip title="Actualizar datos">
            <IconButton
              onClick={handleRefresh}
              disabled={isLoading}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Métricas principales */}
      <Grid container spacing={3} sx={{ mb: 6 }} justifyContent={"center"}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Ventas del Día"
            value={indicadores.data?.ventasDiarias || 0}
            format="currency"
            icon={<AttachMoney />}
            trend={indicadores.data?.ventasDiarias}
            loading={indicadores.isLoading}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tamales Vendidos"
            value={totalTamalesVendidos}
            format="number"
            icon={<Restaurant />}
            trend={totalTamalesVendidos}
            loading={indicadores.isLoading}
            color="secondary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Bebidas Vendidas"
            value={totalBebidasVendidas}
            format="number"
            icon={<LocalDrink />}
            trend={totalBebidasVendidas}
            loading={indicadores.isLoading}
            color="info"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Nivel de Inventario"
            value={nivelInventario}
            format="percentage"
            icon={<Inventory />}
            trend={nivelInventario > 80 ? 1 : nivelInventario > 50 ? 0: -1}
            loading={indicadores.isLoading}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Gráficos principales */}
      <Grid container spacing={3} sx={{ mb: 6 }} justifyContent={"center"}>
        <Grid item xs={12} md={8} >
          <Card style={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Ventas de los Últimos 7 Días
              </Typography>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <SalesChart data={ventasSemanales} height={350} />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Tamales Más Vendidos
              </Typography>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <ProductsChart data={productosPopulares} height={350} />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Utilidades por Línea
              </Typography>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <SalesChart data={utilidadesChart} height={350} />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>



      {/* Métricas adicionales del inventario */}
      {inventarioData && (
        <Grid container spacing={3} sx={{ mt: 2 }} justifyContent={"center"}>

          <Grid item xs={12} md={6} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Proporción de Picante
                </Typography>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {indicadores.data?.proporcionPicante?.detallePorNivel?.map((nivel, index) => (
                      <Box key={index} sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {nivel.nivelPicante}
                        </Typography>
                        <Typography variant="h5" sx={{
                          color: nivel.nivelPicante === 'Chapín' ? 'warning.main' : 'inherit'
                        }}>
                          {nivel.porcentaje.toFixed(2)}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({nivel.cantidad} unidades)
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Resumen de Inventario
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Valor Total:</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      Q{inventarioData.valorTotalInventario.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Stock Bajo:</Typography>
                    <Typography variant="body2" color={inventarioData.materialesStockBajo > 0 ? 'warning.main' : 'success.main'}>
                      {inventarioData.materialesStockBajo} materiales
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Agotados:</Typography>
                    <Typography variant="body2" color={inventarioData.materialesAgotados > 0 ? 'error.main' : 'success.main'}>
                      {inventarioData.materialesAgotados} materiales
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Métricas del Día
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Transacciones:</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {indicadores.data?.transaccionesDiarias || 0}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Ticket Promedio:</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      Q{(indicadores.data?.ticketPromedio || 0).toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Movimientos Inventario:</Typography>
                    <Typography variant="body2">
                      {inventarioData.totalMovimientosHoy}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Bebidas por Horario
                </Typography>
                {ventasPorHora.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {ventasPorHora.map((bebida, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">
                          {bebida.tipoBebida} ({bebida.hora}:00)
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {bebida.cantidadVendida} - Q{bebida.montoVendido}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No hay datos de bebidas por horario
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Alertas de inventario crítico */}
      {inventarioData?.alertasPrioritarias && inventarioData.alertasPrioritarias.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Alertas de Inventario
            </Typography>
            {inventarioData.alertasPrioritarias.map((alerta, index) => (
              <Typography key={index} variant="body2">
                • {alerta.producto}: {alerta.stock} unidades restantes
              </Typography>
            ))}
          </Alert>
        </Box>
      )}
    </Box>
  );
}