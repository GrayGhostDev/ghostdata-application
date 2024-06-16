// /frontend/src/components/ErrorBoundary.tsx

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;  // Optional fallback UI
}

interface State {
  hasError: boolean;
  error?: Error; // Store the error object
  errorInfo?: ErrorInfo; // Store the error info
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
    errorInfo: undefined,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;
      return this.props.fallback || (
        <div role="alert" className="p-4 bg-red-100 border border-red-400 text-red-700">
          <h2 className="text-xl font-bold">Something went wrong.</h2>
          <p>Sorry, an unexpected error has occurred.</p>
          {process.env.NODE_ENV === 'development' && ( // Show error details in development only
            <div>
              <p className="mt-2 text-sm">Error: {error?.message}</p>
              <pre className="mt-2 text-xs whitespace-pre-wrap">{errorInfo?.componentStack}</pre>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
