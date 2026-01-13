import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundaryMeeBot extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Stamp error to Rollbar with Telemetry Context
    console.error('❌ Ritual failed:', error, errorInfo);
    // rollbar.error('MeeBot Ritual Error', { error, errorInfo });
  }

  handleRecovery = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-black text-green-400 font-mono">
          <h1 className="text-2xl mb-4">🧙‍♂️ System Recovery — MeeBot Terminal</h1>
          <p className="mb-6">Protocol disrupted. Ritual resonance unstable.</p>
          <button
            onClick={this.handleRecovery}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white animate-pulse"
          >
            🔄 ปรับแนวการเชื่อมโยงประสาทใหม่ (Reload)
          </button>
          <div className="mt-6 text-sm text-gray-400">
            Status Badge: 🟢 Protocol Awaiting Resonance
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
