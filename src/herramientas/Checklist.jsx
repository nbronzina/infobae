import React, { useEffect, useState } from 'react';
import checklistData from '../data/checklist_predespliegue.json';
import { themeFor, sizesFor, SERIF, SANS, MONO } from '../theme';
import { ToolHeader, ToolCallout } from './_shared.jsx';

export default function Checklist({ modo, onOpenDoc }) {
  const t = themeFor(modo);
  const s = sizesFor(modo);
  const isCampo = modo === 'campo';

  const [ticks, setTicks] = useState(() => {
    if (typeof localStorage === 'undefined') return {};
    try { return JSON.parse(localStorage.getItem('infobae:checklist') || '{}'); } catch { return {}; }
  });
  const [parteEmitido, setParteEmitido] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('infobae:checklist', JSON.stringify(ticks)); } catch {}
  }, [ticks]);

  const toggle = (id) => setTicks(prev => ({ ...prev, [id]: !prev[id] }));
  const reset = () => { setTicks({}); setParteEmitido(false); };

  const items = checklistData;
  const porArea = items.reduce((acc, it) => { (acc[it.area] = acc[it.area] || []).push(it); return acc; }, {});
  const obligatorios = items.filter(i => i.obligatorio);
  const opcionales = items.filter(i => !i.obligatorio);
  const obligatoriosHechos = obligatorios.filter(i => ticks[i.id]).length;
  const totalHechos = items.filter(i => ticks[i.id]).length;
  const opcionalesHechos = opcionales.filter(i => ticks[i.id]).length;
  const listo = obligatoriosHechos === obligatorios.length;

  const openDoc = (key, codigo) => {
    if (onOpenDoc) onOpenDoc(key, codigo);
  };

  return (
    <div>
      <ToolHeader
        codigo="OP-TOOL-2029-007"
        titulo="Checklist pre-despliegue"
        subtitulo="Parte de aptitud operativa para salida internacional. El parte se emite con firma conjunta cuando todos los obligatorios están marcados. Items opcionales quedan registrados con nota."
        modo={modo}
      />

      <div style={{
        padding: '12px 16px', backgroundColor: t.bgAccent, borderLeft: '2px solid ' + (listo ? t.vigente : t.revision),
        marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
      }}>
        <div style={{ fontFamily: MONO, fontSize: '12px', color: t.text }}>
          {totalHechos} de {items.length} items marcados · <span style={{ color: listo ? t.vigente : t.revision, fontWeight: 500 }}>{listo ? 'obligatorios completos' : `${obligatorios.length - obligatoriosHechos} obligatorios pendientes`}</span>
          {opcionales.length > 0 && <span style={{ color: t.textSecondary }}> · {opcionalesHechos}/{opcionales.length} opcionales</span>}
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button type="button" onClick={reset} style={{
            cursor: 'pointer', padding: isCampo ? '10px 14px' : '6px 12px', fontFamily: MONO,
            fontSize: '10.5px', letterSpacing: '0.04em', textTransform: 'uppercase',
            border: '1px solid ' + t.border, backgroundColor: 'transparent', color: t.textSecondary,
            minHeight: s.touchMin
          }}>Reset</button>
          <button type="button" onClick={() => listo && setParteEmitido(true)} disabled={!listo} style={{
            cursor: listo ? 'pointer' : 'not-allowed', padding: isCampo ? '10px 14px' : '6px 12px',
            fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.04em', textTransform: 'uppercase',
            border: '1px solid ' + (listo ? t.text : t.border),
            backgroundColor: listo ? t.text : t.bgElevated,
            color: listo ? t.bg : t.textMeta,
            opacity: listo ? 1 : 0.6, minHeight: s.touchMin
          }}>Emitir parte de aptitud</button>
        </div>
      </div>

      {Object.entries(porArea).map(([area, arr]) => (
        <section key={area} style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '10px' }}>
            {area} ({arr.filter(i => ticks[i.id]).length}/{arr.length})
          </div>
          <div style={{ border: '1px solid ' + t.border }}>
            {arr.map((it, idx) => {
              const done = !!ticks[it.id];
              return (
                <div key={it.id} style={{
                  padding: isCampo ? '16px 14px' : '14px 16px',
                  borderBottom: idx < arr.length - 1 ? '1px solid ' + t.border : 'none',
                  backgroundColor: done ? t.vigenteBg : t.bgCard,
                  display: 'flex', gap: '14px', alignItems: 'flex-start'
                }}>
                  <div role="button" tabIndex={0} onClick={() => toggle(it.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(it.id); } }} style={{
                    cursor: 'pointer', flexShrink: 0,
                    width: isCampo ? '28px' : '20px', height: isCampo ? '28px' : '20px',
                    border: '1.5px solid ' + (done ? t.vigente : t.textSecondary),
                    backgroundColor: done ? t.vigente : 'transparent',
                    color: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: isCampo ? '18px' : '14px', fontWeight: 600, marginTop: '1px'
                  }}>
                    {done ? '✓' : ''}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: MONO, fontSize: '10px', color: t.textMeta }}>{it.id.toUpperCase()}</span>
                        <span style={{ fontFamily: SERIF, fontSize: '14px', fontWeight: 500, color: t.text }}>{it.titulo}</span>
                        {!it.obligatorio && <span style={{ fontFamily: MONO, fontSize: '9.5px', color: t.textMeta, padding: '1px 6px', backgroundColor: t.bgElevated, letterSpacing: '0.04em', textTransform: 'uppercase' }}>opcional</span>}
                      </div>
                      <span style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta }}>{it.responsable}</span>
                    </div>
                    <div style={{ fontFamily: SERIF, fontSize: '12.5px', color: t.text, lineHeight: 1.55, marginBottom: '6px' }}>{it.detalle}</div>
                    {it.doc_ref && (
                      <button type="button" onClick={(e) => { e.stopPropagation(); openDoc(it.doc_ref.key, it.doc_ref.codigo); }} style={{
                        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                        fontFamily: MONO, fontSize: '10.5px', color: t.docLink,
                        textDecoration: 'underline', textDecorationStyle: 'dotted', textDecorationColor: t.border
                      }}>
                        ver {it.doc_ref.codigo} →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {parteEmitido && listo && (
        <div style={{ marginTop: '32px', padding: isCampo ? '20px 18px' : '28px 32px', backgroundColor: t.bgCard, border: '2px solid ' + t.borderStrong }}>
          <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.vigente, marginBottom: '8px' }}>
            Parte de aptitud · emitido
          </div>
          <h2 style={{ fontFamily: SERIF, fontSize: '22px', fontWeight: 500, margin: '0 0 16px', color: t.text }}>Apto para despliegue internacional</h2>
          <div style={{ fontFamily: MONO, fontSize: '11.5px', color: t.text, lineHeight: 1.7, marginBottom: '18px' }}>
            Fecha emisión: 2029-04-17 14:30 ART<br/>
            Corresponsal: mondini.l<br/>
            Checklist completado: {obligatoriosHechos}/{obligatorios.length} obligatorios {opcionalesHechos > 0 && `· ${opcionalesHechos}/${opcionales.length} opcionales`}<br/>
            Código parte: OP-TOOL-2029-007 · instancia 2029-04-17-01
          </div>
          <div style={{ padding: '14px 16px', backgroundColor: t.bgAccent, borderLeft: '2px solid ' + t.vigente, marginBottom: '18px' }}>
            <div style={{ fontFamily: SERIF, fontSize: '13px', color: t.text, lineHeight: 1.55 }}>
              El corresponsal cumple con los requisitos de seguridad digital, legales, operacionales y de recursos humanos para despliegue internacional en zona activa. El parte se archiva en OP-SEC-LOG y vence a los 14 días desde la emisión o al ingresar a territorio de despliegue, lo primero que ocurra.
            </div>
          </div>
          <div style={{ fontFamily: MONO, fontSize: '11px', color: t.textSecondary, lineHeight: 1.7 }}>
            Firmas:<br/>
            m. villafañe — operaciones<br/>
            j. fiorella — seguridad digital<br/>
            l. pollastri — legales
          </div>
        </div>
      )}
    </div>
  );
}
