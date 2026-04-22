import React, { useEffect, useRef, useState } from 'react';
import HerramientasView from './herramientas/index.jsx';
import DocsView from './DocsView.jsx';
import EstadoView from './EstadoView.jsx';

const TABS = [
  { id: 'mision', label: 'MISIÓN', labelCampo: 'MISIÓN' },
  { id: 'herramientas', label: 'HERRAMIENTAS', labelCampo: 'HERRAM.' },
  { id: 'docs', label: 'DOCS', labelCampo: 'DOCS' },
  { id: 'estado', label: 'ESTADO', labelCampo: 'ESTADO' }
];

function useModo() {
  const [modoForzado, setModoForzadoState] = useState(() => {
    if (typeof localStorage === 'undefined') return null;
    try {
      const v = localStorage.getItem('infobae:modo');
      return v === 'campo' || v === 'redaccion' ? v : null;
    } catch { return null; }
  });
  const [autoModo, setAutoModo] = useState(() => {
    if (typeof window === 'undefined') return 'redaccion';
    return window.matchMedia('(min-width: 768px)').matches ? 'redaccion' : 'campo';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setAutoModo(e.matches ? 'redaccion' : 'campo');
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else mq.removeListener(handler);
    };
  }, []);

  const setModoForzado = (value) => {
    setModoForzadoState(value);
    try {
      if (value === null) localStorage.removeItem('infobae:modo');
      else localStorage.setItem('infobae:modo', value);
    } catch {}
  };

  const modo = modoForzado ?? autoModo;
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

function ViewSwitch({ activeView, modo, onOpenDoc, onOpenPerfil, docRequest }) {
  if (activeView === 'herramientas') {
    return <HerramientasView modo={modo} onOpenDoc={onOpenDoc} onOpenPerfil={onOpenPerfil} />;
  }
  if (activeView === 'docs') {
    return <DocsView modo={modo} request={docRequest} />;
  }
  if (activeView === 'estado') {
    return <EstadoView modo={modo} />;
  }
  return <Placeholder tabId={activeView} modo={modo} />;
}

function CampoShell({ activeView, setActiveView, onToggleModo, onOpenDoc, onOpenPerfil, docRequest }) {
  // Wordmark mínimo arriba como ancla visual (no chrome, no
  // separador). Tabs fijos al pie, compactos. Long-press en la
  // barra de tabs para togglear modo.
  const tabsLongPress = useLongPress(onToggleModo, 700);
  return (
    <div
      style={{
        minHeight: '100vh', backgroundColor: '#0d0d0d', color: '#e8e4db',
        display: 'flex', flexDirection: 'column',
        fontFamily: "'IBM Plex Sans', system-ui, sans-serif"
      }}
    >
      <div style={{ padding: '14px 16px 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
      <main style={{ flex: 1, padding: '8px 16px 92px', overflowY: 'auto' }}>
        <ViewSwitch activeView={activeView} modo="campo" onOpenDoc={onOpenDoc} onOpenPerfil={onOpenPerfil} docRequest={docRequest} />
      </main>
      <nav
        {...tabsLongPress.handlers}
        style={{
          position: 'fixed', left: 0, right: 0, bottom: 0,
          backgroundColor: '#0d0d0d', borderTop: '1px solid #262626',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none'
        }}
      >
        {TABS.map(t => {
          const active = activeView === t.id;
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
                marginTop: '-1px'
              }}
            >
              {t.labelCampo}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function RedaccionShell({ activeView, setActiveView, onToggleModo, onOpenDoc, onOpenPerfil, docRequest }) {
  return (
    <div
      style={{
        minHeight: '100vh', backgroundColor: '#f8f5ec', color: '#1f1f1f',
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
                  borderBottom: active ? '1px solid #1f1f1f' : '1px solid transparent'
                }}
              >
                {t.label.toLowerCase()}
              </button>
            );
          })}
        </nav>
      </header>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 36px' }}>
        <div style={{ borderTop: '1px solid #c9c1ab', height: '1px' }} />
      </div>
      <main style={{ maxWidth: '680px', margin: '0 auto', padding: '36px 36px 72px' }}>
        <ViewSwitch activeView={activeView} modo="redaccion" onOpenDoc={onOpenDoc} onOpenPerfil={onOpenPerfil} docRequest={docRequest} />
      </main>
    </div>
  );
}

export default function Shell({ scenario }) {
  const { modo, toggle } = useModo();
  const [activeView, setActiveView] = useState('mision');
  const [docRequest, setDocRequest] = useState(null);

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

  const sharedProps = { activeView, setActiveView, onToggleModo: toggle, onOpenDoc: openDoc, onOpenPerfil: openPerfil, docRequest };

  return modo === 'campo'
    ? <CampoShell {...sharedProps} />
    : <RedaccionShell {...sharedProps} />;
}
