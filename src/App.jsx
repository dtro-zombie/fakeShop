import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'; 
import { AuthProvider, useAuth } from './context/AuthContext';
import { CarritoProvider } from './context/carritoContext';
import Header from './components/header';
import Footer from './components/footer';
import Productos from './pages/productos';
import LoginForm from './pages/loginForm';
import Carrito from './pages/carrito';
import './App.css';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/loginForm" state={{ fromCarrito: true }} replace />;
  }

  return children;
};


function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/loginForm" element={<LoginForm />} />
            <Route path="/" element={<Productos />} />
            <Route 
              path="/carrito" 
              element={
                <ProtectedRoute>
                  <Carrito />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;