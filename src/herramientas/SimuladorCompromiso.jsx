import React, { useState } from 'react';
import simuladorData from '../data/simulador_compromiso.json';
import { themeFor, sizesFor, SERIF, MONO } from '../theme';

export default function SimuladorCompromiso({ modo, onOpenDoc }) {
  const t = themeFor(modo);
  const s = sizesFor(modo);
  const isCampo = modo === 'campo';

  const [scenario, setScenario] = useState(null);
  const [respuestasAll, setRespuestasAll] = useState({});
  const [emitido, setEmitido] = useState(false);

  const escenario = simuladorData.find(x => x.codigo === scenario);
  const respuestas = respuestasAll[scenario] || {};
  const decisionesCompletas = escenario ? escenario.decisiones.every(d => respuestas[d.id]) : false;
  const aciertos = escenario ? escenario.decisiones.filter(d => {
    const opt = d.opciones.find(o => o.id === respuestas[d.id]);
    return opt && opt.correcta;
  }).length : 0;
  const total = escenario ? escenario.decisiones.length : 0;
  const nivel = aciertos === total ? 'apto' : aciertos >= total - 1 ? 'observaciones' : 'repaso';
  const resColor = nivel === 'apto' ? t.vigente : nivel === 'observaciones' ? t.revision : t.alert;
  const resBg = nivel === 'apto' ? t.vigenteBg : nivel === 'observaciones' ? t.revisionBg : t.alertBg;
  const resLabel = nivel === 'apto' ? 'Apto' : nivel === 'observaciones' ? 'Apto con observaciones' : 'Requiere repaso';

  const elegir = (decisionId, opcionId) => {
    setRespuestasAll(prev => ({ ...prev, [scenario]: { ...(prev[scenario] || {}), [decisionId]: opcionId } }));
  };
  const reset = () => { setRespuestasAll(prev => ({ ...prev, [scenario]: {} })); setEmitido(false); };
  const cambiar = (codigo) => { setScenario(codigo); setEmitido(false); };
  const volverAEscenarios = () => { setScenario(null); setEmitido(false); };
  const openDoc = (key, codigo) => { if (onOpenDoc) onOpenDoc(key, codigo); };

  const verEscenarios = !escenario;

  return (
    <div>
      <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '6px' }}>
        INFOBAE · HERRAMIENTAS · OP-TOOL-2029-008
      </div>
      <h1 style={{ fontFamily: SERIF, fontSize: s.fsTitle + 2, fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em', color: t.text }}>
        Simulador de compromiso de dispositivo
      </h1>
      <div style={{ fontFamily: SERIF, fontSize: 14.5, color: t.textSecondary, fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.5 }}>
        Ejercicio de respuesta frente a un compromiso simulado. La evaluación contrasta cada decisión con el protocolo OP-SEC-2029-003 y el glosario T-SPY / T-CKP. El parte se firma por seguridad digital y formación al cierre del ejercicio.
      </div>

      <div style={{ padding: '10px 14px', backgroundColor: t.bgAccent, borderLeft: '2px solid ' + t.borderStrong, marginBottom: '20px' }}>
        <div style={{ fontFamily: MONO, fontSize: '11.5px', color: t.text, lineHeight: 1.55 }}>
          Elegir un escenario. Cada escenario plantea tres puntos de decisión. Las respuestas pueden revisarse antes de emitir el parte. Una vez emitido, queda registrado en OP-SEC-LOG como ejercicio de formación — no como incidente operativo.
        </div>
      </div>

      {/* En campo: si no hay escenario seleccionado, solo lista. Si hay uno, solo ese + botón volver.
          En redacción: lista arriba siempre visible, escenario abajo. */}
      {(isCampo ? verEscenarios : true) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isCampo ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: isCampo ? '8px' : '10px',
          marginBottom: (!isCampo && escenario) ? '32px' : '0'
        }}>
          {simuladorData.map(sc => {
            const sel = sc.codigo === scenario;
            return (
              <button key={sc.codigo} type="button" onClick={() => cambiar(sc.codigo)} style={{
                textAlign: 'left', padding: isCampo ? '16px 18px' : '14px 16px',
                border: '1px solid ' + (sel ? t.borderStrong : t.border),
                backgroundColor: sel ? t.bgAccent : t.bgCard,
                cursor: 'pointer', minHeight: s.touchMin, color: t.text
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase', color: sel ? t.text : t.textMeta }}>{sc.codigo} · {sc.amenaza_asociada}</span>
                  {isCampo && <span style={{ fontFamily: MONO, fontSize: '9.5px', color: sel ? t.accent : t.textMeta }}>{sel ? '✓ activo' : 'tocar →'}</span>}
                </div>
                <div style={{ fontFamily: SERIF, fontSize: isCampo ? '15.5px' : '14px', fontWeight: 500, marginBottom: '3px', lineHeight: 1.35 }}>{sc.titulo}</div>
                <div style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta }}>{sc.teatro}</div>
              </button>
            );
          })}
        </div>
      )}

      {escenario && (
        <>
          {isCampo && (
            <button type="button" onClick={volverAEscenarios} style={{
              background: 'none', border: '1px solid ' + t.border, cursor: 'pointer',
              padding: '10px 14px', fontFamily: MONO, fontSize: '10.5px',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              color: t.textSecondary, marginBottom: '14px', minHeight: s.touchMin
            }}>
              ← Cambiar escenario
            </button>
          )}

          <div style={{ backgroundColor: t.bgCard, border: '1px solid ' + t.border, padding: isCampo ? '20px 18px' : '24px 28px', marginBottom: '20px' }}>
            <div style={{ borderBottom: '1px solid ' + t.border, paddingBottom: '14px', marginBottom: '20px' }}>
              <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '4px' }}>
                Escenario · {escenario.codigo}
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: isCampo ? '20px' : '21px', fontWeight: 500, margin: '0 0 4px', letterSpacing: '-0.01em', lineHeight: 1.3, color: t.text }}>
                {escenario.titulo}
              </h2>
              <div style={{ fontFamily: MONO, fontSize: '11.5px', color: t.textSecondary, lineHeight: 1.6, marginBottom: '10px' }}>
                {escenario.teatro} · amenaza asociada {escenario.amenaza_asociada} · protocolo de referencia {escenario.protocolo_ref.codigo}
              </div>
              <div style={{ fontFamily: SERIF, fontSize: '13.5px', color: t.text, lineHeight: 1.6, padding: '12px 16px', backgroundColor: t.bgAccent, borderLeft: '2px solid ' + t.borderStrong }}>
                {escenario.contexto}
              </div>
            </div>

            {escenario.decisiones.map((d, idx) => {
              const elegida = respuestas[d.id];
              return (
                <section key={d.id} style={{ marginBottom: '22px' }}>
                  <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '8px' }}>
                    {d.id} · decisión {idx + 1} de {escenario.decisiones.length}
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: isCampo ? '16px' : '15px', fontWeight: 500, marginBottom: '12px', color: t.text, lineHeight: 1.35 }}>
                    {d.titulo}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: isCampo ? '8px' : '6px' }}>
                    {d.opciones.map(o => {
                      const sel = elegida === o.id;
                      return (
                        <button key={o.id} type="button" onClick={() => elegir(d.id, o.id)} style={{
                          textAlign: 'left', cursor: 'pointer',
                          padding: isCampo ? '14px 16px' : '10px 14px',
                          border: '1px solid ' + (sel ? t.borderStrong : t.border),
                          backgroundColor: sel ? t.bgAccent : t.bgCard,
                          display: 'flex', gap: '12px', alignItems: 'flex-start',
                          color: t.text, minHeight: isCampo ? 56 : s.touchMin,
                          width: '100%'
                        }}>
                          <span style={{ fontFamily: MONO, fontSize: isCampo ? '12px' : '11px', color: sel ? t.text : t.textMeta, fontWeight: sel ? 600 : 400, minWidth: '18px', flexShrink: 0 }}>{o.id}</span>
                          <span style={{ fontFamily: SERIF, fontSize: isCampo ? '13.5px' : '13px', color: t.text, lineHeight: 1.5, flex: 1 }}>{o.texto}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}

            <div style={{
              padding: '12px 16px', backgroundColor: t.bgAccent,
              borderLeft: '2px solid ' + (decisionesCompletas ? t.vigente : t.revision),
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'
            }}>
              <div style={{ fontFamily: MONO, fontSize: '11.5px', color: t.text }}>
                {Object.keys(respuestas).length} de {escenario.decisiones.length} decisiones tomadas {decisionesCompletas ? '· listo para emitir' : '· pendientes para emitir el parte'}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button type="button" onClick={reset} style={{
                  cursor: 'pointer', padding: isCampo ? '10px 14px' : '6px 12px', fontFamily: MONO,
                  fontSize: '10.5px', letterSpacing: '0.04em', textTransform: 'uppercase',
                  border: '1px solid ' + t.border, backgroundColor: 'transparent', color: t.textSecondary, minHeight: s.touchMin
                }}>Reset</button>
                <button type="button" disabled={!decisionesCompletas} onClick={() => decisionesCompletas && setEmitido(true)} style={{
                  cursor: decisionesCompletas ? 'pointer' : 'not-allowed', padding: isCampo ? '10px 14px' : '6px 12px',
                  fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.04em', textTransform: 'uppercase',
                  border: '1px solid ' + (decisionesCompletas ? t.text : t.border),
                  backgroundColor: decisionesCompletas ? t.text : t.bgElevated,
                  color: decisionesCompletas ? t.bg : t.textMeta,
                  opacity: decisionesCompletas ? 1 : 0.6, minHeight: s.touchMin
                }}>Emitir parte de ejercicio</button>
              </div>
            </div>
          </div>

          {emitido && decisionesCompletas && (
            <article style={{ padding: isCampo ? '20px 18px' : '28px 32px', backgroundColor: t.bgCard, border: '2px solid ' + t.borderStrong }}>
              <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: resColor, marginBottom: '8px' }}>
                Parte de ejercicio · emitido
              </div>
              <h2 style={{ fontFamily: SERIF, fontSize: '22px', fontWeight: 500, margin: '0 0 6px', color: t.text }}>{resLabel}</h2>
              <div style={{ fontFamily: SERIF, fontSize: '13.5px', color: t.textSecondary, fontStyle: 'italic', marginBottom: '18px' }}>
                {aciertos} de {total} decisiones alineadas al protocolo OP-SEC-2029-003.
              </div>

              <div style={{ fontFamily: MONO, fontSize: '11.5px', color: t.text, lineHeight: 1.7, marginBottom: '18px' }}>
                Fecha emisión: 2029-04-17 14:30 ART<br/>
                Operador: mondini.l<br/>
                Escenario: {escenario.codigo} — {escenario.titulo}<br/>
                Teatro de referencia: {escenario.teatro}<br/>
                Amenaza asociada: {escenario.amenaza_asociada}<br/>
                Código parte: OP-TOOL-2029-008 · instancia 2029-04-17-{escenario.codigo.slice(-3)}
              </div>

              <div style={{ padding: '14px 16px', backgroundColor: resBg, borderLeft: '2px solid ' + resColor, marginBottom: '20px' }}>
                <div style={{ fontFamily: SERIF, fontSize: '13px', color: t.text, lineHeight: 1.55 }}>
                  {nivel === 'apto' && 'El operador responde de manera consistente con el protocolo de referencia en los tres puntos de decisión. Queda registrado como ejercicio cerrado sin observaciones.'}
                  {nivel === 'observaciones' && 'El operador responde de manera mayormente alineada al protocolo. Queda registrada la desviación puntual para revisión cruzada con formación antes del próximo despliegue.'}
                  {nivel === 'repaso' && 'El operador presenta desvíos sostenidos respecto del protocolo de referencia. Se coordina sesión de repaso con formación (s. peralta) antes de habilitar próximo despliegue en teatro con amenaza T-SPY o T-CKP.'}
                </div>
              </div>

              <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '10px' }}>Revisión por decisión</div>
              <div style={{ marginBottom: '20px' }}>
                {escenario.decisiones.map((d, idx) => {
                  const opt = d.opciones.find(o => o.id === respuestas[d.id]);
                  if (!opt) return null;
                  const ok = opt.correcta;
                  const correctaRef = d.opciones.find(o => o.correcta);
                  return (
                    <div key={d.id} style={{
                      padding: '14px 16px', borderLeft: '3px solid ' + (ok ? t.vigente : t.alert),
                      backgroundColor: ok ? t.vigenteBg : t.alertBg, marginBottom: '8px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta }}>{d.id} · decisión {idx + 1} — {d.titulo}</span>
                        <span style={{ fontFamily: MONO, fontSize: '9.5px', padding: '2px 7px', letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: ok ? t.vigenteBg : t.alertBg, color: ok ? t.vigente : t.alert, border: '1px solid ' + (ok ? t.vigente : t.alert) }}>
                          {ok ? 'Alineada al protocolo' : 'No alineada al protocolo'}
                        </span>
                      </div>
                      <div style={{ fontFamily: SERIF, fontSize: '12.5px', color: t.text, lineHeight: 1.55, marginBottom: '6px' }}>
                        <span style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, marginRight: '6px' }}>elegida ({opt.id}):</span>
                        {opt.texto}
                      </div>
                      <div style={{ fontFamily: SERIF, fontSize: '12px', color: t.text, lineHeight: 1.55, marginBottom: ok ? 0 : '6px' }}>
                        <span style={{ fontFamily: MONO, fontSize: '10px', color: t.textMeta, marginRight: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>motivo:</span>
                        {opt.motivo}
                      </div>
                      {!ok && correctaRef && (
                        <div style={{ fontFamily: SERIF, fontSize: '12px', color: t.text, lineHeight: 1.55, paddingTop: '6px', borderTop: '1px dashed ' + t.border }}>
                          <span style={{ fontFamily: MONO, fontSize: '10px', color: t.vigente, marginRight: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>respuesta alineada ({correctaRef.id}):</span>
                          {correctaRef.texto}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '10px' }}>Doctrina aplicable</div>
              <div style={{ marginBottom: '20px' }}>
                {escenario.referencias_doctrina.map(r => (
                  <button key={r.codigo} type="button" onClick={() => openDoc(r.key, r.codigo)} style={{
                    width: '100%', textAlign: 'left', background: 'none', border: 'none',
                    borderBottom: '1px solid ' + t.border, padding: isCampo ? '12px 0' : '8px 0',
                    cursor: 'pointer', color: t.text, minHeight: s.touchMin
                  }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, minWidth: isCampo ? 'auto' : '140px' }}>{r.codigo}</span>
                      <span style={{ fontFamily: SERIF, fontSize: '13px', color: t.text, flex: 1 }}>{r.motivo}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div style={{ fontFamily: MONO, fontSize: '11px', color: t.textSecondary, lineHeight: 1.7 }}>
                Firmas:<br/>
                j. fiorella — seguridad digital<br/>
                s. peralta — formación y capacitación
              </div>
            </article>
          )}
        </>
      )}

      {!escenario && (
        <div style={{ fontFamily: SERIF, fontSize: '13px', color: t.textSecondary, fontStyle: 'italic', padding: '20px 0' }}>
          Seleccionar un escenario arriba para iniciar el ejercicio.
        </div>
      )}
    </div>
  );
}
