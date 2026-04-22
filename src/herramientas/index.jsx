import React, { useState } from 'react';
import Checklist from './Checklist.jsx';
import DiarioCampo from './DiarioCampo.jsx';
import EvaluacionTeatro from './EvaluacionTeatro.jsx';
import { themeFor, sizesFor, SERIF, MONO } from '../theme';

const HERRAMIENTAS = [
  { id: 'evaluacion_teatro', codigo: 'OP-TOOL-2029-006', label: 'Evaluación por teatro', desc: 'Parte preliminar por destino — amenazas, protocolos, kit y contactos.', Component: EvaluacionTeatro },
  { id: 'checklist', codigo: 'OP-TOOL-2029-007', label: 'Checklist pre-despliegue', desc: 'Parte de aptitud operativa con firma conjunta al completar.', Component: Checklist },
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
        <button type="button" onClick={() => setActiva(null)} style={{
          background: 'none', border: '1px solid ' + t.border, cursor: 'pointer',
          padding: isCampo ? '10px 14px' : '6px 12px',
          fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.04em', textTransform: 'uppercase',
          color: t.textSecondary, marginBottom: '18px', minHeight: s.touchMin
        }}>
          ← Herramientas
        </button>
        <Tool modo={modo} onOpenDoc={onOpenDoc} onOpenPerfil={onOpenPerfil} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '6px' }}>
        HERRAMIENTAS · OP-TOOL-2029-*
      </div>
      <h1 style={{ fontFamily: SERIF, fontSize: s.fsTitle + 2, fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em', color: t.text }}>
        Herramientas operativas
      </h1>
      <div style={{ fontFamily: SERIF, fontSize: 14.5, color: t.textSecondary, fontStyle: 'italic', marginBottom: '24px', lineHeight: 1.5 }}>
        Mecánicas operativas que viven en el dispositivo. Cada una produce un parte firmado o un registro persistente. Ninguna requiere conexión a red.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: isCampo ? '10px' : '12px' }}>
        {HERRAMIENTAS.map(h => (
          <button key={h.id} type="button" onClick={() => setActiva(h.id)} style={{
            textAlign: 'left', background: t.bgCard, border: '1px solid ' + t.border,
            padding: isCampo ? '16px 16px' : '18px 20px', cursor: 'pointer', color: t.text,
            minHeight: s.touchMin
          }}>
            <div style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
              {h.codigo}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: isCampo ? '16px' : '17px', fontWeight: 500, marginBottom: '4px', color: t.text }}>
              {h.label}
            </div>
            <div style={{ fontFamily: SERIF, fontSize: '13px', color: t.textSecondary, lineHeight: 1.5 }}>
              {h.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
