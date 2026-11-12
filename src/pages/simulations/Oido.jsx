import { lazy, Suspense, useState, useMemo, useRef, useEffect } from 'react';
import EvidenciaTextarea from '../../components/shared/EvidenciaTextarea';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import OrganDiagram from '../../components/shared/OrganDiagram';
import Carousel from '../../components/shared/Carousel';
import SketchfabViewer from '../../components/shared/SketchfabViewer';
import '../pages.css';
import './simulations.css';

const EAR_TRANSLATED_PARTS = [
  { es: 'Pabellón Auricular (Oreja)', en: 'Pinna / Auricle', desc: 'Cartílago elástico que captura y canaliza las ondas sonoras aéreas.', role: 'Embudo acústico y localización espacial binaural (L1).', lineamiento: 'L1 Componentes', color: '#22c55e' },
  { es: 'Conducto Auditivo Externo', en: 'External Auditory Canal', desc: 'Conducto tubular de ~2.5 cm con glándulas ceruminosas de protección.', role: 'Cámara de resonancia que amplifica frecuencias de la voz (2 a 4 kHz).', lineamiento: 'L4 Escalas', color: '#34d399' },
  { es: 'Membrana Timpánica (Tímpano)', en: 'Tympanic Membrane', desc: 'Lámina circular semitransparente tensa que vibra con la presión del aire.', role: 'Transducción aero-mecánica: pasa de onda acústica aérea a movimiento sólido.', lineamiento: 'L2 Causalidad', color: '#38bdf8' },
  { es: 'Martillo, Yunque y Estribo', en: 'Auditory Ossicles (Malleus, Incus, Stapes)', desc: 'Los tres huesos más diminutos del cuerpo humano articulados en cadena.', role: 'Amplifican la presión acústica unas 20 veces hacia la ventana oval por principio de palanca.', lineamiento: 'L1 Componentes', color: '#f59e0b' },
  { es: 'Ventana Oval', en: 'Oval Window', desc: 'Membrana elástica donde la base del estribo empuja el líquido interno.', role: 'Transfiere la fuerza mecánica al líquido perilinfático de la cóclea.', lineamiento: 'L2 Causalidad', color: '#fbbf24' },
  { es: 'Cóclea (Caracol)', en: 'Cochlea', desc: 'Órgano en espiral de 2.5 vueltas relleno de endolinfa y perilinfa.', role: 'Alberga el Órgano de Corti donde ocurre la transducción bioeléctrica final.', lineamiento: 'L1 Componentes', color: '#a855f7' },
  { es: 'Células Ciliadas del Órgano de Corti', en: 'Cochlear Hair Cells', desc: 'Mecanorreceptores microscópicos con penachos de estereocilios.', role: 'La deflexión de los cilios abre canales de potasio (K+) generando potenciales de acción.', lineamiento: 'L2 Causalidad', color: '#ec4899' },
  { es: 'Canales Semicirculares', en: 'Semicircular Canals', desc: 'Tres anillos orientados en los tres planos del espacio con crestas ampollares.', role: 'Subsistema vestibular: detecta rotación y aceleración angular (equilibrio).', lineamiento: 'L6 Propósito', color: '#06b6d4' },
  { es: 'Nervio Auditivo (Vestibulococlear)', en: 'Cranial Nerve VIII', desc: 'Haz de fibras sensoriales que conserva la tonotopía coclear.', role: 'Conduce los impulsos hacia los núcleos cocleares y la corteza temporal.', lineamiento: 'L5 Conservación', color: '#60a5fa' },
  { es: 'Trompa de Eustaquio', en: 'Eustachian Tube', desc: 'Canal osteocartilaginoso que comunica el oído medio con la faringe.', role: 'Iguala la presión del oído medio con la presión atmosférica exterior.', lineamiento: 'L7 Estabilidad', color: '#cbd5e1' },
];

