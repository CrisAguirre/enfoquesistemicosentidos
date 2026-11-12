import { useEffect, useState } from 'react';
import { evidenciaApi } from '../api/evidencia';
import './pages.css';

export default function Evidencias() {
  const [items, setItems] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  function load() {
    setLoading(true);
    evidenciaApi
      .listMine()
      .then(setItems)
      .catch((e) => setError(e.message || 'Error al cargar evidencias'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!titulo.trim() || !contenido.trim()) return;
    setSending(true);
    setError('');
    try {
      await evidenciaApi.create({ titulo: titulo.trim(), tipoArchivo: 'texto', contenido: contenido.trim() });
      setTitulo('');
      setContenido('');
      load();
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Evidencias y Análisis</h1>
        <p className="page-subtitle">
          Registra tus síntesis, informes, diagramas (en texto) y conclusiones de cada sesión.
        </p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <div className="auth-field">
          <label htmlFor="titulo">Título</label>
          <input id="titulo" type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Informe de la sesión 5" required />
        </div>
        <div className="auth-field">
          <label htmlFor="contenido">Contenido</label>
          <textarea
            id="contenido"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            rows={4}
            required
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
        </div>
        {error && <div className="auth-error">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending ? 'Guardando...' : 'Guardar evidencia'}
        </button>
      </form>

      {loading && <div className="placeholder"><p>Cargando evidencias…</p></div>}

      {!loading && items.length === 0 && (
        <div className="placeholder">
          <div className="placeholder-icon">📄</div>
          <p>Aún no has registrado evidencias.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map((it) => (
          <div key={it._id} className="glass-card" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.35rem' }}>
              <strong style={{ fontFamily: 'var(--font-primary)', fontSize: '0.9rem' }}>{it.titulo}</strong>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(it.created_at).toLocaleString()}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>{it.contenido}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
