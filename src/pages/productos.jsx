import { useFetch } from "../useFetch"; // Assuming useFetch is correctly implemented

export default function Productos() {
  // Destructure data, loading, and error from your useFetch hook
  const { data, loading, error } = useFetch("https://fakestoreapi.com/products");

  // Display loading state
  if (loading) {
    return <p>Cargando productos...</p>;
  }

  // Display error state
  if (error) {
    return <p>Error al cargar los productos: {error.message}</p>;
  }

  // If data is loaded and not an empty array, render the products
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Nuestros Productos</h2> 
      <div className="row d-flex justify-content-center">
       
        {data && data.length > 0 ? (
          data.map((item) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={item.id}>
              <figure className="card h-100 shadow-sm">
                <a href="#" className="img-wrap d-flex align-items-center justify-content-center bg-white" style={{ height: '200px', overflow: 'hidden' }}>
                  <img
                    src={item.image} 
                    alt={item.title} 
                    className="img-fluid p-3"
                    style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                    crossOrigin="anonymous" 
                    referrerPolicy="no-referrer"
                  />
                </a>
                <figcaption className="info-wrap p-3 d-flex flex-column flex-grow-1">
                  <div className="row g-0 align-items-center mb-2">
                    <div className="col-9">
                      <a href="#" className="title text-decoration-none text-dark fw-bold">
                        {item.title}
                      </a>
                      <span className="d-block text-muted small">{item.category}</span> 
                    </div>
                    <div className="col-3 text-end">
                      <div className="text-warning small">
                       
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                       
                        <span className="ms-1 text-muted">{item.rating?.rate}/5</span> 
                      </div>
                    </div>
                  </div>
                </figcaption>
                <div className="bottom-wrap-payment p-3 pt-0">
                  <figcaption className="info-wrap">
                    <div className="row g-0 align-items-center">
                      <div className="col-9">
                        <span className="title fw-bold text-dark fs-5">${item.price}</span> 
                        
                        <span className="d-block text-muted small">Envío Gratis</span> 
                      </div>
                      <div className="col-3 text-end">
                        <div className="small text-muted">En stock</div>
                      </div>
                    </div>
                  </figcaption>
                </div>
                <div className="bottom-wrap p-3 border-top d-flex justify-content-between align-items-center">
                  <a href="#" className="btn btn-primary flex-grow-1 me-2">
                    Comprar
                  </a>
                </div>
              </figure>
            </div>
          ))
        ) : (
          <p>No se encontraron productos.</p> 
        )}
      </div>
    </div>
  );
}