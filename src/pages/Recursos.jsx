import { useState } from 'react';
import { FadeContent } from '../reactbits';
import './pages.css';

const VIDEOS_SIMULACIONES = [
  {
    id: 'intro',
    title: 'Pensamiento Sistémico en Biología',
    desc: 'Los 7 lineamientos del Dr. Eliécer Pineda Ballesteros aplicados a los seres vivos.',
    url: 'https://www.youtube.com/embed/JmC9nEvw4T8',
  },
  {
    id: 'vista',
    title: 'La Vista y la Luz',
    desc: 'Cómo el ojo enfoca la luz y la retina transduce fotones en señales bioeléctricas.',
    url: 'https://www.youtube.com/embed/uUpdItCbr24',
  },
  {
    id: 'oido',
    title: 'El Oído y la Audición',
    desc: 'Del tímpano a la cóclea: el viaje de la onda de presión acústica.',
    url: 'https://www.youtube.com/embed/TmOHclF31ww',
  },
  {
    id: 'cerebro',
    title: 'El Cerebro y la Integración Multisensorial',
    desc: 'Cómo el encéfalo combina los 5 sentidos para crear una percepción coherente.',
    url: 'https://www.youtube.com/embed/AjkzLXGZqbg',
  },
];

const RECURSOS_CATS = [
  { id: 'videos', icon: '🎬', title: 'Videos Educativos', desc: 'Recopilación de explicaciones audiovisuales de los sentidos.' },
  { id: 'docs', icon: '📘', title: 'Guías de Aprendizaje', desc: 'Material de lectura sobre pensamiento sistémico y fisiología sensorial.' },
  { id: 'links', icon: '🔗', title: 'Enlaces de Consulta', desc: 'Sitios científicos recomendados para profundizar.' },
];

export default function Recursos() {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Recursos de Aprendizaje</h1>
        <p className="page-subtitle">Materiales complementarios, videos y guías sobre los sentidos y el cerebro.</p>
      </div>

      {!activeCategory ? (
        <div className="resources-grid">
          {RECURSOS_CATS.map((r, i) => (
            <FadeContent key={r.id} delay={i * 0.15} duration={0.6} direction="up">
              <div
                className="glass-card"
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={() => setActiveCategory(r.id)}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{r.icon}</div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--color-primary-400)' }}>{r.title}</h3>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{r.desc}</p>
              </div>
            </FadeContent>
          ))}
        </div>
      ) : (
        <div>
          <button
            className="sim-btn"
            onClick={() => setActiveCategory(null)}
            style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            ← Volver a categorías
          </button>

          {activeCategory === 'videos' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {VIDEOS_SIMULACIONES.map((v) => (
                <div key={v.id} className="glass-card" style={{ padding: '1.25rem' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#c084fc' }}>{v.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{v.desc}</p>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
                    <iframe
                      src={v.url}
                      title={v.title}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeCategory !== 'videos' && (
            <div className="placeholder">
              <div className="placeholder-icon">📘</div>
              <div className="placeholder-title">Sección en actualización</div>
              <p>Tu profesor publicará aquí lecturas y enlaces complementarios durante las sesiones.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
