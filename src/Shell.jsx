import React, { useEffect, useRef, useState } from 'react';
import HerramientasView from './herramientas/index.jsx';
import DocsView from './DocsView.jsx';
import EstadoView from './EstadoView.jsx';
import MisionView from './MisionView.jsx';

const TABS = [
  { id: 'mision', label: 'MISIÓN', labelCampo: 'MISIÓN' },
  { id: 'herramientas', label: 'HERRAMIENTAS', labelCampo: 'HERRAM.' },
  { id: 'docs', label: 'DOCS', labelCampo: 'DOCS' },
  { id: 'estado', label: 'ESTADO', labelCampo: 'ESTADO' }
];

function useModo(defaultModo = 'redaccion') {
  // El default lo decide el contexto narrativo (qué línea abrió la
  // corresponsal). El override manual vía long-press en wordmark o
  // en la barra de tabs queda persistido en localStorage.
  const [modoForzado, setModoForzadoState] = useState(() => {
    if (typeof localStorage === 'undefined') return null;
    try {
      const v = localStorage.getItem('infobae:modo');
      return v === 'campo' || v === 'redaccion' ? v : null;
    } catch { return null; }
  });

  const setModoForzado = (value) => {
    setModoForzadoState(value);
    try {
      if (value === null) localStorage.removeItem('infobae:modo');
      else localStorage.setItem('infobae:modo', value);
    } catch {}
  };

  const modo = modoForzado ?? defaultModo;
  const toggle = () => setModoForzado(modo === 'campo' ? 'redaccion' : 'campo');
  const reset = () => setModoForzado(null);
  return { modo, modoForzado, toggle, reset };
}

function useLongPress(onLongPress, ms = 600) {
  const timer = useRef(null);
  const triggered = useRef(false);
  const start = () => {
    triggered.current = false;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { triggered.current = true; onLongPress(); }, ms);
  };
  const cancel = () => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
  };
  return {
    handlers: {
      onPointerDown: start,
      onPointerUp: cancel,
      onPointerLeave: cancel,
      onPointerCancel: cancel,
      onContextMenu: (e) => { e.preventDefault(); }
    },
    wasTriggered: () => triggered.current
  };
}

function Wordmark({ onLongPress, darkBg }) {
  const lp = useLongPress(onLongPress);
  const textColor = darkBg ? '#f0ede4' : '#1f1f1f';
  return (
    <div
      {...lp.handlers}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '12px',
        userSelect: 'none', WebkitUserSelect: 'none', cursor: 'pointer',
        WebkitTouchCallout: 'none'
      }}
      title="Long-press para cambiar de modo"
    >
      <img
        src="/infobae-logo.png"
        alt="infobae"
        draggable={false}
        style={{ height: darkBg ? '26px' : '24px', width: 'auto', display: 'block', pointerEvents: 'none' }}
      />
      <span
        style={{
          fontFamily: "'JetBrains Mono', Consolas, monospace",
          fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase',
          color: textColor, fontWeight: 500
        }}
      >
        Bitácora
      </span>
    </div>
  );
}

function Placeholder({ tabId, modo }) {
  const tab = TABS.find(t => t.id === tabId) || TABS[0];
  const darkBg = modo === 'campo';
  const labelColor = darkBg ? '#8a8472' : '#5a544c';
  const titleColor = darkBg ? '#e8e4db' : '#1f1f1f';
  const bodyColor = darkBg ? '#e8e4db' : '#1f1f1f';
  return (
    <section>
      <div
        style={{
          fontFamily: "'JetBrains Mono', Consolas, monospace",
          fontSize: '10.5px', letterSpacing: '0.08em', textTransform: 'uppercase',
          color: labelColor, marginBottom: '14px'
        }}
      >
        {tab.label}
      </div>
      <h1
        style={{
          fontFamily: "'Fraunces', Georgia, serif",
          fontSize: darkBg ? '22px' : '26px', fontWeight: 500,
          color: titleColor, lineHeight: 1.3, margin: '0 0 14px', letterSpacing: '-0.01em'
        }}
      >
        {tab.label} — placeholder
      </h1>
      <p
        style={{
          fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
          fontSize: darkBg ? '15px' : '15px', lineHeight: darkBg ? 1.6 : 1.7,
          color: bodyColor, margin: 0, maxWidth: darkBg ? 'none' : '38em'
        }}
      >
        Sección pendiente de implementación. El contenido se conecta al
        modelo de misiones definido en MISSIONS.md y a las herramientas
        operativas ya existentes. La capa de presentación se rige por
        DESIGN-MODES.md.
      </p>
    </section>
  );
}

