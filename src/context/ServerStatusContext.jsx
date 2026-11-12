import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL } from '../config';

const ServerStatusContext = createContext(null);

const HEALTH_ENDPOINT = `${API_URL}/health`;
const POLL_INTERVAL_ONLINE = 30000;
const POLL_INTERVAL_OFFLINE = 5000;
const WAKE_UP_TIMEOUT = 120000;

export function ServerStatusProvider({ children }) {
  const [status, setStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);
  const [wakeUpStartTime, setWakeUpStartTime] = useState(null);
  const [isWakingUp, setIsWakingUp] = useState(false);

  const checkHealth = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(HEALTH_ENDPOINT, { signal: controller.signal, cache: 'no-store' });
      clearTimeout(timeoutId);

      if (res.ok) {
        await res.json();
        setStatus('online');
        setLastCheck(new Date());
        if (isWakingUp) setIsWakingUp(false);
      } else {
        throw new Error('Health check failed');
      }
    } catch {
      const wasOnline = status === 'online';
      setStatus('offline');
      setLastCheck(new Date());

      if (wasOnline) {
        setIsWakingUp(true);
        setWakeUpStartTime(Date.now());
      }
    }
  }, [status, isWakingUp]);

  useEffect(() => {
    checkHealth();

    let intervalId;
    const setPollInterval = () => {
      const interval = status === 'online' ? POLL_INTERVAL_ONLINE : POLL_INTERVAL_OFFLINE;
      intervalId = setInterval(checkHealth, interval);
    };

    setPollInterval();

    return () => clearInterval(intervalId);
  }, [checkHealth, status]);

  useEffect(() => {
    if (isWakingUp && wakeUpStartTime) {
      const elapsed = Date.now() - wakeUpStartTime;
      if (elapsed >= WAKE_UP_TIMEOUT) {
        setIsWakingUp(false);
        setWakeUpStartTime(null);
      }
    }
  }, [isWakingUp, wakeUpStartTime]);

  const wakeUpServer = useCallback(async () => {
    setIsWakingUp(true);
    setWakeUpStartTime(Date.now());
    setStatus('waking');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), WAKE_UP_TIMEOUT);
      await fetch(HEALTH_ENDPOINT, { signal: controller.signal, cache: 'no-store' });
      clearTimeout(timeoutId);
      setStatus('online');
      setIsWakingUp(false);
      setWakeUpStartTime(null);
    } catch {
      setStatus('offline');
    }
  }, []);

  const getWakeUpProgress = useCallback(() => {
    if (!isWakingUp || !wakeUpStartTime) return 0;
    const elapsed = Date.now() - wakeUpStartTime;
    return Math.min((elapsed / WAKE_UP_TIMEOUT) * 100, 100);
  }, [isWakingUp, wakeUpStartTime]);

  const value = {
    status,
    lastCheck,
    isWakingUp,
    wakeUpProgress: getWakeUpProgress(),
    wakeUpServer,
    checkHealth,
  };

  return <ServerStatusContext.Provider value={value}>{children}</ServerStatusContext.Provider>;
}

export function useServerStatus() {
  const context = useContext(ServerStatusContext);
  if (!context) {
    throw new Error('useServerStatus debe usarse dentro de <ServerStatusProvider>');
  }
  return context;
}