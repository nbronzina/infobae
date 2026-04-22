import React, { useEffect, useState } from 'react';
import checklistData from './data/checklist_predespliegue.json';
import { themeFor, sizesFor, SERIF, MONO } from './theme.js';

// Lee localStorage de manera defensiva. Si la clave no existe o el
// JSON está roto, devuelve el fallback.
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

const NIVEL_MENTAL_LABELS = {
  estable: 'Estable',
  tenso: 'Tenso',
  agotado: 'Agotado'
};

export default function EstadoView({ modo }) {
  const t = themeFor(modo);
  const s = sizesFor(modo);
  const isCampo = modo === 'campo';

  // Re-leer al montar para reflejar cambios entre tabs sin polling.
  const [snapshot, setSnapshot] = useState(() => readSnapshot());
  useEffect(() => { setSnapshot(readSnapshot()); }, []);

  const flags = computeFlags(snapshot);

  if (isCampo) {
    return (
      <div>
        <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '6px' }}>
          INFOBAE · ESTADO OPERACIONAL · MONDINI.L
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: s.fsTitle + 2, fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em', color: t.text }}>
          Estado del operador
        </h1>
        <div style={{ fontFamily: SERIF, fontSize: 14.5, color: t.textSecondary, fontStyle: 'italic', marginBottom: '24px', lineHeight: 1.5 }}>
          Lectura local de variables de operación. Lo que el dispositivo sabe sobre la condición actual.
        </div>
        <CampoLayout snapshot={snapshot} flags={flags} t={t} s={s} />
      </div>
    );
  }

  return <RedaccionLayout snapshot={snapshot} flags={flags} t={t} s={s} />;
}

function readSnapshot() {
  const checklistTicks = readLS('infobae:checklist', {});
  const fuentes = readLS('infobae:fuentes', []);
  const diario = readLS('infobae:diario', []);
  return { checklistTicks, fuentes, diario };
}

function computeFlags(snapshot) {
  const { checklistTicks, fuentes, diario } = snapshot;
  const items = checklistData;
  const obligatorios = items.filter(i => i.obligatorio);
  const opcionales = items.filter(i => !i.obligatorio);
  const obligHechos = obligatorios.filter(i => checklistTicks[i.id]).length;
  const opcHechos = opcionales.filter(i => checklistTicks[i.id]).length;
  const checklistListo = obligHechos === obligatorios.length;
  const ultimaEntradaDiario = diario[0]; // diario está newest-first
  return {
    checklist: { obligHechos, obligTotal: obligatorios.length, opcHechos, opcTotal: opcionales.length, listo: checklistListo },
    fuentesCount: fuentes.length,
    diarioCount: diario.length,
    ultimaEntradaDiario
  };
}

