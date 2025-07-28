import { useState } from 'react';
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
  IconButton,
  Dialog,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restaurant as RestaurantIcon,
  LocalDrink as DrinkIcon,
} from '@mui/icons-material';
import { useTamales, useBebidas, useTamalMutation, useBebidaMutation } from '../../hooks/useData';
import ProductCard from '../../components/cards/ProductCard';
import TamalForm from '../../components/forms/TamalForm';
import BebidaForm from '../../components/forms/BebidaForm';

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
  const [openTamalForm, setOpenTamalForm] = useState(false);
  const [openBebidaForm, setOpenBebidaForm] = useState(false);
  const [editingTamal, setEditingTamal] = useState(null);
  const [editingBebida, setEditingBebida] = useState(null);

  const { data: tamales, isLoading: loadingTamales, error: errorTamales } = useTamales();
  const { data: bebidas, isLoading: loadingBebidas, error: errorBebidas } = useBebidas();
  
  const tamalMutation = useTamalMutation();
  const bebidaMutation = useBebidaMutation();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCreateTamal = () => {
    setEditingTamal(null);
    setOpenTamalForm(true);
  };

  const handleEditTamal = (tamal) => {
    setEditingTamal(tamal);
    setOpenTamalForm(true);
  };

  const handleDeleteTamal = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este tamal?')) {
      try {
        await tamalMutation.mutateAsync({ action: 'delete', id });
      } catch (error) {
        console.error('Error al eliminar tamal:', error);
      }
    }
  };

  const handleCreateBebida = () => {
    setEditingBebida(null);
    setOpenBebidaForm(true);
  };

  const handleEditBebida = (bebida) => {
    setEditingBebida(bebida);
    setOpenBebidaForm(true);
  };

  const handleDeleteBebida = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta bebida?')) {
      try {
        await bebidaMutation.mutateAsync({ action: 'delete', id });
      } catch (error) {
        console.error('Error al eliminar bebida:', error);
      }
    }
  };

  const handleCloseForms = () => {
    setOpenTamalForm(false);
    setOpenBebidaForm(false);
    setEditingTamal(null);
    setEditingBebida(null);
  };

  if (errorTamales || errorBebidas) {
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
          Gestión de Productos
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Administra tamales y bebidas de La Cazuela Chapina
        </Typography>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <Tab 
              icon={<RestaurantIcon />} 
              label="Tamales" 
              iconPosition="start"
            />
            <Tab 
              icon={<DrinkIcon />} 
              label="Bebidas" 
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Panel de Tamales */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">
              Tamales Disponibles ({tamales?.length || 0})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateTamal}
              sx={{ borderRadius: 2 }}
            >
              Nuevo Tamal
            </Button>
          </Box>

          {loadingTamales ? (
            <Grid container spacing={3}>
              {[1, 2, 3, 4].map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
                  <Card sx={{ height: 300 }}>
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
              {tamales?.map((tamal) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={tamal.id}>
                  <ProductCard
                    product={tamal}
                    type="tamal"
                    onEdit={() => handleEditTamal(tamal)}
                    onDelete={() => handleDeleteTamal(tamal.id)}
                  />
                </Grid>
              ))}
              {(!tamales || tamales.length === 0) && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                      <RestaurantIcon 
                        sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} 
                      />
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        No hay tamales registrados
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Comienza agregando tu primer tamal
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateTamal}
                      >
                        Agregar Tamal
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </TabPanel>

        {/* Panel de Bebidas */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6">
              Bebidas Disponibles ({bebidas?.length || 0})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateBebida}
              sx={{ borderRadius: 2 }}
            >
              Nueva Bebida
            </Button>
          </Box>

          {loadingBebidas ? (
            <Grid container spacing={3}>
              {[1, 2, 3, 4].map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
                  <Card sx={{ height: 300 }}>
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
              {bebidas?.map((bebida) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={bebida.id}>
                  <ProductCard
                    product={bebida}
                    type="bebida"
                    onEdit={() => handleEditBebida(bebida)}
                    onDelete={() => handleDeleteBebida(bebida.id)}
                  />
                </Grid>
              ))}
              {(!bebidas || bebidas.length === 0) && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                      <DrinkIcon 
                        sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} 
                      />
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                        No hay bebidas registradas
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Comienza agregando tu primera bebida
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleCreateBebida}
                      >
                        Agregar Bebida
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </TabPanel>
      </Card>

      {/* Formularios */}
      <Dialog
        open={openTamalForm}
        onClose={handleCloseForms}
        maxWidth="md"
        fullWidth
      >
        <TamalForm
          tamal={editingTamal}
          onClose={handleCloseForms}
          onSubmit={async (data) => {
            const action = editingTamal ? 'update' : 'create';
            const id = editingTamal?.id;
            await tamalMutation.mutateAsync({ action, id, data });
            handleCloseForms();
          }}
        />
      </Dialog>

      <Dialog
        open={openBebidaForm}
        onClose={handleCloseForms}
        maxWidth="md"
        fullWidth
      >
        <BebidaForm
          bebida={editingBebida}
          onClose={handleCloseForms}
          onSubmit={async (data) => {
            const action = editingBebida ? 'update' : 'create';
            const id = editingBebida?.id;
            await bebidaMutation.mutateAsync({ action, id, data });
            handleCloseForms();
          }}
        />
      </Dialog>
    </Box>
  );
}