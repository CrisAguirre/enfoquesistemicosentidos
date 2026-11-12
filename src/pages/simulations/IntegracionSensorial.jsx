import { lazy, Suspense, useState, useMemo } from 'react';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import EvidenciaTextarea from '../../components/shared/EvidenciaTextarea';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
import SketchfabViewer from '../../components/shared/SketchfabViewer';
import '../pages.css';
import './simulations.css';

const SensoryComposition = lazy(() => import('../../components/three/SensoryComposition'));

const BRAIN_TRANSLATED_PARTS = [
  { es: 'Lóbulo Frontal', en: 'Frontal Lobe', desc: 'Sede de las funciones ejecutivas, memoria de trabajo, juicio y corteza motora.', role: 'Planifica y ejecuta respuestas motoras basadas en la información sensorial integrada.', lineamiento: 'L6 Propósito', color: '#c084fc' },
  { es: 'Lóbulo Parietal', en: 'Parietal Lobe', desc: 'Alberga la corteza somatosensorial primaria (giro poscentral) y áreas de asociación.', role: 'Procesa el tacto, dolor, temperatura, propiocepción e integración visoespacial.', lineamiento: 'L1 Componentes', color: '#f97316' },
  { es: 'Lóbulo Occipital', en: 'Occipital Lobe', desc: 'Corteza visual primaria (área 17 de Brodmann / V1) y secundarias.', role: 'Decodifica líneas, orientación, color, movimiento y profundidad retiniana.', lineamiento: 'L1 Componentes', color: '#3b82f6' },
  { es: 'Lóbulo Temporal', en: 'Temporal Lobe', desc: 'Corteza auditiva primaria (giro de Heschl), compresión del habla y corteza olfatoria.', role: 'Decodifica tonos acústicos, lenguaje y almacena memorias sensoriales auditivas.', lineamiento: 'L1 Componentes', color: '#22c55e' },
  { es: 'Sistema Límbico (Amígdala e Hipocampo)', en: 'Limbic System', desc: 'Circuito subcortical emocional y centro de consolidación de memoria a largo plazo.', role: 'Asigna valencia emocional (miedo, atracción) a olores, sabores y alertas sensoriales.', lineamiento: 'L6 Propósito', color: '#ec4899' },
  { es: 'Tálamo Sensorial', en: 'Sensory Thalamus', desc: 'Gran estación de relevo y filtrado para vista, oído, tacto y gusto.', role: 'Coordina y modula qué señales ascienden a la corteza consciente (atención selectiva).', lineamiento: 'L2 Causalidad', color: '#38bdf8' },
  { es: 'Corteza Insular (Ínsula)', en: 'Insular Cortex', desc: 'Estructura profunda bajo la cisura de Silvio.', role: 'Corteza gustativa primaria e interocepción de las vísceras y el cuerpo.', lineamiento: 'L1 Componentes', color: '#eab308' },
  { es: 'Corteza Orbitofrontal (OFC)', en: 'Orbitofrontal Cortex', desc: 'Zona basal frontal sobre las órbitas oculares.', role: 'Punto de convergencia donde el gusto y el olfato retronasal crean el "Sabor" emergente.', lineamiento: 'L5 Conservación', color: '#f59e0b' },
  { es: 'Cuerpo Calloso', en: 'Corpus Callosum', desc: 'Puente masivo de más de 200 millones de axones comisurales.', role: 'Integra las percepciones sensoriales de ambos hemisferios cerebrales.', lineamiento: 'L5 Conservación', color: '#a855f7' },
  { es: 'Cerebelo y Tronco Encefálico', en: 'Cerebellum & Brainstem', desc: 'Centro de control reflejo involuntario, tono muscular y balance postural.', role: 'Mantiene la estabilidad homeostática vital y reflejos protectores medulares.', lineamiento: 'L7 Estabilidad', color: '#94a3b8' },
];

