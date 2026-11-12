import { useState } from 'react';
import './SketchfabViewer.css';

export default function SketchfabViewer({
  modelId,
  title,
  author,
  authorUrl,
  modelUrl,
  height = 480,
  accentColor = '#a855f7',
  translatedParts = [],
  partsTitle = 'Partes Anatómicas y Función Sistémica',
}) {
  const [showParts, setShowParts] = useState(true);

  const embedSrc = `https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_theme=dark&dnt=1&camera=0`;

  return (
    <div className="sketchfab-viewer-container">
      {/* Marco 3D Sketchfab */}
      <div className="sketchfab-iframe-wrapper" style={{ height: `${height}px` }}>
        <iframe
          title={title}
          src={embedSrc}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* Atribución CC según licencia de Sketchfab */}
      <div className="sketchfab-attribution">
        <span>
          Modelo 3D: <a href={modelUrl} target="_blank" rel="noopener noreferrer">{title}</a> por{' '}
          <a href={authorUrl} target="_blank" rel="noopener noreferrer">{author}</a> en Sketchfab
        </span>
        <span style={{ opacity: 0.75 }}>🖱️ Clic izquierdo para rotar · Clic derecho para desplazar · Rueda para zoom</span>
      </div>

      {/* Acordeón de partes traducidas y función sistémica */}
      {translatedParts && translatedParts.length > 0 && (
        <div className="sketchfab-parts-accordion" style={{ borderLeft: `4px solid ${accentColor}` }}>
          <div className="sketchfab-parts-header" onClick={() => setShowParts(!showParts)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📖</span>
              <h4 style={{ margin: 0, color: accentColor }}>
                {partsTitle} ({translatedParts.length} estructuras traducidas)
              </h4>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              {showParts ? '▲ Ocultar' : '▼ Mostrar'}
            </span>
          </div>

          {showParts && (
            <div className="sketchfab-parts-grid">
              {translatedParts.map((p, idx) => (
                <div
                  key={idx}
                  className="part-card-translated"
                  style={{ '--part-accent': p.color || accentColor }}
                >
                  <div className="part-names-row">
                    <span className="part-name-es">{p.es}</span>
                    {p.en && <span className="part-name-en">({p.en})</span>}
                  </div>
                  <div className="part-desc">{p.desc}</div>
                  {p.role && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                      <strong>Rol sistémico:</strong> {p.role}
                    </div>
                  )}
                  {p.lineamiento && (
                    <span className="part-lineamiento-badge">
                      {p.lineamiento}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

