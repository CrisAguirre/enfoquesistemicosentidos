import React, { useState } from 'react';
import { BlurText } from '../../reactbits';
import './SystemicAnimations2D.css';

export default function SystemicAnimations2D() {
  const [activeConcept, setActiveConcept] = useState(0);
  const [homeostasisLevel, setHomeostasisLevel] = useState(50); // 0 a 100%
  const [interrupted, setInterrupted] = useState(false);

  const concepts = [
    {
      title: '1. Totalidad e Interconexión',
      subtitle: 'La percepción emerge de la red completa',
      desc: 'Un sistema es cualitativamente superior a la suma de sus componentes. Si se interrumpe la vía aferente entre el receptor y la corteza, la percepción consciente desaparece instantáneamente.',
      icon: '🧩',
    },
    {
      title: '2. Causalidad y Retroalimentación',
      subtitle: 'Bucle cibernético cerrado entre entorno y cerebro',
      desc: 'El flujo no es lineal: los estímulos viajan hacia el encéfalo (vía aferente) y el encéfalo modula de inmediato los órganos efectores (vía eferente) para enfocar la atención o proteger al receptor.',
      icon: '🔄',
    },
    {
      title: '3. Propósito y Homeostasis Sensorial',
      subtitle: 'Regulación dinámica ante fluctuaciones ambientales',
      desc: 'El propósito del sistema sensorial es la supervivencia. Cuando un estímulo se vuelve excesivo, el organismo activa mecanismos de retroalimentación negativa para mantener el equilibrio interno.',
      icon: '🎯',
    },
  ];

  return (
    <div className="systemic-2d-panel glass-card">
      {/* Selector de conceptos */}
      <div className="sys2d-tabs">
        {concepts.map((c, i) => (
          <button
            key={i}
            className={`sys2d-tab-btn ${activeConcept === i ? 'active' : ''}`}
            onClick={() => setActiveConcept(i)}
          >
            <span className="sys2d-tab-icon">{c.icon}</span>
            <span className="sys2d-tab-title">{c.title}</span>
          </button>
        ))}
      </div>

      {/* Contenido interactivo */}
      <div className="sys2d-body">
        <div className="sys2d-header">
          <BlurText
            key={activeConcept}
            text={concepts[activeConcept].title}
            className="sys2d-title"
            style={{ fontSize: '1.35rem', fontWeight: 700, color: '#c084fc', marginBottom: '0.35rem' }}
            delay={30}
          />
          <div className="sys2d-subtitle">{concepts[activeConcept].subtitle}</div>
          <p className="sys2d-desc">{concepts[activeConcept].desc}</p>
        </div>

        {/* ========================================================
            CONCEPTO 0: TOTALIDAD E INTERCONEXIÓN (2D SVG)
            ======================================================== */}
        {activeConcept === 0 && (
          <div className="sys2d-visual-card animate-fade">
            <div className="sys2d-controls-mini">
              <button
                className={`btn ${interrupted ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setInterrupted(!interrupted)}
                style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
              >
                {interrupted ? '✓ Restaurar Conexión Neural' : '✂️ Interrumpir Nervio Óptico'}
              </button>
              <span className="sys2d-tag">
                {interrupted ? '⚠️ Señal interrumpida: Sin percepción' : '✓ Red integrada activa'}
              </span>
            </div>

            <svg viewBox="0 0 540 200" className="sys2d-svg" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="cortexGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>

              {/* Vías aferentes */}
              {/* Ojo -> Corteza */}
              <path
                d="M 100 60 C 200 60, 260 90, 360 95"
                fill="none"
                stroke={interrupted ? '#475569' : '#3b82f6'}
                strokeWidth={interrupted ? 1.5 : 2.5}
                strokeDasharray={interrupted ? '6 6' : 'none'}
                strokeOpacity={interrupted ? 0.4 : 0.8}
              />
              {!interrupted && (
                <circle r="3.5" fill="#3b82f6">
                  <animateMotion path="M 100 60 C 200 60, 260 90, 360 95" dur="1.2s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Oído -> Corteza */}
              <path
                d="M 100 100 C 200 100, 260 100, 360 100"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2.5"
                strokeOpacity="0.8"
              />
              <circle r="3.5" fill="#22c55e">
                <animateMotion path="M 100 100 C 200 100, 260 100, 360 100" dur="1.4s" begin="0.3s" repeatCount="indefinite" />
              </circle>

              {/* Piel -> Corteza */}
              <path
                d="M 100 140 C 200 140, 260 110, 360 105"
                fill="none"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeOpacity="0.8"
              />
              <circle r="3.5" fill="#f97316">
                <animateMotion path="M 100 140 C 200 140, 260 110, 360 105" dur="1.3s" begin="0.6s" repeatCount="indefinite" />
              </circle>

              {/* RECEPTOR 1: OJO 2D */}
              <g transform="translate(60, 60)" opacity={interrupted ? 0.5 : 1}>
                <circle cx="0" cy="0" r="20" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                <circle cx="0" cy="0" r="9" fill="#0284c7" />
                <circle cx="0" cy="0" r="4.5" fill="#090d16" />
                <circle cx="-2" cy="-2" r="1.5" fill="#fff" />
                <text x="0" y="32" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="600">Ojo (Vista)</text>
              </g>

              {/* RECEPTOR 2: OÍDO 2D */}
              <g transform="translate(60, 100)">
                <circle cx="0" cy="0" r="20" fill="#0f172a" stroke="#22c55e" strokeWidth="2" />
                <path d="M -6 -10 C 6 -12, 10 -4, 8 4 C 6 10, -2 12, -4 6" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" />
                <circle cx="-1" cy="4" r="2.5" fill="#22c55e" />
                <text x="0" y="32" textAnchor="middle" fill="#86efac" fontSize="9" fontWeight="600">Oído (Audio)</text>
              </g>

              {/* RECEPTOR 3: PIEL 2D */}
              <g transform="translate(60, 140)">
                <circle cx="0" cy="0" r="20" fill="#0f172a" stroke="#f97316" strokeWidth="2" />
                <rect x="-10" y="-8" width="20" height="5" fill="#fb923c" rx="1" />
                <rect x="-10" y="-2" width="20" height="7" fill="#c2410c" rx="1" />
                <ellipse cx="0" cy="8" rx="6" ry="4" fill="#ea580c" stroke="#fdba74" strokeWidth="0.8" />
                <text x="0" y="32" textAnchor="middle" fill="#fdba74" fontSize="9" fontWeight="600">Piel (Tacto)</text>
              </g>

              {/* CORTEZA CEREBRAL INTEGRADORA 2D */}
              <g transform="translate(420, 100)">
                <circle cx="0" cy="0" r="46" fill="rgba(168,85,247,0.12)" stroke="#a855f7" strokeWidth="1.5" />
                {/* Silueta de cerebro */}
                <path
                  d="M 0 -28 C -18 -28, -30 -16, -30 2 C -30 18, -14 28, 0 28 C 14 28, 30 18, 30 2 C 30 -16, 18 -28, 0 -28 Z"
                  fill="url(#cortexGrad)"
                  stroke="#f3e8ff"
                  strokeWidth="1.5"
                />
                <path d="M 0 -24 L 0 24" fill="none" stroke="#f3e8ff" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.6" />
                <path d="M -16 -8 C -8 -10, 0 -4, 0 -4 C 0 -4, 8 -10, 16 -8" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.7" />
                <path d="M -18 8 C -8 6, 0 12, 0 12 C 0 12, 8 6, 18 8" fill="none" stroke="#fff" strokeWidth="1.2" opacity="0.7" />

                {/* Percepción emergente resultante */}
                <g transform="translate(0, 0)">
                  <circle cx="0" cy="0" r={interrupted ? 8 : 12} fill="#ffffff" opacity={interrupted ? 0.3 : 0.85}>
                    {!interrupted && <animate attributeName="r" values="10;14;10" dur="2s" repeatCount="indefinite" />}
                  </circle>
                  <text x="0" y="3" textAnchor="middle" fill="#581c87" fontSize="8" fontWeight="bold">
                    {interrupted ? 'Parcial' : 'Sinergia'}
                  </text>
                </g>
                <text x="0" y="44" textAnchor="middle" fill="#c084fc" fontSize="9.5" fontWeight="bold">Corteza Integrada</text>
              </g>
            </svg>

            <div className="sys2d-caption">
              {interrupted ? (
                <span style={{ color: '#f87171' }}>
                  ⚠️ Al cortar el nervio óptico, el ojo recibe fotones pero el cerebro no construye la imagen visual. La visión emerge de la totalidad interconectada.
                </span>
              ) : (
                <span>
                  ✓ Los tres flujos sensoriales dispares (luz, vibración y presión) se fusionan en el encéfalo en una sola experiencia sensorial coherente.
                </span>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            CONCEPTO 1: CAUSALIDAD Y RETROALIMENTACIÓN (2D SVG)
            ======================================================== */}
        {activeConcept === 1 && (
          <div className="sys2d-visual-card animate-fade">
            <svg viewBox="0 0 540 210" className="sys2d-svg" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="feedbackGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>

              {/* Bucle cerrado de retroalimentación en elipse */}
              <ellipse
                cx="270"
                cy="105"
                rx="180"
                ry="65"
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="2"
              />

              {/* Vía Superior Aferente (Sentido horario) */}
              <path
                d="M 120 105 C 120 45, 420 45, 420 105"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              {/* Vía Inferior Eferente (Retroalimentación) */}
              <path
                d="M 420 105 C 420 165, 120 165, 120 105"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
              />

              {/* Pulso viajando en el bucle cerrado */}
              <circle r="4" fill="#38bdf8">
                <animateMotion
                  path="M 120 105 C 120 45, 420 45, 420 105 C 420 165, 120 165, 120 105"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>
              <circle r="3" fill="#ffffff" opacity="0.9">
                <animateMotion
                  path="M 120 105 C 120 45, 420 45, 420 105 C 420 165, 120 105"
                  dur="3s"
                  begin="1.5s"
                  repeatCount="indefinite"
                />
              </circle>

              {/* NODO 1 (Izquierda): Receptor Transductor */}
              <g transform="translate(110, 105)">
                <circle cx="0" cy="0" r="28" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                {/* Ojo/Receptor */}
                <circle cx="0" cy="0" r="14" fill="#0284c7" />
                <circle cx="0" cy="0" r="6" fill="#090d16" />
                <circle cx="-3" cy="-3" r="2" fill="#fff" />
                <text x="0" y="-35" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">1. Receptor</text>
                <text x="0" y="42" textAnchor="middle" fill="var(--text-muted)" fontSize="8.5">Transducción</text>
              </g>

              {/* NODO 2 (Arriba Centro): Vía Aferente */}
              <g transform="translate(270, 40)">
                <rect x="-65" y="-14" width="130" height="24" rx="12" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                <text x="0" y="2" textAnchor="middle" fill="#7dd3fc" fontSize="9" fontWeight="600">⚡ Vía Aferente (Sensorial)</text>
              </g>

              {/* NODO 3 (Derecha): Centro Coordinador (Cerebro) */}
              <g transform="translate(430, 105)">
                <circle cx="0" cy="0" r="28" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
                {/* Icono de cerebro */}
                <path
                  d="M -12 -8 C -18 -8, -18 6, -10 12 C 0 16, 10 12, 10 0 C 10 -8, 2 -8, -12 -8 Z"
                  fill="#9333ea"
                  stroke="#f3e8ff"
                  strokeWidth="1"
                />
                <circle cx="0" cy="0" r="4" fill="#ffffff" />
                <text x="0" y="-35" textAnchor="middle" fill="#c084fc" fontSize="10" fontWeight="bold">2. Cerebro</text>
                <text x="0" y="42" textAnchor="middle" fill="var(--text-muted)" fontSize="8.5">Integración</text>
              </g>

              {/* NODO 4 (Abajo Centro): Vía Eferente (Retroalimentación) */}
              <g transform="translate(270, 170)">
                <rect x="-75" y="-14" width="150" height="24" rx="12" fill="#0f172a" stroke="#a855f7" strokeWidth="1" />
                <text x="0" y="2" textAnchor="middle" fill="#d8b4fe" fontSize="9" fontWeight="600">🔄 Retroalimentación Eferente</text>
              </g>
            </svg>

            <div className="sys2d-caption">
              <span>
                El estímulo ambiental viaja hacia el centro coordinador, el cual retroalimenta los músculos oculares o el enfoque atencional, cerrando el bucle cibernético.
              </span>
            </div>
          </div>
        )}

        {/* ========================================================
            CONCEPTO 2: HOMEOSTASIS Y REGULACIÓN SENSORIAL (2D SVG)
            ======================================================== */}
        {activeConcept === 2 && (
          <div className="sys2d-visual-card animate-fade">
            <div className="sys2d-slider-wrap">
              <label htmlFor="homeo-slider" className="sys2d-slider-label">
                <span>☀️ Intensidad del Estímulo (Luz / Ruido / Presión):</span>
                <span style={{ color: homeostasisLevel > 75 ? '#ef4444' : '#38bdf8', fontWeight: 'bold' }}>
                  {homeostasisLevel}%
                </span>
              </label>
              <input
                id="homeo-slider"
                type="range"
                min="0"
                max="100"
                value={homeostasisLevel}
                onChange={(e) => setHomeostasisLevel(Number(e.target.value))}
                className="sys2d-slider"
              />
            </div>

            <svg viewBox="0 0 540 180" className="sys2d-svg" xmlns="http://www.w3.org/2000/svg">
              {/* 1. Gráfico del estímulo entrante */}
              <g transform="translate(80, 80)">
                <circle cx="0" cy="0" r="32" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                <circle cx="0" cy="0" r={(homeostasisLevel / 100) * 24 + 4} fill="#38bdf8" opacity="0.3" />
                <text x="0" y="4" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="bold">
                  {homeostasisLevel}%
                </text>
                <text x="0" y="48" textAnchor="middle" fill="var(--text-muted)" fontSize="9">Flujo Entrante</text>
              </g>

              {/* Flecha de retroalimentación compensatoria */}
              <g transform="translate(170, 80)">
                <path d="M 0 0 L 70 0" stroke="#64748b" strokeWidth="2" strokeDasharray="3 3" />
                <polygon points="70,-4 78,0 70,4" fill="#64748b" />
                <text x="35" y="-10" textAnchor="middle" fill="#94a3b8" fontSize="8.5">Adaptación</text>
              </g>

              {/* 2. Órgano efector con apertura homeostática (Pupila / Atenuador) */}
              <g transform="translate(290, 80)">
                <circle cx="0" cy="0" r="36" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
                <circle cx="0" cy="0" r="26" fill="#0284c7" />
                {/* Pupila compensatoria: a mayor luz, MENOR tamaño de apertura */}
                <circle
                  cx="0"
                  cy="0"
                  r={Math.max(4, 20 - (homeostasisLevel / 100) * 14)}
                  fill="#090d16"
                  stroke="#38bdf8"
                  strokeWidth="1"
                />
                <circle cx="-3" cy="-3" r="2" fill="#fff" opacity="0.8" />
                <text x="0" y="52" textAnchor="middle" fill="#c084fc" fontSize="9">
                  {homeostasisLevel > 70 ? 'Miosis (Cierre)' : homeostasisLevel < 30 ? 'Midriasis (Apertura)' : 'Apertura Normal'}
                </text>
              </g>

              {/* Flecha hacia la zona de equilibrio */}
              <g transform="translate(380, 80)">
                <path d="M 0 0 L 50 0" stroke="#22c55e" strokeWidth="2" />
                <polygon points="50,-4 58,0 50,4" fill="#22c55e" />
              </g>

              {/* 3. Indicador de Homeostasis alcanzada */}
              <g transform="translate(480, 80)">
                <circle cx="0" cy="0" r="30" fill="rgba(34,197,94,0.15)" stroke="#22c55e" strokeWidth="2" />
                <text x="0" y="-4" textAnchor="middle" fill="#4ade80" fontSize="16">✓</text>
                <text x="0" y="12" textAnchor="middle" fill="#4ade80" fontSize="8.5" fontWeight="bold">Estable</text>
                <text x="0" y="48" textAnchor="middle" fill="#86efac" fontSize="9">Homeostasis</text>
              </g>
            </svg>

            <div className="sys2d-caption">
              <span>
                {homeostasisLevel > 70 ? (
                  'El sistema detecta sobrecarga de energía y responde cerrando el receptor para proteger las células neuronales del daño tisular.'
                ) : homeostasisLevel < 30 ? (
                  'El sistema detecta baja energía y amplifica la sensibilidad abriendo el receptor al máximo para no perder señales del entorno.'
                ) : (
                  'El sistema equilibra de forma continua la entrada de estímulos para mantener la percepción dentro de un rango funcional óptimo.'
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