export default function IntegracionSensorial() {
  const [actividad, setActividad] = useState(50);
  const [desactivado, setDesactivado] = useState('ninguno');
  const [cargaCognitiva, setCargaCognitiva] = useState('media');
  const [activeViewerTab, setActiveViewerTab] = useState('sketchfab-cerebro'); // 'sketchfab-cerebro', 'tres-d-macrosistema'

  const factorCarga = cargaCognitiva === 'baja' ? 0.8 : cargaCognitiva === 'media' ? 1.0 : 1.35;
  const tieneSentidoDesactivado = desactivado !== 'ninguno';

  const senalesPorSegundo = Math.round((800 + actividad * 18) * (tieneSentidoDesactivado ? 0.85 : 1.0));
  const tiempoReaccion = Math.round((180 + (100 - actividad) * 0.8 + (tieneSentidoDesactivado ? 45 : 0)) * factorCarga);
  const integracionMultisensorial = Math.round(
    tieneSentidoDesactivado ? Math.min(65, actividad * 0.7) : Math.min(99, 40 + actividad * 0.58)
  );
  const compensacionNeuroplastica = tieneSentidoDesactivado
    ? Math.round(60 + (actividad / 100) * 35)
    : 0;
  const cargaMetabolica = Math.round(45 + (actividad / 100) * 45 * factorCarga);

  const radarData = useMemo(() => {
    const boost = tieneSentidoDesactivado ? 20 : 0;
    return [
      { sentido: 'Vista 👁️', valor: desactivado === 'vista' ? 0 : Math.round(actividad + boost) },
      { sentido: 'Oído 👂', valor: desactivado === 'oido' ? 0 : Math.round(actividad + boost * 1.1) },
      { sentido: 'Olfato 👃', valor: desactivado === 'olfato' ? 0 : Math.round(actividad * 0.9 + boost * 0.8) },
      { sentido: 'Gusto 👅', valor: desactivado === 'gusto' ? 0 : Math.round(actividad * 0.85 + boost * 0.8) },
      { sentido: 'Tacto 🖐️', valor: desactivado === 'tacto' ? 0 : Math.round(actividad + boost * 1.2) },
    ];
  }, [actividad, desactivado, tieneSentidoDesactivado]);

  const metrics = [
    { label: 'Señales Integradas', value: `${senalesPorSegundo}`, unit: 'impulsos/s' },
    { label: 'Tiempo de Reacción Cortical', value: `${tiempoReaccion}`, unit: 'ms' },
    { label: 'Integración Multisensorial', value: `${integracionMultisensorial}%`, unit: '' },
    { label: 'Carga Metabólica Cerebral', value: `${cargaMetabolica}%`, unit: '' },
    { label: 'Compensación Neuroplástica', value: `${compensacionNeuroplastica}%`, unit: '' },
  ];

  const Actividad = (
    <div className="activity-steps">
      <div className="activity-step">
        <div className="step-number" style={{ background: '#a855f7' }}>1</div>
        <div className="step-content">
          <h4 style={{ color: '#c084fc' }}>Conservación del Flujo de Información (L5)</h4>
          <p>
            En reposo (Actividad = 20%), observa el monitor de impulsos. El cerebro no destruye la información sensorial que entra;
            la conserva codificada en patrones de frecuencia sináptica y la transforma en estados de alerta, memorias o respuestas motoras.
            ¿Qué ocurre con la energía bioeléctrica cuando dejas de mirar o escuchar un estímulo?
          </p>
        </div>
      </div>

      <div className="activity-step">
        <div className="step-number" style={{ background: '#a855f7' }}>2</div>
        <div className="step-content">
          <h4 style={{ color: '#c084fc' }}>El Propósito Global: Percepción Emergente (L6)</h4>
          <p>
            Lleva la Actividad Sensorial al 80%. Observa cómo los 5 haces sinápticos convergen simultáneamente en el cerebro.
            El propósito del sistema no es ver o escuchar por separado, sino crear una <strong>representación coherente del mundo exterior</strong> para
            permitirte anticipar riesgos, alimentarte y comunicarte. Explica cómo cooperan la vista y el tacto al agarrar un objeto en movimiento.
          </p>
        </div>
      </div>

      <div className="activity-step">
        <div className="step-number" style={{ background: '#a855f7' }}>3</div>
        <div className="step-content">
          <h4 style={{ color: '#c084fc' }}>Homeostasis y Neuroplasticidad Compensatoria (L7)</h4>
          <p>
            En el selector superior, desconecta la "Vista" o el "Oído". Observa qué sucede con el gráfico de radar y el indicador de <em>Compensación Neuroplástica</em>.
            El cerebro reorganiza sus circuitos: las áreas visuales desocupadas son colonizadas por axones táctiles y auditivos.
            ¿Por qué esta capacidad de adaptación demuestra que el sistema nervioso es resiliente y busca preservar su estabilidad funcional?
          </p>
        </div>
      </div>

      <EvidenciaTextarea titulo="Evidencia Final: Integración Sensorial y Visión de Totalidad" placeholder="Registra tu análisis sistémico integrador de los 5 sentidos..." />
    </div>
  );

  return (
    <SimulationWrapper
      simNumber={5}
      title="Integración Sensorial: El Cerebro como Eje Central"
      description="El cerebro como director de orquesta: coordinación multisensorial, compensación y neuroplasticidad."
      icon="🧠"
      info="Visión de Totalidad (L5, L6 y L7): explora el modelo anatómico 3D del Cerebro con sus partes y funciones ejecutivas traducidas al español, experimenta con los haces sinápticos en tiempo real, simula la pérdida temporal de un sentido para observar la compensación neuroplástica y manipula la carga cognitiva."
      actividad={Actividad}
      evaluacionPath="/laboratorio/integracion-sensorial/evaluacion"
    >
      {/* ── SELECTOR DE MODELO 3D ── */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          className={`sim-btn ${activeViewerTab === 'sketchfab-cerebro' ? 'active' : ''}`}
          onClick={() => setActiveViewerTab('sketchfab-cerebro')}
          style={{ borderColor: activeViewerTab === 'sketchfab-cerebro' ? '#c084fc' : 'rgba(255,255,255,0.1)' }}
        >
          <span>🧠 1. Cerebro 3D: Partes y Funciones Ejecutivas</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Yonejo)</span>
        </button>

        <button
          className={`sim-btn ${activeViewerTab === 'tres-d-macrosistema' ? 'active' : ''}`}
          onClick={() => setActiveViewerTab('tres-d-macrosistema')}
          style={{ borderColor: activeViewerTab === 'tres-d-macrosistema' ? '#38bdf8' : 'rgba(255,255,255,0.1)' }}
        >
          <span>🌐 2. Macrosistema Sensorial: Haces Sinápticos 3D</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Three.js Nativo)</span>
        </button>
      </div>

      {/* VISTA 1: CEREBRO SKETCHFAB (Yonejo) */}
      {activeViewerTab === 'sketchfab-cerebro' && (
        <SketchfabViewer
          modelId="b7adcbb83ce54303a598bc7e6839f1f2"
          title="Cerebro / Memoria / Funciones Ejecutivas"
          author="Yonejo"
          authorUrl="https://sketchfab.com/yonejo"
          modelUrl="https://sketchfab.com/3d-models/cerebro-memoria-funciones-ejecutivas-b7adcbb83ce54303a598bc7e6839f1f2"
          accentColor="#c084fc"
          translatedParts={BRAIN_TRANSLATED_PARTS}
          partsTitle="Anatomía Funcional del Cerebro Humano y Lóbulos Sensoriales"
          height={500}
        />
      )}

      {/* VISTA 2: MACROSISTEMA 3D NATIVO */}
      {activeViewerTab === 'tres-d-macrosistema' && (
        <div className="sim-canvas">
          <Suspense fallback={<div className="model-loading"><p>Cargando modelo 3D del Cerebro…</p></div>}>
            <SensoryComposition
              activity={actividad}
              disabledSense={desactivado === 'ninguno' ? null : desactivado}
              height={520}
            />
          </Suspense>
          <div style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Renderizado Three.js con pulsos sinápticos dinámicos hacia los 5 órganos periféricos
          </div>
        </div>
      )}

      {/* CONTROLES Y MÉTRICAS */}
      <div style={{ marginTop: '2.5rem' }}>
        <h2 style={{ color: '#c084fc', fontSize: '1.6rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🔬</span> Control del Macrosistema Sensorial Integrado
        </h2>

        {/* Controles del sistema integrado */}
        <div className="sim-sliders">
          <div className="sim-slider-field">
            <label htmlFor="act-slider">
              <span>⚡ Actividad Sensorial Global</span>
              <span>{actividad}%</span>
            </label>
            <input
              id="act-slider"
              type="range"
              min="10"
              max="100"
              value={actividad}
              onChange={(e) => setActividad(Number(e.target.value))}
            />
          </div>

          <div className="sim-slider-field">
            <label>
              <span>🔌 Simulación de Pérdida Sensorial (L7)</span>
            </label>
            <select
              className="puzzle-selector"
              value={desactivado}
              onChange={(e) => setDesactivado(e.target.value)}
              style={{ marginTop: '0.4rem' }}
            >
              <option value="ninguno">Todos los sentidos activos (Normal)</option>
              <option value="vista">Desactivar Vista (Ceguera / Venda)</option>
              <option value="oido">Desactivar Oído (Sordera / Silenciador)</option>
              <option value="olfato">Desactivar Olfato (Anosmia total)</option>
              <option value="gusto">Desactivar Gusto (Ageusia)</option>
              <option value="tacto">Desactivar Tacto (Parestesia / Bloqueo)</option>
            </select>
          </div>

          <div className="sim-slider-field">
            <label>
              <span>🎯 Carga Cognitiva / Atención</span>
            </label>
            <select
              className="puzzle-selector"
              value={cargaCognitiva}
              onChange={(e) => setCargaCognitiva(e.target.value)}
              style={{ marginTop: '0.4rem' }}
            >
              <option value="baja">Baja (Reposo / Atención plena)</option>
              <option value="media">Media (Actividad cotidiana)</option>
              <option value="alta">Alta (Multitarea / Estrés sensorial)</option>
            </select>
          </div>
        </div>

        {/* Métricas fisiológicas en tiempo real */}
        <div className="sim-metrics">
          {metrics.map((m) => (
            <div key={m.label} className="stat-card">
              <div className="stat-value" style={{ color: '#c084fc' }}>{m.value}</div>
              <div className="stat-label">{m.label} {m.unit && `(${m.unit})`}</div>
            </div>
          ))}
        </div>

        {/* Gráficos de Balance Cortical y Tiempo de Reacción */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: '#c084fc', marginBottom: '1rem' }}>L3 Representación: Distribución de Carga en los 5 Sentidos</h4>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.15)" />
                <PolarAngleAxis dataKey="sentido" stroke="#94a3b8" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748b" />
                <Radar name="Actividad Cortical" dataKey="valor" stroke="#a855f7" fill="#a855f7" fillOpacity={0.4} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #a855f7' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: '#38bdf8', marginBottom: '1rem' }}>L7 Estabilidad: Respuesta del Sistema ante Perturbaciones</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estado del Macrosistema:</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: tieneSentidoDesactivado ? '#f59e0b' : '#22c55e', marginTop: '0.25rem' }}>
                  {tieneSentidoDesactivado ? '⚡ Compensación Activa por Neuroplasticidad' : '✓ Homeostasis y Sinergia Total'}
                </div>
              </div>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tiempo de Reacción Cortical:</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: tiempoReaccion > 250 ? '#ef4444' : '#38bdf8', marginTop: '0.25rem' }}>
                  {tiempoReaccion} milisegundos ({tiempoReaccion < 220 ? 'Excelente agilidad' : 'Latencia incrementada'})
                </div>
              </div>
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Propósito Sistémico (L6):</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Integrar señales dispares para guiar la conducta motora, anticipar riesgos y asegurar la supervivencia del organismo en tiempo real.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SimulationWrapper>
  );
}
