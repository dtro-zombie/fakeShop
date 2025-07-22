import { useState, useContext } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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
    }
  }
`;

const AdminNote = styled.small`
  display: block;
  margin-top: 1rem;
  color: #6c757d;
  text-align: center;
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
    <LoginContainer>
      <Row className="justify-content-center vh-100">
        <Col md={6} lg={4}>
          {location.state?.fromCarrito && (
            <Alert variant="info" className="mb-3">
              Debes iniciar sesión para acceder al carrito
            </Alert>
          )}

          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

          <LoginCard>
            <div className="card-header">
              <h2 className="card-title">Iniciar sesión</h2>
            </div>
            <div className="card-body">
              <StyledForm onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button 
                  type="submit" 
                  variant="primary"
                  className="w-100"
                  disabled={isLoading}
                >
                  {isLoading ? 'Ingresando...' : 'Ingresar'}
                </Button>
              </StyledForm>
              <AdminNote>
                Credenciales de admin: admin@fakeshop.com / admin123
              </AdminNote>
            </div>
          </LoginCard>
        </Col>
      </Row>
    </LoginContainer>
  );
}