import { useState, useEffect, useRef, useId } from 'react';
import './DiagramaConexionesVisuales.css';

/**
 * 12 Estaciones del Circuito Visual Completo:
 * Del fotón físico a la percepción consciente en la corteza occipital.
 */
const ESTACIONES_VISUALES = [
  {
    id: 'fotones',
    num: 1,
    nombre: 'Luz y Fotones Incidentes',
    categoria: 'optico',
    categoriaLabel: 'Estímulo Físico',
    color: '#fbbf24',
    pos: { x: 60, y: 155 },
    foco: { x: 60, y: 230 },
    subtitulo: 'Radiación electromagnética (380 - 700 nm)',
    mecanismo: 'La luz reflejada por los objetos viaja en línea recta a 300,000 km/s. Cada fotón transporta un cuanto de energía proporcional a su frecuencia (E = h·ν). La información del entorno (luminancia, contraste y espectro electromagnético) ingresa como el input inicial del sistema.',
    input: 'Emisión o reflexión lumínica ambiental',
    proceso: 'Propagación rectilínea de ondas y fotones',
    output: 'Frente de onda incidente sobre la córnea',
    principio: 'L2 Causalidad: El estímulo físico es la causa primaria sin la cual el sistema permanece en reposo.',
    clinica: 'En condiciones de penumbra extrema (cero fotones), el ojo no genera visión; en exceso lumínico (>10,000 lux), puede producir foto-daño retinal.',
  },
  {
    id: 'cornea',
    num: 2,
    nombre: 'Córnea',
    categoria: 'optico',
    categoriaLabel: 'Óptica Refractiva',
    color: '#38bdf8',
    pos: { x: 195, y: 130 },
    foco: { x: 195, y: 230 },
    subtitulo: 'Primera lente convergente (~43 Dioptrías)',
    mecanismo: 'Lente avascular transparente convexa con un índice de refracción de n = 1.376. Aporta más del 70% del poder de enfoque total del ojo debido a la enorme diferencia entre el índice del aire (1.000) y el tejido corneal.',
    input: 'Haz divergente o paralelo de luz incidente',
    proceso: 'Refracción óptica fija por curvatura convexa',
    output: 'Haz convergente hacia la cámara anterior',
    principio: 'L1 Componentes y Estructura: Geometría esfero-cilíndrica especializada sin vasos sanguíneos para garantizar máxima transparencia.',
    clinica: 'El astigmatismo ocurre cuando la córnea pierde su curvatura esférica uniforme y adopta una forma ovalada (tórica), generando múltiples puntos focales.',
  },
  {
    id: 'pupila',
    num: 3,
    nombre: 'Iris y Pupila',
    categoria: 'optico',
    categoriaLabel: 'Regulador Homeostático',
    color: '#60a5fa',
    pos: { x: 250, y: 110 },
    foco: { x: 245, y: 230 },
    subtitulo: 'Apertura pupilar dinámica (2 a 8 mm)',
    mecanismo: 'Diafragma muscular con dos efectores antagónicos: el esfínter pupilar (inervado por el parasimpático para miosis) y el músculo dilatador (inervado por el simpático para midriasis). Regula activamente la entrada de luz para proteger la retina y optimizar la profundidad de campo.',
    input: 'Intensidad lumínica censada en la retina (vía aferente)',
    proceso: 'Retroalimentación refleja vegetativa (reflejo fotomotor)',
    output: 'Diámetro pupilar regulado homeostáticamente',
    principio: 'L7 Homeostasis y Bucle Negativo: Contracción automática ante la alta intensidad para mantener el flujo fotónico en niveles operativos.',
    clinica: 'El reflejo fotomotor consensual: iluminar un ojo causa miosis en ambos debido a que la señal aferente cruza en el pretectum del mesencéfalo.',
  },
  {
    id: 'cristalino',
    num: 4,
    nombre: 'Cristalino y Músculos Ciliares',
    categoria: 'optico',
    categoriaLabel: 'Acomodación Dinámica',
    color: '#818cf8',
    pos: { x: 305, y: 135 },
    foco: { x: 290, y: 230 },
    subtitulo: 'Lente biconvexa elástica autoajustable (~15-25 D)',
    mecanismo: 'Lente transparente formada por células alargadas ricas en cristalinas. Al enfocar objetos cercanos, el músculo ciliar se contrae, afloja las fibras zonulares y el cristalino se abomba por su propia elasticidad, aumentando su potencia refractiva.',
    input: 'Distancia variable del objeto observado (10 cm a infinito)',
    proceso: 'Deformación biomecánica elástica mediada por el músculo ciliar',
    output: 'Plano focal proyectado exactamente sobre la superficie de la retina',
    principio: 'L1 Biomecánica y Elasticidad: Interacción antagónica entre la tensión zonular y la cápsula elástica del cristalino.',
    clinica: 'Presbicia: a partir de los 40-45 años el cristalino pierde elasticidad por acumulación proteica, dificultando el enfoque de objetos cercanos.',
  },
  {
    id: 'vitreo',
    num: 5,
    nombre: 'Humor Vítreo',
    categoria: 'optico',
    categoriaLabel: 'Medio y Soporte',
    color: '#06b6d4',
    pos: { x: 380, y: 145 },
    foco: { x: 375, y: 230 },
    subtitulo: 'Gel hidrostático de la cámara vítrea (~4 ml)',
    mecanismo: 'Gel viscoelástico transparente compuesto en 99% de agua, ácido hialurónico y fibrillas de colágeno. Llena el 80% del volumen ocular, sostiene la retina contra la coroides y permite el paso no refractivo de los rayos hasta el fondo del ojo.',
    input: 'Luz refractada convergente que cruza el eje óptico',
    proceso: 'Transmisión sin distorsión y amortiguación hidrostática de golpes',
    output: 'Rayo focalizado llegando a la superficie fotorreceptora',
    principio: 'L5 Conservación de la Estructura: La presión intraocular y el volumen vítreo fijan la distancia axial focal exacta (24 mm).',
    clinica: 'Los desprendimientos de vítreo posterior generan tracción retiniana y la percepción de fotopsias (destellos) y miodesopsias (moscas volantes).',
  },
  {
    id: 'retina',
    num: 6,
    nombre: 'Retina (Bastones y Conos)',
    categoria: 'transductor',
    categoriaLabel: 'Transductor Bioquímico',
    color: '#f43f5e',
    pos: { x: 450, y: 125 },
    foco: { x: 470, y: 190 },
    subtitulo: 'Fototransducción molecular (126 millones de receptores)',
    mecanismo: 'Tejido neuroectodérmico que contiene fotorreceptores. La absorción de un fotón isomeriza el 11-cis-retinal a todo-trans-retinal en la rodopsina, activando la transducina y la fosfodiesterasa, lo que cierra los canales de Na+ e hiperpolariza la membrana celular.',
    input: 'Energía radiante de fotones absorbida por fotopigmentos',
    proceso: 'Cascada bioquímica que reduce cGMP e hiperpolariza el fotorreceptor',
    output: 'Disminución de liberación de glutamato a células bipolares',
    principio: 'L2 Causalidad y Transducción: Conversión directa de una magnitud física en una señal electroquímica codificada.',
    clinica: 'La deficiencia de vitamina A (necesaria para regenerar el 11-cis-retinal) produce ceguera nocturna (hemeralopía), afectando primero a los bastones.',
  },
  {
    id: 'fovea',
    num: 7,
    nombre: 'Fóvea Central y Mácula',
    categoria: 'transductor',
    categoriaLabel: 'Agudeza Visual HD',
    color: '#f59e0b',
    pos: { x: 510, y: 165 },
    foco: { x: 485, y: 230 },
    subtitulo: 'Máxima densidad de conos y visión en color',
    mecanismo: 'Pequeña depresión de 1.5 mm en el eje visual. Las capas internas de la retina son desplazadas lateralmente para que la luz incida directamente en los segmentos externos de los conos. Cada cono foveal sinapta con una sola célula bipolar y ganglionar (relación 1:1, sin convergencia disuasoria).',
    input: 'Imagen focalizada en el punto central de fijación',
    proceso: 'Muestreo de altísima resolución espacial y cromática (conos S, M, L)',
    output: 'Señales ganglionares de máxima agudeza visual para lectura y detalle',
    principio: 'L4 Escala y Emergencia: La alta densidad neuronal foveal hace emerger la visión de alta definición a partir de receptores microscópicos.',
    clinica: 'La degeneración macular asociada a la edad (DMAE) daña la fóvea, destruyendo la visión central y la capacidad de leer o reconocer rostros.',
  },
  {
    id: 'ganglionares',
    num: 8,
    nombre: 'Células Ganglionares y Punto Ciego',
    categoria: 'transductor',
    categoriaLabel: 'Digitalizador Digital',
    color: '#a855f7',
    pos: { x: 505, y: 350 },
    foco: { x: 468, y: 285 },
    subtitulo: 'Conversión a potenciales de acción todo-o-nada',
    mecanismo: 'Última capa de la retina. Reciben inputs de células bipolares y amacrinas procesando campos receptores centro-periferia. Son las primeras células de la vía visual que generan potenciales de acción propagados (frecuencia modulada). Sus axones forman la papila óptica (punto ciego sin fotorreceptores).',
    input: 'Potenciales electrotónicos graduados de células bipolares',
    proceso: 'Codificación por frecuencia de disparo axonal en el cono axónico',
    output: 'Tren de potenciales de acción bioeléctricos hacia el cerebro',
    principio: 'L2 Transformación de Señal: Transición analógica (graduada) a digital (frecuencia de impulsos) para transmisión a larga distancia sin atenuación.',
    clinica: 'En el glaucoma, la presión intraocular elevada comprime y estrangula los axones ganglionares en la papila óptica, causando pérdida de campo visual.',
  },
  {
    id: 'nervio-optico',
    num: 9,
    nombre: 'Nervio Óptico (II Par Craneal)',
    categoria: 'neural',
    categoriaLabel: 'Transmisión Axonal',
    color: '#34d399',
    pos: { x: 590, y: 345 },
    foco: { x: 590, y: 270 },
    subtitulo: 'Haz mielinizado de 1.2 millones de axones',
    mecanismo: 'Tracto del sistema nervioso central (mielinizado por oligodendrocitos y rodeado por meninges). Transporta la información retinotópica a velocidades de 40-60 m/s desde la órbita ocular a través del agujero óptico hacia la fosa craneal media.',
    input: 'Impulsos bioeléctricos de cada cuadrante de la retina',
    proceso: 'Conducción saltatoria de potenciales de acción por nódulos de Ranvier',
    output: 'Llegada de señales aferentes a la cara anterior del quiasma óptico',
    principio: 'L1 Vías de Conducción: Canal de comunicación con redundancia masiva y organización retinotópica topográfica conservada.',
    clinica: 'La neuritis óptica (desmielinización inflamatoria asociada a esclerosis múltiple) frena la velocidad de conducción y causa dolor y visión borrosa.',
  },
  {
    id: 'quiasma',
    num: 10,
    nombre: 'Quiasma Óptico',
    categoria: 'neural',
    categoriaLabel: 'Decusación Binocular',
    color: '#10b981',
    pos: { x: 700, y: 325 },
    foco: { x: 700, y: 245 },
    subtitulo: 'Cruce del 53% de las fibras (hemirretinas nasales)',
    mecanismo: 'Estructura en "X" sobre la silla turca. Las fibras de las hemirretinas nasales (que ven el campo temporal externo) cruzan la línea media, mientras que las hemirretinas temporales permanecen ipsilaterales. Como resultado, cada tracto óptico transporta todo el hemicampo visual contralateral.',
    input: 'Axones de ambos ojos con campos visuales parcialmente superpuestos',
    proceso: 'Decusación selectiva: cruzan solo las fibras de las mitades nasales',
    output: 'Tractos ópticos izquierdo y derecho con información contralateral unificada',
    principio: 'L3 Interdependencia y Emergencia: La segregación binocular es el fundamento que permite al cerebro calcular la disparidad retiniana y la visión 3D (estereopsis).',
    clinica: 'Un adenoma hipofisario (tumor en la glándula pituitaria) comprime el quiasma óptico central, provocando hemianopsia bitemporal (pérdida de la visión lateral de ambos ojos).',
  },
  {
    id: 'talamo',
    num: 11,
    nombre: 'Núcleo Geniculado Lateral (Tálamo)',
    categoria: 'neural',
    categoriaLabel: 'Relé y Modulación',
    color: '#6366f1',
    pos: { x: 810, y: 315 },
    foco: { x: 820, y: 240 },
    subtitulo: 'Estación talámica de 6 capas concéntricas',
    mecanismo: 'Centro de procesamiento subcortical. Las capas 1-2 (magnocelulares) procesan movimiento y contraste grueso; las capas 3-6 (parvocelulares) procesan color y detalle fino. El tálamo no es un simple repetidor: recibe el 80% de sus conexiones de retroalimentación descendente desde la propia corteza visual para modular la atención.',
    input: 'Tracto óptico con axones ganglionares mielinizados',
    proceso: 'Filtrado atencional, segregación magno/parvo y relé sináptico',
    output: 'Radiaciones ópticas de Gratiolet proyectadas hacia el lóbulo occipital',
    principio: 'L6 Bucle de Control Cibernético: Modulación recíproca cortico-talámica que filtra información irrelevante antes de la percepción.',
    clinica: 'Infartos en la arteria coroidea anterior pueden lesionar el NGL, originando cuadrantanopsias contralaterales congruentes.',
  },
  {
    id: 'corteza',
    num: 12,
    nombre: 'Corteza Visual Primaria (V1 / Brodmann 17)',
    categoria: 'neural',
    categoriaLabel: 'Percepción Consciente',
    color: '#ec4899',
    pos: { x: 990, y: 165 },
    foco: { x: 1010, y: 230 },
    subtitulo: 'Lóbulo occipital (Cisura calcarina) y mapa retinotópico',
    mecanismo: 'Área 17 de Brodmann. Contiene neuronas simples y complejas que responden a orientaciones de bordes, movimiento, color y frecuencia espacial. La imagen invertida física de la retina se reconstruye mentalmente de forma erecta. Desde V1 se proyecta hacia la vía dorsal ("¿dónde está?") y la vía ventral ("¿qué es?").',
    input: 'Radiaciones ópticas con información retinotópica desglosada',
    proceso: 'Síntesis neuronal, recombinación binocular y reconstrucción perceptual',
    output: 'Experiencia visual consciente, tridimensional y con significado semántico',
    principio: 'L3 Propiedad Emergente: La experiencia subjetiva de ver colores, formas y profundidad surge de la sincronización de miles de millones de neuronas corticales.',
    clinica: 'La visión ciega (blindsight): lesiones en V1 dejan al paciente ciego consciente, pero puede esquivar obstáculos o adivinar la dirección de estímulos gracias a la vía colículo-superior.',
  },
];

