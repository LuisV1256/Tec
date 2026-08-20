import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

export function Navbar() {
  const { usuario, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <NavLink to="/inmuebles" className="navbar-link">
          Inmuebles
        </NavLink>
        <NavLink to="/usuarios" className="navbar-link">
          Usuarios
        </NavLink>
      </div>
      <div className="navbar-user">
        <span>{usuario?.nombre}</span>
        <button type="button" onClick={logout} className="navbar-logout">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
