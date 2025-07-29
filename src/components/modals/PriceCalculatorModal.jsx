import { useState, useEffect } from 'react';
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Button,
    Grid,
    Card,
    CardContent,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    FormGroup,
    Divider,
    Alert,
    CircularProgress,
    TextField,
} from '@mui/material';
import {
    Close as CloseIcon,
    Calculate as CalculateIcon,
    ShoppingCart as CartIcon,
} from '@mui/icons-material';

const formatPrice = (price) => {
    return new Intl.NumberFormat('es-GT', {
        style: 'currency',
        currency: 'GTQ',
    }).format(price);
};

export default function PriceCalculatorModal({ product, onClose, onCalculate }) {
    const [selectedVariante, setSelectedVariante] = useState(product.variantes[0]?.id || null);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [cantidad, setCantidad] = useState(1);
    const [calculatedPrice, setCalculatedPrice] = useState(null);
    const [calculating, setCalculating] = useState(false);
    const [error, setError] = useState(null);

    // Inicializar opciones seleccionadas con valores por defecto
    useEffect(() => {
        const defaultOptions = {};
        product.atributosPersonalizables.forEach(atributo => {
            if (atributo.esObligatorio && !atributo.permiteMultiple) {
                // Seleccionar la primera opción para atributos obligatorios de selección única
                defaultOptions[atributo.id] = atributo.opciones[0]?.id;
            } else if (atributo.permiteMultiple) {
                // Inicializar array vacío para atributos de selección múltiple
                defaultOptions[atributo.id] = [];
            }
        });
        setSelectedOptions(defaultOptions);
    }, [product]);

    const handleVarianteChange = (event) => {
        setSelectedVariante(parseInt(event.target.value));
        setCalculatedPrice(null);
    };

    const handleCantidadChange = (event) => {
        const newCantidad = Math.max(1, parseInt(event.target.value) || 1);
        setCantidad(newCantidad);
        setCalculatedPrice(null);
    };

    const handleOptionChange = (atributoId, opcionId, permiteMultiple) => {
        setSelectedOptions(prev => {
            if (permiteMultiple) {
                const currentOptions = prev[atributoId] || [];
                const newOptions = currentOptions.includes(opcionId)
                    ? currentOptions.filter(id => id !== opcionId)
                    : [...currentOptions, opcionId];
                return { ...prev, [atributoId]: newOptions };
            } else {
                return { ...prev, [atributoId]: opcionId };
            }
        });
        setCalculatedPrice(null);
    };

    const validateSelection = () => {
        for (const atributo of product.atributosPersonalizables) {
            if (atributo.esObligatorio) {
                const selected = selectedOptions[atributo.id];
                if (atributo.permiteMultiple) {
                    if (!selected || selected.length === 0) {
                        return `Debes seleccionar al menos una opción para ${atributo.nombre}`;
                    }
                } else {
                    if (!selected) {
                        return `Debes seleccionar una opción para ${atributo.nombre}`;
                    }
                }
            }
        }
        return null;
    };

    // Obtener todos los IDs de opciones seleccionadas como array plano
    const getPersonalizacionIds = () => {
        const ids = [];
        Object.values(selectedOptions).forEach(value => {
            if (Array.isArray(value)) {
                ids.push(...value);
            } else if (value) {
                ids.push(value);
            }
        });
        return ids;
    };

    const handleCalculatePrice = async () => {
        const validationError = validateSelection();
        if (validationError) {
            setError(validationError);
            return;
        }

        setCalculating(true);
        setError(null);

        try {
            // Preparar datos según el formato esperado por la API
            const configData = {
                productoId: product.id,
                varianteId: selectedVariante,
                cantidad: cantidad,
                personalizacionIds: getPersonalizacionIds()
            };

            console.log('Enviando datos para calcular precio:', configData);

            const response = await onCalculate(configData);
            setCalculatedPrice(response.data);
        } catch (error) {
            console.error('Error al calcular precio:', error);
            setError(error.response?.data?.message || 'Error al calcular el precio. Por favor, inténtalo de nuevo.');
        } finally {
            setCalculating(false);
        }
    };

    // Calcular precio estimado localmente (sin llamada a API)
    const getEstimatedPrice = () => {
        const variante = product.variantes.find(v => v.id === selectedVariante);
        if (!variante) return 0;

        let precioBase = product.precioBase * variante.multiplicador;
        let precioAdicional = 0;

        Object.entries(selectedOptions).forEach(([atributoId, opciones]) => {
            const atributo = product.atributosPersonalizables.find(a => a.id === parseInt(atributoId));
            if (atributo) {
                const opcionesArray = Array.isArray(opciones) ? opciones : [opciones];
                opcionesArray.forEach(opcionId => {
                    const opcion = atributo.opciones.find(o => o.id === opcionId);
                    if (opcion) {
                        precioAdicional += opcion.precioAdicional;
                    }
                });
            }
        });

        return (precioBase + precioAdicional) * cantidad;
    };

    const selectedVarianteObj = product.variantes.find(v => v.id === selectedVariante);
    const estimatedPrice = getEstimatedPrice();

    return (
        <>
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CalculateIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Calcular Precio - {product.nombre}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={3}>
                    {/* Cantidad */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    Cantidad
                                </Typography>
                                <TextField
                                    type="number"
                                    value={cantidad}
                                    onChange={handleCantidadChange}
                                    inputProps={{ min: 1, max: 100 }}
                                    fullWidth
                                    label="Cantidad deseada"
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Selección de Variante */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <FormControl component="fieldset" fullWidth>
                                    <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
                                        Selecciona la variante
                                    </FormLabel>
                                    <RadioGroup
                                        value={selectedVariante}
                                        onChange={handleVarianteChange}
                                    >
                                        {product.variantes.map((variante) => {
                                            const precio = product.precioBase * variante.multiplicador;
                                            return (
                                                <FormControlLabel
                                                    key={variante.id}
                                                    value={variante.id}
                                                    control={<Radio />}
                                                    label={
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                            <Box>
                                                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                                    {variante.nombre}
                                                                </Typography>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {variante.cantidadUnidades > 1
                                                                        ? `${variante.cantidadUnidades} unidades`
                                                                        : variante.volumenMl
                                                                            ? `${variante.volumenMl}ml`
                                                                            : '1 unidad'
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
                                                                {formatPrice(precio)}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            );
                                        })}
                                    </RadioGroup>
                                </FormControl>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Atributos Personalizables */}
                    {product.atributosPersonalizables.map((atributo) => (
                        <Grid item xs={12} key={atributo.id}>
                            <Card>
                                <CardContent>
                                    <FormControl component="fieldset" fullWidth>
                                        <FormLabel component="legend" sx={{ fontWeight: 600, mb: 2 }}>
                                            {atributo.nombre}
                                            {atributo.esObligatorio && (
                                                <Typography component="span" color="error.main"> *</Typography>
                                            )}
                                        </FormLabel>

                                        {atributo.permiteMultiple ? (
                                            <FormGroup>
                                                {atributo.opciones.map((opcion) => (
                                                    <FormControlLabel
                                                        key={opcion.id}
                                                        control={
                                                            <Checkbox
                                                                checked={(selectedOptions[atributo.id] || []).includes(opcion.id)}
                                                                onChange={() => handleOptionChange(atributo.id, opcion.id, true)}
                                                            />
                                                        }
                                                        label={
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                                <Typography variant="body1">
                                                                    {opcion.nombre}
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    color={opcion.precioAdicional > 0 ? 'warning.main' : 'success.main'}
                                                                    sx={{ fontWeight: 600 }}
                                                                >
                                                                    {opcion.precioAdicional > 0
                                                                        ? `+${formatPrice(opcion.precioAdicional)}`
                                                                        : 'Incluido'
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />
                                                ))}
                                            </FormGroup>
                                        ) : (
                                            <RadioGroup
                                                value={selectedOptions[atributo.id] || ''}
                                                onChange={(e) => handleOptionChange(atributo.id, parseInt(e.target.value), false)}
                                            >
                                                {atributo.opciones.map((opcion) => (
                                                    <FormControlLabel
                                                        key={opcion.id}
                                                        value={opcion.id}
                                                        control={<Radio />}
                                                        label={
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                                <Typography variant="body1">
                                                                    {opcion.nombre}
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    color={opcion.precioAdicional > 0 ? 'warning.main' : 'success.main'}
                                                                    sx={{ fontWeight: 600 }}
                                                                >
                                                                    {opcion.precioAdicional > 0
                                                                        ? `+${formatPrice(opcion.precioAdicional)}`
                                                                        : 'Incluido'
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                        }
                                                    />
                                                ))}
                                            </RadioGroup>
                                        )}
                                    </FormControl>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}

                    {/* Resumen de Precio */}
                    <Grid item xs={12}>
                        <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                    Resumen del Precio
                                </Typography>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">
                                        {selectedVarianteObj?.nombre} (precio base):
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {formatPrice(product.precioBase * (selectedVarianteObj?.multiplicador || 1))}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body1">
                                        Cantidad:
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        {cantidad} {cantidad === 1 ? 'unidad' : 'unidades'}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />

                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h6">
                                        Precio estimado total:
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                        {formatPrice(estimatedPrice)}
                                    </Typography>
                                </Box>

                                {calculatedPrice && (
                                    <Alert severity="success" sx={{ mt: 2 }}>
                                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                            Precio calculado exacto: {formatPrice(calculatedPrice.precioFinal || calculatedPrice)}
                                        </Typography>
                                        {calculatedPrice.desglose && (
                                            <Typography variant="body2">
                                                {calculatedPrice.desglose}
                                            </Typography>
                                        )}
                                    </Alert>
                                )}

                                {error && (
                                    <Alert severity="error" sx={{ mt: 2 }}>
                                        {error}
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3, gap: 2 }}>
                <Button
                    onClick={onClose}
                    startIcon={<CloseIcon />}
                    variant="outlined"
                >
                    Cerrar
                </Button>

                <Button
                    onClick={handleCalculatePrice}
                    startIcon={calculating ? <CircularProgress size={20} /> : <CalculateIcon />}
                    variant="contained"
                    disabled={calculating}
                >
                    {calculating ? 'Calculando...' : 'Calcular Precio Exacto'}
                </Button>

                <Button
                    startIcon={<CartIcon />}
                    variant="contained"
                    color="secondary"
                    disabled={!!validateSelection()}
                >
                    Agregar al Carrito
                </Button>
            </DialogActions>
        </>
    );
}