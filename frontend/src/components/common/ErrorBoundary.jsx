import React from 'react';
import { AlertTriangle, RefreshCw, Terminal } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('AI Sentinel UI Error Caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07110D] text-[#E8F5EC] flex items-center justify-center p-6 font-mono">
          <div className="max-w-xl w-full bg-[#0E1D15] border border-[#FF4D5A]/50 rounded-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 border-b border-[#20392A] pb-3 text-[#FF4D5A]">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h2 className="text-base font-bold tracking-wider uppercase">
                  UI RENDERING EXCEPTION DETECTED
                </h2>
                <p className="text-xs text-[#9CB4A3]">
                  AI Sentinel Error Boundary caught a client-side execution fault.
                </p>
              </div>
            </div>

            <div className="bg-[#08130E] border border-[#20392A] rounded p-3 text-xs text-[#FF4D5A] overflow-x-auto max-h-48 overflow-y-auto">
              <p className="font-bold">{this.state.error?.toString()}</p>
              {this.state.errorInfo && (
                <pre className="text-[10px] text-[#729B81] mt-2 whitespace-pre-wrap">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#729B81] flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#39FF88]" />
                Diagnostics mode active
              </span>
              <button
                onClick={this.handleReload}
                className="px-4 py-2 bg-[#39FF88] text-[#07110D] rounded font-bold text-xs hover:bg-[#19C96B] transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reload Platform
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
