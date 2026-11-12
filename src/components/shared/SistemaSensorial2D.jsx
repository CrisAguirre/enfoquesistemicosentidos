import React, { useState } from 'react';
import './SistemaSensorial2D.css';

const ORGANS = [
  {
    id: 'vista',
    name: 'Ojo (Vista)',
    lobe: 'Lóbulo Occipital',
    color: '#3b82f6',
    receptor: 'Conos y Bastones',
    stimulus: 'Fotones (380-700 nm)',
    pos: { x: 80, y: 70 },
    cortexPos: { x: 235, y: 155 },
    path: 'M 95 85 C 130 90, 180 130, 235 155',
  },
  {
    id: 'oido',
    name: 'Oído (Audición)',
    lobe: 'Lóbulo Temporal',
    color: '#22c55e',
    receptor: 'Células Ciliadas (Cóclea)',
    stimulus: 'Ondas Sonoras (20-20.000 Hz)',
    pos: { x: 420, y: 70 },
    cortexPos: { x: 280, y: 160 },
    path: 'M 405 85 C 370 90, 320 130, 280 160',
  },
  {
    id: 'olfato',
    name: 'Nariz (Olfato)',
    lobe: 'Bulbo Olfatorio y Sistema Límbico',
    color: '#eab308',
    receptor: 'Epitelio Olfatorio',
    stimulus: 'Moléculas Volátiles',
    pos: { x: 50, y: 220 },
    cortexPos: { x: 225, y: 185 },
    path: 'M 75 220 C 120 220, 170 200, 225 185',
  },
  {
    id: 'gusto',
    name: 'Lengua (Gusto)',
    lobe: 'Corteza Gustativa (Ínsula)',
    color: '#ec4899',
    receptor: 'Botones Gustativos',
    stimulus: 'Moléculas Disueltas',
    pos: { x: 450, y: 220 },
    cortexPos: { x: 275, y: 185 },
    path: 'M 425 220 C 380 220, 330 200, 275 185',
  },
  {
    id: 'tacto',
    name: 'Piel (Tacto)',
    lobe: 'Lóbulo Parietal (Somatosensorial)',
    color: '#f97316',
    receptor: 'Mecanorreceptores',
    stimulus: 'Presión y Temperatura',
    pos: { x: 250, y: 310 },
    cortexPos: { x: 250, y: 200 },
    path: 'M 250 295 C 250 260, 250 230, 250 200',
  },
];

