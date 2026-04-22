import React, { useState } from 'react';
import teatrosData from '../data/teatros.json';
import gabineteData from '../data/gabinete.json';
import directorioData from '../data/directorio.json';
import { themeFor, sizesFor, SERIF, MONO } from '../theme';

export default function EvaluacionTeatro({ modo, onOpenDoc, onOpenPerfil }) {
  const t = themeFor(modo);
  const s = sizesFor(modo);
  const isCampo = modo === 'campo';

  const [seleccionado, setSeleccionado] = useState(null);

  const teatro = teatrosData.find(x => x.codigo === seleccionado);
  const levelColor = (n) => n === 'crítico' ? t.alert : n === 'alto' ? t.revision : n === 'medio' ? t.textSecondary : t.vigente;
  const levelBg = (n) => n === 'crítico' ? t.alertBg : n === 'alto' ? t.revisionBg : n === 'medio' ? t.bgElevated : t.vigenteBg;
  const kitsPorCodigo = Object.fromEntries(gabineteData.map(k => [k.codigo, k]));
  const personaPorKey = Object.fromEntries(directorioData.map(p => [p.key, p]));
  const openDoc = (key, codigo) => { if (onOpenDoc) onOpenDoc(key, codigo); };
  const openPerfil = (key) => { if (onOpenPerfil) onOpenPerfil(key); };

  return (
    <div>
      <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '6px' }}>
        INFOBAE · HERRAMIENTAS · OP-TOOL-2029-006
      </div>
      <h1 style={{ fontFamily: SERIF, fontSize: s.fsTitle + 2, fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em', color: t.text }}>
        Evaluación por teatro
      </h1>
      <div style={{ fontFamily: SERIF, fontSize: 14.5, color: t.textSecondary, fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.5 }}>
        Parte preliminar de evaluación operativa · amenazas aplicables, protocolos obligatorios, equipamiento requerido y contactos clave por destino.
      </div>

      <div style={{ padding: '10px 14px', backgroundColor: t.bgAccent, borderLeft: '2px solid ' + t.borderStrong, marginBottom: '20px' }}>
        <div style={{ fontFamily: MONO, fontSize: '11.5px', color: t.text, lineHeight: 1.55 }}>
          Elegir teatro. La evaluación cruza el glosario T-* con la doctrina aplicable y el gabinete de campo. El parte se entrega firmado por seg. digital + operaciones + legales antes de cada despliegue.
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isCampo ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: isCampo ? '8px' : '10px',
        marginBottom: teatro ? '32px' : '0'
      }}>
        {teatrosData.map(tr => {
          const sel = tr.codigo === seleccionado;
          return (
            <button key={tr.codigo} type="button" onClick={() => setSeleccionado(tr.codigo)} style={{
              textAlign: 'left', padding: isCampo ? '16px 18px' : '14px 16px',
              border: '1px solid ' + (sel ? t.borderStrong : t.border),
              backgroundColor: sel ? t.bgAccent : t.bgCard,
              cursor: 'pointer', minHeight: s.touchMin, color: t.text
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: sel ? t.text : t.textMeta }}>{tr.codigo}</span>
                {isCampo && <span style={{ fontFamily: MONO, fontSize: '9.5px', color: sel ? t.accent : t.textMeta }}>{sel ? '✓ seleccionado' : 'tocar →'}</span>}
              </div>
              <div style={{ fontFamily: SERIF, fontSize: isCampo ? '16px' : '14.5px', fontWeight: 500, marginBottom: '2px' }}>{tr.nombre}</div>
              <div style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta }}>{tr.region}</div>
            </button>
          );
        })}
      </div>

      {teatro && (
        <article style={{ backgroundColor: t.bgCard, border: '1px solid ' + t.border, padding: isCampo ? '20px 18px' : '24px 28px' }}>
          <header style={{ borderBottom: '1px solid ' + t.border, paddingBottom: '14px', marginBottom: '22px' }}>
            <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '4px' }}>
              Parte de evaluación · {teatro.codigo}
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: '22px', fontWeight: 500, margin: '0 0 4px', letterSpacing: '-0.01em', color: t.text }}>{teatro.nombre}</h2>
            <div style={{ fontFamily: MONO, fontSize: '11.5px', color: t.textSecondary, lineHeight: 1.6 }}>
              {teatro.region} · {teatro.tipo} · duración típica {teatro.duracion_tipica}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: '13px', color: t.text, marginTop: '8px', fontStyle: 'italic' }}>
              Actor dominante: {teatro.actor_dominante}
            </div>
            <div style={{ fontFamily: MONO, fontSize: '10.5px', color: t.alert, marginTop: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Estado · {teatro.estado}
            </div>
          </header>

          <section style={{ marginBottom: '22px' }}>
            <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '10px' }}>
              Amenazas aplicables ({teatro.amenazas.length})
            </div>
            {teatro.amenazas.map(a => (
              <div key={a.codigo} style={{ padding: '10px 14px', backgroundColor: t.bgAccent, borderLeft: '3px solid ' + levelColor(a.nivel), marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: MONO, fontSize: '11.5px', color: t.alert, fontWeight: 500 }}>{a.codigo}</span>
                  <span style={{ fontFamily: MONO, fontSize: '9.5px', letterSpacing: '0.04em', textTransform: 'uppercase', padding: '2px 7px', backgroundColor: levelBg(a.nivel), color: levelColor(a.nivel) }}>nivel {a.nivel}</span>
                </div>
                <div style={{ fontFamily: SERIF, fontSize: '12.5px', color: t.text, lineHeight: 1.55 }}>{a.motivo}</div>
              </div>
            ))}
          </section>

          <section style={{ marginBottom: '22px' }}>
            <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '10px' }}>
              Protocolos aplicables ({teatro.protocolos.length})
            </div>
            {teatro.protocolos.map(p => (
              <button key={p.codigo} type="button" onClick={() => openDoc(p.key, p.codigo)} style={{
                width: '100%', textAlign: 'left', background: 'none', border: 'none',
                borderBottom: '1px solid ' + t.border, padding: isCampo ? '12px 0' : '10px 0',
                cursor: 'pointer', color: t.text, minHeight: s.touchMin
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, minWidth: isCampo ? 'auto' : '140px' }}>{p.codigo}</span>
                  <span style={{ fontFamily: SERIF, fontSize: '13.5px', fontWeight: 500, flex: 1 }}>{p.motivo}</span>
                  {p.obligatorio && <span style={{ fontFamily: MONO, fontSize: '9.5px', color: t.alert, letterSpacing: '0.04em', textTransform: 'uppercase' }}>obligatorio</span>}
                </div>
              </button>
            ))}
          </section>

          <section style={{ marginBottom: '22px' }}>
            <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '10px' }}>
              Equipamiento requerido ({teatro.kit_requerido.length})
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: isCampo ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
              {teatro.kit_requerido.map(codigo => {
                const kit = kitsPorCodigo[codigo];
                if (!kit) return null;
                return (
                  <div key={codigo} style={{ padding: '10px 12px', backgroundColor: t.bgAccent, border: '1px solid ' + t.border }}>
                    <div style={{ fontFamily: MONO, fontSize: '10px', color: t.textMeta, marginBottom: '2px' }}>{codigo}</div>
                    <div style={{ fontFamily: SERIF, fontSize: '12.5px', fontWeight: 500, color: t.text }}>{kit.nombre}</div>
                  </div>
                );
              })}
            </div>
          </section>

          <section style={{ marginBottom: '22px' }}>
            <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '10px' }}>Contactos clave</div>
            {teatro.contactos_clave.map(c => {
              const p = personaPorKey[c.key];
              if (!p) return null;
              return (
                <button key={c.key} type="button" onClick={() => openPerfil(c.key)} style={{
                  width: '100%', textAlign: 'left', background: 'none', border: 'none',
                  borderBottom: '1px solid ' + t.border, padding: isCampo ? '12px 0' : '10px 0',
                  cursor: 'pointer', color: t.text, minHeight: s.touchMin
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: SERIF, fontSize: '13.5px', fontWeight: 500, minWidth: isCampo ? 'auto' : '160px' }}>{p.nombre}</span>
                    <span style={{ fontFamily: MONO, fontSize: '11.5px', color: t.textSecondary, flex: 1 }}>{c.rol}</span>
                  </div>
                </button>
              );
            })}
          </section>

          <section>
            <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '8px' }}>Nota operativa</div>
            <div style={{ fontFamily: SERIF, fontSize: '13.5px', color: t.text, lineHeight: 1.6, padding: '12px 16px', backgroundColor: t.bgAccent, borderLeft: '2px solid ' + t.borderStrong }}>
              {teatro.nota_operativa}
            </div>
          </section>

          <footer style={{ marginTop: '22px', paddingTop: '14px', borderTop: '1px solid ' + t.border }}>
            <div style={{ fontFamily: MONO, fontSize: '11px', color: t.textSecondary, lineHeight: 1.7 }}>
              Firmas:<br/>
              j. fiorella — seguridad digital<br/>
              m. villafañe — operaciones<br/>
              l. pollastri — legales
            </div>
          </footer>
        </article>
      )}

      {!teatro && (
        <div style={{ fontFamily: SERIF, fontSize: '13px', color: t.textSecondary, fontStyle: 'italic', padding: '20px 0' }}>
          Seleccionar un teatro arriba para emitir el parte de evaluación.
        </div>
      )}
    </div>
  );
}