function ViewSwitch({ activeView, modo, scenario, onOpenDoc, onOpenPerfil, docRequest, onMisionBadgesChange }) {
  if (activeView === 'mision') {
    return <MisionView modo={modo} scenario={scenario} onBadgesChange={onMisionBadgesChange} />;
  }
  if (activeView === 'herramientas') {
    return <HerramientasView modo={modo} onOpenDoc={onOpenDoc} onOpenPerfil={onOpenPerfil} />;
  }
  if (activeView === 'docs') {
    return <DocsView modo={modo} request={docRequest} />;
  }
  if (activeView === 'estado') {
    return <EstadoView modo={modo} scenario={scenario} />;
  }
  return <Placeholder tabId={activeView} modo={modo} />;
}

function CampoShell({ activeView, setActiveView, onToggleModo, onOpenDoc, onOpenPerfil, docRequest, scenario, misionBadges, onMisionBadgesChange }) {
  const tabsLongPress = useLongPress(onToggleModo, 700);
  return (
    <div
      style={{
        height: '100%',
        backgroundColor: '#0d0d0d', color: '#e8e4db',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
        overflow: 'hidden'
      }}
    >
      <div style={{ padding: '14px 16px 4px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <img src="/infobae-logo.png" alt="infobae" draggable={false}
          style={{ height: '16px', width: 'auto', display: 'block', pointerEvents: 'none' }} />
        <span style={{
          fontFamily: "'JetBrains Mono', Consolas, monospace",
          fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase',
          color: '#8a8472', fontWeight: 500
        }}>
          Bitácora
        </span>
      </div>
      <main className="bitacora-scroll" style={{ flex: 1, padding: '8px 16px 16px', overflowY: 'auto', minHeight: 0 }}>
        <ViewSwitch activeView={activeView} modo="campo" scenario={scenario} onOpenDoc={onOpenDoc} onOpenPerfil={onOpenPerfil} docRequest={docRequest} onMisionBadgesChange={onMisionBadgesChange} />
      </main>
      <nav
        {...tabsLongPress.handlers}
        style={{
          flexShrink: 0,
          backgroundColor: '#0d0d0d', borderTop: '1px solid #262626',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none'
        }}
      >
        {TABS.map(t => {
          const active = activeView === t.id;
          const showBadge = (misionBadges || []).includes(t.id) && !active;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveView(t.id)}
              style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                padding: '10px 4px', minHeight: '48px',
                color: active ? '#f18b1e' : '#8a8472',
                fontFamily: "'JetBrains Mono', Consolas, monospace",
                fontSize: '8.5px', letterSpacing: '0.12em', fontWeight: active ? 600 : 400,
                borderTop: active ? '1px solid #f18b1e' : '1px solid transparent',
                marginTop: '-1px', position: 'relative'
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                {t.labelCampo}
                {showBadge && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f18b1e', display: 'inline-block' }} />}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function RedaccionShell({ activeView, setActiveView, onToggleModo, onOpenDoc, onOpenPerfil, docRequest, scenario, misionBadges, onMisionBadgesChange }) {
  return (
    <div
      className="bitacora-scroll"
      style={{
        height: '100%',
        overflowY: 'auto',
        backgroundColor: '#f8f5ec', color: '#1f1f1f',
        fontFamily: "'Fraunces', Georgia, serif"
      }}
    >
      <header
        style={{
          maxWidth: '680px', margin: '0 auto', padding: '32px 36px 14px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          flexWrap: 'wrap', gap: '14px'
        }}
      >
        <Wordmark onLongPress={onToggleModo} />
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'baseline' }}>
          {TABS.map(t => {
            const active = activeView === t.id;
            const showBadge = (misionBadges || []).includes(t.id) && !active;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveView(t.id)}
                style={{
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  padding: '4px 0',
                  color: active ? '#1f1f1f' : '#8a8472',
                  fontFamily: "'Fraunces', Georgia, serif",
                  fontSize: '13px', letterSpacing: '0.01em',
                  fontStyle: active ? 'normal' : 'italic',
                  fontWeight: 400,
                  textTransform: 'lowercase',
                  borderBottom: active ? '1px solid #1f1f1f' : '1px solid transparent',
                  display: 'inline-flex', alignItems: 'center', gap: '6px'
                }}
              >
                {t.label.toLowerCase()}
                {showBadge && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#f18b1e', display: 'inline-block' }} />}
              </button>
            );
          })}
        </nav>
      </header>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 36px' }}>
        <div style={{ borderTop: '1px solid #c9c1ab', height: '1px' }} />
      </div>
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '36px 36px 72px' }}>
        <ViewSwitch activeView={activeView} modo="redaccion" scenario={scenario} onOpenDoc={onOpenDoc} onOpenPerfil={onOpenPerfil} docRequest={docRequest} onMisionBadgesChange={onMisionBadgesChange} />
      </main>
    </div>
  );
}

// Mapa narrativo escenario → dispositivo default. Internacional
// abre en campo (Pixel en Arauca). Las dos líneas domésticas abren
// en redacción (Boox en Buenos Aires).
const DEFAULT_MODO_POR_ESCENARIO = {
  internacional: 'campo',
  rosario: 'redaccion',
  inteligencia: 'redaccion'
};

export default function Shell({ scenario }) {
  const defaultModo = DEFAULT_MODO_POR_ESCENARIO[scenario] || 'redaccion';
  const { modo, toggle } = useModo(defaultModo);
  const [activeView, setActiveViewRaw] = useState('mision');
  const [docRequest, setDocRequest] = useState(null);
  // Badges que la misión pide mostrar en los tabs (["herramientas",
  // "docs"]). Se limpia cuando el jugador abre la tab
  // correspondiente — regla 3 del brief de misiones.
  const [misionBadges, setMisionBadges] = useState([]);
  const [badgesLimpiados, setBadgesLimpiados] = useState([]);

  const setActiveView = (v) => {
    setActiveViewRaw(v);
    // Al abrir una tab que tiene badge activo, lo limpiamos para
    // esta sesión del nodo.
    if (misionBadges.includes(v) && !badgesLimpiados.includes(v)) {
      setBadgesLimpiados(prev => [...prev, v]);
    }
  };

  const onMisionBadgesChange = (badges) => {
    setMisionBadges(badges || []);
    setBadgesLimpiados([]); // reset al cambiar de nodo
  };

  const badgesActivos = misionBadges.filter(b => !badgesLimpiados.includes(b));

  const openDoc = (key) => {
    if (!key) return;
    setActiveView('docs');
    setDocRequest({ type: 'doc', key, t: Date.now() });
  };
  const openPerfil = (key) => {
    if (!key) return;
    setActiveView('docs');
    setDocRequest({ type: 'perfil', key, t: Date.now() });
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch { /* noop */ } };
  }, []);

  const sharedProps = {
    activeView, setActiveView, onToggleModo: toggle,
    onOpenDoc: openDoc, onOpenPerfil: openPerfil, docRequest,
    scenario, misionBadges: badgesActivos, onMisionBadgesChange
  };

  const shell = modo === 'campo'
    ? <CampoShell {...sharedProps} />
    : <RedaccionShell {...sharedProps} />;

  return <DeviceFrame modo={modo}>{shell}</DeviceFrame>;
}

