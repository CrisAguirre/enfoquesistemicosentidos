import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const LAB_ROUTES = {
  1: '/laboratorio/introduccion',
  2: '/laboratorio/vista',
  3: '/laboratorio/oido',
  4: '/laboratorio/olfato-gusto',
  5: '/laboratorio/tacto',
  6: '/laboratorio/integracion-sensorial',
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

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Secuencia Didáctica</h1>
        <p className="page-subtitle">
          Recorrido de 6 sesiones pedagógicas para fortalecer el pensamiento sistémico en neurociencias de los sentidos.
        </p>
      </div>

      {/* Banner de Pre-Test */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          borderLeft: '5px solid #a855f7',
          background: 'rgba(168, 85, 247, 0.08)',
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#c084fc' }}>
            Sesión 1 · Fase Inicial
          </span>
          <h3 style={{ margin: '0.25rem 0', fontSize: '1.15rem' }}>📋 Pre-Test: Diagnóstico de Saberes Previos</h3>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Realiza la prueba diagnóstica antes de avanzar con las simulaciones interactivas.
          </p>
        </div>
        <Link to="/pretest" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
          Tomar Pre-Test →
        </Link>
      </div>

      {loading && <div className="placeholder"><p>Cargando sesiones…</p></div>}
      {error && <div className="auth-error">{error}</div>}

      <div className="resources-grid">
        {sessions.map((s, index) => {
          const labPath = LAB_ROUTES[s.number] || '/laboratorio';
          return (
            <FadeContent key={s.number} delay={index * 0.15} duration={0.6} direction="up">
              <div className="glass-card session-card-animated">
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
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
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

                  {/* Acciones directas por sesión */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <Link
                      to={labPath}
                      className="btn btn-primary"
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', flex: 1, textAlign: 'center' }}
                    >
                      🔬 Laboratorio
                    </Link>
                    <Link
                      to={`/foro/${s.number}`}
                      className="btn btn-outline"
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem', flex: 1, textAlign: 'center' }}
                    >
                      💬 Foro
                    </Link>
                  </div>
                </div>
              </div>
            </FadeContent>
          );
        })}
      </div>

      {/* Banner de Post-Test */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem 1.5rem',
          marginTop: '2.5rem',
          borderLeft: '5px solid #10b981',
          background: 'rgba(16, 185, 129, 0.08)',
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#34d399' }}>
            Sesión 6 · Cierre del Curso
          </span>
          <h3 style={{ margin: '0.25rem 0', fontSize: '1.15rem' }}>🎓 Post-Test: Evaluación Final Sistémica</h3>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Presenta esta prueba al culminar la secuencia didáctica para comprobar tu nivel de comprensión sistémica.
          </p>
        </div>
        <Link to="/postest" className="btn btn-outline" style={{ borderColor: '#10b981', color: '#34d399', whiteSpace: 'nowrap' }}>
          Tomar Post-Test →
        </Link>
      </div>
    </div>
  );
}
