import { useContext, useState } from "react";
import { CarritoContext } from "../context/carritoContext";
import { useFetch } from "../useFetch";
import Spinner from "../components/spinner";

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

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mt-4">
      <div className="row d-flex justify-content-center">
        {data.map(item => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={item.id}>
            <div className="card h-100 shadow-sm">
              <div
                className="d-flex align-items-center justify-content-center bg-white"
                style={{ height: "200px", overflow: "hidden" }}
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="img-fluid p-3" 
                  style={{ objectFit: "contain", height: "100%" }} 
                />
              </div>
              <div className="card-body d-flex flex-column">
                <h6 className="fw-bold text-dark">{item.title}</h6>
                <p className="text-muted small">{item.category}</p>
                <span className="fw-bold text-success fs-5">${item.price}</span>

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
                    <button
                      className="btn btn-danger btn-sm w-100"
                      onClick={() => eliminarDelCarrito(item.id)}
                    >
                      <i className="bi bi-trash"></i> Quitar del carrito
                    </button>
                  ) : (
                    <>
                      {!mostrarSelect[item.id] ? (
                        <button
                          className="btn btn-success btn-sm w-100"
                          onClick={() => toggleSelect(item.id)}
                        >
                          <i className="bi bi-cart-plus"></i> Agregar al carrito
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm w-100"
                          onClick={() => {
                            agregarAlCarrito(item, cantidades[item.id] || 1);
                            setMostrarSelect(prev => ({ ...prev, [item.id]: false }));
                          }}
                        >
                          <i className="bi bi-check"></i> Confirmar {cantidades[item.id] || 1} unidades
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}