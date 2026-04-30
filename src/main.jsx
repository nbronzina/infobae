import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import Shell, { DeviceFrame } from './Shell.jsx';
import escenariosData from './data/escenarios.json';
import checklistData from './data/checklist_predespliegue.json';

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
        className="bitacora-scroll"
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
          <strong>Infobae · Bitácora</strong> es una obra de ficción interactiva que explora el futuro cercano del periodismo de investigación y la corresponsalía internacional argentina a través del kit operativo de uno de sus medios icónicos — Infobae — en 2029.
        </div>
        <div className="serif" style={{ fontSize: '14.5px', lineHeight: 1.6, color: '#1f1f1f', marginBottom: '14px' }}>
          Es un <em>diegetic prototype</em>: la ficción está en que el sistema existe, no en lo que dice. Cada protocolo, norma y herramienta es extensión plausible de algo que existe hoy. Los personajes y los despliegues son ficticios. Las fuentes externas, las regulaciones y los papers citados son reales.
        </div>
        <div className="serif" style={{ fontSize: '14.5px', lineHeight: 1.6, color: '#1f1f1f', marginBottom: '14px' }}>
          El artefacto es un kit operativo local que corre offline en dos dispositivos: un GrapheneOS (Pixel) para campo y un e-ink (Boox) para redacción. El objeto real y el objeto ficticio son el mismo. La herramienta que el jugador usa es la herramienta que el personaje usa.
        </div>
        <div className="serif" style={{ fontSize: '14.5px', lineHeight: 1.6, color: '#1f1f1f', marginBottom: '18px' }}>
          Tres escenarios como livre-jeu interactivo: corresponsalía internacional en zona de conflicto (Arauca/Apure), investigación de narcotráfico doméstico (Rosario), y contra-vigilancia por inteligencia estatal (Buenos Aires). Cada escenario tiene 5 objetivos con decisiones que generan consecuencias demoradas.
        </div>

        <div style={{ padding: '14px 16px', backgroundColor: '#f0ecde', borderLeft: '2px solid #5a544c', marginBottom: '18px' }}>
          <div className="mono" style={{ fontSize: '10.5px', color: '#5a544c', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>Preguntas que abre este artefacto</div>
          <ul className="serif" style={{ fontSize: '13px', lineHeight: 1.6, color: '#1f1f1f', margin: 0, paddingLeft: '18px' }}>
            <li>¿Qué responsabilidad tienen los medios de traducir investigación técnica sobre vigilancia a doctrina operativa cuando los organismos internacionales no lo hacen?</li>
            <li>¿Cómo se regula la detección pasiva de infraestructura satelital civil, si hoy no hay marco?</li>
            <li>¿Qué protección concreta existe para fixers y colaboradores locales frente a reconocimiento facial en checkpoints — y quién los protege cuando el corresponsal se va?</li>
            <li>¿Puede una redacción civil asumir la carga de OPSEC militar sin perder su función periodística?</li>
            <li>¿La vigilancia estatal doméstica sobre periodistas de investigación es un riesgo ocupacional asumible, o una condición que exige respuesta colectiva de la profesión?</li>
            <li>¿Por qué el entrenamiento operacional de periodistas sigue siendo presencial cada 3 años cuando las fuerzas armadas ya tienen simuladores interactivos permanentes?</li>
            <li>¿Quién construiría un sistema así en la realidad — el medio, FOPEA, CPJ, o el Estado que también es adversario en una de las líneas de investigación?</li>
            <li>¿Tiene sentido seguir separando al corresponsal de guerra del periodista de investigación cuando enfrentan las mismas amenazas con las mismas herramientas?</li>
          </ul>
        </div>

        <div style={{ marginBottom: '18px', paddingTop: '14px', borderTop: '1px solid #d9d4c2' }}>
          <div className="serif" style={{ fontSize: '13px', lineHeight: 1.55, color: '#1f1f1f', marginBottom: '10px' }}>
            <strong>Método.</strong> Design fiction + rapid prototyping. Tradición Near Future Laboratory / Superflux / Nick Foster.
          </div>
          <div className="serif" style={{ fontSize: '13px', lineHeight: 1.55, color: '#1f1f1f', marginBottom: '10px' }}>
            <strong>Referentes de juego.</strong> Soldier's Companion (DefTech/armasuisse), In 90 Days (Humanitarian Leadership Academy), Papers Please, This War of Mine.
          </div>
          <div className="serif" style={{ fontSize: '13px', lineHeight: 1.55, color: '#1f1f1f' }}>
            <strong>Fuentes verificadas.</strong> Rye &amp; Levin IEEE S&amp;P 2024, ANMaC, ENACOM, FOPEA, CPJ, Berkeley Protocol, C2PA, Dart Center, InSight Crime, RSF Round-Up 2025 (60 periodistas asesinados en actividad — Palestina 25, México 9, Iraq / Siria / Ucrania como teatros recurrentes).
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

function readLS(key, fallback) {
  if (typeof localStorage === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function computeHomeStatus() {
  const checklistTicks = readLS('infobae:checklist', {});
  const obligatorios = checklistData.filter(i => i.obligatorio);
  const obligHechos = obligatorios.filter(i => checklistTicks[i.id]).length;
  const obligTotal = obligatorios.length;
  // "Alertas activas" se computan como placeholder 0 hasta que el
  // tab ESTADO defina la lógica concreta. El mensaje sin leer de
  // Zelaya es diegético: siempre 1 porque el briefing existe como
  // último mensaje descargado antes de desconectar.
  return {
    mensajesSinLeer: 1,
    alertasActivas: 0,
    obligHechos,
    obligTotal
  };
}

function HomeView({ onEnter, onOpenAbout }) {
  const [status] = useState(() => computeHomeStatus());
  const timerRef = useRef(null);
  const cancel = () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } };
  const wordmarkHandlers = {
    onPointerDown: () => { cancel(); timerRef.current = setTimeout(() => { onOpenAbout(); timerRef.current = null; }, 700); },
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onContextMenu: (e) => e.preventDefault()
  };

  const onEnterKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onEnter(); } };

  const monoStack = "'JetBrains Mono', Consolas, monospace";
  const textPrimary = '#1f1f1f';
  const textMeta = '#5a544c';
  const textDim = '#8a8472';

  return (
    <div style={{
      height: '100%',
      color: textPrimary,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '40px 32px', boxSizing: 'border-box', fontFamily: monoStack
    }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        {/* Wordmark — long-press abre el modal */}
        <div
          {...wordmarkHandlers}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none',
            cursor: 'pointer', marginBottom: '28px'
          }}
          title="Long-press para notas del proyecto"
        >
          <img src="/infobae-logo.png" alt="infobae" draggable={false}
            style={{ height: '24px', width: 'auto', display: 'block', pointerEvents: 'none' }} />
          <span style={{
            fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase',
            color: textPrimary, fontWeight: 500
          }}>
            Bitácora
          </span>
        </div>

        {/* Metadata del sistema */}
        <div style={{ fontSize: '11.5px', color: textMeta, lineHeight: 1.9, marginBottom: '22px' }}>
          <div>sistema operativo local · v4.2</div>
          <div>última sync: 2029-04-14 · 09:17 ART</div>
          <div>estado de red: <span style={{ color: textPrimary }}>sin conexión</span></div>
          <div>dispositivo: <span style={{ color: textPrimary }}>verificado</span></div>
        </div>

        <div style={{ color: textDim, fontSize: '11.5px', marginBottom: '22px', letterSpacing: '0.08em' }}>
          —
        </div>

        {/* Inbox summary */}
        <div style={{ fontSize: '11.5px', color: textPrimary, lineHeight: 1.9, marginBottom: '36px' }}>
          <div>{status.mensajesSinLeer} {status.mensajesSinLeer === 1 ? 'mensaje sin leer' : 'mensajes sin leer'}</div>
          <div style={{ color: textMeta }}>{status.alertasActivas} alertas activas</div>
          <div style={{ color: textMeta }}>checklist: {status.obligHechos}/{status.obligTotal} completos</div>
        </div>

        {/* Único elemento interactivo */}
        <div
          role="button"
          tabIndex={0}
          onClick={onEnter}
          onKeyDown={onEnterKey}
          style={{
            cursor: 'pointer', fontSize: '12px', letterSpacing: '0.12em',
            color: textPrimary, fontWeight: 500,
            textTransform: 'lowercase',
            display: 'inline-block'
          }}
        >
          abrir ↓
        </div>
      </div>
    </div>
  );
}

