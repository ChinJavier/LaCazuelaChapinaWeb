import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  Restaurant as RestaurantIcon,
  LocalDrink as DrinkIcon,
  CheckCircle as RequiredIcon,
  RadioButtonUnchecked as OptionalIcon,
} from '@mui/icons-material';

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
  }).format(price);
};

export default function ProductDetailModal({ product, onClose }) {
  const getProductIcon = () => {
    return product.categoriaNombre === 'Tamales' ? <RestaurantIcon /> : <DrinkIcon />;
  };

  const getProductColor = () => {
    return product.categoriaNombre === 'Tamales' ? 'primary' : 'info';
  };

  return (
    <>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ 
            p: 1, 
            borderRadius: '50%', 
            bgcolor: getProductColor() + '.light',
            color: getProductColor() + '.main' 
          }}>
            {getProductIcon()}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {product.nombre}
            </Typography>
            <Chip
              label={product.categoriaNombre}
              size="small"
              color={getProductColor()}
              variant="outlined"
            />
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Información básica */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Información Básica
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {product.descripcion}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    Precio base:
                  </Typography>
                  <Typography variant="h5" color="primary.main" sx={{ fontWeight: 600 }}>
                    {formatPrice(product.precioBase)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Variantes */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Variantes Disponibles
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Variante</TableCell>
                        <TableCell>Cantidad</TableCell>
                        <TableCell align="right">Precio</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {product.variantes.map((variante) => {
                        const precio = product.precioBase * variante.multiplicador;
                        return (
                          <TableRow key={variante.id}>
                            <TableCell sx={{ fontWeight: 600 }}>
                              {variante.nombre}
                            </TableCell>
                            <TableCell>
                              {variante.cantidadUnidades > 1 
                                ? `${variante.cantidadUnidades} unidades`
                                : variante.volumenMl 
                                  ? `${variante.volumenMl}ml` 
                                  : '1 unidad'
                              }
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              {formatPrice(precio)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Atributos personalizables */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Opciones de Personalización
                </Typography>
                
                {product.atributosPersonalizables.map((atributo) => (
                  <Box key={atributo.id} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {atributo.esObligatorio ? (
                        <RequiredIcon color="error" fontSize="small" />
                      ) : (
                        <OptionalIcon color="action" fontSize="small" />
                      )}
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {atributo.nombre}
                      </Typography>
                      <Chip
                        label={atributo.esObligatorio ? 'Obligatorio' : 'Opcional'}
                        size="small"
                        color={atributo.esObligatorio ? 'error' : 'default'}
                        variant="outlined"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {atributo.permiteMultiple 
                        ? 'Puedes seleccionar múltiples opciones'
                        : 'Selecciona una opción'
                      }
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {atributo.opciones.map((opcion) => (
                        <Box 
                          key={opcion.id} 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            p: 1,
                            bgcolor: 'grey.50',
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2">
                            {opcion.nombre}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontWeight: 600,
                              color: opcion.precioAdicional > 0 ? 'warning.main' : 'success.main'
                            }}
                          >
                            {opcion.precioAdicional > 0 
                              ? `+${formatPrice(opcion.precioAdicional)}`
                              : 'Incluido'
                            }
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>

          {/* Resumen de precios */}
          <Grid item xs={12}>
            <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Información de Precios
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Precio mínimo:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {formatPrice(
                        Math.min(...product.variantes.map(v => product.precioBase * v.multiplicador))
                      )}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Precio máximo:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {formatPrice(
                        Math.max(...product.variantes.map(v => product.precioBase * v.multiplicador))
                      )}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Opciones personalizables:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {product.atributosPersonalizables.reduce((sum, attr) => sum + attr.opciones.length, 0)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={onClose}
          startIcon={<CloseIcon />}
          variant="outlined"
        >
          Cerrar
        </Button>
      </DialogActions>
    </>
  );
}