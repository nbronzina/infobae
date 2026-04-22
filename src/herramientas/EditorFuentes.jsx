import React, { useEffect, useState } from 'react';
import teatrosData from '../data/teatros.json';
import directorioData from '../data/directorio.json';
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

// Matriz nivel × riesgo. Resuelve canal de comunicación, citabilidad,
// custodia, contactos operativos por teatro y doctrina aplicable.
// Determinístico — el sistema no decide nada que no esté acá tabulado.
function evaluarFuente(r) {
  let canal;
  if (r.nivel === 'anonimato_total') {
    canal = 'Contacto únicamente vía intermediario aprobado (fixer designado o colega de confianza). Dead drop físico habilitado. No establecer canal digital directo entre fuente y operador. Encuentros coordinados por tercero, sin horario ni ubicación publicables.';
  } else if (r.nivel === 'deep_background') {
    canal = 'Signal en dispositivo dedicado con caducidad de mensajes a 1 hora. Sin screenshots. Sin transcripción literal. El registro en OP-SEC-LOG se hace por alias y sin vincular contenido al alias.';
  } else if (r.nivel === 'off_record') {
    canal = (r.riesgo === 'alto' || r.riesgo === 'critico')
      ? 'Signal en dispositivo dedicado con caducidad de mensajes a 24 horas. Encuentros presenciales con rutina de contra-vigilancia (ver OP-INV-2028-004). Sin registro fotográfico del encuentro.'
      : 'Signal con caducidad de mensajes a 7 días. Sin screenshots. Sin transcripción literal. Encuentros presenciales según disponibilidad.';
  } else {
    canal = (r.riesgo === 'alto' || r.riesgo === 'critico')
      ? 'Signal en dispositivo dedicado con caducidad de mensajes a 24 horas. Encuentros presenciales prioritarios sobre canal digital siempre que el material lo permita.'
      : 'Signal en número operativo. Encuentros presenciales según disponibilidad y sensibilidad del material.';
  }

  const citabilidadMap = {
    background: 'Atribuible por rol o sector — por ejemplo "un funcionario judicial con acceso al expediente" o "un mando policial de Rosario". Prohibido identificar por nombre, cargo específico o vínculo personal identificable. Verificación cruzada obligatoria por al menos una vía adicional (OP-RED-2028-003).',
    off_record: 'No citable en publicación. La información orienta la verificación por fuente independiente. Si la corroboración no se alcanza, el material no se publica. No registrar fragmentos literales en notas de trabajo.',
    deep_background: 'No citable ni por rol. La información ingresa como marco interpretativo y requiere corroboración por al menos una fuente citable adicional antes de cualquier publicación derivada.',
    anonimato_total: 'No citable, no referenciable. La información solo vale si se corrobora por fuente documental o testimonial independiente. Para la publicación, la fuente no existe.'
  };
  const citabilidad = citabilidadMap[r.nivel];

  const custodia = (r.nivel === 'deep_background' || r.nivel === 'anonimato_total')
    ? 'Periodista a cargo + dirección editorial. Registro fuera de sistemas digitales compartidos — archivo cifrado local con copia offline en bóveda de legales. Identidad real no se registra bajo ninguna forma en sistemas de la redacción.'
    : 'Periodista a cargo + editor de turno. Registro en OP-SEC-LOG por alias. La identidad real se conserva solo en notas personales del periodista responsable, bajo cifrado en dispositivo primario.';

  const contactosMap = {
    'ARQ-042': [{ key: 'velasquez', rol: 'Fixer designado · ventana de contacto en destino' }, { key: 'fiorella', rol: 'Seguridad digital · configuración de canal' }],
    'ROS-038': [{ key: 'villafane', rol: 'Operaciones · contra-vigilancia doméstica' }, { key: 'fiorella', rol: 'Seguridad digital · configuración de canal' }],
    'ANA-047': [{ key: 'fiorella', rol: 'Seguridad digital · perfil de amenaza T-DOM' }, { key: 'pollastri', rol: 'Legales · cobertura ante requerimiento judicial' }],
    'CCS-001': [{ key: 'quiroga', rol: 'Freelancer liaison · contactos locales' }, { key: 'fiorella', rol: 'Seguridad digital · configuración de canal' }],
    'ESQ-012': [{ key: 'fiorella', rol: 'Seguridad digital · configuración de canal' }, { key: 'villafane', rol: 'Operaciones · ventana de contacto' }],
    'ninguno': [{ key: 'fiorella', rol: 'Seguridad digital · configuración de canal' }]
  };
  const contactos = contactosMap[r.teatro] || contactosMap.ninguno;

  const docs = [
    { codigo: 'OP-RED-2028-003', key: 'fuentes_anonimas', motivo: 'Protocolo de atribución y verificación obligatoria para fuente anónima.' },
    { codigo: 'OP-SEC-2028-011', key: 'comunicacion_cifrada', motivo: 'Configuración de canales cifrados y escalera de fallback por nivel de riesgo.' }
  ];
  if (r.nivel === 'deep_background' || r.nivel === 'anonimato_total') {
    docs.push({ codigo: 'OP-INV-2028-004', key: 'contravigilancia', motivo: 'Rutinas de contra-vigilancia para encuentros presenciales y traslados.' });
  }
  if (r.riesgo === 'critico') {
    docs.push({ codigo: 'OP-SEC-2029-003', key: 'compromiso_dispositivo', motivo: 'Protocolo ante compromiso del dispositivo con impacto sobre la fuente.' });
  }

  const editorResponsable = (r.nivel === 'deep_background' || r.nivel === 'anonimato_total')
    ? 'dirección editorial'
    : 'f. zelaya — editor de turno';

  return { canal, citabilidad, custodia, contactos, docs, editorResponsable };
}

