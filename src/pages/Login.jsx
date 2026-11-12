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

  const { isAuthenticated, login } = useAuth();
  const { status, isWakingUp, wakeUpProgress, wakeUpServer } = useServerStatus();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const to = location.state?.from?.pathname || '/landing';
      navigate(to, { replace: true });
    }
  }, [isAuthenticated, location, navigate]);

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
        <div className="auth-logo">
          <svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lgBrain" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
            <circle cx="40" cy="40" r="38" fill="rgba(168,85,247,0.12)" stroke="#a855f7" strokeWidth="1.5" />
            <path d="M40 16c-8 0-14 3-17 8-2 3-3 7-2 11 0 2-1 4-3 5-1 1-2 3-2 5 0 3 2 5 5 6 1 0 2 1 3 3 1 3 4 5 7 6 2 1 4 1 6 0h4c2 1 4 1 6 0 3-1 6-3 7-6 1-2 2-3 3-3 3-1 5-3 5-6 0-2-1-4-2-5-2-1-3-3-3-5 1-4 0-8-2-11-3-5-9-8-17-8z" fill="url(#lgBrain)" />
            <path d="M40 20v36" fill="none" stroke="#e9d5ff" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.5"/>
            <circle cx="22" cy="22" r="4" fill="#f59e0b" opacity="0.85"><title>Vista</title></circle>
            <circle cx="58" cy="22" r="4" fill="#3b82f6" opacity="0.85"><title>Oído</title></circle>
            <circle cx="40" cy="10" r="3.5" fill="#10b981" opacity="0.85"><title>Olfato</title></circle>
            <circle cx="22" cy="56" r="4" fill="#ef4444" opacity="0.85"><title>Gusto</title></circle>
            <circle cx="58" cy="56" r="4" fill="#f97316" opacity="0.85"><title>Tacto</title></circle>
            <line x1="22" y1="22" x2="30" y2="26" stroke="#f59e0b" strokeWidth="1.2" opacity="0.6"/>
            <line x1="58" y1="22" x2="50" y2="26" stroke="#3b82f6" strokeWidth="1.2" opacity="0.6"/>
            <line x1="40" y1="10" x2="40" y2="18" stroke="#10b981" strokeWidth="1.2" opacity="0.6"/>
            <line x1="22" y1="56" x2="30" y2="48" stroke="#ef4444" strokeWidth="1.2" opacity="0.6"/>
            <line x1="58" y1="56" x2="50" y2="48" stroke="#f97316" strokeWidth="1.2" opacity="0.6"/>
          </svg>
        </div>
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