const LINEAS = [
  {
    slug: 'internacional',
    codigo: 'INT · ARQ-042 · arauca/apure',
    estado: 'cerrada',
    actividad: 'descanso obligatorio hasta mayo',
    ultimaActividad: '2029-04-02',
    notaZelaya: 'no insistas con villafañe.'
  },
  {
    slug: 'rosario',
    codigo: 'NAC · ROS-038 · rosario',
    estado: 'activa',
    actividad: 'osint en curso',
    ultimaActividad: '2029-04-16',
    notaZelaya: 'la amenaza al colega es real. fopea activó protocolo. coordiná contra-vigilancia antes de moverte.'
  },
  {
    slug: 'inteligencia',
    codigo: 'NAC · ANA-047 · anaconda-2',
    estado: 'congelada',
    actividad: 'sin movimiento desde 04-17',
    ultimaActividad: '2029-03-28',
    notaZelaya: 'dispositivo limpio y pollastri desde el minuto cero. ya sabés.'
  }
];

const ESTADO_COLORES = {
  cerrada: '#8a6d2b',
  activa: '#5a6e3c',
  congelada: '#bd2828'
};

function BriefingView({ onSelect }) {
  const monoStack = "'JetBrains Mono', Consolas, monospace";
  const serifStack = "'Fraunces', Georgia, serif";
  const textPrimary = '#1f1f1f';
  const textMeta = '#5a544c';
  const textDim = '#8a8472';
  const accent = '#f18b1e';

  return (
    <div className="bitacora-scroll" style={{ height: '100%', overflowY: 'auto', color: textPrimary, padding: '44px 32px 48px', fontFamily: monoStack, boxSizing: 'border-box' }}>
      <style>{`
        .linea-block { cursor: pointer; background: none; border: none; padding: 0; margin: 0; text-align: left; width: 100%; display: block; color: inherit; font: inherit; }
        .linea-block:focus-visible { outline: 2px solid ${textPrimary}; outline-offset: 4px; }
      `}</style>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ fontSize: '11.5px', letterSpacing: '0.08em', textTransform: 'uppercase', color: textMeta, marginBottom: '22px' }}>
          Líneas activas · {LINEAS.length}
        </div>

        <Separador color={textDim} />

        {LINEAS.map((l) => (
          <React.Fragment key={l.slug}>
            <button type="button" className="linea-block" onClick={() => onSelect(l.slug)}>
              <div style={{ padding: '20px 0' }}>
                <div style={{ fontSize: '11.5px', color: textMeta, letterSpacing: '0.04em', marginBottom: '8px' }}>
                  {l.codigo}
                </div>
                <div style={{ fontSize: '12px', lineHeight: 1.6, marginBottom: '4px' }}>
                  <span style={{ color: ESTADO_COLORES[l.estado], fontWeight: 500 }}>{l.estado}</span>
                  <span style={{ color: textMeta }}> — {l.actividad}</span>
                </div>
                <div style={{ fontSize: '11px', color: textDim, marginBottom: '14px' }}>
                  última actividad: {l.ultimaActividad}
                </div>
                <div style={{ fontFamily: serifStack, fontSize: '13.5px', fontStyle: 'italic', color: textPrimary, lineHeight: 1.5, marginBottom: '14px', maxWidth: '38em' }}>
                  <span style={{ color: textMeta, fontStyle: 'normal', fontFamily: monoStack, fontSize: '11px', marginRight: '6px' }}>zelaya 04-17:</span>
                  {l.notaZelaya}
                </div>
                <div style={{ fontSize: '12px', color: accent, letterSpacing: '0.06em', fontWeight: 500 }}>
                  abrir →
                </div>
              </div>
            </button>
            <Separador color={textDim} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function Separador({ color }) {
  return (
    <div style={{ color, fontSize: '11.5px', letterSpacing: '0.08em' }}>—</div>
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
    if (typeof window === 'undefined') return;
    // Al entrar a una línea, limpiar toda la partida previa de ese
    // escenario. Cada línea empieza de cero — sin checklist
    // arrastrado, sin fuentes pegadas, sin diario heredado.
    try {
      localStorage.removeItem('infobae:checklist');
      localStorage.removeItem('infobae:fuentes');
      localStorage.removeItem('infobae:diario');
      localStorage.removeItem(`infobae:mision_${slug}`);
      localStorage.removeItem('infobae:teatro_seleccionado');
      localStorage.removeItem('infobae:docs_leidos');
    } catch {}
    window.location.href = '/' + slug;
  };

  return (
    <div style={{ height: '100%' }}>
      <style>{`
        .serif { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        .mono { font-family: 'JetBrains Mono', Consolas, monospace; }
      `}</style>
      {view === 'home' && (
        <HomeView onEnter={() => setView('briefing')} onOpenAbout={() => setAboutOpen(true)} />
      )}
      {view === 'briefing' && (
        <BriefingView onSelect={goToScenario} />
      )}
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
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

  if (!scenario) {
    // Home + briefing viven dentro del frame e-ink. Mondini los
    // lee desde su Boox en Buenos Aires, antes de elegir línea.
    return <DeviceFrame modo="redaccion"><ScenarioIndex /></DeviceFrame>;
  }
  return <Shell scenario={scenario} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  </React.StrictMode>
);
