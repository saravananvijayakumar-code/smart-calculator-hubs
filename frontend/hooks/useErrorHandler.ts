import { useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';

export interface ApiError {
  code?: string | number;
  message: string;
  details?: {
    code?: string;
    field?: string;
    validationErrors?: Array<{
      field: string;
      message: string;
    }>;
    [key: string]: any;
  };
}

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  onError?: (error: ApiError) => void;
  defaultMessage?: string;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const { toast } = useToast();
  const {
    showToast = true,
    logError = true,
    onError,
    defaultMessage = 'An unexpected error occurred'
  } = options;

  const handleError = useCallback((error: any): ApiError => {
    let apiError: ApiError;

    if (error?.details || error?.code) {
      apiError = {
        code: error.code,
        message: error.message || defaultMessage,
        details: error.details,
      };
    } else if (error instanceof Error) {
      apiError = {
        message: error.message || defaultMessage,
      };
    } else if (typeof error === 'string') {
      apiError = {
        message: error,
      };
    } else {
      apiError = {
        message: defaultMessage,
      };
    }

    if (logError) {
      console.error('Error handled:', {
        originalError: error,
        processedError: apiError,
        timestamp: new Date().toISOString(),
      });

      console.error('Error logged to console:', {
        level: 'error',
        message: apiError.message,
        errorType: error?.name || 'ApiError',
        stackTrace: error?.stack,
        serviceName: 'frontend',
        endpoint: window.location.pathname,
        metadata: {
          code: apiError.code,
          details: apiError.details,
          userAgent: navigator.userAgent,
        }
      });
    }

    if (showToast) {
      toast({
        title: getErrorTitle(apiError),
        description: getErrorDescription(apiError),
        variant: 'destructive',
      });
    }

    if (onError) {
      onError(apiError);
    }

    return apiError;
  }, [toast, showToast, logError, onError, defaultMessage]);

  const handleAsyncError = useCallback(async <T>(
    promise: Promise<T>,
    fallbackValue?: T
  ): Promise<T | undefined> => {
    try {
      return await promise;
    } catch (error) {
      handleError(error);
      return fallbackValue;
    }
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
  };
}

function getErrorTitle(error: ApiError): string {
  if (error.details?.code) {
    switch (error.details.code) {
      case 'VALIDATION_FAILED':
        return 'Validation Error';
      case 'UNAUTHORIZED':
        return 'Authentication Required';
      case 'FORBIDDEN':
        return 'Access Denied';
      case 'NOT_FOUND':
        return 'Not Found';
      case 'CONFLICT':
        return 'Conflict';
      case 'RATE_LIMITED':
        return 'Rate Limited';
      case 'INTERNAL_ERROR':
        return 'Server Error';
      case 'SERVICE_UNAVAILABLE':
        return 'Service Unavailable';
      case 'DATABASE_ERROR':
        return 'Database Error';
      case 'EXTERNAL_SERVICE_ERROR':
        return 'External Service Error';
      case 'TIMEOUT':
        return 'Request Timeout';
      default:
        return 'Error';
    }
  }

  if (typeof error.code === 'number') {
    if (error.code >= 400 && error.code < 500) {
      return 'Client Error';
    } else if (error.code >= 500) {
      return 'Server Error';
    }
  }

  return 'Error';
}

function getErrorDescription(error: ApiError): string {
  if (error.details?.validationErrors?.length) {
    const firstError = error.details.validationErrors[0];
    return `${firstError.field}: ${firstError.message}`;
  }

  return error.message;
}

export function isApiError(error: any): error is ApiError {
  return error && (error.message || error.code || error.details);
}

export function formatValidationErrors(errors: Array<{ field: string; message: string }>): string {
  if (errors.length === 1) {
    return `${errors[0].field}: ${errors[0].message}`;
  }

  return `Multiple validation errors:\n${errors
    .map(err => `• ${err.field}: ${err.message}`)
    .join('\n')}`;
}