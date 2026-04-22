import React, { useEffect, useState } from 'react';
import teatrosData from '../data/teatros.json';
import { themeFor, sizesFor, SERIF, MONO } from '../theme';

const TIPO_ENTRADA = {
  observacion: 'Observación',
  incidente: 'Incidente',
  contacto: 'Contacto con fuente',
  movimiento: 'Movimiento',
  anomalia: 'Anomalía técnica'
};

const KEYWORDS_AMENAZA = {
  'T-WPS': ['wifi', 'wi-fi', 'bssid', 'ssid', 'geolocalización', 'geolocalizacion', 'router', ' wps ', 'hotspot', 'red inalámbrica', 'red inalambrica', 'dirección mac', 'direccion mac'],
  'T-RF': ['starlink', 'terminal satelital', 'satelital', 'transmisión rf', 'transmision rf', 'emisión rf', 'emision rf', ' leo ', 'señal satelital', 'senal satelital', 'detector rf', 'rf pasivo'],
  'T-SPY': ['spyware', 'pegasus', 'zero-click', 'zero click', 'implante', 'adjunto sospechoso', 'mensaje sospechoso', 'dispositivo comprometido', 'comportamiento anómalo', 'comportamiento anomalo', 'batería cae', 'bateria cae', 'pdf sospechoso', 'link sospechoso', 'sms no solicitado', 'mensaje no solicitado', 'sesión no reconocida', 'sesion no reconocida'],
  'T-SYNTH': ['deepfake', 'sintético', 'sintetico', 'generado por modelo', 'contenido fabricado', 'manipulado digitalmente', ' c2pa ', 'verificación de origen', 'verificacion de origen'],
  'T-CKP': ['checkpoint', 'reconocimiento facial', 'cámara biométrica', 'camara biometrica', 'requisa', 'aduana', 'control migratorio', 'retén', 'reten', 'control vehicular'],
  'T-PHYS': [' dron ', 'drones', 'seguimiento físico', 'seguimiento fisico', 'escolta armada', 'intimidación', 'intimidacion', 'agresión', 'agresion', 'vehículo sospechoso', 'vehiculo sospechoso', 'me sigue', 'me siguen', 'amenaza directa', 'disparos', 'arma exhibida'],
  'T-DOM': [' side ', 'inteligencia estatal', 'inteligencia argentina', 'gps en vehículo', 'gps en vehiculo', 'gps colocado', 'intervención telefónica', 'intervencion telefonica', 'teléfono pinchado', 'telefono pinchado', 'hackeo post', 'espionaje estatal', 'legajo anaconda']
};

const DOC_POR_AMENAZA = {
  'T-WPS': { key: 'main', codigo: 'OP-SEC-2029-004', titulo: 'Higiene RF · sección T-WPS' },
  'T-RF': { key: 'main', codigo: 'OP-SEC-2029-004', titulo: 'Higiene RF · sección T-RF' },
  'T-SPY': { key: 'compromiso_dispositivo', codigo: 'OP-SEC-2029-003', titulo: 'Procedimiento ante compromiso de dispositivo' },
  'T-SYNTH': { key: 'verificacion_c2pa', codigo: 'OP-SEC-2029-001', titulo: 'Verificación C2PA en redacción' },
  'T-CKP': { key: 'vigilancia_destino', codigo: 'OP-SEC-2028-009', titulo: 'Protocolo de vigilancia en destino' },
  'T-PHYS': { key: 'vigilancia_destino', codigo: 'OP-SEC-2028-009', titulo: 'Protocolo de vigilancia en destino' },
  'T-DOM': { key: 'contravigilancia', codigo: 'OP-INV-2028-004', titulo: 'Contra-vigilancia doméstica' }
};

function detectarAmenazas(texto) {
  const t = ' ' + texto.toLowerCase().replace(/\s+/g, ' ') + ' ';
  const codigos = [];
  for (const [codigo, keywords] of Object.entries(KEYWORDS_AMENAZA)) {
    if (keywords.some(kw => t.includes(kw.toLowerCase()))) codigos.push(codigo);
  }
  return codigos;
}

function alertasRecurrencia(entradas, referencia) {
  const cutoff = referencia.getTime() - 7 * 24 * 60 * 60 * 1000;
  const counts = {};
  entradas.forEach(e => {
    const ts = new Date(e.fecha).getTime();
    if (ts >= cutoff && Array.isArray(e.amenazas)) {
      e.amenazas.forEach(a => { counts[a] = (counts[a] || 0) + 1; });
    }
  });
  return Object.entries(counts).filter(([, n]) => n >= 3).map(([codigo, count]) => ({ codigo, count }));
}

