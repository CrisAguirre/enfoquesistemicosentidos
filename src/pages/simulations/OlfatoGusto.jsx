import { lazy, Suspense, useState, useMemo } from 'react';
import EvidenciaTextarea from '../../components/shared/EvidenciaTextarea';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import SimulationWrapper from '../../components/shared/SimulationWrapper';
import OrganDiagram from '../../components/shared/OrganDiagram';
import Carousel from '../../components/shared/Carousel';
import SketchfabViewer from '../../components/shared/SketchfabViewer';
import '../pages.css';
import './simulations.css';

const ModelViewer = lazy(() => import('../../components/three/ModelViewer'));

const TASTES = [
  { id: 'dulce', name: 'Dulce (Glucosa / Sacarosa)', color: '#ec4899', threshold: 'Bajo-Medio (~10 mM)', role: 'Energía calórica disponible' },
  { id: 'salado', name: 'Salado (NaCl / Iones Na+)', color: '#38bdf8', threshold: 'Bajo-Medio (~15 mM)', role: 'Equilibrio hidroelectrolítico' },
  { id: 'acido', name: 'Ácido (Protones H+)', color: '#eab308', threshold: 'Bajo (~2 mM)', role: 'Identifica acidez / fermentación' },
  { id: 'amargo', name: 'Amargo (Quinina / Alcaloides)', color: '#22c55e', threshold: 'Extremadamente bajo (~0.008 mM)', role: 'Alerta temprana contra toxinas vegetales' },
  { id: 'umami', name: 'Umami (Glutamato monosódico)', color: '#a855f7', threshold: 'Bajo (~1 mM)', role: 'Proteínas y aminoácidos esenciales' },
];

const TONGUE_TRANSLATED_PARTS = [
  { es: 'Ápice Lingual (Punta)', en: 'Apex of tongue', desc: 'Porción anterior móvil de gran destreza mecánica y tacto.', role: 'Exploración de textura y alta densidad de papilas fungiformes.', lineamiento: 'L1 Componentes', color: '#ec4899' },
  { es: 'Dorso de la Lengua', en: 'Dorsum of tongue', desc: 'Superficie superior convexa dividida por el surco medio.', role: 'Soporte de la masticación y distribución del bolo sobre las papilas.', lineamiento: 'L1 Componentes', color: '#f43f5e' },
  { es: 'Papilas Fungiformes', en: 'Fungiform Papillae', desc: 'Papilas rojizas con forma de hongo en bordes y punta.', role: 'Contienen de 1 a 5 botones gustativos inervados por el nervio facial (VII).', lineamiento: 'L1 Componentes', color: '#fb7185' },
  { es: 'Papilas Caliciformes (Valadas)', en: 'Circumvallate Papillae', desc: '8 a 12 papilas gigantes dispuestas en V lingual.', role: 'Albergan la mitad de todos los botones gustativos; detección primaria de amargo.', lineamiento: 'L4 Escalas', color: '#ef4444' },
  { es: 'Papilas Foliadas', en: 'Foliate Papillae', desc: 'Pliegues paralelos en los márgenes laterales posteriores.', role: 'Sensibilidad gustativa lateral conectada con el nervio glosofaríngeo (IX).', lineamiento: 'L1 Componentes', color: '#eab308' },
  { es: 'Papilas Filiformes', en: 'Filiform Papillae', desc: 'Minúsculas proyecciones cónicas queratinizadas por todo el dorso.', role: 'Función puramente mecánica: rozamiento y tacto (no tienen botones gustativos).', lineamiento: 'L3 Representación', color: '#cbd5e1' },
  { es: 'Botón Gustativo Microscópico', en: 'Taste Bud', desc: 'Estructura en bulbo con 50-100 células receptoras y microvellosidades.', role: 'Transductor biológico: despolarización iónica ante moléculas solubles.', lineamiento: 'L2 Causalidad', color: '#38bdf8' },
  { es: 'Amígdala Lingual', en: 'Lingual Tonsil', desc: 'Nódulos linfoides en la raíz posterior de la lengua.', role: 'Línea de defensa inmunológica contra patógenos ingeridos.', lineamiento: 'L6 Propósito', color: '#a855f7' },
];

