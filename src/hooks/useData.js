import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  productosService,
  combosService,
  ventasService,
  inventarioService,
  dashboardService,
  sucursalesService,
  llmService
} from '../services/api';
import { handleApiError } from '../services/api';

// Hook para todos los productos
export const useProductos = () => {
  return useQuery({
    queryKey: ['productos'],
    queryFn: () => productosService.getAll().then(res => res.data),
    onError: (error) => {
      console.error('Error al cargar productos:', handleApiError(error));
    },
  });
};

// Hook para categorías
export const useCategorias = () => {
  return useQuery({
    queryKey: ['categorias'],
    queryFn: () => productosService.getCategorias().then(res => res.data),
    onError: (error) => {
      console.error('Error al cargar categorías:', handleApiError(error));
    },
  });
};

// Hook para productos por categoría
export const useProductosPorCategoria = (categoriaId) => {
  return useQuery({
    queryKey: ['productos', 'categoria', categoriaId],
    queryFn: () => productosService.getByCategoria(categoriaId).then(res => res.data),
    enabled: !!categoriaId,
    onError: (error) => {
      console.error('Error al cargar productos por categoría:', handleApiError(error));
    },
  });
};

// Hook para tamales (productos de categoría tamales)
export const useTamales = () => {
  return useProductosPorCategoria(1); // Asumiendo que tamales es categoría 1
};

// Hook para bebidas (productos de categoría bebidas)  
export const useBebidas = () => {
  return useProductosPorCategoria(2); // Asumiendo que bebidas es categoría 2
};

// Hook para producto específico por ID
export const useProducto = (id) => {
  return useQuery({
    queryKey: ['productos', id],
    queryFn: () => productosService.getById(id).then(res => res.data),
    enabled: !!id,
    onError: (error) => {
      console.error('Error al cargar producto:', handleApiError(error));
    },
  });
};

// Hook para calcular precio de producto
export const useCalcularPrecio = () => {
  return useMutation({
    mutationFn: (data) => productosService.calcularPrecio(data),
    onError: (error) => {
      console.error('Error al calcular precio:', handleApiError(error));
    },
  });
};

// Hooks de backward compatibility (si necesitas mantener la misma interfaz)
export const useTamalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ action, id, data }) => {
      // Como no hay endpoints de CRUD individual, esto sería para administración
      // Podrías implementar endpoints de administración o manejar esto diferente
      throw new Error('Funcionalidad de administración no implementada en esta API');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['productos']);
    },
    onError: (error) => {
      console.error('Error en operación de tamal:', handleApiError(error));
    },
  });
};

export const useBebidaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ action, id, data }) => {
      // Como no hay endpoints de CRUD individual, esto sería para administración
      throw new Error('Funcionalidad de administración no implementada en esta API');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['productos']);
    },
    onError: (error) => {
      console.error('Error en operación de bebida:', handleApiError(error));
    },
  });
};

// Hook para combos
export const useCombos = () => {
  return useQuery({
    queryKey: ['combos'],
    queryFn: () => combosService.getAll().then(res => res.data),
  });
};

export const useComboMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ action, id, data }) => {
      switch (action) {
        case 'create':
          return combosService.create(data);
        case 'update':
          return combosService.update(id, data);
        case 'delete':
          return combosService.delete(id);
        case 'updateEstacional':
          return combosService.updateEstacional(id, data);
        default:
          throw new Error('Acción no válida');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['combos']);
    },
  });
};

// Hook para ventas
export const useVentas = (params = {}) => {
  return useQuery({
    queryKey: ['ventas', params],
    queryFn: () => ventasService.getAll(params).then(res => res.data),
  });
};

export const useVentasPorSucursal = (sucursalId, params = {}) => {
  return useQuery({
    queryKey: ['ventas', 'sucursal', sucursalId, params],
    queryFn: () => ventasService.getBySucursal(sucursalId, params).then(res => res.data),
    enabled: !!sucursalId,
    onError: (error) => {
      console.error('Error al cargar ventas por sucursal:', handleApiError(error));
    },
  });
};

export const useVenta = (id) => {
  return useQuery({
    queryKey: ['ventas', id],
    queryFn: () => ventasService.getById(id).then(res => res.data),
    enabled: !!id,
    onError: (error) => {
      console.error('Error al cargar venta:', handleApiError(error));
    },
  });
};


