import React from 'react';
import { themeFor, sizesFor, SERIF, MONO } from '../theme';

// Header compartido por las 6 herramientas. En campo mantiene el
// chrome mono uppercase. En redacción se renderiza como portada
// editorial — área italic, título grande tipo capítulo, subtítulo
// italic ancho de lectura, separador fino al pie.
export function ToolHeader({ codigo, titulo, subtitulo, modo }) {
  const t = themeFor(modo);
  const s = sizesFor(modo);
  const isCampo = modo === 'campo';

  if (!isCampo) {
    return (
      <header style={{ marginBottom: '36px' }}>
        <div style={{ fontFamily: SERIF, fontSize: '12.5px', fontStyle: 'italic', color: t.textMeta, marginBottom: '12px' }}>
          herramienta operativa · {codigo}
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: '32px', fontWeight: 500, margin: '0 0 12px', letterSpacing: '-0.015em', lineHeight: 1.15, color: t.text }}>
          {titulo}
        </h1>
        {subtitulo && (
          <div style={{ fontFamily: SERIF, fontSize: '15px', color: t.textSecondary, fontStyle: 'italic', lineHeight: 1.55, maxWidth: '38em' }}>
            {subtitulo}
          </div>
        )}
      </header>
    );
  }

  return (
    <header style={{ marginBottom: '16px' }}>
      <div style={{ fontFamily: MONO, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '4px' }}>
        {codigo}
      </div>
      <h1 style={{ fontFamily: SERIF, fontSize: '20px', fontWeight: 500, margin: '0 0 4px', letterSpacing: '-0.01em', color: t.text, lineHeight: 1.25 }}>
        {titulo}
      </h1>
      {subtitulo && (
        <div style={{ fontFamily: SERIF, fontSize: '13px', color: t.textSecondary, fontStyle: 'italic', lineHeight: 1.45 }}>
          {subtitulo}
        </div>
      )}
    </header>
  );
}

// Callout para la nota de uso al inicio de cada herramienta. En
// campo es la barra mono con border-left que ya usábamos. En
// redacción es un párrafo italic con regla horizontal fina al pie,
// sin background — papel directo.
export function ToolCallout({ children, modo }) {
  const t = themeFor(modo);
  const isCampo = modo === 'campo';
  if (!isCampo) {
    return (
      <div style={{ marginBottom: '32px', maxWidth: '38em' }}>
        <p style={{ fontFamily: SERIF, fontSize: '13.5px', color: t.textSecondary, fontStyle: 'italic', lineHeight: 1.65, margin: '0 0 14px' }}>
          {children}
        </p>
        <div style={{ borderTop: '1px solid ' + t.border }} />
      </div>
    );
  }
  return (
    <div style={{ padding: '10px 14px', backgroundColor: t.bgAccent, borderLeft: '2px solid ' + t.borderStrong, marginBottom: '20px' }}>
      <div style={{ fontFamily: MONO, fontSize: '11.5px', color: t.text, lineHeight: 1.55 }}>
        {children}
      </div>
    </div>
  );
}