const NOSE_TRANSLATED_PARTS = [
  { es: 'Cavidad Nasal (Rongga Hidung)', en: 'Nasal Cavity', desc: 'Espacio aéreo recubierto de mucosa respiratoria ciliada.', role: 'Calienta, humedece y filtra el aire antes de que llegue a los pulmones.', lineamiento: 'L5 Conservación', color: '#eab308' },
  { es: 'Cornetes Nasales (Konka Nasalis)', en: 'Nasal Conchae / Turbinates', desc: 'Huesos curvados en espiral (superior, medio e inferior).', role: 'Generan flujo turbulento para que los olores alcancen el techo nasal.', lineamiento: 'L1 Componentes', color: '#f59e0b' },
  { es: 'Epitelio Olfatorio (Epitel Olfaktori)', en: 'Olfactory Epithelium', desc: 'Área sensorial de ~5 cm² en el techo nasal con 10-20 millones de neuronas.', role: 'Quimiorrecepción: los cilios capturan moléculas odoríferas volátiles.', lineamiento: 'L1 Componentes', color: '#ec4899' },
  { es: 'Lámina Cribosa (Tulang Kribriformis)', en: 'Cribriform Plate', desc: 'Porción horizontal perforada del hueso etmoides.', role: 'Paso directo de los filamentos del nervio olfatorio hacia el cráneo.', lineamiento: 'L2 Causalidad', color: '#cbd5e1' },
  { es: 'Bulbo Olfatorio (Bulbus Olfaktorius)', en: 'Olfactory Bulb', desc: 'Estructura encefálica ventral donde sinapsan los axones en glomérulos.', role: 'Filtro y amplificación sináptica de olores específicos.', lineamiento: 'L2 Causalidad', color: '#a855f7' },
  { es: 'Tracto Olfatorio (Traktus Olfaktorius)', en: 'Olfactory Tract', desc: 'Cinta blanca de fibras nerviosas hacia la corteza y el sistema límbico.', role: 'Comunica directamente con la amígdala (emoción) y el hipocampo (memoria).', lineamiento: 'L6 Propósito', color: '#818cf8' },
  { es: 'Tabique Nasal (Septum Nasi)', en: 'Nasal Septum', desc: 'Pared vertical ósea y cartilaginosa que divide la nariz.', role: 'Divide el flujo en dos canales independientes para alternancia cíclica.', lineamiento: 'L7 Estabilidad', color: '#94a3b8' },
  { es: 'Senos Paranasales (Sinus Paranasalis)', en: 'Paranasal Sinuses', desc: 'Cavidades huecas (frontal, esfenoidal, maxilar) conectadas a la nariz.', role: 'Resonancia de la voz, aligeramiento del peso craneal y moco.', lineamiento: 'L1 Componentes', color: '#06b6d4' },
];

