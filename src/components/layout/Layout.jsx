import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import './layout.css';

export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <div className="container">
          <p>© 2026 Los Sentidos — Pensamiento Sistémico en la Educación</p>
        </div>
      </footer>
    </div>
  );
}
