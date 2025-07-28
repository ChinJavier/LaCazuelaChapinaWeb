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
  const [refreshKey, setRefreshKey] = useState(0);
  const { indicadores, ventasPorHora, productosPopulares, utilidades } = useDashboard();

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const isLoading = 
    indicadores.isLoading || 
    ventasPorHora.isLoading || 
    productosPopulares.isLoading || 
    utilidades.isLoading;

  const hasError = 
    indicadores.error || 
    ventasPorHora.error || 
    productosPopulares.error || 
    utilidades.error;

  if (hasError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al cargar los datos del dashboard. Por favor, inténtalo de nuevo.
        </Alert>
      </Box>
    );
  }

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
            label={`Última actualización: ${new Date().toLocaleTimeString()}`}
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
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Ventas del Día"
            value={indicadores.data?.ventasHoy || 0}
            format="currency"
            icon={<AttachMoney />}
            trend={indicadores.data?.tendenciaVentas}
            loading={indicadores.isLoading}
            color="primary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Tamales Vendidos"
            value={indicadores.data?.tamalesVendidosHoy || 0}
            format="number"
            icon={<Restaurant />}
            trend={indicadores.data?.tendenciaTamales}
            loading={indicadores.isLoading}
            color="secondary"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Bebidas Vendidas"
            value={indicadores.data?.bebidasVendidasHoy || 0}
            format="number"
            icon={<LocalDrink />}
            trend={indicadores.data?.tendenciaBebidas}
            loading={indicadores.isLoading}
            color="info"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Nivel de Inventario"
            value={indicadores.data?.nivelInventario || 0}
            format="percentage"
            icon={<Inventory />}
            trend={indicadores.data?.tendenciaInventario}
            loading={indicadores.isLoading}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Gráficos principales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Ventas por Hora
              </Typography>
              {ventasPorHora.isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <HourlyChart data={ventasPorHora.data || []} />
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Productos Más Vendidos
              </Typography>
              {productosPopulares.isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <ProductsChart data={productosPopulares.data || []} />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Métricas adicionales */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Proporción de Picante
              </Typography>
              {indicadores.isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Sin Chile
                    </Typography>
                    <Typography variant="h5">
                      {indicadores.data?.proporcionPicante?.sinChile || 0}%
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Suave
                    </Typography>
                    <Typography variant="h5">
                      {indicadores.data?.proporcionPicante?.suave || 0}%
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Chapín
                    </Typography>
                    <Typography variant="h5" sx={{ color: 'warning.main' }}>
                      {indicadores.data?.proporcionPicante?.chapin || 0}%
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Utilidades por Línea
              </Typography>
              {utilidades.isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <SalesChart data={utilidades.data || []} />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alertas de inventario crítico */}
      {indicadores.data?.alertasInventario && indicadores.data.alertasInventario.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Alertas de Inventario
            </Typography>
            {indicadores.data.alertasInventario.map((alerta, index) => (
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