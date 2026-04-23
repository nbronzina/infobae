import React, { useEffect, useMemo, useState } from 'react';
import misionInternacional from './data/mision_internacional.json';
import { themeFor, sizesFor, SERIF, MONO } from './theme.js';

const MISIONES = {
  internacional: misionInternacional
};

const ESTADO_INICIAL_PARTIDA = {
  nodoActual: null,
  flags: [],
  preparacion: 0,
  estadoMental: 'estable',
  visitados: [],
  nodosVistos: []
};

function storageKeyPara(linea) {
  return `infobae:mision_${linea}`;
}

function leerPartida(linea) {
  if (typeof localStorage === 'undefined') return { ...ESTADO_INICIAL_PARTIDA };
  try {
    const raw = localStorage.getItem(storageKeyPara(linea));
    if (!raw) return { ...ESTADO_INICIAL_PARTIDA };
    const parsed = JSON.parse(raw);
    return { ...ESTADO_INICIAL_PARTIDA, ...parsed };
  } catch {
    return { ...ESTADO_INICIAL_PARTIDA };
  }
}

function guardarPartida(linea, partida) {
  if (typeof localStorage === 'undefined') return;
  try { localStorage.setItem(storageKeyPara(linea), JSON.stringify(partida)); } catch {}
}

function nodoPorId(mision, id) {
  for (const obj of mision.objetivos) {
    const n = obj.nodos.find(x => x.id === id);
    if (n) return n;
  }
  return null;
}

function primerNodoDeLaMision(mision) {
  const obj = mision.objetivos[0];
  return obj?.nodo_inicial || obj?.nodos[0]?.id || null;
}

export default function MisionView({ modo, scenario, onBadgesChange }) {
  const mision = MISIONES[scenario];
  const t = themeFor(modo);
  const s = sizesFor(modo);
  const isCampo = modo === 'campo';

  const [partida, setPartida] = useState(() => {
    const saved = leerPartida(scenario);
    if (saved.nodoActual && mision && nodoPorId(mision, saved.nodoActual)) return saved;
    return { ...ESTADO_INICIAL_PARTIDA, nodoActual: mision ? primerNodoDeLaMision(mision) : null };
  });

  useEffect(() => { guardarPartida(scenario, partida); }, [scenario, partida]);

  const nodoActual = useMemo(() => mision ? nodoPorId(mision, partida.nodoActual) : null, [mision, partida.nodoActual]);

  // Comunica al Shell qué tabs deben mostrar badge.
  useEffect(() => {
    if (!onBadgesChange) return;
    onBadgesChange(nodoActual?.badges || []);
  }, [nodoActual, onBadgesChange]);

  if (!mision) {
    return (
      <div style={{ fontFamily: SERIF, fontSize: '14px', color: t.textSecondary, fontStyle: 'italic', padding: '20px 0' }}>
        Misión no disponible para esta línea todavía.
      </div>
    );
  }

  if (!nodoActual) {
    return (
      <div style={{ fontFamily: SERIF, fontSize: '14px', color: t.textSecondary, fontStyle: 'italic', padding: '20px 0' }}>
        Misión sin nodo activo. Revisar datos.
      </div>
    );
  }

  function avanzarA(siguienteId) {
    if (!siguienteId) return;
    setPartida(prev => ({
      ...prev,
      nodoActual: siguienteId,
      visitados: prev.visitados.includes(prev.nodoActual) ? prev.visitados : [...prev.visitados, prev.nodoActual]
    }));
  }

  function resolverSiguiente(opcion, flagsActualizados) {
    // siguiente_condicional permite que una misma opción derive a
    // nodos distintos según flags acumulados de objetivos anteriores.
    // El primer match del array gana; si ninguno matchea, usa el
    // siguiente por defecto.
    if (Array.isArray(opcion.siguiente_condicional)) {
      for (const regla of opcion.siguiente_condicional) {
        if (regla.flag && flagsActualizados.includes(regla.flag)) return regla.siguiente;
        if (regla.sin_flag && !flagsActualizados.includes(regla.sin_flag)) return regla.siguiente;
      }
    }
    return opcion.siguiente;
  }

  function opcionBloqueada(opcion, flags) {
    if (opcion.requiere && !flags.includes(opcion.requiere)) return true;
    if (opcion.requiere_sin && flags.includes(opcion.requiere_sin)) return true;
    return false;
  }

  function elegirOpcion(opcion) {
    if (opcionBloqueada(opcion, partida.flags)) return;
    setPartida(prev => {
      const flags = Array.from(new Set([...(prev.flags || []), ...(opcion.flags_set || [])]));
      const preparacion = (prev.preparacion || 0) + (opcion.preparacion || 0);
      const estadoMental = opcion.estado_mental_set || prev.estadoMental;
      const visitados = prev.visitados.includes(prev.nodoActual) ? prev.visitados : [...prev.visitados, prev.nodoActual];
      const nodoActual = resolverSiguiente(opcion, flags);
      return { ...prev, nodoActual, flags, preparacion, estadoMental, visitados };
    });
  }

  function reiniciar() {
    setPartida({ ...ESTADO_INICIAL_PARTIDA, nodoActual: primerNodoDeLaMision(mision) });
  }

  if (nodoActual.tipo === 'debriefing') {
    return <DebriefingNodo nodo={nodoActual} partida={partida} t={t} modo={modo} />;
  }

  return isCampo
    ? <CampoNodo nodo={nodoActual} partida={partida} onElegir={elegirOpcion} onAvanzar={avanzarA} t={t} s={s} />
    : <RedaccionNodo nodo={nodoActual} partida={partida} onElegir={elegirOpcion} onAvanzar={avanzarA} t={t} />;
}

