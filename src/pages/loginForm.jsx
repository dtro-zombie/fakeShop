import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function LoginForm() {
  const location = useLocation();
  const fromCarrito = location.state?.fromCarrito;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          {/* Alert cuando viene del carrito */}
          {fromCarrito && (
            <div className="alert alert-info alert-dismissible fade show mb-4">
              <strong>¡Atención!</strong> Debes iniciar sesión para acceder al carrito
              <button 
                type="button" 
                className="btn-close" 
                data-bs-dismiss="alert"
              ></button>
            </div>
          )}

          {/* Tarjeta del formulario */}
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="card-title text-center mb-0 py-2">Iniciar sesión</h2>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Ingresar
                </button>
              </form>
              
              <div className="text-center mt-3">
                <Link to="/" className="text-decoration-none">
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}