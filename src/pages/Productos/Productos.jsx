import { useState, useMemo } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Dialog,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  LocalDrink as DrinkIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import { 
  useProductos,
  useCategorias,
  useCalcularPrecio 
} from '../../hooks/useData';
import ProductCardReal from '../../components/cards/ProductCardReal';
import ProductDetailModal from '../../components/modals/ProductDetailModal';
import PriceCalculatorModal from '../../components/modals/PriceCalculatorModal';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`productos-tabpanel-${index}`}
      aria-labelledby={`productos-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Productos() {
  const [tabValue, setTabValue] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPriceCalculator, setShowPriceCalculator] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');

  // Hooks para datos
  const { 
    data: productos, 
    isLoading: loadingProductos, 
    error: errorProductos,
    refetch: refetchProductos 
  } = useProductos();

  console.log(errorProductos);
  
  
  const { data: categorias } = useCategorias();
  const calcularPrecioMutation = useCalcularPrecio();

  // Procesar productos y separarlos por categoría
  const { tamales, bebidas, estadisticas } = useMemo(() => {
    if (!productos) return { tamales: [], bebidas: [], estadisticas: {} };

    const tamalesData = productos.filter(p => p.categoriaNombre === 'Tamales');
    const bebidasData = productos.filter(p => p.categoriaNombre === 'Bebidas');

    return {
      tamales: tamalesData,
      bebidas: bebidasData,
      estadisticas: {
        totalProductos: productos.length,
        totalTamales: tamalesData.length,
        totalBebidas: bebidasData.length,
        totalVariantes: productos.reduce((sum, p) => sum + p.variantes.length, 0),
      }
    };
  }, [productos]);

  // Filtrar productos según búsqueda y filtros
  const filtrarProductos = (productosArray) => {
    let filtered = productosArray;

    if (searchTerm) {
      filtered = filtered.filter(producto => 
        producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleViewProduct = (producto) => {
    setSelectedProduct(producto);
  };

  const handleCalculatePrice = (producto) => {
    setShowPriceCalculator(producto);
  };

  const handleCloseModals = () => {
    setSelectedProduct(null);
    setShowPriceCalculator(null);
  };

  // Obtener precios de las variantes de un producto
  const getPreciosVariantes = (producto) => {
    return producto.variantes.map(variante => ({
      nombre: variante.nombre,
      precio: producto.precioBase * variante.multiplicador,
      descripcion: variante.cantidadUnidades > 1 
        ? `${variante.cantidadUnidades} unidades`
        : variante.volumenMl 
          ? `${variante.volumenMl}ml` 
          : '1 unidad'
    }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(price);
  };

  if (errorProductos) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al cargar los productos. Por favor, inténtalo de nuevo.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
          Catálogo de Productos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Tamales y bebidas tradicionales de La Cazuela Chapina
        </Typography>
      </Box>

      {/* Estadísticas rápidas */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary.main">
                Total Productos
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {estadisticas.totalProductos || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="secondary.main">
                Tamales
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {estadisticas.totalTamales || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="info.main">
                Bebidas
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {estadisticas.totalBebidas || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                Variantes
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {estadisticas.totalVariantes || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtros globales */}
      <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FilterIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filtros
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title="Actualizar datos">
              <IconButton onClick={() => refetchProductos()}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Buscar productos"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  label="Categoría"
                >
                  <MenuItem value="todas">Todas las categorías</MenuItem>
                  {categorias?.map((categoria) => (
                    <MenuItem key={categoria.id} value={categoria.nombre}>
                      {categoria.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setFiltroCategoria('todas');
                }}
                sx={{ height: '40px' }}
              >
                Limpiar Filtros
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card sx={{padding: 5}}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <Tab 
              icon={<RestaurantIcon />} 
              label={`Tamales (${tamales.length})`}
              iconPosition="start"
            />
            <Tab 
              icon={<DrinkIcon />} 
              label={`Bebidas (${bebidas.length})`}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Panel de Tamales */}
        <TabPanel value={tabValue} index={0} >
          {loadingProductos ? (
            <Grid container spacing={3}>
              {[1, 2, 3, 4].map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
                  <Card sx={{ height: 400 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <Typography color="text.secondary">Cargando...</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={3}>
              {filtrarProductos(tamales).map((tamal) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={tamal.id}>
                  <ProductCardReal
                    product={tamal}
                    precios={getPreciosVariantes(tamal)}
                    onView={() => handleViewProduct(tamal)}
                    onCalculatePrice={() => handleCalculatePrice(tamal)}
                  />
                </Grid>
              ))}
              {filtrarProductos(tamales).length === 0 && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                      <RestaurantIcon 
                        sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} 
                      />
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        No se encontraron tamales
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ajusta los filtros de búsqueda
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </TabPanel>

        {/* Panel de Bebidas */}
        <TabPanel value={tabValue} index={1}>
          {loadingProductos ? (
            <Grid container spacing={3}>
              {[1, 2, 3, 4].map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
                  <Card sx={{ height: 400 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <Typography color="text.secondary">Cargando...</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={3}>
              {filtrarProductos(bebidas).map((bebida) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={bebida.id}>
                  <ProductCardReal
                    product={bebida}
                    precios={getPreciosVariantes(bebida)}
                    onView={() => handleViewProduct(bebida)}
                    onCalculatePrice={() => handleCalculatePrice(bebida)}
                  />
                </Grid>
              ))}
              {filtrarProductos(bebidas).length === 0 && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                      <DrinkIcon 
                        sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} 
                      />
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        No se encontraron bebidas
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ajusta los filtros de búsqueda
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </TabPanel>
      </Card>

      {/* Modales */}
      <Dialog
        open={!!selectedProduct}
        onClose={handleCloseModals}
        maxWidth="md"
        fullWidth
      >
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={handleCloseModals}
          />
        )}
      </Dialog>

      <Dialog
        open={!!showPriceCalculator}
        onClose={handleCloseModals}
        maxWidth="sm"
        fullWidth
      >
        {showPriceCalculator && (
          <PriceCalculatorModal
            product={showPriceCalculator}
            onClose={handleCloseModals}
            onCalculate={(config) => calcularPrecioMutation.mutateAsync(config)}
          />
        )}
      </Dialog>
    </Box>
  );
}