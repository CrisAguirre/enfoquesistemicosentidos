import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ServerStatusIndicator from '../shared/ServerStatusIndicator';
import AppLogo from '../shared/AppLogo';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="app-nav" aria-label="Navegación principal">
      <div className="app-nav-inner">
        <Link to="/landing" className="app-nav-brand" onClick={closeMenu}>
          <span className="app-nav-logo">
            <AppLogo size={32} />
          </span>
          <span className="app-nav-title">Los Sentidos</span>
        </Link>

        {/* Botón hamburguesa móvil */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <ul className={`app-nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <li><NavLink to="/landing" end onClick={closeMenu}>Inicio</NavLink></li>
          <li><NavLink to="/sesiones" onClick={closeMenu}>Sesiones</NavLink></li>
          <li><NavLink to="/laboratorio" onClick={closeMenu}>Laboratorio</NavLink></li>
          <li><NavLink to="/evidencias" onClick={closeMenu}>Evidencias</NavLink></li>
          <li><NavLink to="/resultados" onClick={closeMenu}>Resultados</NavLink></li>
          <li><NavLink to="/recursos" onClick={closeMenu}>Recursos</NavLink></li>
          {isAdmin && <li><NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink></li>}
          {isAdmin && <li><NavLink to="/usuarios" onClick={closeMenu}>Usuarios</NavLink></li>}
        </ul>

        <div className="app-nav-user">
          <ServerStatusIndicator compact />
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Cambiar a modo diurno' : 'Cambiar a modo nocturno'}
            aria-label="Cambiar tema visual"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <span className="app-nav-name" title={user?.documento}>{user?.full_name}</span>
          <button className="app-nav-logout" onClick={handleLogout} aria-label="Cerrar sesión">Salir</button>
        </div>
      </div>
    </nav>
  );
}
