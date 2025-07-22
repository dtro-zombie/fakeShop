import { useContext, useState } from "react";
import styled from "styled-components";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import { CarritoContext } from "../context/carritoContext";
import { useFetch } from "../useFetch";
import { FaCartPlus, FaCheck, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { toast } from "react-toastify";

const ProductContainer = styled(Container)`
  margin-top: 2rem;
`;

const ProductCard = styled.div`
  height: 100%;
  transition: all 0.3s ease;
  border-radius: 0.5rem;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  .card-body {
    display: flex;
    flex-direction: column;
  }
`;

const ProductImage = styled.div`
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  overflow: hidden;
  
  img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
`;

const ProductTitle = styled.h6`
  font-weight: 600;
  color: #343a40;
  margin-bottom: 0.5rem;
`;

const ProductCategory = styled.p`
  font-size: 0.8rem;
  color: #6c757d;
`;

const ProductPrice = styled.span`
  font-weight: 700;
  color: #28a745;
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const ProductButton = styled.button`
  width: 100%;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

export default function Productos() {
  const { data, loading, error } = useFetch("https://687fa969efe65e52008a9006.mockapi.io/products");
  const { carrito, agregarAlCarrito, eliminarDelCarrito } = useContext(CarritoContext);
  const [mostrarSelect, setMostrarSelect] = useState({});
  const [cantidades, setCantidades] = useState({});

  const toggleSelect = (id) => {
    setMostrarSelect(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    if (!cantidades[id]) {
      setCantidades(prev => ({ ...prev, [id]: 1 }));
    }
  };

  const cambiarCantidad = (id, value) => {
    setCantidades(prev => ({ ...prev, [id]: parseInt(value) }));
  };

  const productoEnCarrito = (id) => {
    return carrito.some(item => item.id === id);
  };

  const handleAgregar = (producto, cantidad) => {
    agregarAlCarrito(producto, cantidad);
    setMostrarSelect(prev => ({ ...prev, [producto.id]: false }));
    toast.success(`${cantidad} ${producto.title} agregado al carrito`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleEliminar = (id, title) => {
    eliminarDelCarrito(id);
    toast.warning(`"${title}" eliminado del carrito`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  if (loading) return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Spinner animation="border" variant="primary" />
    </Container>
  );
  
  if (error) return (
    <Container className="text-center py-5">
      <Alert variant="danger">
        <FaExclamationTriangle className="me-2" />
        Error: {error.message}
      </Alert>
    </Container>
  );

  return (
    <ProductContainer className="mt-4">
      <Row className="justify-content-center">
        {data.map(item => (
          <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <ProductCard className="card shadow-sm">
              <ProductImage>
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="p-3"
                />
              </ProductImage>
              <div className="card-body">
                <ProductTitle>{item.title}</ProductTitle>
                <ProductCategory>{item.category}</ProductCategory>
                <ProductPrice>${item.price}</ProductPrice>

                {mostrarSelect[item.id] && !productoEnCarrito(item.id) && (
                  <select
                    className="form-select form-select-sm my-2"
                    onChange={(e) => cambiarCantidad(item.id, e.target.value)}
                    value={cantidades[item.id] || 1}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                )}

                <div className="d-flex justify-content-between mt-auto">
                  {productoEnCarrito(item.id) ? (
                    <ProductButton
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminar(item.id, item.title)}
                    >
                      <FaTrash className="me-1" /> Quitar
                    </ProductButton>
                  ) : (
                    <>
                      {!mostrarSelect[item.id] ? (
                        <ProductButton
                          className="btn btn-success btn-sm"
                          onClick={() => toggleSelect(item.id)}
                        >
                          <FaCartPlus className="me-1" /> Agregar
                        </ProductButton>
                      ) : (
                        <ProductButton
                          className="btn btn-primary btn-sm"
                          onClick={() => handleAgregar(item, cantidades[item.id] || 1)}
                        >
                          <FaCheck className="me-1" /> Confirmar {cantidades[item.id] || 1}
                        </ProductButton>
                      )}
                    </>
                  )}
                </div>
              </div>
            </ProductCard>
          </Col>
        ))}
      </Row>
    </ProductContainer>
  );
}