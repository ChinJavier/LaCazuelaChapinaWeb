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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
  LocalDrink as DrinkIcon,
  WhatshotOutlined as SpicyIcon,
} from '@mui/icons-material';

const getTypeIcon = (type) => {
  return type === 'tamal' ? <RestaurantIcon /> : <DrinkIcon />;
};

const getSpiceLevelColor = (level) => {
  switch (level?.toLowerCase()) {
    case 'sin chile':
      return 'success';
    case 'suave':
      return 'warning';
    case 'chapín':
      return 'error';
    default:
      return 'default';
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
  }).format(price);
};

export default function ProductCard({ product, type, onEdit, onDelete }) {
  const renderTamalDetails = () => (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        <Chip
          label={product.tipoMasa}
          size="small"
          color="primary"
          variant="outlined"
        />
        <Chip
          label={product.relleno}
          size="small"
          color="secondary"
          variant="outlined"
        />
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        <Chip
          label={product.envoltura}
          size="small"
          variant="outlined"
        />
        <Chip
          icon={<SpicyIcon />}
          label={product.nivelPicante}
          size="small"
          color={getSpiceLevelColor(product.nivelPicante)}
          variant="filled"
        />
      </Box>

      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Precios:
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
          <Typography variant="body2">
            Unidad: <strong>{formatPrice(product.precioUnidad)}</strong>
          </Typography>
          <Typography variant="body2">
            6 uds: <strong>{formatPrice(product.precioMediaDocena)}</strong>
          </Typography>
          <Typography variant="body2">
            12 uds: <strong>{formatPrice(product.precioDocena)}</strong>
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const renderBebidaDetails = () => (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        <Chip
          label={product.tipo}
          size="small"
          color="primary"
          variant="outlined"
        />
        <Chip
          label={product.endulzante}
          size="small"
          color="secondary"
          variant="outlined"
        />
      </Box>
      
      {product.toppings && product.toppings.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {product.toppings.map((topping, index) => (
            <Chip
              key={index}
              label={topping}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      )}

      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Precios:
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
          <Typography variant="body2">
            Vaso 12oz: <strong>{formatPrice(product.precioVaso)}</strong>
          </Typography>
          <Typography variant="body2">
            Jarro 1L: <strong>{formatPrice(product.precioJarro)}</strong>
          </Typography>
        </Box>
      </Box>
    </Box>
  );

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
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: type === 'tamal' ? 'primary.main' : 'info.main',
              width: 48,
              height: 48,
            }}
          >
            {getTypeIcon(type)}
          </Avatar>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {product.nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.descripcion}
            </Typography>
          </Box>
        </Box>

        {type === 'tamal' ? renderTamalDetails() : renderBebidaDetails()}

        {product.disponible === false && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label="No disponible"
              size="small"
              color="error"
              variant="filled"
            />
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
        <Tooltip title="Editar">
          <IconButton
            onClick={onEdit}
            color="primary"
            size="small"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Eliminar">
          <IconButton
            onClick={onDelete}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}