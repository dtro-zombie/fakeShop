import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CarritoContext } from '../context/carritoContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { carrito } = useContext(CarritoContext);

  return (
    <header className="bg-dark text-white p-3">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="text-white text-decoration-none">
          <h1>FakeShop</h1>
        </Link>
        
        <div className="d-flex align-items-center gap-4">
          {user ? (
            <>
              <span>Hola, {user.name}</span>
              <button onClick={logout} className="btn btn-outline-light">
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/loginForm" className="btn btn-outline-light">
              Iniciar sesión
            </Link>
          )}
          
          <Link to="/carrito" className="btn btn-primary position-relative">
            <i className="bi bi-cart3"></i>
            {carrito.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ">
                {carrito.reduce((total, item) => total + item.cantidad, 0)}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}