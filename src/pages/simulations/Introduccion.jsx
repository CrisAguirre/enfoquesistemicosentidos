import React, { useState, useEffect } from 'react';
import { evidenciaApi } from '../../api/evidencia';
import DrawingCanvas from '../../components/shared/DrawingCanvas';
import SensoryPuzzle from '../../components/shared/SensoryPuzzle';
import { Aurora, BlurText, FadeContent } from '../../reactbits';
import './introduccion.css';
import './introduccion_animations.css';

const TAB_ORDER = ['sentidos', 'puzzle', 'pensamiento', 'sintesis'];
const TAB_LABELS = {
  sentidos: 'Los 5 Sentidos 👁️',
  puzzle: 'Reto Sistémico 🧠',
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
  const [activeTab, setActiveTab] = useState('sentidos');
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
        const prevApr = find('Apreciación Sistémica: Introducción');
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
    <div className="introduccion-page-custom">
      <div className="aurora-container-intro">
        <Aurora colorStops={['#a855f7', '#3b82f6', '#ec4899']} blend={0.5} amplitude={1.0} speed={0.4} />
      </div>

      <div className="intro-container">
        <header className="intro-header-clean">
          <BlurText text="Laboratorio 1: Los Sentidos y el Pensamiento Sistémico" delay={150} animateBy="words" direction="top" className="intro-title-blur" />
          <p className="intro-subtitle-clean">
            El cerebro como eje central y los cinco sentidos como subsistemas interconectados de captación de información.
          </p>
        </header>

        {/* Tab Navigation */}
        <nav className="tab-navigation">
          {TAB_ORDER.map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => goTab(tabKey)}
              className={`tab-btn-clean ${activeTab === tabKey ? 'active' : ''}`}
            >
              {TAB_LABELS[tabKey]}
            </button>
          ))}
        </nav>

        {/* TAB 1: LOS 5 SENTIDOS */}
        {activeTab === 'sentidos' && (
          <FadeContent blur duration={500} easing="ease-out" initialOpacity={0}>
            <div className="intro-panel-glass">
              <h2 className="panel-title-clean">1. Los Cinco Centinelas del Cuerpo Humano</h2>
              <p className="panel-desc-clean">
                En biología tradicional solemos estudiar cada órgano por separado. Desde el <strong>enfoque sistémico</strong>, ningún sentido opera aislado:
                cada uno es un <em>transductor biológico</em> que convierte diferentes tipos de energía física o química en el mismo lenguaje universal que entiende el cerebro:
                <strong> potenciales de acción eléctricos</strong>.
              </p>

              {/* Botones selectores de sentidos */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', margin: '1.5rem 0' }}>
                {SENSES_INFO.map((s) => (
                  <button
                    key={s.id}
                    className="sim-btn"
                    onClick={() => setActiveSenseCard(s.id)}
                    style={{
                      borderColor: activeSenseCard === s.id ? s.color : 'rgba(255,255,255,0.1)',
                      background: activeSenseCard === s.id ? `${s.color}22` : 'rgba(30,41,59,0.7)',
                      color: activeSenseCard === s.id ? s.color : 'var(--text-secondary)',
                      padding: '0.8rem 1.2rem',
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                  </button>
                ))}
              </div>

              {/* Ficha técnica del sentido seleccionado */}
              {(() => {
                const s = SENSES_INFO.find((x) => x.id === activeSenseCard);
                return (
                  <div
                    className="glass-card"
                    style={{
                      borderLeft: `6px solid ${s.color}`,
                      padding: '1.5rem',
                      marginTop: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
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

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
                <button className="sim-btn active" style={{ padding: '0.9rem 2.2rem', fontSize: '1.1rem' }} onClick={continueNext}>
                  Continuar al Reto Sistémico →
                </button>
              </div>
            </div>
          </FadeContent>
        )}

        {/* TAB 2: PUZZLE SISTÉMICO */}
        {activeTab === 'puzzle' && (
          <FadeContent blur duration={500} easing="ease-out" initialOpacity={0}>
            <div className="intro-panel-glass">
              <h2 className="panel-title-clean">2. El Circuito de Comunicación Sensorial</h2>
              <p className="panel-desc-clean">
                En un <strong>sistema biológico</strong>, una parte sin conexión pierde su propósito.
                Si un receptor capta luz pero el nervio o la corteza visual se dañan, no existe la visión consciente.
                Resuelve el siguiente acoplamiento para verificar que comprendes las vías aferentes:
              </p>

              <SensoryPuzzle />

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
                <button className="sim-btn active" style={{ padding: '0.9rem 2.2rem', fontSize: '1.1rem' }} onClick={continueNext}>
                  Continuar a Pensamiento Sistémico →
                </button>
              </div>
            </div>
          </FadeContent>
        )}

        {/* TAB 3: PENSAMIENTO SISTÉMICO */}
        {activeTab === 'pensamiento' && (
          <FadeContent blur duration={500} easing="ease-out" initialOpacity={0}>
            <div className="intro-panel-glass">
              <h2 className="panel-title-clean">3. Los Siete Lineamientos del Pensamiento Sistémico</h2>
              <p className="panel-desc-clean">
                Propuestos por el Dr. Eliécer Pineda Ballesteros (UDES), estos siete lentes conceptuales te permitirán
                analizar cada sentido no como una ficha de memoria, sino como una red viva y dinámica:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', margin: '1.5rem 0' }}>
                {[
                  { num: 1, title: 'Componentes', icon: '🧩', desc: 'Identificar las partes anatómicas y células especializadas de cada órgano y del cerebro.' },
                  { num: 2, title: 'Causalidad', icon: '⚡', desc: 'Rastrear la cadena: estímulo → transducción → potencial de acción → interpretación.' },
                  { num: 3, title: 'Representación', icon: '📊', desc: 'Construir modelos gráficos, homúnculos, espectros y mapas corticales.' },
                  { num: 4, title: 'Escalas', icon: '📏', desc: 'Analizar umbrales numéricos: decibeles (dB), nanómetros (nm), hercios (Hz), densidad receptora.' },
                  { num: 5, title: 'Conservación', icon: '🔄', desc: 'Comprender cómo la información sensorial se conserva y transforma sin perder su código.' },
                  { num: 6, title: 'Propósito', icon: '🎯', desc: 'La meta global: supervivencia, adaptación, anticipación del peligro y toma de decisiones.' },
                  { num: 7, title: 'Estabilidad (Homeostasis)', icon: '⚖️', desc: 'Adaptación sensorial, habituación, compensación neuroplástica y balance interno.' },
                ].map((l) => (
                  <div key={l.num} className="glass-card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>{l.icon}</span>
                      <h4 style={{ margin: 0, color: 'var(--color-primary-400)' }}>L{l.num}: {l.title}</h4>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{l.desc}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
                <button className="sim-btn active" style={{ padding: '0.9rem 2.2rem', fontSize: '1.1rem' }} onClick={continueNext}>
                  Ir a Síntesis Final y Dibujo 📝 →
                </button>
              </div>
            </div>
          </FadeContent>
        )}

        {/* TAB 4: SÍNTESIS FINAL */}
        {activeTab === 'sintesis' && (
          <FadeContent blur duration={500} easing="ease-out" initialOpacity={0}>
            <div className="intro-panel-glass">
              <h2 className="panel-title-clean">4. Síntesis y Registro de Saberes Previos</h2>
              <p className="panel-desc-clean">
                Dibuja en el lienzo tu propio modelo mental: ¿cómo imaginas que el cerebro se conecta simultáneamente
                con los cinco sentidos? Luego registra tus conclusiones para la bitácora del curso.
              </p>

              {/* Pizarra interactiva para dibujar el modelo mental */}
              <DrawingCanvas />

              {/* Registro de evidencias escritas */}
              <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="evidencia-box">
                  <h4>💡 1. Curiosidad Inicial</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    ¿Qué pregunta o misterio sobre cómo tus sentidos engañan o ayudan a tu cerebro te gustaría resolver en este laboratorio?
                  </p>
                  <textarea
                    className="glass-textarea"
                    rows="3"
                    value={curiosidad}
                    onChange={(e) => setCuriosidad(e.target.value)}
                    disabled={isCuriosidadSaved}
                    placeholder="Escribe aquí tu curiosidad..."
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  />
                  <button
                    className="btn-save"
                    style={{ marginTop: '0.5rem' }}
                    onClick={() => saveEvidencia('Curiosidad Sensorial: Introducción', curiosidad, setIsCuriosidadSaved)}
                    disabled={isCuriosidadSaved || !curiosidad.trim() || loading}
                  >
                    {isCuriosidadSaved ? '✓ Curiosidad Guardada' : 'Guardar Curiosidad'}
                  </button>
                </div>

                <div className="evidencia-box">
                  <h4>📝 2. Síntesis Final: ¿Por qué los sentidos son un sistema?</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Explica con tus propias palabras por qué el cerebro y los 5 sentidos forman un sistema y no un simple grupo de órganos sueltos.
                  </p>
                  <textarea
                    className="glass-textarea"
                    rows="4"
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    disabled={isConclusionSaved}
                    placeholder="Escribe tu explicación sistémica..."
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  />
                  <button
                    className="btn-save"
                    style={{ marginTop: '0.5rem' }}
                    onClick={() => saveEvidencia('Síntesis Final: Introducción a los Sentidos', conclusion, setIsConclusionSaved)}
                    disabled={isConclusionSaved || !conclusion.trim() || loading}
                  >
                    {isConclusionSaved ? '✓ Síntesis Guardada' : 'Guardar Síntesis'}
                  </button>
                </div>
              </div>

              {message && <p className="status-msg" style={{ marginTop: '1rem', textAlign: 'center' }}>{message}</p>}
            </div>
          </FadeContent>
        )}
      </div>
    </div>
  );
}

