import { useEffect, useState, useCallback, useRef } from 'react';
import { useServerStatus } from '../context/ServerStatusContext.jsx';
import { api } from '../api/apiClient';

const PRELOAD_ENDPOINTS = [
  '/simulations',
  '/sessions',
];

export function usePreloader() {
  const { status } = useServerStatus();
  const [preloadStatus, setPreloadStatus] = useState({});
  const [isPreloading, setIsPreloading] = useState(false);
  const preloadRef = useRef(new Set());

  const preloadEndpoint = useCallback(async (endpoint) => {
    if (preloadRef.current.has(endpoint)) return;
    
    try {
      preloadRef.current.add(endpoint);
      const data = await api(endpoint, { method: 'GET' });
      setPreloadStatus(prev => ({ ...prev, [endpoint]: { status: 'success', data, timestamp: Date.now() } }));
      return data;
    } catch (err) {
      setPreloadStatus(prev => ({ ...prev, [endpoint]: { status: 'error', error: err.message, timestamp: Date.now() } }));
      return null;
    }
  }, []);

  const preloadAll = useCallback(async () => {
    if (isPreloading) return;
    setIsPreloading(true);
    
    await Promise.all(PRELOAD_ENDPOINTS.map(preloadEndpoint));
    setIsPreloading(false);
  }, [isPreloading, preloadEndpoint]);

  useEffect(() => {
    if (status === 'online') {
      const timer = setTimeout(() => {
        preloadAll();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [status, preloadAll]);

  const getPreloadedData = useCallback((endpoint) => {
    const cached = preloadStatus[endpoint];
    if (!cached || cached.status !== 'success') return null;
    
    const age = Date.now() - cached.timestamp;
    if (age > 5 * 60 * 1000) return null;
    
    return cached.data;
  }, [preloadStatus]);

  return {
    preloadStatus,
    isPreloading,
    preloadEndpoint,
    preloadAll,
    getPreloadedData,
  };
}

export function PreloaderProvider({ children }) {
  const { status } = useServerStatus();
  const { preloadAll } = usePreloader();

  useEffect(() => {
    if (status === 'online') {
      preloadAll();
    }
  }, [status, preloadAll]);

  return children;
}