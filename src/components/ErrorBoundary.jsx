import { Component } from 'react';

// Catches render-time crashes anywhere in the tree so users see a friendly
// fallback instead of a blank white page.
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-5">
          <div className="text-center max-w-md">
            <img src="/olaflex-logo.png" alt="OLAFLEX" className="h-16 w-auto mx-auto mb-6" />
            <h1 className="text-lg font-semibold text-ink mb-2">Something went wrong</h1>
            <p className="text-sm text-ink-muted mb-6">
              An unexpected error occurred. Your data is safe — try reloading the page.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => window.location.reload()} className="btn-gold text-xs py-2.5 px-5">
                Reload Page
              </button>
              <a href="/" className="btn-outline text-xs py-2.5 px-5">Go Home</a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