export const useVentaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => ventasService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['ventas']);
      queryClient.invalidateQueries(['dashboard']);
      queryClient.invalidateQueries(['inventario']);
    },
    onError: (error) => {
      console.error('Error al crear venta:', handleApiError(error));
    },
  });
};

// Hook para reportes de ventas
export const useReporteVentas = (tipo, params) => {
  return useQuery({
    queryKey: ['reporteVentas', tipo, params],
    queryFn: () => {
      switch (tipo) {
        case 'diario':
          return ventasService.getReporteDiario(params.fecha).then(res => res.data);
        case 'mensual':
          return ventasService.getReporteMensual(params.año, params.mes).then(res => res.data);
        case 'topProducts':
          return ventasService.getTopProducts(params).then(res => res.data);
        default:
          throw new Error('Tipo de reporte no válido');
      }
    },
    enabled: !!params,
  });
};

// Hook para inventario
export const useInventario = () => {
  const materiasPrimas = useQuery({
    queryKey: ['inventario', 'materiasPrimas'],
    queryFn: () => inventarioService.getMateriasPrimas().then(res => res.data),
  });

  const empaques = useQuery({
    queryKey: ['inventario', 'empaques'],
    queryFn: () => inventarioService.getEmpaques().then(res => res.data),
  });

  return { materiasPrimas, empaques };
};

export const useInventarioMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ action, id, data }) => {
      switch (action) {
        case 'updateMateriaPrima':
          return inventarioService.updateMateriaPrima(id, data);
        case 'updateEmpaque':
          return inventarioService.updateEmpaque(id, data);
        case 'registrarEntrada':
          return inventarioService.registrarEntrada(data);
        case 'registrarSalida':
          return inventarioService.registrarSalida(data);
        case 'registrarMerma':
          return inventarioService.registrarMerma(data);
        default:
          throw new Error('Acción no válida');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['inventario']);
    },
  });
};


// Hook para dashboard
export const useDashboard = (sucursalId) => {

  const indicadores = useQuery({
    queryKey: ['dashboard', 'indicadores'],
    queryFn: () => dashboardService.getDashbardData(sucursalId).then(res => res.data),
    enabled: !!sucursalId,
    refetchInterval: 5 * 60 * 1000, // Actualizar cada 5 minutos
  });

  return {
    indicadores,
  };
};

// Hook para sucursales
export const useSucursales = () => {
  return useQuery({
    queryKey: ['sucursales'],
    queryFn: () => sucursalesService.getAll().then(res => res.data),
  });
};

export const useSucursalMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ action, id, data }) => {
      switch (action) {
        case 'create':
          return sucursalesService.create(data);
        case 'update':
          return sucursalesService.update(id, data);
        case 'delete':
          return sucursalesService.delete(id);
        default:
          throw new Error('Acción no válida');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sucursales']);
    },
  });
};

// Hook para reportes de sucursales
export const useReportesSucursal = (sucursalId, params) => {
  return useQuery({
    queryKey: ['sucursales', sucursalId, 'reportes', params],
    queryFn: () => sucursalesService.getReportes(sucursalId, params).then(res => res.data),
    enabled: !!sucursalId,
  });
};

// Hook para LLM/IA
export const useLLM = () => {
  return useMutation({
    mutationFn: ({ action, data }) => {
      switch (action) {
        case 'chat':
          return llmService.chat(data);
        case 'analyze':
          return llmService.analyze(data);
        case 'suggestions':
          return llmService.suggestions(data);
        default:
          throw new Error('Acción no válida');
      }
    },
  });
};

// Hook personalizado para notificaciones
export const useNotifications = () => {
  const queryClient = useQueryClient();

  const showNotification = (message, type = 'info') => {
    // Aquí podrías integrar con una librería de notificaciones como react-hot-toast
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  return { showNotification };
};

// Hook para manejo de errores globales
export const useErrorHandler = () => {
  const handleError = (error, context = '') => {
    const errorInfo = handleApiError(error);
    console.error(`Error en ${context}:`, errorInfo);

    // Aquí podrías mostrar notificaciones de error al usuario
    return errorInfo;
  };

  return { handleError };
};