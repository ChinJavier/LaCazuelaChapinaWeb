import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Tipos de acciones para el reducer
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
};

// Estado inicial del carrito
const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
};

// Funciones auxiliares
function calculateTotal(items) {
  return items.reduce((total, item) => total + (item.precioUnitario * item.cantidad), 0);
}

function calculateItemCount(items) {
  return items.reduce((count, item) => count + item.cantidad, 0);
}

// Reducer del carrito
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const newItem = action.payload;
      
      // Buscar si ya existe un item con la misma configuración
      const existingItemIndex = state.items.findIndex(item => 
        item.productoId === newItem.productoId &&
        item.varianteProductoId === newItem.varianteProductoId &&
        item.comboId === newItem.comboId &&
        JSON.stringify(item.personalizaciones) === JSON.stringify(newItem.personalizaciones)
      );

      let newItems;
      if (existingItemIndex !== -1) {
        // Si existe, actualizar cantidad
        newItems = [...state.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          cantidad: newItems[existingItemIndex].cantidad + newItem.cantidad,
        };
      } else {
        // Si no existe, agregar nuevo item
        newItems = [...state.items, { ...newItem, id: Date.now() + Math.random() }];
      }

      const newTotal = calculateTotal(newItems);
      const newItemCount = calculateItemCount(newItems);

      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const newTotal = calculateTotal(newItems);
      const newItemCount = calculateItemCount(newItems);

      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { id, cantidad } = action.payload;
      
      if (cantidad <= 0) {
        // Si la cantidad es 0 o menor, eliminar el item
        return cartReducer(state, { type: CART_ACTIONS.REMOVE_ITEM, payload: id });
      }

      const newItems = state.items.map(item =>
        item.id === id ? { ...item, cantidad } : item
      );

      const newTotal = calculateTotal(newItems);
      const newItemCount = calculateItemCount(newItems);

      return {
        ...state,
        items: newItems,
        total: newTotal,
        itemCount: newItemCount,
      };
    }

    case CART_ACTIONS.CLEAR_CART: {
      return initialState;
    }

    case CART_ACTIONS.LOAD_CART: {
      const items = action.payload || [];
      const total = calculateTotal(items);
      const itemCount = calculateItemCount(items);

      return {
        items,
        total,
        itemCount,
      };
    }

    default:
      return state;
  }
}

// Hook personalizado para usar el carrito
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// Provider del carrito
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cazuela-chapina-cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData.items });
      }
    } catch (error) {
      console.error('Error al cargar carrito del localStorage:', error);
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    try {
      localStorage.setItem('cazuela-chapina-cart', JSON.stringify(state));
    } catch (error) {
      console.error('Error al guardar carrito en localStorage:', error);
    }
  }, [state]);

  // Funciones del carrito
  const addItem = (item) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
  };

  const removeItem = (id) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: id });
  };

  const updateQuantity = (id, cantidad) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id, cantidad } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Función para crear item del carrito a partir de configuración de producto
  const createCartItem = ({
    producto,
    variante,
    cantidad,
    personalizaciones = [],
    notas = '',
    precioCalculado,
    combo = null
  }) => {
    // Convertir personalizaciones al formato esperado por la API
    const personalizacionesAPI = personalizaciones.map(p => ({
      tipoAtributoId: p.atributoId,
      opcionAtributoId: p.opcionId,
    }));

    // Crear descripción legible de las personalizaciones
    const descripcionPersonalizaciones = personalizaciones.map(p => {
      const atributo = producto.atributosPersonalizables.find(a => a.id === p.atributoId);
      const opcion = atributo?.opciones.find(o => o.id === p.opcionId);
      return `${atributo?.nombre}: ${opcion?.nombre}`;
    }).join(', ');

    return {
      // IDs para la API
      productoId: producto.id,
      varianteProductoId: variante.id,
      comboId: combo?.id || 0,
      cantidad,
      notas,
      personalizaciones: personalizacionesAPI,
      
      // Información para mostrar en el carrito
      productoNombre: producto.nombre,
      varianteNombre: variante.nombre,
      comboNombre: combo?.nombre || null,
      descripcionPersonalizaciones,
      precioUnitario: precioCalculado || (producto.precioBase * variante.multiplicador),
      categoria: producto.categoriaNombre,
      
      // Metadata
      fechaAgregado: new Date().toISOString(),
    };
  };

  // Función para obtener items del carrito en formato para la API de ventas
  const getCartForAPI = (clienteInfo, sucursalId = 1) => {
    return {
      sucursalId,
      clienteNombre: clienteInfo.nombre,
      clienteTelefono: clienteInfo.telefono || '',
      tipoPago: Number(clienteInfo.tipoPago) || 0,
      detalles: state.items.map(item => ({
        productoId: item.productoId,
        varianteProductoId: item.varianteProductoId,
        comboId: item.comboId,
        cantidad: item.cantidad,
        notas: item.notas,
        personalizaciones: item.personalizaciones,
      })),
    };
  };

  const value = {
    // Estado
    items: state.items,
    total: state.total,
    itemCount: state.itemCount,
    
    // Acciones
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    createCartItem,
    getCartForAPI,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}