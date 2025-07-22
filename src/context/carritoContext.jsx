import { createContext, useReducer, useEffect } from 'react';

export const CarritoContext = createContext();

const carritoReducer = (state, action) => {
  switch (action.type) {
    case 'AGREGAR':
      const existe = state.find(p => p.id === action.producto.id);
      if (existe) {
        return state.map(p =>
          p.id === action.producto.id 
            ? { ...p, cantidad: p.cantidad + (action.cantidad || 1) } 
            : p
        );
      }
      return [...state, { ...action.producto, cantidad: action.cantidad || 1 }];
    
    case 'QUITAR':
      return state.filter(p => p.id !== action.id);
    
    case 'CAMBIAR_CANTIDAD':
      return state.map(p =>
        p.id === action.id ? { ...p, cantidad: action.cantidad } : p
      );
    
    case 'VACIAR':
      return [];
    
    default:
      return state;
  }
};

export const CarritoProvider = ({ children }) => {
  const [carrito, dispatch] = useReducer(carritoReducer, [], () => {
    const saved = localStorage.getItem('carrito');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarProducto = (producto, cantidad) => {
    dispatch({ type: 'AGREGAR', producto, cantidad });
  };

  const quitarProducto = (id) => {
    dispatch({ type: 'QUITAR', id });
  };

  const cambiarCantidad = (id, cantidad) => {
    dispatch({ type: 'CAMBIAR_CANTIDAD', id, cantidad });
  };

  const vaciarCarrito = () => {
    dispatch({ type: 'VACIAR' });
  };

  return (
    <CarritoContext.Provider 
      value={{ 
        carrito, 
        agregarProducto, 
        quitarProducto, 
        cambiarCantidad,
        vaciarCarrito 
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};