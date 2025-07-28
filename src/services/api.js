import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:7001/api';

// Crear instancia de axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests
apiClient.interceptors.request.use(
  (config) => {
    // Agregar token de autenticación si existe
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo global de errores
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de API organizados por módulos
export const tamalesService = {
  // Obtener todos los tamales
  getAll: () => apiClient.get('/tamales'),
  
  // Crear nuevo tamal
  create: (data) => apiClient.post('/tamales', data),
  
  // Actualizar tamal
  update: (id, data) => apiClient.put(`/tamales/${id}`, data),
  
  // Eliminar tamal
  delete: (id) => apiClient.delete(`/tamales/${id}`),
  
  // Obtener por ID
  getById: (id) => apiClient.get(`/tamales/${id}`),
};

export const bebidasService = {
  getAll: () => apiClient.get('/bebidas'),
  create: (data) => apiClient.post('/bebidas', data),
  update: (id, data) => apiClient.put(`/bebidas/${id}`, data),
  delete: (id) => apiClient.delete(`/bebidas/${id}`),
  getById: (id) => apiClient.get(`/bebidas/${id}`),
};

export const combosService = {
  getAll: () => apiClient.get('/combos'),
  create: (data) => apiClient.post('/combos', data),
  update: (id, data) => apiClient.put(`/combos/${id}`, data),
  delete: (id) => apiClient.delete(`/combos/${id}`),
  getById: (id) => apiClient.get(`/combos/${id}`),
  // Combos estacionales
  getEstacionales: () => apiClient.get('/combos/estacionales'),
  updateEstacional: (id, data) => apiClient.put(`/combos/estacionales/${id}`, data),
};

export const ventasService = {
  getAll: (params) => apiClient.get('/ventas', { params }),
  create: (data) => apiClient.post('/ventas', data),
  getById: (id) => apiClient.get(`/ventas/${id}`),
  // Reportes de ventas
  getReporteDiario: (fecha) => apiClient.get(`/ventas/reporte/diario?fecha=${fecha}`),
  getReporteMensual: (año, mes) => apiClient.get(`/ventas/reporte/mensual?año=${año}&mes=${mes}`),
  getTopProducts: (params) => apiClient.get('/ventas/top-productos', { params }),
};

export const inventarioService = {
  // Materias primas
  getMateriasPrimas: () => apiClient.get('/inventario/materias-primas'),
  updateMateriaPrima: (id, data) => apiClient.put(`/inventario/materias-primas/${id}`, data),
  registrarEntrada: (data) => apiClient.post('/inventario/entradas', data),
  registrarSalida: (data) => apiClient.post('/inventario/salidas', data),
  registrarMerma: (data) => apiClient.post('/inventario/mermas', data),
  
  // Empaques
  getEmpaques: () => apiClient.get('/inventario/empaques'),
  updateEmpaque: (id, data) => apiClient.put(`/inventario/empaques/${id}`, data),
  
  // Reportes de inventario
  getReporteStock: () => apiClient.get('/inventario/reporte/stock'),
  getReporteMermas: (params) => apiClient.get('/inventario/reporte/mermas', { params }),
};

export const dashboardService = {
  getIndicadores: () => apiClient.get('/dashboard/indicadores'),
  getVentasPorHora: (fecha) => apiClient.get(`/dashboard/ventas-por-hora?fecha=${fecha}`),
  getProductosPopulares: (params) => apiClient.get('/dashboard/productos-populares', { params }),
  getUtilidadesPorLinea: () => apiClient.get('/dashboard/utilidades-por-linea'),
};

export const sucursalesService = {
  getAll: () => apiClient.get('/sucursales'),
  create: (data) => apiClient.post('/sucursales', data),
  update: (id, data) => apiClient.put(`/sucursales/${id}`, data),
  delete: (id) => apiClient.delete(`/sucursales/${id}`),
  getReportes: (id, params) => apiClient.get(`/sucursales/${id}/reportes`, { params }),
};

// Servicio para integración con LLM (OpenRouter)
export const llmService = {
  chat: (data) => apiClient.post('/llm/chat', data),
  analyze: (data) => apiClient.post('/llm/analyze', data),
  suggestions: (data) => apiClient.post('/llm/suggestions', data),
};

// Utilidades para manejo de errores
export const handleApiError = (error) => {
  if (error.response) {
    // El servidor respondió con un código de error
    return {
      message: error.response.data?.message || 'Error del servidor',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // La petición fue hecha pero no hubo respuesta
    return {
      message: 'No se pudo conectar con el servidor',
      status: 0,
    };
  } else {
    // Error al configurar la petición
    return {
      message: error.message || 'Error desconocido',
      status: -1,
    };
  }
};

export default apiClient;