import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionApi } from '../api/session';
import { FadeContent } from '../reactbits';
import './pages.css';

const LINEAMIENTOS = {
  1: 'Componentes',
  2: 'Causalidad',
  3: 'Representación',
  4: 'Escalas',
  5: 'Conservación',
  6: 'Propósito',
  7: 'Estabilidad',
};

/* Floating symbols per session to decorate each card */
const SESSION_SYMBOLS = {
  1: ['🎬', '🧠'],
  2: ['👁️', '💡'],
  3: ['👂', '🎵'],
  4: ['👃', '👅'],
  5: ['🖐️', '⚡'],
  6: ['🧠', '🌐', '👁️', '👂'],
};

export default function Sesiones() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    sessionApi
      .list()
      .then(setSessions)
      .catch((e) => setError(e.message || 'Error al cargar sesiones'))
      .finally(() => setLoading(false));
  }, []);

  const handleCardClick = (sessionNumber) => {
    navigate(`/laboratorio?highlight=${sessionNumber}`);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Secuencia Didáctica</h1>
        <p className="page-subtitle">
          Recorrido de 6 sesiones para fortalecer tu pensamiento sistémico sobre los sentidos y el cerebro.
        </p>
      </div>

      {loading && <div className="placeholder"><p>Cargando sesiones…</p></div>}
      {error && <div className="auth-error">{error}</div>}

      <div className="resources-grid">
        {sessions.map((s, index) => (
          <FadeContent key={s.number} delay={index * 0.15} duration={0.6} direction="up">
            <div
              className="glass-card session-card-animated"
              onClick={() => handleCardClick(s.number)}
            >
              {/* Animated gradient background */}
              <div className="session-card-bg" />

              {/* Floating symbols */}
              <div className="session-floating-symbols">
                {(SESSION_SYMBOLS[s.number] || []).map((sym, i) => (
                  <span
                    key={i}
                    className="session-float-icon"
                    style={{
                      animationDelay: `${i * 1.5}s`,
                      top: `${15 + i * 25}%`,
                      right: `${8 + (i % 2) * 12}%`,
                    }}
                  >
                    {sym}
                  </span>
                ))}
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                {s.completed && (
                  <span style={{ position: 'absolute', top: 0, right: 0, fontSize: '1.4rem' }}>✅</span>
                )}
                <div className="sim-card-number">Sesión {s.number}</div>
                <h3 style={{ fontFamily: 'var(--font-primary)', margin: '0.5rem 0' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  {s.objective}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                  {s.lineamientos.map((l) => (
                    <span
                      key={l}
                      className="state-btn-label"
                      style={{
                        fontSize: '0.68rem',
                        padding: '0.2rem 0.5rem',
                        background: 'rgba(168,85,247,0.15)',
                        border: '1px solid rgba(168,85,247,0.3)',
                        borderRadius: 'var(--radius-full)',
                        color: 'var(--color-primary-300)',
                      }}
                    >
                      {LINEAMIENTOS[l]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeContent>
        ))}
      </div>
    </div>
  );
}