export default function DiagramaConexionesVisuales() {
  const [selectedStationId, setSelectedStationId] = useState('cornea');
  const [activeFilter, setActiveFilter] = useState('todos'); // 'todos', 'optico', 'transductor', 'neural'
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [showRays, setShowRays] = useState(true);
  const simTimerRef = useRef(null);

  // SVG Unique IDs to prevent conflicts
  const uniqueGridId = useId();
  const uniqueGlowId = useId();

  const selectedStation = ESTACIONES_VISUALES.find((s) => s.id === selectedStationId) || ESTACIONES_VISUALES[1];

  // Filtrado de estaciones visibles
  const visibleStations = ESTACIONES_VISUALES.filter((st) => {
    if (activeFilter === 'todos') return true;
    return st.categoria === activeFilter;
  });

  // Simulación del pulso lumínico a través del circuito
  const startSimulation = () => {
    setIsSimulating(true);
    setSimStep(0);
    setSelectedStationId(ESTACIONES_VISUALES[0].id);

    let current = 0;
    if (simTimerRef.current) clearInterval(simTimerRef.current);

    simTimerRef.current = setInterval(() => {
      current += 1;
      if (current < ESTACIONES_VISUALES.length) {
        setSimStep(current);
        setSelectedStationId(ESTACIONES_VISUALES[current].id);
      } else {
        clearInterval(simTimerRef.current);
        simTimerRef.current = null;
        setIsSimulating(false);
      }
    }, 700);
  };

  const stopSimulation = () => {
    if (simTimerRef.current) {
      clearInterval(simTimerRef.current);
      simTimerRef.current = null;
    }
    setIsSimulating(false);
  };

  useEffect(() => {
    return () => {
      if (simTimerRef.current) clearInterval(simTimerRef.current);
    };
  }, []);

  // Navegación por estaciones
  const currentIndex = ESTACIONES_VISUALES.findIndex((s) => s.id === selectedStationId);
  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedStationId(ESTACIONES_VISUALES[currentIndex - 1].id);
    }
  };
  const handleNext = () => {
    if (currentIndex < ESTACIONES_VISUALES.length - 1) {
      setSelectedStationId(ESTACIONES_VISUALES[currentIndex + 1].id);
    }
  };

  return (
    <div
      className="diagrama-conexiones-visuales"
      style={{
        '--inspector-color': selectedStation.color,
      }}
    >
      {/* ── ENCABEZADO Y TÍTULO ── */}
      <div className="dcv-header">
        <div className="dcv-header-left">
          <div className="dcv-badge">
            <span>🔬</span> Circuito Neuro-Óptico Integrado (L1 a L7)
          </div>
          <h3 className="dcv-title">
            <span>👁️</span> Diagrama Esquemático de Conexiones Visuales
          </h3>
          <p className="dcv-subtitle">
            Recorrido sistémico completo desde la captación de fotones en el entorno exterior, la refracción corneal y cristalina, la fototransducción retiniana, hasta la decusación quiasmática y la percepción en la corteza occipital.
          </p>
        </div>
      </div>

      {/* ── BARRA DE HERRAMIENTAS Y FILTROS ── */}
      <div className="dcv-toolbar">
        <div className="dcv-filters" role="tablist" aria-label="Filtro de subsistemas visuales">
          <button
            type="button"
            className={`dcv-filter-btn ${activeFilter === 'todos' ? 'active' : ''}`}
            onClick={() => setActiveFilter('todos')}
          >
            🌐 Toda la Vía (12)
          </button>
          <button
            type="button"
            className={`dcv-filter-btn ${activeFilter === 'optico' ? 'active' : ''}`}
            onClick={() => setActiveFilter('optico')}
          >
            🔍 Óptica y Lentes (5)
          </button>
          <button
            type="button"
            className={`dcv-filter-btn ${activeFilter === 'transductor' ? 'active' : ''}`}
            onClick={() => setActiveFilter('transductor')}
          >
            ⚡ Transducción Retiniana (3)
          </button>
          <button
            type="button"
            className={`dcv-filter-btn ${activeFilter === 'neural' ? 'active' : ''}`}
            onClick={() => setActiveFilter('neural')}
          >
            🧠 Vía Neural & Corteza (4)
          </button>
        </div>

        <div className="dcv-actions">
          <button
            type="button"
            className={`dcv-action-btn ${isSimulating ? 'active-sim' : ''}`}
            onClick={isSimulating ? stopSimulation : startSimulation}
            title="Simula un destello de fotones viajando y activando cada estación en tiempo real"
          >
            <span>{isSimulating ? '⏹️ Pausar Simulación' : '⚡ Simular Pulso Lumínico'}</span>
          </button>

          <button
            type="button"
            className="dcv-filter-btn"
            onClick={() => setShowRays((prev) => !prev)}
            title="Mostrar u ocultar los rayos de luz que convergen en el ojo"
          >
            {showRays ? '👁️ Ocultar Rayos' : '✨ Mostrar Rayos'}
          </button>
        </div>
      </div>

      {/* ── LIENZO SVG VECTORIAL EN PANTALLA COMPLETA (RESPONSIVE VIEWBOX) ── */}
      <div className="dcv-canvas-wrap">
        <svg
          viewBox="0 0 1100 460"
          className="dcv-svg"
          aria-label="Diagrama esquemático vectorial de conexiones visuales desde el ojo a la corteza occipital"
          role="img"
        >
          <defs>
            {/* Cuadrícula técnica sutil */}
            <pattern id={uniqueGridId} width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
            </pattern>

            {/* Gradientes para haces de luz */}
            <linearGradient id="rayGolden" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="rayCyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="rayBlue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.9" />
            </linearGradient>

            {/* Brillo ambiental */}
            <filter id={uniqueGlowId} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Fondo cuadriculado */}
          <rect width="1100" height="460" fill={`url(#${uniqueGridId})`} />

          {/* Áreas de referencia de fondo (Zonas Funcionales) */}
          <g opacity="0.35">
            <rect x="20" y="20" width="480" height="420" rx="12" fill="rgba(56,189,248,0.02)" stroke="rgba(56,189,248,0.15)" strokeDasharray="4 4" />
            <text x="35" y="44" fill="#38bdf8" fontSize="12" fontWeight="700" letterSpacing="0.08em">ZONA 1: ÓPTICA REFRACTIVA Y TRANSDUCCIÓN OCULAR</text>

            <rect x="520" y="20" width="270" height="420" rx="12" fill="rgba(52,211,153,0.02)" stroke="rgba(52,211,153,0.15)" strokeDasharray="4 4" />
            <text x="535" y="44" fill="#34d399" fontSize="12" fontWeight="700" letterSpacing="0.08em">ZONA 2: VÍAS AFERENTES (PAR II & QUIASMA)</text>

            <rect x="810" y="20" width="270" height="420" rx="12" fill="rgba(236,72,153,0.02)" stroke="rgba(236,72,153,0.15)" strokeDasharray="4 4" />
            <text x="825" y="44" fill="#ec4899" fontSize="12" fontWeight="700" letterSpacing="0.08em">ZONA 3: PROCESAMIENTO TALÁMICO Y CORTEZA V1</text>
          </g>

          {/* ── 1. OBJETO Y FUENTE DE LUZ EXTERNA (X: 40 - 100) ── */}
          <g transform="translate(10, 0)">
            {/* Lámpara / Sol emisor */}
            <circle cx="55" cy="190" r="14" fill="#fbbf24" opacity="0.85" filter={`url(#${uniqueGlowId})`} />
            <circle cx="55" cy="190" r="8" fill="#ffffff" />
            {/* Destellos */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <line
                key={angle}
                x1={55 + 16 * Math.cos((angle * Math.PI) / 180)}
                y1={190 + 16 * Math.sin((angle * Math.PI) / 180)}
                x2={55 + 23 * Math.cos((angle * Math.PI) / 180)}
                y2={190 + 23 * Math.sin((angle * Math.PI) / 180)}
                stroke="#fbbf24"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
            ))}

            {/* Objeto físico vertical (Árbol / Flecha real hacia arriba) */}
            <g transform="translate(55, 250)">
              <line x1="0" y1="35" x2="0" y2="-35" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
              <polygon points="0,-45 -9,-30 9,-30" fill="#fbbf24" />
              <circle cx="0" cy="35" r="4" fill="#fbbf24" />
              <text x="0" y="52" fill="#e2e8f0" fontSize="11" fontWeight="700" textAnchor="middle">
                Objeto Real (Erecto)
              </text>
            </g>
          </g>

          {/* ── RAYOS DE LUZ CONVERGENTES Y REFRACCIÓN INVERSA ── */}
          {showRays && (
            <g>
              {/* Rayo superior (amarillo): parte superior del objeto -> córnea -> cruza en cristalino -> retina inferior */}
              <path
                d="M 65,205 L 195,215 L 245,218 L 290,222 L 470,270"
                fill="none"
                stroke="url(#rayGolden)"
                strokeWidth="2.5"
                strokeDasharray="8 4"
                opacity="0.85"
              />
              {/* Rayo central (cyan): eje óptico principal hacia la fóvea central */}
              <path
                d="M 65,250 L 195,230 L 245,230 L 290,230 L 485,230"
                fill="none"
                stroke="url(#rayCyan)"
                strokeWidth="3"
                opacity="0.9"
              />
              {/* Rayo inferior (azul/violeta): base del objeto -> córnea -> cruza en cristalino -> retina superior */}
              <path
                d="M 65,285 L 195,245 L 245,242 L 290,238 L 470,190"
                fill="none"
                stroke="url(#rayBlue)"
                strokeWidth="2.5"
                strokeDasharray="8 4"
                opacity="0.85"
              />

              {/* Indicador de imagen óptica invertida en la retina */}
              <g transform="translate(470, 230)">
                <line x1="0" y1="-25" x2="0" y2="25" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                <polygon points="0,32 -6,22 6,22" fill="#f43f5e" />
                <circle cx="0" cy="-25" r="3" fill="#f43f5e" />
                <text x="-12" y="45" fill="#f43f5e" fontSize="9.5" fontWeight="700" textAnchor="end">
                  Imagen Invertida
                </text>
              </g>
            </g>
          )}

          {/* ── GLOBO OCULAR (CORTE SAGITAL ANATÓMICO X: 160 - 500) ── */}
          <g>
            {/* Esclerótica (cubierta exterior protectora) */}
            <path
              d="M 195,155 C 235,115 390,110 470,155 C 505,190 505,270 470,305 C 390,350 235,345 195,305"
              fill="rgba(30,41,59,0.5)"
              stroke="#64748b"
              strokeWidth="5"
              strokeLinejoin="round"
            />

            {/* Coroides (capa nutricia vascular y oscura) */}
            <path
              d="M 235,145 C 330,135 410,140 460,165 C 485,195 485,265 460,295 C 410,320 330,325 235,315"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="2"
              opacity="0.6"
            />

            {/* Córnea (domo convexa frontal transparente) */}
            <path
              d="M 195,155 C 160,190 160,270 195,305"
              fill="rgba(56,189,248,0.15)"
              stroke="#38bdf8"
              strokeWidth="5"
              strokeLinecap="round"
              filter={`url(#${uniqueGlowId})`}
            />

            {/* Cámara anterior y Humor Acuoso */}
            <path
              d="M 195,155 C 175,190 175,270 195,305 L 245,305 L 245,155 Z"
              fill="rgba(56,189,248,0.06)"
            />

            {/* Iris: Esfínteres superior e inferior (dejan la pupila en el medio) */}
            <path d="M 245,150 L 245,195" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" />
            <path d="M 245,265 L 245,310" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" />

            {/* Músculos ciliares y zónula de Zinn (suspensión del cristalino) */}
            <path d="M 245,150 Q 270,165 290,175" stroke="#818cf8" strokeWidth="2" strokeDasharray="3 2" />
            <path d="M 245,310 Q 270,295 290,285" stroke="#818cf8" strokeWidth="2" strokeDasharray="3 2" />

            {/* Cristalino (lente elástica biconvexa con gradiente óptico) */}
            <path
              d="M 290,180 C 275,205 275,255 290,280 C 305,255 305,205 290,180 Z"
              fill="rgba(129,140,248,0.3)"
              stroke="#818cf8"
              strokeWidth="3.5"
              filter={`url(#${uniqueGlowId})`}
            />

            {/* Cámara Vítrea (volumen interno del ojo) */}
            <path
              d="M 290,180 C 350,150 430,155 465,185 C 480,210 480,250 465,275 C 430,305 350,310 290,280 Z"
              fill="rgba(6,182,212,0.08)"
            />

            {/* Retina (capa transductora neurosensorial con bastones y conos) */}
            <path
              d="M 440,165 C 475,185 488,210 488,230 C 488,250 475,275 440,295"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Fóvea Centralis (pequeña muesca focal de conos en el eje visual) */}
            <circle cx="488" cy="230" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />

            {/* Papila Óptica / Punto Ciego (salida axonal sin receptores) */}
            <circle cx="468" cy="285" r="5" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
          </g>

          {/* ── NERVIO ÓPTICO (X: 470 A 660) ── */}
          <g>
            {/* Vaina dural mielinizada */}
            <path
              d="M 468,285 C 510,295 540,280 660,255"
              fill="none"
              stroke="rgba(52,211,153,0.3)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            {/* Axones ganglionares que transmiten el impulso */}
            <path
              d="M 468,285 C 510,295 540,280 660,255"
              fill="none"
              stroke="#34d399"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 468,285 C 510,295 540,280 660,255"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              opacity="0.8"
            />
          </g>

          {/* ── QUIASMA ÓPTICO (X: 660 - 740) ── */}
          <g>
            {/* Base quiasmática */}
            <rect x="660" y="215" width="80" height="70" rx="8" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.3)" strokeDasharray="3 3" />
            <text x="700" y="210" fill="#10b981" fontSize="10.5" fontWeight="700" textAnchor="middle">
              Decusación Parcial
            </text>

            {/* Fibra temporal (no cruza, azul) */}
            <path d="M 660,235 C 690,230 710,230 740,235" fill="none" stroke="#38bdf8" strokeWidth="3" />
            {/* Fibra nasal (cruza la línea media, roja/coral) */}
            <path d="M 660,265 C 690,265 710,235 740,255" fill="none" stroke="#f43f5e" strokeWidth="3" />
            {/* Cruce simétrico complementario */}
            <path d="M 660,235 C 690,235 710,265 740,265" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          </g>

          {/* ── TRACTOS ÓPTICOS Y NÚCLEO GENICULADO LATERAL (X: 740 - 840) ── */}
          <g>
            {/* Tracto óptico */}
            <path d="M 740,245 C 770,245 790,240 820,240" fill="none" stroke="#6366f1" strokeWidth="6" strokeLinecap="round" />

            {/* Estructura estratificada del NGL (Tálamo) */}
            <g transform="translate(820, 240)">
              <rect x="-15" y="-30" width="30" height="60" rx="6" fill="rgba(99,102,241,0.2)" stroke="#6366f1" strokeWidth="2.5" />
              {/* 6 Láminas celulares del tálamo */}
              {[-20, -12, -4, 4, 12, 20].map((ly, i) => (
                <line key={ly} x1="-10" y1={ly} x2="10" y2={ly} stroke={i < 2 ? '#818cf8' : '#a5b4fc'} strokeWidth="2" />
              ))}
              <text x="0" y="-38" fill="#818cf8" fontSize="10" fontWeight="700" textAnchor="middle">
                Tálamo (NGL)
              </text>
            </g>
          </g>

          {/* ── RADIACIONES ÓPTICAS DE GRATIOLET (X: 840 - 950) ── */}
          <g>
            <path d="M 835,225 C 875,195 915,185 960,180" fill="none" stroke="#c084fc" strokeWidth="3" strokeDasharray="5 3" />
            <path d="M 835,240 C 875,240 915,240 960,240" fill="none" stroke="#c084fc" strokeWidth="3" strokeDasharray="5 3" />
            <path d="M 835,255 C 875,285 915,295 960,300" fill="none" stroke="#c084fc" strokeWidth="3" strokeDasharray="5 3" />
            <text x="895" y="180" fill="#c084fc" fontSize="10" fontWeight="600" textAnchor="middle">
              Radiaciones Ópticas
            </text>
          </g>

          {/* ── CORTEZA VISUAL PRIMARIA V1 Y LÓBULO OCCIPITAL (X: 950 - 1080) ── */}
          <g>
            {/* Silueta del lóbulo occipital */}
            <path
              d="M 950,150 C 990,130 1060,145 1075,210 C 1085,265 1050,325 990,335 C 950,325 940,285 950,245 Z"
              fill="rgba(236,72,153,0.14)"
              stroke="#ec4899"
              strokeWidth="2.5"
            />

            {/* Cisura Calcarina (Corteza V1 / Área 17 de Brodmann) */}
            <path
              d="M 965,240 C 995,240 1025,235 1060,235"
              fill="none"
              stroke="#f472b6"
              strokeWidth="6"
              strokeLinecap="round"
              filter={`url(#${uniqueGlowId})`}
            />

            {/* Imagen reconstruida mentalmente (Flecha erecta en el cerebro) */}
            <g transform="translate(1015, 205)">
              <line x1="0" y1="20" x2="0" y2="-20" stroke="#34d399" strokeWidth="3.5" strokeLinecap="round" />
              <polygon points="0,-27 -6,-17 6,-17" fill="#34d399" />
              <circle cx="0" cy="20" r="3" fill="#34d399" />
              <text x="0" y="-34" fill="#34d399" fontSize="10" fontWeight="700" textAnchor="middle">
                Visión Consciente Erecta
              </text>
            </g>

            <text x="1010" y="315" fill="#f472b6" fontSize="11" fontWeight="700" textAnchor="middle">
              Corteza V1 (Área 17)
            </text>
          </g>

          {/* ── PULSO LUMÍNICO / POTENCIAL DE ACCIÓN ANIMADO ── */}
          {isSimulating && (
            <g>
              {/* Círculo de pulso dinámico en la estación activa */}
              <circle
                cx={selectedStation.foco.x}
                cy={selectedStation.foco.y}
                r="22"
                fill="none"
                stroke={selectedStation.color}
                strokeWidth="3"
                className="dcv-pulse-ring"
              />
              <circle
                cx={selectedStation.foco.x}
                cy={selectedStation.foco.y}
                r="8"
                fill={selectedStation.color}
                filter={`url(#${uniqueGlowId})`}
              />
            </g>
          )}

          {/* ── CHINCHETAS Y NODOS INTERACTIVOS (12 ESTACIONES) ── */}
          {visibleStations.map((station) => {
            const isSelected = station.id === selectedStationId;
            return (
              <g
                key={station.id}
                className={`dcv-node ${isSelected ? 'selected' : ''}`}
                style={{ '--node-color': station.color }}
                onClick={() => setSelectedStationId(station.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedStationId(station.id);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`Estación ${station.num}: ${station.nombre}`}
              >
                {/* Línea conectora entre la chapa del número y el punto anatómico real */}
                <line
                  x1={station.pos.x}
                  y1={station.pos.y}
                  x2={station.foco.x}
                  y2={station.foco.y}
                  stroke={station.color}
                  strokeWidth={isSelected ? '2' : '1'}
                  strokeDasharray={isSelected ? 'none' : '3 2'}
                  opacity={isSelected ? 0.9 : 0.5}
                />

                {/* Punto focal en la estructura */}
                <circle
                  cx={station.foco.x}
                  cy={station.foco.y}
                  r={isSelected ? 6 : 4}
                  fill={station.color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />

                {/* Badge circular con el número */}
                <circle
                  cx={station.pos.x}
                  cy={station.pos.y}
                  r={isSelected ? 16 : 13}
                  className="pin-dot"
                  fill={isSelected ? station.color : '#0f172a'}
                  stroke={station.color}
                  strokeWidth={isSelected ? '3' : '2'}
                  filter={isSelected ? `url(#${uniqueGlowId})` : 'none'}
                />
                <text
                  x={station.pos.x}
                  y={station.pos.y + 4.5}
                  fill={isSelected ? '#0f172a' : '#ffffff'}
                  fontSize={isSelected ? '12' : '10.5'}
                  fontWeight="800"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {station.num}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── PANEL INSPECTOR DE ALTA LEGIBILIDAD (100% ANCHO, SIN RECORTES) ── */}
      <section className="dcv-inspector" aria-live="polite">
        <div className="dcv-inspector-header">
          <div className="dcv-inspector-title-group">
            <span className="dcv-inspector-badge">#{selectedStation.num}</span>
            <h4 className="dcv-inspector-title">{selectedStation.nombre}</h4>
            <span className="dcv-inspector-category">{selectedStation.categoriaLabel}</span>
          </div>

          <div className="dcv-inspector-nav">
            <button
              type="button"
              className="dcv-nav-btn"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              title="Estación anterior"
            >
              ← Anterior
            </button>
            <button
              type="button"
              className="dcv-nav-btn"
              onClick={handleNext}
              disabled={currentIndex === ESTACIONES_VISUALES.length - 1}
              title="Siguiente estación"
            >
              Siguiente →
            </button>
          </div>
        </div>

        {/* Cuadrícula de 3 columnas informativas */}
        <div className="dcv-inspector-grid">
          {/* Bloque 1: Mecanismo */}
          <div className="dcv-card-block">
            <div className="dcv-block-title">
              <span>⚙️</span> Mecanismo Biofísico & Fisiológico
            </div>
            <p className="dcv-block-text">{selectedStation.mecanismo}</p>
          </div>

          {/* Bloque 2: Flujo Causal L2 */}
          <div className="dcv-card-block">
            <div className="dcv-block-title">
              <span>🔄</span> Cadena de Causa y Efecto (Input / Output)
            </div>
            <div className="dcv-io-flow">
              <span className="dcv-io-pill">📥 {selectedStation.input}</span>
              <span className="dcv-io-arrow">&rarr;</span>
              <span className="dcv-io-pill">⚙️ {selectedStation.proceso}</span>
              <span className="dcv-io-arrow">&rarr;</span>
              <span className="dcv-io-pill">📤 {selectedStation.output}</span>
            </div>
          </div>

          {/* Bloque 3: Pensamiento Sistémico */}
          <div className="dcv-card-block">
            <div className="dcv-block-title">
              <span>🌐</span> Enfoque Sistémico Aplicado
            </div>
            <p className="dcv-block-text">{selectedStation.principio}</p>
          </div>
        </div>

        {/* Bloque Destacado: Importancia Médica o Fenómeno Visual */}
        <div className="dcv-clinical-callout">
          <strong>💡 Relevancia Fisiológica & Clínica:</strong> {selectedStation.clinica}
        </div>
      </section>

      {/* ── CUADRÍCULA DE ACCESO RÁPIDO A LAS 12 ESTACIONES ── */}
      <div className="dcv-stations-grid" role="group" aria-label="Selector de estaciones visuales">
        {ESTACIONES_VISUALES.map((st) => {
          const isSelected = st.id === selectedStationId;
          return (
            <button
              key={st.id}
              type="button"
              className={`dcv-station-chip ${isSelected ? 'selected' : ''}`}
              style={{ '--chip-color': st.color }}
              onClick={() => setSelectedStationId(st.id)}
            >
              <span className="dcv-chip-number">{st.num}</span>
              <span className="dcv-chip-name">{st.nombre.replace(/^\d+\.\s*/, '')}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

