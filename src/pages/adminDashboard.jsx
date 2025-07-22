import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/spinner';
import { Modal, Button, Table, Badge, Alert, Form } from 'react-bootstrap';
import styled from 'styled-components';

// ======================================
// Componentes estilizados con styled-components
// ======================================
const DashboardContainer = styled.div`
  padding: 2rem 0;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const MainCard = styled.div`
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 2rem;
`;

const ProductImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 0.25rem;
  margin-right: 0.5rem;
`;

const ResponsiveTable = styled(Table)`
  @media (max-width: 768px) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const StatusBadge = styled(Badge)`
  text-transform: capitalize;
`;

const FormImagePreview = styled.img`
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
  margin-top: 0.5rem;
`;

// ======================================
// Componente principal
// ======================================
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
  const [status, setStatus] = useState({ 
    loading: false, 
    message: '', 
    showModal: false, 
    variant: 'success' 
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const API_URL = 'https://687fa969efe65e52008a9006.mockapi.io/products';

  // Patrones para validación
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  const pricePattern = /^\d+(\.\d{1,2})?$/;

  // ======================================
  // Efectos y funciones de datos
  // ======================================
  const fetchProducts = async (retries = 3) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar productos');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      if (retries > 0) {
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

  useEffect(() => {
    if (formData.price && (!pricePattern.test(formData.price) || parseFloat(formData.price) <= 0)) {
      setErrors(prev => ({ ...prev, price: 'Precio inválido' }));
    } else if (errors.price && formData.price && pricePattern.test(formData.price) && parseFloat(formData.price) > 0) {
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

  // ======================================
  // Funciones de manejo de formularios
  // ======================================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Nombre requerido';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Mínimo 3 caracteres';
    }

    if (!formData.price) {
      newErrors.price = 'Precio requerido';
    } else if (!pricePattern.test(formData.price)) {
      newErrors.price = 'Formato inválido (ej. 10.99)';
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Debe ser mayor a 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descripción requerida';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Mínimo 10 caracteres';
    }

    if (!formData.category) {
      newErrors.category = 'Selecciona una categoría';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'URL de imagen requerida';
    } else if (!urlPattern.test(formData.image)) {
      newErrors.image = 'URL inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ======================================
  // Funciones CRUD
  // ======================================
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
      
      showStatusModal('✅ Producto agregado correctamente');
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
      
      showStatusModal('✅ Producto actualizado correctamente');
      setShowEditModal(false);
      fetchProducts();
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
      fetchProducts();
    } catch (error) {
      showStatusModal(`❌ Error: ${error.message}`, 'danger');
    }
  };

  // ======================================
  // Funciones auxiliares
  // ======================================
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

  // ======================================
  // Renderizado condicional
  // ======================================
  if (loading) return <Spinner />;
  if (error) return (
    <DashboardContainer>
      <div className="container">
        <Alert variant="danger">Error: {error}</Alert>
      </div>
    </DashboardContainer>
  );

  // ======================================
  // Render principal
  // ======================================
  return (
    <DashboardContainer>
      <div className="container">
        {/* Modal de Estado */}
        <Modal show={status.showModal} onHide={() => setStatus({...status, showModal: false})}>
          <Modal.Header 
            closeButton 
            className={`bg-${status.variant === 'danger' ? 'danger' : 'success'} text-white`}
          >
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
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Agregar Nuevo Producto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddProduct}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del Producto</Form.Label>
                <Form.Control
                  type="text"
                  className={`${errors.title ? 'is-invalid' : formData.title ? 'is-valid' : ''}`}
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  className={`${errors.price ? 'is-invalid' : formData.price ? 'is-valid' : ''}`}
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0.01"
                  isInvalid={!!errors.price}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.price}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  className={`${errors.description ? 'is-invalid' : formData.description ? 'is-valid' : ''}`}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  className={`${errors.category ? 'is-invalid' : formData.category ? 'is-valid' : ''}`}
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  isInvalid={!!errors.category}
                >
                  <option value="">Selecciona categoría</option>
                  <option value="electronics">Electrónica</option>
                  <option value="jewelery">Joyería</option>
                  <option value="men's clothing">Ropa Hombre</option>
                  <option value="women's clothing">Ropa Mujer</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.category}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Imagen (URL)</Form.Label>
                <Form.Control
                  type="url"
                  className={`${errors.image ? 'is-invalid' : formData.image ? 'is-valid' : ''}`}
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  isInvalid={!!errors.image}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.image}
                </Form.Control.Feedback>
                {formData.image && !errors.image && (
                  <div className="mt-2">
                    <small>Vista previa:</small>
                    <FormImagePreview 
                      src={formData.image} 
                      alt="Vista previa"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        setErrors(prev => ({ ...prev, image: 'La imagen no se puede cargar' }));
                      }}
                    />
                  </div>
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowAddModal(false)}
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
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>Editar Producto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditProduct}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del Producto</Form.Label>
                <Form.Control
                  type="text"
                  className={`${errors.title ? 'is-invalid' : formData.title ? 'is-valid' : ''}`}
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  className={`${errors.price ? 'is-invalid' : formData.price ? 'is-valid' : ''}`}
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0.01"
                  isInvalid={!!errors.price}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.price}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  className={`${errors.description ? 'is-invalid' : formData.description ? 'is-valid' : ''}`}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  isInvalid={!!errors.description}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Categoría</Form.Label>
                <Form.Select
                  className={`${errors.category ? 'is-invalid' : formData.category ? 'is-valid' : ''}`}
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  isInvalid={!!errors.category}
                >
                  <option value="">Selecciona categoría</option>
                  <option value="electronics">Electrónica</option>
                  <option value="jewelery">Joyería</option>
                  <option value="men's clothing">Ropa Hombre</option>
                  <option value="women's clothing">Ropa Mujer</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.category}
                </Form.Control.Feedback>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Imagen (URL)</Form.Label>
                <Form.Control
                  type="url"
                  className={`${errors.image ? 'is-invalid' : formData.image ? 'is-valid' : ''}`}
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  isInvalid={!!errors.image}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.image}
                </Form.Control.Feedback>
                {formData.image && !errors.image && (
                  <div className="mt-2">
                    <small>Vista previa:</small>
                    <FormImagePreview 
                      src={formData.image} 
                      alt="Vista previa"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        setErrors(prev => ({ ...prev, image: 'La imagen no se puede cargar' }));
                      }}
                    />
                  </div>
                )}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowEditModal(false)}
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

        {/* Contenido principal del dashboard */}
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <MainCard>
              <div className="card-header bg-primary text-white">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                  <h2 className="h5 mb-2 mb-md-0">Panel de Administración</h2>
                  <Button 
                    variant="light" 
                    size="sm"
                    onClick={logout}
                  >
                    Cerrar sesión
                  </Button>
                </div>
              </div>
              
              <div className="card-body">
                <p className="text-muted mb-4">Bienvenido, {user?.name}</p>
                
                {status.loading && (
                  <Alert variant="info" className="mb-4">
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    {status.message}
                  </Alert>
                )}
                
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3">
                  <h5 className="mb-2 mb-md-0">Productos ({products.length})</h5>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={startAdding}
                    disabled={status.loading}
                  >
                    + Nuevo Producto
                  </Button>
                </div>
                
                <ResponsiveTable hover responsive="md">
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
                              <ProductImage 
                                src={product.image} 
                                alt={product.title}
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/40';
                                }}
                              />
                              <div>
                                <div className="fw-semibold">{product.title}</div>
                                <small className="text-muted d-none d-md-inline">
                                  {product.description.substring(0, 50)}...
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>${product.price.toFixed(2)}</td>
                          <td>
                            <StatusBadge bg="info" text="dark">
                              {product.category}
                            </StatusBadge>
                          </td>
                          <td>
                            <ActionButtons>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => startEditing(product)}
                                disabled={status.loading}
                              >
                                Editar
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => confirmDelete(product.id)}
                                disabled={status.loading}
                              >
                                Eliminar
                              </Button>
                            </ActionButtons>
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
                </ResponsiveTable>
              </div>
            </MainCard>
          </div>
        </div>
      </div>
    </DashboardContainer>
  );
}