// Frame de dispositivo. Siempre visible: el contenido vive adentro
// del dispositivo en todos los contextos de visualización. En
// viewports chicos el frame se adapta por aspect-ratio.
export function DeviceFrame({ modo, children }) {
  const frame = modo === 'campo' ? <PixelFrame>{children}</PixelFrame> : <BooxFrame>{children}</BooxFrame>;
  return (
    <>
      <style>{`
        .bitacora-scroll { scrollbar-width: none; -ms-overflow-style: none; }
        .bitacora-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
      `}</style>
      {frame}
    </>
  );
}

function PixelFrame({ children }) {
  // Proporción Pixel aprox. 414 × 870. El contenedor mantiene
  // aspect-ratio y se escala al viewport disponible (ancho limitado
  // a 414, alto limitado a calc(100vh - 48px), el que sea más
  // restrictivo manda).
  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#1a1a1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', boxSizing: 'border-box'
    }}>
      <div style={{
        width: 'min(414px, calc(100vw - 32px))',
        maxHeight: 'calc(100vh - 48px)',
        aspectRatio: '414 / 870',
        backgroundColor: '#111',
        borderRadius: '28px',
        padding: '14px 12px 20px',
        position: 'relative',
        boxShadow: '0 30px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04) inset',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Notch (pill centrado arriba, sobre el bisel) */}
        <div style={{
          position: 'absolute', top: '6px', left: '50%', transform: 'translateX(-50%)',
          width: '104px', height: '22px',
          backgroundColor: '#050505', borderRadius: '12px',
          zIndex: 3, pointerEvents: 'none'
        }} />
        {/* Screen interior */}
        <div style={{
          flex: 1,
          borderRadius: '18px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#0d0d0d'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function BooxFrame({ children }) {
  // Proporción Boox portrait aprox. 820 × 1060. Mismo principio de
  // aspect-ratio + cap vertical.
  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#1a1a1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', boxSizing: 'border-box'
    }}>
      <div style={{
        width: 'min(820px, calc(100vw - 32px))',
        maxHeight: 'calc(100vh - 48px)',
        aspectRatio: '820 / 1060',
        backgroundColor: '#e8e5dc',
        borderRadius: '14px',
        padding: '22px 20px 22px',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.08)',
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column'
      }}>
        {/* Punto de cámara arriba, centrado, en el bisel */}
        <div style={{
          position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)',
          width: '6px', height: '6px',
          backgroundColor: '#5a5650', borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        {/* Screen interior — e-ink paper */}
        <div style={{
          flex: 1,
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#f8f5ec',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.06) inset'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
