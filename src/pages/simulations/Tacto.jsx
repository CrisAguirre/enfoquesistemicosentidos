import { lazy, Suspense, useState, useMemo } from 'react';
import EvidenciaTextarea from '../../components/shared/EvidenciaTextarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import OrganDiagram from '../../components/shared/OrganDiagram';
import Carousel from '../../components/shared/Carousel';
import SketchfabViewer from '../../components/shared/SketchfabViewer';
import '../pages.css';
import './simulations.css';

const ModelViewer = lazy(() => import('../../components/three/ModelViewer'));

const BODY_ZONES = [
  { id: 'yemas', name: 'Yemas de los Dedos', density: 2500, threshold2pt: 2.5, cortexArea: 35, desc: 'Máxima discriminación táctil y manipulación fina.' },
  { id: 'labios', name: 'Labios y Lengua', density: 2000, threshold2pt: 3.2, cortexArea: 30, desc: 'Exploración bucal, habla y alta sensibilidad térmica.' },
  { id: 'palma', name: 'Palma de la Mano', density: 800, threshold2pt: 11.0, cortexArea: 18, desc: 'Agarre de herramientas y detección de texturas.' },
  { id: 'antebrazo', name: 'Antebrazo', density: 150, threshold2pt: 38.0, cortexArea: 6, desc: 'Receptores espaciados; detección de caricias y vello.' },
  { id: 'espalda', name: 'Espalda Central', density: 50, threshold2pt: 65.0, cortexArea: 3, desc: 'Campos receptivos amplios; baja agudeza táctil.' },
];

const SKIN_TRANSLATED_PARTS = [
  { es: 'Epidermis', en: 'Epidermis', desc: 'Estrato córneo superficial formado por queratinocitos impermeables.', role: 'Barrera física protectora que se renueva cada 28 días.', lineamiento: 'L1 Componentes', color: '#f97316' },
  { es: 'Dermis Papilar y Reticular', en: 'Dermis', desc: 'Capa media vascularizada rica en colágeno y elastina.', role: 'Soporte mecánico que alberga el plexo nervioso táctil.', lineamiento: 'L1 Componentes', color: '#fb923c' },
  { es: 'Hipodermis (Tejido Subcutáneo)', en: 'Hypodermis / Subcutaneous', desc: 'Capa profunda formada por adipocitos (células grasas).', role: 'Aislamiento térmico (L7) y almohadillado protector contra impactos.', lineamiento: 'L7 Estabilidad', color: '#facc15' },
  { es: 'Corpúsculo de Meissner', en: "Meissner's Corpuscle", desc: 'Mecanorreceptor elipsoidal encapsulado en papilas dérmicas.', role: 'Tacto ligero dinámico, detección de bordes y deslizamiento fino.', lineamiento: 'L1 Componentes', color: '#38bdf8' },
  { es: 'Corpúsculo de Pacini', en: "Pacinian Corpuscle", desc: 'Gran corpúsculo laminado en capas concéntricas en la dermis profunda.', role: 'Detección de vibraciones de alta frecuencia (>200 Hz) y presión brusca.', lineamiento: 'L4 Escalas', color: '#a855f7' },
  { es: 'Disco de Merkel', en: "Merkel's Disc", desc: 'Terminación celular semilunar pegada a la lámina basal epidérmica.', role: 'Presión estática sostenida y reconocimiento táctil de formas y ángulos.', lineamiento: 'L2 Causalidad', color: '#22c55e' },
  { es: 'Terminación de Ruffini', en: "Ruffini Ending", desc: 'Estructura fusiforme intercalada entre haces de colágeno dérmico.', role: 'Detecta estiramiento de la piel y transduce sensación de calor.', lineamiento: 'L2 Causalidad', color: '#ef4444' },
  { es: 'Terminaciones Nerviosas Libres', en: 'Free Nerve Endings', desc: 'Fibras amielínicas C y mielínicas A-delta ramificadas hasta la epidermis.', role: 'Nociceptores encargados de alertar daño tisular (dolor) y frío.', lineamiento: 'L6 Propósito', color: '#ec4899' },
  { es: 'Folículo Piloso y Tallo del Pelo', en: 'Hair Follicle & Hair Shaft', desc: 'Estructura tubular con terminaciones nerviosas peri-radiculares.', role: 'Amplificador mecánico: percibe el contacto mínimo con el vello corporal.', lineamiento: 'L1 Componentes', color: '#818cf8' },
  { es: 'Músculo Erector del Pelo', en: 'Arrector Pili Muscle', desc: 'Banda de músculo liso unida al folículo.', role: 'Reflejo de piloerección ("piel de gallina") para aislamiento y alerta emocional.', lineamiento: 'L7 Estabilidad', color: '#94a3b8' },
  { es: 'Glándula Sudorípara', en: 'Sweat Gland', desc: 'Tubo enrollado que secreta sudor acuoso hacia la superficie.', role: 'Mecanismo homeostático de termorregulación por enfriamiento evaporativo.', lineamiento: 'L7 Estabilidad', color: '#06b6d4' },
  { es: 'Glándula Sebácea', en: 'Sebaceous Gland', desc: 'Glándula anexa al folículo que produce sebo oleoso.', role: 'Lubricación lipídica, flexibilidad cutánea y defensa antimicrobiana.', lineamiento: 'L5 Conservación', color: '#fbbf24' },
];

