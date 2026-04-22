// Contenido de los documentos. Estructura:
//
//   { area, codigo, version, fecha, responsable,
//     titulo, subtitulo,
//     secciones: [ { titulo, texto } | { titulo, items: [...] } ],
//     fuentes }
//
// El renderizador genérico (DocumentoView) interpreta esta forma. Si
// un documento tiene presentación especial (manual RF, ANMaC), se
// declara como { extenso: true } y el renderizador muestra un
// placeholder hasta su migración.
//
// Las secciones se agregan por carpeta, en commits sucesivos. Empezamos
// por Redacción.

export const DOCUMENTOS_CONTENIDO = {
  manual_estilo: {
    area: 'INFOBAE · REDACCIÓN',
    codigo: 'OP-RED-2027-001', version: '12.3', fecha: '2029-01-15',
    responsable: 'dirección editorial',
    titulo: 'Manual de estilo editorial',
    subtitulo: 'Criterios de voz, atribución y corrección para todas las ediciones',
    secciones: [
      { titulo: 'Voz editorial', texto: 'Infobae escribe en tercera persona para noticias y en primera persona atribuida para crónica y opinión. El registro es informativo directo. No se usan adjetivos valorativos sin atribución a fuente. La línea entre descripción factual y análisis se marca explícitamente en el texto.' },
      { titulo: 'Atribución de fuentes', texto: 'Toda afirmación de hecho requiere fuente identificable o, en su defecto, al menos dos fuentes independientes con anonimato otorgado bajo protocolo OP-RED-2028-003. Las fórmulas de atribución estándar son: "según declaró a Infobae", "de acuerdo con documentos a los que accedió Infobae", "según fuentes que pidieron anonimato por temor a represalias". Nunca "fuentes cercanas al gobierno" sin especificar qué gobierno.' },
      { titulo: 'Correcciones', texto: 'Los errores factuales se corrigen inmediatamente en el texto con nota de corrección visible al pie. Los errores de contexto se actualizan con nota de actualización. Ninguna corrección se aplica sin notificación al editor de turno. El registro de correcciones se archiva en OP-RED-LOG.' }
    ],
    fuentes: 'Documento interno. Basado en Reuters Handbook of Journalism (referencia) y criterio editorial propio.'
  },

  fuentes_anonimas: {
    area: 'INFOBAE · REDACCIÓN',
    codigo: 'OP-RED-2028-003', version: '3.0', fecha: '2028-09-10',
    responsable: 'dirección editorial + legales',
    titulo: 'Protocolo de fuentes anónimas',
    subtitulo: 'Criterios para otorgar anonimato y obligaciones asociadas',
    secciones: [
      { titulo: 'Cuándo se otorga anonimato', texto: 'El anonimato se otorga cuando la fuente enfrenta riesgo verificable (físico, legal, laboral) por revelar la información. No se otorga por comodidad ni por preferencia de la fuente. El periodista debe poder explicar al editor por qué el anonimato es necesario en cada caso.' },
      { titulo: 'Verificación obligatoria', texto: 'Toda información de fuente anónima requiere verificación independiente por al menos una vía adicional: documento, segunda fuente, o registro público. No se publica información que dependa exclusivamente de una fuente anónima única salvo autorización expresa del editor en jefe con justificación archivada.' },
      { titulo: 'Protección legal', texto: 'La identidad de la fuente anónima se conoce solo por el periodista y el editor responsable. No se registra en sistemas digitales compartidos. En caso de requerimiento judicial, se activa protocolo OP-LEG con representación legal. La protección de la fuente prevalece sobre la publicación.' }
    ],
    fuentes: 'Basado en Principios de Chatham House, Reuters Source Protection Policy, y jurisprudencia argentina (fallo "Campillay", CSJN 1986).'
  },

  verificacion_prepub: {
    area: 'INFOBAE · REDACCIÓN',
    codigo: 'OP-RED-2029-005', version: '5.1', fecha: '2029-02-20',
    responsable: 'mesa de verificación (d. roca)',
    titulo: 'Guía de verificación pre-publicación',
    subtitulo: 'Pasos obligatorios antes de publicar material sensible o de zona activa',
    secciones: [
      { titulo: 'Cadena de verificación', texto: 'Todo material de zona activa pasa por: 1) verificación de origen (quién envió, desde dónde, cuándo), 2) verificación de contenido (geolocalización, análisis de imagen/video, cross-check con fuentes independientes), 3) evaluación de riesgo de publicación (impacto sobre fuentes, fixers, y personal en campo), 4) firma editorial (editor de turno + seguridad digital si aplica).' },
      { titulo: 'Material con cadena C2PA', texto: 'Si el material tiene firma C2PA verificable, registrar el resultado de la verificación. La presencia de C2PA no exime de verificación editorial. Importante: las coordenadas GPS embebidas en la firma son información PII-CAMPO del productor. No publicar metadatos de proveniencia sin autorización expresa de la fuente.' },
      { titulo: 'Material sin cadena C2PA', texto: 'La ausencia de C2PA no invalida el material pero requiere verificación reforzada. Ejecutar detector de síntesis automatizado. Buscar al menos dos puntos de corroboración independiente. Documentar el proceso completo en OP-SEC-LOG.' }
    ],
    fuentes: 'Basado en First Draft Verification Handbook, BBC Editorial Guidelines, y IPTC Origin Verifier (originverify.iptc.org).'
  }
};

export function findDocContenido(key) {
  return DOCUMENTOS_CONTENIDO[key] || null;
}
