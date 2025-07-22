import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: ''
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, message: '', showModal: false, variant: '' });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const API_URL = 'https://687fa969efe65e52008a9006.mockapi.io/products';

  // Patrones para validación
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  const imageExtensions = /\.(jpeg|jpg|gif|png|webp)$/i;
  const pricePattern = /^\d+(\.\d{1,2})?$/;

 const fetchProducts = async (retries = 3) => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Error al cargar productos');
    }
    const data = await response.json();
    setProducts(data);
  } catch (err) {
    if (retries > 0 && err.message.includes('Failed to fetch')) {
      // Reintentar si es error de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchProducts(retries - 1);
    }
    showStatusModal(`❌ ${err.message}`, 'danger');
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  // Validación en tiempo real para campos específicos
  useEffect(() => {
    if (formData.price && (!pricePattern.test(formData.price) || parseFloat(formData.price) <= 0)) {
      setErrors(prev => ({ ...prev, price: 'Precio inválido' }));
    } else if (errors.price && pricePattern.test(formData.price) && parseFloat(formData.price) > 0) {
      const newErrors = { ...errors };
      delete newErrors.price;
      setErrors(newErrors);
    }
  }, [formData.price]);

  useEffect(() => {
    if (formData.image && !urlPattern.test(formData.image)) {
      setErrors(prev => ({ ...prev, image: 'URL inválida' }));
    } else if (errors.image && formData.image && urlPattern.test(formData.image)) {
      const newErrors = { ...errors };
      delete newErrors.image;
      setErrors(newErrors);
    }
  }, [formData.image]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validación en tiempo real para algunos campos
    if (name === 'title' && value.trim().length < 3 && value.trim().length > 0) {
      setErrors(prev => ({ ...prev, title: 'Mínimo 3 caracteres' }));
    } else if (name === 'title' && value.trim().length >= 3) {
      const newErrors = { ...errors };
      delete newErrors.title;
      setErrors(newErrors);
    }
    
    if (name === 'description' && value.length < 10 && value.length > 0) {
      setErrors(prev => ({ ...prev, description: 'Mínimo 10 caracteres' }));
    } else if (name === 'description' && value.length >= 10) {
      const newErrors = { ...errors };
      delete newErrors.description;
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validación de nombre
    if (!formData.title.trim()) {
      newErrors.title = 'Nombre requerido';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'El nombre debe tener al menos 3 caracteres';
    } else if (formData.title.trim().length > 50) {
      newErrors.title = 'El nombre no puede exceder 50 caracteres';
    }

    // Validación de precio
    if (!formData.price) {
      newErrors.price = 'Precio requerido';
    } else if (!pricePattern.test(formData.price)) {
      newErrors.price = 'Formato inválido (ej. 10.99)';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Debe ser mayor a 0';
    } else if (formData.price.length > 10) {
      newErrors.price = 'Precio demasiado largo';
    }

    // Validación de descripción
    if (!formData.description.trim()) {
      newErrors.description = 'Descripción requerida';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Mínimo 10 caracteres';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Máximo 500 caracteres';
    }

    // Validación de categoría
    if (!formData.category) {
      newErrors.category = 'Selecciona una categoría';
    }

    // Validación de imagen
    if (!formData.image.trim()) {
      newErrors.image = 'URL de imagen requerida';
    } else if (!urlPattern.test(formData.image)) {
      newErrors.image = 'URL inválida';
    } else if (!imageExtensions.test(formData.image)) {
      newErrors.image = 'Extensión de imagen no válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showStatusModal = (message, variant = 'success') => {
    setStatus({
      loading: false,
      message,
      showModal: true,
      variant
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setStatus({ ...status, loading: true, message: 'Agregando producto...' });
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          price: parseFloat(formData.price),
          description: formData.description.trim(),
          category: formData.category,
          image: formData.image.trim()
        }),
      });
      
      if (!response.ok) throw new Error('Error al agregar producto');
      
      const newProduct = await response.json();
      showStatusModal('✅ Producto agregado correctamente');
      setProducts(prev => [...prev, newProduct]);
      resetForm();
      setShowAddModal(false);
      fetchProducts();
    } catch (error) {
      showStatusModal(`❌ Error: ${error.message}`, 'danger');
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setStatus({ ...status, loading: true, message: 'Actualizando producto...' });
    
    try {
      const response = await fetch(`${API_URL}/${currentProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          price: parseFloat(formData.price),
          description: formData.description.trim(),
          category: formData.category,
          image: formData.image.trim()
        }),
      });
      
      if (!response.ok) throw new Error('Error al actualizar producto');
      
      const updatedProduct = await response.json();
      showStatusModal('✅ Producto actualizado correctamente');
      setProducts(prev => prev.map(p => 
        p.id === currentProduct.id ? updatedProduct : p
      ));
      resetForm();
      setShowEditModal(false);
    } catch (error) {
      showStatusModal(`❌ Error: ${error.message}`, 'danger');
    }
  };

  const confirmDelete = (id) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteProduct = async () => {
    setShowDeleteModal(false);
    setStatus({ ...status, loading: true, message: 'Eliminando producto...' });
    
    try {
      const response = await fetch(`${API_URL}/${productToDelete}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Error al eliminar producto');
      
      showStatusModal('✅ Producto eliminado correctamente');
      setProducts(prev => prev.filter(p => p.id !== productToDelete));
    } catch (error) {
      showStatusModal(`❌ Error: ${error.message}`, 'danger');
    }
  };

  const startAdding = () => {
    resetForm();
    setShowAddModal(true);
  };

  const startEditing = (product) => {
    setCurrentProduct(product);
    setFormData({
      title: product.title,
      price: product.price.toString(),
      description: product.description,
      category: product.category,
      image: product.image
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setCurrentProduct(null);
    setFormData({
      title: '',
      price: '',
      description: '',
      category: '',
      image: ''
    });
    setErrors({});
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setErrors({});
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setErrors({});
  };

  const isFormValid = () => {
    return (
      formData.title.trim() && 
      formData.price && 
      formData.description.trim() && 
      formData.category && 
      formData.image.trim() && 
      Object.keys(errors).length === 0
    );
  };

  if (loading) return <Spinner />;
  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger">Error: {error}</div>
    </div>
  );

  return (
    <div className="container py-4">
      {/* Modal de Estado */}
      <Modal show={status.showModal} onHide={() => setStatus({...status, showModal: false})}>
        <Modal.Header closeButton className={`bg-${status.variant === 'danger' ? 'danger' : 'success'} text-white`}>
          <Modal.Title>{status.variant === 'danger' ? 'Error' : 'Éxito'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{status.message}</Modal.Body>
        <Modal.Footer>
          <Button 
            variant={status.variant === 'danger' ? 'danger' : 'success'} 
            onClick={() => setStatus({...status, showModal: false})}
          >
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton className="bg-warning text-dark">
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct}>
            {status.loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Eliminando...
              </>
            ) : 'Eliminar'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Agregar Producto */}
      <Modal show={showAddModal} onHide={handleCloseAddModal} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Agregar Nuevo Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddProduct}>
            <div className="mb-3">
              <label className="form-label">Nombre del Producto</label>
              <input
                type="text"
                className={`form-control ${errors.title ? 'is-invalid' : formData.title && !errors.title ? 'is-valid' : ''}`}
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={() => validateForm()}
                maxLength="50"
              />
              {errors.title ? (
                <div className="invalid-feedback">{errors.title}</div>
              ) : formData.title ? (
                <div className="valid-feedback">Nombre válido</div>
              ) : null}
              <small className="text-muted">{formData.title.length}/50 caracteres</small>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Precio</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className={`form-control ${errors.price ? 'is-invalid' : formData.price && !errors.price ? 'is-valid' : ''}`}
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0.01"
                  onBlur={() => validateForm()}
                />
              </div>
              {errors.price ? (
                <div className="invalid-feedback">{errors.price}</div>
              ) : formData.price ? (
                <div className="valid-feedback">Precio válido</div>
              ) : null}
            </div>
            
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : formData.description && !errors.description ? 'is-valid' : ''}`}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                onBlur={() => validateForm()}
                maxLength="500"
              />
              {errors.description ? (
                <div className="invalid-feedback">{errors.description}</div>
              ) : formData.description ? (
                <div className="valid-feedback">Descripción válida</div>
              ) : null}
              <small className="text-muted">{formData.description.length}/500 caracteres</small>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Categoría</label>
              <select
                className={`form-select ${errors.category ? 'is-invalid' : formData.category ? 'is-valid' : ''}`}
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona categoría</option>
                <option value="electronics">Electrónica</option>
                <option value="jewelery">Joyería</option>
                <option value="men's clothing">Ropa Hombre</option>
                <option value="women's clothing">Ropa Mujer</option>
              </select>
              {errors.category && <div className="invalid-feedback">{errors.category}</div>}
              {formData.category && !errors.category && (
                <div className="valid-feedback">Categoría seleccionada</div>
              )}
            </div>
            
            <div className="mb-3">
              <label className="form-label">Imagen (URL)</label>
              <input
                type="url"
                className={`form-control ${errors.image ? 'is-invalid' : formData.image && !errors.image ? 'is-valid' : ''}`}
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                onBlur={() => validateForm()}
              />
              {errors.image ? (
                <div className="invalid-feedback">{errors.image}</div>
              ) : formData.image ? (
                <div className="valid-feedback">URL válida</div>
              ) : null}
              {formData.image && !errors.image && (
                <div className="mt-2">
                  <small>Vista previa:</small>
                  <img 
                    src={formData.image} 
                    alt="Vista previa" 
                    className="img-thumbnail mt-1" 
                    style={{maxWidth: '100px', maxHeight: '100px'}}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      setErrors(prev => ({ ...prev, image: 'La imagen no se puede cargar' }));
                    }}
                  />
                </div>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleCloseAddModal}
            disabled={status.loading}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddProduct}
            disabled={status.loading || !isFormValid()}
          >
            {status.loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Procesando...
              </>
            ) : 'Agregar'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para Editar Producto */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditProduct}>
            <div className="mb-3">
              <label className="form-label">Nombre del Producto</label>
              <input
                type="text"
                className={`form-control ${errors.title ? 'is-invalid' : formData.title && !errors.title ? 'is-valid' : ''}`}
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                onBlur={() => validateForm()}
                maxLength="50"
              />
              {errors.title ? (
                <div className="invalid-feedback">{errors.title}</div>
              ) : formData.title ? (
                <div className="valid-feedback">Nombre válido</div>
              ) : null}
              <small className="text-muted">{formData.title.length}/50 caracteres</small>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Precio</label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  className={`form-control ${errors.price ? 'is-invalid' : formData.price && !errors.price ? 'is-valid' : ''}`}
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0.01"
                  onBlur={() => validateForm()}
                />
              </div>
              {errors.price ? (
                <div className="invalid-feedback">{errors.price}</div>
              ) : formData.price ? (
                <div className="valid-feedback">Precio válido</div>
              ) : null}
            </div>
            
            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : formData.description && !errors.description ? 'is-valid' : ''}`}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                onBlur={() => validateForm()}
                maxLength="500"
              />
              {errors.description ? (
                <div className="invalid-feedback">{errors.description}</div>
              ) : formData.description ? (
                <div className="valid-feedback">Descripción válida</div>
              ) : null}
              <small className="text-muted">{formData.description.length}/500 caracteres</small>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Categoría</label>
              <select
                className={`form-select ${errors.category ? 'is-invalid' : formData.category ? 'is-valid' : ''}`}
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona categoría</option>
                <option value="electronics">Electrónica</option>
                <option value="jewelery">Joyería</option>
                <option value="men's clothing">Ropa Hombre</option>
                <option value="women's clothing">Ropa Mujer</option>
              </select>
              {errors.category && <div className="invalid-feedback">{errors.category}</div>}
              {formData.category && !errors.category && (
                <div className="valid-feedback">Categoría seleccionada</div>
              )}
            </div>
            
            <div className="mb-3">
              <label className="form-label">Imagen (URL)</label>
              <input
                type="url"
                className={`form-control ${errors.image ? 'is-invalid' : formData.image && !errors.image ? 'is-valid' : ''}`}
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                onBlur={() => validateForm()}
              />
              {errors.image ? (
                <div className="invalid-feedback">{errors.image}</div>
              ) : formData.image ? (
                <div className="valid-feedback">URL válida</div>
              ) : null}
              {formData.image && !errors.image && (
                <div className="mt-2">
                  <small>Vista previa:</small>
                  <img 
                    src={formData.image} 
                    alt="Vista previa" 
                    className="img-thumbnail mt-1" 
                    style={{maxWidth: '100px', maxHeight: '100px'}}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      setErrors(prev => ({ ...prev, image: 'La imagen no se puede cargar' }));
                    }}
                  />
                </div>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={handleCloseEditModal}
            disabled={status.loading}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleEditProduct}
            disabled={status.loading || !isFormValid()}
          >
            {status.loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Procesando...
              </>
            ) : 'Actualizar'}
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="h5 mb-0">Panel de Administración</h2>
                <button onClick={logout} className="btn btn-sm btn-light">
                  Cerrar sesión
                </button>
              </div>
            </div>
            
            <div className="card-body">
              <p className="text-muted mb-4">Bienvenido, {user?.name}</p>
              
              {status.loading && (
                <div className="alert alert-info mb-4">
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  {status.message}
                </div>
              )}
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Productos ({products.length})</h5>
                <button 
                  onClick={startAdding}
                  className="btn btn-sm btn-primary"
                  disabled={status.loading}
                >
                  + Nuevo Producto
                </button>
              </div>
              
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Categoría</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map(product => (
                        <tr key={product.id}>
                          <td>{product.id}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <img 
                                src={product.image} 
                                alt={product.title} 
                                className="rounded me-2" 
                                width="40" 
                                height="40" 
                                style={{objectFit: 'cover'}}
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/40';
                                }}
                              />
                              <div>
                                <div className="fw-semibold">{product.title}</div>
                                <small className="text-muted text-truncate" style={{maxWidth: '200px', display: 'inline-block'}}>
                                  {product.description.substring(0, 50)}...
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>${product.price.toFixed(2)}</td>
                          <td>
                            <span className="badge bg-info text-dark text-capitalize">
                              {product.category}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button 
                                onClick={() => startEditing(product)}
                                className="btn btn-sm btn-outline-primary"
                                disabled={status.loading}
                              >
                                Editar
                              </button>
                              <button 
                                onClick={() => confirmDelete(product.id)}
                                className="btn btn-sm btn-outline-danger"
                                disabled={status.loading}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">
                          No hay productos registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}