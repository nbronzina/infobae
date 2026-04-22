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
      <button type="button" onClick={onBack} style={{
        background: 'none', border: '1px solid ' + t.border, cursor: 'pointer',
        padding: isCampo ? '10px 14px' : '6px 12px',
        fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.04em', textTransform: 'uppercase',
        color: t.textSecondary, marginBottom: '20px', minHeight: s.touchMin
      }}>
        ← Volver al índice
      </button>

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
        <article style={{
          backgroundColor: t.bgCard,
          border: isCampo ? 'none' : '1px solid ' + t.border,
          padding: isCampo ? 0 : '40px 48px'
        }}>
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
  const s = sizesFor(modo);
  const isCampo = modo === 'campo';
  return (
    <header style={{
      borderBottom: '1px solid ' + t.border,
      paddingBottom: isCampo ? '20px' : '24px',
      marginBottom: isCampo ? '24px' : '32px'
    }}>
      <div style={{ fontFamily: MONO, fontSize: '11px', letterSpacing: '0.06em', color: t.textMeta, marginBottom: '10px' }}>
        {doc.area} · DOCUMENTO OPERATIVO · {doc.codigo}
      </div>
      <h1 style={{
        fontFamily: SERIF,
        fontSize: isCampo ? '24px' : '28px',
        fontWeight: 500, margin: '0 0 8px',
        letterSpacing: '-0.01em', lineHeight: 1.25, color: t.text
      }}>
        {doc.titulo}
      </h1>
      <div style={{
        fontFamily: SERIF, fontSize: isCampo ? '14.5px' : '15.5px',
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
          <section key={idx} style={{ marginBottom: isCampo ? '28px' : '36px' }}>
            <div style={{ fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.08em', color: t.textMeta, marginBottom: '6px' }}>
              {num}
            </div>
            <h2 style={{
              fontFamily: SERIF,
              fontSize: isCampo ? '18px' : '20px',
              fontWeight: 500, margin: '0 0 14px',
              letterSpacing: '-0.005em', color: t.text, lineHeight: 1.3
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
            {Array.isArray(sec.items) && (
              <ul style={{
                fontFamily: SERIF,
                fontSize: isCampo ? '14.5px' : '14.5px',
                lineHeight: isCampo ? 1.6 : 1.7,
                color: t.text,
                margin: 0, paddingLeft: '20px',
                maxWidth: isCampo ? 'none' : '38em'
              }}>
                {sec.items.map((it, i) => (
                  <li key={i} style={{ marginBottom: '6px' }}>{it}</li>
                ))}
              </ul>
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
      paddingTop: isCampo ? '20px' : '24px',
      borderTop: '1px solid ' + t.border,
      marginTop: isCampo ? '20px' : '8px'
    }}>
      <div style={{ fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '8px' }}>
        Fuentes
      </div>
      <div style={{
        fontFamily: SERIF, fontSize: isCampo ? '13px' : '13.5px',
        color: t.textSecondary, lineHeight: 1.6, fontStyle: 'italic',
        maxWidth: isCampo ? 'none' : '38em'
      }}>
        {fuentes}
      </div>
    </footer>
  );
}
