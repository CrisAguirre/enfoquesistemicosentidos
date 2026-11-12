import { useRef, useState, useEffect } from 'react';
import './DrawingCanvas.css';

export default function DrawingCanvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#a855f7'); // Violeta por defecto (cerebro / sentidos)
  const [brushSize, setBrushSize] = useState(4);
  const [toolMode, setToolMode] = useState('draw'); // 'draw' o 'text'
  const [textInput, setTextInput] = useState('');

  // Configurar fondo blanco inicial para evitar transparencia en exportación
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const bcr = canvas.getBoundingClientRect();
    // Factor de escala (si el canvas en pantalla es más pequeño que su atributo width/height)
    const scaleX = canvas.width / bcr.width;
    const scaleY = canvas.height / bcr.height;

    if (e.touches && e.touches.length > 0) {
      return {
        offsetX: (e.touches[0].clientX - bcr.left) * scaleX,
        offsetY: (e.touches[0].clientY - bcr.top) * scaleY
      };
    }
    return {
      offsetX: (e.clientX - bcr.left) * scaleX,
      offsetY: (e.clientY - bcr.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    if (e.cancelable) e.preventDefault(); // Prevenir scroll en móviles
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');

    if (toolMode === 'text') {
      if (!textInput.trim()) return;
      ctx.font = `${brushSize * 4 + 10}px Arial`; // Escalar fuente según el grosor
      ctx.fillStyle = color;
      ctx.fillText(textInput, offsetX, offsetY);
      return; // No iniciar trazado si es modo texto
    }

    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();
    const { offsetX, offsetY } = getCoordinates(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(offsetX, offsetY);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.closePath();
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const exportImage = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'representacion_sistema_sensorial.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="drawing-canvas-container">
      <div className="drawing-toolbar glass-panel">
        <div className="tool-group">
          <label>
            Herramienta:
            <select value={toolMode} onChange={(e) => setToolMode(e.target.value)} style={{ padding: '5px', borderRadius: '5px' }}>
              <option value="draw">✏️ Lápiz</option>
              <option value="text">🔤 Texto</option>
            </select>
          </label>
        </div>
        {toolMode === 'text' && (
          <div className="tool-group">
            <label>
              Texto:
              <input type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Escribe aquí..." style={{ padding: '5px', borderRadius: '5px' }} />
            </label>
          </div>
        )}
        <div className="tool-group">
          <label>
            Color:
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </label>
        </div>
        <div className="tool-group">
          <label>
            Grosor:
            <input type="range" min="1" max="20" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} />
          </label>
        </div>
        <div className="tool-group actions">
          <button onClick={clearCanvas} className="sim-btn" type="button">🗑️ Limpiar</button>
          <button onClick={exportImage} className="sim-btn active" type="button">💾 Exportar Imagen (Local)</button>
        </div>
      </div>
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className={`drawing-board glass-panel ${toolMode === 'text' ? 'text-mode' : 'draw-mode'}`}
        />
      </div>
      <p className="canvas-hint">Utiliza el lienzo para dibujar tu propia representación de cómo el cerebro se conecta simultáneamente con los cinco sentidos (vías aferentes, nervios y centros de procesamiento). Puedes exportarlo a tu dispositivo al terminar.</p>
    </div>
  );
}
