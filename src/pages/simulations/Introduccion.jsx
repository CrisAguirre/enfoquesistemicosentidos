import React, { useState, useEffect } from 'react';
import { evidenciaApi } from '../../api/evidencia';
import DrawingCanvas from '../../components/shared/DrawingCanvas';
import SensoryPuzzle from '../../components/shared/SensoryPuzzle';
import { Aurora, BlurText } from '../../reactbits';
import './introduccion.css';
import './introduccion_animations.css';

const TAB_ORDER = ['ejemplos', 'sentidos', 'pensamiento', 'sintesis'];
const TAB_LABELS = {
  ejemplos: '¿Qué es un Sistema? 🪐',
  sentidos: 'Los 5 Sentidos y Reto 👁️',
  pensamiento: 'Pensamiento Sistémico 🎬',
  sintesis: 'Síntesis Final 📝',
};

const SENSES_INFO = [
  {
    id: 'vista',
    name: 'La Vista',
    icon: '👁️',
    organ: 'Ojo (Retina)',
    stimulus: 'Fotones de luz electromagnética (380 - 700 nm)',
    receptor: 'Fotorreceptores: Conos (color) y Bastones (luz tenue)',
    cortex: 'Corteza Visual Primaria (Lóbulo Occipital)',
    role: 'Permite anticipar eventos a distancia, reconocer formas, colores, profundidad y movimiento.',
    color: '#3b82f6',
  },
  {
    id: 'oido',
    name: 'El Oído',
    icon: '👂',
    organ: 'Oído (Cóclea / Órgano de Corti)',
    stimulus: 'Ondas mecánicas de presión acústica (20 - 20.000 Hz)',
    receptor: 'Células ciliadas mecano-receptoras',
    cortex: 'Corteza Auditiva Primaria (Lóbulo Temporal)',
    role: 'Permite la comunicación verbal, orientación espacial tridimensional y detección de alertas acústicas.',
    color: '#22c55e',
  },
  {
    id: 'olfato',
    name: 'El Olfato',
    icon: '👃',
    organ: 'Nariz (Epitelio Olfatorio)',
    stimulus: 'Moléculas químicas volátiles disueltas en moco',
    receptor: 'Neuronas quimiorreceptoras olfativas con cilios',
    cortex: 'Bulbo Olfatorio y Sistema Límbico (Amígdala e Hipocampo)',
    role: 'Detección a distancia de alimentos, peligros tóxicos, depredadores y anclaje de memorias emocionales.',
    color: '#eab308',
  },
  {
    id: 'gusto',
    name: 'El Gusto',
    icon: '👅',
    organ: 'Lengua (Papilas y Botones Gustativos)',
    stimulus: 'Moléculas solubles: dulce, salado, ácido, amargo y umami',
    receptor: 'Células gustativas especializadas',
    cortex: 'Corteza Gustativa Primaria (Ínsula anterior)',
    role: 'Filtro químico de ingesta: identifica nutrientes indispensables (glucosa, iones) y rechaza venenos potenciales.',
    color: '#ec4899',
  },
  {
    id: 'tacto',
    name: 'El Tacto',
    icon: '🖐️',
    organ: 'Piel (Epidermis y Dermis)',
    stimulus: 'Fuerzas mecánicas, vibración, temperatura y daño tisular',
    receptor: 'Corpúsculos de Meissner, Pacini, Merkel, Ruffini y terminaciones libres',
    cortex: 'Corteza Somatosensorial (Lóbulo Parietal)',
    role: 'Límite físico entre el organismo y el entorno, manipulación precisa de herramientas y preservación física (dolor).',
    color: '#f97316',
  },
];

