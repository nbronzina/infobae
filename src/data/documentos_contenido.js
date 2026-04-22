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
  },

  comunicacion_cifrada: {
    area: 'INFOBAE · SEGURIDAD DIGITAL',
    codigo: 'OP-SEC-2028-011', version: '3.1', fecha: '2028-12-01',
    responsable: 'j. fiorella (seg. digital)',
    titulo: 'Protocolo de comunicación cifrada en campo',
    subtitulo: 'Configuración y uso de canales seguros durante despliegue',
    secciones: [
      { titulo: 'Canales autorizados', texto: 'Signal es el canal primario para comunicación sensible con fuentes, fixers y redacción. Mensajes con desaparición automática activada (7 días default, 24 horas en zona activa). WhatsApp solo para coordinación logística no sensible. Correo electrónico solo con cifrado PGP/GPG para documentos que requieren archivo.' },
      { titulo: 'Dispositivos', texto: 'Dispositivo primario (personal): no se usa para comunicación sensible durante despliegue. Dispositivo secundario (GrapheneOS en Pixel): dedicado exclusivamente a comunicación operativa. Sin redes sociales, sin email personal, sin apps no autorizadas. Separación física entre ambos dispositivos en todo momento.' },
      { titulo: 'Rotación y destrucción', texto: 'Contraseñas de cuentas accedidas desde campo se rotan dentro de las 72 horas post-retorno (ver checklist post-despliegue en OP-SEC-2029-004). Dispositivo secundario: wipe completo si hay sospecha de compromiso. Ante duda, no intentar diagnosticar — ejecutar wipe y reportar a seg. digital.' }
    ],
    fuentes: 'Signal Foundation, EFF Surveillance Self-Defense, Access Now Digital Security Helpline.'
  },

  verificacion_c2pa: {
    area: 'INFOBAE · SEGURIDAD DIGITAL',
    codigo: 'OP-SEC-2029-001', version: '2.0', fecha: '2029-01-30',
    responsable: 'j. fiorella + d. roca',
    titulo: 'Verificación C2PA: guía de uso en redacción',
    subtitulo: 'Qué es C2PA, cómo verificar, y la tensión entre proveniencia y protección de la fuente',
    secciones: [
      { titulo: 'Qué es C2PA', texto: 'C2PA (Coalition for Content Provenance and Authenticity) es un estándar abierto impulsado por Adobe, Microsoft, Google, BBC y otros que permite inscribir metadatos criptográficamente firmados en archivos de imagen y video al momento de captura. Incluye: dispositivo, fecha, coordenadas GPS, y firma verificable. Canon y Nikon ya tienen cámaras con soporte nativo.' },
      { titulo: 'Cómo verificar', texto: 'Usar IPTC Origin Verifier (originverify.iptc.org) para verificar firma C2PA contra la Verified News Publishers List. El verificador muestra: validez de la firma, coincidencia del hash del manifiesto, y si el certificado corresponde a un medio registrado. Firma válida ≠ contenido verdadero — solo certifica quién capturó y cuándo.' },
      { titulo: 'Tensión proveniencia / protección', texto: 'Las coordenadas GPS embebidas en la firma C2PA son la localización exacta de quien capturó el material. En zona de conflicto, eso puede ser la ubicación del fixer. No existe aún un protocolo estándar de C2PA para contextos donde la localización del productor es información sensible. Hasta que exista: no publicar metadatos de proveniencia sin consentimiento explícito de la fuente. Registrar la verificación C2PA en OP-SEC-LOG pero redactar las coordenadas del log si la fuente lo solicita.' }
    ],
    fuentes: 'C2PA Specification (c2pa.org). Sam Gregory, "Deepfakes, misinformation and authenticity infrastructure responses", Journalism Practice, 2022. IPTC Origin Verifier.'
  },

  compromiso_dispositivo: {
    area: 'INFOBAE · SEGURIDAD DIGITAL',
    codigo: 'OP-SEC-2029-003', version: '1.4', fecha: '2029-02-10',
    responsable: 'j. fiorella',
    titulo: 'Procedimiento ante compromiso de dispositivo',
    subtitulo: 'Respuesta inmediata, contención y notificación',
    secciones: [
      { titulo: 'Indicadores de compromiso', texto: 'Actividad inusual en cuentas (sesiones no reconocidas, cambios de contraseña no solicitados). Comportamiento errático del dispositivo (calentamiento, batería, actividad de datos en reposo). Mensajes de verificación no solicitados (WhatsApp, X, email). Estos indicadores no confirman compromiso pero activan el protocolo preventivo.' },
      { titulo: 'Respuesta inmediata', texto: 'No intentar diagnosticar. No buscar el spyware. No instalar apps de escaneo. Apagar el dispositivo comprometido. No lo volver a encender. Comunicar al equipo de seguridad digital desde OTRO dispositivo. No reenviar información del dispositivo comprometido por ningún canal digital.' },
      { titulo: 'Contención', texto: 'Seguridad digital ejecuta análisis forense si es posible (requiere envío físico del dispositivo). Rotar todas las contraseñas de cuentas accedidas desde el dispositivo. Notificar a fuentes que hayan tenido contacto vía el dispositivo comprometido. Si el compromiso se confirma, reportar a Access Now Digital Security Helpline y documentar ante CPJ si corresponde.' }
    ],
    fuentes: 'Access Now Digital Security Helpline (accessnow.org/help). Citizen Lab, metodología de detección de Pegasus. Amnesty International Mobile Verification Toolkit (MVT).'
  },

  vigilancia_destino: {
    area: 'INFOBAE · SEGURIDAD DIGITAL',
    codigo: 'OP-SEC-2028-009', version: '2.3', fecha: '2028-10-15',
    responsable: 'j. fiorella + m. villafañe',
    titulo: 'Protocolo de vigilancia en destino',
    subtitulo: 'Awareness situacional y contra-vigilancia básica por región',
    secciones: [
      { titulo: 'Principio general', texto: 'Asumir vigilancia hasta que se demuestre lo contrario. En zona activa, la pregunta no es si hay vigilancia sino de quién. Los actores pueden ser estatales (inteligencia militar, policía), no estatales (grupos armados con capacidad OSINT), o infraestructurales (WPS, reconocimiento facial automatizado en checkpoints). Los tres pueden operar simultáneamente.' },
      { titulo: 'Frontera COL-VEN (Arauca/Apure)', texto: 'Actor dominante: ELN con capacidad de control territorial. FF.AA. venezolana con sistemas de reconocimiento facial en checkpoints (ver T-CKP en OP-SEC-2029-004). Disidencias FARC con capacidad de presión directa sobre periodistas locales (ver T-PHYS). Inteligencia colombiana activa en zona fronteriza. Starlink detectable por sensor pasivo (ver T-RF).' },
      { titulo: 'Argentina doméstica', texto: 'SIDE con capacidad documentada de seguimiento físico, colocación de GPS en vehículos, intervención telefónica, e intentos de hackeo post-publicación (ver T-DOM en OP-SEC-2029-004). Protocolo de contra-vigilancia urbana: variación de rutas, inspección periódica de vehículo, monitoreo de actividad anómala en cuentas. Red de aviso mutuo entre colegas (ver EXT-FOPEA-2028).' }
    ],
    fuentes: 'CPJ Safety Kit. RSF Safety Guide. FLIP Colombia, informes de seguridad 2024-2025. Casos documentados: legajo "Anaconda" (Alconada Mon, 2016-2020), intentos de hackeo post-PIN 2025.'
  },

  version_fixer: {
    area: 'INFOBAE · SEGURIDAD DIGITAL',
    codigo: 'OP-SEC-2029-004-FX', version: '1.0', fecha: '2029-04-15',
    responsable: 'j. fiorella · revisado por r. velásquez (ext.)',
    titulo: 'Higiene RF — versión resumida para fixer',
    subtitulo: 'Resumen operativo del manual OP-SEC-2029-004 para personal externo en campo',
    secciones: [
      { titulo: 'Qué es esto', texto: 'Este documento resume el manual de higiene RF de Infobae para uso del fixer designado durante el despliegue. No reemplaza el manual completo. Si necesitás el documento completo, pedilo al corresponsal o a seg.digital@infobae.interna.' },
      { titulo: 'Lo que tenés que saber', texto: 'Tu router de viaje y el terminal satelital emiten señales que pueden ser usadas para ubicarte. La randomización de BSSID ayuda pero no es suficiente. Apagá el terminal cuando no estés transmitiendo. Ventanas de transmisión cortas: 2-5 minutos, después apagar. No transmitir en movimiento.' },
      { titulo: 'Si algo sale mal', texto: 'Si recibís amenazas directas: contactar al corresponsal inmediatamente. Si tu dispositivo se comporta de manera extraña: no intentar arreglarlo, apagarlo, avisar al corresponsal. Si perdés contacto con el corresponsal por más de 12 horas: contactar a FLIP (Colombia) o SNTP (Venezuela) según tu ubicación.' }
    ],
    fuentes: 'Resumen de OP-SEC-2029-004 ed. 4.2. Versión en español colombiano/venezolano.'
  }
};

export function findDocContenido(key) {
  return DOCUMENTOS_CONTENIDO[key] || null;
}
