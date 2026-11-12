import { useEffect, useState } from 'react';
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
        <h1 className="page-title">Resultados</h1>
        <p className="page-subtitle">Tus evaluaciones realizadas y tu puntaje.</p>
      </div>

      {loading && <div className="placeholder"><p>Cargando resultados…</p></div>}
      {error && <div className="auth-error">{error}</div>}

      {!loading && !error && exams.length === 0 && (
        <div className="placeholder">
          <div className="placeholder-icon">🏆</div>
          <div className="placeholder-title">Aún no tienes resultados</div>
          <p>Completa una evaluación en el Laboratorio para ver tu puntaje aquí.</p>
        </div>
      )}

      {exams.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Evaluación</th>
              <th>Puntaje</th>
              <th>Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((e) => (
              <tr key={e._id}>
                <td>{e.simulationTitle}</td>
                <td>{e.score} / {e.total}</td>
                <td>{Math.round((e.score / e.total) * 100)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
