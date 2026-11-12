import { useState, useEffect, useRef } from 'react';
import './SketchfabViewer.css';

// Diccionario médico de respaldo para términos comunes en modelos anatómicos 3D
const MEDICAL_TRANSLATIONS = {
  // Ojo / Vista
  cornea: { es: 'Córnea', desc: 'Capa transparente anterior del ojo que proporciona ~70% de la refracción óptica.' },
  iris: { es: 'Iris', desc: 'Diafragma muscular pigmentado que regula la cantidad de luz que penetra al ojo.' },
  pupil: { es: 'Pupila', desc: 'Apertura central del iris que se contrae (miosis) o dilata (midriasis) según la iluminación.' },
  lens: { es: 'Cristalino', desc: 'Lente biconvexo flexible que ajusta el enfoque fino a diferentes distancias.' },
  crystalline: { es: 'Cristalino', desc: 'Lente transparente encargado de la acomodación visual.' },
  retina: { es: 'Retina', desc: 'Tejido fotorreceptor nervioso que convierte fotones en potenciales de acción.' },
  fovea: { es: 'Fóvea y Mácula', desc: 'Zona central de la retina con densidad máxima de conos para visión de alta agudeza.' },
  sclera: { es: 'Esclerótica', desc: 'Capa externa blanca y fibrosa que mantiene la forma y protege las estructuras internas.' },
  choroid: { es: 'Coroides', desc: 'Capa vascular oscura con melanina que nutre la retina y absorbe luz parásita.' },
  optic: { es: 'Nervio Óptico', desc: 'Haz de axones ganglionares que transporta la señal visual al lóbulo occipital.' },
  vitreous: { es: 'Humor Vítreo', desc: 'Sustancia gelatinosa que mantiene la presión interna y la retina adherida.' },
  ciliary: { es: 'Cuerpo / Músculos Ciliares', desc: 'Estructura muscular que modifica la curvatura del cristalino y secreta humor acuoso.' },

  // Oído / Audición
  tympanic: { es: 'Membrana Timpánica (Tímpano)', desc: 'Membrana que vibra con las ondas aéreas y mueve los huesecillos.' },
  eardrum: { es: 'Membrana Timpánica (Tímpano)', desc: 'Transductor mecánico primario que recibe la vibración del sonido.' },
  malleus: { es: 'Martillo', desc: 'Primer huesecillo del oído medio conectado al tímpano.' },
  incus: { es: 'Yunque', desc: 'Segundo huesecillo que articula el martillo con el estribo.' },
  stapes: { es: 'Estribo', desc: 'Huesecillo más pequeño del cuerpo que empuja la ventana oval de la cóclea.' },
  ossicles: { es: 'Cadena de Huesecillos (Martillo, Yunque y Estribo)', desc: 'Sistema de palancas que amplifica la presión sonora ~20 veces.' },
  cochlea: { es: 'Cóclea (Caracol)', desc: 'Órgano sensorial en espiral donde las células ciliadas transducen vibración en impulsos.' },
  semicircular: { es: 'Canales Semicirculares', desc: 'Estructuras vestibulares en tres ejes que detectan rotación y equilibrio.' },
  vestibular: { es: 'Sistema Vestibular', desc: 'Subsistema sensorial para el equilibrio y la orientación espacial.' },
  auditory: { es: 'Nervio Auditivo (Coclear)', desc: 'Vía nerviosa aferente que transmite tonos a la corteza temporal.' },
  eustachian: { es: 'Trompa de Eustaquio', desc: 'Canal de ventilación que equilibra la presión del oído medio con la atmósfera.' },
  pinna: { es: 'Pabellón Auricular', desc: 'Cartílago externo que canaliza y localiza las ondas sonoras.' },
  ear: { es: 'Conducto Auditivo Externo', desc: 'Canal que conduce las ondas sonoras hacia la membrana timpánica.' },

  // Nariz / Olfato
  nasal: { es: 'Cavidad Nasal', desc: 'Espacio aéreo recubierto de mucosa que filtra y acondiciona el aire.' },
  olfactory: { es: 'Bulbo y Epitelio Olfatorio', desc: 'Zona sensorial con receptores para moléculas químicas volátiles.' },
  conchae: { es: 'Cornetes Nasales', desc: 'Estructuras óseas que generan turbulencia para dirigir los olores al epitelio.' },
  turbinates: { es: 'Cornetes Nasales', desc: 'Pliegues que aumentan la superficie de captación química y térmica.' },
  septum: { es: 'Tabique Nasal', desc: 'Pared ósea y cartilaginosa que divide las dos fosas nasales.' },
  cribriform: { es: 'Lámina Cribosa', desc: 'Hueso perforado por donde cruzan los axones del nervio olfatorio.' },

  // Lengua / Gusto
  tongue: { es: 'Lengua y Músculos Linguales', desc: 'Órgano muscular portador de las papilas gustativas.' },
  papillae: { es: 'Papilas Gustativas', desc: 'Estructuras linguales que alojan los botones quimiorreceptores.' },
  fungiform: { es: 'Papilas Fungiformes', desc: 'Papilas con forma de hongo ricas en botones gustativos.' },
  circumvallate: { es: 'Papilas Caliciformes (Valadas)', desc: 'Grandes papilas en la V lingual especializadas en amargo.' },
  foliate: { es: 'Papilas Foliadas', desc: 'Pliegues en los bordes laterales posteriores de la lengua.' },
  filiform: { es: 'Papilas Filiformes', desc: 'Proyecciones mecánicas táctiles sin botones gustativos.' },
  taste: { es: 'Botón Gustativo', desc: 'Transductor químico con células receptoras que detectan los 5 sabores básicos.' },

  // Piel / Tacto
  epidermis: { es: 'Epidermis', desc: 'Capa superficial protectora de queratinocitos impermeables.' },
  dermis: { es: 'Dermis', desc: 'Capa vascular y elástica que alberga los corpúsculos táctiles.' },
  hypodermis: { es: 'Hipodermis (Tejido Subcutáneo)', desc: 'Capa grasa de aislamiento térmico y amortiguación física.' },
  meissner: { es: 'Corpúsculo de Meissner', desc: 'Mecanorreceptor de tacto ligero dinámico y textura.' },
  pacinian: { es: 'Corpúsculo de Pacini', desc: 'Mecanorreceptor de vibración profunda de alta frecuencia.' },
  pacini: { es: 'Corpúsculo de Pacini', desc: 'Receptor de presión rápida y vibraciones mecánicas.' },
  merkel: { es: 'Disco de Merkel', desc: 'Receptor de presión táctil sostenida y discriminación de formas.' },
  ruffini: { es: 'Terminación de Ruffini', desc: 'Receptor de estiramiento dérmico y temperatura cálida.' },
  nerve: { es: 'Terminaciones Nerviosas Libres', desc: 'Fibras amielínicas nociceptoras que transmiten dolor tisular y frío.' },
  follicle: { es: 'Folículo Piloso', desc: 'Unidad pilosebácea con fibras nerviosas táctiles peritriquiales.' },

  // Cerebro / Integración
  frontal: { es: 'Lóbulo Frontal', desc: 'Funciones ejecutivas, toma de decisiones y corteza motora.' },
  parietal: { es: 'Lóbulo Parietal', desc: 'Corteza somatosensorial primaria: procesa tacto, propiocepción y temperatura.' },
  occipital: { es: 'Lóbulo Occipital', desc: 'Corteza visual primaria: decodifica las señales lumínicas de la retina.' },
  temporal: { es: 'Lóbulo Temporal', desc: 'Corteza auditiva primaria y compresión lingüística y de memoria.' },
  cerebellum: { es: 'Cerebelo', desc: 'Coordinación motora fina, precisión y equilibrio postural.' },
  brainstem: { es: 'Tronco Encefálico', desc: 'Control reflejo autónomo y paso de todas las vías sensoriales y motoras.' },
  thalamus: { es: 'Tálamo', desc: 'Centro de relevo, filtrado y distribución para todos los sentidos (excepto olfato directo).' },
};

