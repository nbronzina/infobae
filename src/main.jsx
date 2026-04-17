import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import escenariosData from './data/escenarios.json';

const VALID_SCENARIOS = escenariosData.map(e => e.slug);

function getScenarioFromPath() {
  if (typeof window === 'undefined') return null;
  const segments = window.location.pathname.split('/').filter(Boolean);
  if (segments[0] && VALID_SCENARIOS.includes(segments[0])) return segments[0];
  return null;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    if (typeof console !== 'undefined') console.error('Infobae · Bitácora — render error:', error, info);
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

function ScenarioIndex() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1f1f1f', color: '#d9d4c2', padding: '60px 32px', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      <style>{`
        .serif { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .esc-card { background-color: #2a2a2a; border: 1px solid #3d3931; padding: 28px 26px; cursor: pointer; transition: border-color 0.15s, background-color 0.15s; text-decoration: none; color: inherit; display: block; }
        .esc-card:hover { border-color: #f18b1e; background-color: #2f2f2f; }
        .esc-card:focus-visible { outline: 2px solid #f18b1e; outline-offset: 2px; }
        .esc-link-foot { color: #8a8472; text-decoration: none; border-bottom: 1px dotted #5a544c; padding-bottom: 1px; }
        .esc-link-foot:hover { color: #f0ede4; }
      `}</style>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ marginBottom: '48px' }}>
          <img src="/infobae-logo.png" alt="infobae" style={{ height: '40px', width: 'auto', display: 'block', marginBottom: '24px' }} />
          <div className="mono" style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#f18b1e', marginBottom: '14px' }}>
            Bitácora · diegetic prototype · 2029
          </div>
          <h1 className="serif" style={{ fontSize: '34px', fontWeight: 500, margin: '0 0 16px', letterSpacing: '-0.01em', color: '#f0ede4' }}>
            Tres líneas de planificación
          </h1>
          <div className="serif" style={{ fontSize: '15.5px', lineHeight: 1.6, color: '#d9d4c2', maxWidth: '660px' }}>
            Cada línea es una versión coherente del mismo universo. La línea vigente es el escenario operativo actual y se actualiza semanalmente. Las dos contrafactuales son probes congelados en el tiempo: ejercicios de foresight para estresar el artefacto desde un ángulo distinto.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {escenariosData.map(esc => (
            <a key={esc.id} href={'/' + esc.slug} className="esc-card">
              <div className="mono" style={{ fontSize: '10.5px', letterSpacing: '0.06em', textTransform: 'uppercase', color: esc.id === 'vigente' ? '#f18b1e' : '#8a8472', marginBottom: '10px' }}>
                {esc.estado.replace(/_/g, ' ')}
              </div>
              <div className="serif" style={{ fontSize: '20px', fontWeight: 500, color: '#f0ede4', marginBottom: '8px', letterSpacing: '-0.01em' }}>
                {esc.nombre}
              </div>
              <div className="serif" style={{ fontSize: '13px', color: '#d9d4c2', fontStyle: 'italic', marginBottom: '14px', lineHeight: 1.55 }}>
                {esc.subtitulo}
              </div>
              <div className="mono" style={{ fontSize: '11.5px', color: '#8a8472', lineHeight: 1.6 }}>
                {esc.descripcion}
              </div>
              <div className="mono" style={{ fontSize: '10.5px', color: '#f18b1e', marginTop: '18px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Entrar a la intranet →
              </div>
            </a>
          ))}
        </div>

        <div style={{ paddingTop: '28px', borderTop: '1px solid #3d3931', maxWidth: '660px' }}>
          <div className="mono" style={{ fontSize: '11px', color: '#8a8472', lineHeight: 1.7 }}>
            <strong style={{ color: '#d9d4c2' }}>Infobae · Bitácora</strong> es un diegetic prototype: la ficción está en que el sistema existe, no en lo que dice. Cada protocolo, norma y herramienta es extensión plausible de algo que existe hoy. Los personajes y los despliegues son ficticios; las fuentes externas, las regulaciones y los papers citados son reales.
          </div>
          <div className="mono" style={{ fontSize: '11px', color: '#8a8472', marginTop: '14px' }}>
            Ideado, diseñado y codificado por <a href="https://www.nicolasbronzina.com/" target="_blank" rel="noreferrer" className="esc-link-foot">Nicolás Bronzina</a>.
          </div>
        </div>
      </div>
    </div>
  );
}

function Router() {
  const [scenario, setScenario] = useState(() => getScenarioFromPath());

  useEffect(() => {
    const onPop = () => setScenario(getScenarioFromPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  if (!scenario) return <ScenarioIndex />;
  return <App scenario={scenario} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  </React.StrictMode>
);
