import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-dark text-white">
              <h2 className="card-title mb-0 py-2">Panel de Administración</h2>
            </div>
            <div className="card-body">
              <h3>Bienvenido, {user?.name}</h3>
              <p className="text-muted">Rol: Administrador</p>
              
              <div className="mt-4">
                <h4>Acciones disponibles:</h4>
                <ul className="list-group">
                  <li className="list-group-item">Gestionar productos</li>
                  <li className="list-group-item">Ver estadísticas</li>
                  <li className="list-group-item">Administrar usuarios</li>
                </ul>
              </div>

              <button 
                onClick={logout}
                className="btn btn-danger mt-4"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}