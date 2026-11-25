import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-text-primary">
          <div className="max-w-md w-full bg-background border border-primary/10 shadow-2xl rounded-2xl p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-heading font-bold text-primary">Something went wrong</h2>
            <p className="text-sm text-text-muted">
              We encountered an unexpected error while rendering this page.
            </p>
            {this.state.error && (
              <pre className="text-left bg-primary/5 text-red-700 text-xs p-3 rounded-lg overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </pre>
            )}
            <div className="pt-2 flex gap-3 justify-center">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors cursor-pointer"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-accent text-primary hover:bg-accent/90 transition-colors shadow-sm cursor-pointer"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
