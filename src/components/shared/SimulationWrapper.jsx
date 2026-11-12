import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SIM_ROUTES = {
  1: { path: '/laboratorio/introduccion', name: 'Lab 1 Introducción' },
  2: { path: '/laboratorio/vista', name: 'Lab 2 Vista' },
  3: { path: '/laboratorio/oido', name: 'Lab 3 Oído' },
  4: { path: '/laboratorio/olfato-gusto', name: 'Lab 4 Olfato y Gusto' },
  5: { path: '/laboratorio/tacto', name: 'Lab 5 Tacto' },
  6: { path: '/laboratorio/integracion-sensorial', name: 'Lab 6 Integración' },
};

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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/laboratorio" className="back-link">← Volver al Laboratorio</Link>
          <h1 className="page-title">
            {icon && <span className="page-title-icon">{icon}</span>}
            Laboratorio {simNumber}: {title}
          </h1>
          <p className="page-subtitle">{description}</p>
        </div>

        {/* Accesos rápidos a laboratorios adyacentes */}
        <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'center', flexWrap: 'wrap' }}>
          {simNumber > 1 && (
            <Link
              to={SIM_ROUTES[simNumber - 1]?.path || '/laboratorio'}
              className="btn btn-outline"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              ← {SIM_ROUTES[simNumber - 1]?.name}
            </Link>
          )}
          {simNumber < 6 && (
            <Link
              to={SIM_ROUTES[simNumber + 1]?.path || '/laboratorio'}
              className="btn btn-outline"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: 'var(--color-primary-400)', color: 'var(--color-primary-300)' }}
            >
              {SIM_ROUTES[simNumber + 1]?.name} →
            </Link>
          )}
        </div>
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

      {/* Navegación al pie del laboratorio */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          {simNumber > 1 && (
            <Link to={SIM_ROUTES[simNumber - 1]?.path || '/laboratorio'} className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
              ← Anterior: {SIM_ROUTES[simNumber - 1]?.name}
            </Link>
          )}
        </div>
        <Link to="/laboratorio" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
          Hub de Laboratorios 🔬
        </Link>
        <div>
          {simNumber < 6 ? (
            <Link to={SIM_ROUTES[simNumber + 1]?.path || '/laboratorio'} className="btn btn-primary" style={{ fontSize: '0.85rem' }}>
              Siguiente: {SIM_ROUTES[simNumber + 1]?.name} →
            </Link>
          ) : (
            <Link to="/postest" className="btn btn-primary" style={{ fontSize: '0.85rem', background: '#10b981', borderColor: '#10b981' }}>
              🎓 Realizar Post-Test Final →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}