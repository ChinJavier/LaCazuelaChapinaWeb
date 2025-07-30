import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Dialog,
  Alert,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Groups as GroupsIcon,
  Star as StarIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useCombos, useComboMutation } from '../../hooks/useData';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`combos-tabpanel-${index}`}
      aria-labelledby={`combos-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const COMBOS_PREDEFINIDOS = [
  {
    id: 'familiar',
    nombre: 'Combo Familiar "Fiesta Patronal"',
    descripcion: 'Una docena surtida de tamales y dos jarros familiares',
    precio: 180,
    incluye: [
      '12 tamales surtidos',
      '2 jarros de 1L (bebida a elección)',
      'Salsas variadas'
    ],
    tipo: 'familiar',
    disponible: true,
  },
  {
    id: 'eventos',
    nombre: 'Combo Eventos "Madrugada del 24"',
    descripcion: 'Perfecto para celebraciones especiales',
    precio: 450,
    incluye: [
      '36 tamales surtidos (3 docenas)',
      '4 jarros de 1L (bebidas variadas)',
      '1 termo de barro conmemorativo',
      'Salsas y complementos'
    ],
    tipo: 'eventos',
    disponible: true,
  },
];

export default function Combos() {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState(null);

  const { data: combos, isLoading, error } = useCombos();
  const comboMutation = useComboMutation();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
    }).format(price);
  };

  const ComboCard = ({ combo, isPredefinido = false }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {combo.nombre}
          </Typography>
          {isPredefinido && (
            <Chip
              label="Predefinido"
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {combo.descripcion}
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
          {formatPrice(combo.precio)}
        </Typography>

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Incluye:
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2 }}>
          {combo.incluye?.map((item, index) => (
            <Typography key={index} variant="body2" component="li" sx={{ mb: 0.5 }}>
              {item}
            </Typography>
          ))}
        </Box>

        <Box sx={{ mt: 2 }}>
          <Chip
            label={combo.disponible ? 'Disponible' : 'No disponible'}
            color={combo.disponible ? 'success' : 'error'}
            size="small"
          />
        </Box>
      </CardContent>

      <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button
  variant="contained"
  startIcon={<CartIcon />}
  onClick={() => handleAddComboToCart(combo)}
>
  Agregar al Carrito
</Button>

        <IconButton
          size="small"
          color="primary"
          onClick={() => {
            setSelectedCombo(combo);
            setOpenDialog(true);
          }}
        >
          <EditIcon />
        </IconButton>
        {!isPredefinido && (
          <IconButton
            size="small"
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Card>
  );

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al cargar los combos. Por favor, inténtalo de nuevo.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
          Gestión de Combos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Administra combos predefinidos y estacionales
        </Typography>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3, padding:  5 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab 
              icon={<GroupsIcon />} 
              label="Combos Fijos" 
              iconPosition="start"
            />
            <Tab 
              icon={<EventIcon />} 
              label="Combos Estacionales" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Panel de Combos Fijos */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">
              Combos Predefinidos
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {COMBOS_PREDEFINIDOS.map((combo) => (
              <Grid item xs={12} md={6} lg={4} key={combo.id}>
                <ComboCard combo={combo} isPredefinido={true} />
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Panel de Combos Estacionales */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">
              Combos Estacionales
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setSelectedCombo(null);
                setOpenDialog(true);
              }}
            >
              Nuevo Combo Estacional
            </Button>
          </Box>

          {isLoading ? (
            <Grid container spacing={3}>
              {[1, 2, 3].map((item) => (
                <Grid item xs={12} md={6} lg={4} key={item}>
                  <Card sx={{ height: 300 }}>
                    <CardContent>
                      <Typography color="text.secondary">Cargando...</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : combos?.estacionales?.length > 0 ? (
            <Grid container spacing={3}>
              {combos.estacionales.map((combo) => (
                <Grid item xs={12} md={6} lg={4} key={combo.id}>
                  <ComboCard combo={combo} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <StarIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No hay combos estacionales
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Crea combos especiales para fechas importantes como Cuaresma, Navidad, etc.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setSelectedCombo(null);
                    setOpenDialog(true);
                  }}
                >
                  Crear Combo Estacional
                </Button>
              </CardContent>
            </Card>
          )}
        </TabPanel>
      </Card>
    </Box>
  );
}