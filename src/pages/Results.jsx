import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { examApi } from '../api/exam';
import './pages.css';

export default function Results() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    examApi
      .getMine()
      .then(setExams)
      .catch((e) => setError(e.message || 'Error al cargar resultados'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Resultados de Evaluaciones</h1>
        <p className="page-subtitle">Historial de calificaciones y progreso en pensamiento sistémico.</p>
      </div>

      {loading && <div className="placeholder"><p>Cargando resultados…</p></div>}
      {error && <div className="auth-error">{error}</div>}

      {!loading && !error && exams.length === 0 && (
        <div className="placeholder">
          <div className="placeholder-icon">🏆</div>
          <div className="placeholder-title">Aún no tienes evaluaciones registradas</div>
          <p style={{ marginBottom: '1.5rem' }}>
            Presenta el Pre-Test o completa una simulación en el Laboratorio para registrar tu puntaje.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/pretest" className="btn btn-primary">Tomar Pre-Test →</Link>
            <Link to="/laboratorio" className="btn btn-outline">Ir al Laboratorio</Link>
          </div>
        </div>
      )}

      {exams.length > 0 && (
        <div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Evaluación</th>
                <th>Puntaje</th>
                <th>Porcentaje</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((e) => {
                const pct = Math.round((e.score / e.total) * 100);
                return (
                  <tr key={e._id}>
                    <td><strong>{e.simulationTitle}</strong></td>
                    <td>{e.score} / {e.total}</td>
                    <td>{pct}%</td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          background: pct >= 60 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: pct >= 60 ? '#34d399' : '#f87171',
                        }}
                      >
                        {pct >= 60 ? '✓ Aprobado' : 'Reforzar'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/laboratorio" className="btn btn-primary">Continuar en el Laboratorio →</Link>
          </div>
        </div>
      )}
    </div>
  );
}
