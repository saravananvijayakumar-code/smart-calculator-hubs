import { useEffect, useState, useCallback, useRef } from 'react';
import backend from '~backend/client';

interface UseRealTimeStatsConfig {
  fetchInterval?: number;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

export function useRealTimeStats<T>(
  fetchFunction: () => Promise<T>,
  config: UseRealTimeStatsConfig = {}
) {
  const {
    fetchInterval = 10000, // 10 seconds for more real-time feel
    onError,
    enabled = true
  } = config;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!enabled || !mountedRef.current) return;

    try {
      const result = await fetchFunction();
      if (mountedRef.current) {
        setData(result);
        setError(null);
        setLastUpdated(new Date());
        setIsConnected(true);
        setLoading(false);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      if (mountedRef.current) {
        setError(error);
        setIsConnected(false);
        onError?.(error);
        
        // Don't set loading to false on error, keep trying
        console.error('Real-time stats fetch error:', error);
      }
    }
  }, [fetchFunction, enabled, onError]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(fetchData, fetchInterval);
  }, [fetchData, fetchInterval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  // Handle page visibility changes for better real-time updates
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsConnected(true);
        fetchData(); // Immediate fetch when page becomes visible
        startPolling();
      } else {
        stopPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchData, startPolling, stopPolling]);

  // Initial fetch and polling setup
  useEffect(() => {
    if (!enabled) return;

    fetchData();
    startPolling();

    return () => {
      stopPolling();
    };
  }, [enabled, fetchData, startPolling, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      stopPolling();
    };
  }, [stopPolling]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    isConnected,
    refetch
  };
}

export function usePageViewStats(config?: UseRealTimeStatsConfig) {
  return useRealTimeStats(
    () => backend.pageviews.getStats(),
    config
  );
}

export function usePWAStats(config?: UseRealTimeStatsConfig) {
  return useRealTimeStats(
    () => backend.pwa_stats.getStats(),
    config
  );
}