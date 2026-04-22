import React, { useState } from 'react';
import { DOCUMENTOS_SECCIONES, totalDocumentos } from './data/documentos_index.js';
import DocumentoView from './DocumentoView.jsx';
import { themeFor, sizesFor, SERIF, MONO } from './theme.js';

const ESTADO_LABEL = {
  vigente: 'vigente',
  en_revision: 'en revisión',
  borrador: 'borrador'
};

function estadoChipColors(estado, t) {
  if (estado === 'vigente') return { fg: t.vigente, bg: t.vigenteBg };
  if (estado === 'en_revision') return { fg: t.revision, bg: t.revisionBg };
  return { fg: t.textMeta, bg: t.bgElevated };
}

export default function DocsView({ modo }) {
  const t = themeFor(modo);
  const s = sizesFor(modo);
  const isCampo = modo === 'campo';
  const [activo, setActivo] = useState(null);
  const total = totalDocumentos();

  if (activo) {
    return <DocumentoView docKey={activo} modo={modo} onBack={() => setActivo(null)} />;
  }

  return (
    <div>
      <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '6px' }}>
        INFOBAE · DOCUMENTACIÓN · {total} documentos
      </div>
      <h1 style={{ fontFamily: SERIF, fontSize: s.fsTitle + 2, fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em', color: t.text }}>
        Doctrina y protocolos
      </h1>
      <div style={{ fontFamily: SERIF, fontSize: 14.5, color: t.textSecondary, fontStyle: 'italic', marginBottom: '24px', lineHeight: 1.5 }}>
        Archivo operativo completo. Los documentos se consultan por carpeta; el contenido se abre al seleccionar uno.
      </div>

      {isCampo ? (
        <CampoIndex seccs={DOCUMENTOS_SECCIONES} activo={activo} setActivo={setActivo} t={t} s={s} />
      ) : (
        <RedaccionIndex seccs={DOCUMENTOS_SECCIONES} activo={activo} setActivo={setActivo} t={t} s={s} />
      )}
    </div>
  );
}

function CampoIndex({ seccs, activo, setActivo, t, s }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {seccs.map(sec => (
        <section key={sec.key}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ fontFamily: MONO, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta }}>
              {sec.titulo}
            </div>
            <div style={{ fontFamily: MONO, fontSize: '10px', color: t.textMeta }}>
              {sec.docs.length} {sec.docs.length === 1 ? 'doc' : 'docs'}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {sec.docs.map((d, idx) => {
              const sel = activo === d.key;
              const chip = estadoChipColors(d.estado, t);
              return (
                <button key={d.key} type="button" onClick={() => setActivo(d.key)} style={{
                  textAlign: 'left', cursor: 'pointer',
                  padding: '14px 16px',
                  border: '1px solid ' + (sel ? t.borderStrong : t.border),
                  borderTop: idx === 0 ? '1px solid ' + (sel ? t.borderStrong : t.border) : 'none',
                  backgroundColor: sel ? t.bgAccent : t.bgCard,
                  color: t.text, minHeight: s.touchMin,
                  marginTop: idx === 0 ? 0 : '-1px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: MONO, fontSize: '10.5px', color: sel ? t.text : t.textMeta, fontWeight: sel ? 500 : 400, letterSpacing: '0.04em' }}>
                      {d.codigo}
                    </span>
                    <span style={{
                      fontFamily: MONO, fontSize: '9.5px', letterSpacing: '0.04em', textTransform: 'uppercase',
                      padding: '2px 7px', backgroundColor: chip.bg, color: chip.fg
                    }}>
                      {ESTADO_LABEL[d.estado]}
                    </span>
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: '15px', fontWeight: 500, lineHeight: 1.35, marginBottom: '2px' }}>
                    {d.titulo}
                  </div>
                  <div style={{ fontFamily: MONO, fontSize: '10px', color: t.textMeta }}>
                    v{d.version}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function RedaccionIndex({ seccs, activo, setActivo, t, s }) {
  return (
    <div>
      {seccs.map(sec => (
        <section key={sec.key} style={{ marginBottom: '30px' }}>
          <header style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid ' + t.borderStrong, paddingBottom: '6px', marginBottom: '4px', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: SERIF, fontSize: '18px', fontWeight: 500, margin: 0, letterSpacing: '-0.01em', color: t.text }}>
                {sec.titulo}
              </h2>
              <span style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta }}>
                {sec.docs.length} {sec.docs.length === 1 ? 'documento' : 'documentos'}
              </span>
            </div>
            <div style={{ fontFamily: SERIF, fontSize: '12.5px', color: t.textSecondary, fontStyle: 'italic' }}>
              {sec.subtitulo}
            </div>
          </header>

          <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {sec.docs.map(d => {
              const sel = activo === d.key;
              const chip = estadoChipColors(d.estado, t);
              return (
                <li key={d.key} style={{ borderBottom: '1px dotted ' + t.border }}>
                  <button type="button" onClick={() => setActivo(d.key)} style={{
                    width: '100%', textAlign: 'left', cursor: 'pointer',
                    background: sel ? t.bgAccent : 'transparent', border: 'none',
                    padding: '10px 6px',
                    color: t.text,
                    display: 'grid',
                    gridTemplateColumns: '160px 1fr 110px 60px',
                    gap: '14px', alignItems: 'baseline'
                  }}>
                    <span style={{ fontFamily: MONO, fontSize: '11px', color: sel ? t.text : t.textMeta, fontWeight: sel ? 500 : 400, letterSpacing: '0.03em' }}>
                      {d.codigo}
                    </span>
                    <span style={{ fontFamily: SERIF, fontSize: '14.5px', fontWeight: sel ? 500 : 400, lineHeight: 1.4 }}>
                      {d.titulo}
                    </span>
                    <span style={{
                      fontFamily: MONO, fontSize: '9.5px', letterSpacing: '0.04em', textTransform: 'uppercase',
                      padding: '2px 7px', backgroundColor: chip.bg, color: chip.fg,
                      justifySelf: 'start', alignSelf: 'center'
                    }}>
                      {ESTADO_LABEL[d.estado]}
                    </span>
                    <span style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, justifySelf: 'end' }}>
                      v{d.version}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
