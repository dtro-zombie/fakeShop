import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { success, isAdmin } = await login(email, password);
      
      if (success) {
        if (isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate(location.state?.from?.pathname || '/');
        }
      } else {
        setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
      }
    } catch (err) {
      setError('Ocurrió un error al iniciar sesión');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          {location.state?.fromCarrito && (
            <div className="alert alert-info mb-3">
              Debes iniciar sesión para acceder al carrito
            </div>
          )}

          {error && <div className="alert alert-danger mb-3">{error}</div>}

          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Iniciar sesión</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? 'Ingresando...' : 'Ingresar'}
                </button>
              </form>
              <div className="text-center mt-3">
                <small>
                  Credenciales de admin: admin@fakeshop.com / admin123
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}