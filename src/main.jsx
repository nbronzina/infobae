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
        .esc-card { background-color: #2a2a2a; border: 1px solid #3d3931; padding: 22px 24px; cursor: pointer; transition: border-color 0.15s, background-color 0.15s; text-decoration: none; color: inherit; display: flex; flex-direction: column; gap: 14px; }
        .esc-card:hover { border-color: #f18b1e; background-color: #2f2f2f; }
        .esc-card:focus-visible { outline: 2px solid #f18b1e; outline-offset: 2px; }
        .esc-link-foot { color: #8a8472; text-decoration: none; border-bottom: 1px dotted #5a544c; padding-bottom: 1px; }
        .esc-link-foot:hover { color: #f0ede4; }
      `}</style>
      <div style={{ maxWidth: '920px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '56px' }}>
          <img src="/infobae-logo.png" alt="infobae" style={{ height: '34px', width: 'auto', display: 'block' }} />
          <span className="mono" style={{ fontSize: '14px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f0ede4', fontWeight: 500 }}>
            Bitácora
          </span>
        </div>

        <div style={{ marginBottom: '44px', maxWidth: '720px' }}>
          <h1 style={{ fontFamily: 'Georgia, "Fraunces", serif', fontStyle: 'italic', fontSize: '32px', fontWeight: 400, margin: '0 0 28px', letterSpacing: '-0.005em', color: '#f0ede4', lineHeight: 1.3 }}>
            ¿Cómo se organizarían los periodistas de investigación y corresponsales para entrenarse, informarse, prepararse y trabajar — tanto en campo internacional como en investigación doméstica?
          </h1>
          <div className="mono" style={{ fontSize: '12px', letterSpacing: '0.04em', color: '#8a8472', lineHeight: 1.6 }}>
            Una obra de ficción ambientada en 2029. Tres escenarios. Todo el research es real.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '56px' }}>
          {escenariosData.map(esc => (
            <a key={esc.id} href={'/' + esc.slug} className="esc-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span className="mono" style={{ fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#8a8472' }}>
                  {esc.teatro_codigo}
                </span>
                <span
                  className="mono"
                  style={{
                    fontSize: '9px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '2px 7px',
                    border: '1px solid ' + (esc.congelado ? '#3d3931' : '#f18b1e'),
                    color: esc.congelado ? '#8a8472' : '#f18b1e',
                    backgroundColor: esc.congelado ? 'transparent' : 'rgba(241,139,30,0.08)'
                  }}
                >
                  {esc.estado}
                </span>
              </div>
              <div className="serif" style={{ fontSize: '17px', fontWeight: 500, color: '#f0ede4', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
                {esc.nombre}
              </div>
              <div style={{ fontFamily: 'Georgia, "Fraunces", serif', fontStyle: 'italic', fontSize: '14.5px', color: '#d9d4c2', lineHeight: 1.45, flex: 1 }}>
                {esc.frase_tension}
              </div>
              <div className="mono" style={{ fontSize: '10.5px', color: '#f18b1e', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>
                Entrar →
              </div>
            </a>
          ))}
        </div>

        <div style={{ paddingTop: '28px', borderTop: '1px solid #3d3931', maxWidth: '680px' }}>
          <div className="mono" style={{ fontSize: '11px', color: '#8a8472', lineHeight: 1.7 }}>
            Cada protocolo, norma y herramienta que aparece adentro es extensión plausible de algo que existe hoy. Los personajes y los despliegues son ficticios. Las fuentes externas, las regulaciones y los papers citados — Rye &amp; Levin 2024, ANMaC, ENACOM, FOPEA, CPJ, Berkeley Protocol, C2PA — son reales.
          </div>
          <div className="mono" style={{ fontSize: '11px', color: '#8a8472', marginTop: '14px', lineHeight: 1.7 }}>
            La línea vigente se actualiza sola los lunes con señales del mundo real. Las dos congeladas son probes fijos en el tiempo.
          </div>
          <div className="mono" style={{ fontSize: '11px', color: '#8a8472', marginTop: '18px', lineHeight: 1.7 }}>
            Un trabajo liderado por <a href="https://www.nicolasbronzina.com/" target="_blank" rel="noreferrer" className="esc-link-foot">Nicolás Bronzina</a>.
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
