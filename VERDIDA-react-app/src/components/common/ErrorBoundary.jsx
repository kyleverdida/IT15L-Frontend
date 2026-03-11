import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Keep boundary silent for users but visible in developer console.
    console.error('UI boundary caught an error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Something went wrong.</h2>
            <p className="mt-2 text-sm text-slate-600">
              We could not render this section. Please refresh the page or try again later.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