const AHORA = new Date('2029-04-17T09:14:00Z');

export default function DiarioCampo({ modo, onOpenDoc }) {
  const t = themeFor(modo);
  const s = sizesFor(modo);
  const isCampo = modo === 'campo';

  const URGENCIA = {
    rutina: { label: 'Rutina', color: t.textSecondary, bg: t.bgElevated },
    atencion: { label: 'Atención', color: t.revision, bg: t.revisionBg },
    alerta: { label: 'Alerta', color: t.alert, bg: t.alertBg }
  };

  const [diario, setDiario] = useState(() => {
    if (typeof localStorage === 'undefined') return [];
    try { return JSON.parse(localStorage.getItem('infobae:diario') || '[]'); } catch { return []; }
  });
  const [form, setForm] = useState({ teatro: 'ninguno', tipo: '', urgencia: 'rutina', texto: '' });
  const [filtroTeatro, setFiltroTeatro] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  useEffect(() => {
    try { localStorage.setItem('infobae:diario', JSON.stringify(diario)); } catch {}
  }, [diario]);

  const teatrosOpc = [...teatrosData.map(x => ({ codigo: x.codigo, nombre: x.nombre })), { codigo: 'ninguno', nombre: 'Ninguno / doméstico' }];
  const formCompleto = form.texto.trim() && form.tipo;
  const updateForm = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  function guardar() {
    if (!formCompleto) return;
    const baseMs = diario.length > 0
      ? new Date(diario[0].fecha).getTime() + 60 * 1000
      : AHORA.getTime();
    const fecha = new Date(baseMs).toISOString();
    const id = `DIA-2029-${String(diario.length + 1).padStart(4, '0')}`;
    const amenazas = detectarAmenazas(form.texto);
    const entrada = { id, fecha, teatro: form.teatro, tipo: form.tipo, urgencia: form.urgencia, texto: form.texto.trim(), amenazas, operador: 'mondini.l' };
    setDiario(prev => [entrada, ...prev]);
    setForm({ teatro: 'ninguno', tipo: '', urgencia: 'rutina', texto: '' });
  }

  const entradasFiltradas = diario.filter(e => {
    if (filtroTeatro !== 'todos' && e.teatro !== filtroTeatro) return false;
    if (filtroTipo !== 'todos' && e.tipo !== filtroTipo) return false;
    return true;
  });
  const alertas = alertasRecurrencia(diario, AHORA);
  const proximaFechaPreview = diario.length > 0
    ? new Date(new Date(diario[0].fecha).getTime() + 60 * 1000)
    : AHORA;

  const fmtFecha = (d) => {
    const date = typeof d === 'string' ? new Date(d) : d;
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const mi = String(date.getUTCMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} · ${hh}:${mi} UTC`;
  };

  const pillStyle = (activo) => ({
    cursor: 'pointer', padding: isCampo ? '10px 14px' : '7px 12px',
    fontSize: '11.5px', fontFamily: MONO,
    border: '1px solid ' + (activo ? t.borderStrong : t.border),
    backgroundColor: activo ? t.bgAccent : t.bgCard, color: t.text,
    fontWeight: activo ? 500 : 400, minHeight: s.touchMin
  });

  const openDoc = (key, codigo) => { if (onOpenDoc) onOpenDoc(key, codigo); };

  return (
    <div>
      <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '6px' }}>
        INFOBAE · HERRAMIENTAS · OP-TOOL-2029-010
      </div>
      <h1 style={{ fontFamily: SERIF, fontSize: s.fsTitle + 2, fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em', color: t.text }}>
        Diario de campo
      </h1>
      <div style={{ fontFamily: SERIF, fontSize: 14.5, color: t.textSecondary, fontStyle: 'italic', marginBottom: '20px', lineHeight: 1.5 }}>
        Bitácora personal del corresponsal. Cada entrada se cruza contra el glosario T-* y queda archivada en el dispositivo. Si una misma amenaza aparece en tres entradas o más dentro de una ventana de siete días, el sistema sugiere revisión del protocolo asociado.
      </div>

      <div style={{ padding: '10px 14px', backgroundColor: t.bgAccent, borderLeft: '2px solid ' + t.borderStrong, marginBottom: '20px' }}>
        <div style={{ fontFamily: MONO, fontSize: '11.5px', color: t.text, lineHeight: 1.55 }}>
          El diario es de uso personal — no circula por el equipo. El cruce de amenazas es orientativo y no reemplaza el reporte formal en OP-SEC-LOG. Entradas con urgencia "alerta" se recomienda duplicarlas en el log auditable.
        </div>
      </div>

      {alertas.length > 0 && (
        <div style={{ marginBottom: '22px' }}>
          {alertas.map(a => {
            const ref = DOC_POR_AMENAZA[a.codigo];
            return (
              <div key={a.codigo} style={{ padding: '14px 16px', backgroundColor: t.alertBg, borderLeft: '3px solid ' + t.alert, marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <div style={{ fontFamily: MONO, fontSize: '11.5px', color: t.alert, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    Recurrencia {a.codigo} · {a.count} entradas en los últimos 7 días
                  </div>
                  {ref && (
                    <button type="button" onClick={() => openDoc(ref.key, ref.codigo)} style={{
                      background: 'none', border: 'none', padding: 0, cursor: 'pointer',
                      fontFamily: MONO, fontSize: '10.5px', color: t.docLink,
                      textDecoration: 'underline', textDecorationStyle: 'dotted'
                    }}>ver {ref.codigo} →</button>
                  )}
                </div>
                <div style={{ fontFamily: SERIF, fontSize: '13px', color: t.text, lineHeight: 1.55 }}>
                  Se sugiere revisión del protocolo {ref?.titulo || a.codigo} y, si corresponde, escalamiento a seguridad digital.
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ backgroundColor: t.bgCard, border: '1px solid ' + t.border, padding: isCampo ? '18px 16px' : '20px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta }}>Nueva entrada</div>
          <div style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta }}>
            Timestamp auto: {fmtFecha(proximaFechaPreview)} · operador mondini.l
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>Teatro asociado</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {teatrosOpc.map(tr => (
              <button key={tr.codigo} type="button" onClick={() => updateForm('teatro', tr.codigo)} style={pillStyle(form.teatro === tr.codigo)}>
                {tr.codigo === 'ninguno' ? 'Ninguno' : `${tr.codigo} · ${tr.nombre}`}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>Tipo de entrada</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {Object.entries(TIPO_ENTRADA).map(([k, label]) => (
              <button key={k} type="button" onClick={() => updateForm('tipo', k)} style={pillStyle(form.tipo === k)}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>Nivel de urgencia</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {Object.entries(URGENCIA).map(([k, v]) => {
              const activo = form.urgencia === k;
              return (
                <button key={k} type="button" onClick={() => updateForm('urgencia', k)} style={{
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

        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>Texto de la entrada</label>
          <textarea value={form.texto} onChange={(e) => updateForm('texto', e.target.value)} placeholder="Registrar observación con el detalle operativo relevante. El sistema cruza el texto contra el glosario T-* al guardar." rows={5} style={{
            width: '100%', padding: '10px 12px', fontSize: '13px', lineHeight: 1.55,
            border: '1px solid ' + t.border, backgroundColor: t.bgInput, color: t.text,
            outline: 'none', resize: 'vertical', fontFamily: SERIF, boxSizing: 'border-box'
          }} />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button type="button" disabled={!formCompleto} onClick={guardar} style={{
            cursor: formCompleto ? 'pointer' : 'not-allowed', padding: isCampo ? '12px 18px' : '8px 14px',
            fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.04em', textTransform: 'uppercase',
            border: '1px solid ' + (formCompleto ? t.text : t.border),
            backgroundColor: formCompleto ? t.text : t.bgElevated,
            color: formCompleto ? t.bg : t.textMeta,
            opacity: formCompleto ? 1 : 0.6, minHeight: s.touchMin
          }}>Guardar entrada</button>
          <button type="button" onClick={() => setForm({ teatro: 'ninguno', tipo: '', urgencia: 'rutina', texto: '' })} style={{
            cursor: 'pointer', padding: isCampo ? '12px 18px' : '8px 14px',
            fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.04em', textTransform: 'uppercase',
            border: '1px solid ' + t.border, backgroundColor: 'transparent', color: t.textSecondary, minHeight: s.touchMin
          }}>Limpiar</button>
        </div>
      </div>

      {diario.length > 0 && (
        <div style={{ marginBottom: '14px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'baseline' }}>
          <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta }}>Filtros</div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: MONO, fontSize: '10px', color: t.textMeta, marginRight: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>teatro</span>
            {[{ codigo: 'todos', nombre: 'Todos' }, ...teatrosOpc].map(tr => {
              const activo = filtroTeatro === tr.codigo;
              return (
                <button key={tr.codigo} type="button" onClick={() => setFiltroTeatro(tr.codigo)} style={{
                  cursor: 'pointer', padding: '3px 8px', fontSize: '10.5px', fontFamily: MONO,
                  border: '1px solid ' + (activo ? t.borderStrong : t.border),
                  backgroundColor: activo ? t.bgAccent : 'transparent', color: t.text
                }}>
                  {tr.codigo === 'todos' ? 'Todos' : (tr.codigo === 'ninguno' ? 'Ninguno' : tr.codigo)}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: MONO, fontSize: '10px', color: t.textMeta, marginRight: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>tipo</span>
            {[['todos', 'Todos'], ...Object.entries(TIPO_ENTRADA)].map(([k, label]) => {
              const activo = filtroTipo === k;
              return (
                <button key={k} type="button" onClick={() => setFiltroTipo(k)} style={{
                  cursor: 'pointer', padding: '3px 8px', fontSize: '10.5px', fontFamily: MONO,
                  border: '1px solid ' + (activo ? t.borderStrong : t.border),
                  backgroundColor: activo ? t.bgAccent : 'transparent', color: t.text
                }}>{label}</button>
              );
            })}
          </div>
        </div>
      )}

      {diario.length === 0 && (
        <div style={{ fontFamily: SERIF, fontSize: '13px', color: t.textSecondary, fontStyle: 'italic', padding: '20px 0' }}>
          Diario vacío. La primera entrada abre el timeline.
        </div>
      )}

      {diario.length > 0 && entradasFiltradas.length === 0 && (
        <div style={{ fontFamily: SERIF, fontSize: '13px', color: t.textSecondary, fontStyle: 'italic', padding: '20px 0' }}>
          Ninguna entrada coincide con los filtros actuales.
        </div>
      )}

      {entradasFiltradas.length > 0 && (
        <div style={{ position: 'relative', paddingLeft: '18px' }}>
          <div style={{ position: 'absolute', left: '4px', top: '4px', bottom: '4px', width: '1px', backgroundColor: t.border }} />
          {entradasFiltradas.map(e => {
            const urg = URGENCIA[e.urgencia] || URGENCIA.rutina;
            const teatroLabel = e.teatro === 'ninguno' ? 'doméstico' : e.teatro;
            return (
              <div key={e.id} style={{ position: 'relative', marginBottom: '14px' }}>
                <div style={{ position: 'absolute', left: '-18px', top: '16px', width: '9px', height: '9px', borderRadius: '50%', backgroundColor: urg.color, border: '1px solid ' + t.bg }} />
                <div style={{ backgroundColor: t.bgCard, border: '1px solid ' + t.border, padding: '14px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <div style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta }}>
                      {fmtFecha(e.fecha)} · {e.id}
                    </div>
                    <span style={{ fontFamily: MONO, fontSize: '9.5px', padding: '2px 7px', letterSpacing: '0.04em', textTransform: 'uppercase', backgroundColor: urg.bg, color: urg.color }}>{urg.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: '8px' }}>
                    <span style={{ fontFamily: MONO, fontSize: '10.5px', color: t.text, fontWeight: 500 }}>{TIPO_ENTRADA[e.tipo] || e.tipo}</span>
                    <span style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta }}>teatro {teatroLabel}</span>
                    <span style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta }}>operador {e.operador || 'mondini.l'}</span>
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: '13px', color: t.text, lineHeight: 1.6, whiteSpace: 'pre-wrap', marginBottom: e.amenazas?.length ? '10px' : 0 }}>
                    {e.texto}
                  </div>
                  {Array.isArray(e.amenazas) && e.amenazas.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '8px', borderTop: '1px dashed ' + t.border }}>
                      <span style={{ fontFamily: MONO, fontSize: '10px', color: t.textMeta, marginRight: '2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>amenazas detectadas</span>
                      {e.amenazas.map(a => {
                        const ref = DOC_POR_AMENAZA[a];
                        const clickable = !!ref;
                        const baseStyle = { fontFamily: MONO, fontSize: '10px', padding: '2px 7px', backgroundColor: t.alertBg, color: t.alert, fontWeight: 500 };
                        if (clickable) {
                          return (
                            <button key={a} type="button" onClick={() => openDoc(ref.key, ref.codigo)} style={{ ...baseStyle, cursor: 'pointer', border: 'none' }}>{a}</button>
                          );
                        }
                        return <span key={a} style={baseStyle}>{a}</span>;
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
