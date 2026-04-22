import React from 'react';
import { findDocContenido } from './data/documentos_contenido.js';
import { themeFor, sizesFor, SERIF, MONO } from './theme.js';

export default function DocumentoView({ docKey, modo, onBack }) {
  const t = themeFor(modo);
  const s = sizesFor(modo);
  const isCampo = modo === 'campo';

  const doc = findDocContenido(docKey);

  return (
    <div>
      {isCampo ? (
        <button type="button" onClick={onBack} style={{
          background: 'none', border: '1px solid ' + t.border, cursor: 'pointer',
          padding: '10px 14px',
          fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.04em', textTransform: 'uppercase',
          color: t.textSecondary, marginBottom: '20px', minHeight: s.touchMin
        }}>← Volver al índice</button>
      ) : (
        <button type="button" onClick={onBack} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          fontFamily: SERIF, fontSize: '13px', fontStyle: 'italic',
          color: t.textSecondary, marginBottom: '32px',
          borderBottom: '1px dotted ' + t.border, paddingBottom: '2px'
        }}>← volver al índice</button>
      )}

      {!doc && (
        <div style={{ padding: '24px', backgroundColor: t.bgAccent, borderLeft: '2px solid ' + t.revision }}>
          <div style={{ fontFamily: MONO, fontSize: '11px', letterSpacing: '0.04em', textTransform: 'uppercase', color: t.revision, marginBottom: '8px' }}>
            Documento pendiente de migración
          </div>
          <div style={{ fontFamily: SERIF, fontSize: '14px', color: t.text, lineHeight: 1.6 }}>
            El contenido de <strong>{docKey}</strong> todavía no fue portado al nuevo Shell. Consultar el archivo App.jsx hasta su migración.
          </div>
        </div>
      )}

      {doc && (
        <article style={{ background: 'transparent', border: 'none', padding: 0 }}>
          <DocHeader doc={doc} modo={modo} />
          <DocSecciones secciones={doc.secciones} modo={modo} />
          {doc.fuentes && <DocFuentes fuentes={doc.fuentes} modo={modo} />}
        </article>
      )}
    </div>
  );
}

function DocHeader({ doc, modo }) {
  const t = themeFor(modo);
  const isCampo = modo === 'campo';
  if (!isCampo) {
    // Redacción: portada editorial. Área + código en italic
    // serif arriba (no mono uppercase). Título grande tipo
    // capítulo. Subtítulo italic. Meta de edición serif al pie.
    return (
      <header style={{ marginBottom: '40px' }}>
        <div style={{ fontFamily: SERIF, fontSize: '12.5px', fontStyle: 'italic', color: t.textMeta, marginBottom: '14px' }}>
          {doc.area.toLowerCase()} · {doc.codigo}
        </div>
        <h1 style={{
          fontFamily: SERIF, fontSize: '36px', fontWeight: 500,
          margin: '0 0 14px', letterSpacing: '-0.02em', lineHeight: 1.1, color: t.text
        }}>
          {doc.titulo}
        </h1>
        <div style={{
          fontFamily: SERIF, fontSize: '17px',
          color: t.textSecondary, fontStyle: 'italic', lineHeight: 1.45,
          marginBottom: '24px', maxWidth: '34em'
        }}>
          {doc.subtitulo}
        </div>
        <div style={{ borderTop: '1px solid ' + t.border, paddingTop: '14px' }}>
          <div style={{ fontFamily: SERIF, fontSize: '13px', color: t.textMeta, lineHeight: 1.7, fontStyle: 'italic' }}>
            Edición {doc.version} · publicada {doc.fecha} · {doc.responsable}
          </div>
        </div>
      </header>
    );
  }
  // Campo: header operativo. Mono chrome, denso, con border-bottom.
  return (
    <header style={{
      borderBottom: '1px solid ' + t.border,
      paddingBottom: '20px', marginBottom: '24px'
    }}>
      <div style={{ fontFamily: MONO, fontSize: '11px', letterSpacing: '0.06em', color: t.textMeta, marginBottom: '10px' }}>
        {doc.area} · DOCUMENTO OPERATIVO · {doc.codigo}
      </div>
      <h1 style={{
        fontFamily: SERIF, fontSize: '24px', fontWeight: 500, margin: '0 0 8px',
        letterSpacing: '-0.01em', lineHeight: 1.25, color: t.text
      }}>
        {doc.titulo}
      </h1>
      <div style={{
        fontFamily: SERIF, fontSize: '14.5px',
        color: t.textSecondary, fontStyle: 'italic', lineHeight: 1.5,
        marginBottom: '16px'
      }}>
        {doc.subtitulo}
      </div>
      <div style={{ fontFamily: MONO, fontSize: '11px', color: t.textMeta, lineHeight: 1.7 }}>
        Edición {doc.version} · publicada {doc.fecha}<br/>
        Responsable: {doc.responsable}
      </div>
    </header>
  );
}

