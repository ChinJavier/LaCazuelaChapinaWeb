import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Calculate as CalculateIcon,
  Restaurant as RestaurantIcon,
  LocalDrink as DrinkIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
  }).format(price);
};

const getProductIcon = (categoria) => {
  return categoria === 'Tamales' ? <RestaurantIcon /> : <DrinkIcon />;
};

const getProductColor = (categoria) => {
  return categoria === 'Tamales' ? 'primary' : 'info';
};

export default function ProductCardReal({ product, precios, onView, onCalculatePrice }) {
  // Obtener los atributos principales para mostrar
  const atributosPrincipales = product.atributosPersonalizables
    .filter(attr => attr.esObligatorio)
    .slice(0, 2); // Mostrar solo los 2 primeros atributos obligatorios

  const precioMinimo = Math.min(...precios.map(p => p.precio));
  const precioMaximo = Math.max(...precios.map(p => p.precio));

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: (theme) => theme.shadows[8],
        },
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header con icono y categoría */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: getProductColor(product.categoriaNombre) + '.main',
              width: 48,
              height: 48,
            }}
          >
            {getProductIcon(product.categoriaNombre)}
          </Avatar>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {product.nombre}
            </Typography>
            <Chip
              label={product.categoriaNombre}
              size="small"
              color={getProductColor(product.categoriaNombre)}
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Descripción */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.descripcion}
        </Typography>

        {/* Precio base y rango */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Precio base: <strong>{formatPrice(product.precioBase)}</strong>
          </Typography>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
            {precioMinimo === precioMaximo 
              ? formatPrice(precioMinimo)
              : `${formatPrice(precioMinimo)} - ${formatPrice(precioMaximo)}`
            }
          </Typography>
        </Box>

        {/* Variantes disponibles */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Variantes disponibles:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {precios.map((precio, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  {precio.nombre}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatPrice(precio.precio)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Atributos personalizables principales */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Opciones de personalización:
          </Typography>
          {atributosPrincipales.map((atributo) => (
            <Box key={atributo.id} sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {atributo.nombre}:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                {atributo.opciones.slice(0, 3).map((opcion) => (
                  <Chip
                    key={opcion.id}
                    label={opcion.nombre}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem' }}
                  />
                ))}
                {atributo.opciones.length > 3 && (
                  <Chip
                    label={`+${atributo.opciones.length - 3} más`}
                    size="small"
                    variant="outlined"
                    color="secondary"
                    sx={{ fontSize: '0.75rem' }}
                  />
                )}
              </Box>
            </Box>
          ))}
        </Box>

        {/* Información adicional */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            icon={<SettingsIcon />}
            label={`${product.atributosPersonalizables.length} opciones`}
            size="small"
            variant="filled"
            color="secondary"
          />
          <Chip
            label={`${product.variantes.length} variantes`}
            size="small"
            variant="filled"
            color="info"
          />
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ViewIcon />}
          onClick={onView}
          size="small"
        >
          Ver Detalles
        </Button>
        
        <Tooltip title="Calcular precio personalizado">
          <IconButton
            onClick={onCalculatePrice}
            color="primary"
            size="small"
            sx={{ 
              bgcolor: 'primary.light',
              color: 'primary.main',
              '&:hover': { bgcolor: 'primary.main', color: 'white' }
            }}
          >
            <CalculateIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}