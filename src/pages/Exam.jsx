import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { examApi } from '../api/exam';
import './pages.css';

export default function Exam({ examId }) {
  const { id } = useParams();
  const simId = examId || id;

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // State machine: 'intro' -> 'quiz' -> 'results'
  const [step, setStep] = useState('intro');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setExam(null);
    setAnswers({});
    setResult(null);
    setStep('intro');
    setCurrentIndex(0);
    
    examApi
      .getBySimulation(simId)
      .then((data) => {
        if (active) {
          setExam(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Error al cargar la evaluación');
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [simId]);

  function selectSingle(qid, option) {
    setAnswers((a) => ({ ...a, [qid]: option }));
  }

  function toggleMultiple(qid, option) {
    setAnswers((a) => {
      const cur = Array.isArray(a[qid]) ? a[qid] : [];
      const next = cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option];
      return { ...a, [qid]: next };
    });
  }

  function isAnswered(q) {
    const v = answers[q.id];
    return q.subtype === 'multiple' ? Array.isArray(v) && v.length > 0 : !!v;
  }

  const allAnswered = exam ? exam.questions.every(isAnswered) : false;
  const canGoNext = exam && isAnswered(exam.questions[currentIndex]);

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        answers: exam.questions.map((q) => ({
          questionId: q.id,
          selected: q.subtype === 'multiple' ? answers[q.id] || [] : answers[q.id] ?? null,
        })),
      };
      const data = await examApi.submit(simId, payload);
      setResult(data);
      setStep('results');
    } catch (err) {
      setError(err.message || 'Error al enviar la evaluación');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <Link to="/laboratorio" className="back-link">← Volver al Laboratorio</Link>
          <h1 className="page-title">Evaluación</h1>
        </div>
        <div className="placeholder"><p>Cargando evaluación…</p></div>
      </div>
    );
  }

  if (error && !exam) {
    return (
      <div className="page">
        <div className="page-header">
          <Link to="/laboratorio" className="back-link">← Volver al Laboratorio</Link>
          <h1 className="page-title">Evaluación</h1>
        </div>
        <div className="auth-error">{error}</div>
      </div>
    );
  }

  if (step === 'results' && result) {
    const porcentaje = Math.round((result.score / result.total) * 100);
    return (
      <div className="page">
        <div className="page-header">
          <Link to="/laboratorio" className="back-link">← Volver al Laboratorio</Link>
          <h1 className="page-title">Resultado Final</h1>
        </div>
        <div className="placeholder" style={{ padding: '3rem 2rem', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '12px' }}>
          <div className="stat-value" style={{ fontSize: '4rem', color: porcentaje >= 60 ? '#10b981' : '#ef4444' }}>
            {result.score} / {result.total}
          </div>
          <h3 style={{ margin: '1rem 0' }}>Has obtenido un {porcentaje}%</h3>
          <p className="page-subtitle" style={{ margin: '0.5rem auto' }}>
            {porcentaje >= 80 ? '¡Excelente! Dominas el pensamiento sistémico en este laboratorio.' : 
             porcentaje >= 60 ? 'Buen trabajo, pero aún hay relaciones sistémicas que puedes mejorar.' : 
             'Te recomendamos repasar el laboratorio y la causalidad entre los componentes antes de volver a intentarlo.'}
          </p>
          <div className="hero-actions" style={{ marginTop: '2rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => { 
              setResult(null); 
              setAnswers({}); 
              setCurrentIndex(0);
              setStep('intro');
            }}>Intentar de nuevo</button>
            <Link to="/laboratorio" className="btn btn-outline">Volver al Laboratorio</Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'intro') {
    return (
      <div className="page">
        <div className="page-header">
          <Link to="/laboratorio" className="back-link">← Volver al Laboratorio</Link>
          <h1 className="page-title">{exam.title}</h1>
        </div>
        <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ color: '#60a5fa', marginBottom: '1.5rem' }}>Instrucciones y Temáticas</h2>
          
          <div style={{ marginBottom: '2rem', lineHeight: '1.7', fontSize: '1.1rem' }}>
            <p>Estás a punto de iniciar la evaluación correspondiente a esta simulación. Las temáticas a evaluar incluyen:</p>
            <ul style={{ paddingLeft: '1.5rem', margin: '1rem 0' }}>
              <li><strong>Componentes del sistema:</strong> Identificación de las partes funcionales y su propósito.</li>
              <li><strong>Relaciones de causalidad:</strong> Entender cómo la alteración de un componente afecta al resto.</li>
              <li><strong>Visión sistémica:</strong> Análisis del equilibrio (homeostasis) y flujos.</li>
            </ul>
            
            <p style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>Recomendaciones importantes:</p>
            <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
              <li>Lee cuidadosamente el enunciado de cada pregunta.</li>
              <li>Presta atención a si la pregunta permite <strong>seleccionar múltiples respuestas</strong> o solo una.</li>
              <li>Podrás navegar entre las preguntas usando los botones de "Anterior" y "Siguiente".</li>
              <li>Asegúrate de responder todo antes de presionar "Enviar evaluación".</li>
            </ul>
          </div>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => setStep('quiz')} style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
              Empezar Evaluación
            </button>
          </div>
        </div>
      </div>
    );
  }

  // step === 'quiz'
  const q = exam.questions[currentIndex];
  
  return (
    <div className="page">
      <div className="page-header" style={{ marginBottom: '1rem' }}>
        <h1 className="page-title">{exam.title}</h1>
        <div className="quiz-progress" style={{ marginTop: '1rem', color: '#94a3b8' }}>
          Pregunta {currentIndex + 1} de {exam.questions.length}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div className="exam-question" style={{ background: 'transparent', border: 'none', padding: 0 }}>
          <div className="exam-question-text" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>
            {currentIndex + 1}. {q.text}
            {q.subtype === 'multiple' && (
              <div style={{ color: '#60a5fa', fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: 'normal' }}>
                * Pregunta de selección múltiple (elige todas las opciones correctas)
              </div>
            )}
          </div>
          
          <div className="options-grid" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {q.options.map((opt) => {
              const selected = q.subtype === 'multiple'
                ? (answers[q.id] || []).includes(opt)
                : answers[q.id] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  className={`exam-option${selected ? ' selected' : ''}`}
                  onClick={() => (q.subtype === 'multiple' ? toggleMultiple(q.id, opt) : selectSingle(q.id, opt))}
                  style={{ textAlign: 'left', padding: '1rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                      width: '20px', height: '20px', 
                      borderRadius: q.subtype === 'multiple' ? '4px' : '50%',
                      border: `2px solid ${selected ? '#3b82f6' : '#475569'}`,
                      background: selected ? '#3b82f6' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {selected && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
                    </div>
                    {opt}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        {error && <div className="auth-error" style={{ marginTop: '1.5rem' }}>{error}</div>}

        <div className="quiz-navigation" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
          <button 
            className="btn btn-outline" 
            onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
            disabled={currentIndex === 0 || submitting}
          >
            ← Anterior
          </button>
          
          {currentIndex < exam.questions.length - 1 ? (
            <button 
              className="btn btn-primary" 
              onClick={() => setCurrentIndex(i => i + 1)}
              disabled={!canGoNext || submitting}
            >
              Siguiente →
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit} 
              disabled={!allAnswered || submitting}
              style={{ background: '#10b981', borderColor: '#10b981' }}
            >
              {submitting ? 'Enviando...' : 'Finalizar y Enviar ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

