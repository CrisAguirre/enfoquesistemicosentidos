import { lazy, Suspense, useState, useMemo } from 'react';
import EvidenciaTextarea from '../../components/shared/EvidenciaTextarea';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import DiagramaConexionesVisuales from '../../components/shared/DiagramaConexionesVisuales';
import Carousel from '../../components/shared/Carousel';
import SketchfabViewer from '../../components/shared/SketchfabViewer';
import '../pages.css';
import './simulations.css';

const ModelViewer = lazy(() => import('../../components/three/ModelViewer'));

function wavelengthToRGB(wavelength) {
  let r = 0, g = 0, b = 0;
  if (wavelength >= 380 && wavelength < 440) {
    r = -(wavelength - 440) / (440 - 380);
    b = 1.0;
  } else if (wavelength >= 440 && wavelength < 490) {
    g = (wavelength - 440) / (490 - 440);
    b = 1.0;
  } else if (wavelength >= 490 && wavelength < 510) {
    g = 1.0;
    b = -(wavelength - 510) / (510 - 490);
  } else if (wavelength >= 510 && wavelength < 580) {
    r = (wavelength - 510) / (580 - 510);
    g = 1.0;
  } else if (wavelength >= 580 && wavelength < 645) {
    r = 1.0;
    g = -(wavelength - 645) / (645 - 580);
  } else if (wavelength >= 645 && wavelength <= 700) {
    r = 1.0;
  }
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

const EYE_TRANSLATED_PARTS = [
  { es: 'Córnea', en: 'Cornea', desc: 'Lente externa transparente y convexa que refracta los rayos luminosos.', role: 'Enfoque primario (~70% del poder refractivo del ojo).', lineamiento: 'L1 Componentes', color: '#38bdf8' },
  { es: 'Iris y Pupila', en: 'Iris & Pupil', desc: 'Diafragma muscular con pigmento que modula la apertura pupilar.', role: 'Homeostasis lumínica (L7): miosis ante exceso de luz, midriasis en penumbra.', lineamiento: 'L7 Estabilidad', color: '#60a5fa' },
  { es: 'Cristalino', en: 'Crystalline Lens', desc: 'Lente biconvexo elástico suspendido por los ligamentos suspensorios.', role: 'Acomodación visual fina: cambia de curvatura para enfocar objetos cercanos o distantes.', lineamiento: 'L1 Componentes', color: '#818cf8' },
  { es: 'Esclerótica', en: 'Sclera', desc: 'Capa blanca fibrosa protectora que recubre todo el exterior ocular.', role: 'Mantiene la forma y protege las estructuras internas.', lineamiento: 'L1 Componentes', color: '#cbd5e1' },
  { es: 'Coroides', en: 'Choroid', desc: 'Capa vascular oscura con melanina entre la esclerótica y la retina.', role: 'Nutre la retina y absorbe la luz parásita interna.', lineamiento: 'L5 Conservación', color: '#a855f7' },
  { es: 'Retina', en: 'Retina', desc: 'Tejido nervioso fotosensible con millones de conos y bastones.', role: 'Transductor biológico: convierte fotones en señales bioeléctricas (L2).', lineamiento: 'L2 Causalidad', color: '#f43f5e' },
  { es: 'Fóvea y Mácula', en: 'Fovea & Macula', desc: 'Punto central de la retina con densidad máxima de conos.', role: 'Zona de agudeza visual máxima, lectura y visión de colores.', lineamiento: 'L4 Escalas', color: '#fbbf24' },
  { es: 'Nervio Óptico', en: 'Optic Nerve', desc: 'Haz de más de un millón de axones de las células ganglionares.', role: 'Cable de comunicación aferente hacia la corteza visual occipital.', lineamiento: 'L2 Causalidad', color: '#34d399' },
  { es: 'Humor Vítreo', en: 'Vitreous Humor', desc: 'Sustancia gelatinosa y transparente que ocupa la cámara posterior.', role: 'Mantiene la retina adherida y la presión interna.', lineamiento: 'L7 Estabilidad', color: '#06b6d4' },
  { es: 'Músculos Ciliares', en: 'Ciliary Muscles', desc: 'Anillo muscular liso que modifica la tensión del cristalino.', role: 'Biomecánica de la acomodación y secreción de humor acuoso.', lineamiento: 'L1 Componentes', color: '#ec4899' },
];

export default function Vista() {
  const [intensidad, setIntensidad] = useState(50); // 0 - 100 lux (%)
  const [distancia, setDistancia] = useState(100); // 10 - 300 cm
  const [longitudOnda, setLongitudOnda] = useState(530); // 380 - 700 nm
  const [activeViewerTab, setActiveViewerTab] = useState('sketchfab-corte'); // 'simulador', 'sketchfab-corte', 'sketchfab-partes', 'glb-local'

  const diametroPupila = (8 - (intensidad / 100) * 6).toFixed(1);
  const curvaturaCristalino = ((300 - distancia) / 290 * 10 + 10).toFixed(1);
  const colorLuz = wavelengthToRGB(longitudOnda);

  const pupilChartData = useMemo(() => {
    const data = [];
    for (let lux = 0; lux <= 100; lux += 10) {
      data.push({
        lux,
        diametro: parseFloat((8 - (lux / 100) * 6).toFixed(1)),
      });
    }
    return data;
  }, []);

  const spectralData = useMemo(() => {
    const data = [];
    for (let nm = 380; nm <= 700; nm += 20) {
      const conoS = Math.max(0, Math.exp(-Math.pow((nm - 420) / 30, 2)) * 100);
      const bastones = Math.max(0, Math.exp(-Math.pow((nm - 500) / 35, 2)) * 95);
      const conoM = Math.max(0, Math.exp(-Math.pow((nm - 530) / 40, 2)) * 100);
      const conoL = Math.max(0, Math.exp(-Math.pow((nm - 560) / 45, 2)) * 100);
      data.push({
        nm,
        Conos_Azul: Math.round(conoS),
        Bastones_Nocturnos: Math.round(bastones),
        Conos_Verde: Math.round(conoM),
        Conos_Rojo: Math.round(conoL),
      });
    }
    return data;
  }, []);

  const Actividad = (
    <div>
      <h2 style={{ color: '#3b82f6', marginBottom: '1.5rem' }}>Actividad Práctica: La Óptica y Transducción en el Ojo</h2>

      <h3 style={{ color: '#3b82f6', borderBottom: '1px solid #3b82f6', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2rem' }}>
        Lineamiento 1: Componentes del Subsistema Visual
      </h3>
      <Carousel color="#3b82f6" title="Lineamiento 1: Componentes y Estructura">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>👁️ Reto 1/4 (L1) — La Puerta de Entrada</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Explora el modelo 3D del corte de ojo y observa el simulador al variar la <strong>Intensidad Lumínica</strong>. ¿Qué estructuras anatómicas trabajan en conjunto para evitar que un exceso de luz dañe los fotorreceptores retinianos? Describe su acción biomecánica.
          </p>
          <EvidenciaTextarea titulo="Vista - Reto 1 (L1): Entrada de luz y diafragma pupilar" placeholder="Describe los componentes del iris y la pupila..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>👁️ Reto 2/4 (L1) — El Mecanismo de Acomodación</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Mueve el slider de <strong>Distancia del Objeto</strong> de 300 cm a 15 cm. ¿Qué componente cambia su curvatura para enfocar rayos divergentes sobre la fóvea? ¿Qué sucedería si este lente perdiera su elasticidad (presbicia)?
          </p>
          <EvidenciaTextarea titulo="Vista - Reto 2 (L1): Cristalino y acomodación" placeholder="Explica el rol del cristalino y los músculos ciliares..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>👁️ Reto 3/4 (L1) — Fotorreceptores Retinianos</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Revisa la gráfica de <em>Sensibilidad Espectral</em>. ¿Qué diferencia funcional existe entre los <strong>conos</strong> y los <strong>bastones</strong>? ¿Por qué en la oscuridad plena perdemos la percepción de los colores?
          </p>
          <EvidenciaTextarea titulo="Vista - Reto 3 (L1): Conos vs Bastones" placeholder="Diferencia entre visión fotópica y escotópica..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#3b82f6' }}>👁️ Reto 4/4 (L1) — El Cable hacia el Cerebro</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            En el modelo 3D de anatomía ocular, localiza el nervio óptico. ¿Hacia qué lóbulo cerebral específico entrega las señales decodificadas de cada campo visual?
          </p>
          <EvidenciaTextarea titulo="Vista - Reto 4 (L1): Nervio óptico y destino occipital" placeholder="Ruta del nervio óptico hacia la corteza visual..." />
        </div>
      </Carousel>

      <h3 style={{ color: '#60a5fa', borderBottom: '1px solid #60a5fa', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '3rem' }}>
        Lineamiento 2: Causalidad y Cadena de Transducción
      </h3>
      <Carousel color="#60a5fa" title="Lineamiento 2: Causa y Efecto Visual">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#60a5fa' }}>⚡ Reto 1/4 (L2) — Cadena Causal Completa</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Construye la secuencia causal de acontecimientos desde que un rayo de luz rebota en una manzana hasta que eres consciente de que es roja. Identifica causa inicial, intermediarios y efecto perceptivo final.
          </p>
          <EvidenciaTextarea titulo="Vista - Reto 1 (L2): Secuencia causal del estímulo visual" placeholder="1. Luz incide... 2. Córnea refracta..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#60a5fa' }}>⚡ Reto 2/4 (L2) — Retroalimentación Pupilar</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Observa cómo al aumentar la intensidad de la luz, el diámetro pupilar disminuye. ¿Por qué este circuito es un ejemplo clásico de <strong>retroalimentación negativa</strong> en fisiología? ¿Qué causaría la falta de este control?
          </p>
          <EvidenciaTextarea titulo="Vista - Reto 2 (L2): Bucle de retroalimentación en la pupila" placeholder="Explica el arco reflejo pupilar y su efecto estabilizador..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#60a5fa' }}>⚡ Reto 3/4 (L2) — Daltonismo y Causa Genética</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Al modificar la <em>Longitud de Onda</em> en el simulador, observa qué conos se activan. Si un individuo carece genéticamente del fotopigmento de los conos L (protanopía), ¿cuál es la consecuencia directa en la diferenciación rojo-verde?
          </p>
          <EvidenciaTextarea titulo="Vista - Reto 3 (L2): Causa y efecto en el daltonismo" placeholder="Analiza el fallo en la absorción espectral..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#60a5fa' }}>⚡ Reto 4/4 (L2) — La Ilusión Óptica como Causa Cerebral</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            ¿Vemos con los ojos o con el cerebro? Justifica tu respuesta considerando qué sucede cuando la retina envía información pero el cerebro la interpreta erróneamente (ilusiones ópticas).
          </p>
          <EvidenciaTextarea titulo="Vista - Reto 4 (L2): El ojo capta, el cerebro construye" placeholder="Reflexión sobre el procesamiento cortical..." />
        </div>
      </Carousel>
    </div>
  );

  return (
    <SimulationWrapper
      simNumber={1}
      title="La Vista: Ventana al Mundo"
      description="El ojo como transductor óptico y la vía visual hacia la corteza cerebral."
      icon="👁️"
      info="Laboratorio de La Vista (L1 y L2): explora los modelos 3D interactivos con sus partes traducidas al español, manipula la intensidad de luz, la distancia del objeto y la longitud de onda. Observa la adaptación pupilar homeostática y el espectro fotorreceptor."
      actividad={Actividad}
      evaluacionPath="/laboratorio/vista/evaluacion"
    >
      {/* ── SELECTOR DE VISOR 3D / SIMULADOR ── */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          className={`sim-btn ${activeViewerTab === 'sketchfab-corte' ? 'active' : ''}`}
          onClick={() => setActiveViewerTab('sketchfab-corte')}
          style={{ borderColor: activeViewerTab === 'sketchfab-corte' ? '#38bdf8' : 'rgba(255,255,255,0.1)' }}
        >
          <span>👁️ 1. Ojo Corte Transversal 3D</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Gaia Tech)</span>
        </button>

        <button
          className={`sim-btn ${activeViewerTab === 'sketchfab-partes' ? 'active' : ''}`}
          onClick={() => setActiveViewerTab('sketchfab-partes')}
          style={{ borderColor: activeViewerTab === 'sketchfab-partes' ? '#60a5fa' : 'rgba(255,255,255,0.1)' }}
        >
          <span>📖 2. Anatomía Ocular con Partes Traducidas</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(MotionCow)</span>
        </button>

        <button
          className={`sim-btn ${activeViewerTab === 'simulador' ? 'active' : ''}`}
          onClick={() => setActiveViewerTab('simulador')}
          style={{ borderColor: activeViewerTab === 'simulador' ? '#818cf8' : 'rgba(255,255,255,0.1)' }}
        >
          <span>🔬 3. Simulador Óptico Reactivo</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Pupila & Fotones)</span>
        </button>

        <button
          className={`sim-btn ${activeViewerTab === 'glb-local' ? 'active' : ''}`}
          onClick={() => setActiveViewerTab('glb-local')}
          style={{ borderColor: activeViewerTab === 'glb-local' ? '#34d399' : 'rgba(255,255,255,0.1)' }}
        >
          <span>🧊 4. Modelo GLB Local</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(/models/ojo.glb)</span>
        </button>
      </div>

      {/* VISTA 1: CORTE TRANSVERSAL SKETCHFAB (Gaia Tech) */}
      {activeViewerTab === 'sketchfab-corte' && (
        <SketchfabViewer
          modelId="384fc8984c0a43249fa44e9c4b85e579"
          title="Eye (Corte Transversal 3D)"
          author="Gaia Tech"
          authorUrl="https://sketchfab.com/gaiatech"
          modelUrl="https://sketchfab.com/3d-models/eye-384fc8984c0a43249fa44e9c4b85e579"
          accentColor="#38bdf8"
          translatedParts={EYE_TRANSLATED_PARTS}
          partsTitle="Estructuras Visibles en el Corte Transversal"
          height={490}
        />
      )}

      {/* VISTA 2: PARTES TRADUCIDAS SKETCHFAB (MotionCow) */}
      {activeViewerTab === 'sketchfab-partes' && (
        <SketchfabViewer
          modelId="5dac474887174eb78cb7ffce6bd9ce3a"
          title="Eye Anatomy (Anatomía del Ojo con Estructuras)"
          author="MotionCow"
          authorUrl="https://sketchfab.com/MotionCow"
          modelUrl="https://sketchfab.com/3d-models/eye-anatomy-5dac474887174eb78cb7ffce6bd9ce3a"
          accentColor="#60a5fa"
          translatedParts={EYE_TRANSLATED_PARTS}
          partsTitle="Glosario Anatómico Traducido al Español"
          height={490}
        />
      )}

      {/* VISTA 4: GLB LOCAL */}
      {activeViewerTab === 'glb-local' && (
        <div className="sim-canvas">
          <Suspense fallback={<div className="model-loading"><p>Cargando modelo /models/ojo.glb…</p></div>}>
            <ModelViewer src="/models/ojo.glb" height={490} autoRotate={true} />
          </Suspense>
          <div style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Renderizado Three.js nativo desde <code>/public/models/ojo.glb</code>
          </div>
        </div>
      )}

      {/* VISTA 3: SIMULADOR REACTIVO */}
      <div style={{ marginTop: activeViewerTab === 'simulador' ? '0' : '2.5rem' }}>
        <h2 style={{ color: '#38bdf8', fontSize: '1.6rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🔬</span> Laboratorio Óptico y Dinámica Pupilar
        </h2>

        {/* Sliders de control */}
        <div className="sim-sliders">
          <div className="sim-slider-field">
            <label htmlFor="lux-slider">
              <span>☀️ Intensidad Lumínica</span>
              <span>{intensidad}%</span>
            </label>
            <input
              id="lux-slider"
              type="range"
              min="0"
              max="100"
              value={intensidad}
              onChange={(e) => setIntensidad(Number(e.target.value))}
            />
          </div>

          <div className="sim-slider-field">
            <label htmlFor="dist-slider">
              <span>📏 Distancia del Objeto</span>
              <span>{distancia} cm</span>
            </label>
            <input
              id="dist-slider"
              type="range"
              min="10"
              max="300"
              value={distancia}
              onChange={(e) => setDistancia(Number(e.target.value))}
            />
          </div>

          <div className="sim-slider-field">
            <label htmlFor="nm-slider">
              <span>🌈 Longitud de Onda</span>
              <span>{longitudOnda} nm</span>
            </label>
            <input
              id="nm-slider"
              type="range"
              min="380"
              max="700"
              value={longitudOnda}
              onChange={(e) => setLongitudOnda(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Métricas en tiempo real */}
        <div className="sim-metrics">
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#38bdf8' }}>{diametroPupila} mm</div>
            <div className="stat-label">Diámetro Pupilar</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#818cf8' }}>{curvaturaCristalino} D</div>
            <div className="stat-label">Poder Refractivo Ciliar</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: colorLuz, textShadow: `0 0 12px ${colorLuz}` }}>
              {longitudOnda} nm
            </div>
            <div className="stat-label">Color Espectral Percibido</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#34d399' }}>
              {intensidad < 20 ? 'Bastones (Escotópica)' : 'Conos (Fotópica)'}
            </div>
            <div className="stat-label">Régimen Fotorreceptor</div>
          </div>
        </div>

        {/* Representación visual interactiva de la pupila y el rayo */}
        <div
          className="glass-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '2rem',
            margin: '1.5rem 0',
            background: 'radial-gradient(circle, rgba(15,23,42,0.9) 0%, rgba(2,6,23,0.95) 100%)',
            border: `1px solid ${colorLuz}55`,
          }}
        >
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Apertura pupilar dinámica en respuesta al flujo de {intensidad}% lux ({colorLuz}):
          </div>
          <svg width="220" height="220" viewBox="0 0 200 200" style={{ filter: 'drop-shadow(0 0 20px rgba(56,189,248,0.3))' }}>
            <circle cx="100" cy="100" r="90" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
            <circle cx="100" cy="100" r="60" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1="100"
                y1="100"
                x2={100 + 55 * Math.cos((deg * Math.PI) / 180)}
                y2={100 + 55 * Math.sin((deg * Math.PI) / 180)}
                stroke="#38bdf8"
                strokeWidth="1.5"
                opacity="0.6"
              />
            ))}
            <circle
              cx="100"
              cy="100"
              r={parseFloat(diametroPupila) * 4.5}
              fill="#090d16"
              stroke={colorLuz}
              strokeWidth="2"
              style={{ transition: 'r 0.3s ease' }}
            />
            <circle cx="85" cy="85" r="7" fill="#ffffff" opacity="0.8" />
          </svg>
          <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {intensidad > 70 ? 'Miosis (Contracción protectora)' : intensidad < 30 ? 'Midriasis (Dilatación nocturna)' : 'Estado Normorreactivo'}
          </div>
        </div>

        {/* Diagrama Esquemático Interactivo de Conexiones Visuales (Pantalla Completa & Alta Legibilidad) */}
        <DiagramaConexionesVisuales />

        {/* Gráficas comparativas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: '#38bdf8', marginBottom: '1rem' }}>L4 Escala: Intensidad Lumínica vs Diámetro Pupilar</h4>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={pupilChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="lux" stroke="#94a3b8" label={{ value: 'Lux (%)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" domain={[1, 9]} label={{ value: 'Diámetro (mm)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #38bdf8' }} />
                <Line type="monotone" dataKey="diametro" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} name="Diámetro (mm)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: '#f43f5e', marginBottom: '1rem' }}>L3 Representación: Sensibilidad Espectral de Fotorreceptores</h4>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={spectralData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="nm" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #f43f5e' }} />
                <Legend />
                <Area type="monotone" dataKey="Conos_Azul" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Area type="monotone" dataKey="Conos_Verde" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                <Area type="monotone" dataKey="Conos_Rojo" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </SimulationWrapper>
  );
}