export default function Tacto() {
  const [presion, setPresion] = useState(40);
  const [temperatura, setTemperatura] = useState(32);
  const [zonaId, setZonaId] = useState('yemas');
  const [activeViewerTab, setActiveViewerTab] = useState('sketchfab-piel'); // 'sketchfab-piel', 'glb-piel', 'simulador'

  const zonaActual = BODY_ZONES.find((z) => z.id === zonaId) || BODY_ZONES[0];

  const isMeissnerActive = presion > 5 && presion < 60;
  const isPaciniActive = presion >= 40;
  const isMerkelActive = presion >= 20;
  const isRuffiniActive = presion >= 35 || temperatura > 36;
  const isColdActive = temperatura < 30;
  const isHeatActive = temperatura > 35;
  const isPainActive = presion > 85 || temperatura <= 16 || temperatura >= 43;

  const zoneComparisonData = useMemo(() => {
    return BODY_ZONES.map((z) => ({
      zona: z.name.split(' ')[0],
      densidad: z.density,
      areaCorteza: z.cortexArea,
      umbral2pt: z.threshold2pt,
    }));
  }, []);

  const thermalData = useMemo(() => {
    const data = [];
    for (let t = 15; t <= 45; t += 2) {
      const frio = t <= 32 ? Math.max(0, Math.exp(-Math.pow((t - 25) / 5, 2)) * 100) : 0;
      const calor = t >= 28 ? Math.max(0, Math.exp(-Math.pow((t - 40) / 4, 2)) * 100) : 0;
      const dolor = t <= 17 || t >= 43 ? 90 : 0;
      data.push({
        temp: `${t}°C`,
        Receptores_Frio: Math.round(frio),
        Receptores_Calor: Math.round(calor),
        Alerta_Nociceptiva: dolor,
      });
    }
    return data;
  }, []);

  const PIEL_LABELS = [
    { id: 'epidermis', name: 'Epidermis', description: 'Capa superficial protectora que renueva sus queratinocitos.', role: 'Barrera física impermeable y albergue de terminaciones nerviosas libres.', top: '22%', left: '20%', color: '#f97316' },
    { id: 'meissner', name: 'Corpúsculos de Meissner', description: 'Ubicados en las papilas dérmicas apicales.', role: 'Tacto ligero dinámico, detección de bordes y deslizamiento.', top: '35%', left: '35%', color: '#38bdf8' },
    { id: 'merkel', name: 'Discos de Merkel', description: 'Receptores de adaptación lenta en la base epidérmica.', role: 'Presión táctil estática sostenida y detalle fino de texturas.', top: '42%', left: '55%', color: '#22c55e' },
    { id: 'pacini', name: 'Corpúsculos de Pacini', description: 'Estructuras laminadas en capas de cebolla en la dermis profunda.', role: 'Detección de vibraciones de alta frecuencia y cambios bruscos.', top: '70%', left: '45%', color: '#a855f7' },
    { id: 'ruffini', name: 'Corpúsculos de Ruffini', description: 'Fusiformes, orientados con las fibras de colágeno.', role: 'Estiramiento sostenido de la piel y sensación térmica de calor.', top: '65%', left: '75%', color: '#ef4444' },
    { id: 'nociceptores', name: 'Terminaciones Libres (Dolor)', description: 'Fibras amielínicas C y mielínicas A-delta.', role: 'Alerta biológica ante estímulos térmicos o mecánicos potencialmente destructivos.', top: '30%', left: '80%', color: '#fbbf24' },
  ];

  const Actividad = (
    <div>
      <h2 style={{ color: '#f97316', marginBottom: '1.5rem' }}>Actividad Práctica: La Piel y el Mapa Somatosensorial</h2>

      <h3 style={{ color: '#f97316', borderBottom: '1px solid #f97316', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2rem' }}>
        Lineamiento 3: Representación del Homúnculo de Penfield
      </h3>
      <Carousel color="#f97316" title="Lineamiento 3: Modelos y Homúnculo Sensorial">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#f97316' }}>🖐️ Reto 1/4 (L3) — ¿Por qué el Homúnculo es Deforme?</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Observa el modelo 3D de la piel y la gráfica de <em>Área Cortical Asignada</em>. En el homúnculo somatosensorial, las manos y la boca son gigantescas, mientras el tronco es minúsculo. ¿Qué principio biológico representa este modelo visual?
          </p>
          <EvidenciaTextarea titulo="Tacto - Reto 1 (L3): El Homúnculo de Penfield" placeholder="Explica la relación entre densidad receptora y representación cortical..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#f97316' }}>🖐️ Reto 2/4 (L3) — Estratificación de la Dermis</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            En el modelo 3D histológico, observa la profundidad de cada receptor. ¿Por qué Pacini está situado en lo más profundo de la dermis/hipodermis, mientras Meissner está pegado a la superficie papilar?
          </p>
          <EvidenciaTextarea titulo="Tacto - Reto 2 (L3): Profundidad y función receptora" placeholder="Explica por qué la profundidad se correlaciona con el tipo de fuerza mecánica..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#f97316' }}>🖐️ Reto 3/4 (L3) — Discriminación de Dos Puntos</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            En un experimento con compás de dos puntas, en la yema del dedo percibes dos puntos si están a 2.5 mm de distancia, pero en la espalda necesitas 65 mm. ¿Cómo dibujarías los "campos receptivos" de las neuronas en ambas zonas?
          </p>
          <EvidenciaTextarea titulo="Tacto - Reto 3 (L3): Campos receptivos pequeños vs amplios" placeholder="Compara los campos receptivos de yema vs espalda..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#f97316' }}>🖐️ Reto 4/4 (L3) — Miembro Fantasma</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Personas que sufren la amputación de una mano continúan "sintiendo picazón o dolor" en los dedos ausentes. A partir del mapa cortical, explica por qué la sensación no reside en la extremidad física sino en la corteza cerebral.
          </p>
          <EvidenciaTextarea titulo="Tacto - Reto 4 (L3): Síndrome del miembro fantasma" placeholder="Explica la persistencia del mapa cerebral somatotópico..." />
        </div>
      </Carousel>

      <h3 style={{ color: '#fb923c', borderBottom: '1px solid #fb923c', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '3rem' }}>
        Lineamiento 4: Escalas de Presión, Temperatura y Dolor
      </h3>
      <Carousel color="#fb923c" title="Lineamiento 4: Escalas Numéricas y Umbrales Físicos">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#fb923c' }}>📏 Reto 1/4 (L4) — Umbral Térmico Nociceptivo</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Varía la temperatura por encima de 43 °C o por debajo de 16 °C. Observa cómo se activa la alerta de dolor. ¿Por qué el sistema nervioso fija el umbral de dolor térmico exactamente en los 43–45 °C (temperatura a la cual las proteínas celulares comienzan a desnaturalizarse)?
          </p>
          <EvidenciaTextarea titulo="Tacto - Reto 1 (L4): Umbral térmico de desnaturalización" placeholder="Relaciona los 43°C con la integridad celular proteica..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#fb923c' }}>📏 Reto 2/4 (L4) — Escala de Densidad Numérica</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Compara la cifra numérica: 2.500 mecanorreceptores/cm² en la yema frente a 50 en la espalda (relación 50 a 1). ¿Qué implicaciones energéticas tendría para el cerebro si toda la piel del cuerpo tuviera la densidad de los dedos?
          </p>
          <EvidenciaTextarea titulo="Tacto - Reto 2 (L4): Costo energético de la alta densidad" placeholder="Analiza el sobrepeso y sobrecarga cortical que causaría..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#fb923c' }}>📏 Reto 3/4 (L4) — Adaptación Lenta vs Rápida</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Los corpúsculos de Pacini se adaptan en milisegundos (solo disparan cuando la presión cambia), mientras que Merkel sigue disparando mientras la presión se mantenga. ¿Por qué necesitamos ambas escalas de tiempo al sostener un objeto de vidrio?
          </p>
          <EvidenciaTextarea titulo="Tacto - Reto 3 (L4): Escala temporal de adaptación fásica y tónica" placeholder="Compara adaptación rápida (Pacini) vs lenta (Merkel)..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#fb923c' }}>📏 Reto 4/4 (L4) — Umbral Mecánico de Dolor</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Sube el slider de Presión por encima del 85%. ¿Por qué la activación de los nociceptores de alta presión anula las demás sensaciones táctiles y desencadena un arco reflejo medular instantáneo antes de que pensemos conscientemente?
          </p>
          <EvidenciaTextarea titulo="Tacto - Reto 4 (L4): Arco reflejo medular por dolor extremo" placeholder="Explica la prioridad protectora del dolor sobre el tacto fino..." />
        </div>
      </Carousel>
    </div>
  );

  return (
    <SimulationWrapper
      simNumber={4}
      title="El Tacto: La Piel como Sensor"
      description="Mecanorreceptores, termorreceptores, densidad corporal y el Homúnculo de Penfield."
      icon="🖐️"
      info="Laboratorio de El Tacto (L3 y L4): explora el modelo 3D de la piel con sus estructuras histológicas traducidas al español, manipula la presión y temperatura para observar qué receptores se activan, y analiza la discriminación espacial milimétrica."
      actividad={Actividad}
      evaluacionPath="/laboratorio/tacto/evaluacion"
    >
      {/* ── SELECTOR DE MODELOS 3D ── */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          className={`sim-btn ${activeViewerTab === 'sketchfab-piel' ? 'active' : ''}`}
          onClick={() => setActiveViewerTab('sketchfab-piel')}
          style={{ borderColor: activeViewerTab === 'sketchfab-piel' ? '#f97316' : 'rgba(255,255,255,0.1)' }}
        >
          <span>🔬 1. Bloque de Piel 3D Traducido</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(yessyekaa)</span>
        </button>

        <button
          className={`sim-btn ${activeViewerTab === 'glb-piel' ? 'active' : ''}`}
          onClick={() => setActiveViewerTab('glb-piel')}
          style={{ borderColor: activeViewerTab === 'glb-piel' ? '#fb923c' : 'rgba(255,255,255,0.1)' }}
        >
          <span>🧊 2. Modelo GLB Local Piel</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(/models/piel.glb)</span>
        </button>

        <button
          className={`sim-btn ${activeViewerTab === 'simulador' ? 'active' : ''}`}
          onClick={() => setActiveViewerTab('simulador')}
          style={{ borderColor: activeViewerTab === 'simulador' ? '#38bdf8' : 'rgba(255,255,255,0.1)' }}
        >
          <span>🖐️ 3. Simulador Mecano-Térmico</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Presión & Homúnculo)</span>
        </button>
      </div>

      {/* VISTA 1: PIEL SKETCHFAB (yessyekaa) */}
      {activeViewerTab === 'sketchfab-piel' && (
        <SketchfabViewer
          modelId="98476537da2e451d80d7f45dc212f9eb"
          title="Human Anatomy Skin (Modelo 3D de la Piel Humana)"
          author="yessyekaa"
          authorUrl="https://sketchfab.com/yessyekaa"
          modelUrl="https://sketchfab.com/3d-models/human-anatomy-skin-3d-model-elt-assignment-98476537da2e451d80d7f45dc212f9eb"
          accentColor="#f97316"
          translatedParts={SKIN_TRANSLATED_PARTS}
          partsTitle="Estructuras de la Piel y Receptores Traducidos al Español"
          height={490}
        />
      )}

      {/* VISTA 2: GLB LOCAL PIEL */}
      {activeViewerTab === 'glb-piel' && (
        <div className="sim-canvas">
          <Suspense fallback={<div className="model-loading"><p>Cargando modelo /models/piel.glb…</p></div>}>
            <ModelViewer src="/models/piel.glb" height={490} autoRotate={true} />
          </Suspense>
          <div style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Renderizado Three.js nativo desde <code>/public/models/piel.glb</code> (24.9 MB)
          </div>
        </div>
      )}

      {/* VISTA 3: SIMULADOR MECANO-TÉRMICO */}
      <div style={{ marginTop: activeViewerTab === 'simulador' ? '0' : '2.5rem' }}>
        <h2 style={{ color: '#f97316', fontSize: '1.6rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🔬</span> Simulador Mecano y Termosensorial de la Piel
        </h2>

        {/* Sliders y selectores */}
        <div className="sim-sliders">
          <div className="sim-slider-field">
            <label htmlFor="press-slider">
              <span>🏋️ Presión Mecánica</span>
              <span>{presion}%</span>
            </label>
            <input
              id="press-slider"
              type="range"
              min="0"
              max="100"
              value={presion}
              onChange={(e) => setPresion(Number(e.target.value))}
            />
          </div>

          <div className="sim-slider-field">
            <label htmlFor="temp-slider">
              <span>🌡️ Temperatura</span>
              <span>{temperatura} °C</span>
            </label>
            <input
              id="temp-slider"
              type="range"
              min="15"
              max="45"
              value={temperatura}
              onChange={(e) => setTemperatura(Number(e.target.value))}
            />
          </div>

          <div className="sim-slider-field">
            <label>
              <span>📍 Zona Corporal de Prueba</span>
            </label>
            <select
              className="puzzle-selector"
              value={zonaId}
              onChange={(e) => setZonaId(e.target.value)}
              style={{ marginTop: '0.4rem' }}
            >
              {BODY_ZONES.map((z) => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Métricas somatosensoriales */}
        <div className="sim-metrics">
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#f97316' }}>{zonaActual.density} /cm²</div>
            <div className="stat-label">Densidad de Mecanorreceptores</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#38bdf8' }}>{zonaActual.threshold2pt} mm</div>
            <div className="stat-label">Umbral Discriminación 2 Puntos</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#a855f7' }}>{zonaActual.cortexArea} %</div>
            <div className="stat-label">Superficie Cortical Asignada</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: isPainActive ? '#ef4444' : '#22c55e' }}>
              {isPainActive ? '⚠️ Dolor Tisular' : temperatura < 30 ? '❄️ Frío' : temperatura > 35 ? '🔥 Calor' : 'Confort Térmico'}
            </div>
            <div className="stat-label">Estado Fisiológico Percibido</div>
          </div>
        </div>

        {/* Panel de activación de receptores en tiempo real */}
        <div
          className="glass-card"
          style={{
            padding: '1.5rem',
            margin: '1.5rem 0',
            border: `1px solid ${isPainActive ? '#ef4444' : '#f97316'}55`,
          }}
        >
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f97316', marginBottom: '1rem' }}>
            Receptores Dérmicos Físicamente Activos ({zonaActual.name} a {presion}% presión, {temperatura}°C):
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {[
              { name: 'Meissner (Tacto fino)', active: isMeissnerActive, color: '#38bdf8' },
              { name: 'Merkel (Presión sostenida)', active: isMerkelActive, color: '#22c55e' },
              { name: 'Pacini (Vibración profunda)', active: isPaciniActive, color: '#a855f7' },
              { name: 'Ruffini (Estiramiento/Calor)', active: isRuffiniActive, color: '#ef4444' },
              { name: 'Krause / TRPM8 (Frío)', active: isColdActive, color: '#06b6d4' },
              { name: 'Nociceptores (Dolor)', active: isPainActive, color: '#ef4444', alert: true },
            ].map((rec) => (
              <div
                key={rec.name}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: rec.active ? `${rec.color}22` : 'rgba(15,23,42,0.6)',
                  border: `1px solid ${rec.active ? rec.color : 'rgba(255,255,255,0.08)'}`,
                  color: rec.active ? rec.color : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.9rem',
                  fontWeight: rec.active ? 600 : 400,
                  transition: 'all 0.25s ease',
                }}
              >
                <span>{rec.active ? (rec.alert ? '🚨' : '⚡') : '⚪'}</span>
                <span>{rec.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Diagrama anatómico de corte de piel */}
        <div style={{ marginTop: '2.5rem' }}>
          <h3 style={{ color: '#f97316', marginBottom: '1rem' }}>Diagrama Esquemático de Capas y Corpúsculos</h3>
          <OrganDiagram labels={PIEL_LABELS} />
        </div>

        {/* Gráficas comparativas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: '#f97316', marginBottom: '1rem' }}>L3 Representación: Densidad Receptora por Región Corporal</h4>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={zoneComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="zona" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #f97316' }} />
                <Bar dataKey="densidad" fill="#f97316" radius={[6, 6, 0, 0]} name="Receptores / cm²" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: '#38bdf8', marginBottom: '1rem' }}>L4 Escala: Frecuencia de Disparo Térmico (Frío vs Calor)</h4>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={thermalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="temp" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #38bdf8' }} />
                <Legend />
                <Line type="monotone" dataKey="Receptores_Frio" stroke="#38bdf8" strokeWidth={2.5} name="Fibras Frío (%)" />
                <Line type="monotone" dataKey="Receptores_Calor" stroke="#ef4444" strokeWidth={2.5} name="Fibras Calor (%)" />
                <Line type="monotone" dataKey="Alerta_Nociceptiva" stroke="#fbbf24" strokeWidth={2} strokeDasharray="4 4" name="Alerta Dolor" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </SimulationWrapper>
  );
}
