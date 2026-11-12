import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { forumApi } from '../api/forum';
import './pages.css';

export default function Foro() {
  const { session } = useParams();
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  function load() {
    setLoading(true);
    forumApi
      .listBySession(session)
      .then(setPosts)
      .catch((e) => setError(e.message || 'Error al cargar el foro'))
      .finally(() => setLoading(false));
  }

  useEffect(load, [session]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    setError('');
    try {
      await forumApi.create({ session: Number(session), text: text.trim() });
      setText('');
      load();
    } catch (err) {
      setError(err.message || 'Error al publicar');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/sesiones" className="back-link">← Volver a Mis Sesiones</Link>
        <h1 className="page-title">Foro · Sesión {session}</h1>
        <p className="page-subtitle">Comparte tus ideas sobre las interconexiones del sistema.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu aporte al foro…"
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--text-primary)',
            font: 'inherit',
            resize: 'vertical',
          }}
        />
        {error && <div className="auth-error">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={sending || !text.trim()}>
          {sending ? 'Publicando...' : 'Publicar'}
        </button>
      </form>

      {loading && <div className="placeholder"><p>Cargando foro…</p></div>}

      {!loading && posts.length === 0 && (
        <div className="placeholder"><p>Aún no hay aportes. ¡Sé el primero en participar!</p></div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {posts.map((p) => (
          <div key={p._id} className="glass-card" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
              <strong style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9rem' }}>{p.user?.full_name || 'Estudiante'}</strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(p.created_at).toLocaleString()}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
