'use client';

import { useState, useCallback } from 'react';
import { useErrorHandler } from '@/components/error/ErrorBoundary';

interface ApiCallState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiCallOptions<T = unknown> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  showErrorToast?: boolean;
}

export const useApiCall = <T = unknown>(options: UseApiCallOptions<T> = {}) => {
  const [state, setState] = useState<ApiCallState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const { handleError } = useErrorHandler();

  const execute = useCallback(async (
    apiCall: () => Promise<T>
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await apiCall();
      setState({
        data: result,
        loading: false,
        error: null
      });

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่คาดคิด';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage
      });

      // Log error
      if (error instanceof Error) {
        handleError(error, { context: 'useApiCall' });
      }

      if (options.onError && error instanceof Error) {
        options.onError(error);
      }

      // TODO: Show toast notification if enabled
      if (options.showErrorToast) {
        console.log('Error toast:', errorMessage);
      }

      return null;
    }
  }, [handleError, options]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  }, []);

  const retry = useCallback(async (
    apiCall: () => Promise<T>
  ) => {
    return execute(apiCall);
  }, [execute]);

  return {
    ...state,
    execute,
    reset,
    retry
  };
};

// Specialized hook for data fetching
export const useFetch = <T = unknown>(options: UseApiCallOptions<T> = {}) => {
  const apiCall = useApiCall<T>(options);

  const fetch = useCallback(async (url: string, requestOptions?: RequestInit) => {
    return apiCall.execute(async () => {
      const response = await window.fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...requestOptions?.headers
        },
        ...requestOptions
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    });
  }, [apiCall]);

  return {
    ...apiCall,
    fetch
  };
};

// Hook for mutations (POST, PUT, DELETE)
export const useMutation = <T = unknown>(options: UseApiCallOptions<T> = {}) => {
  const apiCall = useApiCall<T>(options);

  const mutate = useCallback(async (
    url: string, 
    data?: unknown, 
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
  ) => {
    return apiCall.execute(async () => {
      const response = await window.fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: data ? JSON.stringify(data) : undefined
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    });
  }, [apiCall]);

  return {
    ...apiCall,
    mutate
  };
};

export default useApiCall;