export default function SistemaSensorial2D() {
  const [selectedOrgan, setSelectedOrgan] = useState('vista');
  const [isolatedId, setIsolatedId] = useState(null); // ID del órgano aislado
  const [stimulating, setStimulating] = useState(false);

  const activeOrgan = ORGANS.find((o) => o.id === selectedOrgan) || ORGANS[0];
  const isIsolated = isolatedId === activeOrgan.id;

  const triggerStimulus = () => {
    setStimulating(true);
    setTimeout(() => setStimulating(false), 1600);
  };

  const toggleIsolation = (id) => {
    setIsolatedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="sistema-sensorial-2d glass-card">
      <div className="ss2d-header">
        <div className="ss2d-badge">Modelo Sistémico 2D Interactivo</div>
        <h4>El Cerebro como Eje Integrador y los 5 Sentidos como Subsistemas Aferentes</h4>
        <p className="ss2d-desc">
          Un sistema no es un conglomerado de piezas sueltas: <strong>la percepción emerge de las interconexiones</strong>.
          Explora los órganos, envía estímulos bioeléctricos o aísla un receptor para comprobar el principio de sinergia.
        </p>
      </div>

      {/* Controles interactivos */}
      <div className="ss2d-controls">
        <div className="ss2d-organ-buttons">
          {ORGANS.map((organ) => {
            const isThisIsolated = isolatedId === organ.id;
            const isCurrent = selectedOrgan === organ.id;
            return (
              <button
                key={organ.id}
                className={`ss2d-btn ${isCurrent ? 'active' : ''} ${isThisIsolated ? 'isolated' : ''}`}
                onClick={() => setSelectedOrgan(organ.id)}
                style={{
                  borderColor: isCurrent ? organ.color : 'rgba(255,255,255,0.12)',
                  color: isCurrent ? organ.color : 'var(--text-secondary)',
                }}
              >
                <span className="dot" style={{ background: organ.color }} />
                <span>{organ.name}</span>
                {isThisIsolated && <span className="iso-tag">Aislado</span>}
              </button>
            );
          })}
        </div>

        <div className="ss2d-action-row">
          <button
            className={`btn btn-primary ss2d-stim-btn ${stimulating ? 'pulse' : ''}`}
            onClick={triggerStimulus}
            disabled={isIsolated}
            title={isIsolated ? 'El órgano está aislado: no puede enviar señales' : 'Emitir tren de potenciales de acción'}
          >
            ⚡ {stimulating ? 'Transmitiendo Potenciales...' : `Estimular ${activeOrgan.name}`}
          </button>

          <button
            className={`btn btn-outline ss2d-iso-btn ${isIsolated ? 'active-iso' : ''}`}
            onClick={() => toggleIsolation(activeOrgan.id)}
          >
            {isIsolated ? `✓ Reconectar ${activeOrgan.name} al Cerebro` : `✂️ Aislar ${activeOrgan.name} (Prueba Sistémica)`}
          </button>
        </div>
      </div>

      {/* Canvas SVG 2D */}
      <div className="ss2d-canvas-wrap">
        <svg viewBox="0 0 500 360" className="ss2d-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* Gradiente del cerebro */}
            <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b0764" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="brainBodyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="50%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>

            {/* Gradientes por sentido */}
            <linearGradient id="eyeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
            <linearGradient id="earGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>
            <linearGradient id="noseGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#713f12" />
            </linearGradient>
            <linearGradient id="tongueGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#831843" />
            </linearGradient>
            <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#7c2d12" />
            </linearGradient>

            {/* Filtro de sombra suave */}
            <filter id="shadowGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Halo central del cerebro */}
          <circle cx="250" cy="170" r="100" fill="url(#brainGlow)" />

          {/* VÍAS NEURALES Y PULSOS EN MOVIMIENTO */}
          {ORGANS.map((organ) => {
            const isThisIsolated = isolatedId === organ.id;
            const isThisSelected = selectedOrgan === organ.id;

            return (
              <g key={`path-${organ.id}`}>
                {/* Vía neural base */}
                <path
                  d={organ.path}
                  fill="none"
                  stroke={isThisIsolated ? '#475569' : organ.color}
                  strokeWidth={isThisSelected ? 3 : 2}
                  strokeDasharray={isThisIsolated ? '5 5' : 'none'}
                  strokeOpacity={isThisIsolated ? 0.35 : isThisSelected ? 0.95 : 0.5}
                  strokeLinecap="round"
                />

                {/* Si no está aislado, muestra impulsos bioeléctricos viajando */}
                {!isThisIsolated && (
                  <circle r={isThisSelected || stimulating ? 3.5 : 2.5} fill={organ.color}>
                    <animateMotion
                      path={organ.path}
                      dur={isThisSelected && stimulating ? '0.7s' : isThisSelected ? '1.4s' : '2.4s'}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Segundo pulso desfasado para el órgano seleccionado */}
                {!isThisIsolated && isThisSelected && (
                  <circle r="2.8" fill="#ffffff" opacity="0.9">
                    <animateMotion
                      path={organ.path}
                      dur={stimulating ? '0.7s' : '1.4s'}
                      begin="0.35s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* CEREBRO CENTRAL 2D */}
          <g transform="translate(250, 170)" filter="url(#shadowGlow)">
            {/* Masa cerebral */}
            <path
              d="M 0 -45 
                 C -25 -45, -45 -30, -50 -10 
                 C -55 5, -50 25, -40 38 
                 C -30 50, -15 55, 0 55 
                 C 15 55, 30 50, 40 38 
                 C 50 25, 55 5, 50 -10 
                 C 45 -30, 25 -45, 0 -45 Z"
              fill="url(#brainBodyGrad)"
              stroke="#e9d5ff"
              strokeWidth="2"
            />
            {/* Surco central y circunvoluciones */}
            <path d="M 0 -40 L 0 50" fill="none" stroke="#f3e8ff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
            <path d="M -30 -15 C -20 -18, -10 -10, 0 -10 C 10 -10, 20 -18, 30 -15" fill="none" stroke="#f3e8ff" strokeWidth="1.5" opacity="0.6" />
            <path d="M -35 10 C -22 8, -12 18, 0 16 C 12 18, 22 8, 35 10" fill="none" stroke="#f3e8ff" strokeWidth="1.5" opacity="0.6" />
            <path d="M -25 32 C -15 28, -5 36, 0 34 C 5 36, 15 28, 25 32" fill="none" stroke="#f3e8ff" strokeWidth="1.5" opacity="0.6" />

            {/* Núcleo de integración / Tálamo */}
            <circle cx="0" cy="5" r="10" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" opacity="0.9" />
            <text x="0" y="8" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">Tálamo</text>

            {/* Etiqueta del cerebro */}
            <rect x="-42" y="-62" width="84" height="18" rx="9" fill="#0f172a" stroke="#a855f7" strokeWidth="1" />
            <text x="0" y="-50" textAnchor="middle" fill="#c084fc" fontSize="9.5" fontWeight="bold">CEREBRO (Eje)</text>
          </g>

          {/* ========================================================
              GRÁFICOS 2D DE LOS 5 ÓRGANOS SENSORIALES
              ======================================================== */}

          {/* 1. OJO / RETINA (Vista) */}
          <g
            transform="translate(80, 70)"
            className={`ss2d-organ-group ${selectedOrgan === 'vista' ? 'selected' : ''} ${isolatedId === 'vista' ? 'isolated-organ' : ''}`}
            onClick={() => setSelectedOrgan('vista')}
            filter="url(#shadowGlow)"
          >
            {/* Contorno del globo ocular */}
            <circle cx="0" cy="0" r="26" fill="#0f172a" stroke={isolatedId === 'vista' ? '#64748b' : '#3b82f6'} strokeWidth="2" />
            {/* Esclerótica y Córnea */}
            <path d="M -18 0 C -18 -15, 18 -15, 18 0 C 18 15, -18 15, -18 0 Z" fill="#f8fafc" />
            {/* Iris */}
            <circle cx="0" cy="0" r="11" fill="url(#eyeGrad)" stroke="#38bdf8" strokeWidth="1" />
            {/* Pupila */}
            <circle cx="0" cy="0" r={stimulating && selectedOrgan === 'vista' ? 4 : 5.5} fill="#090d16" />
            {/* Brillo corneal */}
            <circle cx="-3" cy="-3" r="2" fill="#ffffff" opacity="0.85" />
            {/* Rayo de luz incidente */}
            {!isolatedId && (
              <path d="M -40 -12 L -20 0 L -40 12" fill="none" stroke="#60a5fa" strokeWidth="1.2" opacity="0.75" />
            )}
            <text x="0" y="38" textAnchor="middle" fill="#93c5fd" fontSize="10" fontWeight="bold">Ojo (Vista)</text>
          </g>

          {/* 2. OÍDO / CÓCLEA (Audición) */}
          <g
            transform="translate(420, 70)"
            className={`ss2d-organ-group ${selectedOrgan === 'oido' ? 'selected' : ''} ${isolatedId === 'oido' ? 'isolated-organ' : ''}`}
            onClick={() => setSelectedOrgan('oido')}
            filter="url(#shadowGlow)"
          >
            {/* Base circular */}
            <circle cx="0" cy="0" r="26" fill="#0f172a" stroke={isolatedId === 'oido' ? '#64748b' : '#22c55e'} strokeWidth="2" />
            {/* Pabellón auricular estilizado */}
            <path
              d="M -8 -16 C 8 -18, 16 -8, 14 4 C 12 14, 4 18, -4 18 C -10 18, -12 12, -8 6 C -4 0, 4 4, 6 -4 C 8 -10, 0 -12, -8 -10"
              fill="none"
              stroke="#4ade80"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Cóclea / Caracol */}
            <circle cx="-3" cy="4" r="5" fill="none" stroke="#22c55e" strokeWidth="2" />
            <circle cx="-3" cy="4" r="2" fill="#22c55e" />
            {/* Ondas sonoras incidentes */}
            {!isolatedId && (
              <>
                <path d="M 24 -10 C 29 -5, 29 5, 24 10" fill="none" stroke="#4ade80" strokeWidth="1.5" opacity="0.8" />
                <path d="M 30 -16 C 37 -8, 37 8, 30 16" fill="none" stroke="#4ade80" strokeWidth="1.2" opacity="0.5" />
              </>
            )}
            <text x="0" y="38" textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="bold">Oído (Audio)</text>
          </g>

          {/* 3. NARIZ / EPITELIO OLFATORIO (Olfato) */}
          <g
            transform="translate(50, 220)"
            className={`ss2d-organ-group ${selectedOrgan === 'olfato' ? 'selected' : ''} ${isolatedId === 'olfato' ? 'isolated-organ' : ''}`}
            onClick={() => setSelectedOrgan('olfato')}
            filter="url(#shadowGlow)"
          >
            <circle cx="0" cy="0" r="26" fill="#0f172a" stroke={isolatedId === 'olfato' ? '#64748b' : '#eab308'} strokeWidth="2" />
            {/* Silueta de perfil nasal */}
            <path
              d="M -10 -16 L -2 -4 C 2 4, 12 10, 8 14 C 4 18, -6 16, -10 10"
              fill="none"
              stroke="#facc15"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Narina y fosa */}
            <ellipse cx="0" cy="12" rx="4" ry="2.5" fill="#713f12" />
            {/* Partículas de aroma volátil */}
            {!isolatedId && (
              <>
                <circle cx="-18" cy="-4" r="2" fill="#fde047" opacity="0.8" />
                <circle cx="-24" cy="4" r="2.5" fill="#facc15" opacity="0.7" />
                <circle cx="-16" cy="12" r="1.8" fill="#eab308" opacity="0.9" />
              </>
            )}
            <text x="0" y="38" textAnchor="middle" fill="#fde047" fontSize="10" fontWeight="bold">Nariz (Olfato)</text>
          </g>

          {/* 4. LENGUA / BOTÓN GUSTATIVO (Gusto) */}
          <g
            transform="translate(450, 220)"
            className={`ss2d-organ-group ${selectedOrgan === 'gusto' ? 'selected' : ''} ${isolatedId === 'gusto' ? 'isolated-organ' : ''}`}
            onClick={() => setSelectedOrgan('gusto')}
            filter="url(#shadowGlow)"
          >
            <circle cx="0" cy="0" r="26" fill="#0f172a" stroke={isolatedId === 'gusto' ? '#64748b' : '#ec4899'} strokeWidth="2" />
            {/* Contorno de lengua con papilas */}
            <path
              d="M -14 -8 C -14 -16, 14 -16, 14 -8 C 14 10, 8 18, 0 20 C -8 18, -14 10, -14 -8 Z"
              fill="url(#tongueGrad)"
              stroke="#f472b6"
              strokeWidth="1.5"
            />
            {/* Surco central de la lengua */}
            <path d="M 0 -8 L 0 14" fill="none" stroke="#be185d" strokeWidth="1.5" opacity="0.6" />
            {/* Puntos de papilas gustativas */}
            <circle cx="-6" cy="-4" r="1.5" fill="#fbcfe8" />
            <circle cx="6" cy="-4" r="1.5" fill="#fbcfe8" />
            <circle cx="-4" cy="6" r="1.5" fill="#fbcfe8" />
            <circle cx="4" cy="6" r="1.5" fill="#fbcfe8" />
            <text x="0" y="38" textAnchor="middle" fill="#f472b6" fontSize="10" fontWeight="bold">Lengua (Gusto)</text>
          </g>

          {/* 5. PIEL / CORPÚSCULO (Tacto) */}
          <g
            transform="translate(250, 310)"
            className={`ss2d-organ-group ${selectedOrgan === 'tacto' ? 'selected' : ''} ${isolatedId === 'tacto' ? 'isolated-organ' : ''}`}
            onClick={() => setSelectedOrgan('tacto')}
            filter="url(#shadowGlow)"
          >
            <circle cx="0" cy="0" r="26" fill="#0f172a" stroke={isolatedId === 'tacto' ? '#64748b' : '#f97316'} strokeWidth="2" />
            {/* Capas dérmicas */}
            <rect x="-16" y="-12" width="32" height="6" rx="2" fill="#fb923c" />
            <rect x="-16" y="-4" width="32" height="10" rx="2" fill="#c2410c" />
            {/* Corpúsculo laminar tipo Pacini */}
            <ellipse cx="0" cy="10" rx="9" ry="6" fill="#ea580c" stroke="#fdba74" strokeWidth="1" />
            <ellipse cx="0" cy="10" rx="5" ry="3.5" fill="#7c2d12" stroke="#fdba74" strokeWidth="1" />
            <circle cx="0" cy="10" r="1.5" fill="#ffffff" />
            {/* Flecha de presión incidente */}
            {!isolatedId && (
              <path d="M 0 -22 L 0 -14 M -4 -17 L 0 -13 L 4 -17" fill="none" stroke="#fdba74" strokeWidth="1.8" />
            )}
            <text x="0" y="38" textAnchor="middle" fill="#fb923c" fontSize="10" fontWeight="bold">Piel (Tacto)</text>
          </g>
        </svg>
      </div>

      {/* Explicación pedagógica de la emergencia sistémica */}
      <div className={`ss2d-feedback-box ${isIsolated ? 'alert' : 'success'}`}>
        {isIsolated ? (
          <div>
            <div className="feedback-title">
              ⚠️ Experimento de Aislamiento: <strong>{activeOrgan.name} desconectado del sistema</strong>
            </div>
            <p>
              Observa qué ocurre: el receptor sigue existiendo físicamente, pero <strong>no genera percepción</strong>.
              El ojo aislado no "ve", el oído sobre una mesa no "escucha". Las funciones de los sentidos
              son <strong>propiedades emergentes</strong>: surgen únicamente cuando los transductores periféricos
              y la corteza cerebral interactúan como una totalidad integrada.
            </p>
          </div>
        ) : (
          <div>
            <div className="feedback-title">
              🔗 Interconexión Activa: <strong>{activeOrgan.name} ➔ {activeOrgan.lobe}</strong>
            </div>
            <div className="feedback-details">
              <span><strong>Estímulo ambiental:</strong> {activeOrgan.stimulus}</span>
              <span><strong>Transductor:</strong> {activeOrgan.receptor}</span>
              <span><strong>Destino cortical:</strong> {activeOrgan.lobe}</span>
            </div>
            <p className="feedback-synergy">
              El receptor convierte energía ambiental en impulsos bioeléctricos (potenciales de acción);
              el cerebro los compara con memorias previas y genera la experiencia consciente de la realidad.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