function resolveTranslation(rawTitle, rawContent, index, translatedParts) {
  // 1. Si tenemos una parte definida en translatedParts para este índice
  if (translatedParts && translatedParts[index]) {
    const part = translatedParts[index];
    const roleText = part.role ? `\n\n[Función Sistémica]: ${part.role}` : '';
    return {
      title: `${index + 1}. ${part.es}`,
      content: `${part.desc}${roleText}`,
      matchedPart: part,
    };
  }

  // 2. Intentar coincidir por título en inglés
  const titleLower = (rawTitle || '').toLowerCase();
  for (const [key, val] of Object.entries(MEDICAL_TRANSLATIONS)) {
    if (titleLower.includes(key)) {
      return {
        title: `${index + 1}. ${val.es}`,
        content: val.desc,
        matchedPart: { es: val.es, en: rawTitle, desc: val.desc },
      };
    }
  }

  // 3. Si no coincide, mantener título con prefijo numérico
  return {
    title: `${index + 1}. ${rawTitle || 'Estructura Anatómica'}`,
    content: rawContent || 'Estructura anatómica del modelo 3D.',
  };
}

export default function SketchfabViewer({
  modelId,
  title,
  author,
  authorUrl,
  modelUrl,
  height = 490,
  accentColor = '#a855f7',
  translatedParts = [],
  partsTitle = 'Partes Anatómicas y Función Sistémica',
}) {
  const [showParts, setShowParts] = useState(true);
  const [apiReady, setApiReady] = useState(false);
  const [selectedPartIndex, setSelectedPartIndex] = useState(null);
  const [annotationsCount, setAnnotationsCount] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const iframeRef = useRef(null);
  const apiRef = useRef(null);

  const embedSrc = `https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_theme=dark&dnt=1&camera=0&annotations_visible=1`;

  // Cargar Sketchfab Viewer API y conectar con el iframe
  useEffect(() => {
    let isMounted = true;

    function initApi() {
      if (!window.Sketchfab || !iframeRef.current) return;

      try {
        const client = new window.Sketchfab(iframeRef.current);
        client.init(modelId, {
          autostart: 1,
          ui_theme: 'dark',
          dnt: 1,
          camera: 0,
          annotations_visible: 1,
          success: (api) => {
            if (!isMounted) return;
            apiRef.current = api;
            api.start();

            api.addEventListener('viewerready', () => {
              if (!isMounted) return;
              setApiReady(true);

              // Consultar y traducir las etiquetas 3D integradas
              api.getAnnotationList((err, annotations) => {
                if (err || !annotations || annotations.length === 0) return;

                if (isMounted) {
                  setAnnotationsCount(annotations.length);
                  setStatusMessage(`✓ ${annotations.length} etiquetas 3D traducidas al español`);
                }

                // Traducir dinámicamente cada etiqueta dentro del modelo 3D
                annotations.forEach((ann, idx) => {
                  const rawContent = ann.content ? (typeof ann.content === 'object' ? ann.content.raw : ann.content) : '';
                  const tr = resolveTranslation(ann.title, rawContent, idx, translatedParts);

                  api.updateAnnotation(idx, {
                    title: tr.title,
                    content: tr.content,
                  }, (updateErr) => {
                    if (updateErr) {
                      console.debug('Error al actualizar etiqueta Sketchfab:', updateErr);
                    }
                  });
                });
              });

              // Escuchar clics en las etiquetas dentro del visor 3D para sincronizar con la lista
              api.addEventListener('annotationSelect', (annIndex) => {
                if (isMounted && typeof annIndex === 'number' && annIndex >= 0) {
                  setSelectedPartIndex(annIndex);
                }
              });
            });
          },
          error: (err) => {
            console.debug('Aviso Sketchfab API (modo iframe estándar activo):', err);
          },
        });
      } catch (err) {
        console.debug('Excepción al iniciar Sketchfab client:', err);
      }
    }

    // Comprobar si el script de Sketchfab API ya está cargado
    if (window.Sketchfab) {
      initApi();
    } else {
      const existingScript = document.getElementById('sketchfab-viewer-api-script');
      if (existingScript) {
        existingScript.addEventListener('load', initApi);
      } else {
        const script = document.createElement('script');
        script.id = 'sketchfab-viewer-api-script';
        script.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
        script.async = true;
        script.onload = () => {
          if (isMounted) initApi();
        };
        document.head.appendChild(script);
      }
    }

    return () => {
      isMounted = false;
      apiRef.current = null;
    };
  }, [modelId, translatedParts]);

  // Al hacer clic en una tarjeta de la lista, navegar la cámara del 3D hacia esa etiqueta
  const handlePartClick = (index) => {
    setSelectedPartIndex(index);
    if (apiRef.current) {
      try {
        apiRef.current.gotoAnnotation(index, (err) => {
          if (err) console.debug('Aviso gotoAnnotation:', err);
        });
      } catch (e) {
        console.debug('gotoAnnotation no disponible:', e);
      }
    }
  };

  return (
    <div className="sketchfab-viewer-container">
      {/* Marco 3D Sketchfab */}
      <div className="sketchfab-iframe-wrapper" style={{ height: `${height}px` }}>
        <iframe
          ref={iframeRef}
          id={`sketchfab-frame-${modelId}`}
          title={title}
          src={embedSrc}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          loading="lazy"
        />
      </div>

      {/* Atribución CC y controles */}
      <div className="sketchfab-attribution">
        <span>
          Modelo 3D: <a href={modelUrl} target="_blank" rel="noopener noreferrer">{title}</a> por{' '}
          <a href={authorUrl} target="_blank" rel="noopener noreferrer">{author}</a> en Sketchfab
        </span>
        <div className="sketchfab-attribution-hints">
          <span className="sketchfab-hint">🖱️ Rotar: clic izquierdo · Desplazar: clic derecho · Zoom: rueda</span>
          {statusMessage && (
            <span className="sketchfab-badge-live">{statusMessage}</span>
          )}
        </div>
      </div>

      {/* Acordeón de partes traducidas y función sistémica */}
      {translatedParts && translatedParts.length > 0 && (
        <div className="sketchfab-parts-accordion" style={{ borderTop: `2px solid ${accentColor}` }}>
          <div className="sketchfab-parts-header" onClick={() => setShowParts(!showParts)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📖</span>
              <h4 style={{ margin: 0, color: accentColor }}>
                {partsTitle} ({translatedParts.length} estructuras numeradas)
              </h4>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="parts-click-hint">Haz clic en cualquier número para enfocar en 3D</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                {showParts ? '▲ Ocultar' : '▼ Mostrar'}
              </span>
            </div>
          </div>

          {showParts && (
            <div className="sketchfab-parts-grid">
              {translatedParts.map((p, idx) => {
                const isSelected = selectedPartIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`part-card-translated ${isSelected ? 'selected' : ''}`}
                    style={{ '--part-accent': p.color || accentColor }}
                    onClick={() => handlePartClick(idx)}
                    title={`Haz clic para enfocar la etiqueta #${idx + 1} (${p.es}) en el visor 3D`}
                  >
                    <div className="part-header-with-badge">
                      <span className="part-number-badge">#{p.num || idx + 1}</span>
                      <div className="part-names-col">
                        <span className="part-name-es">{p.es}</span>
                        {p.en && <span className="part-name-en">{p.en}</span>}
                      </div>
                    </div>
                    <div className="part-desc">{p.desc}</div>
                    {p.role && (
                      <div className="part-role-row">
                        <strong>Rol sistémico:</strong> {p.role}
                      </div>
                    )}
                    {p.lineamiento && (
                      <span className="part-lineamiento-badge">
                        {p.lineamiento}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
