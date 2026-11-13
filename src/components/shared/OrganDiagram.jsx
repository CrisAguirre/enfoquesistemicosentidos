import { useState } from 'react';
import './OrganDiagram.css';

/**
 * OrganDiagram — imagen PNG anatómica o canvas esquemático con etiquetas interactivas brillantes.
 *
 * @param {string}  imageSrc   — ruta de la imagen PNG del órgano (opcional).
 * @param {string}  imageAlt   — alt text de la imagen.
 * @param {string}  title      — título del diagrama.
 * @param {string}  subtitle   — subtítulo (pensamiento sistémico).
 * @param {Array}   labels     — [{ id, name, description, role, top, left, color? }]
 */
export default function OrganDiagram({ imageSrc, imageAlt, title, subtitle, labels = [] }) {
  const [_highlighted, setHighlighted] = useState(null);

  return (
    <div className="organ-diagram">
      {title && (
        <div className="organ-diagram__title">
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}

      <div className="organ-diagram__img-wrap" style={{ minHeight: imageSrc ? 'auto' : '360px', background: imageSrc ? 'none' : 'radial-gradient(ellipse at center, rgba(30,41,59,0.85) 0%, rgba(15,23,42,0.95) 100%)', borderRadius: '16px', position: 'relative', overflow: 'visible' }}>
        {imageSrc ? (
          <img src={imageSrc} alt={imageAlt || title || 'Diagrama anatómico'} draggable={false} style={{ borderRadius: '16px' }} />
        ) : (
          <div style={{ width: '100%', height: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>
            {/* Fondo esquemático con cuadrícula suave */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px', opacity: 0.7 }} />
            <div style={{ position: 'absolute', top: '15px', left: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Esquema de conexiones y componentes biológicos
            </div>
          </div>
        )}

        {labels.map((label) => {
          const leftNum = parseFloat(label.left) || 50;
          const alignClass = leftNum < 28 ? 'organ-label--align-left' : leftNum > 72 ? 'organ-label--align-right' : '';
          return (
            <div
              key={label.id}
              className={`organ-label ${alignClass}`}
              style={{
                top: label.top,
                left: label.left,
                '--label-color': label.color || '#60a5fa',
              }}
              onMouseEnter={() => setHighlighted(label.id)}
              onMouseLeave={() => setHighlighted(null)}
            >
              <div className="organ-label__dot" />

              <div className="organ-label__tag">
                {label.name}
              </div>

              <div className="organ-label__tooltip">
                <div className="organ-label__tooltip-title">{label.name}</div>
                <div className="organ-label__tooltip-desc">{label.description}</div>
                <div className="organ-label__tooltip-role">{label.role}</div>
              </div>
            </div>
          );
        })}
      </div>

      {labels.length > 0 && (
        <div className="organ-diagram__legend">
          {labels.map((label) => (
            <div
              key={label.id}
              className="organ-diagram__legend-item"
              style={{ '--legend-color': label.color || '#60a5fa' }}
              onMouseEnter={() => setHighlighted(label.id)}
              onMouseLeave={() => setHighlighted(null)}
            >
              <span className="organ-diagram__legend-dot" />
              {label.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