export default function Oido() {
  const [frecuencia, setFrecuencia] = useState(440); // 20 - 15.000 Hz
  const [intensidad, setIntensidad] = useState(65); // 0 - 140 dB
  const [distancia, setDistancia] = useState(2); // 0.5 - 50 m
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [activeViewerTab, setActiveViewerTab] = useState('sketchfab-anatomia'); // 'sketchfab-anatomia', 'sketchfab-corte', 'simulador'

  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const gainRef = useRef(null);

  const intensidadPercibida = useMemo(() => {
    const atenuacion = 20 * Math.log10(Math.max(1, distancia));
    return Math.max(0, Math.round(intensidad - atenuacion));
  }, [intensidad, distancia]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const toggleSound = () => {
    if (audioPlaying) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      setAudioPlaying(false);
    } else {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frecuencia, ctx.currentTime);

      const safeVolume = Math.min(0.2, (intensidadPercibida / 140) * 0.15);
      gain.gain.setValueAtTime(safeVolume, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscRef.current = osc;
      gainRef.current = gain;
      setAudioPlaying(true);
    }
  };

  useEffect(() => {
    if (audioPlaying && oscRef.current && gainRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      oscRef.current.frequency.setTargetAtTime(frecuencia, ctx.currentTime, 0.05);
      const safeVolume = Math.min(0.2, (intensidadPercibida / 140) * 0.15);
      gainRef.current.gain.setTargetAtTime(safeVolume, ctx.currentTime, 0.05);
    }
  }, [frecuencia, intensidadPercibida, audioPlaying]);

  const isofonicData = useMemo(() => {
    return [
      { hz: '20 Hz', umbralMin: 70, dolor: 130 },
      { hz: '63 Hz', umbralMin: 35, dolor: 130 },
      { hz: '125 Hz', umbralMin: 22, dolor: 130 },
      { hz: '250 Hz', umbralMin: 12, dolor: 130 },
      { hz: '500 Hz', umbralMin: 6, dolor: 130 },
      { hz: '1k Hz', umbralMin: 4, dolor: 130 },
      { hz: '2k Hz', umbralMin: 1, dolor: 130 },
      { hz: '4k Hz', umbralMin: -2, dolor: 130 },
      { hz: '8k Hz', umbralMin: 12, dolor: 130 },
      { hz: '16k Hz', umbralMin: 40, dolor: 130 },
    ];
  }, []);

  const distanceChartData = useMemo(() => {
    const pts = [];
    for (let d = 1; d <= 40; d += 3) {
      const db = Math.max(0, Math.round(intensidad - 20 * Math.log10(d)));
      pts.push({ distancia: d, db });
    }
    return pts;
  }, [intensidad]);

  const OIDO_LABELS = [
    { id: 'pabellon', name: 'Pabellón Auricular', description: 'Oreja externa que captura y canaliza las ondas de presión hacia el conducto.', role: 'Embudo acústico y localización espacial (L1).', top: '48%', left: '16%', color: '#22c55e' },
    { id: 'timpano', name: 'Membrana Timpánica', description: 'Membrana elástica que vibra al recibir las ondas sonoras aéreas.', role: 'Paso de energía aérea a movimiento mecánico.', top: '50%', left: '38%', color: '#34d399' },
    { id: 'huesecillos', name: 'Cadena de Huesecillos', description: 'Martillo, yunque y estribo articulados.', role: 'Amplifican la presión acústica unas 20 veces hacia la ventana oval.', top: '45%', left: '50%', color: '#f59e0b' },
    { id: 'coclea', name: 'Cóclea (Caracol)', description: 'Estructura en espiral rellena de endolinfa que alberga el Órgano de Corti.', role: 'Transductor real: células ciliadas transforman onda líquida en electricidad.', top: '56%', left: '68%', color: '#38bdf8' },
    { id: 'nervio-auditivo', name: 'Nervio Auditivo', description: 'Nervio vestibulococlear (VIII par craneal).', role: 'Conduce los potenciales de acción tonotópicos a la corteza temporal.', top: '42%', left: '84%', color: '#a855f7' },
  ];

  const Actividad = (
    <div>
      <h2 style={{ color: '#22c55e', marginBottom: '1.5rem' }}>Actividad Práctica: De la Onda Sonora al Significado Cerebral</h2>

      <h3 style={{ color: '#22c55e', borderBottom: '1px solid #22c55e', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2rem' }}>
        Lineamiento 1: Componentes del Subsistema Auditivo
      </h3>
      <Carousel color="#22c55e" title="Lineamiento 1: Componentes del Oído">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#22c55e' }}>👂 Reto 1/4 (L1) — Las Tres Cámaras Acústicas</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Explora el modelo 3D del oído. El oído humano se divide en externo, medio e interno. ¿Qué componente principal reside en cada sección y por qué medio físico viaja el sonido en cada una (aire, hueso, líquido)?
          </p>
          <EvidenciaTextarea titulo="Oído - Reto 1 (L1): Oído externo, medio e interno" placeholder="Describe los medios de propagación..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#22c55e' }}>👂 Reto 2/4 (L1) — Los Tres Huesecillos</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Localiza en el corte 3D el martillo, el yunque y el estribo. ¿Por qué la naturaleza diseñó una cadena articulada de huesecillos en lugar de conectar directamente el tímpano con la cóclea? Explica la amplificación de presión.
          </p>
          <EvidenciaTextarea titulo="Oído - Reto 2 (L1): Función de los huesecillos" placeholder="Explica la amplificación de presión..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#22c55e' }}>👂 Reto 3/4 (L1) — El Órgano de Corti y Células Ciliadas</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Las células ciliadas de la cóclea son los transductores biológicos primarios. ¿Cómo actúan como compuertas biomecánicas cuando las ondas del líquido coclear inclinan sus estereocilios?
          </p>
          <EvidenciaTextarea titulo="Oído - Reto 3 (L1): Células ciliadas transductoras" placeholder="Explica la apertura de canales iónicos..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#22c55e' }}>👂 Reto 4/4 (L1) — El Mapa Tonotópico</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Al variar la frecuencia en el generador de tono, ¿en qué zona de la cóclea resuenan los agudos y en cuál los graves? ¿Cómo mantiene la corteza temporal del cerebro este ordenamiento musical?
          </p>
          <EvidenciaTextarea titulo="Oído - Reto 4 (L1): Tonotopía coclear y cerebral" placeholder="Agudos en la base, graves en el ápice..." />
        </div>
      </Carousel>

      <h3 style={{ color: '#34d399', borderBottom: '1px solid #34d399', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '3rem' }}>
        Lineamiento 2: Causalidad del Daño Acústico y Percepción
      </h3>
      <Carousel color="#34d399" title="Lineamiento 2: Causalidad y Protección Auditiva">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#34d399' }}>⚡ Reto 1/4 (L2) — Cadena Causal del Sonido</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Describe detalladamente la cadena de causas y efectos que ocurre desde que un objeto cae y perturba el aire hasta que el cerebro comprende el estruendo.
          </p>
          <EvidenciaTextarea titulo="Oído - Reto 1 (L2): Cadena de la audición" placeholder="1. Objeto perturba aire... 2. Tímpano vibra..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#34d399' }}>⚡ Reto 2/4 (L2) — Decibeles y Traumatismo Acústico</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Sube el slider de Intensidad por encima de 100 dB. Observa el indicador de advertencia. ¿Qué causa física provoca que escuchar música con auriculares a volumen excesivo destruya irreversiblemente las células ciliadas?
          </p>
          <EvidenciaTextarea titulo="Oído - Reto 2 (L2): Traumatismo acústico por volumen excesivo" placeholder="Causa del daño por cizallamiento en cilios..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#34d399' }}>⚡ Reto 3/4 (L2) — Atenuación con la Distancia</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Observa la gráfica de intensidad sonora vs distancia. Si duplicamos la distancia a una fuente ruidosa, ¿cuántos decibeles disminuye la presión acústica recibida? ¿Por qué alejarse es un mecanismo homeostático de protección?
          </p>
          <EvidenciaTextarea titulo="Oído - Reto 3 (L2): Ley del inverso del cuadrado y atenuación" placeholder="Explica la dispersión esférica de la onda..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#34d399' }}>⚡ Reto 4/4 (L2) — Oído Binaural y Causalidad Espacial</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            ¿Por qué tenemos dos oídos colocados a lados opuestos de la cabeza? Explica cómo el cerebro calcula la diferencia de tiempo (microsegundos) e intensidad entre ambos para ubicar exactamente de dónde proviene un sonido.
          </p>
          <EvidenciaTextarea titulo="Oído - Reto 4 (L2): Localización binaural en el cerebro" placeholder="Diferencias interaurales de tiempo e intensidad..." />
        </div>
      </Carousel>
    </div>
  );

  return (
    <SimulationWrapper
      simNumber={2}
      title="El Oído: Ondas que se Transforman"
      description="Transducción mecanoacústica, frecuencias audibles y protección auditiva."
      icon="👂"
      info="Laboratorio de El Oído (L1 y L2): explora los modelos 3D con sus estructuras traducidas al español, experimenta con frecuencias en hercios (Hz), decibeles (dB) y distancia, y activa el sintetizador de audio en tiempo real."
      actividad={Actividad}
      evaluacionPath="/laboratorio/oido/evaluacion"
    >
      {/* ── SELECTOR DE VISOR 3D ── */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          className={`sim-btn ${activeViewerTab === 'sketchfab-anatomia' ? 'active' : ''}`}
          onClick={() => setActiveViewerTab('sketchfab-anatomia')}
          style={{ borderColor: activeViewerTab === 'sketchfab-anatomia' ? '#22c55e' : 'rgba(255,255,255,0.1)' }}
        >
          <span>👂 1. Modelo 3D del Oído Humano</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Clacydarch)</span>
        </button>

        <button
          className={`sim-btn ${activeViewerTab === 'sketchfab-corte' ? 'active' : ''}`}
          onClick={() => setActiveViewerTab('sketchfab-corte')}
          style={{ borderColor: activeViewerTab === 'sketchfab-corte' ? '#34d399' : 'rgba(255,255,255,0.1)' }}
        >
          <span>📖 2. Corte Transversal con Partes Traducidas</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Ebers)</span>
        </button>

        <button
          className={`sim-btn ${activeViewerTab === 'simulador' ? 'active' : ''}`}
          onClick={() => setActiveViewerTab('simulador')}
          style={{ borderColor: activeViewerTab === 'simulador' ? '#f59e0b' : 'rgba(255,255,255,0.1)' }}
        >
          <span>🎵 3. Simulador Acústico + Tono</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Web Audio)</span>
        </button>
      </div>

      {/* VISTA 1: MODELO ANATOMÍA 3D (Clacydarch) */}
      {activeViewerTab === 'sketchfab-anatomia' && (
        <SketchfabViewer
          modelId="20d1308c07844d1aa8855fce3d7ac280"
          title="Human Ear Anatomy (Anatomía del Oído Humano)"
          author="Clacydarch"
          authorUrl="https://sketchfab.com/clacydarch"
          modelUrl="https://sketchfab.com/3d-models/human-ear-anatomy-20d1308c07844d1aa8855fce3d7ac280"
          accentColor="#22c55e"
          translatedParts={EAR_TRANSLATED_PARTS}
          partsTitle="Estructuras del Oído Humano"
          height={490}
        />
      )}

      {/* VISTA 2: CORTE TRANSVERSAL TRADUCIDO (Ebers) */}
      {activeViewerTab === 'sketchfab-corte' && (
        <SketchfabViewer
          modelId="4f5438fc9337454587ec4a2c30c8c42f"
          title="Ear cross-section (Corte Transversal del Oído)"
          author="Ebers"
          authorUrl="https://sketchfab.com/Ebers"
          modelUrl="https://sketchfab.com/3d-models/ear-cross-section-4f5438fc9337454587ec4a2c30c8c42f"
          accentColor="#34d399"
          translatedParts={EAR_TRANSLATED_PARTS}
          partsTitle="Estructuras y Cámaras Traducidas al Español"
          height={490}
        />
      )}

      {/* VISTA 3: SIMULADOR ACÚSTICO */}
      <div style={{ marginTop: activeViewerTab === 'simulador' ? '0' : '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <h2 style={{ color: '#22c55e', fontSize: '1.6rem', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
            <span>🔬</span> Generador de Tonos y Dinámica de Frecuencia
          </h2>
          <button
            className={`sim-btn ${audioPlaying ? 'active' : ''}`}
            onClick={toggleSound}
            style={{
              padding: '0.6rem 1.4rem',
              borderColor: audioPlaying ? '#22c55e' : 'rgba(255,255,255,0.2)',
              background: audioPlaying ? 'rgba(34,197,94,0.2)' : 'rgba(30,41,59,0.7)',
              color: audioPlaying ? '#4ade80' : 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{audioPlaying ? '🔊' : '🔈'}</span>
            <span style={{ fontWeight: 600 }}>{audioPlaying ? 'Detener Tono' : 'Escuchar Frecuencia'}</span>
          </button>
        </div>

        {/* Sliders de control acústico */}
        <div className="sim-sliders">
          <div className="sim-slider-field">
            <label htmlFor="hz-slider">
              <span>🎵 Frecuencia Acústica</span>
              <span>{frecuencia} Hz</span>
            </label>
            <input
              id="hz-slider"
              type="range"
              min="20"
              max="15000"
              step="10"
              value={frecuencia}
              onChange={(e) => setFrecuencia(Number(e.target.value))}
            />
          </div>

          <div className="sim-slider-field">
            <label htmlFor="db-slider">
              <span>📢 Intensidad en la Fuente</span>
              <span>{intensidad} dB</span>
            </label>
            <input
              id="db-slider"
              type="range"
              min="0"
              max="140"
              value={intensidad}
              onChange={(e) => setIntensidad(Number(e.target.value))}
            />
          </div>

          <div className="sim-slider-field">
            <label htmlFor="dist-slider">
              <span>🚶 Distancia a la Fuente</span>
              <span>{distancia} m</span>
            </label>
            <input
              id="dist-slider"
              type="range"
              min="0.5"
              max="50"
              step="0.5"
              value={distancia}
              onChange={(e) => setDistancia(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Métricas acústicas */}
        <div className="sim-metrics">
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#22c55e' }}>{frecuencia} Hz</div>
            <div className="stat-label">
              {frecuencia < 250 ? 'Grave / Bajo' : frecuencia < 3000 ? 'Medio (Voz humana)' : 'Agudo'}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: intensidadPercibida > 100 ? '#ef4444' : '#38bdf8' }}>
              {intensidadPercibida} dB
            </div>
            <div className="stat-label">Presión Recibida en Oído</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#a855f7' }}>
              {(343 / frecuencia).toFixed(2)} m
            </div>
            <div className="stat-label">Longitud de Onda Acústica (λ)</div>
          </div>
          <div className="stat-card">
            <div
              className="stat-value"
              style={{
                color: intensidadPercibida >= 120 ? '#ef4444' : intensidadPercibida >= 85 ? '#f59e0b' : '#22c55e',
              }}
            >
              {intensidadPercibida >= 120 ? '¡Umbral del Dolor!' : intensidadPercibida >= 85 ? 'Riesgo Auditivo' : 'Nivel Seguro'}
            </div>
            <div className="stat-label">Evaluación de Riesgo</div>
          </div>
        </div>

        {/* Onda senoidal */}
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            margin: '1.5rem 0',
            background: 'radial-gradient(circle, rgba(15,23,42,0.9) 0%, rgba(2,6,23,0.95) 100%)',
            border: `1px solid ${intensidadPercibida > 100 ? '#ef4444' : '#22c55e'}55`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <span>Forma de onda senoidal de presión aérea ({frecuencia} Hz a {intensidadPercibida} dB):</span>
            {intensidadPercibida >= 85 && (
              <span style={{ color: '#ef4444', fontWeight: 700 }}>⚠️ Alerta de volumen lesivo</span>
            )}
          </div>
          <svg width="100%" height="120" viewBox="0 0 800 120" style={{ overflow: 'visible' }}>
            <line x1="0" y1="60" x2="800" y2="60" stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />
            <path
              d={(() => {
                const points = [];
                const amp = Math.min(50, (intensidadPercibida / 140) * 50);
                const cycles = Math.max(1, Math.min(25, frecuencia / 100));
                for (let x = 0; x <= 800; x += 4) {
                  const y = 60 + amp * Math.sin((x / 800) * cycles * 2 * Math.PI);
                  points.push(`${x},${y}`);
                }
                return `M ${points.join(' L ')}`;
              })()}
              fill="none"
              stroke={intensidadPercibida >= 100 ? '#ef4444' : '#22c55e'}
              strokeWidth="2.5"
              style={{ filter: `drop-shadow(0 0 8px ${intensidadPercibida >= 100 ? '#ef4444' : '#22c55e'})` }}
            />
          </svg>
        </div>

        {/* Diagrama esquemático */}
        <div style={{ marginTop: '2.5rem' }}>
          <h3 style={{ color: '#22c55e', marginBottom: '1rem' }}>Diagrama Esquemático de las Tres Cámaras del Oído</h3>
          <OrganDiagram labels={OIDO_LABELS} />
        </div>

        {/* Gráficas acústicas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: '#22c55e', marginBottom: '1rem' }}>L4 Escala: Umbrales de Audición por Frecuencia</h4>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={isofonicData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="hz" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[-10, 140]} label={{ value: 'dB SPL', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #22c55e' }} />
                <Line type="monotone" dataKey="umbralMin" stroke="#22c55e" strokeWidth={2.5} name="Umbral Mínimo Audible (dB)" />
                <Line type="monotone" dataKey="dolor" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" name="Umbral del Dolor (dB)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: '#38bdf8', marginBottom: '1rem' }}>L3 Representación: Atenuación Sonora vs Distancia</h4>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={distanceChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="distancia" stroke="#94a3b8" label={{ value: 'Distancia (m)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" domain={[0, 140]} label={{ value: 'dB Percibidos', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #38bdf8' }} />
                <Area type="monotone" dataKey="db" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.25} name="Intensidad (dB)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </SimulationWrapper>
  );
}