export default function EditorFuentes({ modo, onOpenDoc, onOpenPerfil }) {
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
  const [activa, setActiva] = useState(null);

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
    setActiva(registro);
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

      {registros.length > 0 && (
        <div style={{ marginBottom: activa ? '24px' : 0 }}>
          <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '10px' }}>
            Registros emitidos ({registros.length})
          </div>
          {isCampo ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {registros.slice().reverse().map(r => {
                const sel = activa?.codigo === r.codigo;
                const rColor = RIESGO[r.riesgo]?.color || t.textSecondary;
                return (
                  <button key={r.codigo} type="button" onClick={() => setActiva(r)} style={{
                    textAlign: 'left', cursor: 'pointer',
                    padding: '12px 14px',
                    border: '1px solid ' + (sel ? t.borderStrong : t.border),
                    borderLeft: '3px solid ' + rColor,
                    backgroundColor: sel ? t.bgAccent : t.bgCard,
                    color: t.text, minHeight: s.touchMin
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: MONO, fontSize: '11px', color: sel ? t.text : t.textMeta, fontWeight: sel ? 500 : 400 }}>{r.codigo}</span>
                      <span style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta }}>{r.fecha}</span>
                    </div>
                    <div style={{ fontFamily: SERIF, fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>{r.alias}</div>
                    <div style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta }}>
                      {TIPO_FUENTE[r.tipo]} · {NIVEL_PROTECCION[r.nivel].label} · riesgo {RIESGO[r.riesgo].label.toLowerCase()}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div style={{ border: '1px solid ' + t.border, backgroundColor: t.bgCard }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr 120px 130px 120px 90px',
                padding: '8px 14px', borderBottom: '1px solid ' + t.border,
                backgroundColor: t.bgAccent,
                fontFamily: MONO, fontSize: '10px', letterSpacing: '0.04em', textTransform: 'uppercase', color: t.textMeta, gap: '10px'
              }}>
                <span>Código</span>
                <span>Alias</span>
                <span>Tipo</span>
                <span>Protección</span>
                <span>Riesgo</span>
                <span>Fecha</span>
              </div>
              {registros.slice().reverse().map((r, idx, arr) => {
                const sel = activa?.codigo === r.codigo;
                return (
                  <button key={r.codigo} type="button" onClick={() => setActiva(r)} style={{
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr 120px 130px 120px 90px',
                    width: '100%', textAlign: 'left', gap: '10px',
                    padding: '10px 14px',
                    border: 'none',
                    borderBottom: idx < arr.length - 1 ? '1px solid ' + t.border : 'none',
                    backgroundColor: sel ? t.bgAccent : 'transparent',
                    cursor: 'pointer', color: t.text,
                    alignItems: 'baseline',
                    fontFamily: MONO, fontSize: '11px'
                  }}>
                    <span style={{ color: sel ? t.text : t.textMeta, fontWeight: sel ? 500 : 400 }}>{r.codigo}</span>
                    <span style={{ fontFamily: SERIF, fontSize: '13px', fontWeight: 500 }}>{r.alias}</span>
                    <span style={{ color: t.textMeta }}>{TIPO_FUENTE[r.tipo]}</span>
                    <span style={{ color: t.textMeta }}>{NIVEL_PROTECCION[r.nivel].label}</span>
                    <span style={{
                      color: RIESGO[r.riesgo].color, fontSize: '9.5px', letterSpacing: '0.04em',
                      textTransform: 'uppercase', padding: '2px 6px', backgroundColor: RIESGO[r.riesgo].bg,
                      alignSelf: 'center', justifySelf: 'start'
                    }}>{RIESGO[r.riesgo].label}</span>
                    <span style={{ color: t.textMeta }}>{r.fecha}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activa && (() => {
        const evalR = evaluarFuente(activa);
        const personaPorKey = Object.fromEntries(directorioData.map(p => [p.key, p]));
        const teatroNombre = activa.teatro === 'ninguno'
          ? 'Ninguno / doméstico general'
          : (teatrosData.find(x => x.codigo === activa.teatro)?.nombre || activa.teatro);
        const openDoc = (key, codigo) => { if (onOpenDoc) onOpenDoc(key, codigo); };
        const openPerfil = (key) => { if (onOpenPerfil) onOpenPerfil(key); };
        return (
          <article style={{
            padding: isCampo ? '20px 18px' : '28px 32px',
            backgroundColor: t.bgCard, border: '2px solid ' + t.borderStrong
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.vigente }}>
                Parte de registro de fuente · emitido
              </div>
              <button type="button" onClick={() => setActiva(null)} style={{
                cursor: 'pointer', padding: '4px 10px', fontFamily: MONO, fontSize: '10px',
                letterSpacing: '0.04em', textTransform: 'uppercase',
                border: '1px solid ' + t.border, backgroundColor: 'transparent', color: t.textSecondary
              }}>Cerrar parte</button>
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: '22px', fontWeight: 500, margin: '0 0 6px', color: t.text }}>
              {activa.codigo} — {activa.alias}
            </h2>
            <div style={{ fontFamily: SERIF, fontSize: '13.5px', color: t.textSecondary, fontStyle: 'italic', marginBottom: '18px' }}>
              Fuente {TIPO_FUENTE[activa.tipo].toLowerCase()} · nivel de protección {NIVEL_PROTECCION[activa.nivel].label.toLowerCase()} · riesgo {RIESGO[activa.riesgo].label.toLowerCase()}.
            </div>

            <div style={{ fontFamily: MONO, fontSize: '11.5px', color: t.text, lineHeight: 1.7, marginBottom: '20px' }}>
              Fecha de alta: {activa.fecha}<br/>
              Operador a cargo: {activa.operador}<br/>
              Alias: {activa.alias}<br/>
              Tipo: {TIPO_FUENTE[activa.tipo]}<br/>
              Teatro asociado: {teatroNombre}<br/>
              Nivel de protección: {NIVEL_PROTECCION[activa.nivel].label}<br/>
              Nivel de riesgo: {RIESGO[activa.riesgo].label}<br/>
              Código de registro: {activa.codigo}
            </div>

            <section style={{ marginBottom: '18px' }}>
              <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '8px' }}>
                Protocolo de comunicación
              </div>
              <div style={{ fontFamily: SERIF, fontSize: '13px', color: t.text, lineHeight: 1.6, padding: '12px 16px', backgroundColor: t.bgAccent, borderLeft: '2px solid ' + t.borderStrong }}>
                {evalR.canal}
              </div>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '8px' }}>
                Restricciones de publicación
              </div>
              <div style={{ fontFamily: SERIF, fontSize: '13px', color: t.text, lineHeight: 1.6, padding: '12px 16px', backgroundColor: t.bgAccent, borderLeft: '2px solid ' + t.alert }}>
                {evalR.citabilidad}
              </div>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '8px' }}>
                Custodia del registro
              </div>
              <div style={{ fontFamily: SERIF, fontSize: '13px', color: t.text, lineHeight: 1.6, padding: '12px 16px', backgroundColor: t.bgAccent, borderLeft: '2px solid ' + t.textSecondary }}>
                {evalR.custodia}
              </div>
            </section>

            <section style={{ marginBottom: '18px' }}>
              <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '8px' }}>
                Contactos operativos
              </div>
              {evalR.contactos.map(c => {
                const p = personaPorKey[c.key];
                if (!p) return null;
                return (
                  <button key={c.key} type="button" onClick={() => openPerfil(c.key)} style={{
                    width: '100%', textAlign: 'left', background: 'none', border: 'none',
                    borderBottom: '1px solid ' + t.border,
                    padding: isCampo ? '12px 0' : '8px 0',
                    cursor: 'pointer', color: t.text, minHeight: s.touchMin
                  }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: SERIF, fontSize: '13px', fontWeight: 500, minWidth: isCampo ? 'auto' : '160px' }}>{p.nombre}</span>
                      <span style={{ fontFamily: MONO, fontSize: '11px', color: t.textSecondary, flex: 1 }}>{c.rol}</span>
                    </div>
                  </button>
                );
              })}
            </section>

            <section style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '8px' }}>
                Doctrina aplicable
              </div>
              {evalR.docs.map(d => (
                <button key={d.codigo} type="button" onClick={() => openDoc(d.key, d.codigo)} style={{
                  width: '100%', textAlign: 'left', background: 'none', border: 'none',
                  borderBottom: '1px solid ' + t.border,
                  padding: isCampo ? '12px 0' : '8px 0',
                  cursor: 'pointer', color: t.text, minHeight: s.touchMin
                }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, minWidth: isCampo ? 'auto' : '140px' }}>{d.codigo}</span>
                    <span style={{ fontFamily: SERIF, fontSize: '13px', flex: 1 }}>{d.motivo}</span>
                  </div>
                </button>
              ))}
            </section>

            <div style={{ fontFamily: MONO, fontSize: '11px', color: t.textSecondary, lineHeight: 1.7, paddingTop: '14px', borderTop: '1px solid ' + t.border }}>
              Firmas:<br/>
              l. mondini — corresponsal a cargo<br/>
              {evalR.editorResponsable}<br/>
              l. pollastri — legales
            </div>
          </article>
        );
      })()}
    </div>
  );
}
