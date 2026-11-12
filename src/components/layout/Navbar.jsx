import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ServerStatusIndicator from '../shared/ServerStatusIndicator';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="app-nav">
      <div className="app-nav-inner">
        <Link to="/landing" className="app-nav-brand">
          <span className="app-nav-logo">🧠</span>
          <span>Los Sentidos</span>
        </Link>

        <ul className="app-nav-links">
          <li><NavLink to="/landing" end>Inicio</NavLink></li>
          <li><NavLink to="/sesiones">Sesiones</NavLink></li>
          <li><NavLink to="/laboratorio">Laboratorio</NavLink></li>
          <li><NavLink to="/evidencias">Evidencias</NavLink></li>
          <li><NavLink to="/resultados">Resultados</NavLink></li>
          <li><NavLink to="/recursos">Recursos</NavLink></li>
          {isAdmin && <li><NavLink to="/dashboard">Dashboard</NavLink></li>}
          {isAdmin && <li><NavLink to="/usuarios">Usuarios</NavLink></li>}
        </ul>

        <div className="app-nav-user">
          <ServerStatusIndicator compact />
          <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? 'Cambiar a modo diurno' : 'Cambiar a modo nocturno'}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <span className="app-nav-name">{user?.full_name}</span>
          <button className="app-nav-logout" onClick={handleLogout}>Salir</button>
        </div>
      </div>
    </nav>
  );
}
