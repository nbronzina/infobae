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

  return (
    <div>
      {isCampo
        ? <CampoNodo nodo={nodoActual} partida={partida} onElegir={elegirOpcion} onAvanzar={avanzarA} onReiniciar={reiniciar} t={t} s={s} />
        : <RedaccionNodo nodo={nodoActual} partida={partida} onElegir={elegirOpcion} onAvanzar={avanzarA} onReiniciar={reiniciar} t={t} />
      }
    </div>
  );
}

// ============================================================
// CAMPO — situación arriba, opciones full-width 56px abajo
// ============================================================

function CampoNodo({ nodo, partida, onElegir, onAvanzar, onReiniciar, t, s }) {
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
          cursor: 'pointer', background: t.text, color: t.bg, border: 'none',
          padding: '16px', width: '100%', minHeight: '56px', marginTop: '8px',
          fontFamily: MONO, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500
        }}>
          seguir →
        </button>
      )}

      {!esDecision && !nodo.siguiente && (
        <div style={{ padding: '14px 0', marginTop: '14px', borderTop: '1px solid ' + t.border, fontFamily: MONO, fontSize: '10px', color: t.textMeta, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          fin del primer objetivo · preparación {partida.preparacion}
        </div>
      )}

      <FooterReset onReiniciar={onReiniciar} t={t} modo="campo" />
    </div>
  );
}

// ============================================================
// REDACCIÓN — livre-jeu editorial, opciones como links al final
// ============================================================

function RedaccionNodo({ nodo, partida, onElegir, onAvanzar, onReiniciar, t }) {
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
          cursor: 'pointer', background: 'none', border: 'none', padding: 0,
          fontFamily: SERIF, fontSize: '15px', fontStyle: 'italic', color: t.text,
          borderBottom: '1px solid ' + t.text, paddingBottom: '1px', marginTop: '14px'
        }}>
          seguir →
        </button>
      )}

      {!esDecision && !nodo.siguiente && (
        <div style={{ paddingTop: '18px', marginTop: '18px', borderTop: '1px solid ' + t.border, fontFamily: SERIF, fontSize: '13px', fontStyle: 'italic', color: t.textMeta, maxWidth: '38em' }}>
          Fin del primer objetivo. Preparación acumulada: {partida.preparacion}.
        </div>
      )}

      <FooterReset onReiniciar={onReiniciar} t={t} modo="redaccion" />
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

function FooterReset({ onReiniciar, t, modo }) {
  const isCampo = modo === 'campo';
  return (
    <div style={{ marginTop: isCampo ? '32px' : '48px', paddingTop: '14px', borderTop: '1px dotted ' + t.border }}>
      <button type="button" onClick={onReiniciar} style={{
        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
        fontFamily: MONO, fontSize: '10px', letterSpacing: '0.06em', color: t.textMeta,
        fontStyle: isCampo ? 'normal' : 'italic'
      }}>
        reiniciar partida desde el principio
      </button>
    </div>
  );
}
