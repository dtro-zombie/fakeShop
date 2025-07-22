import { useContext } from 'react';
import { CarritoContext } from '../context/carritoContext';

const Carrito = () => {
  const { carrito, quitarProducto, cambiarCantidad, vaciarCarrito } = useContext(CarritoContext);

  const calcularTotal = () => {
    return carrito.reduce((total, producto) => total + (producto.price * producto.cantidad), 0);
  };

  return (
    <div className="container py-5 min-vh-100">
      <h2 className="mb-4 text-primary">
        <i className="bi bi-cart-fill me-2"></i>Tu Carrito de Compras
      </h2>

      {carrito.length === 0 ? (
        <div className="alert alert-info">Tu carrito está vacío</div>
      ) : (
        <>
          <div className="d-flex justify-content-end mb-3">
            <button 
              className="btn btn-danger"
              onClick={vaciarCarrito}
            >
              <i className="bi bi-trash-fill me-2"></i>Vaciar carrito
            </button>
          </div>

          {carrito.map((producto) => (
            <div className="card mb-4 shadow-sm rounded" key={producto.id}>
              <div className="row g-0 align-items-center">
                <div className="col-md-2 p-2 text-center">
                  <img
                    src={producto.image}
                    alt={producto.title}
                    className="img-fluid rounded"
                    style={{ height: '80px', objectFit: 'contain' }}
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
                    onChange={(e) => cambiarCantidad(producto.id, parseInt(e.target.value))}
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
                    onClick={() => quitarProducto(producto.id)}
                  >
                    <i className="bi bi-trash-fill me-1"></i>Quitar
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="d-flex justify-content-between align-items-center border-top pt-4 mt-5">
            <h4 className="text-dark">
              Total: <span className="text-success">${calcularTotal().toFixed(2)}</span>
            </h4>
            <div>
              <button className="btn btn-outline-danger me-3" onClick={vaciarCarrito}>
                <i className="bi bi-trash-fill me-1"></i>Vaciar todo
              </button>
              <button className="btn btn-success btn-lg shadow">
                <i className="bi bi-credit-card-fill me-2"></i>Finalizar compra
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;