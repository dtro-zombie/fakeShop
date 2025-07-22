import { createContext, useState, useEffect } from 'react';

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const saved = localStorage.getItem('carrito');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarProducto = (producto, cantidad = 1) => {
    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id);
      if (existe) {
        return prev.map(p =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + cantidad } : p
        );
      } else {
        return [...prev, { ...producto, cantidad }];
      }
    });
  };

  const quitarProducto = (id) => {
    setCarrito(prev => prev.filter(p => p.id !== id));
  };

  const cambiarCantidad = (id, cantidad) => {
    setCarrito(prev =>
      prev.map(p =>
        p.id === id ? { ...p, cantidad: cantidad } : p
      )
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CarritoContext.Provider value={{ 
      carrito, 
      agregarProducto, 
      quitarProducto, 
      cambiarCantidad,
      vaciarCarrito 
    }}>
      {children}
    </CarritoContext.Provider>
  );
};
