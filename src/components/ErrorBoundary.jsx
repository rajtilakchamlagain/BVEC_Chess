import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', 
          justifyContent: 'center', height: '100vh', background: '#09090b', color: '#fff'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong.</h2>
          <p style={{ color: '#ccc', marginBottom: '2rem' }}>The application encountered an unexpected error.</p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #0055ff 0%, #00e5ff 100%)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Return to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