// ============================================================
// DEBRIEFING — parte de cierre compuesto desde partida
// ============================================================

function DebriefingNodo({ nodo, partida, t, modo }) {
  const isCampo = modo === 'campo';
  const flags = partida.flags || [];
  const secciones = (nodo.secciones || []).map(sec => ({
    ...sec,
    fragmentos: (sec.fragmentos || []).filter(f => {
      if (f.si_flag) return flags.includes(f.si_flag);
      if (f.sin_flag) return !flags.includes(f.sin_flag);
      return true;
    })
  })).filter(sec => sec.fragmentos.length > 0);

  const tituloFs = isCampo ? '20px' : '28px';
  const bodyFs = isCampo ? '14.5px' : '15.5px';
  const maxW = isCampo ? 'none' : '38em';

  return (
    <article>
      <div style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '8px' }}>
        Parte de cierre · despliegue {nodo.codigo_despliegue}
      </div>
      <h1 style={{ fontFamily: SERIF, fontSize: tituloFs, fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em', color: t.text, lineHeight: 1.2 }}>
        {nodo.fecha_cierre}
      </h1>
      {nodo.apertura && (
        <p style={{ fontFamily: SERIF, fontSize: bodyFs, color: t.text, lineHeight: 1.7, maxWidth: maxW, margin: '18px 0 28px' }}>
          {nodo.apertura}
        </p>
      )}

      <div style={{ fontFamily: MONO, fontSize: '11px', color: t.textMeta, lineHeight: 1.7, marginBottom: '28px' }}>
        Preparación acumulada: {partida.preparacion || 0}<br/>
        Estado mental: {partida.estadoMental || 'sin registro'}
      </div>

      {secciones.map((sec, i) => (
        <section key={i} style={{ marginBottom: isCampo ? '24px' : '36px' }}>
          <h2 style={{ fontFamily: SERIF, fontSize: isCampo ? '16px' : '19px', fontWeight: 500, fontStyle: 'italic', margin: '0 0 10px', color: t.text, letterSpacing: '-0.005em' }}>
            {sec.titulo}
          </h2>
          {sec.fragmentos.map((f, j) => (
            <p key={j} style={{ fontFamily: SERIF, fontSize: bodyFs, color: t.text, lineHeight: 1.65, margin: '0 0 12px', maxWidth: maxW }}>
              {f.texto}
            </p>
          ))}
        </section>
      ))}

      {nodo.cierre && (
        <section style={{ borderTop: '1px solid ' + t.border, paddingTop: isCampo ? '18px' : '24px', marginTop: isCampo ? '24px' : '32px' }}>
          <p style={{ fontFamily: SERIF, fontSize: bodyFs, color: t.text, lineHeight: 1.7, maxWidth: maxW, margin: '0 0 14px' }}>
            {nodo.cierre.texto_base}
          </p>
          {nodo.cierre.jtsn && (
            <p style={{ fontFamily: SERIF, fontSize: isCampo ? '13px' : '14px', color: t.textSecondary, fontStyle: 'italic', lineHeight: 1.6, maxWidth: maxW, margin: '0 0 14px' }}>
              {nodo.cierre.jtsn}
            </p>
          )}
          {nodo.cierre.final && (
            <p style={{ fontFamily: SERIF, fontSize: bodyFs, color: t.text, lineHeight: 1.7, maxWidth: maxW, margin: '20px 0 0' }}>
              {nodo.cierre.final}
            </p>
          )}
        </section>
      )}

      {Array.isArray(nodo.firmas) && nodo.firmas.length > 0 && (
        <footer style={{ marginTop: isCampo ? '28px' : '40px', paddingTop: '18px', borderTop: '1px solid ' + t.border }}>
          <div style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '10px' }}>
            Firmado
          </div>
          <div style={{ fontFamily: MONO, fontSize: '11px', color: t.textSecondary, lineHeight: 1.8 }}>
            {nodo.firmas.map((f, i) => <div key={i}>{f}</div>)}
          </div>
        </footer>
      )}
    </article>
  );
}

