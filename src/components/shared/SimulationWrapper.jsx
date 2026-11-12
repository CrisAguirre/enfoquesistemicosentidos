import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavButton({ label, onClick }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem', paddingBottom: '2rem' }}>
      <button className="sim-btn active" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }} onClick={onClick}>
        {label} <span style={{ marginLeft: '10px', fontSize: '1.4rem' }}>&rarr;</span>
      </button>
    </div>
  );
}

// Props por defecto
SimulationWrapper.defaultProps = {
  apropiacion: null,
  actividad: null,
  evaluacionPath: null,
  showSimulatorInDesarrollo: false,
  simulator: null,
};

export default function SimulationWrapper({ simNumber, title, description, icon, info, children, apropiacion, actividad, evaluacionPath, showSimulatorInDesarrollo, simulator }) {
  // STATE MÍNIMO: solo 'inicio' por defecto
  const [activeTab, setActiveTab] = useState('inicio');
  const navigate = useNavigate();

  // IR A TAB: SÓLO cambia el estado activo
  const goTo = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // CONTENIDO: según la pestaña activa
  let contenido;
  if (activeTab === 'apropiacion' && apropiacion) {
    contenido = apropiacion;
  } else if (activeTab === 'desarrollo' && actividad) {
    contenido = (
      <>
        {showSimulatorInDesarrollo && simulator && (
          <div style={{ marginBottom: '3rem' }}>
            {simulator}
          </div>
        )}
        {actividad}
        {evaluacionPath && (
          <NavButton label="Realizar Evaluación 📝" onClick={() => navigate(evaluacionPath)} />
        )}
      </>
    );
  } else {
    contenido = (
      <>
        {children || <p>Laboratorio {simNumber}</p>}
        {actividad && (
          <NavButton label="Continuar con el Desarrollo 📚" onClick={() => goTo('desarrollo')} />
        )}
      </>
    );
  }

  return (
    <div className="page sim-page">
      <div className="page-header">
        <Link to="/laboratorio" className="back-link">← Volver al Laboratorio</Link>
        <h1 className="page-title">
          {icon && <span className="page-title-icon">{icon}</span>}
          Laboratorio {simNumber}: {title}
        </h1>
        <p className="page-subtitle">{description}</p>
      </div>

      {info && (
        <div className="info-panel">
          <div className="info-panel-title">ℹ️ Información</div>
          <div className="info-panel-body">{info}</div>
        </div>
      )}

      <div className="sim-tabs">
        {apropiacion && (
          <button className={`sim-tab${activeTab === 'apropiacion' ? ' active' : ''}`} onClick={() => goTo('apropiacion')}>
            <span className="tab-icon">🛠️</span> Apropiación
          </button>
        )}
        <button className={`sim-tab${activeTab === 'inicio' ? ' active' : ''}`} onClick={() => goTo('inicio')}>
          <span className="tab-icon">🏠</span> Inicio
        </button>
        <button className={`sim-tab${activeTab === 'desarrollo' ? ' active' : ''}`} onClick={() => goTo('desarrollo')}>
          <span className="tab-icon">📚</span> Desarrollo
        </button>
        {evaluacionPath && (
          <button className="sim-tab sim-tab-eval" onClick={() => navigate(evaluacionPath)}>
            <span className="tab-icon">📝</span> Cierre
          </button>
        )}
      </div>

      <div className="sim-content">
        {contenido}
      </div>
    </div>
  );
}