import { useServerStatus } from '../../context/ServerStatusContext.jsx';

export default function ServerStatusIndicator({ compact = false }) {
  const { status, lastCheck, isWakingUp, wakeUpProgress, wakeUpServer } = useServerStatus();

  const getStatusConfig = () => {
    switch (status) {
      case 'online':
        return {
          label: compact ? '●' : '● En línea',
          className: 'status-online',
          title: `Servidor disponible - Última verificación: ${lastCheck ? lastCheck.toLocaleTimeString() : '—'}`,
        };
      case 'offline':
        return {
          label: compact ? '○' : '○ Sin conexión',
          className: 'status-offline',
          title: 'Servidor no disponible',
        };
      case 'waking':
        return {
          label: compact ? '⟳' : `⟳ Despertando ${Math.round(wakeUpProgress)}%`,
          className: 'status-waking',
          title: `Despertando servidor... ${Math.round(wakeUpProgress)}%`,
        };
      case 'checking':
        return {
          label: compact ? '…' : '… Verificando',
          className: 'status-checking',
          title: 'Comprobando estado del servidor...',
        };
      default:
        return {
          label: compact ? '?' : '? Desconocido',
          className: 'status-unknown',
          title: 'Estado desconocido',
        };
    }
  };

  const config = getStatusConfig();

  if (compact) {
    return (
      <div className={`server-status-indicator compact ${config.className}`} title={config.title}>
        <span className="status-dot" />
        <span className="status-label">{config.label}</span>
        {status === 'offline' && (
          <button className="wake-btn" onClick={wakeUpServer} title="Despertar servidor">
            ⟳
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`server-status-indicator ${config.className}`} title={config.title}>
      <div className="status-content">
        <span className="status-dot" />
        <span className="status-label">{config.label}</span>
      </div>
      {status === 'offline' && (
        <button className="wake-btn" onClick={wakeUpServer} disabled={isWakingUp}>
          {isWakingUp ? `Despertando ${Math.round(wakeUpProgress)}%` : 'Despertar servidor'}
        </button>
      )}
      {status === 'waking' && (
        <div className="wake-progress" role="progressbar" aria-valuenow={Math.round(wakeUpProgress)} aria-valuemin={0} aria-valuemax={100}>
          <div className="wake-progress-bar" style={{ width: `${wakeUpProgress}%` }} />
        </div>
      )}
    </div>
  );
}