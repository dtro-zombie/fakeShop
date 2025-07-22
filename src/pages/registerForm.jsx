import { useState, useContext } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSignInAlt, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      const errorMsg = 'Todos los campos son requeridos';
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      const success = await register(email, password, name);
      
      if (success) {
        toast.success('Registro exitoso! Bienvenido', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        navigate('/');
      } else {
        throw new Error('Error al registrar el usuario');
      }
    } catch (error) {
      const errorMsg = error.message || 'Error al registrar el usuario';
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  return (
    <RegisterContainer>
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <RegisterCard>
            <div className="card-header">
              <h2 className="card-title">
                <FaUserPlus className="me-2" /> Registrarse
              </h2>
            </div>
            <div className="card-body">
              {error && <Alert variant="danger">{error}</Alert>}
              
              <StyledForm onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    <FaUser className="me-2" /> Nombre
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ingresa tu nombre completo"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ingresa tu email"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crea una contraseña segura"
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">
                  <FaUserPlus className="me-2" /> Registrarse
                </Button>
              </StyledForm>
              
              <LoginLink>
                <span>¿Ya tienes cuenta? </span>
                <Link to="/login">
                  <FaSignInAlt className="me-1" /> Inicia sesión
                </Link>
              </LoginLink>
            </div>
          </RegisterCard>
        </Col>
      </Row>
    </RegisterContainer>
  );
}