export default function OlfatoGusto() {
  const [concentracion, setConcentracion] = useState(40);
  const [saborSeleccionado, setSaborSeleccionado] = useState('dulce');
  const [aromaSeleccionado, setAromaSeleccionado] = useState('frutal');
  const [congestionado, setCongestionado] = useState(false);
  const [activeViewerTab, setActiveViewerTab] = useState('sketchfab-lengua'); // 'sketchfab-lengua', 'sketchfab-seccion', 'sketchfab-nariz', 'glb-nariz', 'simulador'

  const factorOlfato = congestionado ? 0.2 : 1.0;
  const percepcionGusto = Math.round((concentracion / 100) * 80);
  const percepcionOlfato = Math.round((concentracion / 100) * 100 * factorOlfato);
  const saborEmergente = Math.round(percepcionGusto * 0.35 + percepcionOlfato * 0.65);

  const tasteBarData = useMemo(() => {
    return TASTES.map((t) => {
      const isCurrent = t.id === saborSeleccionado;
      const val = isCurrent ? concentracion : Math.max(5, Math.round(concentracion * 0.15));
      return {
        sabor: t.name.split(' ')[0],
        activacion: val,
        color: t.color,
      };
    });
  }, [concentracion, saborSeleccionado]);

  const sigmoidData = useMemo(() => {
    const data = [];
    for (let c = 0; c <= 100; c += 10) {
      const k = 30;
      const resp = (Math.pow(c, 2) / (Math.pow(c, 2) + Math.pow(k, 2))) * 100;
      data.push({
        concentracion: c,
        percepcion: Math.round(resp),
      });
    }
    return data;
  }, []);

  const OLFATO_LABELS = [
    { id: 'cornetes', name: 'Cornetes Nasales', description: 'Estructuras óseas que calientan, humedecen y arremolinan el aire inhalado.', role: 'Direccionan el flujo aéreo hacia el epitelio olfatorio superior.', top: '55%', left: '32%', color: '#eab308' },
    { id: 'epitelio', name: 'Epitelio Olfatorio', description: 'Tejido de ~5 cm² con 10 a 20 millones de neuronas receptoras con cilios.', role: 'Quimiorrecepción primaria: captura moléculas odoríferas.', top: '35%', left: '48%', color: '#f59e0b' },
    { id: 'bulbo', name: 'Bulbo Olfatorio', description: 'Estructura cerebral ventral que recibe los axones del par craneal I.', role: 'Primer centro de procesamiento y filtrado sináptico olfatorio.', top: '24%', left: '60%', color: '#ec4899' },
    { id: 'limbico', name: 'Vía Límbica', description: 'Conexión directa hacia la amígdala cerebral y el hipocampo.', role: 'Evoca memorias episódicas profundas y respuestas emocionales/aversivas.', top: '40%', left: '80%', color: '#a855f7' },
  ];

  const GUSTO_LABELS = [
    { id: 'papilas-f', name: 'Papilas Fungiformes', description: 'Dispersas en la punta y bordes linguales.', role: 'Receptores sensibles al tacto, temperatura y sabores primarios.', top: '65%', left: '40%', color: '#ec4899' },
    { id: 'papilas-c', name: 'Papilas Caliciformes', description: 'Grandes papilas en forma de V lingual posterior.', role: 'Alta densidad de botones gustativos; detección de sustancias amargas.', top: '35%', left: '50%', color: '#ef4444' },
    { id: 'boton', name: 'Botón Gustativo', description: 'Racimo celular con poro gustativo y microvellosidades.', role: 'Transducción de moléculas solubles a potenciales bioeléctricos.', top: '50%', left: '72%', color: '#38bdf8' },
    { id: 'nervios', name: 'Nervios Gustativos (VII, IX)', description: 'Nervio facial, glosofaríngeo y vago.', role: 'Conducen señales hacia el núcleo del tracto solitario y la corteza insular.', top: '25%', left: '85%', color: '#22c55e' },
  ];

  const Actividad = (
    <div>
      <h2 style={{ color: '#eab308', marginBottom: '1.5rem' }}>Actividad Práctica: Quimiorrecepción y Sinergia Multisensorial</h2>

      <h3 style={{ color: '#eab308', borderBottom: '1px solid #eab308', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2rem' }}>
        Lineamiento 3: Representación Gráfica de Vías Químicas
      </h3>
      <Carousel color="#eab308" title="Lineamiento 3: Representación de Olfato y Gusto">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#eab308' }}>👃 Reto 1/4 (L3) — La Conexión Límbica</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Explora el modelo 3D de la nariz y localiza el bulbo y tracto olfatorio. A diferencia de la vista y el oído, las señales olfativas no pasan obligatoriamente por el tálamo antes de llegar a la corteza. ¿Hacia qué estructuras del sistema límbico viajan directamente y qué explica esto sobre los recuerdos emocionales que evoca un olor?
          </p>
          <EvidenciaTextarea titulo="Olfato-Gusto - Reto 1 (L3): Vía olfatoria y sistema límbico" placeholder="Explica la conexión con la amígdala y el hipocampo..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#eab308' }}>👃 Reto 2/4 (L3) — Desmintiendo el Mapa de la Lengua</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Revisa el modelo 3D de la lengua de Nima y el corte histológico de Novaky. La ciencia moderna demostró que todas las papilas con botones pueden detectar los 5 sabores básicos. ¿Cómo representarías gráficamente la distribución real de receptores en la superficie lingual?
          </p>
          <EvidenciaTextarea titulo="Olfato-Gusto - Reto 2 (L3): Desmintiendo el mapa de la lengua" placeholder="Explica la presencia global de receptores en todas las zonas..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#eab308' }}>👃 Reto 3/4 (L3) — Sinergia Retronasal del Sabor</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            En el simulador, activa el botón de "Congestión Nasal (Gripa)". Observa cómo la percepción emergente del sabor se desploma. Explica por qué el "sabor" es una propiedad emergente creada en el cerebro por la unión de olfato retronasal y papilas.
          </p>
          <EvidenciaTextarea titulo="Olfato-Gusto - Reto 3 (L3): Sinergia retronasal y congestión" placeholder="Explica cómo el cerebro combina olfato retronasal y papilas..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#eab308' }}>👃 Reto 4/4 (L3) — El Umami y la Detección de Nutrientes</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            ¿Qué molécula específica activa el receptor del sabor Umami y por qué el cerebro recompensa con una sensación placentera la ingesta de alimentos ricos en aminoácidos y proteínas?
          </p>
          <EvidenciaTextarea titulo="Olfato-Gusto - Reto 4 (L3): El sabor Umami y aminoácidos" placeholder="Explica el glutamato y su valor nutricional proteico..." />
        </div>
      </Carousel>

      <h3 style={{ color: '#ec4899', borderBottom: '1px solid #ec4899', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '3rem' }}>
        Lineamiento 4: Escalas Numéricas y Umbrales Químicos
      </h3>
      <Carousel color="#ec4899" title="Lineamiento 4: Escalas de Concentración y Sensibilidad">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#ec4899' }}>📏 Reto 1/4 (L4) — La Asimetría de Umbrales</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            El umbral para detectar sabor amargo (0.008 mM) es casi mil veces más bajo que el del dulce (10 mM). Desde el pensamiento sistémico evolutivo, ¿por qué el sistema calibró sus escalas con tal sensibilidad hacia lo amargo?
          </p>
          <EvidenciaTextarea titulo="Olfato-Gusto - Reto 1 (L4): Umbral ultra-bajo del amargo" placeholder="Compara la protección contra venenos vs necesidad de azúcares..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#ec4899' }}>📏 Reto 2/4 (L4) — Curva Sigmoide de Saturación</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Observa la gráfica sigmoidea. ¿Por qué agregar 10 cucharadas de azúcar no sabe 10 veces más dulce que agregar 2? Explica el concepto de saturación de receptores químicos celulares.
          </p>
          <EvidenciaTextarea titulo="Olfato-Gusto - Reto 2 (L4): Saturación del receptor celular" placeholder="Explica la ocupación máxima de receptores..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#ec4899' }}>📏 Reto 3/4 (L4) — Escala de Partes por Millón (ppm)</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            El ser humano puede detectar el olor a gas butano/mercaptano en concentraciones de apenas unas partes por billón. ¿Por qué es vital que los receptores químicos operen a escalas tan microscópicas?
          </p>
          <EvidenciaTextarea titulo="Olfato-Gusto - Reto 3 (L4): Detección en partes por billón" placeholder="Sensibilidad extrema para supervivencia y escape..." />
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h4 style={{ marginBottom: '1rem', color: '#ec4899' }}>📏 Reto 4/4 (L4) — Habituación Temporal</h4>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            Si entras a un lugar con un aroma intenso, al cabo de 10 minutos dejas de percibirlo casi por completo. ¿En qué escala de tiempo ocurre la adaptación de receptores olfativos y qué beneficio tiene para el sistema?
          </p>
          <EvidenciaTextarea titulo="Olfato-Gusto - Reto 4 (L4): Escala temporal de adaptación olfatoria" placeholder="Explica la habituación en minutos para nuevos olores..." />
        </div>
      </Carousel>
    </div>
  );

  return (
    <SimulationWrapper
      simNumber={3}
      title="Olfato y Gusto: Los Sentidos Químicos"
      description="Quimiorrecepción, sinergia retronasal del sabor y umbrales de detección molecular."
      icon="👃"
      info="Laboratorio de Olfato y Gusto (L3 y L4): explora los modelos 3D de la lengua y la cavidad nasal con sus estructuras anatómicas traducidas al español, manipula la concentración y simula el efecto de la congestión nasal en el sabor emergente."
      actividad={Actividad}
      evaluacionPath="/laboratorio/olfato-gusto/evaluacion"
    >
      {/* ── SELECTOR DE MODELOS 3D ── */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          className={`sim-btn ${activeViewerTab === 'sketchfab-lengua' ? 'active' : ''}`}
          onClick={() => setActiveViewerTab('sketchfab-lengua')}
          style={{ borderColor: activeViewerTab === 'sketchfab-lengua' ? '#ec4899' : 'rgba(255,255,255,0.1)' }}
        >
          <span>👅 1. Lengua Humana 3D</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Nima)</span>
        </button>

        <button
          className={`sim-btn ${activeViewerTab === 'sketchfab-seccion' ? 'active' : ''}`}
          onClick={() => setActiveViewerTab('sketchfab-seccion')}
          style={{ borderColor: activeViewerTab === 'sketchfab-seccion' ? '#f43f5e' : 'rgba(255,255,255,0.1)' }}
        >
          <span>🔬 2. Corte Histológico de Lengua</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Novaky)</span>
        </button>

        <button
          className={`sim-btn ${activeViewerTab === 'sketchfab-nariz' ? 'active' : ''}`}
          onClick={() => setActiveViewerTab('sketchfab-nariz')}
          style={{ borderColor: activeViewerTab === 'sketchfab-nariz' ? '#eab308' : 'rgba(255,255,255,0.1)' }}
        >
          <span>👃 3. Anatomía Nasal Traducida</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Umar Faruq)</span>
        </button>

        <button
          className={`sim-btn ${activeViewerTab === 'glb-nariz' ? 'active' : ''}`}
          onClick={() => setActiveViewerTab('glb-nariz')}
          style={{ borderColor: activeViewerTab === 'glb-nariz' ? '#38bdf8' : 'rgba(255,255,255,0.1)' }}
        >
          <span>🧊 4. Modelo GLB Local Nariz</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(/models/nariz.glb)</span>
        </button>

        <button
          className={`sim-btn ${activeViewerTab === 'simulador' ? 'active' : ''}`}
          onClick={() => setActiveViewerTab('simulador')}
          style={{ borderColor: activeViewerTab === 'simulador' ? '#a855f7' : 'rgba(255,255,255,0.1)' }}
        >
          <span>🧪 5. Simulador de Sabor</span>
          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>(Sinergia Quimiosensorial)</span>
        </button>
      </div>

      {/* VISTA 1: LENGUA SKETCHFAB (Nima) */}
      {activeViewerTab === 'sketchfab-lengua' && (
        <SketchfabViewer
          modelId="afa408912123471fb1c0e999a9c0e27a"
          title="Tongue Anatomy (Dorsum of tongue)"
          author="Nima"
          authorUrl="https://sketchfab.com/h3ydari96"
          modelUrl="https://sketchfab.com/3d-models/tongue-anatomy-dorsum-of-tongue-afa408912123471fb1c0e999a9c0e27a"
          accentColor="#ec4899"
          translatedParts={TONGUE_TRANSLATED_PARTS}
          partsTitle="Estructuras Anatómicas de la Lengua Humana"
          height={490}
        />
      )}

      {/* VISTA 2: SECCIÓN HISTOLÓGICA LENGUA (Novaky) */}
      {activeViewerTab === 'sketchfab-seccion' && (
        <SketchfabViewer
          modelId="25957d363e234f96b2cd2d3762daaf83"
          title="Tongue Section (Corte de Lengua y Papilas)"
          author="1225659838@qq.com"
          authorUrl="https://sketchfab.com/Novaky"
          modelUrl="https://sketchfab.com/3d-models/tongue-section-25957d363e234f96b2cd2d3762daaf83"
          accentColor="#f43f5e"
          translatedParts={TONGUE_TRANSLATED_PARTS}
          partsTitle="Corte Transversal: Papilas y Botones Gustativos"
          height={490}
        />
      )}

      {/* VISTA 3: NARIZ SKETCHFAB (Umar Faruq) */}
      {activeViewerTab === 'sketchfab-nariz' && (
        <SketchfabViewer
          modelId="8451417e97bd49e7ba90def247715fe2"
          title="Anatomi Hidung (Nose Anatomy)"
          author="Umar Faruq"
          authorUrl="https://sketchfab.com/masumarul19"
          modelUrl="https://sketchfab.com/3d-models/anatomi-hidung-nose-anatomy-8451417e97bd49e7ba90def247715fe2"
          accentColor="#eab308"
          translatedParts={NOSE_TRANSLATED_PARTS}
          partsTitle="Anatomía de la Cavidad Nasal y Vía Olfatoria (Traducido)"
          height={490}
        />
      )}

      {/* VISTA 4: GLB LOCAL NARIZ */}
      {activeViewerTab === 'glb-nariz' && (
        <div className="sim-canvas">
          <Suspense fallback={<div className="model-loading"><p>Cargando modelo /models/nariz.glb…</p></div>}>
            <ModelViewer src="/models/nariz.glb" height={490} autoRotate={true} />
          </Suspense>
          <div style={{ textAlign: 'center', padding: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Renderizado Three.js nativo desde <code>/public/models/nariz.glb</code>
          </div>
        </div>
      )}

      {/* VISTA 5: SIMULADOR DE SABOR */}
      <div style={{ marginTop: activeViewerTab === 'simulador' ? '0' : '2.5rem' }}>
        <h2 style={{ color: '#eab308', fontSize: '1.6rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🔬</span> Simulador Quimiosensorial: Nariz, Lengua y Sabor Emergente
        </h2>

        {/* Sliders y selectores */}
        <div className="sim-sliders">
          <div className="sim-slider-field">
            <label htmlFor="conc-slider">
              <span>🧪 Concentración de la Sustancia</span>
              <span>{concentracion}%</span>
            </label>
            <input
              id="conc-slider"
              type="range"
              min="0"
              max="100"
              value={concentracion}
              onChange={(e) => setConcentracion(Number(e.target.value))}
            />
          </div>

          <div className="sim-slider-field">
            <label>
              <span>👅 Sabor Químico Principal</span>
            </label>
            <select
              className="puzzle-selector"
              value={saborSeleccionado}
              onChange={(e) => setSaborSeleccionado(e.target.value)}
              style={{ marginTop: '0.4rem' }}
            >
              {TASTES.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="sim-slider-field">
            <label>
              <span>👃 Molécula Aromática Volátil</span>
            </label>
            <select
              className="puzzle-selector"
              value={aromaSeleccionado}
              onChange={(e) => setAromaSeleccionado(e.target.value)}
              style={{ marginTop: '0.4rem' }}
            >
              <option value="frutal">Frutal / Ésteres dulces</option>
              <option value="citrico">Cítrico / Limoneno</option>
              <option value="mentolado">Mentolado / Eucaliptol</option>
              <option value="ahumado">Ahumado / Pirazinas</option>
            </select>
          </div>

          <div className="sim-slider-field" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <button
              className={`sim-btn ${congestionado ? 'active' : ''}`}
              onClick={() => setCongestionado(!congestionado)}
              style={{
                borderColor: congestionado ? '#ef4444' : 'rgba(255,255,255,0.2)',
                background: congestionado ? 'rgba(239,68,68,0.2)' : 'rgba(30,41,59,0.7)',
                color: congestionado ? '#f87171' : 'var(--text-secondary)',
                padding: '0.8rem',
              }}
            >
              <span>{congestionado ? '🤧 Congestión Nasal Activa' : '👃 Respiración Nasal Despejada'}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                {congestionado ? '(Olfato bloqueado -80%)' : '(Olfato retronasal al 100%)'}
              </span>
            </button>
          </div>
        </div>

        {/* Métricas quimiosensoriales */}
        <div className="sim-metrics">
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#ec4899' }}>{percepcionGusto}%</div>
            <div className="stat-label">Señal Papilar (Lengua)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: congestionado ? '#ef4444' : '#eab308' }}>
              {percepcionOlfato}%
            </div>
            <div className="stat-label">Señal Olfativa (Nariz)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#a855f7', fontWeight: 800 }}>
              {saborEmergente}%
            </div>
            <div className="stat-label">Sabor Emergente en Cerebro</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#22c55e' }}>
              {TASTES.find((t) => t.id === saborSeleccionado)?.threshold}
            </div>
            <div className="stat-label">Umbral de Detección Biológico</div>
          </div>
        </div>

        {/* Diagramas anatómicos interactivos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginTop: '2.5rem' }}>
          <div>
            <h3 style={{ color: '#eab308', marginBottom: '1rem' }}>Estructura Olfatoria y Vía Límbica</h3>
            <OrganDiagram labels={OLFATO_LABELS} />
          </div>
          <div>
            <h3 style={{ color: '#ec4899', marginBottom: '1rem' }}>Estructura Lingual y Botones Gustativos</h3>
            <OrganDiagram labels={GUSTO_LABELS} />
          </div>
        </div>

        {/* Gráficas comparativas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: '#ec4899', marginBottom: '1rem' }}>L3 Representación: Activación de los 5 Sabores Primarios</h4>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={tasteBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="sabor" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #ec4899' }} />
                <Bar dataKey="activacion" radius={[6, 6, 0, 0]}>
                  {tasteBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ color: '#eab308', marginBottom: '1rem' }}>L4 Escala: Concentración Química vs Percepción (Curva Sigmoide)</h4>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={sigmoidData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="concentracion" stroke="#94a3b8" label={{ value: 'Concentración (%)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                <YAxis stroke="#94a3b8" domain={[0, 100]} label={{ value: 'Percepción (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #eab308' }} />
                <Line type="monotone" dataKey="percepcion" stroke="#eab308" strokeWidth={3} dot={{ r: 4 }} name="Respuesta Sensorial (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </SimulationWrapper>
  );
}
