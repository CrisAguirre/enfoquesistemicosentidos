import { useState, useEffect } from 'react';
import { evidenciaApi } from '../../api/evidencia';

export default function EvidenciaTextarea({ titulo, placeholder }) {
  const [contenido, setContenido] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEvidencia = async () => {
      try {
        const response = await evidenciaApi.listMine();
        const evidencias = response.data || [];
        const prev = evidencias.find(e => e.titulo === titulo);
        if (prev) {
          setContenido(prev.contenido);
          setIsSaved(true);
        }
      } catch (error) {
        console.error('Error al cargar evidencia previa:', error);
      }
    };
    fetchEvidencia();
  }, [titulo]);

  const saveEvidencia = async () => {
    if (isSaved || !contenido.trim()) return;
    
    setLoading(true);
    setMessage('');
    try {
      await evidenciaApi.create({
        titulo,
        contenido,
        tipoArchivo: 'texto'
      });
      setIsSaved(true);
      setMessage('Evidencia guardada con éxito.');
    } catch (error) {
      console.error(error);
      setMessage('Error al guardar la evidencia.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="evidencia-box mt-4">
      <h4 style={{ marginBottom: '10px' }}>📝 Registro de Evidencia</h4>
      <div className="input-group">
        <textarea 
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          disabled={isSaved}
          placeholder={placeholder || "Escribe aquí el resultado de tu actividad..."}
          className="glass-textarea" 
          rows="5"
          style={{ width: '100%' }}
        ></textarea>
      </div>

      <div className="action-footer" style={{ marginTop: '15px' }}>
        <button 
          className="btn-save" 
          onClick={saveEvidencia}
          disabled={isSaved || !contenido.trim() || loading}
        >
          {isSaved ? '✓ Evidencia Guardada' : (loading ? 'Guardando...' : 'Guardar Evidencia')}
        </button>
      </div>
      {message && <p className="status-msg" style={{ marginTop: '10px' }}>{message}</p>}
    </div>
  );
}
