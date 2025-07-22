import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown, Button, Badge } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { CarritoContext } from '../context/carritoContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { carrito } = useContext(CarritoContext);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        {/* Logo / Nombre de la tienda */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          FakeShop
        </Navbar.Brand>

        {/* Botón para móviles (hamburguesa) */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Contenido colapsable en móviles */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center gap-2">
            {/* Menú de usuario */}
            {user ? (
              <>
                <span className="text-white d-none d-lg-inline">Hola, {user.name}</span>
                {user.role === 'admin' && (
                  <Button as={Link} to="/admin/dashboard" variant="outline-light" size="sm">
                    Admin
                  </Button>
                )}
                <Button onClick={logout} variant="outline-light" size="sm">
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-light" size="sm">
                  Iniciar sesión
                </Button>
                <Button as={Link} to="/register" variant="outline-light" size="sm">
                  Registrarse
                </Button>
              </>
            )}

            {/* Carrito (con badge) */}
            <Button 
              as={Link} 
              to="/carrito" 
              variant="primary" 
              className="position-relative"
            >
              <i className="bi bi-cart3"></i>
              {carrito.length > 0 && (
                <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle">
                  {carrito.reduce((total, item) => total + item.cantidad, 0)}
                </Badge>
              )}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}