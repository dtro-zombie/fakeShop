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
  const [loading, setLoading] = useState(true);

  // Cuenta de admin predefinida
  const adminUser = {
    email: "admin",
    password: "admin",
    name: "Administrador",
    role: "admin"
  };

  // Iniciar sesión
  const login = (email, password) => {
    return new Promise((resolve) => {
      // Verificar admin
      if (email === adminUser.email && password === adminUser.password) {
        const userData = { ...adminUser };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        resolve({ success: true, isAdmin: true });
        return;
      }

      // Verificar usuarios registrados
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(u => u.email === email && u.password === password);

      if (foundUser) {
        localStorage.setItem('user', JSON.stringify(foundUser));
        setUser(foundUser);
        resolve({ success: true, isAdmin: false });
        return;
      }

      resolve({ success: false });
    });
  };

  // Registrar usuario
  const register = (email, password, name) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.email === email)) {
      throw new Error('El email ya está registrado');
    }

    const newUser = { email, password, name, role: 'user' };
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    localStorage.setItem('user', JSON.stringify(newUser));
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
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login, 
      logout, 
      register,
      isAdmin: user?.role === 'admin'
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};