import React, { useState } from 'react';
import { themeFor, sizesFor, SERIF, MONO } from '../theme';
import { ToolHeader, ToolCallout } from './_shared.jsx';

const SYSTEM_PROMPT_TEMPLATE = (consulta) => `Sos el "analista de guardia" integrado al manual operativo OP-SEC-2029-004 de Infobae. Tu rol es asistir a corresponsales y personal de campo evaluando material de interés (video, audio, imagen, texto, testimonio) contra el glosario de amenazas vigente. El usuario consulta desde la sección 07 del manual.

Contexto operacional del manual:
- Zona primaria de aplicación: frontera Arauca (COL) / Apure (VEN) post-transición venezolana 2026
- Actores dominantes: ELN, disidencias FARC reconfiguradas, inteligencia venezolana en transición
- Amenazas activas documentadas: T-WPS (harvesting geolocalización), T-RF (detección pasiva), T-SPY (spyware zero-click), T-SYNTH (contenido sintético), T-CKP (reconocimiento facial checkpoints)

Consulta recibida del usuario:
"${consulta}"

Respondé en castellano rioplatense, registro técnico-operacional como el del manual. Máximo 180 palabras. Sin slop. Sin drama. Sin introducción ni cierre conversacional. Estructurá así, con los labels en mayúsculas tal cual:

EVALUACIÓN PRELIMINAR: una línea.
AMENAZAS APLICABLES: códigos del glosario (T-WPS, T-RF, etc.) y por qué.
RECOMENDACIÓN OPERACIONAL: 2-3 pasos concretos del manual.
ESCALAMIENTO: a quién consultar si la consulta excede el manual (legales, seguridad digital, editor de turno).`;

export default function Analista({ modo }) {
  const t = themeFor(modo);
  const s = sizesFor(modo);
  const isCampo = modo === 'campo';

  const [input, setInput] = useState('');
  const [result, setResult] = useState({ loading: false, text: null, error: null });

  async function correr() {
    if (!input.trim()) return;
    setResult({ loading: true, text: null, error: null });
    const prompt = SYSTEM_PROMPT_TEMPLATE(input);
    try {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
      if (!apiKey) {
        setResult({ loading: false, text: null, error: 'VITE_ANTHROPIC_API_KEY no configurada en este build.' });
        return;
      }
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 600,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await response.json();
      const texto = data.content?.map(c => c.text || '').join('') || '(sin respuesta)';
      setResult({ loading: false, text: texto, error: null });
    } catch (e) {
      setResult({ loading: false, text: null, error: String(e) });
    }
  }

  const puedeCorrer = !result.loading && !!input.trim();

  return (
    <div>
      <ToolHeader
        codigo="OP-TOOL-2029-003"
        titulo="Analista de guardia"
        subtitulo="Módulo de consulta operacional para casos no cubiertos explícitamente por el manual. Asistencia orientativa — no sustituye consulta a Seguridad Digital ni decisión editorial humana."
        modo={modo}
      />
      <ToolCallout modo={modo}>
        Cada consulta queda registrada en OP-SEC-LOG con timestamp, usuario y contenido. La respuesta evalúa contra el glosario T-* y los protocolos vigentes — no consulta nada externo.
      </ToolCallout>

      <div style={{ backgroundColor: t.bgCard, border: '1px solid ' + t.border, padding: isCampo ? '18px 16px' : '20px 24px', marginBottom: '20px' }}>
        <label style={{ display: 'block', fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Describir situación o material a evaluar
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="ej: recibí un video del fixer en Arauca transmitido por Starlink durante 18 minutos continuos. ¿riesgo?"
          rows={isCampo ? 6 : 4}
          style={{
            width: '100%', padding: '10px 12px', fontSize: '12.5px', lineHeight: 1.55,
            border: '1px solid ' + t.border, backgroundColor: t.bgInput, color: t.text,
            outline: 'none', resize: 'vertical', fontFamily: MONO, boxSizing: 'border-box'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta }}>
            usuario: mondini.l · consulta registrada
          </div>
          <button type="button" onClick={correr} disabled={!puedeCorrer} style={{
            cursor: puedeCorrer ? 'pointer' : 'not-allowed',
            padding: isCampo ? '12px 18px' : '8px 16px',
            fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.06em', textTransform: 'uppercase',
            border: '1px solid ' + (puedeCorrer ? t.text : t.border),
            backgroundColor: puedeCorrer ? t.text : t.bgElevated,
            color: puedeCorrer ? t.bg : t.textMeta,
            opacity: puedeCorrer ? 1 : 0.6, minHeight: s.touchMin
          }}>
            {result.loading ? 'Procesando...' : 'Correr análisis'}
          </button>
        </div>
      </div>

      {result.text && (
        <article style={{ padding: isCampo ? '18px 16px' : '24px 28px', backgroundColor: t.bgCard, border: '1px solid ' + t.borderStrong, borderLeft: '3px solid ' + t.borderStrong, marginBottom: '14px' }}>
          <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '12px' }}>
            Respuesta del analista
          </div>
          <div style={{
            fontFamily: MONO,
            fontSize: isCampo ? '12.5px' : '12px',
            lineHeight: 1.7, color: t.text, whiteSpace: 'pre-wrap',
            maxWidth: isCampo ? 'none' : '38em'
          }}>
            {result.text}
          </div>
          <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed ' + t.border, fontFamily: MONO, fontSize: '10px', color: t.textMeta, fontStyle: 'italic' }}>
            análisis orientativo · escalamiento humano requerido para decisión editorial
          </div>
        </article>
      )}

      {result.error && (
        <div style={{ padding: '14px 16px', backgroundColor: t.alertBg, borderLeft: '3px solid ' + t.alert }}>
          <div style={{ fontFamily: MONO, fontSize: '11px', color: t.alert, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Error de consulta
          </div>
          <div style={{ fontFamily: MONO, fontSize: '11px', color: t.text, lineHeight: 1.55 }}>
            {result.error.slice(0, 240)} · reintentar o escalar a seg. digital.
          </div>
        </div>
      )}
    </div>
  );
}