export default function Introduccion() {
  const [activeTab, setActiveTab] = useState('ejemplos');
  const [activeSenseCard, setActiveSenseCard] = useState('vista');
  const [conclusion, setConclusion] = useState('');
  const [curiosidad, setCuriosidad] = useState('');
  const [apreciacion, setApreciacion] = useState('');

  const [isConclusionSaved, setIsConclusionSaved] = useState(false);
  const [isCuriosidadSaved, setIsCuriosidadSaved] = useState(false);
  const [isApreciacionSaved, setIsApreciacionSaved] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkPrevious = async () => {
      try {
        const response = await evidenciaApi.listMine();
        const evidencias = response.data || [];
        const find = (titulo) => evidencias.find((e) => e.titulo === titulo);

        const prevConc = find('Síntesis Final: Introducción a los Sentidos');
        if (prevConc) {
          setConclusion(prevConc.contenido);
          setIsConclusionSaved(true);
        }
        const prevCur = find('Curiosidad Sensorial: Introducción');
        if (prevCur) {
          setCuriosidad(prevCur.contenido);
          setIsCuriosidadSaved(true);
        }
        const prevApr = find('Apreciación: Interconexiones Sensoriales');
        if (prevApr) {
          setApreciacion(prevApr.contenido);
          setIsApreciacionSaved(true);
        }
      } catch (err) {
        console.error('Error al cargar evidencias:', err);
      }
    };
    checkPrevious();
  }, []);

  const goTab = (tab) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab(tab);
    setMessage('');
  };

  const continueNext = () => {
    const idx = TAB_ORDER.indexOf(activeTab);
    if (idx > -1 && idx < TAB_ORDER.length - 1) goTab(TAB_ORDER[idx + 1]);
  };

  const saveEvidencia = async (titulo, contenido, setSavedState) => {
    if (!contenido.trim()) return;
    setLoading(true);
    setMessage('');
    try {
      await evidenciaApi.create({
        titulo,
        contenido: contenido.trim(),
        tipoArchivo: 'texto',
      });
      setSavedState(true);
      setMessage(`✓ ${titulo} guardada exitosamente.`);
    } catch (err) {
      console.error(err);
      setMessage('Error al guardar la evidencia.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="intro-lab-container animate-fade">
      <div className="intro-header">
        <h1>Laboratorio 1: Los Sentidos y el Pensamiento Sistémico</h1>
        <p className="subtitle">
          El cerebro como eje central y los cinco sentidos como subsistemas interconectados de captación de información.
        </p>
      </div>

      {/* Navegación por pestañas */}
      <div className="tab-navigation">
        {TAB_ORDER.map((tabKey) => (
          <button
            key={tabKey}
            className={activeTab === tabKey ? 'active' : ''}
            onClick={() => goTab(tabKey)}
          >
            {TAB_LABELS[tabKey]}
          </button>
        ))}
      </div>

      {/* Contenido de pestañas */}
      <div className="tab-content glass-panel">
        {/* PESTAÑA 1: ¿QUÉ ES UN SISTEMA? Y ANALOGÍAS */}
        {activeTab === 'ejemplos' && (
          <div className="video-section animate-fade">
            {/* Concepto inicial interactivo */}
            <div
              className="concepto-sistema-section mb-5 glass-panel"
              style={{
                position: 'relative',
                overflow: 'hidden',
                padding: '2.5rem',
                borderRadius: '16px',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 0,
                  opacity: 0.35,
                  pointerEvents: 'none',
                }}
              >
                <Aurora colorStops={['#7c3aed', '#a855f7', '#3b82f6']} blend={0.6} amplitude={1.2} speed={0.8} />
              </div>

              <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <BlurText
                  text="¿Qué es un Sistema?"
                  className="text-neon-purple mb-4"
                  style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#c084fc', marginBottom: '1rem' }}
                  delay={50}
                />

                <div className="concepto-interactivo mx-auto" style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <p style={{ fontSize: '1.2rem', lineHeight: '1.7', marginBottom: '1.5rem', color: '#e2e8f0' }}>
                    Imagina un ojo, una lengua o un oído aislados en una mesa. Por sí solos, <strong>no pueden ver, saborear ni escuchar</strong>.
                    La visión y la audición no ocurren en el órgano receptor: ocurren cuando las señales viajan a la corteza cerebral y son interpretadas.
                  </p>
                  <p style={{ fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '2rem' }}>
                    Un <strong>sistema</strong> es un conjunto de elementos que interactúan entre sí para lograr un <strong>propósito común</strong>.
                    En nuestro cuerpo, el cerebro y los 5 sentidos forman un macrosistema de alerta y supervivencia.
                  </p>

                  <div className="anim-interconnection" style={{ margin: '0 auto', transform: 'scale(1.15)', transformOrigin: 'center' }}>
                    <div className="node node-1" style={{ background: '#a855f7' }}>Cerebro</div>
                    <div className="node node-2" style={{ background: '#3b82f6' }}>Vista 👁️</div>
                    <div className="node node-3" style={{ background: '#22c55e' }}>Oído 👂</div>
                    <div className="connection line-1"></div>
                    <div className="connection line-2"></div>
                    <div className="connection line-3"></div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="separator mb-5" />

            <h3>🪐 Tres Analogías Sistémicas del Mundo Real</h3>
            <p className="section-desc">
              Analiza estos tres modelos interactivos para descubrir cómo la interconexión define la supervivencia de cualquier sistema:
            </p>

            <div className="sim-stack-intro">
              {/* 1. Sistema Solar */}
              <div className="sim-item full-width">
                <h4>1. El Sistema Solar (Equilibrio Gravitacional)</h4>
                <div className="sim-visual solar-visual">
                  <div className="stars"></div>
                  <div className="shooting-star"></div>
                  <div className="solar-system-full">
                    <div className="sun-glow"></div>
                    <div className="orbit orbit-mercury"><div className="planet planet-mercury"></div></div>
                    <div className="orbit orbit-venus"><div className="planet planet-venus"></div></div>
                    <div className="orbit orbit-earth">
                      <div className="planet planet-earth">
                        <div className="orbit-moon"><div className="moon"></div></div>
                      </div>
                    </div>
                    <div className="orbit orbit-mars"><div className="planet planet-mars"></div></div>
                    <div className="orbit orbit-jupiter"><div className="planet planet-jupiter"></div></div>
                    <div className="orbit orbit-saturn">
                      <div className="planet planet-saturn">
                        <div className="saturn-rings"></div>
                      </div>
                    </div>
                    <div className="orbit orbit-uranus"><div className="planet planet-uranus"></div></div>
                    <div className="orbit orbit-neptune"><div className="planet planet-neptune"></div></div>
                  </div>
                </div>
                <p className="sim-caption">
                  El Sol ejerce la fuerza central que organiza las órbitas, igual que el <strong>cerebro</strong> organiza
                  y sincroniza los flujos de información sensorial. Si un planeta cambiara súbitamente de masa, todo el sistema orbital se alteraría.
                </p>
              </div>

              {/* 2. Sistema Eléctrico */}
              <div className="sim-item full-width">
                <h4>2. Red de Cableado y Flujo de Señales</h4>
                <div className="sim-visual electric-visual">
                  <picture>
                    <source media="(min-width: 769px)" srcSet="/assets/images/isometric_house.png" />
                    <img src="/assets/images/isometric_house_mobile.png" className="isometric-bg" alt="Red Eléctrica" />
                  </picture>
                  <div className="isometric-overlay house-circuit-overlay">
                    <svg className="circuit-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path className="wire-main" d="M 85 88 L 85 70 L 50 70 L 50 48 L 22 48 L 22 30" />
                      <path className="wire-branch" d="M 50 70 L 25 70" />
                      <path className="wire-branch" d="M 50 70 L 72 70" />
                      <path className="wire-branch" d="M 22 30 L 40 30" />
                      <path className="wire-branch" d="M 22 48 L 68 48 L 68 30" />
                      <circle className="energy-dot ed-1" r="1.2">
                        <animateMotion dur="3s" repeatCount="indefinite" path="M 85 88 L 85 70 L 50 70 L 50 48 L 22 48 L 22 30" />
                      </circle>
                      <circle className="energy-dot ed-2" r="1">
                        <animateMotion dur="2.5s" repeatCount="indefinite" begin="0.5s" path="M 50 70 L 25 70" />
                      </circle>
                      <circle className="energy-dot ed-3" r="1">
                        <animateMotion dur="2.5s" repeatCount="indefinite" begin="1s" path="M 50 70 L 72 70" />
                      </circle>
                      <circle className="energy-dot ed-4" r="1">
                        <animateMotion dur="2s" repeatCount="indefinite" begin="1.5s" path="M 22 30 L 40 30" />
                      </circle>
                    </svg>
                    <div className="circuit-source">🧠</div>
                  </div>
                </div>
                <p className="sim-caption">
                  En los sentidos, los cables son los <strong>nervios aferentes</strong> (óptico, auditivo, trigémino, etc.)
                  que transportan impulsos bioeléctricos (potenciales de acción) desde los receptores periféricos hasta el núcleo central.
                </p>
              </div>

              {/* 3. Sistema de Transporte Urbano */}
              <div className="sim-item full-width">
                <h4>3. Flujos Urbanos y Cuellos de Botella</h4>
                <div className="sim-visual city-visual">
                  <picture>
                    <source media="(min-width: 769px)" srcSet="/assets/images/isometric_city.png" />
                    <img src="/assets/images/isometric_city_mobile.png" className="isometric-bg" alt="Transporte Urbano" />
                  </picture>
                  <div className="city-map isometric-overlay">
                    <div className="car-iso car-iso-1"></div>
                    <div className="car-iso car-iso-2"></div>
                    <div className="car-iso car-iso-3"></div>
                    <div className="car-iso car-iso-4"></div>
                  </div>
                </div>
                <p className="sim-caption">
                  Cuando hay sobrecarga sensorial (ruido ensordecedor, luces cegadoras o dolor intenso), se genera un
                  <strong> cuello de botella cognitivo</strong>: el cerebro debe priorizar estímulos vitales y filtrar información secundaria.
                </p>
              </div>
            </div>

            <ContinueButton label="Los 5 Sentidos y Reto Sistémico" onClick={continueNext} />
          </div>
        )}

        {/* PESTAÑA 2: LOS 5 SENTIDOS Y PUZZLE SISTÉMICO */}
        {activeTab === 'sentidos' && (
          <div className="sentidos-section animate-fade">
            <h3>👁️ Los Cinco Centinelas del Organismo</h3>
            <p className="section-desc">
              Cada sentido es un <strong>transductor biológico</strong>: convierte una forma particular de energía del entorno
              (luz, presión, calor o moléculas químicas) en impulsos eléctricos comprensibles para el encéfalo.
              Selecciona cada sentido para explorar su ficha sistémica:
            </p>

            {/* Selector de sentidos */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', margin: '1.5rem 0' }}>
              {SENSES_INFO.map((s) => (
                <button
                  key={s.id}
                  className={`sim-btn ${activeSenseCard === s.id ? 'active' : ''}`}
                  onClick={() => setActiveSenseCard(s.id)}
                  style={{
                    borderColor: activeSenseCard === s.id ? s.color : 'rgba(255,255,255,0.1)',
                    background: activeSenseCard === s.id ? `${s.color}22` : 'rgba(30,41,59,0.7)',
                    color: activeSenseCard === s.id ? s.color : 'var(--text-secondary)',
                    padding: '0.8rem 1.2rem',
                  }}
                >
                  <span style={{ fontSize: '1.3rem', marginRight: '0.4rem' }}>{s.icon}</span>
                  <span style={{ fontWeight: 600 }}>{s.name}</span>
                </button>
              ))}
            </div>

            {/* Ficha técnica del sentido seleccionado */}
            {(() => {
              const s = SENSES_INFO.find((x) => x.id === activeSenseCard) || SENSES_INFO[0];
              return (
                <div
                  className="glass-card"
                  style={{
                    borderLeft: `6px solid ${s.color}`,
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '2rem' }}>{s.icon}</span>
                    <h3 style={{ margin: 0, color: s.color, fontSize: '1.5rem' }}>{s.name}</h3>
                  </div>
                  <div><strong>Órgano receptor:</strong> {s.organ}</div>
                  <div><strong>Estímulo físico/químico:</strong> {s.stimulus}</div>
                  <div><strong>Receptores biológicos:</strong> {s.receptor}</div>
                  <div><strong>Centro de procesamiento cerebral:</strong> {s.cortex}</div>
                  <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                    "{s.role}"
                  </div>
                </div>
              );
            })()}

            <hr className="separator mb-5" />

            {/* Reto interactivo SensoryPuzzle */}
            <SensoryPuzzle />

            <ContinueButton label="Pensamiento Sistémico" onClick={continueNext} />
          </div>
        )}

        {/* PESTAÑA 3: PENSAMIENTO SISTÉMICO (VIDEO + FIGURAS + 7 LINEAMIENTOS) */}
        {activeTab === 'pensamiento' && (
          <div className="pensamiento-section animate-fade">
            <h3 className="mb-3">🎬 Video: Pensamiento Sistémico</h3>
            <p className="section-desc">
              ¿Qué significa mirar el cuerpo humano como un <strong>sistema</strong>? Este video te introduce a la forma de pensar
              que conecta órganos, nervios y estímulos en un mapa continuo de relaciones:
            </p>

            <div className="video-panel">
              <video controls preload="metadata" poster="/assets/images/mariposa-portada.jpg">
                <source src="/assets/videos/pensamiento-sistemico.mp4" type="video/mp4" />
                Tu navegador no soporta la reproducción de video.
              </video>
            </div>

            <div className="figuras-grid">
              <figure className="figura-card glass-panel">
                <img src="/assets/images/figura-conglomerado.jpg" alt="Piezas desordenadas" />
                <figcaption>
                  Figura A — <strong>Conglomerado:</strong> piezas sensoriales aisladas sin comunicación no producen percepción consciente.
                </figcaption>
              </figure>
              <figure className="figura-card glass-panel">
                <img src="/assets/images/figura-sistema.jpg" alt="Sistema acoplado" />
                <figcaption>
                  Figura B — <strong>Sistema:</strong> las vías aferentes sincronizadas con el cerebro revelan el mundo exterior.
                </figcaption>
              </figure>
            </div>

            <hr className="separator" />

            <h3 className="mb-3">🎯 Los 7 Lineamientos del Pensamiento Sistémico</h3>
            <p className="section-desc">
              Formulados por el Dr. Eliécer Pineda Ballesteros (UDES), estos siete lineamientos guiarán tus investigaciones
              a lo largo de todos los laboratorios de los sentidos:
            </p>

            <LineamientosRoadmap />

            <hr className="separator" />

            <h3 className="mb-3">💭 Tu Curiosidad Inicial</h3>
            <p className="section-desc">
              ¿Cuál de los 7 lineamientos o qué misterio sobre cómo tus sentidos engañan o alertan a tu cerebro te genera más curiosidad?
            </p>

            <div className="input-group">
              <textarea
                value={curiosidad}
                onChange={(e) => setCuriosidad(e.target.value)}
                disabled={isCuriosidadSaved}
                placeholder="Escribe aquí tu curiosidad inicial..."
                className="glass-textarea"
                rows="4"
              ></textarea>
            </div>

            <div className="action-footer">
              <button
                className="btn-save"
                onClick={() => saveEvidencia('Curiosidad Sensorial: Introducción', curiosidad, setIsCuriosidadSaved)}
                disabled={isCuriosidadSaved || !curiosidad.trim() || loading}
              >
                {isCuriosidadSaved ? '✓ Curiosidad Guardada' : loading ? 'Guardando...' : 'Guardar Evidencia'}
              </button>
            </div>
            {message && activeTab === 'pensamiento' && <p className="status-msg">{message}</p>}

            <ContinueButton label="Síntesis Final" onClick={continueNext} />
          </div>
        )}

        {/* PESTAÑA 4: SÍNTESIS FINAL (ANIMACIONES + VIDEO YELLOWSTONE + DIBUJO + CONCLUSIÓN) */}
        {activeTab === 'sintesis' && (
          <div className="sintesis-section animate-fade">
            <h3 className="mb-3">🧩 Conceptos Clave del Enfoque Sistémico</h3>
            <p className="section-desc">
              Interactúa con estas tres dimensiones sistémicas aplicadas a la percepción y la neurofisiología:
            </p>

            <SystemicAnimations />

            <hr className="separator" />

            <h3 className="mb-3">📽️ Apreciación Sistémica: Cadenas de Efectos en Yellowstone</h3>
            <p className="section-desc">
              En 1995 los lobos fueron reintroducidos al Parque Yellowstone, desencadenando una cascada ecológica que incluso cambió la forma de los ríos.
              En el cuerpo humano, la pérdida o sobreestímulo de un solo sentido reorganiza toda la corteza cerebral (neuroplasticidad compensatoria):
            </p>

            <div className="video-wrapper">
              <iframe
                src="https://www.youtube.com/embed/5QvtYwyHpfc"
                title="Cómo los lobos cambiaron el curso de los ríos"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <p className="section-desc" style={{ marginTop: '1.5rem' }}>
              Observa el video y describe al menos <strong>tres conexiones sistémicas</strong> entre componentes que demuestren cómo una sola causa produce efectos en cadena:
            </p>

            <div className="input-group">
              <textarea
                value={apreciacion}
                onChange={(e) => setApreciacion(e.target.value)}
                disabled={isApreciacionSaved}
                placeholder="Escribe aquí tus 3 conexiones sistémicas observadas..."
                className="glass-textarea"
                rows="4"
              ></textarea>
            </div>

            <div className="action-footer">
              <button
                className="btn-save"
                onClick={() => saveEvidencia('Apreciación: Interconexiones Sensoriales', apreciacion, setIsApreciacionSaved)}
                disabled={isApreciacionSaved || !apreciacion.trim() || loading}
              >
                {isApreciacionSaved ? '✓ Apreciación Guardada' : loading ? 'Guardando...' : 'Guardar Apreciación'}
              </button>
            </div>

            <hr className="separator" />

            <h3 className="mb-3">🎨 Dibuja tu Modelo Mental Inicial</h3>
            <p className="section-desc">
              Antes de iniciar las simulaciones avanzadas, queremos conocer tu concepción actual.
              Dibuja en la pizarra cómo imaginas que el cerebro se conecta en paralelo con los 5 sentidos:
            </p>

            <DrawingCanvas />

            <hr className="separator" />

            <h3 className="mb-3">📝 Síntesis Final</h3>
            <p className="section-desc">
              A modo de cierre de este laboratorio introductorio, explica con tus propias palabras
              por qué el cerebro y los cinco sentidos forman un <strong>sistema vivo</strong> y no un simple grupo de órganos aislados:
            </p>

            <div className="input-group">
              <textarea
                value={conclusion}
                onChange={(e) => setConclusion(e.target.value)}
                disabled={isConclusionSaved}
                placeholder="Redacta aquí tu síntesis final sobre el sistema sensorial..."
                className="glass-textarea"
                rows="6"
              ></textarea>
            </div>

            <div className="action-footer">
              <button
                className="btn-save"
                onClick={() => saveEvidencia('Síntesis Final: Introducción a los Sentidos', conclusion, setIsConclusionSaved)}
                disabled={isConclusionSaved || !conclusion.trim() || loading}
              >
                {isConclusionSaved ? '✓ Conclusión Guardada' : loading ? 'Guardando...' : 'Guardar Evidencia'}
              </button>
            </div>
            {message && activeTab === 'sintesis' && <p className="status-msg">{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

// Botón de navegación guiada entre pestañas
function ContinueButton({ label, onClick }) {
  if (!label) return null;
  return (
    <div className="action-footer continue-footer" style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
      <button className="continue-btn" onClick={onClick}>
        Continuar: {label} <span className="continue-arrow">→</span>
      </button>
    </div>
  );
}

// 7 Lineamientos del Pensamiento Sistémico aplicados a Los Sentidos
const LINEAMIENTOS_DATA = [
  {
    num: 1,
    icono: '🧩',
    nombre: 'Componentes',
    descripcion: 'Reconocer receptores biológicos, vías nerviosas aferentes y centros corticales cerebrales.',
    labs: 'Vista · Oído · Tacto',
  },
  {
    num: 2,
    icono: '🔗',
    nombre: 'Causalidad',
    descripcion: 'Rastrear la secuencia estímulo físico → transducción bioeléctrica → interpretación consciente.',
    labs: 'Olfato y Gusto · Vista',
  },
  {
    num: 3,
    icono: '🖼️',
    nombre: 'Representación',
    descripcion: 'Construir mapas corticales, homúnculos de Penfield y modelos tridimensionales interactivos.',
    labs: 'Tacto · Vista · Oído',
  },
  {
    num: 4,
    icono: '📏',
    nombre: 'Escalas y Cantidades',
    descripcion: 'Medir umbrales y magnitudes perceptivas: decibeles (dB), frecuencias (Hz), longitudes de onda (nm).',
    labs: 'Oído · Vista',
  },
  {
    num: 5,
    icono: '⚖️',
    nombre: 'Conservación',
    descripcion: 'La energía del entorno se transforma en potenciales de acción sin perder la fidelidad del mensaje.',
    labs: 'Integración Sensorial',
  },
  {
    num: 6,
    icono: '🎯',
    nombre: 'Estructura y Propósito',
    descripcion: 'El sistema sensorial existe con el fin adaptativo de anticipar riesgos, alimentarse y sobrevivir.',
    labs: 'Integración Sensorial',
  },
  {
    num: 7,
    icono: '🔄',
    nombre: 'Estabilidad (Homeostasis)',
    descripcion: 'Mecanismos de adaptación sensorial, habituación y plasticidad neuronal compensatoria.',
    labs: 'Integración Sensorial',
  },
];

function LineamientosRoadmap() {
  const [active, setActive] = useState(null);

  return (
    <div className="lineamientos-container">
      <div className="lineamientos-grid">
        {LINEAMIENTOS_DATA.map((l) => (
          <div
            key={l.num}
            className={`lineamiento-card ${active === l.num ? 'active' : ''}`}
            onClick={() => setActive(active === l.num ? null : l.num)}
          >
            <div className="lineamiento-head">
              <span className="lineamiento-num">{l.num}</span>
              <span className="lineamiento-icon">{l.icono}</span>
              <span className="lineamiento-name">{l.nombre}</span>
            </div>
            {active === l.num && (
              <div className="lineamiento-body">
                <p>{l.descripcion}</p>
                <span className="lineamiento-lab">📚 Se aplica en: {l.labs}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="roadmap-map glass-panel">
        <div className="roadmap-chain">
          {LINEAMIENTOS_DATA.map((l, i) => (
            <React.Fragment key={l.num}>
              <span className="roadmap-node">{l.num}</span>
              {i < LINEAMIENTOS_DATA.length - 1 && <span className="roadmap-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>
        <p className="roadmap-caption">
          🗺️ Tu recorrido: primero identificarás <strong>componentes</strong> y <strong>causalidad</strong> en la
          vista y el oído; luego <strong>representarás</strong> y <strong>medirás</strong> en el olfato, gusto y tacto;
          y cerrarás evaluando la <strong>conservación</strong>, el <strong>propósito</strong> y la <strong>homeostasis</strong> en la
          integración sensorial completa.
        </p>
      </div>
    </div>
  );
}

// Subcomponente de Animaciones Interactivas del Enfoque Sistémico
function SystemicAnimations() {
  const [activeConcept, setActiveConcept] = useState(0);

  const concepts = [
    {
      title: 'Totalidad e Interconexión',
      desc: 'Un sistema es más que la suma de sus partes. Si aíslas un receptor del cerebro, pierde su función perceptiva.',
      icon: '🧩',
    },
    {
      title: 'Causalidad y Retroalimentación',
      desc: 'Las señales viajan en cadena: estímulo → receptor → tálamo → corteza, y el cerebro retroalimenta la atención.',
      icon: '🔄',
    },
    {
      title: 'Propósito y Homeostasis Sensorial',
      desc: 'El sistema ajusta su sensibilidad continuamente (adaptación a la luz, habituación a olores) para mantener el balance.',
      icon: '🎯',
    },
  ];

  return (
    <div className="systemic-animations glass-panel" style={{ position: 'relative', overflow: 'hidden', borderRadius: '15px' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          opacity: 0.4,
          pointerEvents: 'none',
        }}
      >
        <Aurora colorStops={['#1e293b', '#7c3aed', '#0f172a']} blend={0.5} amplitude={1.2} speed={0.8} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="concept-tabs">
          {concepts.map((c, i) => (
            <button
              key={i}
              className={`concept-btn ${activeConcept === i ? 'active' : ''}`}
              onClick={() => setActiveConcept(i)}
            >
              <span className="concept-icon">{c.icon}</span>
              <span className="concept-title">{c.title}</span>
            </button>
          ))}
        </div>

        <div className="concept-content">
          <div style={{ marginBottom: '1rem', minHeight: '32px' }}>
            <BlurText
              key={activeConcept}
              text={concepts[activeConcept].title}
              className="text-neon-purple"
              style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#c084fc' }}
              delay={40}
            />
          </div>
          <p className="concept-desc">{concepts[activeConcept].desc}</p>

          <div className="concept-visual">
            {activeConcept === 0 && (
              <div className="anim-interconnection">
                <div className="node node-1" style={{ background: '#a855f7' }}>Cerebro</div>
                <div className="node node-2" style={{ background: '#3b82f6' }}>Ojo 👁️</div>
                <div className="node node-3" style={{ background: '#f97316' }}>Piel 🖐️</div>
                <div className="connection line-1"></div>
                <div className="connection line-2"></div>
                <div className="connection line-3"></div>
              </div>
            )}
            {activeConcept === 1 && (
              <div className="anim-causality">
                <div className="gear gear-1">⚙️</div>
                <div className="gear gear-2">⚙️</div>
                <div className="gear gear-3">⚙️</div>
              </div>
            )}
            {activeConcept === 2 && (
              <div className="anim-homeostasis">
                <div className="scale">
                  <div className="scale-base"></div>
                  <div className="scale-arm">
                    <div className="weight weight-l" style={{ background: '#3b82f6' }}>Estímulo</div>
                    <div className="weight weight-r" style={{ background: '#a855f7' }}>Adaptación</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
