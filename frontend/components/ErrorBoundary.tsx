// @ts-nocheck
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import backend from '~backend/client';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    const errorMessage = error.message || '';
    const suppressedErrors = [
      'removeChild',
      'The node to be removed is not a child',
      'adsbygoogle',
      'google_ad_client',
      'TagError',
    ];
    
    if (suppressedErrors.some(pattern => errorMessage.includes(pattern))) {
      return {
        hasError: false,
        error: null,
      };
    }
    
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorMessage = error.message || '';
    const suppressedErrors = [
      'removeChild',
      'The node to be removed is not a child',
      'adsbygoogle',
      'google_ad_client',
      'TagError',
    ];
    
    if (suppressedErrors.some(pattern => errorMessage.includes(pattern))) {
      console.warn('Suppressed ad-related error:', error.message);
      return;
    }
    
    this.setState({
      error,
      errorInfo,
    });

    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    console.error('Error details:', {
      level: 'error',
      message: error.message,
      errorType: error.name,
      stackTrace: error.stack,
      serviceName: 'frontend',
      endpoint: window.location.pathname,
      metadata: {
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
      }
    });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState(prev => ({
      showDetails: !prev.showDetails,
    }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <div>
                  <CardTitle className="text-destructive">Something went wrong</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    An unexpected error occurred. We apologize for the inconvenience.
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error Details</AlertTitle>
                <AlertDescription>
                  {this.state.error?.message || 'An unknown error occurred'}
                </AlertDescription>
              </Alert>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={this.handleRetry} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={this.handleGoHome} className="flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {(this.props.showDetails || process.env.NODE_ENV === 'development') && (
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={this.toggleDetails}
                    className="w-full justify-between"
                  >
                    Technical Details
                    {this.state.showDetails ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                  
                  {this.state.showDetails && (
                    <div className="space-y-3">
                      <div className="bg-muted p-3 rounded-md text-sm">
                        <div className="font-medium mb-2">Error Stack:</div>
                        <pre className="whitespace-pre-wrap text-xs overflow-x-auto">
                          {this.state.error?.stack}
                        </pre>
                      </div>
                      
                      {this.state.errorInfo && (
                        <div className="bg-muted p-3 rounded-md text-sm">
                          <div className="font-medium mb-2">Component Stack:</div>
                          <pre className="whitespace-pre-wrap text-xs overflow-x-auto">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}