function DocSecciones({ secciones, modo }) {
  const t = themeFor(modo);
  const s = sizesFor(modo);
  const isCampo = modo === 'campo';

  return (
    <>
      {secciones.map((sec, idx) => {
        const num = String(idx + 1).padStart(2, '0');
        return (
          <section key={idx} style={{ marginBottom: isCampo ? '28px' : '44px' }}>
            {isCampo ? (
              <div style={{ fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.08em', color: t.textMeta, marginBottom: '6px' }}>
                {num}
              </div>
            ) : (
              <div style={{ fontFamily: SERIF, fontSize: '13px', fontStyle: 'italic', color: t.textMeta, marginBottom: '4px' }}>
                {num} ·
              </div>
            )}
            <h2 style={{
              fontFamily: SERIF,
              fontSize: isCampo ? '18px' : '22px',
              fontWeight: 500, margin: '0 0 16px',
              letterSpacing: isCampo ? '-0.005em' : '-0.01em',
              color: t.text, lineHeight: 1.25
            }}>
              {sec.titulo}
            </h2>
            {sec.texto && (
              <p style={{
                fontFamily: SERIF,
                fontSize: isCampo ? '15px' : '15px',
                lineHeight: isCampo ? 1.6 : 1.7,
                color: t.text, margin: 0,
                maxWidth: isCampo ? 'none' : '38em'
              }}>
                {sec.texto}
              </p>
            )}
            {Array.isArray(sec.parrafos) && sec.parrafos.map((p, i) => (
              <p key={i} style={{
                fontFamily: SERIF,
                fontSize: isCampo ? '15px' : '15px',
                lineHeight: isCampo ? 1.6 : 1.7,
                color: t.text,
                margin: i === sec.parrafos.length - 1 ? 0 : '0 0 14px',
                maxWidth: isCampo ? 'none' : '38em'
              }}>
                {p}
              </p>
            ))}
            {Array.isArray(sec.items) && (
              <ul style={{
                fontFamily: SERIF,
                fontSize: isCampo ? '14.5px' : '14.5px',
                lineHeight: isCampo ? 1.6 : 1.7,
                color: t.text,
                margin: sec.parrafos || sec.texto ? '14px 0 0' : 0, paddingLeft: '20px',
                maxWidth: isCampo ? 'none' : '38em'
              }}>
                {sec.items.map((it, i) => (
                  <li key={i} style={{ marginBottom: '6px' }}>{it}</li>
                ))}
              </ul>
            )}
            {Array.isArray(sec.bloques) && (
              <div style={{ marginTop: sec.parrafos || sec.texto || sec.items ? '18px' : 0 }}>
                {sec.bloques.map((b, i) => (
                  <div key={i} style={{
                    marginBottom: '20px', paddingBottom: '16px',
                    borderBottom: i < sec.bloques.length - 1 ? '1px dashed ' + t.border : 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      {b.codigo && (
                        <span style={{ fontFamily: MONO, fontSize: '12px', fontWeight: 500, color: t.alert }}>{b.codigo}</span>
                      )}
                      {b.titulo && (
                        <h3 style={{ fontFamily: SERIF, fontSize: '16px', fontWeight: 500, margin: 0, color: t.text, lineHeight: 1.3 }}>
                          {b.titulo}
                        </h3>
                      )}
                    </div>
                    {b.texto && (
                      <p style={{ fontFamily: SERIF, fontSize: '14px', lineHeight: 1.6, color: t.text, margin: 0, maxWidth: isCampo ? 'none' : '38em' }}>
                        {b.texto}
                      </p>
                    )}
                    {Array.isArray(b.parrafos) && b.parrafos.map((p, j) => (
                      <p key={j} style={{ fontFamily: SERIF, fontSize: '14px', lineHeight: 1.6, color: t.text, margin: j === 0 ? '0 0 8px' : '0 0 8px', maxWidth: isCampo ? 'none' : '38em' }}>
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}

function DocFuentes({ fuentes, modo }) {
  const t = themeFor(modo);
  const isCampo = modo === 'campo';
  return (
    <footer style={{
      paddingTop: isCampo ? '20px' : '32px',
      borderTop: '1px solid ' + t.border,
      marginTop: isCampo ? '20px' : '20px'
    }}>
      {isCampo ? (
        <div style={{ fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '8px' }}>
          Fuentes
        </div>
      ) : (
        <div style={{ fontFamily: SERIF, fontSize: '13px', fontStyle: 'italic', color: t.textMeta, marginBottom: '8px' }}>
          Fuentes —
        </div>
      )}
      <div style={{
        fontFamily: SERIF, fontSize: isCampo ? '13px' : '13.5px',
        color: t.textSecondary, lineHeight: 1.65, fontStyle: 'italic',
        maxWidth: isCampo ? 'none' : '38em'
      }}>
        {fuentes}
      </div>
    </footer>
  );
}
