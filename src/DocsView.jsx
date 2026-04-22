import React, { useEffect, useState } from 'react';
import { DOCUMENTOS_SECCIONES, totalDocumentos } from './data/documentos_index.js';
import directorioData from './data/directorio.json';
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

export default function DocsView({ modo, request }) {
  const t = themeFor(modo);
  const s = sizesFor(modo);
  const isCampo = modo === 'campo';
  const [activo, setActivo] = useState(null);
  const [perfilActivo, setPerfilActivo] = useState(null);
  const total = totalDocumentos();

  useEffect(() => {
    if (!request || !request.t) return;
    if (request.type === 'doc') {
      setActivo(request.key);
      setPerfilActivo(null);
    } else if (request.type === 'perfil') {
      setPerfilActivo(request.key);
      setActivo(null);
    }
  }, [request?.t]);

  if (perfilActivo) {
    return <PerfilView personaKey={perfilActivo} modo={modo} onBack={() => setPerfilActivo(null)} />;
  }
  if (activo) {
    return <DocumentoView docKey={activo} modo={modo} onBack={() => setActivo(null)} />;
  }

  return (
    <div>
      {isCampo ? (
        <>
          <div style={{ fontFamily: MONO, fontSize: s.fsMicro, letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '6px' }}>
            INFOBAE · DOCUMENTACIÓN · {total} documentos
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: s.fsTitle + 2, fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em', color: t.text }}>
            Doctrina y protocolos
          </h1>
          <div style={{ fontFamily: SERIF, fontSize: 14.5, color: t.textSecondary, fontStyle: 'italic', marginBottom: '24px', lineHeight: 1.5 }}>
            Archivo operativo completo. Los documentos se consultan por carpeta; el contenido se abre al seleccionar uno.
          </div>
          <CampoIndex seccs={DOCUMENTOS_SECCIONES} activo={activo} setActivo={setActivo} t={t} s={s} />
        </>
      ) : (
        <>
          <h1 style={{ fontFamily: SERIF, fontSize: '32px', fontWeight: 500, margin: '0 0 12px', letterSpacing: '-0.015em', color: t.text, lineHeight: 1.15 }}>
            Doctrina y protocolos
          </h1>
          <div style={{ fontFamily: SERIF, fontSize: 15, color: t.textSecondary, fontStyle: 'italic', marginBottom: '12px', lineHeight: 1.6, maxWidth: '38em' }}>
            Índice general del archivo operativo. {total} documentos en siete carpetas. La pieza completa se abre al seleccionar un título.
          </div>
          <div style={{ fontFamily: MONO, fontSize: '10.5px', color: t.textMeta, letterSpacing: '0.04em', marginBottom: '36px' }}>
            edición {new Date().getUTCFullYear()} · uso interno · l. mondini
          </div>
          <RedaccionIndex seccs={DOCUMENTOS_SECCIONES} activo={activo} setActivo={setActivo} t={t} s={s} />
        </>
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

function RedaccionIndex({ seccs, activo, setActivo, t }) {
  return (
    <div>
      {seccs.map((sec, sIdx) => (
        <section key={sec.key} style={{ marginBottom: '40px' }}>
          <header style={{ marginBottom: '18px' }}>
            <div style={{ fontFamily: SERIF, fontSize: '12px', fontStyle: 'italic', color: t.textMeta, marginBottom: '4px' }}>
              parte {String(sIdx + 1).padStart(2, '0')}
            </div>
            <h2 style={{ fontFamily: SERIF, fontSize: '24px', fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em', color: t.text, lineHeight: 1.2 }}>
              {sec.titulo}
            </h2>
            <div style={{ fontFamily: SERIF, fontSize: '13.5px', color: t.textSecondary, fontStyle: 'italic', maxWidth: '38em', lineHeight: 1.55 }}>
              {sec.subtitulo}
            </div>
          </header>

          <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {sec.docs.map(d => {
              const sel = activo === d.key;
              return (
                <li key={d.key}>
                  <button type="button" onClick={() => setActivo(d.key)} style={{
                    width: '100%', textAlign: 'left', cursor: 'pointer',
                    background: 'transparent', border: 'none',
                    padding: '10px 0', color: t.text,
                    display: 'flex', alignItems: 'baseline', gap: '12px'
                  }}>
                    <span style={{ fontFamily: SERIF, fontSize: '15.5px', fontWeight: sel ? 500 : 400, fontStyle: sel ? 'normal' : 'italic', color: t.text, lineHeight: 1.45, flex: '0 1 auto' }}>
                      {d.titulo}
                    </span>
                    <span style={{ flex: '1 1 auto', borderBottom: '1px dotted ' + t.border, transform: 'translateY(-4px)', minWidth: '20px' }} />
                    <span style={{ fontFamily: MONO, fontSize: '11px', color: t.textMeta, letterSpacing: '0.03em', flex: '0 0 auto' }}>
                      {d.codigo}
                    </span>
                    {d.estado !== 'vigente' && (
                      <span style={{ fontFamily: SERIF, fontSize: '11px', fontStyle: 'italic', color: d.estado === 'en_revision' ? t.revision : t.textMeta, flex: '0 0 auto' }}>
                        {d.estado === 'en_revision' ? 'en revisión' : 'borrador'}
                      </span>
                    )}
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

function PerfilView({ personaKey, modo, onBack }) {
  const t = themeFor(modo);
  const s = sizesFor(modo);
  const isCampo = modo === 'campo';
  const persona = directorioData.find(p => p.key === personaKey);

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

      {!persona && (
        <div style={{ padding: '24px', backgroundColor: t.bgAccent, borderLeft: '2px solid ' + t.revision }}>
          <div style={{ fontFamily: MONO, fontSize: '11px', color: t.revision, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
            Perfil no encontrado
          </div>
          <div style={{ fontFamily: SERIF, fontSize: '13px', color: t.text, lineHeight: 1.55 }}>
            La key <strong>{personaKey}</strong> no figura en el directorio interno.
          </div>
        </div>
      )}

      {persona && (
        <article style={{
          backgroundColor: t.bgCard,
          border: isCampo ? 'none' : '1px solid ' + t.border,
          padding: isCampo ? 0 : '40px 48px'
        }}>
          <header style={{ borderBottom: '1px solid ' + t.border, paddingBottom: isCampo ? '20px' : '24px', marginBottom: isCampo ? '24px' : '32px' }}>
            <div style={{ fontFamily: MONO, fontSize: '11px', letterSpacing: '0.06em', color: t.textMeta, marginBottom: '10px', textTransform: 'uppercase' }}>
              INFOBAE · DIRECTORIO INTERNO · {persona.key}
            </div>
            <h1 style={{ fontFamily: SERIF, fontSize: isCampo ? '24px' : '28px', fontWeight: 500, margin: '0 0 8px', letterSpacing: '-0.01em', color: t.text }}>
              {persona.nombre}
            </h1>
            <div style={{ fontFamily: SERIF, fontSize: isCampo ? '14.5px' : '15.5px', color: t.textSecondary, fontStyle: 'italic', marginBottom: '12px', lineHeight: 1.5 }}>
              {persona.rol}
            </div>
            <div style={{ fontFamily: MONO, fontSize: '11px', color: t.textMeta, lineHeight: 1.7 }}>
              Base: {persona.base}<br/>
              Contacto: {persona.contacto}
              {Array.isArray(persona.aliases) && persona.aliases.length > 0 && (
                <><br/>Aliases: {persona.aliases.join(' · ')}</>
              )}
            </div>
          </header>

          {persona.libreta && <PerfilLibreta libreta={persona.libreta} modo={modo} />}
        </article>
      )}
    </div>
  );
}

function PerfilLibreta({ libreta, modo }) {
  const t = themeFor(modo);
  const isCampo = modo === 'campo';

  const SECCIONES = [
    { key: 'idiomas', titulo: 'Idiomas', valores: libreta.idiomas },
    { key: 'certificaciones', titulo: 'Certificaciones', valores: libreta.certificaciones },
    { key: 'autorizaciones', titulo: 'Autorizaciones', valores: libreta.autorizaciones },
    { key: 'entrenamientos_recientes', titulo: 'Entrenamientos recientes', valores: libreta.entrenamientos_recientes }
  ].filter(sc => Array.isArray(sc.valores) && sc.valores.length > 0);

  return (
    <>
      {libreta.ingreso && (
        <div style={{ fontFamily: MONO, fontSize: '11px', color: t.textMeta, marginBottom: isCampo ? '20px' : '24px' }}>
          Ingreso al equipo: {libreta.ingreso}
        </div>
      )}

      {SECCIONES.map(sec => (
        <section key={sec.key} style={{ marginBottom: isCampo ? '22px' : '28px' }}>
          <div style={{ fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '8px' }}>
            {sec.titulo}
          </div>
          <ul style={{ fontFamily: SERIF, fontSize: '14.5px', lineHeight: 1.6, color: t.text, margin: 0, paddingLeft: '20px', maxWidth: isCampo ? 'none' : '38em' }}>
            {sec.valores.map((v, i) => (<li key={i} style={{ marginBottom: '4px' }}>{v}</li>))}
          </ul>
        </section>
      ))}

      {Array.isArray(libreta.despliegues) && libreta.despliegues.length > 0 && (
        <section>
          <div style={{ fontFamily: MONO, fontSize: '10.5px', letterSpacing: '0.08em', textTransform: 'uppercase', color: t.textMeta, marginBottom: '8px' }}>
            Despliegues
          </div>
          <div style={{ border: '1px solid ' + t.border }}>
            {libreta.despliegues.map((d, i) => (
              <div key={i} style={{
                padding: '10px 14px',
                borderBottom: i < libreta.despliegues.length - 1 ? '1px solid ' + t.border : 'none',
                display: 'flex', gap: '12px', alignItems: 'baseline', flexWrap: 'wrap',
                fontFamily: MONO, fontSize: '11px', color: t.text
              }}>
                <span style={{ fontWeight: 500, minWidth: '90px' }}>{d.codigo}</span>
                <span style={{ color: t.textSecondary, minWidth: '120px' }}>{d.rol}</span>
                <span style={{ color: t.textSecondary, flex: 1 }}>{d.periodo}</span>
                <span style={{ fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.04em', color: d.estado === 'cerrado' ? t.vigente : t.revision }}>
                  {d.estado.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
