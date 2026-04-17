import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    if (typeof console !== 'undefined') console.error('Infobae interna — render error:', error, info);
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#1f1f1f', color: '#d9d4c2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', lineHeight: 1.6 }}>
        <div style={{ maxWidth: '520px', textAlign: 'left' }}>
          <div style={{ color: '#bd2828', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '11px', marginBottom: '18px' }}>
            Error interno · render
          </div>
          <div style={{ color: '#f0ede4', fontSize: '15px', marginBottom: '14px' }}>
            La vista actual no pudo renderizarse.
          </div>
          <div style={{ color: '#8a8472', marginBottom: '20px' }}>
            Recargar la página. Si el error persiste, reportar a <a href="mailto:it@infobae.interna" style={{ color: '#f18b1e' }}>it@infobae.interna</a> con una captura de pantalla y la hora del incidente.
          </div>
          <div style={{ padding: '12px 14px', backgroundColor: '#2a2a2a', border: '1px solid #3d3931', color: '#8a8472', fontSize: '11px', whiteSpace: 'pre-wrap', overflowX: 'auto' }}>
            {String(this.state.error?.stack || this.state.error?.message || this.state.error)}
          </div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => window.location.reload()}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.reload(); } }}
            style={{ marginTop: '24px', padding: '10px 14px', border: '1px solid #3d3931', backgroundColor: '#2a2a2a', color: '#f0ede4', cursor: 'pointer', display: 'inline-block', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: '11px' }}
          >
            Recargar
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
