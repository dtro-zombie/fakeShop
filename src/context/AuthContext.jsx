import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Cuenta de admin predefinida
  const adminUser = {
    email: "admin@fakeshop.com",
    password: "admin123",
    name: "Administrador",
    role: "admin"
  };

  // Iniciar sesión
  const login = (email, password) => {
    // Verificar admin
    if (email === adminUser.email && password === adminUser.password) {
      const userData = { ...adminUser };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    }

    // Verificar usuarios registrados
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      localStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);
      return true;
    }

    return false;
  };

  // Registrar usuario
  const register = (email, password, name) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.email === email)) {
      throw new Error('El email ya está registrado');
    }

    const newUser = { email, password, name, role: 'user' };
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    setUser(newUser);
    return true;
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Cargar usuario al iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};