import { useState } from 'react';
import './SensoryPuzzle.css';

const SENSES_DATA = [
  {
    id: 'vista',
    name: 'Vista',
    icon: '👁️',
    stimulus: 'Fotones de luz',
    receptor: 'Conos y bastones (Retina)',
    brainArea: 'Lóbulo Occipital (Corteza Visual)',
    color: '#3b82f6',
  },
  {
    id: 'oido',
    name: 'Oído',
    icon: '👂',
    stimulus: 'Vibraciones de ondas sonoras',
    receptor: 'Células ciliadas (Cóclea)',
    brainArea: 'Lóbulo Temporal (Corteza Auditiva)',
    color: '#22c55e',
  },
  {
    id: 'olfato',
    name: 'Olfato',
    icon: '👃',
    stimulus: 'Moléculas odoríferas volátiles',
    receptor: 'Neuronas receptoras olfativas',
    brainArea: 'Bulbo Olfatorio y Sistema Límbico',
    color: '#eab308',
  },
  {
    id: 'gusto',
    name: 'Gusto',
    icon: '👅',
    stimulus: 'Sustancias químicas disueltas',
    receptor: 'Células gustativas (Botones de las papilas)',
    brainArea: 'Corteza Gustativa (Ínsula)',
    color: '#ec4899',
  },
  {
    id: 'tacto',
    name: 'Tacto',
    icon: '🖐️',
    stimulus: 'Presión, vibración y temperatura',
    receptor: 'Mecanorreceptores (Meissner, Pacini, etc.)',
    brainArea: 'Lóbulo Parietal (Corteza Somatosensorial)',
    color: '#f97316',
  },
];

const RECEPTOR_OPTIONS = [
  'Células ciliadas (Cóclea)',
  'Conos y bastones (Retina)',
  'Mecanorreceptores (Meissner, Pacini, etc.)',
  'Células gustativas (Botones de las papilas)',
  'Neuronas receptoras olfativas',
];

const BRAIN_OPTIONS = [
  'Lóbulo Parietal (Corteza Somatosensorial)',
  'Lóbulo Temporal (Corteza Auditiva)',
  'Bulbo Olfatorio y Sistema Límbico',
  'Lóbulo Occipital (Corteza Visual)',
  'Corteza Gustativa (Ínsula)',
];

export default function SensoryPuzzle() {
  const [selections, setSelections] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (senseId, field, value) => {
    setSelections((prev) => ({
      ...prev,
      [senseId]: {
        ...prev[senseId],
        [field]: value,
      },
    }));
  };

  const getScore = () => {
    let correct = 0;
    SENSES_DATA.forEach((s) => {
      const sel = selections[s.id];
      if (sel?.receptor === s.receptor && sel?.brainArea === s.brainArea) {
        correct++;
      }
    });
    return correct;
  };

  const score = getScore();
  const allCompleted = SENSES_DATA.every(
    (s) => selections[s.id]?.receptor && selections[s.id]?.brainArea
  );

  return (
    <div className="sensory-puzzle-container">
      <div className="puzzle-card">
        <h3>🧩 Reto Sistémico: Acoplamiento de Vías Sensoriales</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Para que el macrosistema perceptivo funcione, cada subsistema sensorial debe conectar su
          <strong> receptor biológico</strong> con su <strong>corteza cerebral de destino</strong>. Empareja cada sentido:
        </p>

        <div className="puzzle-grid">
          {SENSES_DATA.map((sense) => {
            const sel = selections[sense.id] || {};
            const isReceptorCorrect = sel.receptor === sense.receptor;
            const isBrainCorrect = sel.brainArea === sense.brainArea;
            const isFullyMatched = isReceptorCorrect && isBrainCorrect;

            return (
              <div
                key={sense.id}
                className={`sense-match-card ${showResults && isFullyMatched ? 'matched' : ''}`}
                style={{ borderTop: `4px solid ${sense.color}` }}
              >
                <div className="sense-badge">
                  <span>{sense.icon}</span>
                  <span>{sense.name}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <strong>Estímulo:</strong> {sense.stimulus}
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                    Receptor biológico:
                  </label>
                  <select
                    className="puzzle-selector"
                    value={sel.receptor || ''}
                    onChange={(e) => handleSelect(sense.id, 'receptor', e.target.value)}
                  >
                    <option value="">-- Seleccionar receptor --</option>
                    {RECEPTOR_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {showResults && (
                    <span style={{ fontSize: '0.8rem', color: isReceptorCorrect ? '#4ade80' : '#f87171' }}>
                      {isReceptorCorrect ? '✓ Correcto' : `✗ Correcto: ${sense.receptor}`}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                    Corteza de procesamiento:
                  </label>
                  <select
                    className="puzzle-selector"
                    value={sel.brainArea || ''}
                    onChange={(e) => handleSelect(sense.id, 'brainArea', e.target.value)}
                  >
                    <option value="">-- Seleccionar área cerebral --</option>
                    {BRAIN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {showResults && (
                    <span style={{ fontSize: '0.8rem', color: isBrainCorrect ? '#4ade80' : '#f87171' }}>
                      {isBrainCorrect ? '✓ Correcto' : `✗ Correcto: ${sense.brainArea}`}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            className="sim-btn active"
            disabled={!allCompleted}
            onClick={() => setShowResults(true)}
            style={{ opacity: allCompleted ? 1 : 0.6 }}
          >
            {showResults ? 'Reevaluar Conexiones' : 'Verificar Acoplamiento 🧠'}
          </button>

          {showResults && (
            <div className={`puzzle-feedback ${score === 5 ? 'success' : 'pending'}`}>
              {score === 5
                ? '🎉 ¡Excelente! Has acoplado perfectamente los 5 subsistemas con sus centros de procesamiento cerebral.'
                : `💡 Tienes ${score} de 5 sentidos correctamente acoplados. Revisa las pistas e inténtalo de nuevo.`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

