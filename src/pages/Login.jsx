import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useServerStatus } from '../context/ServerStatusContext';
import ServerStatusIndicator from '../components/shared/ServerStatusIndicator';
import './pages.css';

export default function Login() {
  const [documento, setDocumento] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [wakeUpCountdown, setWakeUpCountdown] = useState(0);

  const { login } = useAuth();
  const { status, isWakingUp, wakeUpProgress, wakeUpServer } = useServerStatus();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isWakingUp) {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - (wakeUpProgress * 1200)) / 1000);
        const remaining = Math.max(0, 120 - elapsed);
        setWakeUpCountdown(remaining);
      }, 1000);
      return () => clearInterval(interval);
    }
    setWakeUpCountdown(0);
  }, [isWakingUp, wakeUpProgress]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.login({ documento, password });
      login(data.user, data.token);
      const to = location.state?.from?.pathname || '/landing';
      navigate(to, { replace: true });
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  const canLogin = status === 'online' || status === 'waking';

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🧠</div>
        <h1 className="auth-title">Los Sentidos: Iniciar Sesión</h1>
        <p className="auth-subtitle">Las credenciales son asignadas por la institución.</p>
        <ServerStatusIndicator />

        {status === 'offline' && (
          <div className="server-offline-banner">
            <span className="banner-icon">⚠</span>
            <span>El servidor está dormido (Render free tier). Haz clic en "Despertar servidor" y espera ~30-60s.</span>
            <button className="btn btn-secondary wake-btn" onClick={wakeUpServer} disabled={isWakingUp}>
              {isWakingUp ? `Despertando... ${Math.round(wakeUpProgress)}%` : 'Despertar servidor'}
            </button>
          </div>
        )}

        {status === 'waking' && (
          <div className="server-waking-banner">
            <span className="banner-icon">⟳</span>
            <span>Despertando servidor... {Math.round(wakeUpProgress)}% 
              {wakeUpCountdown > 0 && <span className="countdown">({formatTime(wakeUpCountdown)})</span>}
            </span>
            <div className="wake-progress-bar-container">
              <div className="wake-progress-bar-fill" style={{ width: `${wakeUpProgress}%` }} />
            </div>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="documento">Documento</label>
            <input
              id="documento"
              type="text"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              placeholder="Tu número de documento"
              autoComplete="username"
              required
              disabled={!canLogin || loading}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
              disabled={!canLogin || loading}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading || !canLogin}>
            {loading ? 'Ingresando...' : status === 'offline' ? 'Servidor offline' : status === 'waking' ? 'Despertando...' : 'Ingresar'}
          </button>
        </form>

        {!canLogin && (
          <p className="auth-hint">
            {status === 'checking' ? 'Verificando conexión con el servidor...' : 
             status === 'waking' ? 'Por favor espera a que el servidor despierte.' : 
             'El servidor no está disponible. Usa el botón "Despertar servidor".'}
          </p>
        )}
      </div>
    </div>
  );
}