// ============================================================
// CAMPO — situación arriba, opciones full-width 56px abajo
// ============================================================

function CampoNodo({ nodo, partida, onElegir, onAvanzar, t, s }) {
  const esDecision = nodo.tipo === 'decision';
  return (
    <div>
      <EmisorLine nodo={nodo} t={t} modo="campo" />
      <div style={{
        fontFamily: SERIF, fontSize: '15px', lineHeight: 1.65,
        color: t.text, marginBottom: '20px', whiteSpace: 'pre-wrap'
      }}>
        {nodo.texto}
      </div>

      {esDecision && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
          {nodo.texto_pregunta && (
            <div style={{ fontFamily: SERIF, fontSize: '14px', fontStyle: 'italic', color: t.textSecondary, marginBottom: '4px' }}>
              {nodo.texto_pregunta}
            </div>
          )}
          {nodo.opciones.map(o => (
            <OpcionButton key={o.id} opcion={o} partida={partida} onElegir={onElegir} t={t} modo="campo" />
          ))}
        </div>
      )}

      {!esDecision && nodo.siguiente && (
        <button type="button" onClick={() => onAvanzar(nodo.siguiente)} style={{
          cursor: 'pointer', background: 'none', border: 'none', padding: '8px 0',
          fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.08em',
          color: t.textMeta, marginTop: '14px'
        }}>
          continuar ↓
        </button>
      )}

      {!esDecision && !nodo.siguiente && (
        <div style={{ padding: '14px 0', marginTop: '14px', borderTop: '1px solid ' + t.border, fontFamily: MONO, fontSize: '10px', color: t.textMeta, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          fin del primer objetivo · preparación {partida.preparacion}
        </div>
      )}

    </div>
  );
}

// ============================================================
// REDACCIÓN — livre-jeu editorial, opciones como links al final
// ============================================================

function RedaccionNodo({ nodo, partida, onElegir, onAvanzar, t }) {
  const esDecision = nodo.tipo === 'decision';
  return (
    <div>
      <EmisorLine nodo={nodo} t={t} modo="redaccion" />
      <div style={{
        fontFamily: SERIF, fontSize: '16px', lineHeight: 1.75,
        color: t.text, marginBottom: '28px', maxWidth: '38em', whiteSpace: 'pre-wrap'
      }}>
        {nodo.texto}
      </div>

      {esDecision && (
        <ol style={{ listStyle: 'none', margin: 0, padding: 0, maxWidth: '38em' }}>
          {nodo.opciones.map((o, i) => (
            <li key={o.id} style={{ borderTop: i === 0 ? '1px solid ' + t.border : 'none', borderBottom: '1px solid ' + t.border }}>
              <OpcionButton opcion={o} partida={partida} onElegir={onElegir} t={t} modo="redaccion" />
            </li>
          ))}
        </ol>
      )}

      {!esDecision && nodo.siguiente && (
        <button type="button" onClick={() => onAvanzar(nodo.siguiente)} style={{
          cursor: 'pointer', background: 'none', border: 'none', padding: '8px 0',
          fontFamily: MONO, fontSize: '11px', letterSpacing: '0.08em',
          color: t.textMeta, marginTop: '18px'
        }}>
          continuar ↓
        </button>
      )}

      {!esDecision && !nodo.siguiente && (
        <div style={{ paddingTop: '18px', marginTop: '18px', borderTop: '1px solid ' + t.border, fontFamily: SERIF, fontSize: '13px', fontStyle: 'italic', color: t.textMeta, maxWidth: '38em' }}>
          Fin del primer objetivo. Preparación acumulada: {partida.preparacion}.
        </div>
      )}

    </div>
  );
}

// ============================================================
// SUBCOMPONENTES
// ============================================================

function EmisorLine({ nodo, t, modo }) {
  const isCampo = modo === 'campo';
  if (nodo.tipo === 'decision') return null;
  // emisor null → narración pura, sin label.
  if (!nodo.emisor) return null;
  return (
    <div style={{
      fontFamily: MONO,
      fontSize: isCampo ? '10px' : '10.5px',
      letterSpacing: '0.08em', textTransform: 'uppercase',
      color: t.textMeta, marginBottom: '10px'
    }}>
      mensaje · {nodo.emisor}
    </div>
  );
}

function OpcionButton({ opcion, partida, onElegir, t, modo }) {
  const isCampo = modo === 'campo';
  const bloqueada = (opcion.requiere && !partida.flags.includes(opcion.requiere)) ||
                    (opcion.requiere_sin && partida.flags.includes(opcion.requiere_sin));

  if (isCampo) {
    return (
      <button type="button" onClick={() => !bloqueada && onElegir(opcion)} disabled={bloqueada} style={{
        cursor: bloqueada ? 'not-allowed' : 'pointer',
        textAlign: 'left', width: '100%',
        padding: '14px 16px', minHeight: '56px',
        border: '1px solid ' + (bloqueada ? t.border : t.borderStrong),
        backgroundColor: bloqueada ? 'transparent' : t.bgCard,
        color: bloqueada ? t.textMeta : t.text,
        opacity: bloqueada ? 0.55 : 1,
        display: 'flex', flexDirection: 'column', gap: '4px'
      }}>
        <span style={{ fontFamily: SERIF, fontSize: '14px', lineHeight: 1.45, fontStyle: bloqueada ? 'italic' : 'normal' }}>
          {opcion.texto}
        </span>
        {bloqueada && (
          <span style={{ fontFamily: MONO, fontSize: '10px', color: t.textMeta, letterSpacing: '0.04em' }}>
            {opcion.requiere_texto || `necesitás ${opcion.requiere}`}
          </span>
        )}
      </button>
    );
  }

  return (
    <button type="button" onClick={() => !bloqueada && onElegir(opcion)} disabled={bloqueada} style={{
      cursor: bloqueada ? 'not-allowed' : 'pointer',
      textAlign: 'left', width: '100%',
      padding: '14px 0', border: 'none', background: 'transparent',
      color: bloqueada ? t.textMeta : t.text,
      opacity: bloqueada ? 0.6 : 1,
      display: 'flex', flexDirection: 'column', gap: '6px'
    }}>
      <span style={{ fontFamily: SERIF, fontSize: '16px', fontStyle: bloqueada ? 'italic' : 'normal', fontWeight: bloqueada ? 400 : 500, lineHeight: 1.5, letterSpacing: '-0.005em' }}>
        → {opcion.texto}
      </span>
      {bloqueada && (
        <span style={{ fontFamily: SERIF, fontSize: '12.5px', fontStyle: 'italic', color: t.textMeta }}>
          {opcion.requiere_texto || `necesitás ${opcion.requiere}`}
        </span>
      )}
    </button>
  );
}

