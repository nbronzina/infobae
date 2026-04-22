import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Shell from './Shell.jsx';
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

function AboutModal({ onClose }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); onClose(); } }}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(31,31,31,0.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2', maxWidth: '560px', width: '100%', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto', padding: '36px 40px', fontFamily: "'IBM Plex Sans', system-ui, sans-serif", cursor: 'default' }}
      >
        <div className="mono" style={{ fontSize: '10.5px', color: '#5a544c', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '14px' }}>
          Nota del proyecto · rompe diegesis
        </div>
        <h2 className="serif" style={{ fontSize: '22px', fontWeight: 500, margin: '0 0 14px', letterSpacing: '-0.01em' }}>
          Sobre este artefacto
        </h2>
        <div className="serif" style={{ fontSize: '14.5px', lineHeight: 1.6, color: '#1f1f1f', marginBottom: '14px' }}>
          <strong>Infobae · Bitácora</strong> es una obra de ficción que explora el futuro cercano del periodismo de investigación y la corresponsalía internacional argentina a través del kit operativo de uno de sus medios icónicos —Infobae— en 2029. Un trabajo liderado por Nicolás Bronzina.
        </div>
        <div className="serif" style={{ fontSize: '14.5px', lineHeight: 1.6, color: '#1f1f1f', marginBottom: '14px' }}>
          Es un <em>diegetic prototype</em>: la ficción está en que el sistema existe, no en lo que dice. Pregunta cómo podría organizarse una redacción argentina para cubrir investigación doméstica y corresponsalía internacional en un contexto donde la vigilancia, la autenticidad del contenido y la seguridad operativa de periodistas se volvieron condiciones cotidianas del trabajo.
        </div>
        <div className="serif" style={{ fontSize: '14.5px', lineHeight: 1.6, color: '#1f1f1f', marginBottom: '18px' }}>
          Cada protocolo, norma y herramienta es extensión plausible de algo que existe hoy. Los personajes y los despliegues son ficticios. Las fuentes externas, las regulaciones y los papers citados son reales.
        </div>

        <div style={{ padding: '14px 16px', backgroundColor: '#f0ecde', borderLeft: '2px solid #5a544c', marginBottom: '18px' }}>
          <div className="mono" style={{ fontSize: '10.5px', color: '#5a544c', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>Preguntas que abre este artefacto</div>
          <ul className="serif" style={{ fontSize: '13px', lineHeight: 1.6, color: '#1f1f1f', margin: 0, paddingLeft: '18px' }}>
            <li>¿Qué responsabilidad tienen los medios de traducir investigación técnica sobre vigilancia a doctrina operativa cuando los organismos internacionales no lo hacen?</li>
            <li>¿Cómo se regula la detección pasiva de infraestructura satelital civil, si hoy no hay marco?</li>
            <li>¿Qué protección concreta existe para fixers y colaboradores locales frente a reconocimiento facial en checkpoints?</li>
            <li>¿Puede una redacción civil asumir la carga de OPSEC militar sin perder su función periodística?</li>
            <li>¿La vigilancia estatal doméstica sobre periodistas de investigación es un riesgo ocupacional asumible, o una condición que exige respuesta colectiva de la profesión?</li>
          </ul>
        </div>

        <div style={{ marginBottom: '18px', paddingTop: '14px', borderTop: '1px solid #d9d4c2' }}>
          <div className="serif" style={{ fontSize: '13px', lineHeight: 1.55, color: '#1f1f1f', marginBottom: '12px' }}>
            <strong>Método.</strong> Design fiction + rapid prototyping.
          </div>
          <div className="serif" style={{ fontSize: '13px', lineHeight: 1.55, color: '#1f1f1f' }}>
            <strong>Tecnología.</strong> React + Vite. Datos en JSON local. Function serverless en Vercel para el horizon scanning semanal con la API de Claude (web search → generación → validación → consolidación → commit vía GitHub Data API). Tres líneas de planificación servidas como rutas distintas (<em>/internacional</em>, <em>/rosario</em>, <em>/inteligencia</em>) sobre la misma codebase.
          </div>
        </div>

        <div className="mono" style={{ fontSize: '12px', color: '#1f1f1f', paddingTop: '14px', borderTop: '1px solid #d9d4c2', lineHeight: 1.7 }}>
          Ideado, diseñado y codificado por <strong><a href="https://www.nicolasbronzina.com/" target="_blank" rel="noreferrer" style={{ color: '#1f1f1f', borderBottom: '1px solid #1f1f1f', textDecoration: 'none' }}>Nicolás Bronzina</a></strong>.
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={onClose}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClose(); } }}
          className="mono"
          style={{ marginTop: '24px', display: 'inline-block', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '8px 14px', border: '1px solid #d9d4c2', cursor: 'pointer', color: '#1f1f1f', backgroundColor: '#f0ecde' }}
        >
          Cerrar
        </div>
      </div>
    </div>
  );
}

function HomeView({ onEnter, onOpenAbout }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1f1f1f', color: '#f0ede4', display: 'flex', flexDirection: 'column', padding: '32px', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px' }}>
          <img src="/infobae-logo.png" alt="infobae" style={{ height: '34px', width: 'auto', display: 'block' }} />
          <span className="mono" style={{ fontSize: '14px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#f0ede4', fontWeight: 500 }}>
            Bitácora
          </span>
        </div>

        <div style={{ fontFamily: "'JetBrains Mono', Consolas, monospace", fontSize: '13px', letterSpacing: '0.04em', color: '#8a8472', marginBottom: '56px' }}>
          Tres escenarios. Un corresponsal.
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={onEnter}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEnter(); } }}
          className="mono"
          style={{ cursor: 'pointer', padding: '14px 36px', fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 500, backgroundColor: '#f0ede4', color: '#1f1f1f', border: '1px solid #f0ede4', marginBottom: '18px' }}
        >
          Entrar
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={onOpenAbout}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenAbout(); } }}
          className="mono"
          style={{ cursor: 'pointer', fontSize: '11px', letterSpacing: '0.06em', color: '#8a8472', borderBottom: '1px dotted #5a544c', paddingBottom: '1px' }}
        >
          Sobre este artefacto
        </div>
      </div>

      <div style={{ fontFamily: "'JetBrains Mono', Consolas, monospace", fontSize: '10.5px', color: '#5a544c', textAlign: 'center', letterSpacing: '0.04em' }}>
        Nicolás Bronzina · 2025
      </div>
    </div>
  );
}

