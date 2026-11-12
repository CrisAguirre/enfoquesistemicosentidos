import './pages.css';

export default function Dashboard() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Panel de administración y progreso general (en construcción).</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">Estudiantes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">Simulaciones completadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">—</div>
          <div className="stat-label">Promedio</div>
        </div>
      </div>

      <div className="placeholder">
        <div>
          <div className="placeholder-icon">📊</div>
          <div className="placeholder-title">Dashboard en construcción</div>
          <p>Aquí se mostrarán las métricas y el progreso de los estudiantes.</p>
        </div>
      </div>
    </div>
  );
}
