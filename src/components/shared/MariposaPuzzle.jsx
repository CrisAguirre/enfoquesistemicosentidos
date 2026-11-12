import { useEffect, useMemo, useRef, useState } from 'react';
import { evidenciaApi } from '../../api/evidencia';
import './MariposaPuzzle.css';

// Ejercicio de la mariposa — adaptado de "Introducción al pensamiento sistémico"
// (Juan Carlos Osorio Gómez, Universidad del Valle, 2007, págs. 11–16).
// Una cuadrícula de 60 piezas muestra la misma imagen en dos estados:
// desordenada (conglomerado, sin sinergia) y ordenada (sistema, con sinergia).

const COLS = 10;
const ROWS = 6;
const TOTAL = COLS * ROWS;
const IMG = '/assets/images/mariposa-portada.jpg';
const TITULO_EVIDENCIA = 'Actividad Mariposas: Laboratorio de Introducción';

// Piezas que se extraen en cada fase del experimento
const CONGLOM_QUEUE = [7, 52, 31]; // cualesquiera: en el conglomerado da igual
const SYSTEM_QUEUE = [34, 44, 42, 47, 24]; // cuerpo y ocelos: destruyen la mariposa

// Barajada determinista: todos los estudiantes ven el mismo desorden
function seededShuffle(n, seed) {
  let s = seed;
  const rand = () => {
    s |= 0; s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function MariposaPuzzle() {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState('conglomerado'); // 'conglomerado' | 'sistema'
  const [removed, setRemoved] = useState(() => new Set());
  const [reflexion, setReflexion] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const panelRef = useRef(null);

  const shuffled = useMemo(() => seededShuffle(TOTAL, 20080411), []);
  const cellOf = (piece) => (mode === 'sistema' ? piece : shuffled[piece]);

  useEffect(() => {
    (async () => {
      try {
        const res = await evidenciaApi.listMine();
        const prev = (res.data || []).find((e) => e.titulo === TITULO_EVIDENCIA);
        if (prev) {
          setReflexion(prev.contenido);
          setIsSaved(true);
        }
      } catch (error) {
        console.error('Error al cargar evidencia previa:', error);
      }
    })();
  }, []);

  const goStep = (n) => {
    setStep(n);
    setMessage('');
    setTimeout(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };

  const removeConglomPieces = () => {
    setRemoved((prev) => new Set([...prev, ...CONGLOM_QUEUE]));
    goStep(2);
  };

  const orderPieces = () => {
    setMode('sistema');
    goStep(3);
  };

  const removeSystemPieces = () => {
    setRemoved((prev) => new Set([...prev, ...SYSTEM_QUEUE]));
    goStep(4);
  };

  const restorePieces = () => setRemoved(new Set());

  const saveReflexion = async () => {
    if (isSaved || !reflexion.trim()) return;
    setLoading(true);
    setMessage('');
    try {
      await evidenciaApi.create({ titulo: TITULO_EVIDENCIA, contenido: reflexion, tipoArchivo: 'texto' });
      setIsSaved(true);
      setMessage('Reflexión guardada con éxito en la sección de evidencias.');
    } catch (error) {
      console.error(error);
      setMessage('Error al guardar la reflexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mp-container">
      {/* Tablero del rompecabezas */}
      <div className="mp-board-panel" ref={panelRef}>
        <div className={`mp-mode-badge ${mode}`}>
          {mode === 'sistema' ? '🦋 Sistema (piezas organizadas)' : '🔀 Conglomerado (piezas desordenadas)'}
        </div>
        <div className="mp-board" role="img" aria-label="Rompecabezas de una mariposa dividido en sesenta piezas">
          {Array.from({ length: TOTAL }, (_, piece) => {
            const cell = cellOf(piece);
            const cellCol = cell % COLS;
            const cellRow = Math.floor(cell / COLS);
            const pieceCol = piece % COLS;
            const pieceRow = Math.floor(piece / COLS);
            const isRemoved = removed.has(piece);
            return (
              <div
                key={piece}
                className={`mp-piece${isRemoved ? ' removed' : ''}`}
                style={{
                  left: `${cellCol * (100 / COLS)}%`,
                  top: `${cellRow * (100 / ROWS)}%`,
                  backgroundImage: `url(${IMG})`,
                  backgroundPosition: `${(pieceCol / (COLS - 1)) * 100}% ${(pieceRow / (ROWS - 1)) * 100}%`,
                }}
              />
            );
          })}
        </div>
        {step === 0 && (
          <div className="mp-step animate-fade">
            <blockquote className="mp-quote">
              «Ningún ser humano es una isla en sí mismo; cualquier ser humano forma parte del todo…
              no preguntes por quién doblan las campanas; doblan por ti.»
              <span className="mp-quote-author">— John Donne</span>
            </blockquote>
            <p className="section-desc">
              Para introducirnos en el mundo de los sistemas, realizaremos el <strong>ejercicio de la mariposa</strong>,
              tomado del libro <em>Introducción al pensamiento sistémico</em> de Juan Carlos Osorio Gómez
              (Universidad del Valle, 2007). Observa con atención y sigue los pasos.
            </p>
            <div className="action-footer">
              <button className="mp-btn mp-btn-primary" onClick={() => goStep(1)}>
                🔬 Comenzar el experimento
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="mp-step animate-fade">
            <h3>🔀 Paso 1 · Un montón de piezas</h3>
            <p className="section-desc">Observa fijamente la imagen de arriba y responde mentalmente:</p>
            <div className="mp-questions">
              <div className="mp-question"><span>1.</span> ¿Qué podemos decir con respecto a lo que estamos viendo?</div>
              <div className="mp-question"><span>2.</span> ¿Es claro lo que allí se representa?</div>
              <div className="mp-question"><span>3.</span> ¿Cuáles son las posibles causas que impiden la claridad de la imagen?</div>
            </div>
            <p className="section-desc">
              Aunque parece que entre las piezas hay una mariposa, es más el resultado de tu <strong>percepción</strong> y
              tus conocimientos previos que la imagen misma. Las piezas no están organizadas apropiadamente y las
              <strong> relaciones entre ellas no están bien definidas</strong>: eso impide una visión completa y clara del conjunto.
            </p>
            <div className="action-footer">
              <button className="mp-btn mp-btn-primary" onClick={removeConglomPieces}>
                🧩 Extraer algunas piezas
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mp-step animate-fade">
            <h3>🕳️ ¿Notaste un cambio dramático?</h3>
            <p className="section-desc">
              Aunque los espacios vacíos llaman la atención de inmediato, el conjunto <strong>no ha perdido sus
              características iniciales</strong>: sigue siendo el mismo montón de piezas desordenadas. Incluso podríamos
              reemplazar las piezas extraídas por otras y el resultado sería prácticamente igual.
            </p>
            <div className="mp-concepts">
              <div className="mp-concept">
                <h4>📦 Conglomerado</h4>
                <p>Una totalidad <strong>desprovista de sinergia</strong>: la suma de los elementos es igual al todo.
                Quitar o cambiar partes casi no lo afecta.</p>
              </div>
            </div>
            <div className="action-footer">
              <button className="mp-btn mp-btn-primary" onClick={orderPieces}>
                ✨ Ordenar las piezas
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="mp-step animate-fade">
            <h3>🦋 Paso 2 · Ahora sí: un sistema</h3>
            <p className="section-desc">
              Son <strong>exactamente las mismas piezas</strong>, pero ahora las relaciones entre ellas están definidas.
              Cada pieza ocupa el lugar que le corresponde y de esa unión <strong>emerge</strong> algo nuevo y diferente:
              una mariposa. Ya no es posible describir el conjunto a partir de una sola pieza.
            </p>
            <div className="mp-concepts">
              <div className="mp-concept">
                <h4>🔗 Sistema</h4>
                <p>La suma de las partes es <strong>diferente</strong> al todo. Los elementos interrelacionados generan
                algo que ninguna pieza tiene por sí sola.</p>
              </div>
              <div className="mp-concept">
                <h4>✨ Propiedades emergentes</h4>
                <p>Cualidades que <strong>no están en las partes</strong>: emergen únicamente cuando las partes
                se interrelacionan.</p>
              </div>
            </div>
            <div className="action-footer">
              <button className="mp-btn mp-btn-warn" onClick={removeSystemPieces}>
                ✂️ Extraer piezas del sistema
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="mp-step animate-fade">
            <h3>💥 El sistema desaparece</h3>
            <p className="section-desc">
              Al extraer piezas clave, el cambio <strong>sí es dramático</strong>: la mariposa deja de existir como tal.
              El sistema que teníamos ha desaparecido porque <strong>los elementos y las relaciones existentes fueron
              modificados</strong>. Puedes restaurar las piezas y repetir el experimento las veces que quieras.
            </p>
            <div className="action-footer mp-footer-split">
              <button className="mp-btn mp-btn-ghost" onClick={restorePieces}>
                🔄 Restaurar piezas
              </button>
              <button className="mp-btn mp-btn-primary" onClick={() => goStep(5)}>
                📖 Ver conclusiones
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="mp-step animate-fade">
            <h3>📖 Conclusiones</h3>
            <blockquote className="mp-quote">
              «Un sistema es un conjunto de elementos que funcionan relacionados, y cuyo resultado conjunto es
              diferente del resultado individual de cada una de las partes.»
            </blockquote>
            <blockquote className="mp-quote">
              «Cuando uno de los elementos es retirado o eliminado, el sistema completo se afecta… no es necesario
              retirarlo: simplemente al afectar uno de los elementos, el sistema es afectado completamente dadas las
              relaciones existentes en él.»
              <span className="mp-quote-author">— Introducción al pensamiento sistémico, Juan Carlos Osorio Gómez</span>
            </blockquote>

            <hr className="separator" />

            <h3>✍️ Tu reflexión final</h3>
            <p className="section-desc">
              Redacta una reflexión respondiendo: ¿qué diferencia hay entre un <strong>conglomerado</strong> y un
              <strong> sistema</strong>?, ¿qué le sucede a un sistema cuando se afecta uno de sus elementos?
              Y piensa en tu cuerpo: ¿el sistema circulatorio será un conglomerado o un sistema? ¿Por qué?
            </p>
            <div className="input-group">
              <textarea
                value={reflexion}
                onChange={(e) => setReflexion(e.target.value)}
                disabled={isSaved}
                placeholder="Escribe aquí tu reflexión..."
                className="glass-textarea"
                rows="7"
              ></textarea>
            </div>
            <div className="action-footer">
              <button
                className="btn-save"
                onClick={saveReflexion}
                disabled={isSaved || !reflexion.trim() || loading}
              >
                {isSaved ? '✓ Reflexión Guardada' : (loading ? 'Guardando...' : 'Guardar Evidencia')}
              </button>
            </div>
            {message && <p className="status-msg">{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