function fmtFecha(s) {
  if (!s) return null;
  const date = typeof s === 'string' ? new Date(s) : s;
  if (Number.isNaN(date.getTime())) return s;
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const hh = String(date.getUTCHours()).padStart(2, '0');
  const mi = String(date.getUTCMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} · ${hh}:${mi} UTC`;
}

// ============================================================
// MODO CAMPO — lista compacta oscura
// ============================================================

function CampoLayout({ snapshot, flags, t, s }) {
  const filas = buildFilas(flags);
  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid ' + t.border, marginBottom: '20px' }}>
        {filas.map((f, i) => (
          <div key={f.label} style={{
            padding: '14px 16px',
            borderBottom: i < filas.length - 1 ? '1px solid ' + t.border : 'none',
            borderLeft: '3px solid ' + (f.color || t.borderStrong),
            backgroundColor: t.bgCard,
            display: 'flex', flexDirection: 'column', gap: '4px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {f.label}
              </span>
              {f.chip && (
                <span style={{ fontFamily: MONO, fontSize: '9.5px', padding: '2px 7px', letterSpacing: '0.04em', textTransform: 'uppercase', color: f.color || t.textMeta, backgroundColor: f.chipBg || t.bgElevated }}>
                  {f.chip}
                </span>
              )}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: '14.5px', color: t.text, lineHeight: 1.45 }}>
              {f.valor}
            </div>
            {f.detalle && (
              <div style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, lineHeight: 1.5 }}>
                {f.detalle}
              </div>
            )}
          </div>
        ))}
      </div>

      <FooterMeta t={t} s={s} />
    </div>
  );
}

// ============================================================
// MODO REDACCIÓN — panel tipo informe
// ============================================================

function RedaccionLayout({ snapshot, flags, t }) {
  const filas = buildFilas(flags);
  const fechaLectura = '2029-04-17';
  return (
    <article>
      <h1 style={{ fontFamily: SERIF, fontSize: '32px', fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.015em', color: t.text, lineHeight: 1.15 }}>
        Estado del operador
      </h1>
      <div style={{ fontFamily: SERIF, fontSize: 15, color: t.textSecondary, fontStyle: 'italic', marginBottom: '32px', lineHeight: 1.6, maxWidth: '38em' }}>
        Lectura local de variables de operación al momento de abrir esta vista.
      </div>

      <div style={{ fontFamily: SERIF, fontSize: '13.5px', color: t.text, lineHeight: 1.8, marginBottom: '32px' }}>
        <div><span style={{ color: t.textMeta }}>Fecha de lectura:</span> {fechaLectura}</div>
        <div><span style={{ color: t.textMeta }}>Operador:</span> l. mondini · base Buenos Aires</div>
        <div><span style={{ color: t.textMeta }}>Origen:</span> snapshot local · sin sync registrada</div>
      </div>

      <div style={{ borderTop: '1px solid ' + t.border, marginBottom: '24px' }} />

      {filas.map(f => (
        <section key={f.label} style={{ marginBottom: '26px', maxWidth: '38em' }}>
          <h2 style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 500, fontStyle: 'italic', margin: '0 0 6px', color: t.text, letterSpacing: '-0.005em' }}>
            {f.label}
          </h2>
          <p style={{ fontFamily: SERIF, fontSize: '15px', lineHeight: 1.7, color: t.text, margin: '0 0 4px' }}>
            {f.valor}
            {f.chip && f.chip !== '—' && (
              <span style={{ fontFamily: SERIF, fontSize: '13px', fontStyle: 'italic', color: f.color || t.textMeta, marginLeft: '8px' }}>
                — {f.chip}
              </span>
            )}
          </p>
          {f.detalle && (
            <div style={{ fontFamily: MONO, fontSize: '11px', color: t.textMeta, lineHeight: 1.6 }}>
              {f.detalle}
            </div>
          )}
        </section>
      ))}

      <div style={{ borderTop: '1px solid ' + t.border, paddingTop: '20px', marginTop: '12px' }}>
        <div style={{ fontFamily: SERIF, fontSize: '12.5px', color: t.textMeta, lineHeight: 1.7, fontStyle: 'italic', maxWidth: '38em' }}>
          Las variables marcadas como placeholder se conectan en futuras iteraciones — estado mental al sistema de misiones, nivel de preparación al checklist + manual de teatro, última sync al kit de transferencia.
        </div>
      </div>
    </article>
  );
}

// ============================================================
// FILAS (compartidas entre los dos layouts)
// ============================================================

function buildFilas(flags) {
  const filas = [];

  // Estado mental — placeholder hasta integrar con sistema de misiones.
  filas.push({
    label: 'Estado mental',
    valor: NIVEL_MENTAL_LABELS.estable,
    detalle: 'placeholder · sin sesión JTSN pendiente registrada · variable a conectar con el debriefing de misión',
    chip: 'estable',
    color: '#5a6e3c', chipBg: '#e8f0de'
  });

  // Nivel de preparación — placeholder.
  filas.push({
    label: 'Nivel de preparación',
    valor: 'No evaluado en esta sesión',
    detalle: 'placeholder · se computa al cierre del checklist pre-despliegue + lectura del manual de teatro',
    chip: 'pendiente',
    color: '#8a6d2b', chipBg: '#f5edd5'
  });

  // Checklist pre-despliegue
  const ck = flags.checklist;
  filas.push({
    label: 'Checklist pre-despliegue',
    valor: ck.listo
      ? `Apto · ${ck.obligHechos}/${ck.obligTotal} obligatorios completos`
      : `${ck.obligHechos}/${ck.obligTotal} obligatorios completos · ${ck.obligTotal - ck.obligHechos} pendientes`,
    detalle: ck.opcTotal > 0 ? `Opcionales: ${ck.opcHechos}/${ck.opcTotal}` : null,
    chip: ck.listo ? 'apto' : 'en curso',
    color: ck.listo ? '#5a6e3c' : '#8a6d2b',
    chipBg: ck.listo ? '#e8f0de' : '#f5edd5'
  });

  // Fuentes registradas
  filas.push({
    label: 'Fuentes registradas',
    valor: flags.fuentesCount === 0
      ? 'Ninguna fuente activa en el dispositivo'
      : `${flags.fuentesCount} ${flags.fuentesCount === 1 ? 'fuente registrada' : 'fuentes registradas'}`,
    detalle: 'localStorage · infobae:fuentes',
    chip: flags.fuentesCount > 0 ? `${flags.fuentesCount}` : '—',
    color: flags.fuentesCount > 0 ? '#5a6e3c' : '#8a8472',
    chipBg: flags.fuentesCount > 0 ? '#e8f0de' : '#eceae4'
  });

  // Entradas de diario
  const fechaUltima = fmtFecha(flags.ultimaEntradaDiario?.fecha);
  filas.push({
    label: 'Diario de campo',
    valor: flags.diarioCount === 0
      ? 'Diario vacío'
      : `${flags.diarioCount} ${flags.diarioCount === 1 ? 'entrada registrada' : 'entradas registradas'}`,
    detalle: fechaUltima ? `Última entrada: ${fechaUltima}` : 'localStorage · infobae:diario',
    chip: flags.diarioCount > 0 ? `${flags.diarioCount}` : '—',
    color: flags.diarioCount > 0 ? '#5a6e3c' : '#8a8472',
    chipBg: flags.diarioCount > 0 ? '#e8f0de' : '#eceae4'
  });

  // Última sync
  filas.push({
    label: 'Última sync',
    valor: 'Sin sync registrada en esta sesión',
    detalle: 'placeholder · la sync es un acto deliberado y queda pendiente de implementación',
    chip: 'offline',
    color: '#8a6d2b', chipBg: '#f5edd5'
  });

  return filas;
}

function FooterMeta({ t, redaccion }) {
  return (
    <div style={{
      fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, lineHeight: 1.7,
      paddingTop: redaccion ? '20px' : '0',
      marginTop: redaccion ? '24px' : '0',
      borderTop: redaccion ? '1px solid ' + t.border : 'none'
    }}>
      Lectura del estado al momento de abrir esta vista. Refrescar la pantalla para releer localStorage.<br/>
      Las variables marcadas como placeholder se conectan en futuras iteraciones — estado mental al sistema de misiones, nivel de preparación al checklist + manual de teatro, última sync al kit de transferencia.
    </div>
  );
}
