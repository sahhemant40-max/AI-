import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { systemApi } from '../services/api';

const SystemStatusContext = createContext({
  backendOnline: null,
  dbReady: null,
  dbLatency: null,
  dbError: null,
  isChecking: false,
  lastChecked: null,
  refreshStatus: () => {},
});

export const SystemStatusProvider = ({ children }) => {
  const [backendOnline, setBackendOnline] = useState(null); // null = unknown/checking, true = online, false = offline
  const [dbReady, setDbReady] = useState(null);
  const [dbLatency, setDbLatency] = useState(null);
  const [dbError, setDbError] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  const refreshStatus = useCallback(async () => {
    setIsChecking(true);
    try {
      // Check health
      const health = await systemApi.getHealth();
      setBackendOnline(health?.status === 'healthy');

      // Check readiness (includes real MongoDB ping)
      const readiness = await systemApi.getReadiness();
      setDbReady(readiness?.database?.connected === true);
      setDbLatency(readiness?.database?.latency_ms || null);
      setDbError(readiness?.database?.error || null);
    } catch (err) {
      setBackendOnline(false);
      setDbReady(false);
      setDbError(err.message || 'Service unreachable');
    } finally {
      setIsChecking(false);
      setLastChecked(new Date().toLocaleTimeString());
    }
  }, []);

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 15000);
    return () => clearInterval(interval);
  }, [refreshStatus]);

  return (
    <SystemStatusContext.Provider
      value={{
        backendOnline,
        dbReady,
        dbLatency,
        dbError,
        isChecking,
        lastChecked,
        refreshStatus,
      }}
    >
      {children}
    </SystemStatusContext.Provider>
  );
};

export const useSystemStatus = () => useContext(SystemStatusContext);
