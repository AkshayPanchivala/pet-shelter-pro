import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}
const mode = import.meta.env.VITE_MODE_ENV || 'production';


class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6">
              <div className="flex items-center gap-4 text-white">
                <div className="bg-white/20 p-3 rounded-full">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
                  <p className="text-red-100 mt-1">
                    We encountered an unexpected error
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="bg-gray-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">Error Details:</p>
                <p className="text-sm text-gray-600 font-mono">
                  {this.state.error?.message || 'Unknown error occurred'}
                </p>
              </div>

              {mode === 'development' && this.state.errorInfo && (
                <details className="mb-6">
                  <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900 mb-2">
                    View Stack Trace
                  </summary>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-64 text-xs font-mono">
                    {this.state.errorInfo.componentStack}
                  </div>
                </details>
              )}

              <div className="space-y-3">
                <p className="text-gray-600 text-sm">
                  Don't worry! You can try the following:
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 ml-2">
                  <li>Refresh the page and try again</li>
                  <li>Go back to the home page</li>
                  <li>Clear your browser cache</li>
                  <li>Contact support if the problem persists</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <button
                  onClick={this.handleReset}
                  className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-6 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  <RefreshCw className="h-5 w-5" />
                  Try Again
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Home className="h-5 w-5" />
                  Go Home
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                If this problem continues, please contact our support team
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