function BriefingView({ onSelect, onOpenAbout }) {
  const opciones = [
    { slug: 'internacional', label: 'Línea internacional' },
    { slug: 'rosario', label: 'Línea nacional · Rosario' },
    { slug: 'inteligencia', label: 'Línea nacional · Inteligencia' }
  ];
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f5ec', color: '#1f1f1f', padding: '56px 32px 40px', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      <style>{`
        .brief-link { cursor: pointer; background: none; border: none; font: inherit; color: inherit; padding: 0; text-align: left; }
        .brief-link:focus-visible { outline: 2px solid #1f1f1f; outline-offset: 3px; }
      `}</style>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '48px' }}>
          <img src="/infobae-logo.png" alt="infobae" style={{ height: '28px', width: 'auto', display: 'block' }} />
          <span className="mono" style={{ fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1f1f1f', fontWeight: 500 }}>
            Bitácora
          </span>
        </div>

        <article style={{ backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2', padding: '28px 32px', marginBottom: '28px' }}>
          <div className="mono" style={{ fontSize: '10.5px', color: '#5a544c', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Correo interno · canal redacción
          </div>
          <div className="mono" style={{ fontSize: '12px', color: '#1f1f1f', lineHeight: 1.9, marginBottom: '18px' }}>
            <div><span style={{ color: '#5a544c' }}>De:</span> f. zelaya (editor de guardia · Madrid)</div>
            <div><span style={{ color: '#5a544c' }}>Para:</span> mondini.l</div>
            <div><span style={{ color: '#5a544c' }}>Asunto:</span> Estado de líneas — semana 16</div>
            <div><span style={{ color: '#5a544c' }}>Fecha:</span> 2029-04-17 · 08:42 ART</div>
          </div>
          <div style={{ height: '1px', backgroundColor: '#d9d4c2', marginBottom: '18px' }} />
          <div className="serif" style={{ fontSize: '15px', lineHeight: 1.65, color: '#1f1f1f' }}>
            <p style={{ margin: '0 0 14px' }}>Mondini,</p>
            <p style={{ margin: '0 0 14px' }}>
              Internacional está en standby post-Arauca. Descanso obligatorio hasta mayo, la próxima ventana todavía en evaluación con operaciones.
            </p>
            <p style={{ margin: '0 0 14px' }}>
              Rosario sigue activa. FOPEA en alerta por la amenaza al colega local, OSINT en curso sobre registros inmobiliarios. Si seguís por ahí, coordiná con villafañe el protocolo de contra-vigilancia urbana.
            </p>
            <p style={{ margin: '0 0 14px' }}>
              Inteligencia sin movimiento — Anaconda-2 congelado desde el 17. Si abrís la línea, dispositivo aire y custodia legal externa por pollastri desde el primer contacto.
            </p>
            <p style={{ margin: '0 0 4px' }}>
              ¿En qué línea operás esta semana?
            </p>
            <p className="mono" style={{ margin: '24px 0 0', fontSize: '11.5px', color: '#5a544c' }}>— zelaya</p>
          </div>
        </article>

        <div style={{ marginBottom: '36px' }}>
          <div className="mono" style={{ fontSize: '10.5px', color: '#5a544c', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>
            Responder · elegir línea
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {opciones.map((o, idx) => (
              <button
                key={o.slug}
                type="button"
                onClick={() => onSelect(o.slug)}
                className="brief-link serif"
                style={{ fontSize: '17px', fontWeight: 500, color: '#1f1f1f', padding: '14px 0', borderTop: '1px solid #d9d4c2', borderBottom: idx === opciones.length - 1 ? '1px solid #d9d4c2' : 'none', letterSpacing: '-0.01em' }}
              >
                → {o.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div
            role="button"
            tabIndex={0}
            onClick={onOpenAbout}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenAbout(); } }}
            className="mono"
            style={{ display: 'inline-block', cursor: 'pointer', fontSize: '11px', letterSpacing: '0.06em', color: '#5a544c', borderBottom: '1px dotted #8a8472', paddingBottom: '1px' }}
          >
            Sobre este artefacto
          </div>
        </div>
      </div>
    </div>
  );
}

function ScenarioIndex() {
  const [view, setView] = useState('home');
  const [aboutOpen, setAboutOpen] = useState(false);

  useEffect(() => {
    if (!aboutOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setAboutOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [aboutOpen]);

  const goToScenario = (slug) => {
    if (typeof window !== 'undefined') window.location.href = '/' + slug;
  };

  return (
    <>
      <style>{`
        .serif { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        .mono { font-family: 'JetBrains Mono', Consolas, monospace; }
      `}</style>
      {view === 'home' && (
        <HomeView onEnter={() => setView('briefing')} onOpenAbout={() => setAboutOpen(true)} />
      )}
      {view === 'briefing' && (
        <BriefingView onSelect={goToScenario} onOpenAbout={() => setAboutOpen(true)} />
      )}
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
    </>
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
  return <Shell scenario={scenario} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  </React.StrictMode>
);
