import { useState, useCallback } from 'react';
import backend from '~backend/client';
import { useErrorHandler, type ApiError } from './useErrorHandler';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

export interface ApiOptions {
  showErrorToast?: boolean;
  onError?: (error: ApiError) => void;
  onSuccess?: (data: any) => void;
}

export function useApi<T = any>(options: ApiOptions = {}) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { handleError } = useErrorHandler({
    showToast: options.showErrorToast ?? true,
    onError: options.onError,
  });

  const execute = useCallback(async <R = T>(
    apiCall: () => Promise<R>
  ): Promise<R | undefined> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();
      setState({
        data: result as any,
        loading: false,
        error: null,
      });

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (error) {
      const apiError = handleError(error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError,
      }));
      return undefined;
    }
  }, [handleError, options.onSuccess]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export function useApiCall<T extends (...args: any[]) => Promise<any>>(
  apiFunction: T,
  options: ApiOptions = {}
) {
  const { execute, ...state } = useApi<Awaited<ReturnType<T>>>(options);

  const call = useCallback(
    (...args: Parameters<T>) => execute(() => apiFunction(...args)),
    [execute, apiFunction]
  );

  return {
    ...state,
    call,
  };
}

// Simple wrapper functions for API calls with error handling
export async function withApiErrorHandling<T>(
  apiCall: () => Promise<T>,
  options: {
    showToast?: boolean;
    onError?: (error: any) => void;
    onSuccess?: (data: T) => void;
  } = {}
): Promise<T | undefined> {
  try {
    const result = await apiCall();
    if (options.onSuccess) {
      options.onSuccess(result);
    }
    return result;
  } catch (error) {
    if (options.showToast !== false) {
      console.error('API Error:', error);
    }
    if (options.onError) {
      options.onError(error);
    }
    throw error; // Re-throw to be handled by useErrorHandler
  }
}