import { Link } from 'react-router-dom';

export default function SimCard({ simNumber, title, description, icon, routePath }) {
  return (
    <Link to={routePath} className="sim-card">
      <div className="sim-card-icon">{icon}</div>
      <div className="sim-card-body">
        <span className="sim-card-number">Simulación {simNumber}</span>
        <h3 className="sim-card-title">{title}</h3>
        <p className="sim-card-desc">{description}</p>
      </div>
      <span className="sim-card-arrow">→</span>
    </Link>
  );
}
