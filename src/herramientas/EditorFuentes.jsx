import React, { useEffect, useState } from 'react';
import teatrosData from '../data/teatros.json';
import { themeFor, sizesFor, SERIF, MONO } from '../theme';

const NIVEL_PROTECCION = {
  background: { label: 'Background', glosa: 'Atribuible al rol o sector sin identificación específica.' },
  off_record: { label: 'Off the record', glosa: 'No citable. Orienta la verificación por fuente independiente.' },
  deep_background: { label: 'Deep background', glosa: 'No citable ni por rol. Marco interpretativo.' },
  anonimato_total: { label: 'Anonimato total', glosa: 'No citable, no referenciable bajo ninguna forma.' }
};

const TIPO_FUENTE = {
  judicial: 'Judicial', policial: 'Policial', politica: 'Política',
  militar: 'Militar', civil: 'Civil', periodistica: 'Periodística'
};

const ESTADO_INICIAL = { alias: '', nivel: '', tipo: '', teatro: 'ninguno', riesgo: '' };

export default function EditorFuentes({ modo }) {
  const t = themeFor(modo);
  const s = sizesFor(modo);
  const isCampo = modo === 'campo';

  const RIESGO = {
    bajo: { label: 'Bajo', color: t.vigente, bg: t.vigenteBg },
    medio: { label: 'Medio', color: t.textSecondary, bg: t.bgElevated },
    alto: { label: 'Alto', color: t.revision, bg: t.revisionBg },
    critico: { label: 'Crítico', color: t.alert, bg: t.alertBg }
  };

  const [form, setForm] = useState(ESTADO_INICIAL);
  const [registros, setRegistros] = useState(() => {
    if (typeof localStorage === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('infobae:fuentes') || '[]'); } catch { return []; }
  });
  const [ultimoEmitido, setUltimoEmitido] = useState(null);

  useEffect(() => {
    try { localStorage.setItem('infobae:fuentes', JSON.stringify(registros)); } catch {}
  }, [registros]);

  const teatrosOpc = [
    ...teatrosData.map(x => ({ codigo: x.codigo, nombre: x.nombre })),
    { codigo: 'ninguno', nombre: 'Ninguno / doméstico general' }
  ];

  const updateForm = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const formCompleto = form.alias.trim() && form.nivel && form.tipo && form.riesgo;

  function emitir() {
    if (!formCompleto) return;
    const siguiente = registros.length + 1;
    const codigo = `FTE-2029-${String(siguiente).padStart(4, '0')}`;
    const registro = {
      codigo,
      alias: form.alias.trim(),
      nivel: form.nivel,
      tipo: form.tipo,
      teatro: form.teatro,
      riesgo: form.riesgo,
      fecha: '2029-04-17',
      operador: 'mondini.l'
    };
    setRegistros(prev => [...prev, registro]);
    setUltimoEmitido(registro);
    setForm(ESTADO_INICIAL);
  }

  const pillStyle = (activo) => ({
    cursor: 'pointer', padding: isCampo ? '10px 14px' : '7px 12px',
    fontSize: '11.5px', fontFamily: MONO,
    border: '1px solid ' + (activo ? t.borderStrong : t.border),
    backgroundColor: activo ? t.bgAccent : t.bgCard, color: t.text,
    fontWeight: activo ? 500 : 400, minHeight: s.touchMin
  });

  return (
    <div>
      <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '6px' }}>
        INFOBAE · HERRAMIENTAS · OP-TOOL-2029-009
      </div>
      <h1 style={{ fontFamily: SERIF, fontSize: s.fsTitle + 2, fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em', color: t.text }}>
        Registro de fuentes anónimas
      </h1>
      <div style={{ fontFamily: SERIF, fontSize: 14.5, color: t.textSecondary, fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.5 }}>
        Alta de fuente con parte firmado. La identidad real no se registra aquí — sólo el alias.
      </div>

      <div style={{ padding: '10px 14px', backgroundColor: t.alertBg, borderLeft: '2px solid ' + t.alert, marginBottom: '20px' }}>
        <div style={{ fontFamily: MONO, fontSize: '11.5px', color: t.text, lineHeight: 1.55 }}>
          El alias es un código operativo — nunca el nombre real de la fuente, ni un seudónimo vinculable. La identidad real queda en custodia del periodista a cargo según el protocolo OP-RED-2028-003.
        </div>
      </div>

      <div style={{ backgroundColor: t.bgCard, border: '1px solid ' + t.border, padding: isCampo ? '18px 16px' : '24px 28px', marginBottom: '24px' }}>
        <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '14px' }}>
          Alta de fuente
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>Alias operativo</label>
          <input
            type="text"
            value={form.alias}
            onChange={(e) => updateForm('alias', e.target.value)}
            placeholder="ej. ROJO-03, CLAVE-ANDES, TESTIGO-B"
            style={{
              width: '100%', maxWidth: isCampo ? 'none' : '420px',
              padding: isCampo ? '12px 12px' : '10px 12px',
              fontSize: '13px', fontFamily: MONO,
              border: '1px solid ' + t.border, backgroundColor: t.bgInput, color: t.text,
              outline: 'none', boxSizing: 'border-box',
              minHeight: s.touchMin
            }}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>Nivel de protección</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {Object.entries(NIVEL_PROTECCION).map(([k, v]) => (
              <button key={k} type="button" onClick={() => updateForm('nivel', k)} style={pillStyle(form.nivel === k)}>{v.label}</button>
            ))}
          </div>
          {form.nivel && (
            <div style={{ fontFamily: SERIF, fontSize: '12px', color: t.textSecondary, marginTop: '6px', fontStyle: 'italic' }}>
              {NIVEL_PROTECCION[form.nivel].glosa}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>Tipo de fuente</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {Object.entries(TIPO_FUENTE).map(([k, label]) => (
              <button key={k} type="button" onClick={() => updateForm('tipo', k)} style={pillStyle(form.tipo === k)}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ display: 'block', fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>Teatro asociado</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {teatrosOpc.map(tr => (
              <button key={tr.codigo} type="button" onClick={() => updateForm('teatro', tr.codigo)} style={pillStyle(form.teatro === tr.codigo)}>
                {tr.codigo === 'ninguno' ? 'Ninguno' : `${tr.codigo} · ${tr.nombre}`}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>Nivel de riesgo de la fuente</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {Object.entries(RIESGO).map(([k, v]) => {
              const activo = form.riesgo === k;
              return (
                <button key={k} type="button" onClick={() => updateForm('riesgo', k)} style={{
                  cursor: 'pointer', padding: isCampo ? '10px 14px' : '7px 12px',
                  fontSize: '11.5px', fontFamily: MONO,
                  border: '1px solid ' + (activo ? v.color : t.border),
                  backgroundColor: activo ? v.bg : t.bgCard,
                  color: activo ? v.color : t.text, fontWeight: activo ? 500 : 400,
                  minHeight: s.touchMin
                }}>{v.label}</button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button type="button" disabled={!formCompleto} onClick={emitir} style={{
            cursor: formCompleto ? 'pointer' : 'not-allowed',
            padding: isCampo ? '12px 18px' : '8px 14px',
            fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.04em', textTransform: 'uppercase',
            border: '1px solid ' + (formCompleto ? t.text : t.border),
            backgroundColor: formCompleto ? t.text : t.bgElevated,
            color: formCompleto ? t.bg : t.textMeta,
            opacity: formCompleto ? 1 : 0.6,
            minHeight: s.touchMin
          }}>Emitir parte de registro</button>
          <button type="button" onClick={() => setForm(ESTADO_INICIAL)} style={{
            cursor: 'pointer', padding: isCampo ? '12px 18px' : '8px 14px',
            fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.04em', textTransform: 'uppercase',
            border: '1px solid ' + t.border, backgroundColor: 'transparent', color: t.textSecondary,
            minHeight: s.touchMin
          }}>Limpiar formulario</button>
        </div>
      </div>

      {ultimoEmitido && (
        <div style={{ padding: '12px 16px', backgroundColor: t.vigenteBg, borderLeft: '2px solid ' + t.vigente }}>
          <div style={{ fontFamily: MONO, fontSize: '11px', color: t.vigente, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '4px' }}>
            Registro guardado · {ultimoEmitido.codigo}
          </div>
          <div style={{ fontFamily: SERIF, fontSize: '13px', color: t.text, lineHeight: 1.5 }}>
            Fuente {ultimoEmitido.alias} archivada en el dispositivo. El parte firmado se compone en el paso siguiente de la herramienta.
          </div>
        </div>
      )}
    </div>
  );
}
