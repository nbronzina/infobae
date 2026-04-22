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
  },

  // Manual operativo principal. Key 'main' preservada para no romper
  // cross-refs en checklist_predespliegue.json, teatros.json,
  // escenarios.json y DiarioCampo.jsx (DOC_POR_AMENAZA). Las 8
  // secciones se cargan en commits sucesivos.
  main: {
    area: 'INFOBAE · SEGURIDAD DIGITAL',
    codigo: 'OP-SEC-2029-004', version: '4.2', fecha: '2029-03-14',
    responsable: 'j. fiorella · revisado por m. villafañe + l. pollastri',
    titulo: 'Higiene RF en despliegue internacional',
    subtitulo: 'Protección contra localización por emisiones de radiofrecuencia (Wi-Fi, Starlink, celular) — manual operativo para corresponsales y personal de campo',
    secciones: [
      {
        titulo: 'Alcance y vigencia',
        parrafos: [
          'Este manual establece el protocolo operativo de higiene electromagnética y seguridad RF para personal de Infobae desplegado en zonas de conflicto de intensidad variable, con foco inicial en la frontera colombo-venezolana (Arauca–Apure) durante el período de transición política venezolana.',
          'Aplica a corresponsales de staff, productores, operadores de cámara, fixers bajo contrato, y cualquier persona que opere equipamiento de transmisión asociado a un despliegue de Infobae. No sustituye los requisitos legales argentinos de comercio exterior (ANMaC, ENACOM) ni los protocolos de seguridad física.',
          'Acceso del fixer: este manual debe ser compartido en su totalidad con el fixer designado antes del despliegue. Un protocolo que protege al corresponsal pero no llega al periodista local que asume el riesgo de campo reproduce la brecha que pretende mitigar. Si el fixer no tiene acceso al documento, la cadena de seguridad está rota. Versión resumida disponible en español colombiano y español venezolano bajo código OP-SEC-2029-004-FX.',
          'La vigencia es de seis meses contados desde la publicación de cada edición. Las mitigaciones detalladas en el apéndice dependen de versiones de firmware específicas que pueden cambiar sin aviso. El manual se revisa trimestralmente y ante cualquier incidente operacional que lo amerite.',
          'Nota sobre aplicabilidad doméstica: si bien el foco del manual es despliegue internacional, las secciones T-DOM y T-SPY del glosario aplican a periodistas de investigación que operan desde territorio argentino bajo condiciones de vigilancia estatal documentada. El vector doméstico no es menor ni separado — es previo al despliegue y persiste después del retorno.'
        ]
      },
      {
        titulo: 'Protocolo pre-despliegue',
        texto: 'Completar en orden antes de cada salida internacional. Tiempo mínimo recomendado: 30 días hábiles. Tiempo mínimo absoluto (salida urgente): 72 horas, con autorización del editor de turno y asunción documentada de riesgos no cubiertos por protocolo.',
        items: [
          'Verificar firmware del router de viaje. Requerido: release 2024 o posterior con randomización BSSID vigente.',
          'Terminal satelital: si fue adquirido en Argentina, verificar que el modelo figure en RAMATEL-ENACOM (Starlink Mini: homologado desde 2025, Res. 955/2025). Llevar copia de factura de compra y especificaciones como documentación de respaldo en aduana. Si fue adquirido en el exterior y no tiene homologación argentina, consultar con legales antes de reingresar al país.',
          'Equipamiento de protección balística: clasificado como material de usos especiales (Ley 20.429, Decreto 395/75). Requiere Credencial de Legítimo Usuario (CLU) vigente ante ANMaC. Egreso limitado a 1 chaleco por año calendario (Disp. RENAR 883/11, Formularios Leyes 23.283 y 23.412). Tenencia tarda aprox. 30 días. Alternativa: préstamo gratuito RSF en destino (fianza 300€ reembolsable).',
          'Registrar itinerario tentativo en sistema de despliegues. Incluir puntos de contacto, fixer designado, protocolo de check-in.',
          'Confirmar cobertura de seguro de alto riesgo. ART doméstica no cubre zona activa.',
          'Instalar perfil GrapheneOS en dispositivo secundario. Dispositivo principal permanece en Buenos Aires.',
          'Limpiar metadatos de perfiles públicos relevantes al despliegue. Revisar archivo fotográfico accesible.',
          'Coordinar primera ventana de transmisión con redacción. Definir fallback comms.'
        ]
      },
      {
        titulo: 'Glosario de amenazas',
        texto: 'Las siete categorías documentadas como vigentes en zona primaria de aplicación y territorio doméstico. Actualización continua por el equipo de Seguridad Digital.',
        bloques: [
          {
            codigo: 'T-WPS',
            titulo: 'Harvesting de geolocalización por Wi-Fi',
            parrafos: [
              'Sistemas de posicionamiento Wi-Fi de proveedores comerciales (principalmente Apple WPS) mantienen bases de datos globales de BSSIDs con coordenadas asociadas. Cualquier actor con acceso a esa API puede rastrear la posición histórica y actual de un router o terminal satelital con resolución aproximada de 8 metros.',
              'Implicación operacional: terminales Starlink con firmware anterior a 2024 y routers de viaje sin randomización de MAC quedan inscriptos en la base como presencia persistente del operador.',
              'Mitigación: bagging (bolsa Faraday) del router durante traslados. Firmware 2024+ en terminal principal. Añadir _nomap al SSID de cualquier red operada.',
              'Implicancias estratégicas: regulatoria — presión institucional sobre ENACOM para incluir requisitos de firmware en RAMATEL. Formativa — higiene de MAC y bagging Faraday como módulo base del HEFAT. Operacional — verificación de firmware 2024+ obligatoria en checklist pre-despliegue.'
            ]
          },
          {
            codigo: 'T-RF',
            titulo: 'Detección pasiva de emisión RF',
            parrafos: [
              'Sensores pasivos de detección de terminales Starlink — caso de referencia reportado: StarLock / Excem Technologies, presentación en FEINDEF Madrid 2025, sin verificación independiente por terceros — permitirían detectar y triangular terminales activos a varios kilómetros sin requerir acceso al sistema de comunicaciones del objetivo. El vector no se resuelve con randomización de BSSID.',
              'Implicación operacional: el terminal emite mientras transmite. Si la transmisión es continua o prolongada, la presencia es detectable por cualquier actor con el hardware disponible comercialmente.',
              'Mitigación: ventanas de transmisión cortas (2-5 min). Silencio RF de al menos 60 min entre ventanas. No transmitir en movimiento. Apagar terminal fuera de ventana.',
              'Implicancias estratégicas: regulatoria — vacío normativo, ningún Estado regula la detección pasiva de terminales LEO. Formativa — ventanas cortas y silencio RF como práctica estándar del corresponsal, no opcional. Operacional — revisión de doctrina de campo cada 12 meses mientras el costo del hardware detector siga bajando.'
            ]
          },
          {
            codigo: 'T-SPY',
            titulo: 'Spyware comercial sin interacción',
            parrafos: [
              'Herramientas tipo Pegasus y derivados permiten compromiso de dispositivos móviles sin acción del usuario (zero-click). El ecosistema de inteligencia post-transición venezolana combina herramientas heredadas del chavismo con proveedores externos no identificados.',
              'Implicación operacional: ataques documentados contra periodistas en la región desde 2022. La higiene de uso (no abrir links, no aceptar mensajes) no alcanza.',
              'Mitigación: dispositivo secundario con GrapheneOS. Signal como única aplicación de llamadas. Separación física entre dispositivo de trabajo y dispositivo personal.',
              'Implicancias estratégicas: regulatoria — trabajo de Citizen Lab y Access Now como única vía de contención pública del mercado de spyware comercial. Formativa — dispositivo secundario GrapheneOS obligatorio para investigación sensible. Operacional — política sin excepciones de separación dispositivo-trabajo / dispositivo-personal.'
            ]
          },
          {
            codigo: 'T-SYNTH',
            titulo: 'Contenido sintético en circulación',
            parrafos: [
              'Desde 2027 el volumen de deepfakes de voceros conocidos y audios falsos atribuidos a fuentes reales supera la capacidad de verificación manual. El ecosistema de actores con capacidad de síntesis incluye grupos armados, actores estatales y particulares.',
              'Implicación operacional: material entrante vía canales abiertos (WhatsApp, redes sociales) puede ser íntegramente sintético. Firma C2PA ausente no es prueba de falsedad pero sí señal de alerta.',
              'Mitigación: verificación cruzada mínima de dos fuentes independientes. Detector de síntesis antes de publicar. Consulta al analista de guardia ante material de alto impacto.',
              'Implicancias estratégicas: regulatoria — adopción de C2PA como requisito editorial, discusión pendiente en redacciones LATAM. Formativa — verificación cruzada de dos fuentes como mínimo no negociable. Operacional — pipeline Reality Defender + IPTC Origin Verifier pre-publicación para material de zona activa.'
            ]
          },
          {
            codigo: 'T-CKP',
            titulo: 'Reconocimiento facial en puntos de control',
            parrafos: [
              'Fuerzas armadas venezolanas y colombianas despliegan sistemas de reconocimiento facial de proveedores externos en puntos de control fronterizos. Las bases de datos probablemente incorporan datos de redes sociales públicas.',
              'Implicación operacional: fixers y fuentes con presencia pública online son identificables en checkpoints. La afiliación a un medio internacional puede ser detectada por el sistema antes que por el operador humano.',
              'Mitigación: no publicar imágenes del fixer con rostro visible. Cubrir cara en desplazamientos por zona. No mencionar nombre completo del fixer en material público.',
              'Implicancias estratégicas: regulatoria — ausencia de marco internacional de protección de identidad de colaboradores locales frente a reconocimiento facial. Formativa — briefing OPSEC al fixer antes de cada despliegue, no solo al corresponsal. Operacional — no identificar fixers en material publicado; revisión editorial específica sobre esto antes de publicar.'
            ]
          },
          {
            codigo: 'T-PHYS',
            titulo: 'Amenaza física directa y presión sobre periodistas locales',
            parrafos: [
              'El vector que más periodistas mata en la región no es tecnológico. Grupos armados en Arauca y Apure ejercen presión directa sobre periodistas locales mediante amenazas por WhatsApp, seguimiento físico, y represalias contra familiares. El patrón documentado desde 2022 incluye exigencia de publicar material favorable bajo amenaza explícita.',
              'Implicación operacional: el fixer y los periodistas locales están expuestos a este vector de manera permanente, no solo durante el despliegue del corresponsal. La presencia del corresponsal internacional puede intensificar la presión sobre el fixer después de la publicación.',
              'Mitigación: no identificar al fixer en material publicado. Protocolo de check-in cada 6 horas durante despliegue. Plan de extracción documentado. Línea directa con FLIP (Colombia) y SNTP (Venezuela). Post-publicación: seguimiento de seguridad del fixer durante 30 días mínimo.',
              'Implicancias estratégicas: regulatoria — marco de protección de periodistas bajo Convención de Ginebra no alcanza a civiles que operan como fixers. Formativa — módulo específico de amenaza física en el HEFAT institucional, ineludible. Operacional — cobertura del fixer extendida 30 días post-publicación como política, no como excepción.'
            ]
          },
          {
            codigo: 'T-DOM',
            titulo: 'Vigilancia estatal doméstica (territorio argentino)',
            parrafos: [
              'Periodistas de investigación argentinos operan bajo vigilancia estatal de intensidad variable pero persistente. Casos documentados incluyen seguimiento físico, colocación de GPS en vehículos, intervención telefónica, e intentos coordinados de hackeo de cuentas (WhatsApp, X) post-publicación. La Secretaría de Inteligencia del Estado (SIDE) mantiene capacidad operativa sobre periodistas bajo marcos legales ambiguos.',
              'Implicación operacional: la vigilancia doméstica no se limita al período de despliegue. Un corresponsal que investiga temas sensibles (corrupción, inteligencia, narco transnacional) puede estar bajo observación antes, durante y después de cualquier viaje. Familiares y entorno cercano pueden ser incluidos en el perímetro de vigilancia.',
              'Mitigación: protocolo de contra-vigilancia urbana — variación de rutas, inspección periódica de vehículo, monitoreo de actividad anómala en cuentas. Red de colegas con protocolo de aviso mutuo (modelo FOPEA). Documentar incidentes ante CPJ y FOPEA. Ver OP-SEC-2028-011 para comunicación cifrada doméstica.',
              'Implicancias estratégicas: regulatoria — ambigüedad del marco de inteligencia estatal pendiente de litigio y reforma. Formativa — protocolo de contra-vigilancia doméstica obligatorio en onboarding para personal de investigación. Operacional — asumir vigilancia hasta prueba en contrario; nunca hablar de investigaciones en curso por teléfono ni en redacción con sospecha de intervención ambiental.'
            ]
          }
        ]
      },
      {
        titulo: 'Cono de silencio RF',
        parrafos: [
          'Modelo operativo para transmisiones desde zona activa. No busca invisibilidad RF — busca reducir la exposición a ventanas acotadas en el tiempo y detectables sólo retroactivamente.',
          'El patrón de referencia en organizaciones con capacidad de despliegue madura es: llegar al punto, desplegar equipamiento, transmitir en ventana breve, desarmar y abandonar el punto. Todo el ciclo en menos de 15 minutos en zona activa. El tiempo que el equipo está desplegado y emitiendo es tiempo en que la presencia es detectable. La diferencia entre un equipo entrenado y uno que no lo es se mide en minutos de exposición RF, no en calidad de imagen.',
          'Parámetros operativos. Ventana activa: máximo 5 minutos de transmisión continua. Silencio pre y post: el terminal debe permanecer apagado, no solo en reposo. No ejecutar ventana activa durante traslado. Definir coordenadas fijas antes de activar. Silencio RF de al menos 60 minutos entre ventanas consecutivas en la misma ubicación.',
          'Diagrama de ventana de transmisión: el manual impreso incluye un esquema temporal con las tres fases (silencio pre · ventana activa · silencio post). En esta versión digital queda como referencia textual; el esquema visual se reincorpora con la migración del cono SVG.'
        ]
      },
      {
        titulo: 'Apéndice: dispositivos y mitigaciones',
        texto: 'Listado curado de equipamiento con estado actual. Cualquier dispositivo fuera de esta lista requiere evaluación específica por Seguridad Digital antes de ser incorporado al kit de despliegue.',
        items: [
          'Starlink Mini (SpaceX) · firmware 2024.12+ · mitigación: randomización BSSID vigente, requiere verificación de versión pre-despliegue. Estado: aprobado condicional.',
          'GL.iNet MT3000 / MT6000 (GL Technologies) · firmware post-advisory 2024-05 · mitigación: activar randomización de MAC manualmente — Settings > Advanced > Network > Wi-Fi. Estado: aprobado con configuración.',
          'Iridium Certus 100 (Iridium) · firmware n/a · mitigación: no rastreable por WPS, verificar que el modelo comprado tenga inscripción RAMATEL vigente (responsabilidad del importador, no del usuario). Estado: aprobado.',
          'Pixel + GrapheneOS (Google hw / comunidad sw) · firmware rolling release · mitigación: dispositivo secundario estándar, Signal como app única de llamadas sensibles. Estado: aprobado.',
          'iPhone (Apple), cualquier modelo · iOS 17+ · mitigación: no recomendado como dispositivo secundario. Permitido como personal no asociado al despliegue. Estado: no recomendado.'
        ]
      },
      {
        titulo: 'Protocolo post-despliegue',
        texto: 'Completar dentro de las 72 horas del retorno. El incumplimiento dentro de este plazo activa alerta al editor de seguridad y al responsable del despliegue.',
        items: [
          'Rotar SSID del router de viaje. El dispositivo permanece inscripto como presencia del operador en la zona por hasta 14 días post-despliegue.',
          'Subir material crudo a servidor seguro y borrar del kit local. Conservar copia offline en dispositivo aislado.',
          'Cerrar check-in con fixer designado. No dejar canales abiertos sin cierre formal.',
          'Rotar contraseñas de cuentas accedidas desde el campo.',
          'Agendar sesión con Dart Center o equivalente bajo protocolo JTSN. Criterio automático: despliegue > 10 días en zona activa.',
          'Completar parte de despliegue con cadena de procedencia del material publicado. Archivado en OP-SEC-LOG.'
        ]
      },
      {
        titulo: 'Consulta al analista de guardia',
        parrafos: [
          'Herramienta complementaria al manual para casos no cubiertos explícitamente. Asistencia orientativa — no sustituye consulta a Seguridad Digital ni decisión editorial humana. Cada consulta se registra en OP-SEC-LOG con timestamp, usuario y contenido.',
          'El analista razona sobre el contenido de este manual, el glosario T-* y los protocolos asociados. Sus respuestas están limitadas por lo que el dispositivo sabe — no consulta nada externo. Útil para evaluar material entrante de fixer, decisiones de campo no documentadas, y cruce contra glosario antes de transmitir.',
          'Acceso operativo: tab HERRAMIENTAS de Bitácora, entrada "Analista de guardia" (OP-TOOL-2029-003). El widget vive como herramienta del kit, no como sección de este manual — la separación responde al principio offline-first: el analista funciona sin internet, sin servidor, sin dependencia externa.'
        ]
      },
      {
        titulo: 'Nota sobre alcance institucional y vacío ecosistémico',
        parrafos: [
          'Este manual es un documento interno de un medio. No es un estándar sectorial, no tiene fuerza normativa fuera de Infobae, y no fue validado por ningún organismo de seguridad para periodistas ni por ninguna institución de defensa.',
          'A la fecha de publicación no se registra doctrina operativa equivalente sobre localización pasiva por WPS o detección RF de terminales satelitales en ACOS Alliance, CPJ, RSF ni UNESCO. La investigación técnica que sustenta T-WPS y T-RF (Rye & Levin, IEEE S&P 2024) fue publicada hace cinco años sin traducción institucional a protocolo de campo.',
          'La pregunta que este documento no puede responder por sí solo es quién debería estandarizar el protocolo a escala. Un manual de un medio argentino no sustituye un marco compartido entre medios, organizaciones de formación HEFAT, proveedores de equipamiento, y agencias de seguridad digital. Ese marco no existe. Este documento funciona mientras tanto.',
          'Si este manual llega a manos de personal de otras organizaciones y resulta útil, puede ser reproducido y adaptado sin autorización previa. Citar como: Infobae, OP-SEC-2029-004, edición 4.2. Errores y omisiones: seg.digital@infobae.interna.'
        ]
      }
    ],
    fuentes: 'Rye & Levin, IEEE S&P 2024, arXiv:2405.14975 (WPS/Starlink). ANMaC: Ley 20.429, Decreto 395/75, Res. 83/2023, Disp. RENAR 883/11. ENACOM: Res. 955/2025 (Starlink), RAMATEL. Sam Gregory, Journalism Practice 2022 (C2PA/deepfakes). IPTC Origin Verifier: originverify.iptc.org. RSF España: rsf-es.org/seguridad-para-periodistas. Dart Center / JTSN: dartcenter.org. FOPEA: fopea.org. Citizen Lab y Access Now (T-SPY). FLIP Colombia, SNTP Venezuela. ACOS Alliance, CPJ Safety Kit. Para versiones anteriores y aviso WPS-2029-04: archivo Seguridad Digital.'
  }
};

export function findDocContenido(key) {
  return DOCUMENTOS_CONTENIDO[key] || null;
}
