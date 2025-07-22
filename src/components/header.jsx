import { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { CarritoContext } from '../context/carritoContext';

const StyledHeader = styled.header`
  background-color: #343a40;
  color: white;
  padding: 1rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const LogoLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #f8f9fa;
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .btn {
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const CartButton = styled(Link)`
  position: relative;
  
  .badge {
    font-size: 0.6rem;
  }
`;

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { carrito } = useContext(CarritoContext);

  return (
    <StyledHeader>
      <Container className="d-flex justify-content-between align-items-center">
        <LogoLink to="/">
          <h1 className="m-0">FakeShop</h1>
        </LogoLink>
        
        <UserActions>
          {user ? (
            <>
              <span className="me-2">Hola, {user.name}</span>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="btn btn-outline-light btn-sm">
                  Admin
                </Link>
              )}
              <button onClick={logout} className="btn btn-outline-light btn-sm">
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-light btn-sm">
                Iniciar sesión
              </Link>
              <Link to="/register" className="btn btn-outline-light btn-sm">
                Registrarse
              </Link>
            </>
          )}
          
          <CartButton to="/carrito" className="btn btn-primary position-relative">
            <i className="bi bi-cart3"></i>
            {carrito.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {carrito.reduce((total, item) => total + item.cantidad, 0)}
              </span>
            )}
          </CartButton>
        </UserActions>
      </Container>
    </StyledHeader>
  );
}