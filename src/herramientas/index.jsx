import React, { useState } from 'react';
import Analista from './Analista.jsx';
import Checklist from './Checklist.jsx';
import DiarioCampo from './DiarioCampo.jsx';
import EvaluacionTeatro from './EvaluacionTeatro.jsx';
import SimuladorCompromiso from './SimuladorCompromiso.jsx';
import EditorFuentes from './EditorFuentes.jsx';
import { themeFor, sizesFor, SERIF, MONO } from '../theme';

const HERRAMIENTAS = [
  { id: 'analista', codigo: 'OP-TOOL-2029-003', label: 'Analista de guardia', desc: 'Consulta operacional contra el manual OP-SEC-2029-004 y el glosario T-*.', Component: Analista },
  { id: 'evaluacion_teatro', codigo: 'OP-TOOL-2029-006', label: 'Evaluación por teatro', desc: 'Parte preliminar por destino — amenazas, protocolos, kit y contactos.', Component: EvaluacionTeatro },
  { id: 'checklist', codigo: 'OP-TOOL-2029-007', label: 'Checklist pre-despliegue', desc: 'Parte de aptitud operativa con firma conjunta al completar.', Component: Checklist },
  { id: 'simulador_compromiso', codigo: 'OP-TOOL-2029-008', label: 'Simulador de compromiso', desc: 'Ejercicio HEFAT contra el protocolo OP-SEC-2029-003.', Component: SimuladorCompromiso },
  { id: 'editor_fuentes', codigo: 'OP-TOOL-2029-009', label: 'Registro de fuentes', desc: 'Alta de fuente con parte firmado — identidad real no se guarda.', Component: EditorFuentes },
  { id: 'diario_campo', codigo: 'OP-TOOL-2029-010', label: 'Diario de campo', desc: 'Bitácora personal con cruce automático contra el glosario T-*.', Component: DiarioCampo }
];

export default function HerramientasView({ modo, onOpenDoc, onOpenPerfil }) {
  const t = themeFor(modo);
  const s = sizesFor(modo);
  const isCampo = modo === 'campo';
  const [activa, setActiva] = useState(null);

  const entry = HERRAMIENTAS.find(h => h.id === activa);

  if (entry) {
    const Tool = entry.Component;
    return (
      <div>
        {isCampo ? (
          <button type="button" onClick={() => setActiva(null)} style={{
            background: 'none', border: '1px solid ' + t.border, cursor: 'pointer',
            padding: '10px 14px',
            fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.04em', textTransform: 'uppercase',
            color: t.textSecondary, marginBottom: '18px', minHeight: s.touchMin
          }}>← Herramientas</button>
        ) : (
          <button type="button" onClick={() => setActiva(null)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontFamily: SERIF, fontSize: '13px', fontStyle: 'italic',
            color: t.textSecondary, marginBottom: '24px',
            borderBottom: '1px dotted ' + t.border, paddingBottom: '2px'
          }}>← volver al índice de herramientas</button>
        )}
        <Tool modo={modo} onOpenDoc={onOpenDoc} onOpenPerfil={onOpenPerfil} />
      </div>
    );
  }

  if (isCampo) return <CampoMenu setActiva={setActiva} t={t} s={s} />;
  return <RedaccionMenu setActiva={setActiva} t={t} />;
}

function CampoMenu({ setActiva, t, s }) {
  return (
    <div>
      <h1 style={{ fontFamily: SERIF, fontSize: '22px', fontWeight: 500, margin: '0 0 16px', letterSpacing: '-0.01em', color: t.text, lineHeight: 1.2 }}>
        Herramientas
      </h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {HERRAMIENTAS.map(h => (
          <button key={h.id} type="button" onClick={() => setActiva(h.id)} style={{
            textAlign: 'left', background: t.bgCard, border: '1px solid ' + t.border,
            padding: '10px 12px', cursor: 'pointer', color: t.text,
            minHeight: s.touchMin,
            display: 'flex', flexDirection: 'column', gap: '2px'
          }}>
            <div style={{ fontFamily: MONO, fontSize: '9.5px', color: t.textMeta, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {h.codigo}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: '15px', fontWeight: 500, color: t.text, lineHeight: 1.3 }}>
              {h.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function RedaccionMenu({ setActiva, t }) {
  return (
    <div>
      <h1 style={{ fontFamily: SERIF, fontSize: '32px', fontWeight: 500, margin: '0 0 12px', letterSpacing: '-0.015em', color: t.text, lineHeight: 1.15 }}>
        Herramientas operativas
      </h1>
      <div style={{ fontFamily: SERIF, fontSize: 15, color: t.textSecondary, fontStyle: 'italic', marginBottom: '36px', lineHeight: 1.6, maxWidth: '38em' }}>
        Mecánicas operativas que viven en el dispositivo. Cada una produce un parte firmado o un registro persistente. Ninguna requiere conexión a red.
      </div>

      <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {HERRAMIENTAS.map((h, i) => (
          <li key={h.id} style={{ borderBottom: '1px dotted ' + t.border }}>
            <button type="button" onClick={() => setActiva(h.id)} style={{
              width: '100%', textAlign: 'left', background: 'transparent', border: 'none',
              padding: '20px 0', cursor: 'pointer', color: t.text,
              display: 'grid', gridTemplateColumns: '36px 1fr', columnGap: '14px',
              alignItems: 'baseline'
            }}>
              <span style={{ fontFamily: SERIF, fontSize: '16px', fontStyle: 'italic', color: t.textMeta }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <div style={{ fontFamily: SERIF, fontSize: '19px', fontWeight: 500, marginBottom: '6px', color: t.text, letterSpacing: '-0.005em', lineHeight: 1.3 }}>
                  {h.label}
                </div>
                <div style={{ fontFamily: SERIF, fontSize: '14.5px', color: t.textSecondary, lineHeight: 1.55, fontStyle: 'italic', maxWidth: '34em' }}>
                  {h.desc}
                </div>
                <div style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, marginTop: '6px', letterSpacing: '0.04em' }}>
                  {h.codigo}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
