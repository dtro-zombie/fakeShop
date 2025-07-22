import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

// Exporta el hook useAuth para usar el contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (email, password) => {
    // Simulamos login exitoso
    const fakeUser = {
      email,
      name: email.split('@')[0],
      token: Math.random().toString(36).substring(2)
    };
    setUser(fakeUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};