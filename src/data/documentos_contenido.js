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

  anmac_enacom: {
    area: 'INFOBAE · LEGALES',
    codigo: 'OP-LEG-2028-007', version: '4.0', fecha: '2028-11-20',
    responsable: 'l. pollastri (legales) · revisado por seg. digital y operaciones',
    titulo: 'Requisitos ANMaC / ENACOM para material de despliegue',
    subtitulo: 'Guía de referencia para personal que viaja con equipamiento controlado o de telecomunicaciones',
    secciones: [
      {
        titulo: 'Equipamiento de protección balística',
        parrafos: [
          'Los chalecos antibalas, cascos balísticos y placas de blindaje están clasificados como materiales de usos especiales bajo la Ley Nacional de Armas y Explosivos 20.429 (1973). El Decreto Reglamentario 395/75, artículo 4, apartado 4, los equipara a "armas de guerra" a efectos regulatorios, incluyendo "cascos, chalecos, vestimentas y placas de blindaje a prueba de bala, cuando estén afectados a un uso específico de protección."',
          'La agencia reguladora es la ANMaC (Agencia Nacional de Materiales Controlados), que reemplazó al RENAR. La norma técnica vigente es la Resolución ANMaC 83/2023 y su Anexo, que regula fabricación, importación, exportación y certificación de chalecos y protecciones corporales.'
        ],
        bloques: [
          {
            titulo: 'Requisitos para tenencia (persona física)',
            parrafos: [
              '1. Ser Legítimo Usuario de Materiales de Usos Especiales o Legítimo Usuario de Armas de Fuego de uso civil condicional (CLU vigente ante ANMaC).',
              '2. Presentar Formularios Leyes 23.283 y 23.412.',
              '3. Copia certificada de factura de compra con marca, modelo, nivel, número de certificación Norma MA.01-A1 y número de serie.',
              '4. Tiempo estimado del trámite de tenencia: aproximadamente 30 días.',
              '5. El chaleco solo puede ser recibido por el titular presentando DNI, CLU y credencial de tenencia.'
            ]
          },
          {
            titulo: 'Egreso del país',
            parrafos: [
              'Según Disposición RENAR 883/11, Anexo II: "Podrá egresarse hasta un máximo de UN (1) chaleco antibala por año calendario."',
              'Requiere Formularios Leyes 23.283 y 23.412. La regulación no prohíbe el egreso — lo regula con cap anual y trámite previo. El mismo límite aplica al ingreso: máximo 1 chaleco por año calendario.'
            ]
          },
          {
            titulo: 'Alternativa operativa: préstamo RSF',
            parrafos: [
              'Reporteros Sin Fronteras (RSF España) presta chalecos antibalas y cascos de forma gratuita a reporteros independientes. Fianza reembolsable: 300€. Devolución: máximo 1 mes desde el retorno. Contacto: rsf-es.org/seguridad-para-periodistas.',
              'Esta alternativa evita el trámite de egreso ANMaC y es la opción práctica para despliegues urgentes.'
            ]
          }
        ]
      },
      {
        titulo: 'Equipamiento de telecomunicaciones',
        parrafos: [
          'El ENACOM (Ente Nacional de Comunicaciones) regula la homologación de equipos de telecomunicaciones en Argentina mediante el registro RAMATEL. Todo equipo que use espectro radioeléctrico y se comercialice en el país debe estar inscripto.',
          'La homologación es responsabilidad del fabricante o importador, no del usuario final. Si el equipo fue comprado en Argentina a través de un canal oficial, ya cuenta con inscripción RAMATEL vigente.'
        ],
        items: [
          'Starlink Mini · Homologado (Res. 955/2025) · 750.000 abonados en Argentina (dato ENACOM, MWC 2026). Compra local sin trámite adicional.',
          'Iridium Certus · Verificar modelo · la inscripción RAMATEL depende del importador. Verificar que el modelo específico figure en listado ENACOM antes de comprar.',
          'GL.iNet (routers de viaje) · Verificar modelo · equipos de viaje comprados en el exterior pueden no estar inscriptos en RAMATEL. Uso personal tolerable; consultar legales si el equipo se usa en operación profesional.'
        ],
        bloques: [
          {
            titulo: 'Equipos comprados en el exterior',
            parrafos: [
              'Si el equipo fue adquirido fuera de Argentina y no tiene homologación local, el régimen ENACOM prevé autorizaciones para uso experimental o temporario (RESOL-2023-1133-APN-ENACOM). Este equipo no puede ser comercializado en el país.',
              'Recomendación operativa: al viajar con equipo comprado localmente, llevar copia de factura y especificaciones como documentación de respaldo ante aduana. No es requisito legal verificado pero reduce fricciones.'
            ]
          }
        ]
      },
      {
        titulo: 'Otros ítems con posible regulación',
        texto: 'Los siguientes ítems del kit de despliegue pueden tener regulación aplicable que varía según la pieza y el destino. Consultar con legales caso por caso.',
        items: [
          'Drones: ANAC regula bajo Res. 550/2025 con tres categorías. Pilotos extranjeros pueden usar autorización de país de origen (traducida y apostillada). Doble regulación: país de origen + país de destino.',
          'Kit médico (IFAK): componentes básicos (torniquete, gasa hemostática) sin regulación específica para egreso. Medicamentos controlados (analgésicos, antibióticos restringidos) cruzan aduana como medicamentos bajo régimen ANMAT.',
          'Sprays defensivos: clasificados como materiales de usos especiales bajo la misma órbita ANMaC que los chalecos. Consultar antes de incluir en kit de viaje.',
          'Efectivo en divisas: declaración obligatoria ante AFIP/Aduana para montos superiores al tope vigente (verificar al momento del viaje — el tope cambia). Rendición de viáticos en moneda extranjera según régimen AFIP aplicable.'
        ]
      }
    ],
    fuentes: 'Ley 20.429 (1973). Decreto 395/75. Resolución ANMaC 83/2023. Disposición RENAR 883/11. Resolución ENACOM 955/2025. Resolución ANAC 550/2025. RESOL-2023-1133-APN-ENACOM. RSF España, programa de préstamo de equipamiento. Última verificación de vigencia: 2029-03.'
  },

  fopea_protocolo: {
    area: 'DOCUMENTO EXTERNO · REFERENCIA',
    codigo: 'EXT-FOPEA-2028', version: 'ext.', fecha: '2028',
    responsable: 'FOPEA (Foro de Periodismo Argentino)',
    titulo: 'Protocolo de aviso mutuo entre colegas',
    subtitulo: 'Referencia externa — no es documento Infobae',
    secciones: [
      { titulo: 'Origen', texto: 'FOPEA (fopea.org) es el foro argentino de periodismo que nuclea a periodistas de investigación. Su protocolo de aviso mutuo establece que ante amenaza, hackeo o seguimiento documentado, el periodista afectado avisa a su red de colegas para activar visibilidad pública y protección colectiva. No es un protocolo formal escrito sino una práctica documentada desde el caso "Anaconda" (2016-2020).' },
      { titulo: 'Cómo funciona', texto: 'El periodista amenazado contacta a entre 3 y 5 colegas de confianza de medios distintos. Les informa la situación sin revelar fuentes ni material en curso. Los colegas publican o mencionan públicamente que el periodista está bajo presión, generando costo político para el agresor. En paralelo, se notifica a CPJ y RSF para registro institucional.' },
      { titulo: 'Integración con Infobae', texto: 'El personal de Infobae con despliegue activo o investigación sensible debe mantener al menos 3 contactos FOPEA actualizados. La activación del protocolo FOPEA se comunica al editor de turno pero no requiere autorización previa. La protección de la persona prevalece sobre la coordinación editorial.' }
    ],
    fuentes: 'FOPEA (fopea.org). Referencia práctica, no normativa. Hugo Alconada Mon, descripción pública del modelo de red de seguridad entre colegas (GIJN, 2024).'
  },

  opsec_log: {
    area: 'INFOBAE · HERRAMIENTAS',
    codigo: 'OP-TOOL-2029-002', version: '1.0', fecha: '2029-03-01',
    responsable: 'j. fiorella + d. roca',
    titulo: 'OP-SEC-LOG: bitácora auditable',
    subtitulo: 'Sistema de registro de decisiones editoriales con cadena de procedencia',
    secciones: [
      { titulo: 'Qué se registra', texto: 'Cada decisión editorial sobre material de zona activa queda registrada con: timestamp, identificador del material, fixer de origen, resultado de verificación (automática y humana), decisión editorial (publicar / condiciones / reserva / no publicar), responsable de la decisión, y módulo de consulta usado si aplica.' },
      { titulo: 'Por qué', texto: 'La bitácora permite reconstruir la cadena completa de procedencia de cualquier publicación: desde quién capturó el material hasta quién decidió publicarlo y con qué nivel de verificación. En caso de cuestionamiento post-publicación, la bitácora es la evidencia de due diligence editorial.' },
      { titulo: 'Acceso', texto: 'Lectura: editor de turno, seguridad digital, legales, dirección editorial. Escritura: corresponsal que registra la decisión. Modificación post-registro: no permitida. Las entradas son append-only. Retención: 5 años desde la fecha de registro.' }
    ],
    fuentes: 'Documento interno.'
  },

  pipeline_verificacion: {
    area: 'INFOBAE · HERRAMIENTAS',
    codigo: 'OP-TOOL-2029-001', version: '1.0', fecha: '2029-03-01',
    responsable: 'd. roca (verificación)',
    titulo: 'Pipeline de verificación',
    subtitulo: 'Flujo de trabajo para material entrante de zona activa',
    secciones: [
      { titulo: 'Flujo estándar', texto: 'Material entrante → registro en cola (timestamp, fixer, tipo, tamaño) → verificación de origen (¿quién envió, desde dónde?) → verificación de contenido (geolocalización, análisis visual, detector de síntesis) → evaluación de riesgo (impacto sobre fuentes) → decisión editorial (publicar / condiciones / reserva / no publicar) → registro en OP-SEC-LOG con cadena completa.' },
      { titulo: 'Herramientas integradas', texto: 'Detector de síntesis (Reality Defender API, activo desde 05.2029). Verificador C2PA (IPTC Origin Verifier). Analista de guardia (módulo de consulta operacional, sección 07 de OP-SEC-2029-004). Imágenes satelitales: Sentinel Hub, Planet Labs (sujeto a disponibilidad regional). Geolocalización: Google Earth Pro, QGIS.' },
      { titulo: 'Tiempos', texto: 'Material urgente (breaking): verificación mínima en < 30 minutos. Material estándar: verificación completa en < 4 horas. Material de investigación: sin límite temporal, verificación exhaustiva. El nivel de verificación se define al ingreso y se registra en el log.' }
    ],
    fuentes: 'Documento interno. Referencia: Bellingcat Online Investigation Toolkit, BBC Verify workflow, First Draft Verification Handbook.'
  },

  inteligencia_investigacion: {
    area: 'INFOBAE · INVESTIGACIÓN',
    codigo: 'OP-INV-2029-007', version: '1.0', fecha: '2029-03-10',
    responsable: 'dirección editorial + l. pollastri + j. fiorella',
    titulo: 'Investigación sobre servicios de inteligencia y zonas grises del Estado',
    subtitulo: 'Criterios editoriales, protocolo legal y OPSEC para cobertura del aparato de inteligencia argentino',
    secciones: [
      { titulo: 'Qué abarca', texto: 'Investigaciones que tengan como objeto operaciones, presupuestos reservados, escuchas con orden judicial ambigua, legajos abiertos sobre periodistas y políticos, y articulaciones entre servicios estatales y actores privados. Incluye tanto la SIDE como organismos provinciales y fuerzas federales que cumplen funciones de inteligencia de facto.' },
      { titulo: 'Lectura del caso Anaconda (2016-2020, real)', texto: 'El caso Anaconda — legajo SIDE abierto sobre Hugo Alconada Mon entre 2016 y 2020 — es el antecedente doméstico más documentado de vigilancia estatal sobre un periodista de investigación en Argentina en el siglo XXI. La existencia del legajo se confirmó judicialmente. El caso define el piso de riesgo: cualquier investigación sobre el aparato de inteligencia asume que es posible replicarse. Criterio operativo: si Alconada Mon fue vigilado durante cuatro años por el servicio de inteligencia argentino, el supuesto por defecto es que un periodista actual investigando material análogo también puede estarlo.' },
      { titulo: 'Custodia legal del material', texto: 'Material obtenido de expedientes o filtraciones relativas a servicios de inteligencia se custodia fuera de infraestructura Infobae. Estudio jurídico externo con secreto profesional (convenio Pollastri & Asoc.). Lectura solo en sala sin conectividad. No se digitaliza material original hasta decisión editorial final. Copia forense bajo custodia legal separada de la copia de trabajo.' },
      { titulo: 'Contra-vigilancia elevada', texto: 'Además de las medidas de OP-INV-2028-004: dispositivo aire (Pixel con GrapheneOS sin cuenta) para contactos con fuentes del expediente, exclusivo para esa investigación. No se conecta nunca a red corporativa. Rotación de clave cada 14 días. Si hay sospecha de compromiso, destrucción física del dispositivo y emisión de nuevo.' },
      { titulo: 'Criterio editorial de publicación', texto: 'La publicación requiere: doble fuente con acceso directo al material; verificación cruzada con otra investigación independiente si es posible; revisión legal completa con cálculo de exposición a denuncia penal por violación del secreto; y plan de respuesta ante eventual amparo o intento de censura previa. Publicación coordinada con socio internacional (ICIJ, OCCRP) como medida de protección cuando el material lo permita.' }
    ],
    fuentes: 'Hugo Alconada Mon, descripción pública del caso Anaconda (GIJN 2024, CPJ 2023). Citizen Lab, reportes sobre Pegasus y otras herramientas comerciales en América Latina. CELE - Universidad de Palermo, publicaciones sobre inteligencia y libertad de expresión. Ley 25.520 de Inteligencia Nacional (texto ordenado).'
  },

  narco_cobertura: {
    area: 'INFOBAE · INVESTIGACIÓN',
    codigo: 'OP-INV-2029-005', version: '1.0', fecha: '2029-02-18',
    responsable: 'dirección editorial + l. pollastri',
    titulo: 'Cobertura de narcotráfico y crimen organizado doméstico',
    subtitulo: 'Protocolo editorial y operativo para investigaciones sobre estructuras criminales en territorio argentino',
    secciones: [
      { titulo: 'Alcance', texto: 'Este protocolo aplica a toda investigación sobre estructuras de narcotráfico y crimen organizado con operación doméstica — foco principal Rosario post-detención del clan Cantero (dic 2025), rutas Paraguay-Argentina, lavado inmobiliario, y nexo narcotráfico-fuerzas de seguridad locales. Rosario concentra el riesgo operativo más alto de la profesión en Argentina post-2020 según InSight Crime y FOPEA.' },
      { titulo: 'Coordinación judicial y fiscal', texto: 'La mayoría del material útil proviene de expedientes federales en curso. La cobertura requiere coordinación con mesa judicial y defensa legal temprana de fuentes. No publicar nombres de testigos protegidos. Verificar con Pollastri antes de publicar cualquier identidad de funcionario judicial o policial local. Anticipar citaciones por la justicia en busca de fuentes: la respuesta estándar es secreto de fuentes bajo art. 43 CN.' },
      { titulo: 'Protección del periodista local', texto: 'El periodista local es el vector de riesgo más alto. Un corresponsal desde Buenos Aires puede volver a base tras el trabajo de campo — el colega rosarino no. Toda cobertura debe considerar: no identificar al colega en redes internas, coordinar publicación con pares de la ciudad vía FOPEA, activar protocolo de aviso mutuo ante amenaza directa. No exponer al colega por un detalle que puede omitirse.' },
      { titulo: 'Amenazas operativas frecuentes', texto: 'Amenazas por WhatsApp de números descartables. Seguimiento físico de baja sofisticación (motos, vehículos sin patente visible). Intentos de intimidación a familiares. Ocasionalmente: aviso de "esta nota la pagás" en redacción o domicilio. Todas deben ser documentadas ante FOPEA y CPJ dentro de las 48h. Registrar foto, hora, lugar, descripción del contactante.' },
      { titulo: 'Diferencia con cobertura internacional', texto: 'A diferencia de un despliegue internacional, la cobertura narco doméstica es continua — no hay ventana de entrada y salida. El riesgo persiste después de publicar y puede extenderse meses o años. La sesión JTSN post-publicación es recomendable aunque no obligatoria para investigaciones de más de 6 meses de trabajo continuo.' }
    ],
    fuentes: 'InSight Crime, Los Monos: reconfiguración post-2025. Plan Bandera PFA dic 2025 (real). De los Santos & Lascano, "Los Monos" (premio FOPEA). FOPEA, protocolo de aviso mutuo. CPJ Argentina country reports. Fiscalía Federal Rosario, expedientes públicos.'
  },

  contravigilancia: {
    area: 'INFOBAE · INVESTIGACIÓN',
    codigo: 'OP-INV-2028-004', version: '3.0', fecha: '2029-01-20',
    responsable: 'j. fiorella + dirección editorial',
    titulo: 'Contra-vigilancia doméstica para periodistas de investigación',
    subtitulo: 'Protocolo operativo para personal bajo observación estatal o privada en territorio argentino',
    secciones: [
      { titulo: 'Supuesto operativo', texto: 'Todo periodista de investigación de Infobae que trabaje temas de corrupción, inteligencia, narcotráfico transnacional o crimen organizado debe asumir que está bajo algún grado de vigilancia. Los casos documentados en Argentina incluyen: seguimiento físico, colocación de GPS en vehículos, intervención telefónica con orden judicial ambigua, intentos coordinados de hackeo de cuentas (WhatsApp, X, email), y apertura de legajos de inteligencia (caso "Anaconda", 2016-2020).' },
      { titulo: 'Medidas permanentes', texto: 'Variación de rutas habituales (domicilio–redacción). Inspección periódica del vehículo (bajo chasis, ruedas, parachoques) con detección de GPS. No hablar de investigaciones en curso por teléfono ni en la redacción si hay sospecha de intervención ambiental. Signal como canal exclusivo para comunicación sensible. Reuniones con fuentes en lugares sin cámaras de seguridad identificables. No llevar dispositivo personal a reuniones con fuentes de inteligencia.' },
      { titulo: 'Red de protección', texto: 'Mantener al menos 3 contactos FOPEA actualizados para activación de protocolo de aviso mutuo (ver EXT-FOPEA-2028). Documentar todo incidente (seguimiento, hackeo, amenaza) ante FOPEA y CPJ. Si la amenaza incluye agresión física o vigilancia sostenida: comunicar al director editorial y activar cobertura legal inmediata. Considerar publicación coordinada con otro medio como medida de protección (la visibilidad protege).' },
      { titulo: 'Investigaciones sobre inteligencia', texto: 'Cuando el objeto de investigación es la propia SIDE o sus derivados, el nivel de precaución se eleva. No almacenar material en ningún dispositivo conectado a red. Copias físicas en lugar seguro fuera de la redacción y del domicilio. Considerar uso de intermediario legal (abogado con secreto profesional) para custodia de material crítico. No subestimar capacidad técnica del adversario — la SIDE tiene acceso a herramientas de vigilancia comercial de grado militar.' }
    ],
    fuentes: 'FOPEA, informes de amenazas a periodistas 2020-2029. CPJ, Argentina country reports. Hugo Alconada Mon, descripción pública de vigilancia (GIJN, 2024). Citizen Lab, reportes sobre uso de Pegasus en América Latina.'
  },

  redes_internacionales: {
    area: 'INFOBAE · INVESTIGACIÓN',
    codigo: 'OP-INV-2029-003', version: '1.0', fecha: '2029-03-10',
    responsable: 'dirección editorial',
    titulo: 'Colaboración con redes internacionales de investigación',
    subtitulo: 'ICIJ, OCCRP, GIJN y protocolos de trabajo colaborativo transfronterizo',
    secciones: [
      { titulo: 'Redes activas', texto: 'ICIJ (International Consortium of Investigative Journalists): red global con más de 280 periodistas en 100+ países. Infobae participa como medio asociado. Proyectos anteriores: Panama Papers, Pandora Papers, FinCEN Files. Comunicación exclusivamente por plataforma cifrada de ICIJ. OCCRP (Organized Crime and Corruption Reporting Project): foco en Europa del Este, Asia Central y América Latina. Herramientas compartidas: Aleph (repositorio de documentos), bases de datos de empresas offshore. GIJN (Global Investigative Journalism Network): red de recursos, capacitación y metodología. Conferencia anual. Directorio de herramientas.' },
      { titulo: 'Protocolo de colaboración', texto: 'Toda colaboración transfronteriza se comunica al director editorial antes de compartir material. El material compartido con redes externas se clasifica bajo acuerdo de embargo hasta publicación coordinada. No se comparte material con periodistas fuera de la red sin autorización. Las fuentes locales de Infobae no se revelan a periodistas de otros medios dentro de la red salvo acuerdo explícito.' },
      { titulo: 'Seguridad en colaboraciones', texto: 'Las comunicaciones con redes externas usan exclusivamente los canales cifrados provistos por cada red (ICIJ usa plataforma propia, OCCRP usa Signal). No se usan emails corporativos para compartir material sensible de colaboración. Los dispositivos usados para acceder a plataformas de redes externas son los mismos dispositivos secundarios de despliegue (GrapheneOS).' }
    ],
    fuentes: 'ICIJ, membership guidelines (icij.org). OCCRP, Aleph documentation. GIJN, Investigative Journalism Manual. Referencia interna: participación de Infobae en proyectos ICIJ 2024-2029.'
  },

  osint_investigacion: {
    area: 'INFOBAE · INVESTIGACIÓN',
    codigo: 'OP-INV-2029-002', version: '1.0', fecha: '2029-02-01',
    responsable: 'd. roca (verificación) + j. fiorella',
    titulo: 'Metodología OSINT para investigaciones',
    subtitulo: 'Fuentes abiertas, herramientas, límites éticos y documentación del proceso',
    secciones: [
      { titulo: 'Principio general', texto: 'OSINT (Open Source Intelligence) usa información públicamente accesible: registros oficiales, redes sociales, imágenes satelitales, bases de datos abiertas, registros corporativos y judiciales. No es hacking. No implica acceso no autorizado a sistemas. Si requiere una contraseña, no es OSINT.' },
      { titulo: 'Herramientas estándar', texto: 'Geolocalización: Google Earth Pro, Sentinel Hub, Mapillary. Verificación de imagen/video: TinEye, búsqueda inversa Google/Yandex, InVID/WeVerify. Registros corporativos: boletines oficiales, AFIP (Argentina), Registro Público de Comercio, OpenCorporates. Redes sociales: CrowdTangle (Meta), Wayback Machine, captura con Hunchly o ArchiveBox. Vuelos: FlightRadar24, ADS-B Exchange. Embarcaciones: MarineTraffic, VesselFinder.' },
      { titulo: 'Documentación del proceso', texto: 'Toda investigación OSINT se documenta paso a paso: qué se buscó, cuándo, en qué plataforma, qué se encontró, y capturas de pantalla con timestamp. Esta documentación se archiva en OP-SEC-LOG y sirve como evidencia del proceso en caso de cuestionamiento legal o editorial.' },
      { titulo: 'Límites éticos', texto: 'No se crean perfiles falsos para obtener información de fuentes sin su conocimiento (catfishing). No se accede a información que la fuente retiró del dominio público. No se publican datos personales de civiles no involucrados. Doxing está prohibido. Ante duda sobre el límite ético de una técnica, consultar con editor en jefe.' }
    ],
    fuentes: 'Bellingcat, Online Investigation Toolkit (2024). First Draft, Verification Handbook. Berkeley Protocol on Digital Open Source Investigations (ONU/ACNUDH, 2022). Henk van Ess, OSINT training methodology.'
  },

  docs_filtrados: {
    area: 'INFOBAE · INVESTIGACIÓN',
    codigo: 'OP-INV-2028-001', version: '2.0', fecha: '2028-07-15',
    responsable: 'dirección editorial + legales',
    titulo: 'Protocolo de documentos filtrados',
    subtitulo: 'Recepción, custodia, verificación y protección legal de material filtrado',
    secciones: [
      { titulo: 'Recepción segura', texto: 'Todo material filtrado se recibe exclusivamente por canales cifrados (SecureDrop, Signal, entrega física). No se recibe material por email corporativo, WhatsApp ni redes sociales. El periodista receptor no copia el material a dispositivos personales. Se registra fecha, hora y canal de recepción sin identificar a la fuente.' },
      { titulo: 'Cadena de custodia', texto: 'El material se almacena en dispositivo aislado (air-gapped) asignado por seguridad digital. No se conecta a red. Las copias de trabajo se hacen en dispositivo secundario dedicado. Cada copia se registra con hash SHA-256 para verificar integridad. El original permanece intacto.' },
      { titulo: 'Verificación de autenticidad', texto: 'Antes de publicar: verificar metadatos del documento (fecha de creación, autor, historial de modificaciones). Contrastar contenido con fuentes independientes. Evaluar posibilidad de material fabricado o alterado (documentos plantados como operación de inteligencia). Consultar al analista de guardia para evaluación de riesgo.' },
      { titulo: 'Protección legal', texto: 'Argentina: la jurisprudencia del caso Campillay (CSJN, 1986) establece estándares de protección para periodistas que publican información de terceros. No exime de verificación. Ante requerimiento judicial: se activa protocolo con legales (l. pollastri). La identidad de la fuente se protege bajo doctrina de secreto profesional. Consultar OP-RED-2028-003 (fuentes anónimas) para procedimiento de otorgamiento de anonimato.' }
    ],
    fuentes: 'CSJN, "Campillay c/ La Razón", 1986. Freedom of the Press Foundation, SecureDrop documentation. ICIJ, protocolo de recepción de material (referencia pública). CPJ, "Journalist Security Guide", capítulo sobre documentos sensibles.'
  },

  onboarding: {
    area: 'INFOBAE · RECURSOS HUMANOS',
    codigo: 'OP-HR-2029-002', version: '1.0', fecha: '2029-03-15',
    responsable: 's. peralta (formación) + rrhh',
    titulo: 'Onboarding de personal',
    subtitulo: 'Checklist de incorporación para corresponsales, freelancers y personal de soporte',
    secciones: [
      { titulo: 'Pre-ingreso · documentación', items: [
        '☐ Firma de contrato y convenio de confidencialidad (legales · l. pollastri).',
        '☐ Verificación de identidad y acreditación profesional vigente.',
        '☐ Alta en directorio interno (rrhh).',
        '☐ Asignación de usuario y acceso a sistemas (it@infobae.interna).',
        '☐ Registro de contactos de emergencia y persona designada (formulario RRHH).'
      ] },
      { titulo: 'Primera semana · inducción', items: [
        '☐ Sesión de orientación con s. peralta: estructura editorial, mesas, flujos de trabajo.',
        '☐ Lectura obligatoria: OP-RED-2027-001 (Manual de estilo) y OP-RED-2028-003 (Fuentes anónimas).',
        '☐ Lectura obligatoria: OP-SEC-2029-004 (Higiene RF) — sin excepciones para personal con potencial despliegue.',
        '☐ Onboarding de seguridad digital con j. fiorella: Signal, GrapheneOS, gestor de contraseñas, 2FA.',
        '☐ Alta en canal Signal interno y verificación de safety numbers.'
      ] },
      { titulo: 'Primer mes · operaciones', items: [
        '☐ HEFAT: inscripción al próximo taller institucional (RISC Training). Certificación obligatoria para personal con despliegue proyectado.',
        '☐ Sesión de familiarización con Pipeline de verificación (d. roca).',
        '☐ Revisión del protocolo FOPEA (EXT-FOPEA-2028) y establecimiento de 3 contactos de aviso mutuo.',
        '☐ Lectura de OP-INV-2028-004 (Contra-vigilancia doméstica) para personal asignado a investigación.',
        '☐ Revisión de seguros (OP-LEG-2028-014) y confirmación de cobertura según rol.'
      ] },
      { titulo: 'Continuo · renovaciones', items: [
        '☐ HEFAT: renovación cada 3 años o tras incidente operativo relevante.',
        '☐ Actualización anual de contactos de emergencia.',
        '☐ Revisión trimestral de manuales operativos con cambios post-ed.',
        '☐ Sesión JTSN post-despliegue en zona activa (automática, no opt-in).'
      ] }
    ],
    fuentes: 'Diseño del programa: s. peralta y rrhh. Coordinación operativa con seg. digital (j. fiorella) y formación externa (RISC Training, Dart Center, FOPEA).'
  },

  contactos_emergencia: {
    area: 'INFOBAE · RECURSOS HUMANOS',
    codigo: 'OP-HR-2029-001', version: '1.0', fecha: '2029-01-10',
    responsable: 'm. villafañe (operaciones)',
    titulo: 'Contactos de emergencia por región',
    subtitulo: 'Líneas directas para personal en campo — actualización trimestral',
    secciones: [
      { titulo: 'Infobae — contactos internos', items: [
        'Operaciones de campo: m. villafañe · operaciones@infobae.interna',
        'Seguridad digital (24h): seg.digital@infobae.interna',
        'Legales: l. pollastri · legales@infobae.interna',
        'Editor guardia (turno noche): f. zelaya · Madrid'
      ] },
      { titulo: 'Organizaciones externas — LATAM', items: [
        'FLIP Colombia (Fundación para la Libertad de Prensa): flip.org.co',
        'SNTP Venezuela (Sindicato Nal. Trabajadores de la Prensa): sntp.org.ve',
        'FOPEA Argentina: fopea.org',
        'CPJ Emergencias: cpj.org/campaigns/assistance',
        'RSF (Reporteros Sin Fronteras): rsf.org/es'
      ] },
      { titulo: 'Organizaciones externas — Internacional', items: [
        'Access Now Digital Security Helpline: accessnow.org/help (respuesta 24-72h)',
        'Dart Center / JTSN: dartcenter.org',
        'IWMF (Int. Women\'s Media Foundation): iwmf.org',
        'Rory Peck Trust (freelancers): rorypecktrust.org'
      ] }
    ],
    fuentes: 'Verificación de vigencia: enero 2029. Próxima actualización: abril 2029. Reportar cambios a operaciones@infobae.interna.'
  },

  politica_despliegue: {
    area: 'INFOBAE · RECURSOS HUMANOS',
    codigo: 'OP-HR-2028-003', version: '1.5', fecha: '2028-04-20',
    responsable: 'rrhh + dirección editorial',
    titulo: 'Política de despliegue y tiempos de descanso',
    subtitulo: 'Duración máxima, rotación y descanso obligatorio',
    secciones: [
      { titulo: 'Duración máxima', texto: 'Despliegue en zona activa: máximo 21 días consecutivos. Extensión excepcional: hasta 30 días con autorización del director editorial y confirmación de cobertura de seguro vigente. No se autorizan extensiones más allá de 30 días bajo ninguna circunstancia.' },
      { titulo: 'Descanso obligatorio', texto: 'Después de cada despliegue en zona activa: mínimo 14 días sin despliegue antes de la siguiente salida. Este período incluye el cumplimiento del checklist post-despliegue (OP-SEC-2029-004, sección 06) y la sesión JTSN si el criterio de activación se cumple. El descanso no es negociable por urgencia editorial.' },
      { titulo: 'Notificación familiar', texto: 'Antes de cada despliegue, el periodista informa a su contacto de emergencia designado: fechas, destino general (no ubicación exacta), y frecuencia esperada de comunicación. El contacto de emergencia tiene línea directa con operaciones de campo (m. villafañe).' }
    ],
    fuentes: 'Documento interno. Referencia: ACOS Alliance, CPJ Safety Guidelines, BBC High Risk Team protocols.'
  },

  jtsn_apoyo: {
    area: 'INFOBAE · RECURSOS HUMANOS',
    codigo: 'OP-HR-2027-012', version: '2.2', fecha: '2028-06-15',
    responsable: 'rrhh + operaciones',
    titulo: 'Apoyo psicológico para personal de campo (JTSN)',
    subtitulo: 'Protocolo de activación y recursos disponibles',
    secciones: [
      { titulo: 'Qué es JTSN', texto: 'El Journalist Trauma Support Network (JTSN) es una red de apoyo lanzada en 2022 por el Dart Center for Journalism and Trauma (Columbia University) en alianza con IWMF. Ofrece sesiones de apoyo psicológico gratuitas y confidenciales para periodistas expuestos a eventos traumáticos. Infobae tiene acceso institucional.' },
      { titulo: 'Criterio de activación', texto: 'El protocolo se activa automáticamente cuando: despliegue en zona activa > 10 días, exposición directa a violencia (presenciada o documentada), amenaza directa contra el periodista o su entorno, o solicitud voluntaria del periodista en cualquier momento. La activación no es opcional en los tres primeros casos — el editor de turno agenda la sesión.' },
      { titulo: 'Confidencialidad', texto: 'El contenido de las sesiones es confidencial entre el profesional y el periodista. Ni el editor ni RRHH ni legales reciben información sobre el contenido. Lo único que se registra es: fecha de la sesión, nombre del profesional, y confirmación de asistencia. La no asistencia se reporta al editor como incumplimiento de protocolo, no como dato de salud.' }
    ],
    fuentes: 'Dart Center for Journalism and Trauma (dartcenter.org). IWMF, Journalist Trauma Support Network. Bruce Shapiro, director Dart Center.'
  },

  seguros_riesgo: {
    area: 'INFOBAE · LEGALES',
    codigo: 'OP-LEG-2028-014', version: '2.0', fecha: '2028-08-30',
    responsable: 'l. pollastri + operaciones',
    titulo: 'Seguros de alto riesgo: guía de contratación',
    subtitulo: 'Cobertura para personal desplegado en zona activa',
    secciones: [
      { titulo: 'Qué cubre la ART argentina', texto: 'La Aseguradora de Riesgos del Trabajo (ART) cubre accidentes y enfermedades laborales en territorio argentino bajo condiciones normales de trabajo. No cubre despliegue en zona de conflicto internacional ni actividades clasificadas como de riesgo bélico. El personal de Infobae desplegado en zona activa NO está cubierto por la ART doméstica durante el despliegue.' },
      { titulo: 'Cobertura complementaria', texto: 'Infobae contrata póliza de alto riesgo específica para cada despliegue internacional. La póliza cubre: accidente, enfermedad, evacuación médica, repatriación, y asistencia legal en destino. El corresponsal debe confirmar cobertura activa antes de salir (ver checklist pre-despliegue, OP-SEC-2029-004). Fixers bajo contrato: cobertura extendida al fixer designado durante el período de despliegue.' },
      { titulo: 'Freelancers', texto: 'Periodistas freelance que operan bajo encargo de Infobae reciben cobertura equivalente durante el despliegue (estándar ACOS Alliance). Si no hay contrato de encargo, el freelance es responsable de su propia cobertura. RSF ofrece microseguros para freelancers en zona de conflicto — consultar rsf-es.org.' }
    ],
    fuentes: 'Ley 24.557 (ART). ACOS Alliance Freelance Journalist Safety Principles. RSF, programa de seguros para periodistas.'
  },

  exportacion_equip: {
    area: 'INFOBAE · LEGALES',
    codigo: 'OP-LEG-2029-002', version: '1.1', fecha: '2029-01-20',
    responsable: 'l. pollastri',
    titulo: 'Régimen de exportación de equipamiento de protección',
    subtitulo: 'Procedimiento para egreso de material controlado del territorio argentino',
    secciones: [
      { titulo: 'Alcance', texto: 'Este documento complementa OP-LEG-2028-007 con detalle procedimental para el egreso de materiales de usos especiales clasificados bajo Ley 20.429. Aplica a chalecos antibalas, cascos balísticos y placas de blindaje. No aplica a equipos de telecomunicaciones (ver sección ENACOM de OP-LEG-2028-007).' },
      { titulo: 'Procedimiento de egreso', texto: 'Según Disposición RENAR 883/11, Anexo II: máximo 1 chaleco por año calendario. Requiere Formularios Leyes 23.283 y 23.412, credencial de tenencia vigente, y declaración de destino. El trámite se realiza ante ANMaC. No se encontró plazo publicado para resolución del trámite de egreso. Recomendación: iniciar con al menos 45 días de anticipación.' },
      { titulo: 'Alternativa operativa', texto: 'Para despliegues urgentes donde el trámite de egreso no es viable: préstamo de chaleco y casco vía RSF España (rsf-es.org/seguridad-para-periodistas). Fianza reembolsable: 300€. Devolución: máximo 1 mes. Esta alternativa es la vía utilizada en los despliegues recientes de Infobae con ventana menor a 30 días.' }
    ],
    fuentes: 'Ley 20.429 (1973). Decreto 395/75. Disposición RENAR 883/11. RSF España, programa de préstamo de equipamiento.'
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
