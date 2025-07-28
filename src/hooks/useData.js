import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  tamalesService, 
  bebidasService, 
  combosService, 
  ventasService, 
  inventarioService,
  dashboardService,
  sucursalesService,
  llmService 
} from '../services/api';
import { handleApiError } from '../services/api';

// Hook para tamales
export const useTamales = () => {
  return useQuery({
    queryKey: ['tamales'],
    queryFn: () => tamalesService.getAll().then(res => res.data),
    onError: (error) => {
      console.error('Error al cargar tamales:', handleApiError(error));
    },
  });
};

export const useTamalMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ action, id, data }) => {
      switch (action) {
        case 'create':
          return tamalesService.create(data);
        case 'update':
          return tamalesService.update(id, data);
        case 'delete':
          return tamalesService.delete(id);
        default:
          throw new Error('Acción no válida');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tamales']);
    },
    onError: (error) => {
      console.error('Error en operación de tamal:', handleApiError(error));
    },
  });
};

// Hook para bebidas
export const useBebidas = () => {
  return useQuery({
    queryKey: ['bebidas'],
    queryFn: () => bebidasService.getAll().then(res => res.data),
    onError: (error) => {
      console.error('Error al cargar bebidas:', handleApiError(error));
    },
  });
};

export const useBebidaMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ action, id, data }) => {
      switch (action) {
        case 'create':
          return bebidasService.create(data);
        case 'update':
          return bebidasService.update(id, data);
        case 'delete':
          return bebidasService.delete(id);
        default:
          throw new Error('Acción no válida');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['bebidas']);
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

export const useVentaMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => ventasService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['ventas']);
      queryClient.invalidateQueries(['dashboard']);
      queryClient.invalidateQueries(['inventario']);
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
export const useDashboard = () => {
  const indicadores = useQuery({
    queryKey: ['dashboard', 'indicadores'],
    queryFn: () => dashboardService.getIndicadores().then(res => res.data),
    refetchInterval: 5 * 60 * 1000, // Actualizar cada 5 minutos
  });

  const ventasPorHora = useQuery({
    queryKey: ['dashboard', 'ventasPorHora', new Date().toISOString().split('T')[0]],
    queryFn: () => dashboardService.getVentasPorHora(new Date().toISOString().split('T')[0]).then(res => res.data),
  });

  const productosPopulares = useQuery({
    queryKey: ['dashboard', 'productosPopulares'],
    queryFn: () => dashboardService.getProductosPopulares().then(res => res.data),
  });

  const utilidades = useQuery({
    queryKey: ['dashboard', 'utilidades'],
    queryFn: () => dashboardService.getUtilidadesPorLinea().then(res => res.data),
  });

  return {
    indicadores,
    ventasPorHora,
    productosPopulares,
    utilidades,
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