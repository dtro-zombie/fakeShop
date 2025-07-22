import { useContext } from 'react';
import styled from 'styled-components';
import { Container } from 'react-bootstrap';
import { CarritoContext } from '../context/carritoContext';
import { FaTrash, FaCreditCard, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CartContainer = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
  min-height: 100vh;
`;

const CartItem = styled.div`
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ProductImage = styled.img`
  height: 80px;
  object-fit: contain;
`;

const TotalSection = styled.div`
  border-top: 1px solid #dee2e6;
  padding-top: 1.5rem;
  margin-top: 3rem;
`;

const Carrito = () => {
  const { carrito, eliminarDelCarrito, actualizarCantidad, vaciarCarrito } = useContext(CarritoContext);

  const calcularTotal = () => {
    return carrito.reduce((total, producto) => total + (producto.price * producto.cantidad), 0);
  };

  const handleEliminar = (id, title) => {
    eliminarDelCarrito(id);
    toast.warning(`"${title}" eliminado del carrito`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleVaciarCarrito = () => {
    vaciarCarrito();
    toast.error('Carrito vaciado', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleFinalizarCompra = () => {
    toast.success('¡Compra finalizada con éxito!', {
      position: "top-right",
      autoClose: 3000,
    });
    vaciarCarrito();
  };

  return (
    <CartContainer className="py-5">
      <h2 className="mb-4 text-primary">
        <FaShoppingCart className="me-2" /> Tu Carrito de Compras
      </h2>

      {carrito.length === 0 ? (
        <div className="alert alert-info">Tu carrito está vacío</div>
      ) : (
        <>
          <div className="d-flex justify-content-end mb-3">
            <button 
              className="btn btn-danger"
              onClick={handleVaciarCarrito}
            >
              <FaTrash className="me-2" /> Vaciar carrito
            </button>
          </div>

          {carrito.map((producto) => (
            <CartItem className="card mb-4 shadow-sm rounded" key={producto.id}>
              <div className="row g-0 align-items-center">
                <div className="col-md-2 p-2 text-center">
                  <ProductImage
                    src={producto.image}
                    alt={producto.title}
                    className="img-fluid rounded"
                  />
                </div>
                <div className="col-md-4">
                  <div className="card-body">
                    <h5 className="card-title text-dark">{producto.title}</h5>
                    <p className="card-text small text-muted">{producto.category}</p>
                  </div>
                </div>
                <div className="col-md-2 text-center fw-bold text-success">
                  ${producto.price}
                </div>
                <div className="col-md-2 text-center">
                  <select
                    className="form-select form-select-sm"
                    value={producto.cantidad}
                    onChange={(e) => actualizarCantidad(producto.id, parseInt(e.target.value))}
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2 text-center">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleEliminar(producto.id, producto.title)}
                  >
                    <FaTrash className="me-1" /> Quitar
                  </button>
                </div>
              </div>
            </CartItem>
          ))}

          <TotalSection className="d-flex justify-content-between align-items-center">
            <h4 className="text-dark">
              Total: <span className="text-success">${calcularTotal().toFixed(2)}</span>
            </h4>
            <div>
              <button className="btn btn-outline-danger me-3" onClick={handleVaciarCarrito}>
                <FaTrash className="me-1" /> Vaciar todo
              </button>
              <button 
                className="btn btn-success btn-lg shadow"
                onClick={handleFinalizarCompra}
              >
                <FaCreditCard className="me-2" /> Finalizar compra
              </button>
            </div>
          </TotalSection>
        </>
      )}
    </CartContainer>
  );
};

export default Carrito;