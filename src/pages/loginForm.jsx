import { useState, useContext } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaSignInAlt, FaUserShield } from 'react-icons/fa';
import { toast } from 'react-toastify';

const LoginContainer = styled(Container)`
  margin-top: 5rem;
`;

const LoginCard = styled(Card)`
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  border: none;
  
  .card-header {
    background-color: #0d6efd;
    color: white;
    text-align: center;
    padding: 1.5rem;
    border-bottom: none;
  }
  
  .card-title {
    font-weight: 600;
    margin-bottom: 0;
  }
  
  .card-body {
    padding: 2rem;
  }
`;

const StyledForm = styled(Form)`
  .form-label {
    font-weight: 500;
  }
  
  .btn-primary {
    background-color: #0d6efd;
    border: none;
    padding: 0.5rem;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #0b5ed7;
      transform: translateY(-2px);
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

const AdminNote = styled.small`
  display: block;
  margin-top: 1rem;
  color: #6c757d;
  text-align: center;
  font-size: 0.85rem;
`;

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

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      toast.error('Por favor completa todos los campos', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const { success, isAdmin, error: loginError } = await login(email, password);
      
      if (success) {
        const welcomeMessage = isAdmin ? 'Bienvenido Administrador' : 'Bienvenido';
        toast.success(welcomeMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Redirección basada en rol y ubicación previa
        const redirectPath = isAdmin 
          ? '/admin/dashboard' 
          : location.state?.from?.pathname || '/';
          
        navigate(redirectPath, { replace: true });
      } else {
        const errorMessage = loginError || 'Credenciales incorrectas. Por favor, inténtalo de nuevo.';
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      const errorMessage = err.message || 'Ocurrió un error al iniciar sesión';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          {location.state?.fromCarrito && (
            <Alert variant="info" className="mb-3 text-center">
              Debes iniciar sesión para acceder al carrito
            </Alert>
          )}

          {error && (
            <Alert variant="danger" className="mb-3 text-center">
              {error}
            </Alert>
          )}

          <LoginCard>
            <div className="card-header">
              <h2 className="card-title">
                <FaSignInAlt className="me-2" /> Iniciar sesión
              </h2>
            </div>
            <div className="card-body">
              <StyledForm onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresa tu email"
                    required
                    disabled={isLoading}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    required
                    disabled={isLoading}
                  />
                </Form.Group>
                <Button 
                  type="submit" 
                  variant="primary"
                  className="w-100"
                  disabled={isLoading}
                >
                  {isLoading ? 'Ingresando...' : (
                    <>
                      <FaSignInAlt className="me-2" /> Ingresar
                    </>
                  )}
                </Button>
              </StyledForm>
              <AdminNote>
                <FaUserShield className="me-1" />
                Credenciales de admin: admin@fakeshop.com / admin123
              </AdminNote>
            </div>
          </LoginCard>
        </Col>
      </Row>
    </LoginContainer>
  );
}