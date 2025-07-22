import { useState, useContext } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const RegisterContainer = styled(Container)`
  margin-top: 5rem;
`;

const RegisterCard = styled(Card)`
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
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  
  a {
    color: #0d6efd;
    font-weight: 500;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      setError('Todos los campos son requeridos');
      return;
    }

    if (register(email, password, name)) {
      navigate('/');
    } else {
      setError('Error al registrar el usuario');
    }
  };

  return (
    <RegisterContainer>
      <Row className="justify-content-center vh-100" >
        <Col md={6} lg={4}>
          <RegisterCard>
            <div className="card-header">
              <h2 className="card-title">Registrarse</h2>
            </div>
            <div className="card-body">
              {error && <Alert variant="danger">{error}</Alert>}
              
              <StyledForm onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
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
                <Button type="submit" variant="primary" className="w-100">
                  Registrarse
                </Button>
              </StyledForm>
              
              <LoginLink>
                <span>¿Ya tienes cuenta? </span>
                <Link to="/login">Inicia sesión</Link>
              </LoginLink>
            </div>
          </RegisterCard>
        </Col>
      </Row>
    </RegisterContainer>
  );
}