import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronRight, ChevronDown, FileText, Folder, FolderOpen, Lock, Download, Printer, Share2, Home, Calendar, BookOpen, Users, Shield, Settings, Loader2 } from 'lucide-react';

// ============================================================================
// CONTENIDO DEL MANUAL — OP-SEC-2029-004
// ============================================================================

const DOC_META = {
  codigo: 'OP-SEC-2029-004',
  titulo: 'Higiene RF en despliegue internacional',
  subtitulo: 'Manual operativo para corresponsales y personal de campo',
  version: '4.2',
  edicionFecha: '2029-03-14',
  vigenteHasta: '2029-09-30',
  clasificacion: 'USO INTERNO · distribución controlada',
  responsable: 'Equipo Seguridad Digital · Infobae',
  autor: 'j. fiorella',
  revisores: ['m. villafañe (operaciones)', 'l. pollastri (legales)'],
  proximaRevision: '2029-09-15',
  idiomas: ['ES (original)', 'EN (traducción auxiliar)']
};

const CHECKLIST_PREDESPLIEGUE = [
  'Verificar firmware del router de viaje. Requerido: release 2024 o posterior con randomización BSSID vigente.',
  'Terminal satelital: si fue adquirido en Argentina, verificar que el modelo figure en RAMATEL-ENACOM (Starlink Mini: homologado desde 2025, Res. 955/2025). Llevar copia de factura de compra y especificaciones como documentación de respaldo en aduana. Si fue adquirido en el exterior y no tiene homologación argentina, consultar con legales antes de reingresar al país.',
  'Equipamiento de protección balística: clasificado como material de usos especiales (Ley 20.429, Decreto 395/75). Requiere Credencial de Legítimo Usuario (CLU) vigente ante ANMaC. Egreso limitado a 1 chaleco por año calendario (Disp. RENAR 883/11, Formularios Leyes 23.283 y 23.412). Tenencia tarda aprox. 30 días. Alternativa: préstamo gratuito RSF en destino (fianza 300€ reembolsable).',
  'Registrar itinerario tentativo en sistema de despliegues. Incluir puntos de contacto, fixer designado, protocolo de check-in.',
  'Confirmar cobertura de seguro de alto riesgo. ART doméstica no cubre zona activa.',
  'Instalar perfil GrapheneOS en dispositivo secundario. Dispositivo principal permanece en Buenos Aires.',
  'Limpiar metadatos de perfiles públicos relevantes al despliegue. Revisar archivo fotográfico accesible.',
  'Coordinar primera ventana de transmisión con redacción. Definir fallback comms.'
];

const THREAT_GLOSSARY = [
  {
    codigo: 'T-WPS',
    nombre: 'Harvesting de geolocalización por Wi-Fi',
    cuerpo: 'Sistemas de posicionamiento Wi-Fi de proveedores comerciales (principalmente Apple WPS) mantienen bases de datos globales de BSSIDs con coordenadas asociadas. Cualquier actor con acceso a esa API puede rastrear la posición histórica y actual de un router o terminal satelital con resolución aproximada de 8 metros.',
    vectorPractico: 'Terminales Starlink con firmware anterior a 2024 y routers de viaje sin randomización de MAC quedan inscriptos en la base como presencia persistente del operador.',
    mitigacion: 'Bagging (bolsa Faraday) del router durante traslados. Firmware 2024+ en terminal principal. Añadir _nomap al SSID de cualquier red operada.'
  },
  {
    codigo: 'T-RF',
    nombre: 'Detección pasiva de emisión RF',
    cuerpo: 'Sensores pasivos comerciales (tipo StarLock, demostrado en FEINDEF Madrid 2025) detectan y triangulan terminales Starlink activos a varios kilómetros sin requerir acceso al sistema de comunicaciones del objetivo. El vector no se resuelve con randomización de BSSID.',
    vectorPractico: 'El terminal emite mientras transmite. Si la transmisión es continua o prolongada, la presencia es detectable por cualquier actor con el hardware disponible comercialmente.',
    mitigacion: 'Ventanas de transmisión cortas (2-5 min). Silencio RF de al menos 60 min entre ventanas. No transmitir en movimiento. Apagar terminal fuera de ventana.'
  },
  {
    codigo: 'T-SPY',
    nombre: 'Spyware comercial sin interacción',
    cuerpo: 'Herramientas tipo Pegasus y derivados permiten compromiso de dispositivos móviles sin acción del usuario (zero-click). El ecosistema de inteligencia post-transición venezolana combina herramientas heredadas del chavismo con proveedores externos no identificados.',
    vectorPractico: 'Ataques documentados contra periodistas en la región desde 2022. La higiene de uso (no abrir links, no aceptar mensajes) no alcanza.',
    mitigacion: 'Dispositivo secundario con GrapheneOS. Signal como única aplicación de llamadas. Separación física entre dispositivo de trabajo y dispositivo personal.'
  },
  {
    codigo: 'T-SYNTH',
    nombre: 'Contenido sintético en circulación',
    cuerpo: 'Desde 2027 el volumen de deepfakes de voceros conocidos y audios falsos atribuidos a fuentes reales supera la capacidad de verificación manual. El ecosistema de actores con capacidad de síntesis incluye grupos armados, actores estatales y particulares.',
    vectorPractico: 'Material entrante vía canales abiertos (WhatsApp, redes sociales) puede ser íntegramente sintético. Firma C2PA ausente no es prueba de falsedad pero sí señal de alerta.',
    mitigacion: 'Verificación cruzada mínima: dos fuentes independientes. Detector de síntesis automatizado antes de publicar. Consulta al analista automatizado ante material de alto impacto.'
  },
  {
    codigo: 'T-CKP',
    nombre: 'Reconocimiento facial en puntos de control',
    cuerpo: 'Fuerzas armadas venezolanas y colombianas despliegan sistemas de reconocimiento facial de proveedores externos en puntos de control fronterizos. Las bases de datos probablemente incorporan datos de redes sociales públicas.',
    vectorPractico: 'Fixers y fuentes con presencia pública online son identificables en checkpoints. La afiliación a un medio internacional puede ser detectada por el sistema antes que por el operador humano.',
    mitigacion: 'No publicar imágenes del fixer con rostro visible. Cubrir cara en desplazamientos por zona. No mencionar nombre completo del fixer en material público.'
  },
  {
    codigo: 'T-PHYS',
    nombre: 'Amenaza física directa y presión sobre periodistas locales',
    cuerpo: 'El vector que más periodistas mata en la región no es tecnológico. Grupos armados en Arauca y Apure ejercen presión directa sobre periodistas locales mediante amenazas por WhatsApp, seguimiento físico, y represalias contra familiares. El patrón documentado desde 2022 incluye exigencia de publicar material favorable bajo amenaza explícita.',
    vectorPractico: 'El fixer y los periodistas locales están expuestos a este vector de manera permanente, no solo durante el despliegue del corresponsal. La presencia del corresponsal internacional puede intensificar la presión sobre el fixer después de la publicación.',
    mitigacion: 'No identificar al fixer en material publicado. Protocolo de check-in cada 6 horas durante despliegue. Plan de extracción documentado. Línea directa con FLIP (Colombia) y SNTP (Venezuela). Post-publicación: seguimiento de seguridad del fixer durante 30 días mínimo.'
  },
  {
    codigo: 'T-DOM',
    nombre: 'Vigilancia estatal doméstica (territorio argentino)',
    cuerpo: 'Periodistas de investigación argentinos operan bajo vigilancia estatal de intensidad variable pero persistente. Casos documentados incluyen seguimiento físico, colocación de GPS en vehículos, intervención telefónica, e intentos coordinados de hackeo de cuentas (WhatsApp, X) post-publicación. La Secretaría de Inteligencia del Estado (SIDE) mantiene capacidad operativa sobre periodistas bajo marcos legales ambiguos.',
    vectorPractico: 'La vigilancia doméstica no se limita al período de despliegue. Un corresponsal que investiga temas sensibles (corrupción, inteligencia, narco transnacional) puede estar bajo observación antes, durante y después de cualquier viaje. Familiares y entorno cercano pueden ser incluidos en el perímetro de vigilancia.',
    mitigacion: 'Protocolo de contra-vigilancia urbana: variación de rutas, inspección periódica de vehículo, monitoreo de actividad anómala en cuentas. Red de colegas con protocolo de aviso mutuo (modelo FOPEA). Documentar incidentes ante CPJ y FOPEA. Ver OP-SEC-2028-011 para comunicación cifrada doméstica.'
  }
];

const DEVICES_APPENDIX = [
  { modelo: 'Starlink Mini', fabricante: 'SpaceX', firmware: '2024.12+', mitigacion: 'Randomización BSSID vigente. Requiere verificación de versión pre-despliegue.', estado: 'aprobado_condicional' },
  { modelo: 'GL.iNet MT3000 / MT6000', fabricante: 'GL Technologies', firmware: 'post-advisory 2024-05', mitigacion: 'Activar randomización de MAC manualmente. Setting: Advanced > Network > Wi-Fi.', estado: 'aprobado_con_configuracion' },
  { modelo: 'Iridium Certus 100', fabricante: 'Iridium', firmware: 'n/a', mitigacion: 'No rastreable por WPS. Verificar que el modelo comprado tenga inscripción RAMATEL vigente (responsabilidad del importador, no del usuario).', estado: 'aprobado' },
  { modelo: 'Pixel + GrapheneOS', fabricante: 'Google (hw) / comunidad (sw)', firmware: 'rolling release', mitigacion: 'Dispositivo secundario estándar. Signal como app única de llamadas sensibles.', estado: 'aprobado' },
  { modelo: 'iPhone (cualquier modelo)', fabricante: 'Apple', firmware: 'iOS 17+', mitigacion: 'No recomendado como dispositivo secundario. Permitido como personal no asociado al despliegue.', estado: 'no_recomendado' }
];

const POST_DESPLIEGUE = [
  'Rotar SSID del router de viaje. El dispositivo permanece inscripto como presencia del operador en la zona por hasta 14 días post-despliegue.',
  'Subir material crudo a servidor seguro y borrar del kit local. Conservar copia offline en dispositivo aislado.',
  'Cerrar check-in con fixer designado. No dejar canales abiertos sin cierre formal.',
  'Rotar contraseñas de cuentas accedidas desde el campo.',
  'Agendar sesión con Dart Center o equivalente bajo protocolo JTSN. Criterio automático: despliegue > 10 días en zona activa.',
  'Completar parte de despliegue con cadena de procedencia del material publicado. Archivado en OP-SEC-LOG.'
];

const DOCUMENTOS_RELACIONADOS = [
  { codigo: 'OP-SEC-2029-004-FX', titulo: 'Higiene RF: versión resumida para fixer designado (ES-CO / ES-VE)', version: '1.0' },
  { codigo: 'OP-SEC-2028-011', titulo: 'Protocolo de comunicación cifrada en campo', version: '3.1' },
  { codigo: 'OP-SEC-2029-001', titulo: 'Verificación C2PA: guía de uso en redacción', version: '2.0' },
  { codigo: 'OP-SEC-2029-003', titulo: 'Procedimiento ante compromiso de dispositivo', version: '1.4' },
  { codigo: 'OP-LEG-2028-007', titulo: 'Requisitos ANMaC / ENACOM para material de despliegue', version: '4.0' },
  { codigo: 'OP-HR-2027-012', titulo: 'Apoyo psicológico para personal de campo (JTSN)', version: '2.2' },
  { codigo: 'EXT-FOPEA-2028', titulo: 'Protocolo de aviso mutuo entre colegas (referencia FOPEA)', version: 'ext.' }
];

const ACTIVIDAD_RECIENTE = [
  { fecha: '2029-04-17 08:30', usuario: 'j. fiorella', accion: 'agregó T-PHYS, T-DOM al glosario; sección 08' },
  { fecha: '2029-04-16 14:22', usuario: 's. peralta', accion: 'publicó informe HEFAT: 8 certificados, próximo sept.' },
  { fecha: '2029-04-16 10:00', usuario: 'mondini.l', accion: 'ROS-038: nuevos registros inmobiliarios cruzados con OSINT' },
  { fecha: '2029-04-15 11:05', usuario: 'r. velásquez (ext.)', accion: 'revisó versión fixer OP-SEC-2029-004-FX' },
  { fecha: '2029-04-13 09:15', usuario: 'l. pollastri', accion: 'actualizó OP-LEG-2028-014 (seguros para fixers)' },
  { fecha: '2029-04-10 09:41', usuario: 'd. roca', accion: 'configuró Reality Defender en pipeline verificación' },
  { fecha: '2029-04-08 16:30', usuario: 'm. villafañe', accion: 'cerró despliegue ARQ-042 · parte archivado' },
  { fecha: '2029-03-14 17:03', usuario: 'j. fiorella', accion: 'publicó edición 4.2 manual higiene RF' }
];

// ============================================================================
// HELPERS
// ============================================================================

function formatUTC(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
}

// ============================================================================
// MAIN
// ============================================================================

export default function IntranetInfobae() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginUser, setLoginUser] = useState('mondini.l');
  const [loginPass, setLoginPass] = useState('••••••••••');
  const [loginError, setLoginError] = useState(false);
  const [now, setNow] = useState(new Date('2029-04-17T09:14:00Z'));
  const [consultaInput, setConsultaInput] = useState('');
  const [consultaResult, setConsultaResult] = useState({ loading: false, text: null, error: null });
  const [sidebarExpanded, setSidebarExpanded] = useState({});
  const [toast, setToast] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const articleRef = React.useRef(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeView, setActiveView] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  const NOTIFICACIONES = [
    { id: 'n1', tiempo: 'hace 2h', usuario: 'j. fiorella', texto: 'Actualizó secciones T-PHYS y T-DOM en OP-SEC-2029-004. Revisión obligatoria.', leida: false },
    { id: 'n2', tiempo: 'hace 4h', usuario: 's. peralta', texto: 'Publicó resultados HEFAT abril: 8 certificados. Próxima edición septiembre.', leida: false },
    { id: 'n3', tiempo: 'ayer 14:10', usuario: 'l. pollastri', texto: 'Nueva póliza de seguro para fixers activa desde mayo. Ver OP-LEG-2028-014.', leida: true },
    { id: 'n4', tiempo: 'lun 09:22', usuario: 'r. velásquez (ext.)', texto: 'Completó revisión de OP-SEC-2029-004-FX (versión fixer)', leida: true }
  ];

  const VISTAS = {
    noticias: {
      titulo: 'Noticias internas',
      subtitulo: 'Organización, entrenamiento, herramientas y operaciones del equipo de Infobae',
      items: [
        { fecha: '2029-04-17', tag: 'OPERACIONES', titulo: 'Cierre de despliegue ARQ-042 (Arauca)', texto: 'El despliegue de 13 días en zona fronteriza fue cerrado formalmente. Parte de despliegue y material archivados en OP-SEC-LOG. Corresponsal: mondini.l. Fixer: Velásquez. Sesión JTSN agendada para el 23.04.' },
        { fecha: '2029-04-15', tag: 'SEG. DIGITAL', titulo: 'Actualización del manual de higiene RF a edición 4.2', texto: 'Se incorporaron dos nuevas categorías de amenaza (T-PHYS, T-DOM) y la sección 08 sobre vacío ecosistémico. Revisión obligatoria para personal con despliegue activo o planificado.' },
        { fecha: '2029-04-13', tag: 'FORMACIÓN', titulo: 'Resultado del primer HEFAT institucional en Buenos Aires', texto: 'El taller de 3 días con RISC Training finalizó con 8 participantes certificados. Es la primera instancia HEFAT organizada por Infobae como institución (antes dependía de formación individual de cada corresponsal). Próxima edición: septiembre 2029, abierta a freelancers bajo encargo.' },
        { fecha: '2029-04-11', tag: 'RRHH', titulo: 'Nueva política de cobertura de seguro para fixers', texto: 'A partir de mayo, todo fixer bajo contrato con Infobae tendrá cobertura de seguro durante el período de despliegue completo, no solo durante las jornadas de grabación. Alineado con los principios ACOS Alliance. Detalle en OP-LEG-2028-014 actualizado.' },
        { fecha: '2029-04-08', tag: 'HERRAMIENTAS', titulo: 'Incorporación de Reality Defender al pipeline de verificación', texto: 'A partir del 01.05, todo material audiovisual entrante de zona activa pasará por detector de síntesis automatizado antes de la decisión editorial. Entrenamiento obligatorio para mesa de verificación. Ver OP-SEC-2029-001.' },
        { fecha: '2029-04-05', tag: 'EDITORIAL', titulo: 'Revisión del protocolo de fuentes anónimas', texto: 'Se actualizó OP-RED-2028-003 con criterio más estricto: toda información de fuente anónima requiere al menos una vía de verificación independiente. El cambio responde a tres incidentes de material no verificable recibido en el último trimestre.' },
        { fecha: '2029-04-02', tag: 'RED EXTERNA', titulo: 'Activación del protocolo FOPEA tras amenaza a periodista en Rosario', texto: 'Se activó la red de aviso mutuo para un colega de otro medio bajo amenaza directa en Rosario. Personal de Infobae participó como nodo de difusión. Recordatorio: mantener actualizados los 3 contactos FOPEA (ver EXT-FOPEA-2028).' },
        { fecha: '2029-03-28', tag: 'EQUIPAMIENTO', titulo: 'Aprobación de Starlink Mini como terminal estándar de despliegue', texto: 'Tras evaluación de 6 meses, seguridad digital aprobó el Starlink Mini como terminal satelital principal para despliegues internacionales. Condición: firmware con randomización BSSID vigente. GL.iNet MT3000 se mantiene como router de viaje estándar. Detalle en OP-SEC-2029-004, apéndice de dispositivos.' }
      ]
    },
    directorio: {
      titulo: 'Directorio',
      subtitulo: 'Personal de Infobae — equipo operativo, editorial y de soporte',
      items: [
        { nombre: 'Lucía Mondini', rol: 'Corresponsal — cobertura transnacional', base: 'Buenos Aires', contacto: 'mondini.l@infobae.interna' },
        { nombre: 'Javier Fiorella', rol: 'Seguridad digital — lead', base: 'Buenos Aires', contacto: 'fiorella.j@infobae.interna' },
        { nombre: 'Marina Villafañe', rol: 'Operaciones de campo — coordinación logística y despliegues', base: 'Buenos Aires', contacto: 'villafane.m@infobae.interna' },
        { nombre: 'Lucas Pollastri', rol: 'Legales — despliegue internacional, contratos, regulación', base: 'Buenos Aires', contacto: 'pollastri.l@infobae.interna' },
        { nombre: 'Daniela Roca', rol: 'Verificación y OSINT — lead pipeline', base: 'Bogotá', contacto: 'roca.d@infobae.interna' },
        { nombre: 'Felipe Zelaya', rol: 'Editor guardia — turno noche, enlace con redacciones', base: 'Madrid', contacto: 'zelaya.f@infobae.interna' },
        { nombre: 'Sofía Peralta', rol: 'Formación y capacitación — HEFAT, seguridad digital, onboarding', base: 'Buenos Aires', contacto: 'peralta.s@infobae.interna' },
        { nombre: 'Tomás Quiroga', rol: 'Freelancer liaison — contratos, seguros, cobertura ACOS', base: 'Lima', contacto: 'quiroga.t@infobae.interna' },
        { nombre: 'R. Velásquez (ext.)', rol: 'Fixer designado — frontera COL/VEN (Arauca/Apure)', base: 'Arauca', contacto: 'vía Signal · canal seguro' }
      ]
    },
    agenda: {
      titulo: 'Agenda editorial',
      subtitulo: 'Semana del 14 al 20 de abril de 2029 — editorial, operaciones y formación',
      items: [
        { dia: 'LUN 14', entradas: ['09:00 — Reunión editorial semanal (remoto, todas las mesas)', '11:00 — Debrief HEFAT con S. Peralta: lecciones del primer taller institucional', '14:00 — Revisión pipeline verificación con D. Roca: estado Reality Defender'] },
        { dia: 'MAR 15', entradas: ['10:30 — Check-in post-despliegue ARQ-042 con Villafañe y Mondini', '14:00 — Sesión de onboarding seguridad digital para freelancers (Fiorella)', '16:00 — Llamada con fixer Velásquez: revisión OP-SEC-2029-004-FX'] },
        { dia: 'MIÉ 16', entradas: ['10:00 — Coordinación legales: nueva póliza de seguro para fixers (Pollastri)', '11:00 — Sesión Dart Center / JTSN — protocolo automático post-ARQ-042', '15:00 — Entrega material verificado Arauca a mesa de edición'] },
        { dia: 'JUE 17', entradas: ['08:00 — Cola de verificación: 5 items pendientes', '10:00 — Reunión Quiroga (Lima): estado de contratos freelance ACOS', '20:00 — Emisión en vivo: análisis transición Venezuela, frontera Arauca/Apure'] },
        { dia: 'VIE 18', entradas: ['10:00 — Revisión trimestral de manuales operativos (seg. digital + legales)', '12:00 — ROS-038: reunión con fuente judicial Rosario (Signal, protocolo contra-vigilancia activo)', '13:00 — Cierre de semana editorial', '15:00 — Evaluación de amenazas para próximo despliegue: definir teatro y equipo'] }
      ]
    },
    redaccion: {
      titulo: 'Redacción',
      subtitulo: 'Estado de mesas, coberturas activas y preparación del equipo',
      items: [
        { mesa: 'Internacional — LatAm', responsable: 'mondini.l / roca.d', coberturas: 'Frontera COL-VEN (activa), Esequibo (seguimiento), Sahel/migración (en pausa). Próximo despliegue: por definir, mín. 14 días post-ARQ-042.' },
        { mesa: 'Internacional — Europa', responsable: 'zelaya.f', coberturas: 'Post-apagón España (cierre), cobertura de agencias para Irán y Sahel. Sin despliegues activos.' },
        { mesa: 'Argentina', responsable: 'equipo BsAs + mondini.l', coberturas: 'Elecciones legislativas (pre-campaña). ROS-038: narcotráfico Rosario, estructuras sucesoras Los Monos, nexo fuerzas de seguridad (activa, protocolo contra-vigilancia + FOPEA). Litio Jujuy (en pausa).' },
        { mesa: 'Verificación', responsable: 'roca.d', coberturas: 'Pipeline C2PA (implementación), Reality Defender (testing, go-live 01.05), cola de verificación: 5 items pendientes.' },
        { mesa: 'Formación y capacitación', responsable: 'peralta.s', coberturas: 'HEFAT: 8 certificados (abr. 2029), próximo sept. 2029. Seguridad digital: actualización obligatoria post-ed. 4.2 del manual RF. Onboarding: 2 freelancers en proceso.' }
      ]
    },
    herramientas: {
      titulo: 'Herramientas',
      subtitulo: 'Sistemas de apoyo para preparación, verificación y documentación operativa',
      items: [
        { nombre: 'Analista automatizado', desc: 'Consulta al modelo de IA para evaluación de material y amenazas. Integrado en OP-SEC-2029-004, sección 07.', accion: 'analista_auto' },
        { nombre: 'Parte de despliegue', desc: 'Formulario digital para registro de salidas, kit, itinerario y fixer designado.', accion: 'parte_despliegue' },
        { nombre: 'Pipeline de verificación', desc: 'Cola de material entrante con estado de verificación y decisión editorial.', accion: 'pipeline_verificacion' },
        { nombre: 'OP-SEC-LOG', desc: 'Bitácora auditable de decisiones editoriales con cadena de procedencia.', accion: 'opsec_log' }
      ]
    },
    soporte: {
      titulo: 'Soporte',
      subtitulo: 'Infraestructura de apoyo para trabajo de campo, redacción y formación',
      items: [
        { area: 'Seguridad digital', contacto: 'seg.digital@infobae.interna', desc: 'Incidentes de seguridad, consultas sobre manuales, compromiso de dispositivos, evaluación de herramientas.' },
        { area: 'Operaciones de campo', contacto: 'operaciones@infobae.interna', desc: 'Logística de despliegue, seguros, equipamiento, partes de viaje, coordinación con fixers.' },
        { area: 'Legales', contacto: 'legales@infobae.interna', desc: 'Regulación ANMaC/ENACOM, exportación de material, contratos con fixers y freelancers, seguros.' },
        { area: 'Formación y capacitación', contacto: 'peralta.s@infobae.interna', desc: 'HEFAT, seguridad digital, onboarding de freelancers, actualizaciones de protocolos, coordinación con RISC Training y Dart Center.' },
        { area: 'Mesa de ayuda IT', contacto: 'it@infobae.interna', desc: 'Acceso a sistemas, intranet, VPN, dispositivos, GrapheneOS, configuración de equipamiento.' }
      ]
    },
    anmac_enacom: {
      titulo: 'Requisitos ANMaC / ENACOM para material de despliegue',
      subtitulo: 'OP-LEG-2028-007 · v4.0 · Legales — despliegue internacional',
      contenido: true
    },
    // ============ DOCUMENTOS GENÉRICOS ============
    manual_estilo: { doc: {
      area: 'INFOBAE · REDACCIÓN', codigo: 'OP-RED-2027-001', version: '12.3', fecha: '2029-01-15', responsable: 'dirección editorial',
      titulo: 'Manual de estilo editorial', subtitulo: 'Criterios de voz, atribución y corrección para todas las ediciones',
      secciones: [
        { titulo: 'Voz editorial', texto: 'Infobae escribe en tercera persona para noticias y en primera persona atribuida para crónica y opinión. El registro es informativo directo. No se usan adjetivos valorativos sin atribución a fuente. La línea entre descripción factual y análisis se marca explícitamente en el texto.' },
        { titulo: 'Atribución de fuentes', texto: 'Toda afirmación de hecho requiere fuente identificable o, en su defecto, al menos dos fuentes independientes con anonimato otorgado bajo protocolo OP-RED-2028-003. Las fórmulas de atribución estándar son: "según declaró a Infobae", "de acuerdo con documentos a los que accedió Infobae", "según fuentes que pidieron anonimato por temor a represalias". Nunca "fuentes cercanas al gobierno" sin especificar qué gobierno.' },
        { titulo: 'Correcciones', texto: 'Los errores factuales se corrigen inmediatamente en el texto con nota de corrección visible al pie. Los errores de contexto se actualizan con nota de actualización. Ninguna corrección se aplica sin notificación al editor de turno. El registro de correcciones se archiva en OP-RED-LOG.' }
      ], fuentes: 'Documento interno. Basado en Reuters Handbook of Journalism (referencia) y criterio editorial propio.' }},
    fuentes_anonimas: { doc: {
      area: 'INFOBAE · REDACCIÓN', codigo: 'OP-RED-2028-003', version: '3.0', fecha: '2028-09-10', responsable: 'dirección editorial + legales',
      titulo: 'Protocolo de fuentes anónimas', subtitulo: 'Criterios para otorgar anonimato y obligaciones asociadas',
      secciones: [
        { titulo: 'Cuándo se otorga anonimato', texto: 'El anonimato se otorga cuando la fuente enfrenta riesgo verificable (físico, legal, laboral) por revelar la información. No se otorga por comodidad ni por preferencia de la fuente. El periodista debe poder explicar al editor por qué el anonimato es necesario en cada caso.' },
        { titulo: 'Verificación obligatoria', texto: 'Toda información de fuente anónima requiere verificación independiente por al menos una vía adicional: documento, segunda fuente, o registro público. No se publica información que dependa exclusivamente de una fuente anónima única salvo autorización expresa del editor en jefe con justificación archivada.' },
        { titulo: 'Protección legal', texto: 'La identidad de la fuente anónima se conoce solo por el periodista y el editor responsable. No se registra en sistemas digitales compartidos. En caso de requerimiento judicial, se activa protocolo OP-LEG con representación legal. La protección de la fuente prevalece sobre la publicación.' }
      ], fuentes: 'Basado en Principios de Chatham House, Reuters Source Protection Policy, y jurisprudencia argentina (fallo "Campillay", CSJN 1986).' }},
    verificacion_prepub: { doc: {
      area: 'INFOBAE · REDACCIÓN', codigo: 'OP-RED-2029-005', version: '5.1', fecha: '2029-02-20', responsable: 'mesa de verificación (d. roca)',
      titulo: 'Guía de verificación pre-publicación', subtitulo: 'Pasos obligatorios antes de publicar material sensible o de zona activa',
      secciones: [
        { titulo: 'Cadena de verificación', texto: 'Todo material de zona activa pasa por: 1) verificación de origen (quién envió, desde dónde, cuándo), 2) verificación de contenido (geolocalización, análisis de imagen/video, cross-check con fuentes independientes), 3) evaluación de riesgo de publicación (impacto sobre fuentes, fixers, y personal en campo), 4) firma editorial (editor de turno + seguridad digital si aplica).' },
        { titulo: 'Material con cadena C2PA', texto: 'Si el material tiene firma C2PA verificable, registrar el resultado de la verificación. La presencia de C2PA no exime de verificación editorial. Importante: las coordenadas GPS embebidas en la firma son información PII-CAMPO del productor. No publicar metadatos de proveniencia sin autorización expresa de la fuente.' },
        { titulo: 'Material sin cadena C2PA', texto: 'La ausencia de C2PA no invalida el material pero requiere verificación reforzada. Ejecutar detector de síntesis automatizado. Buscar al menos dos puntos de corroboración independiente. Documentar el proceso completo en OP-SEC-LOG.' }
      ], fuentes: 'Basado en First Draft Verification Handbook, BBC Editorial Guidelines, y IPTC Origin Verifier (originverify.iptc.org).' }},
    comunicacion_cifrada: { doc: {
      area: 'INFOBAE · SEGURIDAD DIGITAL', codigo: 'OP-SEC-2028-011', version: '3.1', fecha: '2028-12-01', responsable: 'j. fiorella (seg. digital)',
      titulo: 'Protocolo de comunicación cifrada en campo', subtitulo: 'Configuración y uso de canales seguros durante despliegue',
      secciones: [
        { titulo: 'Canales autorizados', texto: 'Signal es el canal primario para comunicación sensible con fuentes, fixers y redacción. Mensajes con desaparición automática activada (7 días default, 24 horas en zona activa). WhatsApp solo para coordinación logística no sensible. Correo electrónico solo con cifrado PGP/GPG para documentos que requieren archivo.' },
        { titulo: 'Dispositivos', texto: 'Dispositivo primario (personal): no se usa para comunicación sensible durante despliegue. Dispositivo secundario (GrapheneOS en Pixel): dedicado exclusivamente a comunicación operativa. Sin redes sociales, sin email personal, sin apps no autorizadas. Separación física entre ambos dispositivos en todo momento.' },
        { titulo: 'Rotación y destrucción', texto: 'Contraseñas de cuentas accedidas desde campo se rotan dentro de las 72 horas post-retorno (ver checklist post-despliegue en OP-SEC-2029-004). Dispositivo secundario: wipe completo si hay sospecha de compromiso. Ante duda, no intentar diagnosticar — ejecutar wipe y reportar a seg. digital.' }
      ], fuentes: 'Signal Foundation, EFF Surveillance Self-Defense, Access Now Digital Security Helpline.' }},
    verificacion_c2pa: { doc: {
      area: 'INFOBAE · SEGURIDAD DIGITAL', codigo: 'OP-SEC-2029-001', version: '2.0', fecha: '2029-01-30', responsable: 'j. fiorella + d. roca',
      titulo: 'Verificación C2PA: guía de uso en redacción', subtitulo: 'Qué es C2PA, cómo verificar, y la tensión entre proveniencia y protección de la fuente',
      secciones: [
        { titulo: 'Qué es C2PA', texto: 'C2PA (Coalition for Content Provenance and Authenticity) es un estándar abierto impulsado por Adobe, Microsoft, Google, BBC y otros que permite inscribir metadatos criptográficamente firmados en archivos de imagen y video al momento de captura. Incluye: dispositivo, fecha, coordenadas GPS, y firma verificable. Canon y Nikon ya tienen cámaras con soporte nativo.' },
        { titulo: 'Cómo verificar', texto: 'Usar IPTC Origin Verifier (originverify.iptc.org) para verificar firma C2PA contra la Verified News Publishers List. El verificador muestra: validez de la firma, coincidencia del hash del manifiesto, y si el certificado corresponde a un medio registrado. Firma válida ≠ contenido verdadero — solo certifica quién capturó y cuándo.' },
        { titulo: 'Tensión proveniencia / protección', texto: 'Las coordenadas GPS embebidas en la firma C2PA son la localización exacta de quien capturó el material. En zona de conflicto, eso puede ser la ubicación del fixer. No existe aún un protocolo estándar de C2PA para contextos donde la localización del productor es información sensible. Hasta que exista: no publicar metadatos de proveniencia sin consentimiento explícito de la fuente. Registrar la verificación C2PA en OP-SEC-LOG pero redactar las coordenadas del log si la fuente lo solicita.' }
      ], fuentes: 'C2PA Specification (c2pa.org). Sam Gregory, "Deepfakes, misinformation and authenticity infrastructure responses", Journalism Practice, 2022. IPTC Origin Verifier.' }},
    compromiso_dispositivo: { doc: {
      area: 'INFOBAE · SEGURIDAD DIGITAL', codigo: 'OP-SEC-2029-003', version: '1.4', fecha: '2029-02-10', responsable: 'j. fiorella',
      titulo: 'Procedimiento ante compromiso de dispositivo', subtitulo: 'Respuesta inmediata, contención y notificación',
      secciones: [
        { titulo: 'Indicadores de compromiso', texto: 'Actividad inusual en cuentas (sesiones no reconocidas, cambios de contraseña no solicitados). Comportamiento errático del dispositivo (calentamiento, batería, actividad de datos en reposo). Mensajes de verificación no solicitados (WhatsApp, X, email). Estos indicadores no confirman compromiso pero activan el protocolo preventivo.' },
        { titulo: 'Respuesta inmediata', texto: 'No intentar diagnosticar. No buscar el spyware. No instalar apps de escaneo. Apagar el dispositivo comprometido. No lo volver a encender. Comunicar al equipo de seguridad digital desde OTRO dispositivo. No reenviar información del dispositivo comprometido por ningún canal digital.' },
        { titulo: 'Contención', texto: 'Seguridad digital ejecuta análisis forense si es posible (requiere envío físico del dispositivo). Rotar todas las contraseñas de cuentas accedidas desde el dispositivo. Notificar a fuentes que hayan tenido contacto vía el dispositivo comprometido. Si el compromiso se confirma, reportar a Access Now Digital Security Helpline y documentar ante CPJ si corresponde.' }
      ], fuentes: 'Access Now Digital Security Helpline (accessnow.org/help). Citizen Lab, metodología de detección de Pegasus. Amnesty International Mobile Verification Toolkit (MVT).' }},
    vigilancia_destino: { doc: {
      area: 'INFOBAE · SEGURIDAD DIGITAL', codigo: 'OP-SEC-2028-009', version: '2.3', fecha: '2028-10-15', responsable: 'j. fiorella + m. villafañe',
      titulo: 'Protocolo de vigilancia en destino', subtitulo: 'Awareness situacional y contra-vigilancia básica por región',
      secciones: [
        { titulo: 'Principio general', texto: 'Asumir vigilancia hasta que se demuestre lo contrario. En zona activa, la pregunta no es si hay vigilancia sino de quién. Los actores pueden ser estatales (inteligencia militar, policía), no estatales (grupos armados con capacidad OSINT), o infraestructurales (WPS, reconocimiento facial automatizado en checkpoints). Los tres pueden operar simultáneamente.' },
        { titulo: 'Frontera COL-VEN (Arauca/Apure)', texto: 'Actor dominante: ELN con capacidad de control territorial. FF.AA. venezolana con sistemas de reconocimiento facial en checkpoints (ver T-CKP en OP-SEC-2029-004). Disidencias FARC con capacidad de presión directa sobre periodistas locales (ver T-PHYS). Inteligencia colombiana activa en zona fronteriza. Starlink detectable por sensor pasivo (ver T-RF).' },
        { titulo: 'Argentina doméstica', texto: 'SIDE con capacidad documentada de seguimiento físico, colocación de GPS en vehículos, intervención telefónica, e intentos de hackeo post-publicación (ver T-DOM en OP-SEC-2029-004). Protocolo de contra-vigilancia urbana: variación de rutas, inspección periódica de vehículo, monitoreo de actividad anómala en cuentas. Red de aviso mutuo entre colegas (ver EXT-FOPEA-2028).' }
      ], fuentes: 'CPJ Safety Kit. RSF Safety Guide. FLIP Colombia, informes de seguridad 2024-2025. Casos documentados: legajo "Anaconda" (Alconada Mon, 2016-2020), intentos de hackeo post-PIN 2025.' }},
    exportacion_equip: { doc: {
      area: 'INFOBAE · LEGALES', codigo: 'OP-LEG-2029-002', version: '1.1', fecha: '2029-01-20', responsable: 'l. pollastri',
      titulo: 'Régimen de exportación de equipamiento de protección', subtitulo: 'Procedimiento para egreso de material controlado del territorio argentino',
      secciones: [
        { titulo: 'Alcance', texto: 'Este documento complementa OP-LEG-2028-007 con detalle procedimental para el egreso de materiales de usos especiales clasificados bajo Ley 20.429. Aplica a chalecos antibalas, cascos balísticos y placas de blindaje. No aplica a equipos de telecomunicaciones (ver sección ENACOM de OP-LEG-2028-007).' },
        { titulo: 'Procedimiento de egreso', texto: 'Según Disposición RENAR 883/11, Anexo II: máximo 1 chaleco por año calendario. Requiere Formularios Leyes 23.283 y 23.412, credencial de tenencia vigente, y declaración de destino. El trámite se realiza ante ANMaC. No se encontró plazo publicado para resolución del trámite de egreso. Recomendación: iniciar con al menos 45 días de anticipación.' },
        { titulo: 'Alternativa operativa', texto: 'Para despliegues urgentes donde el trámite de egreso no es viable: préstamo de chaleco y casco vía RSF España (rsf-es.org/seguridad-para-periodistas). Fianza reembolsable: 300€. Devolución: máximo 1 mes. Esta alternativa es la opción práctica estándar para la mayoría de los despliegues internacionales.' }
      ], fuentes: 'Ley 20.429 (1973). Decreto 395/75. Disposición RENAR 883/11. RSF España, programa de préstamo de equipamiento.' }},
    seguros_riesgo: { doc: {
      area: 'INFOBAE · LEGALES', codigo: 'OP-LEG-2028-014', version: '2.0', fecha: '2028-08-30', responsable: 'l. pollastri + operaciones',
      titulo: 'Seguros de alto riesgo: guía de contratación', subtitulo: 'Cobertura para personal desplegado en zona activa',
      secciones: [
        { titulo: 'Qué cubre la ART argentina', texto: 'La Aseguradora de Riesgos del Trabajo (ART) cubre accidentes y enfermedades laborales en territorio argentino bajo condiciones normales de trabajo. No cubre despliegue en zona de conflicto internacional ni actividades clasificadas como de riesgo bélico. El personal de Infobae desplegado en zona activa NO está cubierto por la ART doméstica durante el despliegue.' },
        { titulo: 'Cobertura complementaria', texto: 'Infobae contrata póliza de alto riesgo específica para cada despliegue internacional. La póliza cubre: accidente, enfermedad, evacuación médica, repatriación, y asistencia legal en destino. El corresponsal debe confirmar cobertura activa antes de salir (ver checklist pre-despliegue, OP-SEC-2029-004). Fixers bajo contrato: cobertura extendida al fixer designado durante el período de despliegue.' },
        { titulo: 'Freelancers', texto: 'Periodistas freelance que operan bajo encargo de Infobae reciben cobertura equivalente durante el despliegue (estándar ACOS Alliance). Si no hay contrato de encargo, el freelance es responsable de su propia cobertura. RSF ofrece microseguros para freelancers en zona de conflicto — consultar rsf-es.org.' }
      ], fuentes: 'Ley 24.557 (ART). ACOS Alliance Freelance Journalist Safety Principles. RSF, programa de seguros para periodistas.' }},
    jtsn_apoyo: { doc: {
      area: 'INFOBAE · RECURSOS HUMANOS', codigo: 'OP-HR-2027-012', version: '2.2', fecha: '2028-06-15', responsable: 'rrhh + operaciones',
      titulo: 'Apoyo psicológico para personal de campo (JTSN)', subtitulo: 'Protocolo de activación y recursos disponibles',
      secciones: [
        { titulo: 'Qué es JTSN', texto: 'El Journalist Trauma Support Network (JTSN) es una red de apoyo lanzada en 2022 por el Dart Center for Journalism and Trauma (Columbia University) en alianza con IWMF. Ofrece sesiones de apoyo psicológico gratuitas y confidenciales para periodistas expuestos a eventos traumáticos. Infobae tiene acceso institucional.' },
        { titulo: 'Criterio de activación', texto: 'El protocolo se activa automáticamente cuando: despliegue en zona activa > 10 días, exposición directa a violencia (presenciada o documentada), amenaza directa contra el periodista o su entorno, o solicitud voluntaria del periodista en cualquier momento. La activación no es opcional en los tres primeros casos — el editor de turno agenda la sesión.' },
        { titulo: 'Confidencialidad', texto: 'El contenido de las sesiones es confidencial entre el profesional y el periodista. Ni el editor ni RRHH ni legales reciben información sobre el contenido. Lo único que se registra es: fecha de la sesión, nombre del profesional, y confirmación de asistencia. La no asistencia se reporta al editor como incumplimiento de protocolo, no como dato de salud.' }
      ], fuentes: 'Dart Center for Journalism and Trauma (dartcenter.org). IWMF, Journalist Trauma Support Network. Bruce Shapiro, director Dart Center.' }},
    politica_despliegue: { doc: {
      area: 'INFOBAE · RECURSOS HUMANOS', codigo: 'OP-HR-2028-003', version: '1.5', fecha: '2028-04-20', responsable: 'rrhh + dirección editorial',
      titulo: 'Política de despliegue y tiempos de descanso', subtitulo: 'Duración máxima, rotación y descanso obligatorio',
      secciones: [
        { titulo: 'Duración máxima', texto: 'Despliegue en zona activa: máximo 21 días consecutivos. Extensión excepcional: hasta 30 días con autorización del director editorial y confirmación de cobertura de seguro vigente. No se autorizan extensiones más allá de 30 días bajo ninguna circunstancia.' },
        { titulo: 'Descanso obligatorio', texto: 'Después de cada despliegue en zona activa: mínimo 14 días sin despliegue antes de la siguiente salida. Este período incluye el cumplimiento del checklist post-despliegue (OP-SEC-2029-004, sección 06) y la sesión JTSN si el criterio de activación se cumple. El descanso no es negociable por urgencia editorial.' },
        { titulo: 'Notificación familiar', texto: 'Antes de cada despliegue, el periodista informa a su contacto de emergencia designado: fechas, destino general (no ubicación exacta), y frecuencia esperada de comunicación. El contacto de emergencia tiene línea directa con operaciones de campo (m. villafañe).' }
      ], fuentes: 'Documento interno. Referencia: ACOS Alliance, CPJ Safety Guidelines, BBC High Risk Team protocols.' }},
    contactos_emergencia: { doc: {
      area: 'INFOBAE · RECURSOS HUMANOS', codigo: 'OP-HR-2029-001', version: '1.0', fecha: '2029-01-10', responsable: 'm. villafañe (operaciones)',
      titulo: 'Contactos de emergencia por región', subtitulo: 'Líneas directas para personal en campo — actualización trimestral',
      secciones: [
        { titulo: 'Infobae — contactos internos', items: ['Operaciones de campo: m. villafañe · operaciones@infobae.interna', 'Seguridad digital (24h): seg.digital@infobae.interna', 'Legales: l. pollastri · legales@infobae.interna', 'Editor guardia (turno noche): f. zelaya · Madrid'] },
        { titulo: 'Organizaciones externas — LATAM', items: ['FLIP Colombia (Fundación para la Libertad de Prensa): flip.org.co', 'SNTP Venezuela (Sindicato Nal. Trabajadores de la Prensa): sntp.org.ve', 'FOPEA Argentina: fopea.org', 'CPJ Emergencias: cpj.org/campaigns/assistance', 'RSF (Reporteros Sin Fronteras): rsf.org/es'] },
        { titulo: 'Organizaciones externas — Internacional', items: ['Access Now Digital Security Helpline: accessnow.org/help (respuesta 24-72h)', 'Dart Center / JTSN: dartcenter.org', 'IWMF (Int. Women\'s Media Foundation): iwmf.org', 'Rory Peck Trust (freelancers): rorypecktrust.org'] }
      ], fuentes: 'Verificación de vigencia: enero 2029. Próxima actualización: abril 2029. Reportar cambios a operaciones@infobae.interna.' }},
    analista_auto: { tool: true,
      titulo: 'Analista automatizado',
      subtitulo: 'Consulta al modelo de IA para evaluación de material, amenazas y decisiones operativas',
      descripcion: 'Herramienta complementaria a los manuales operativos para casos no cubiertos explícitamente. Cada consulta se registra en OP-SEC-LOG con timestamp, usuario y contenido. No sustituye consulta a Seguridad Digital ni decisión editorial humana.',
      contexto: 'El modelo tiene acceso al contenido del manual OP-SEC-2029-004 (Higiene RF), el glosario de amenazas vigentes (T-WPS, T-RF, T-SPY, T-SYNTH, T-CKP, T-PHYS, T-DOM), y los protocolos operativos asociados. Respuestas orientativas — no vinculantes.'
    },
    parte_despliegue: { form: true,
      titulo: 'Parte de despliegue',
      subtitulo: 'Formulario de registro para salidas de campo — completar antes de cada despliegue',
      campos: [
        { label: 'Corresponsal', tipo: 'text', placeholder: 'apellido.inicial' },
        { label: 'Destino', tipo: 'text', placeholder: 'ej: Arauca, COL / Apure, VEN' },
        { label: 'Fecha salida', tipo: 'text', placeholder: 'YYYY-MM-DD' },
        { label: 'Fecha retorno estimada', tipo: 'text', placeholder: 'YYYY-MM-DD' },
        { label: 'Fixer designado', tipo: 'text', placeholder: 'nombre + base + medio' },
        { label: 'Protocolo de check-in', tipo: 'text', placeholder: 'ej: cada 6h vía Signal' },
        { label: 'Kit declarado', tipo: 'textarea', placeholder: 'Listar equipamiento: terminal satelital, router, dispositivos, protección balística...' },
        { label: 'Seguro confirmado', tipo: 'select', opciones: ['Seleccionar', 'Sí — póliza vigente', 'No — pendiente', 'N/A — despliegue doméstico'] },
        { label: 'HEFAT vigente', tipo: 'select', opciones: ['Seleccionar', 'Sí — certificado vigente', 'No — solicitar excepción', 'No aplica'] },
        { label: 'Contacto de emergencia notificado', tipo: 'select', opciones: ['Seleccionar', 'Sí', 'No — pendiente'] },
        { label: 'Notas adicionales', tipo: 'textarea', placeholder: 'Riesgos específicos, coordinaciones pendientes, solicitudes a legales...' }
      ]
    },
    pipeline_verificacion: { doc: {
      area: 'INFOBAE · HERRAMIENTAS', codigo: 'OP-TOOL-2029-001', version: '1.0', fecha: '2029-03-01', responsable: 'd. roca (verificación)',
      titulo: 'Pipeline de verificación', subtitulo: 'Flujo de trabajo para material entrante de zona activa',
      secciones: [
        { titulo: 'Flujo estándar', texto: 'Material entrante → registro en cola (timestamp, fixer, tipo, tamaño) → verificación de origen (¿quién envió, desde dónde?) → verificación de contenido (geolocalización, análisis visual, detector de síntesis) → evaluación de riesgo (impacto sobre fuentes) → decisión editorial (publicar / condiciones / reserva / no publicar) → registro en OP-SEC-LOG con cadena completa.' },
        { titulo: 'Herramientas integradas', texto: 'Detector de síntesis automatizado (Reality Defender API, activo desde 05.2029). Verificador C2PA (IPTC Origin Verifier). Analista automatizado (IA, sección 07 de OP-SEC-2029-004). Imágenes satelitales: Sentinel Hub, Planet Labs (sujeto a disponibilidad regional). Geolocalización: Google Earth Pro, QGIS para análisis avanzado.' },
        { titulo: 'Tiempos', texto: 'Material urgente (breaking): verificación mínima en < 30 minutos. Material estándar: verificación completa en < 4 horas. Material de investigación: sin límite temporal, verificación exhaustiva. El nivel de verificación se define al ingreso y se registra en el log.' }
      ], fuentes: 'Documento interno. Referencia: Bellingcat Online Investigation Toolkit, BBC Verify workflow, First Draft Verification Handbook.' }},
    opsec_log: { doc: {
      area: 'INFOBAE · HERRAMIENTAS', codigo: 'OP-TOOL-2029-002', version: '1.0', fecha: '2029-03-01', responsable: 'j. fiorella + d. roca',
      titulo: 'OP-SEC-LOG: bitácora auditable', subtitulo: 'Sistema de registro de decisiones editoriales con cadena de procedencia',
      secciones: [
        { titulo: 'Qué se registra', texto: 'Cada decisión editorial sobre material de zona activa queda registrada con: timestamp, identificador del material, fixer de origen, resultado de verificación (automatizada y humana), decisión editorial (publicar / condiciones / reserva / no publicar), responsable de la decisión, y modelo de IA usado si aplica.' },
        { titulo: 'Por qué', texto: 'La bitácora permite reconstruir la cadena completa de procedencia de cualquier publicación: desde quién capturó el material hasta quién decidió publicarlo y con qué nivel de verificación. En caso de cuestionamiento post-publicación, la bitácora es la evidencia de due diligence editorial.' },
        { titulo: 'Acceso', texto: 'Lectura: editor de turno, seguridad digital, legales, dirección editorial. Escritura: corresponsal que registra la decisión. Modificación post-registro: no permitida. Las entradas son append-only. Retención: 5 años desde la fecha de registro.' }
      ], fuentes: 'Documento interno.' }},
    version_fixer: { doc: {
      area: 'INFOBAE · SEGURIDAD DIGITAL', codigo: 'OP-SEC-2029-004-FX', version: '1.0', fecha: '2029-04-15', responsable: 'j. fiorella · revisado por r. velásquez (ext.)',
      titulo: 'Higiene RF — versión resumida para fixer', subtitulo: 'Resumen operativo del manual OP-SEC-2029-004 para personal externo en campo',
      secciones: [
        { titulo: 'Qué es esto', texto: 'Este documento resume el manual de higiene RF de Infobae para uso del fixer designado durante el despliegue. No reemplaza el manual completo. Si necesitás el documento completo, pedilo al corresponsal o a seg.digital@infobae.interna.' },
        { titulo: 'Lo que tenés que saber', texto: 'Tu router de viaje y el terminal satelital emiten señales que pueden ser usadas para ubicarte. La randomización de BSSID ayuda pero no es suficiente. Apagá el terminal cuando no estés transmitiendo. Ventanas de transmisión cortas: 2-5 minutos, después apagar. No transmitir en movimiento.' },
        { titulo: 'Si algo sale mal', texto: 'Si recibís amenazas directas: contactar al corresponsal inmediatamente. Si tu dispositivo se comporta de manera extraña: no intentar arreglarlo, apagarlo, avisar al corresponsal. Si perdés contacto con el corresponsal por más de 12 horas: contactar a FLIP (Colombia) o SNTP (Venezuela) según tu ubicación.' }
      ], fuentes: 'Resumen de OP-SEC-2029-004 ed. 4.2. Versión en español colombiano/venezolano.' }},
    fopea_protocolo: { doc: {
      area: 'DOCUMENTO EXTERNO · REFERENCIA', codigo: 'EXT-FOPEA-2028', version: 'ext.', fecha: '2028', responsable: 'FOPEA (Foro de Periodismo Argentino)',
      titulo: 'Protocolo de aviso mutuo entre colegas', subtitulo: 'Referencia externa — no es documento Infobae',
      secciones: [
        { titulo: 'Origen', texto: 'FOPEA (fopea.org) es el foro argentino de periodismo que nuclea a periodistas de investigación. Su protocolo de aviso mutuo establece que ante amenaza, hackeo o seguimiento documentado, el periodista afectado avisa a su red de colegas para activar visibilidad pública y protección colectiva. No es un protocolo formal escrito sino una práctica documentada desde el caso "Anaconda" (2016-2020).' },
        { titulo: 'Cómo funciona', texto: 'El periodista amenazado contacta a entre 3 y 5 colegas de confianza de medios distintos. Les informa la situación sin revelar fuentes ni material en curso. Los colegas publican o mencionan públicamente que el periodista está bajo presión, generando costo político para el agresor. En paralelo, se notifica a CPJ y RSF para registro institucional.' },
        { titulo: 'Integración con Infobae', texto: 'El personal de Infobae con despliegue activo o investigación sensible debe mantener al menos 3 contactos FOPEA actualizados. La activación del protocolo FOPEA se comunica al editor de turno pero no requiere autorización previa. La protección de la persona prevalece sobre la coordinación editorial.' }
      ], fuentes: 'FOPEA (fopea.org). Referencia práctica, no normativa. Hugo Alconada Mon, descripción pública del modelo de red de seguridad entre colegas (GIJN, 2024).' }},
    // ============ FOLDER VIEWS ============
    folder_redaccion: { folder: true, titulo: 'Redacción', subtitulo: 'Documentos operativos del área editorial', docs: [
      { key: 'manual_estilo', codigo: 'OP-RED-2027-001', titulo: 'Manual de estilo editorial', version: '12.3', estado: 'vigente' },
      { key: 'fuentes_anonimas', codigo: 'OP-RED-2028-003', titulo: 'Protocolo de fuentes anónimas', version: '3.0', estado: 'en_revision' },
      { key: 'verificacion_prepub', codigo: 'OP-RED-2029-005', titulo: 'Guía de verificación pre-publicación', version: '5.1', estado: 'vigente' }
    ]},
    folder_segdigital: { folder: true, titulo: 'Seguridad digital', subtitulo: 'Manuales operativos y protocolos de seguridad', docs: [
      { key: 'comunicacion_cifrada', codigo: 'OP-SEC-2028-011', titulo: 'Comunicación cifrada en campo', version: '3.1', estado: 'vigente' },
      { key: 'verificacion_c2pa', codigo: 'OP-SEC-2029-001', titulo: 'Verificación C2PA en redacción', version: '2.0', estado: 'en_revision' },
      { key: null, codigo: 'OP-SEC-2029-004', titulo: 'Higiene RF en despliegue internacional', version: '4.2', actual: true, estado: 'vigente' },
      { key: 'compromiso_dispositivo', codigo: 'OP-SEC-2029-003', titulo: 'Compromiso de dispositivo', version: '1.4', estado: 'vigente' },
      { key: 'vigilancia_destino', codigo: 'OP-SEC-2028-009', titulo: 'Vigilancia en destino', version: '2.3', estado: 'vigente' },
      { key: 'version_fixer', codigo: 'OP-SEC-2029-004-FX', titulo: 'Higiene RF — versión fixer', version: '1.0', estado: 'borrador' }
    ]},
    folder_legales: { folder: true, titulo: 'Legales y regulatorio', subtitulo: 'Marco normativo y procedimientos', docs: [
      { key: 'anmac_enacom', codigo: 'OP-LEG-2028-007', titulo: 'Requisitos ANMaC / ENACOM', version: '4.0', estado: 'vigente' },
      { key: 'exportacion_equip', codigo: 'OP-LEG-2029-002', titulo: 'Exportación de equipamiento', version: '1.1', estado: 'vigente' },
      { key: 'seguros_riesgo', codigo: 'OP-LEG-2028-014', titulo: 'Seguros de alto riesgo', version: '2.0', estado: 'en_revision' }
    ]},
    folder_rrhh: { folder: true, titulo: 'Recursos humanos', subtitulo: 'Políticas de personal y apoyo', docs: [
      { key: 'jtsn_apoyo', codigo: 'OP-HR-2027-012', titulo: 'Apoyo psicológico (JTSN)', version: '2.2', estado: 'vigente' },
      { key: 'politica_despliegue', codigo: 'OP-HR-2028-003', titulo: 'Política de despliegue y descanso', version: '1.5', estado: 'vigente' },
      { key: 'contactos_emergencia', codigo: 'OP-HR-2029-001', titulo: 'Contactos de emergencia por región', version: '1.0', estado: 'vigente' }
    ]},
    // ============ DOCUMENTOS DE INVESTIGACIÓN ============
    docs_filtrados: { doc: {
      area: 'INFOBAE · INVESTIGACIÓN', codigo: 'OP-INV-2028-001', version: '2.0', fecha: '2028-07-15', responsable: 'dirección editorial + legales',
      titulo: 'Protocolo de documentos filtrados', subtitulo: 'Recepción, custodia, verificación y protección legal de material filtrado',
      secciones: [
        { titulo: 'Recepción segura', texto: 'Todo material filtrado se recibe exclusivamente por canales cifrados (SecureDrop, Signal, entrega física). No se recibe material por email corporativo, WhatsApp ni redes sociales. El periodista receptor no copia el material a dispositivos personales. Se registra fecha, hora y canal de recepción sin identificar a la fuente.' },
        { titulo: 'Cadena de custodia', texto: 'El material se almacena en dispositivo aislado (air-gapped) asignado por seguridad digital. No se conecta a red. Las copias de trabajo se hacen en dispositivo secundario dedicado. Cada copia se registra con hash SHA-256 para verificar integridad. El original permanece intacto.' },
        { titulo: 'Verificación de autenticidad', texto: 'Antes de publicar: verificar metadatos del documento (fecha de creación, autor, historial de modificaciones). Contrastar contenido con fuentes independientes. Evaluar posibilidad de material fabricado o alterado (documentos plantados como operación de inteligencia). Consultar al analista automatizado para evaluación de riesgo.' },
        { titulo: 'Protección legal', texto: 'Argentina: la jurisprudencia del caso Campillay (CSJN, 1986) establece estándares de protección para periodistas que publican información de terceros. No exime de verificación. Ante requerimiento judicial: se activa protocolo con legales (l. pollastri). La identidad de la fuente se protege bajo doctrina de secreto profesional. Consultar OP-RED-2028-003 (fuentes anónimas) para procedimiento de otorgamiento de anonimato.' }
      ], fuentes: 'CSJN, "Campillay c/ La Razón", 1986. Freedom of the Press Foundation, SecureDrop documentation. ICIJ, protocolo de recepción de material (referencia pública). CPJ, "Journalist Security Guide", capítulo sobre documentos sensibles.' }},
    osint_investigacion: { doc: {
      area: 'INFOBAE · INVESTIGACIÓN', codigo: 'OP-INV-2029-002', version: '1.0', fecha: '2029-02-01', responsable: 'd. roca (verificación) + j. fiorella',
      titulo: 'Metodología OSINT para investigaciones', subtitulo: 'Fuentes abiertas, herramientas, límites éticos y documentación del proceso',
      secciones: [
        { titulo: 'Principio general', texto: 'OSINT (Open Source Intelligence) usa información públicamente accesible: registros oficiales, redes sociales, imágenes satelitales, bases de datos abiertas, registros corporativos y judiciales. No es hacking. No implica acceso no autorizado a sistemas. Si requiere una contraseña, no es OSINT.' },
        { titulo: 'Herramientas estándar', texto: 'Geolocalización: Google Earth Pro, Sentinel Hub, Mapillary. Verificación de imagen/video: TinEye, búsqueda inversa Google/Yandex, InVID/WeVerify. Registros corporativos: boletines oficiales, AFIP (Argentina), Registro Público de Comercio, OpenCorporates. Redes sociales: CrowdTangle (Meta), Wayback Machine, captura con Hunchly o ArchiveBox. Vuelos: FlightRadar24, ADS-B Exchange. Embarcaciones: MarineTraffic, VesselFinder.' },
        { titulo: 'Documentación del proceso', texto: 'Toda investigación OSINT se documenta paso a paso: qué se buscó, cuándo, en qué plataforma, qué se encontró, y capturas de pantalla con timestamp. Esta documentación se archiva en OP-SEC-LOG y sirve como evidencia del proceso en caso de cuestionamiento legal o editorial.' },
        { titulo: 'Límites éticos', texto: 'No se crean perfiles falsos para obtener información de fuentes sin su conocimiento (catfishing). No se accede a información eliminada por la fuente si fue claramente retirada intencionalmente. No se publican datos personales de civiles no involucrados. Doxing está prohibido. Ante duda sobre el límite ético de una técnica, consultar con editor en jefe.' }
      ], fuentes: 'Bellingcat, Online Investigation Toolkit (2024). First Draft, Verification Handbook. Berkeley Protocol on Digital Open Source Investigations (ONU/ACNUDH, 2022). Henk van Ess, OSINT training methodology.' }},
    redes_internacionales: { doc: {
      area: 'INFOBAE · INVESTIGACIÓN', codigo: 'OP-INV-2029-003', version: '1.0', fecha: '2029-03-10', responsable: 'dirección editorial',
      titulo: 'Colaboración con redes internacionales de investigación', subtitulo: 'ICIJ, OCCRP, GIJN y protocolos de trabajo colaborativo transfronterizo',
      secciones: [
        { titulo: 'Redes activas', texto: 'ICIJ (International Consortium of Investigative Journalists): red global con más de 280 periodistas en 100+ países. Infobae participa como medio asociado. Proyectos anteriores: Panama Papers, Pandora Papers, FinCEN Files. Comunicación exclusivamente por plataforma cifrada de ICIJ. OCCRP (Organized Crime and Corruption Reporting Project): foco en Europa del Este, Asia Central y América Latina. Herramientas compartidas: Aleph (repositorio de documentos), bases de datos de empresas offshore. GIJN (Global Investigative Journalism Network): red de recursos, capacitación y metodología. Conferencia anual. Directorio de herramientas.' },
        { titulo: 'Protocolo de colaboración', texto: 'Toda colaboración transfronteriza se comunica al director editorial antes de compartir material. El material compartido con redes externas se clasifica bajo acuerdo de embargo hasta publicación coordinada. No se comparte material con periodistas fuera de la red sin autorización. Las fuentes locales de Infobae no se revelan a periodistas de otros medios dentro de la red salvo acuerdo explícito.' },
        { titulo: 'Seguridad en colaboraciones', texto: 'Las comunicaciones con redes externas usan exclusivamente los canales cifrados provistos por cada red (ICIJ usa plataforma propia, OCCRP usa Signal). No se usan emails corporativos para compartir material sensible de colaboración. Los dispositivos usados para acceder a plataformas de redes externas son los mismos dispositivos secundarios de despliegue (GrapheneOS).' }
      ], fuentes: 'ICIJ, membership guidelines (icij.org). OCCRP, Aleph documentation. GIJN, Investigative Journalism Manual. Referencia interna: participación de Infobae en proyectos ICIJ 2024-2029.' }},
    contravigilancia: { doc: {
      area: 'INFOBAE · INVESTIGACIÓN', codigo: 'OP-INV-2028-004', version: '3.0', fecha: '2029-01-20', responsable: 'j. fiorella + dirección editorial',
      titulo: 'Contra-vigilancia doméstica para periodistas de investigación', subtitulo: 'Protocolo operativo para personal bajo observación estatal o privada en territorio argentino',
      secciones: [
        { titulo: 'Supuesto operativo', texto: 'Todo periodista de investigación de Infobae que trabaje temas de corrupción, inteligencia, narcotráfico transnacional o crimen organizado debe asumir que está bajo algún grado de vigilancia. Los casos documentados en Argentina incluyen: seguimiento físico, colocación de GPS en vehículos, intervención telefónica con orden judicial ambigua, intentos coordinados de hackeo de cuentas (WhatsApp, X, email), y apertura de legajos de inteligencia (caso "Anaconda", 2016-2020).' },
        { titulo: 'Medidas permanentes', texto: 'Variación de rutas habituales (domicilio–redacción). Inspección periódica del vehículo (bajo chasis, ruedas, parachoques) con detección de GPS. No hablar de investigaciones en curso por teléfono ni en la redacción si hay sospecha de intervención ambiental. Signal como canal exclusivo para comunicación sensible. Reuniones con fuentes en lugares sin cámaras de seguridad identificables. No llevar dispositivo personal a reuniones con fuentes de inteligencia.' },
        { titulo: 'Red de protección', texto: 'Mantener al menos 3 contactos FOPEA actualizados para activación de protocolo de aviso mutuo (ver EXT-FOPEA-2028). Documentar todo incidente (seguimiento, hackeo, amenaza) ante FOPEA y CPJ. Si la amenaza incluye agresión física o vigilancia sostenida: comunicar al director editorial y activar cobertura legal inmediata. Considerar publicación coordinada con otro medio como medida de protección (la visibilidad protege).' },
        { titulo: 'Investigaciones sobre inteligencia', texto: 'Cuando el objeto de investigación es la propia SIDE o sus derivados, el nivel de precaución se eleva. No almacenar material en ningún dispositivo conectado a red. Copias físicas en lugar seguro fuera de la redacción y del domicilio. Considerar uso de intermediario legal (abogado con secreto profesional) para custodia de material crítico. No subestimar capacidad técnica del adversario — la SIDE tiene acceso a herramientas de vigilancia comercial de grado militar.' }
      ], fuentes: 'FOPEA, informes de amenazas a periodistas 2020-2029. CPJ, Argentina country reports. Hugo Alconada Mon, descripción pública de vigilancia (GIJN, 2024). Citizen Lab, reportes sobre uso de Pegasus en América Latina.' }},
    folder_investigacion: { folder: true, titulo: 'Investigación', subtitulo: 'Metodología, protocolos y herramientas para periodismo de investigación', docs: [
      { key: 'docs_filtrados', codigo: 'OP-INV-2028-001', titulo: 'Documentos filtrados', version: '2.0', estado: 'vigente' },
      { key: 'osint_investigacion', codigo: 'OP-INV-2029-002', titulo: 'Metodología OSINT', version: '1.0', estado: 'vigente' },
      { key: 'redes_internacionales', codigo: 'OP-INV-2029-003', titulo: 'Redes internacionales (ICIJ, OCCRP)', version: '1.0', estado: 'vigente' },
      { key: 'contravigilancia', codigo: 'OP-INV-2028-004', titulo: 'Contra-vigilancia doméstica', version: '3.0', estado: 'vigente' }
    ]}
  };

  function showToast(msg, duracion = 2800) {
    setToast(msg);
    setTimeout(() => setToast(null), duracion);
  }

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handlePrint() {
    window.print();
  }

  function handleCopyLink() {
    const url = window.location.href + '#' + DOC_META.codigo;
    navigator.clipboard?.writeText(url).then(() => showToast('Enlace copiado al portapapeles')).catch(() => showToast('No se pudo copiar'));
  }

  function handlePDF() {
    showToast('Generando PDF... disponible en 5–10 segundos');
    setTimeout(() => showToast('PDF no disponible en entorno de prueba'), 3000);
  }

  function handleDocNoDisponible(titulo) {
    showToast(`${titulo} — documento no disponible en esta demo`);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function executeSearch(query) {
    setSearchQuery(query);
    if (!query.trim() || !articleRef.current) return;
    // Usar la API nativa del browser para encontrar y resaltar
    if (window.find) {
      articleRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        window.find(query, false, false, true, false, true, false);
      }, 300);
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(prev => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch(e) {} };
  }, []);

  async function correrAnalisis() {
    if (!consultaInput.trim()) return;
    setConsultaResult({ loading: true, text: null, error: null });

    const prompt = `Sos el "analista automatizado" integrado al manual operativo OP-SEC-2029-004 de Infobae. Tu rol es asistir a corresponsales y personal de campo evaluando material de interés (video, audio, imagen, texto, testimonio) contra el glosario de amenazas vigente. El usuario consulta desde la sección 07 del manual.

Contexto operacional del manual:
- Zona primaria de aplicación: frontera Arauca (COL) / Apure (VEN) post-transición venezolana 2026
- Actores dominantes: ELN, disidencias FARC reconfiguradas, inteligencia venezolana en transición
- Amenazas activas documentadas: T-WPS (harvesting geolocalización), T-RF (detección pasiva), T-SPY (spyware zero-click), T-SYNTH (contenido sintético), T-CKP (reconocimiento facial checkpoints)

Consulta recibida del usuario:
"${consultaInput}"

Respondé en castellano rioplatense, registro técnico-operacional como el del manual. Máximo 180 palabras. Sin slop. Sin drama. Sin introducción ni cierre conversacional. Estructurá así, con los labels en mayúsculas tal cual:

EVALUACIÓN PRELIMINAR: una línea.
AMENAZAS APLICABLES: códigos del glosario (T-WPS, T-RF, etc.) y por qué.
RECOMENDACIÓN OPERACIONAL: 2-3 pasos concretos del manual.
ESCALAMIENTO: a quién consultar si la consulta excede el manual (legales, seguridad digital, editor de turno).`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      const texto = data.content?.map(c => c.text || "").join("") || "(sin respuesta)";
      setConsultaResult({ loading: false, text: texto, error: null });
    } catch (e) {
      setConsultaResult({ loading: false, text: null, error: String(e) });
    }
  }

  function toggleSidebar(key) {
    setSidebarExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const folderChildren = {
    'redaccion': ['manual_estilo', 'fuentes_anonimas', 'verificacion_prepub', 'folder_redaccion'],
    'seg-digital': ['comunicacion_cifrada', 'verificacion_c2pa', 'compromiso_dispositivo', 'vigilancia_destino', 'version_fixer', 'folder_segdigital'],
    'legales': ['anmac_enacom', 'exportacion_equip', 'seguros_riesgo', 'folder_legales'],
    'rrhh': ['jtsn_apoyo', 'politica_despliegue', 'contactos_emergencia', 'folder_rrhh'],
    'investigacion': ['docs_filtrados', 'osint_investigacion', 'redes_internacionales', 'contravigilancia', 'folder_investigacion']
  };
  const isFolderActive = (key) => {
    if (key === 'seg-digital' && !activeView && !showLanding) return true;
    return folderChildren[key]?.includes(activeView) || false;
  };

  // Auto-expandir carpeta padre al navegar a un hijo
  useEffect(() => {
    if (!activeView && !showLanding) {
      setSidebarExpanded(prev => ({ ...prev, 'seg-digital': true }));
    }
    for (const [folder, children] of Object.entries(folderChildren)) {
      if (children.includes(activeView)) {
        setSidebarExpanded(prev => ({ ...prev, [folder]: true }));
      }
    }
  }, [activeView, showLanding]);

  function handleLogin() {
    if (!loginUser.trim()) { setLoginError(true); return; }
    setLoginError(false);
    setLoggedIn(true);
  }

  // ======================= LOGIN SCREEN =======================
  if (!loggedIn) return (
    <div style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif", minHeight: '100vh', backgroundColor: '#1f1f1f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        .serif { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        .mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>
      <div style={{ width: '380px', textAlign: 'center' }}>
        <div style={{ marginBottom: '40px' }}>
          <span className="serif" style={{ fontWeight: 600, letterSpacing: '-0.02em', fontSize: '36px', color: '#f18b1e', lineHeight: 1 }}>
            infobae
          </span>
          <div className="mono" style={{ fontSize: '12px', color: '#5a544c', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '8px' }}>
            / interna
          </div>
        </div>

        <div style={{ backgroundColor: '#2a2a2a', border: '1px solid #3d3931', padding: '32px', textAlign: 'left' }}>
          <div className="mono" style={{ fontSize: '10.5px', color: '#8a8472', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '20px' }}>
            Acceso restringido a personal autorizado
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="mono" style={{ fontSize: '10.5px', color: '#8a8472', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Usuario</label>
            <input
              type="text"
              value={loginUser}
              onChange={e => setLoginUser(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="mono"
              style={{ width: '100%', padding: '10px 12px', fontSize: '13px', backgroundColor: '#1f1f1f', border: '1px solid #3d3931', color: '#d9d4c2', fontFamily: "'JetBrains Mono', monospace", boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label className="mono" style={{ fontSize: '10.5px', color: '#8a8472', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Contraseña</label>
            <input
              type="password"
              value={loginPass}
              onChange={e => setLoginPass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="mono"
              style={{ width: '100%', padding: '10px 12px', fontSize: '13px', backgroundColor: '#1f1f1f', border: '1px solid #3d3931', color: '#d9d4c2', fontFamily: "'JetBrains Mono', monospace", boxSizing: 'border-box' }}
            />
          </div>

          {loginError && (
            <div className="mono" style={{ fontSize: '11px', color: '#bd2828', marginBottom: '12px' }}>
              Credenciales no válidas. Contactar mesa de ayuda IT.
            </div>
          )}

          <button
            onClick={handleLogin}
            className="mono"
            style={{ width: '100%', padding: '11px', fontSize: '11px', letterSpacing: '0.06em', backgroundColor: '#f18b1e', color: '#1f1f1f', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}
          >
            INICIAR SESIÓN
          </button>
        </div>

        <div className="mono" style={{ fontSize: '10px', color: '#3d3931', marginTop: '24px', lineHeight: 1.6 }}>
          Sistema de uso interno · Infobae<br/>
          Incidentes de acceso: it@infobae.interna
        </div>
      </div>
    </div>
  );

  // ======================= INTRANET =======================
  return (
    <div style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif", minHeight: '100vh', backgroundColor: '#eceae4', color: '#1f1f1f', fontSize: '14px' }}>
      <style>{`
        .serif { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .sans { font-family: 'IBM Plex Sans', system-ui, sans-serif; }
        a { color: #bd2828; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .doc-link { color: #1f1f1f; }
        .doc-link:hover { color: #bd2828; text-decoration: none; }
        .chrome-link { color: #fff; opacity: 0.9; }
        .chrome-link:hover { opacity: 1; }
        .sidebar-item:hover { background: #e5e1d3; }
        .micro { font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; }
        .sb-collapsed .sb-text { display: none; }
        .sb-collapsed .sb-label { display: none; }
        .sb-collapsed .sidebar-item { justify-content: center; padding-left: 0 !important; padding-right: 0 !important; min-height: 36px; }
        .sb-collapsed .sidebar-item svg { transform: scale(1.35); }
        .sb-collapsed .sb-chevron { display: none; }
        .sb-collapsed .sb-divider { display: none; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* ======================= TOP BAR — CROMA CORPORATIVO ======================= */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #d9d4c2', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px', fontSize: '13px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="serif" style={{ fontWeight: 600, letterSpacing: '-0.02em', fontSize: '22px', color: '#f18b1e', lineHeight: 1 }}>
              infobae
            </span>
            <span className="mono" style={{ fontSize: '11px', color: '#5a544c', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              / interna
            </span>
          </div>
          <nav style={{ display: 'flex', gap: '22px' }}>
            <span className="sans" style={{ fontSize: '13px', color: (!activeView && showLanding) ? '#1f1f1f' : '#5a544c', fontWeight: (!activeView && showLanding) ? 500 : 400, cursor: 'pointer' }} onClick={() => { setActiveView(null); setShowLanding(true); }}>Inicio</span>
            <span className="sans" style={{ fontSize: '13px', color: activeView === 'redaccion' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'redaccion' ? 500 : 400, cursor: 'pointer' }} onClick={() => setActiveView('redaccion')}>Redacción</span>
            <span className="sans" style={{ fontSize: '13px', color: (activeView === 'folder_segdigital' || (!activeView && !showLanding)) ? '#1f1f1f' : '#5a544c', fontWeight: (activeView === 'folder_segdigital' || (!activeView && !showLanding)) ? 500 : 400, cursor: 'pointer' }} onClick={() => { setActiveView('folder_segdigital'); setShowLanding(false); }}>Documentos</span>
            <span className="sans" style={{ fontSize: '13px', color: activeView === 'directorio' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'directorio' ? 500 : 400, cursor: 'pointer' }} onClick={() => setActiveView('directorio')}>Directorio</span>
            <span className="sans" style={{ fontSize: '13px', color: activeView === 'herramientas' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'herramientas' ? 500 : 400, cursor: 'pointer' }} onClick={() => setActiveView('herramientas')}>Herramientas</span>
            <span className="sans" style={{ fontSize: '13px', color: activeView === 'soporte' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'soporte' ? 500 : 400, cursor: 'pointer' }} onClick={() => setActiveView('soporte')}>Soporte</span>
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
          <Search size={16} color={searchOpen ? '#1f1f1f' : '#5a544c'} style={{ cursor: 'pointer' }} onClick={() => setSearchOpen(!searchOpen)} />
          <div style={{ position: 'relative' }}>
            <Bell size={16} color={notifOpen ? '#1f1f1f' : '#5a544c'} style={{ cursor: 'pointer' }} onClick={() => setNotifOpen(!notifOpen)} />
            {NOTIFICACIONES.filter(n => !n.leida).length > 0 && (
              <div style={{ position: 'absolute', top: -2, right: -2, width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#bd2828' }}></div>
            )}
            {notifOpen && (<>
              <div onClick={() => setNotifOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}></div>
              <div style={{ position: 'absolute', top: '28px', right: 0, width: '380px', backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2', boxShadow: '0 4px 16px rgba(31,31,31,0.1)', zIndex: 100 }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #d9d4c2', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div className="mono micro" style={{ color: '#8a8472' }}>Notificaciones</div>
                  <div className="mono" style={{ fontSize: '10px', color: '#5a544c', cursor: 'pointer' }} onClick={() => setNotifOpen(false)}>cerrar</div>
                </div>
                {NOTIFICACIONES.map(n => (
                  <div key={n.id} style={{ padding: '10px 16px', borderBottom: '1px solid #eceae4', backgroundColor: n.leida ? 'transparent' : '#f0ecde' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                      <div className="mono" style={{ fontSize: '10.5px', fontWeight: 500, color: '#1f1f1f' }}>{n.usuario}</div>
                      <div className="mono" style={{ fontSize: '10px', color: '#8a8472' }}>{n.tiempo}</div>
                    </div>
                    <div className="sans" style={{ fontSize: '12px', lineHeight: 1.4, color: '#3d3931' }}>{n.texto}</div>
                  </div>
                ))}
              </div>
            </>)}
          </div>
          <div style={{ width: '1px', height: '20px', backgroundColor: '#d9d4c2' }}></div>
          <div className="sans" style={{ fontSize: '12.5px', color: '#1f1f1f', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f0ecde', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#1f1f1f', fontWeight: 600 }}>LM</div>
            <span>mondini.l</span>
          </div>
        </div>
      </div>

      {/* ======================= SEARCH BAR ======================= */}
      {searchOpen && (
        <div style={{ backgroundColor: '#f7f5ee', borderBottom: '1px solid #d9d4c2', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Search size={14} color="#8a8472" />
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') executeSearch(searchQuery); if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); } }}
            placeholder="Buscar en este documento..."
            className="mono"
            style={{ flex: 1, border: 'none', backgroundColor: 'transparent', fontSize: '12.5px', color: '#1f1f1f', outline: 'none', fontFamily: "'JetBrains Mono', monospace" }}
          />
          <div className="mono" style={{ fontSize: '10.5px', color: '#8a8472' }}>
            Enter para buscar · Esc para cerrar
          </div>
        </div>
      )}

      {/* ======================= BREADCRUMB DINÁMICO ======================= */}
      <div style={{ backgroundColor: '#f7f5ee', borderBottom: '1px solid #d9d4c2', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#5a544c' }}>
        <Home size={12} style={{ cursor: 'pointer' }} onClick={() => { setActiveView(null); setShowLanding(true); }} />
        {(() => {
          const docFolders = {
            manual_estilo: ['Redacción', 'folder_redaccion'], fuentes_anonimas: ['Redacción', 'folder_redaccion'], verificacion_prepub: ['Redacción', 'folder_redaccion'],
            comunicacion_cifrada: ['Seguridad Digital', 'folder_segdigital'], verificacion_c2pa: ['Seguridad Digital', 'folder_segdigital'], compromiso_dispositivo: ['Seguridad Digital', 'folder_segdigital'], vigilancia_destino: ['Seguridad Digital', 'folder_segdigital'], version_fixer: ['Seguridad Digital', 'folder_segdigital'],
            anmac_enacom: ['Legales', 'folder_legales'], exportacion_equip: ['Legales', 'folder_legales'], seguros_riesgo: ['Legales', 'folder_legales'],
            jtsn_apoyo: ['RRHH', 'folder_rrhh'], politica_despliegue: ['RRHH', 'folder_rrhh'], contactos_emergencia: ['RRHH', 'folder_rrhh'],
            docs_filtrados: ['Investigación', 'folder_investigacion'], osint_investigacion: ['Investigación', 'folder_investigacion'], redes_internacionales: ['Investigación', 'folder_investigacion'], contravigilancia: ['Investigación', 'folder_investigacion'],
            fopea_protocolo: ['Ext.', null]
          };
          const toolKeys = ['analista_auto', 'parte_despliegue', 'pipeline_verificacion', 'opsec_log'];
          const pageKeys = ['noticias', 'directorio', 'agenda', 'redaccion', 'herramientas', 'soporte'];
          const folderKeys = ['folder_redaccion', 'folder_segdigital', 'folder_legales', 'folder_rrhh', 'folder_investigacion'];
          const sep = <ChevronRight size={12} />;
          const link = (label, fn) => <span className="doc-link" style={{ cursor: 'pointer' }} onClick={fn}>{label}</span>;

          if (showLanding && !activeView) return <>{sep}<span className="mono" style={{ color: '#1f1f1f' }}>Inicio</span></>;
          if (!showLanding && !activeView) return <>{sep}{link('Documentos', () => { setActiveView('folder_segdigital'); setShowLanding(false); })}{sep}{link('Seguridad Digital', () => { setActiveView('folder_segdigital'); setShowLanding(false); })}{sep}<span className="mono" style={{ color: '#1f1f1f' }}>{DOC_META.codigo}</span></>;
          if (pageKeys.includes(activeView)) return <>{sep}<span className="mono" style={{ color: '#1f1f1f' }}>{VISTAS[activeView]?.titulo}</span></>;
          if (folderKeys.includes(activeView)) return <>{sep}{link('Documentos', () => { setActiveView('folder_segdigital'); setShowLanding(false); })}{sep}<span className="mono" style={{ color: '#1f1f1f' }}>{VISTAS[activeView]?.titulo}</span></>;
          if (toolKeys.includes(activeView)) return <>{sep}{link('Herramientas', () => { setActiveView('herramientas'); setShowLanding(false); })}{sep}<span className="mono" style={{ color: '#1f1f1f' }}>{VISTAS[activeView]?.titulo || VISTAS[activeView]?.doc?.titulo}</span></>;
          if (docFolders[activeView]) {
            const [folderName, folderKey] = docFolders[activeView];
            const docTitle = VISTAS[activeView]?.doc?.titulo || VISTAS[activeView]?.titulo;
            return <>{sep}{link('Documentos', () => { setActiveView('folder_segdigital'); setShowLanding(false); })}{sep}{folderKey ? link(folderName, () => { setActiveView(folderKey); setShowLanding(false); }) : <span>{folderName}</span>}{sep}<span className="mono" style={{ color: '#1f1f1f' }}>{docTitle}</span></>;
          }
          return <>{sep}<span className="mono" style={{ color: '#1f1f1f' }}>{activeView}</span></>;
        })()}
      </div>

      {/* ======================= LAYOUT PRINCIPAL ======================= */}
      <div style={{ display: 'grid', gridTemplateColumns: `${sidebarCollapsed ? '52px' : '240px'} 1fr 280px`, gap: '0', minHeight: 'calc(100vh - 100px)', transition: 'grid-template-columns 0.15s ease' }}>

        {/* LEFT SIDEBAR — Árbol de documentos */}
        <aside className={sidebarCollapsed ? 'sb-collapsed' : ''} style={{ backgroundColor: '#f0ede4', borderRight: '1px solid #d9d4c2', padding: '20px 0', fontSize: '13px', overflow: 'hidden' }}>
          <div style={{ padding: '0 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="micro sb-label" style={{ color: '#8a8472' }}>Explorar</span>
            <ChevronRight size={14} color="#8a8472" style={{ cursor: 'pointer', transform: sidebarCollapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.15s' }} onClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
          </div>

          <div style={{ padding: '4px 0' }}>
            <div onClick={() => setActiveView('noticias')} className="sidebar-item" style={{ padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', backgroundColor: activeView === 'noticias' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'noticias' ? '2px solid #bd2828' : '2px solid transparent', fontWeight: activeView === 'noticias' ? 500 : 400 }}>
              <BookOpen size={13} color={activeView === 'noticias' ? '#1f1f1f' : '#5a544c'} />
              <span className="sb-text">Noticias internas</span>
            </div>
            <div onClick={() => setActiveView('directorio')} className="sidebar-item" style={{ padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', backgroundColor: activeView === 'directorio' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'directorio' ? '2px solid #bd2828' : '2px solid transparent', fontWeight: activeView === 'directorio' ? 500 : 400 }}>
              <Users size={13} color={activeView === 'directorio' ? '#1f1f1f' : '#5a544c'} />
              <span className="sb-text">Directorio</span>
            </div>
            <div onClick={() => setActiveView('agenda')} className="sidebar-item" style={{ padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', backgroundColor: activeView === 'agenda' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'agenda' ? '2px solid #bd2828' : '2px solid transparent', fontWeight: activeView === 'agenda' ? 500 : 400 }}>
              <Calendar size={13} color={activeView === 'agenda' ? '#1f1f1f' : '#5a544c'} />
              <span className="sb-text">Agenda editorial</span>
            </div>
          </div>

          <div className="micro sb-label" style={{ padding: '16px 20px 10px', color: '#8a8472' }}>
            Documentos operativos
          </div>
          <div>
            <div onClick={() => { if (sidebarExpanded['redaccion']) { setActiveView('folder_redaccion'); setShowLanding(false); } else { toggleSidebar('redaccion'); } }} className="sidebar-item" style={{ padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', backgroundColor: isFolderActive('redaccion') ? '#e5e1d3' : 'transparent', borderLeft: isFolderActive('redaccion') ? '2px solid #bd2828' : '2px solid transparent' }}>
              <span className="sb-chevron">{sidebarExpanded['redaccion'] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}</span>
              {sidebarExpanded['redaccion'] ? <FolderOpen size={13} color="#5a544c" /> : <Folder size={13} color="#5a544c" />}
              <span className="sb-text">Redacción</span>
            </div>
            {!sidebarCollapsed && sidebarExpanded['redaccion'] && (
              <div style={{ paddingLeft: '28px' }}>
                <div onClick={() => setActiveView('manual_estilo')} className="sidebar-item" style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '12.5px', color: activeView === 'manual_estilo' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'manual_estilo' ? 500 : 400, backgroundColor: activeView === 'manual_estilo' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'manual_estilo' ? '2px solid #bd2828' : '2px solid transparent' }}>
                  Manual de estilo
                </div>
                <div onClick={() => setActiveView('fuentes_anonimas')} className="sidebar-item" style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '12.5px', color: activeView === 'fuentes_anonimas' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'fuentes_anonimas' ? 500 : 400, backgroundColor: activeView === 'fuentes_anonimas' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'fuentes_anonimas' ? '2px solid #bd2828' : '2px solid transparent' }}>
                  Fuentes anónimas
                </div>
                <div onClick={() => setActiveView('verificacion_prepub')} className="sidebar-item" style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '12.5px', color: activeView === 'verificacion_prepub' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'verificacion_prepub' ? 500 : 400, backgroundColor: activeView === 'verificacion_prepub' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'verificacion_prepub' ? '2px solid #bd2828' : '2px solid transparent' }}>
                  Verificación pre-pub
                </div>
              </div>
            )}
            <div onClick={() => { if (sidebarExpanded['seg-digital']) { setActiveView('folder_segdigital'); setShowLanding(false); } else { toggleSidebar('seg-digital'); } }} className="sidebar-item" style={{ padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', backgroundColor: isFolderActive('seg-digital') ? '#e5e1d3' : 'transparent', borderLeft: isFolderActive('seg-digital') ? '2px solid #bd2828' : '2px solid transparent' }}>
              <span className="sb-chevron">{sidebarExpanded['seg-digital'] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}</span>
              {sidebarExpanded['seg-digital'] ? <FolderOpen size={13} color="#5a544c" /> : <Folder size={13} color="#5a544c" />}
              <span className="sb-text" style={{ fontWeight: isFolderActive('seg-digital') ? 500 : 400 }}>Seguridad digital</span>
            </div>
            {!sidebarCollapsed && sidebarExpanded['seg-digital'] && (
              <div style={{ paddingLeft: '28px' }}>
                <div onClick={() => setActiveView('comunicacion_cifrada')} className="sidebar-item" style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '12.5px', color: activeView === 'comunicacion_cifrada' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'comunicacion_cifrada' ? 500 : 400, backgroundColor: activeView === 'comunicacion_cifrada' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'comunicacion_cifrada' ? '2px solid #bd2828' : '2px solid transparent' }}>
                  Comunicación cifrada
                </div>
                <div onClick={() => setActiveView('verificacion_c2pa')} className="sidebar-item" style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '12.5px', color: activeView === 'verificacion_c2pa' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'verificacion_c2pa' ? 500 : 400, backgroundColor: activeView === 'verificacion_c2pa' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'verificacion_c2pa' ? '2px solid #bd2828' : '2px solid transparent' }}>
                  Verificación C2PA
                </div>
                <div onClick={() => { setActiveView(null); setShowLanding(false); setTimeout(scrollToTop, 100); }} className="sidebar-item" style={{ padding: '5px 20px', backgroundColor: (!activeView && !showLanding) ? '#e5e1d3' : 'transparent', borderLeft: (!activeView && !showLanding) ? '2px solid #bd2828' : '2px solid transparent', cursor: 'pointer', fontSize: '12.5px', fontWeight: (!activeView && !showLanding) ? 500 : 400 }}>
                  <span className="sb-text">Higiene RF</span>
                </div>
                <div onClick={() => setActiveView('compromiso_dispositivo')} className="sidebar-item" style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '12.5px', color: activeView === 'compromiso_dispositivo' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'compromiso_dispositivo' ? 500 : 400, backgroundColor: activeView === 'compromiso_dispositivo' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'compromiso_dispositivo' ? '2px solid #bd2828' : '2px solid transparent' }}>
                  Compromiso de dispositivo
                </div>
                <div onClick={() => setActiveView('vigilancia_destino')} className="sidebar-item" style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '12.5px', color: activeView === 'vigilancia_destino' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'vigilancia_destino' ? 500 : 400, backgroundColor: activeView === 'vigilancia_destino' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'vigilancia_destino' ? '2px solid #bd2828' : '2px solid transparent' }}>
                  Vigilancia en destino
                </div>
              </div>
            )}
            <div onClick={() => { if (sidebarExpanded['legales']) { setActiveView('folder_legales'); setShowLanding(false); } else { toggleSidebar('legales'); } }} className="sidebar-item" style={{ padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', backgroundColor: isFolderActive('legales') ? '#e5e1d3' : 'transparent', borderLeft: isFolderActive('legales') ? '2px solid #bd2828' : '2px solid transparent' }}>
              <span className="sb-chevron">{sidebarExpanded['legales'] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}</span>
              {sidebarExpanded['legales'] ? <FolderOpen size={13} color="#5a544c" /> : <Folder size={13} color="#5a544c" />}
              <span className="sb-text">Legales y regulatorio</span>
            </div>
            {!sidebarCollapsed && sidebarExpanded['legales'] && (
              <div style={{ paddingLeft: '28px' }}>
                <div onClick={() => setActiveView('anmac_enacom')} className="sidebar-item" style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '12.5px', color: activeView === 'anmac_enacom' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'anmac_enacom' ? 500 : 400, backgroundColor: activeView === 'anmac_enacom' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'anmac_enacom' ? '2px solid #bd2828' : '2px solid transparent' }}>
                  ANMaC / ENACOM
                </div>
                <div onClick={() => setActiveView('exportacion_equip')} className="sidebar-item" style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '12.5px', color: activeView === 'exportacion_equip' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'exportacion_equip' ? 500 : 400, backgroundColor: activeView === 'exportacion_equip' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'exportacion_equip' ? '2px solid #bd2828' : '2px solid transparent' }}>
                  Exportación equipamiento
                </div>
                <div onClick={() => setActiveView('seguros_riesgo')} className="sidebar-item" style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '12.5px', color: activeView === 'seguros_riesgo' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'seguros_riesgo' ? 500 : 400, backgroundColor: activeView === 'seguros_riesgo' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'seguros_riesgo' ? '2px solid #bd2828' : '2px solid transparent' }}>
                  Seguros alto riesgo
                </div>
              </div>
            )}
            <div onClick={() => { if (sidebarExpanded['rrhh']) { setActiveView('folder_rrhh'); setShowLanding(false); } else { toggleSidebar('rrhh'); } }} className="sidebar-item" style={{ padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', backgroundColor: isFolderActive('rrhh') ? '#e5e1d3' : 'transparent', borderLeft: isFolderActive('rrhh') ? '2px solid #bd2828' : '2px solid transparent' }}>
              <span className="sb-chevron">{sidebarExpanded['rrhh'] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}</span>
              {sidebarExpanded['rrhh'] ? <FolderOpen size={13} color="#5a544c" /> : <Folder size={13} color="#5a544c" />}
              <span className="sb-text">Recursos humanos</span>
            </div>
            {!sidebarCollapsed && sidebarExpanded['rrhh'] && (
              <div style={{ paddingLeft: '28px' }}>
                <div onClick={() => setActiveView('jtsn_apoyo')} className="sidebar-item" style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '12.5px', color: activeView === 'jtsn_apoyo' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'jtsn_apoyo' ? 500 : 400, backgroundColor: activeView === 'jtsn_apoyo' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'jtsn_apoyo' ? '2px solid #bd2828' : '2px solid transparent' }}>
                  Apoyo psicológico (JTSN)
                </div>
                <div onClick={() => setActiveView('politica_despliegue')} className="sidebar-item" style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '12.5px', color: activeView === 'politica_despliegue' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'politica_despliegue' ? 500 : 400, backgroundColor: activeView === 'politica_despliegue' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'politica_despliegue' ? '2px solid #bd2828' : '2px solid transparent' }}>
                  Política de despliegue
                </div>
                <div onClick={() => setActiveView('contactos_emergencia')} className="sidebar-item" style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '12.5px', color: activeView === 'contactos_emergencia' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'contactos_emergencia' ? 500 : 400, backgroundColor: activeView === 'contactos_emergencia' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'contactos_emergencia' ? '2px solid #bd2828' : '2px solid transparent' }}>
                  Contactos emergencia
                </div>
              </div>
            )}
            <div onClick={() => { if (sidebarExpanded['investigacion']) { setActiveView('folder_investigacion'); setShowLanding(false); } else { toggleSidebar('investigacion'); } }} className="sidebar-item" style={{ padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', backgroundColor: isFolderActive('investigacion') ? '#e5e1d3' : 'transparent', borderLeft: isFolderActive('investigacion') ? '2px solid #bd2828' : '2px solid transparent' }}>
              <span className="sb-chevron">{sidebarExpanded['investigacion'] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}</span>
              {sidebarExpanded['investigacion'] ? <FolderOpen size={13} color="#5a544c" /> : <Folder size={13} color="#5a544c" />}
              <span className="sb-text" style={{ fontWeight: isFolderActive('investigacion') ? 500 : 400 }}>Investigación</span>
            </div>
            {!sidebarCollapsed && sidebarExpanded['investigacion'] && (
              <div style={{ paddingLeft: '28px' }}>
                <div onClick={() => setActiveView('docs_filtrados')} className="sidebar-item" style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '12.5px', color: activeView === 'docs_filtrados' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'docs_filtrados' ? 500 : 400, backgroundColor: activeView === 'docs_filtrados' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'docs_filtrados' ? '2px solid #bd2828' : '2px solid transparent' }}>
                  Documentos filtrados
                </div>
                <div onClick={() => setActiveView('osint_investigacion')} className="sidebar-item" style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '12.5px', color: activeView === 'osint_investigacion' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'osint_investigacion' ? 500 : 400, backgroundColor: activeView === 'osint_investigacion' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'osint_investigacion' ? '2px solid #bd2828' : '2px solid transparent' }}>
                  Metodología OSINT
                </div>
                <div onClick={() => setActiveView('redes_internacionales')} className="sidebar-item" style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '12.5px', color: activeView === 'redes_internacionales' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'redes_internacionales' ? 500 : 400, backgroundColor: activeView === 'redes_internacionales' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'redes_internacionales' ? '2px solid #bd2828' : '2px solid transparent' }}>
                  Redes internacionales
                </div>
                <div onClick={() => setActiveView('contravigilancia')} className="sidebar-item" style={{ padding: '5px 20px', cursor: 'pointer', fontSize: '12.5px', color: activeView === 'contravigilancia' ? '#1f1f1f' : '#5a544c', fontWeight: activeView === 'contravigilancia' ? 500 : 400, backgroundColor: activeView === 'contravigilancia' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'contravigilancia' ? '2px solid #bd2828' : '2px solid transparent' }}>
                  Contra-vigilancia doméstica
                </div>
              </div>
            )}
          </div>

          <div className="micro sb-label" style={{ padding: '16px 20px 10px', color: '#8a8472' }}>
            Herramientas
          </div>
          <div onClick={() => setActiveView('analista_auto')} className="sidebar-item" style={{ padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', backgroundColor: activeView === 'analista_auto' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'analista_auto' ? '2px solid #bd2828' : '2px solid transparent', fontWeight: activeView === 'analista_auto' ? 500 : 400 }}>
            <Shield size={13} color={activeView === 'analista_auto' ? '#1f1f1f' : '#5a544c'} />
            <span className="sb-text">Analista automatizado</span>
          </div>
          <div onClick={() => setActiveView('parte_despliegue')} className="sidebar-item" style={{ padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', backgroundColor: activeView === 'parte_despliegue' ? '#e5e1d3' : 'transparent', borderLeft: activeView === 'parte_despliegue' ? '2px solid #bd2828' : '2px solid transparent', fontWeight: activeView === 'parte_despliegue' ? 500 : 400 }}>
            <Settings size={13} color={activeView === 'parte_despliegue' ? '#1f1f1f' : '#5a544c'} />
            <span className="sb-text">Parte de despliegue</span>
          </div>
        </aside>

        {/* ======================= LANDING PAGE OPERATIVA ======================= */}
        {showLanding && !activeView && (
          <div style={{ gridColumn: '2 / 4', backgroundColor: '#eceae4', padding: '32px 48px' }}>
            <div style={{ maxWidth: '860px' }}>
              <div style={{ marginBottom: '32px' }}>
                <h1 className="serif" style={{ fontSize: '28px', fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                  Buenos días, Mondini
                </h1>
                <div className="mono" style={{ fontSize: '12px', color: '#8a8472' }}>
                  {formatUTC(now)} · nodo Buenos Aires
                </div>
              </div>

              {/* Despliegue activo */}
              <div style={{ backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2', padding: '20px 24px', marginBottom: '20px' }}>
                <div className="mono micro" style={{ color: '#bd2828', marginBottom: '8px' }}>Despliegue reciente</div>
                <div className="serif" style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>ARQ-042 · Arauca / Apure · cerrado</div>
                <div className="mono" style={{ fontSize: '11.5px', color: '#5a544c', lineHeight: 1.7, marginBottom: '12px' }}>
                  13 días · fixer: Velásquez · parte archivado en OP-SEC-LOG<br/>
                  Sesión JTSN agendada: 23.04.2029 · descanso obligatorio hasta 01.05.2029
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span className="mono" style={{ fontSize: '10px', padding: '3px 8px', backgroundColor: '#e8f0de', color: '#5a6e3c', borderRadius: '2px' }}>PARTE COMPLETO</span>
                  <span className="mono" style={{ fontSize: '10px', padding: '3px 8px', backgroundColor: '#f5edd5', color: '#8a6d2b', borderRadius: '2px' }}>JTSN PENDIENTE</span>
                </div>
              </div>

              {/* Investigación doméstica previa */}
              <div style={{ backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2', padding: '20px 24px', marginBottom: '20px' }}>
                <div className="mono micro" style={{ color: '#8a8472', marginBottom: '8px' }}>Investigación doméstica · en curso</div>
                <div className="serif" style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>ROS-038 · Rosario, Santa Fe · narcotráfico y nexo estatal</div>
                <div className="mono" style={{ fontSize: '11.5px', color: '#5a544c', lineHeight: 1.7, marginBottom: '12px' }}>
                  Eje: estructuras sucesoras del clan Cantero (Los Monos) post-detención de Dylan Cantero (dic. 2025). Líneas abiertas: lavado de activos vía inmuebles y financieras, nexos con fuerzas de seguridad provinciales, operación desde penal de Marcos Paz.<br/>
                  Antecedentes: investigaciones de De los Santos / Lascano (libro "Los Monos", premio FOPEA). Amenazas documentadas a periodistas en presentación pública.<br/>
                  Protocolo activo: contra-vigilancia doméstica (OP-INV-2028-004). FOPEA activado para colega externo (02.04.2029). Sin fixer — cobertura con equipo propio + fuentes judiciales.
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span className="mono" style={{ fontSize: '10px', padding: '3px 8px', backgroundColor: '#f5edd5', color: '#8a6d2b', borderRadius: '2px' }}>T-DOM ACTIVO</span>
                  <span className="mono" style={{ fontSize: '10px', padding: '3px 8px', backgroundColor: '#f5edd5', color: '#8a6d2b', borderRadius: '2px' }}>T-PHYS · ANTECEDENTE</span>
                  <span className="mono" style={{ fontSize: '10px', padding: '3px 8px', backgroundColor: '#e8f0de', color: '#5a6e3c', borderRadius: '2px' }}>FOPEA ACTIVO</span>
                  <span className="mono" style={{ fontSize: '10px', padding: '3px 8px', backgroundColor: '#eceae4', color: '#8a8472', borderRadius: '2px' }}>OSINT EN CURSO</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* Tareas pendientes */}
                <div style={{ backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2', padding: '20px 24px' }}>
                  <div className="mono micro" style={{ color: '#8a8472', marginBottom: '12px' }}>Pendientes</div>
                  <div style={{ fontSize: '13px', lineHeight: 1.8 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ color: '#bd2828', fontSize: '10px' }}>●</span>
                      <span>Revisión obligatoria: manual RF ed. 4.2 (T-PHYS, T-DOM)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ color: '#8a6d2b', fontSize: '10px' }}>●</span>
                      <span>Sesión Dart Center / JTSN — agendar antes del 23.04</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ color: '#8a6d2b', fontSize: '10px' }}>●</span>
                      <span>Rotar contraseñas post-despliegue (72h desde retorno)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ color: '#5a544c', fontSize: '10px' }}>●</span>
                      <span>Cola de verificación: 5 items</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ color: '#5a544c', fontSize: '10px' }}>●</span>
                      <span>ROS-038: cruzar registros inmobiliarios con OSINT de financieras</span>
                    </div>
                  </div>
                </div>

                {/* Documentos actualizados */}
                <div style={{ backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2', padding: '20px 24px' }}>
                  <div className="mono micro" style={{ color: '#8a8472', marginBottom: '12px' }}>Actualizado recientemente</div>
                  {[
                    { titulo: 'Higiene RF ed. 4.2', sub: 'T-PHYS, T-DOM, sección 08', estado: 'vigente', onClick: () => { setShowLanding(false); } },
                    { titulo: 'Seguros de alto riesgo', sub: 'Nueva cobertura para fixers', estado: 'en_revision', onClick: () => { setActiveView('seguros_riesgo'); setShowLanding(false); } },
                    { titulo: 'Fuentes anónimas', sub: 'En revisión — criterio más estricto', estado: 'en_revision', onClick: () => { setActiveView('fuentes_anonimas'); setShowLanding(false); } },
                    { titulo: 'Versión fixer RF', sub: 'Revisada por Velásquez', estado: 'borrador', onClick: () => { setActiveView('version_fixer'); setShowLanding(false); } }
                  ].map((d, i) => (
                    <div key={i} onClick={d.onClick} className="sidebar-item" style={{ padding: '8px 0', borderBottom: i < 3 ? '1px solid #eceae4' : 'none', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{d.titulo}</span>
                        <span className="mono" style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '2px', letterSpacing: '0.04em', textTransform: 'uppercase',
                          backgroundColor: d.estado === 'vigente' ? '#e8f0de' : d.estado === 'en_revision' ? '#f5edd5' : '#eceae4',
                          color: d.estado === 'vigente' ? '#5a6e3c' : d.estado === 'en_revision' ? '#8a6d2b' : '#8a8472'
                        }}>{d.estado.replace('_', ' ')}</span>
                      </div>
                      <div className="mono" style={{ fontSize: '10.5px', color: '#8a8472' }}>{d.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accesos rápidos */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'Analista IA', icon: '◆', onClick: () => { setActiveView('analista_auto'); setShowLanding(false); } },
                  { label: 'Parte despliegue', icon: '◇', onClick: () => { setActiveView('parte_despliegue'); setShowLanding(false); } },
                  { label: 'Contactos emerg.', icon: '◈', onClick: () => { setActiveView('contactos_emergencia'); setShowLanding(false); } },
                  { label: 'Pipeline verif.', icon: '◉', onClick: () => { setActiveView('pipeline_verificacion'); setShowLanding(false); } }
                ].map((q, i) => (
                  <div key={i} onClick={q.onClick} className="sidebar-item" style={{ backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2', padding: '16px', cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', color: '#8a8472', marginBottom: '6px' }}>{q.icon}</div>
                    <div className="mono" style={{ fontSize: '10.5px', color: '#1f1f1f', letterSpacing: '0.02em' }}>{q.label}</div>
                  </div>
                ))}
              </div>

              {/* Noticias recientes (preview) */}
              <div style={{ backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2', padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                  <div className="mono micro" style={{ color: '#8a8472' }}>Noticias internas</div>
                  <span className="mono" style={{ fontSize: '10.5px', color: '#5a544c', cursor: 'pointer' }} onClick={() => { setActiveView('noticias'); setShowLanding(false); }}>ver todas →</span>
                </div>
                {VISTAS.noticias.items.slice(0, 3).map((n, i) => (
                  <div key={i} style={{ padding: '8px 0', borderBottom: i < 2 ? '1px solid #eceae4' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                      <span className="mono" style={{ fontSize: '10px', color: '#8a8472' }}>{n.fecha}</span>
                      <span className="mono" style={{ fontSize: '9.5px', color: '#bd2828', letterSpacing: '0.04em' }}>{n.tag}</span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 500, marginTop: '2px' }}>{n.titulo}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ======================= VISTA ACTIVA (reemplaza documento) ======================= */}
        {activeView && VISTAS[activeView] && (
          <div style={{ gridColumn: (activeView && (VISTAS[activeView]?.doc || VISTAS[activeView]?.contenido)) ? '2 / 3' : '2 / 4', backgroundColor: '#eceae4', padding: '32px 48px' }}>
            <div style={{ maxWidth: '780px' }}>
              <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: '11px', color: '#8a8472', cursor: 'pointer' }} onClick={() => { setActiveView('folder_segdigital'); setShowLanding(false); }}>
                  ← Seguridad Digital
                </span>
                {(VISTAS[activeView]?.doc || VISTAS[activeView]?.contenido || VISTAS[activeView]?.tool || VISTAS[activeView]?.form) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12.5px', color: '#5a544c' }}>
                    <div onClick={handlePDF} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                      <Download size={13} /><span>PDF</span>
                    </div>
                    <div onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                      <Printer size={13} /><span>Imprimir</span>
                    </div>
                    <div onClick={handleCopyLink} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                      <Share2 size={13} /><span>Compartir</span>
                    </div>
                  </div>
                )}
              </div>
              <h1 className="serif" style={{ fontSize: '28px', fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                {VISTAS[activeView].titulo}
              </h1>
              <div className="sans" style={{ fontSize: '14px', color: '#5a544c', marginBottom: '32px' }}>
                {VISTAS[activeView].subtitulo}
              </div>

              {/* Noticias */}
              {activeView === 'noticias' && VISTAS.noticias.items.map((item, i) => (
                <div key={i} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #d9d4c2' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px' }}>
                    <div className="mono" style={{ fontSize: '10.5px', color: '#8a8472' }}>{item.fecha}</div>
                    <div className="mono micro" style={{ color: '#bd2828' }}>{item.tag}</div>
                  </div>
                  <h3 className="serif" style={{ fontSize: '18px', fontWeight: 500, margin: '0 0 8px' }}>{item.titulo}</h3>
                  <div className="sans" style={{ fontSize: '13.5px', lineHeight: 1.55, color: '#3d3931' }}>{item.texto}</div>
                </div>
              ))}

              {/* Directorio */}
              {activeView === 'directorio' && (
                <div style={{ border: '1px solid #d9d4c2' }}>
                  <div className="mono" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 0.8fr 1.2fr', padding: '10px 14px', fontSize: '10.5px', color: '#5a544c', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: '#f0ecde' }}>
                    <div>Nombre</div><div>Rol</div><div>Base</div><div>Contacto</div>
                  </div>
                  {VISTAS.directorio.items.map((p, i) => (
                    <div key={i} className="mono" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr 0.8fr 1.2fr', padding: '12px 14px', fontSize: '12px', borderTop: '1px solid #d9d4c2', lineHeight: 1.4 }}>
                      <div style={{ fontWeight: 500 }}>{p.nombre}</div>
                      <div style={{ color: '#3d3931' }}>{p.rol}</div>
                      <div style={{ color: '#5a544c' }}>{p.base}</div>
                      <div><a href={'mailto:' + p.contacto} style={{ color: '#bd2828', fontSize: '11.5px' }}>{p.contacto}</a></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Agenda */}
              {activeView === 'agenda' && VISTAS.agenda.items.map((dia, i) => (
                <div key={i} style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #d9d4c2' }}>
                  <div className="mono" style={{ fontSize: '12px', fontWeight: 500, color: '#1f1f1f', marginBottom: '8px' }}>{dia.dia}</div>
                  {dia.entradas.map((e, j) => (
                    <div key={j} className="sans" style={{ fontSize: '13px', lineHeight: 1.5, color: '#3d3931', paddingLeft: '16px', marginBottom: '4px' }}>{e}</div>
                  ))}
                </div>
              ))}

              {/* Redacción */}
              {activeView === 'redaccion' && VISTAS.redaccion.items.map((mesa, i) => (
                <div key={i} style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2' }}>
                  <div className="serif" style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>{mesa.mesa}</div>
                  <div className="mono" style={{ fontSize: '11px', color: '#5a544c', marginBottom: '8px' }}>responsable: {mesa.responsable}</div>
                  <div className="sans" style={{ fontSize: '13px', lineHeight: 1.5, color: '#3d3931' }}>{mesa.coberturas}</div>
                </div>
              ))}

              {/* Herramientas */}
              {activeView === 'herramientas' && VISTAS.herramientas.items.map((h, i) => (
                <div key={i} onClick={() => { if (h.accion?.startsWith('sec-')) { setActiveView(null); setShowLanding(false); setTimeout(() => scrollTo(h.accion), 200); } else if (h.accion) { setActiveView(h.accion); } else { showToast(h.nombre + ' — no disponible en esta demo'); } }} style={{ marginBottom: '12px', padding: '16px', backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2', cursor: 'pointer' }} className="sidebar-item">
                  <div className="serif" style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>{h.nombre}</div>
                  <div className="sans" style={{ fontSize: '13px', lineHeight: 1.5, color: '#3d3931' }}>{h.desc}</div>
                </div>
              ))}

              {/* Soporte */}
              {activeView === 'soporte' && VISTAS.soporte.items.map((s, i) => (
                <div key={i} style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #d9d4c2' }}>
                  <div className="serif" style={{ fontSize: '16px', fontWeight: 500, marginBottom: '4px' }}>{s.area}</div>
                  <div className="mono" style={{ fontSize: '12px', color: '#bd2828', marginBottom: '6px' }}><a href={'mailto:' + s.contacto}>{s.contacto}</a></div>
                  <div className="sans" style={{ fontSize: '13px', lineHeight: 1.5, color: '#3d3931' }}>{s.desc}</div>
                </div>
              ))}

              {/* ANMaC / ENACOM — documento completo */}
              {activeView === 'anmac_enacom' && (
                <article style={{ backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2', padding: '40px 48px' }}>
                  <header style={{ borderBottom: '1px solid #d9d4c2', paddingBottom: '20px', marginBottom: '28px' }}>
                    <div className="mono" style={{ fontSize: '11px', color: '#8a8472', letterSpacing: '0.06em', marginBottom: '8px' }}>
                      INFOBAE · LEGALES · DOCUMENTO OPERATIVO · OP-LEG-2028-007
                    </div>
                    <h2 className="serif" style={{ fontSize: '26px', fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                      Requisitos ANMaC / ENACOM para material de despliegue
                    </h2>
                    <div className="serif" style={{ fontSize: '14.5px', color: '#5a544c', fontStyle: 'italic', marginBottom: '16px' }}>
                      Guía de referencia para personal que viaja con equipamiento controlado o de telecomunicaciones
                    </div>
                    <div className="mono" style={{ fontSize: '11px', color: '#5a544c', lineHeight: 1.7 }}>
                      Edición 4.0 · publicada 2028-11-20 · vigente hasta revisión<br/>
                      Responsable: l. pollastri (legales) · Revisado por: seg. digital, operaciones
                    </div>
                  </header>

                  {/* Sección 1: Equipamiento de protección balística */}
                  <section style={{ marginBottom: '32px' }}>
                    <div className="mono micro" style={{ color: '#8a8472', marginBottom: '6px' }}>01</div>
                    <h3 className="serif" style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 14px' }}>Equipamiento de protección balística</h3>
                    <div className="serif" style={{ fontSize: '14.5px', lineHeight: 1.6, color: '#1f1f1f' }}>
                      <p style={{ margin: '0 0 12px' }}>
                        Los chalecos antibalas, cascos balísticos y placas de blindaje están clasificados como <strong>materiales de usos especiales</strong> bajo la Ley Nacional de Armas y Explosivos 20.429 (1973). El Decreto Reglamentario 395/75, artículo 4, apartado 4, los equipara a "armas de guerra" a efectos regulatorios, incluyendo "cascos, chalecos, vestimentas y placas de blindaje a prueba de bala, cuando estén afectados a un uso específico de protección."
                      </p>
                      <p style={{ margin: '0 0 12px' }}>
                        La agencia reguladora es la <strong>ANMaC</strong> (Agencia Nacional de Materiales Controlados), que reemplazó al RENAR. La norma técnica vigente es la Resolución ANMaC 83/2023 y su Anexo, que regula fabricación, importación, exportación y certificación de chalecos y protecciones corporales.
                      </p>
                    </div>

                    <div style={{ backgroundColor: '#f0ecde', padding: '16px 20px', marginBottom: '16px' }}>
                      <div className="mono micro" style={{ color: '#8a8472', marginBottom: '8px' }}>Requisitos para tenencia (persona física)</div>
                      <div className="mono" style={{ fontSize: '12px', lineHeight: 1.7, color: '#1f1f1f' }}>
                        1. Ser Legítimo Usuario de Materiales de Usos Especiales o Legítimo Usuario de Armas de Fuego de uso civil condicional (CLU vigente ante ANMaC).<br/>
                        2. Presentar Formularios Leyes 23.283 y 23.412.<br/>
                        3. Copia certificada de factura de compra con marca, modelo, nivel, número de certificación Norma MA.01-A1 y número de serie.<br/>
                        4. Tiempo estimado del trámite de tenencia: aproximadamente 30 días.<br/>
                        5. El chaleco solo puede ser recibido por el titular presentando DNI, CLU y credencial de tenencia.
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#f0ecde', padding: '16px 20px', marginBottom: '16px', borderLeft: '2px solid #bd2828' }}>
                      <div className="mono micro" style={{ color: '#bd2828', marginBottom: '8px' }}>Egreso del país</div>
                      <div className="mono" style={{ fontSize: '12px', lineHeight: 1.7, color: '#1f1f1f' }}>
                        Según Disposición RENAR 883/11, Anexo II: "Podrá egresarse hasta un máximo de UN (1) chaleco antibala por año calendario."<br/>
                        Requiere: Formularios Leyes 23.283 y 23.412.<br/>
                        La regulación no prohíbe el egreso — lo regula con cap anual y trámite previo.<br/>
                        El mismo límite aplica al ingreso: máximo 1 chaleco por año calendario.
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#f0ecde', padding: '16px 20px' }}>
                      <div className="mono micro" style={{ color: '#8a8472', marginBottom: '8px' }}>Alternativa operativa: préstamo RSF</div>
                      <div className="mono" style={{ fontSize: '12px', lineHeight: 1.7, color: '#1f1f1f' }}>
                        Reporteros Sin Fronteras (RSF España) presta chalecos antibalas y cascos de forma gratuita a reporteros independientes. Fianza reembolsable: 300€. Devolución: máximo 1 mes desde el retorno.<br/>
                        Contacto: rsf-es.org/seguridad-para-periodistas<br/>
                        Esta alternativa evita el trámite de egreso ANMaC y es la opción práctica para despliegues urgentes.
                      </div>
                    </div>
                  </section>

                  {/* Sección 2: Equipamiento de telecomunicaciones */}
                  <section style={{ marginBottom: '32px' }}>
                    <div className="mono micro" style={{ color: '#8a8472', marginBottom: '6px' }}>02</div>
                    <h3 className="serif" style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 14px' }}>Equipamiento de telecomunicaciones</h3>
                    <div className="serif" style={{ fontSize: '14.5px', lineHeight: 1.6, color: '#1f1f1f' }}>
                      <p style={{ margin: '0 0 12px' }}>
                        El <strong>ENACOM</strong> (Ente Nacional de Comunicaciones) regula la homologación de equipos de telecomunicaciones en Argentina mediante el registro RAMATEL. Todo equipo que use espectro radioeléctrico y se comercialice en el país debe estar inscripto.
                      </p>
                      <p style={{ margin: '0 0 12px' }}>
                        La homologación es responsabilidad del fabricante o importador, no del usuario final. Si el equipo fue comprado en Argentina a través de un canal oficial, ya cuenta con inscripción RAMATEL vigente.
                      </p>
                    </div>

                    <div style={{ border: '1px solid #d9d4c2', marginBottom: '16px' }}>
                      <div className="mono" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.8fr', padding: '10px 14px', fontSize: '10.5px', color: '#5a544c', textTransform: 'uppercase', letterSpacing: '0.04em', backgroundColor: '#f0ecde' }}>
                        <div>Equipo</div><div>Estado ENACOM</div><div>Nota</div>
                      </div>
                      <div className="mono" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.8fr', padding: '12px 14px', fontSize: '11.5px', borderTop: '1px solid #d9d4c2', lineHeight: 1.5 }}>
                        <div style={{ fontWeight: 500 }}>Starlink Mini</div>
                        <div style={{ color: '#5a6e3c' }}>Homologado (Res. 955/2025)</div>
                        <div style={{ color: '#3d3931' }}>750.000 abonados en Argentina (dato ENACOM, MWC 2026). Compra local = sin trámite adicional.</div>
                      </div>
                      <div className="mono" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.8fr', padding: '12px 14px', fontSize: '11.5px', borderTop: '1px solid #d9d4c2', lineHeight: 1.5 }}>
                        <div style={{ fontWeight: 500 }}>Iridium Certus</div>
                        <div style={{ color: '#5a544c' }}>Verificar modelo</div>
                        <div style={{ color: '#3d3931' }}>La inscripción RAMATEL depende del importador. Verificar que el modelo específico figure en listado ENACOM antes de comprar.</div>
                      </div>
                      <div className="mono" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1.8fr', padding: '12px 14px', fontSize: '11.5px', borderTop: '1px solid #d9d4c2', lineHeight: 1.5 }}>
                        <div style={{ fontWeight: 500 }}>GL.iNet (routers viaje)</div>
                        <div style={{ color: '#5a544c' }}>Verificar modelo</div>
                        <div style={{ color: '#3d3931' }}>Equipos de viaje comprados en el exterior pueden no estar inscriptos en RAMATEL. Uso personal tolerable; consultar legales si el equipo se usa en operación profesional.</div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#f0ecde', padding: '16px 20px' }}>
                      <div className="mono micro" style={{ color: '#8a8472', marginBottom: '8px' }}>Equipos comprados en el exterior</div>
                      <div className="mono" style={{ fontSize: '12px', lineHeight: 1.7, color: '#1f1f1f' }}>
                        Si el equipo fue adquirido fuera de Argentina y no tiene homologación local, el régimen ENACOM prevé autorizaciones para uso experimental o temporario (RESOL-2023-1133-APN-ENACOM). Este equipo no puede ser comercializado en el país.<br/>
                        Recomendación operativa: al viajar con equipo comprado localmente, llevar copia de factura y especificaciones como documentación de respaldo ante aduana. No es requisito legal verificado pero reduce fricciones.
                      </div>
                    </div>
                  </section>

                  {/* Sección 3: Otros ítems del kit */}
                  <section style={{ marginBottom: '32px' }}>
                    <div className="mono micro" style={{ color: '#8a8472', marginBottom: '6px' }}>03</div>
                    <h3 className="serif" style={{ fontSize: '20px', fontWeight: 500, margin: '0 0 14px' }}>Otros ítems con posible regulación</h3>
                    <div className="serif" style={{ fontSize: '14.5px', lineHeight: 1.6, color: '#1f1f1f', marginBottom: '16px' }}>
                      Los siguientes ítems del kit de despliegue pueden tener regulación aplicable que varía según la pieza y el destino. Consultar con legales caso por caso.
                    </div>
                    <div className="mono" style={{ fontSize: '12px', lineHeight: 1.8, color: '#1f1f1f' }}>
                      <div style={{ padding: '8px 0', borderBottom: '1px dashed #d9d4c2' }}><strong>Drones:</strong> ANAC regula bajo Res. 550/2025 con tres categorías. Pilotos extranjeros pueden usar autorización de país de origen (traducida y apostillada). Doble regulación: país de origen + país de destino.</div>
                      <div style={{ padding: '8px 0', borderBottom: '1px dashed #d9d4c2' }}><strong>Kit médico (IFAK):</strong> Componentes básicos (torniquete, gasa hemostática) sin regulación específica para egreso. Medicamentos controlados (analgésicos, antibióticos restringidos) cruzan aduana como medicamentos bajo régimen ANMAT.</div>
                      <div style={{ padding: '8px 0', borderBottom: '1px dashed #d9d4c2' }}><strong>Sprays defensivos:</strong> Clasificados como materiales de usos especiales bajo la misma órbita ANMaC que los chalecos. Consultar antes de incluir en kit de viaje.</div>
                      <div style={{ padding: '8px 0' }}><strong>Efectivo en divisas:</strong> Declaración obligatoria ante AFIP/Aduana para montos superiores al tope vigente (verificar al momento del viaje — el tope cambia). Rendición de viáticos en moneda extranjera según régimen AFIP aplicable.</div>
                    </div>
                  </section>

                  <footer style={{ borderTop: '1px solid #d9d4c2', paddingTop: '16px' }}>
                    <div className="mono" style={{ fontSize: '10.5px', color: '#5a544c', lineHeight: 1.7 }}>
                      OP-LEG-2028-007 · v4.0 · USO INTERNO<br/>
                      Fuentes normativas citadas: Ley 20.429 (1973), Decreto 395/75, Resolución ANMaC 83/2023, Disposición RENAR 883/11, Resolución ENACOM 955/2025, Resolución ANAC 550/2025, RESOL-2023-1133-APN-ENACOM.<br/>
                      Última verificación de vigencia: 2029-03. Para errores o actualizaciones: <a href="mailto:legales@infobae.interna" style={{ color: '#5a544c' }}>legales@infobae.interna</a>
                    </div>
                  </footer>
                </article>
              )}

              {/* Renderizador genérico de documentos */}
              {activeView && VISTAS[activeView]?.doc && (
                <article style={{ backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2', padding: '40px 48px' }}>
                  <header style={{ borderBottom: '1px solid #d9d4c2', paddingBottom: '20px', marginBottom: '28px' }}>
                    <div className="mono" style={{ fontSize: '11px', color: '#8a8472', letterSpacing: '0.06em', marginBottom: '8px' }}>
                      {VISTAS[activeView].doc.area} · {VISTAS[activeView].doc.codigo}
                    </div>
                    <h2 className="serif" style={{ fontSize: '26px', fontWeight: 500, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                      {VISTAS[activeView].doc.titulo}
                    </h2>
                    <div className="serif" style={{ fontSize: '14.5px', color: '#5a544c', fontStyle: 'italic', marginBottom: '16px' }}>
                      {VISTAS[activeView].doc.subtitulo}
                    </div>
                    <div className="mono" style={{ fontSize: '11px', color: '#5a544c', lineHeight: 1.7 }}>
                      v{VISTAS[activeView].doc.version} · publicado {VISTAS[activeView].doc.fecha} · responsable: {VISTAS[activeView].doc.responsable}
                    </div>
                  </header>
                  {VISTAS[activeView].doc.secciones.map((sec, i) => (
                    <section key={i} style={{ marginBottom: '28px', paddingBottom: '24px', borderBottom: i < VISTAS[activeView].doc.secciones.length - 1 ? '1px dashed #d9d4c2' : 'none' }}>
                      <div className="mono micro" style={{ color: '#8a8472', marginBottom: '4px' }}>{String(i + 1).padStart(2, '0')}</div>
                      <h3 className="serif" style={{ fontSize: '18px', fontWeight: 500, margin: '0 0 12px' }}>{sec.titulo}</h3>
                      {sec.texto && <div className="serif" style={{ fontSize: '14.5px', lineHeight: 1.6, color: '#1f1f1f' }}>{sec.texto}</div>}
                      {sec.items && (
                        <div className="mono" style={{ fontSize: '12px', lineHeight: 1.7, color: '#1f1f1f' }}>
                          {sec.items.map((item, j) => (
                            <div key={j} style={{ padding: '6px 0', borderBottom: j < sec.items.length - 1 ? '1px solid #eceae4' : 'none' }}>{item}</div>
                          ))}
                        </div>
                      )}
                    </section>
                  ))}
                  <footer style={{ borderTop: '1px solid #d9d4c2', paddingTop: '16px' }}>
                    <div className="mono" style={{ fontSize: '10.5px', color: '#5a544c', lineHeight: 1.7 }}>
                      {VISTAS[activeView].doc.codigo} · v{VISTAS[activeView].doc.version} · USO INTERNO<br/>
                      {VISTAS[activeView].doc.fuentes && <>Fuentes: {VISTAS[activeView].doc.fuentes}</>}
                    </div>
                  </footer>
                </article>
              )}

              {/* Renderizador de folders */}
              {activeView && VISTAS[activeView]?.folder && (
                <div>
                  {VISTAS[activeView].docs.map((d, i) => (
                    <div key={i} onClick={() => { if (d.actual) { setActiveView(null); setShowLanding(false); } else if (d.key) { setActiveView(d.key); } else { showToast(d.titulo + ' — sin vista disponible'); }}} className="sidebar-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px 20px', borderBottom: '1px solid #d9d4c2', cursor: 'pointer', backgroundColor: '#f8f5ec' }}>
                      <FileText size={16} color="#5a544c" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div className="serif" style={{ fontSize: '15px', fontWeight: 500, marginBottom: '2px' }}>
                          {d.titulo} {d.actual && <span className="mono" style={{ fontSize: '10px', color: '#bd2828' }}>· actual</span>}
                        </div>
                        <div className="mono" style={{ fontSize: '11px', color: '#8a8472', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{d.codigo} · v{d.version}</span>
                          {d.estado && (
                            <span style={{ fontSize: '9.5px', padding: '1px 6px', borderRadius: '2px', letterSpacing: '0.04em', textTransform: 'uppercase',
                              backgroundColor: d.estado === 'vigente' ? '#e8f0de' : d.estado === 'en_revision' ? '#f5edd5' : d.estado === 'borrador' ? '#eceae4' : '#e5e1d3',
                              color: d.estado === 'vigente' ? '#5a6e3c' : d.estado === 'en_revision' ? '#8a6d2b' : '#8a8472'
                            }}>{d.estado.replace('_', ' ')}</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={14} color="#8a8472" style={{ marginTop: '4px' }} />
                    </div>
                  ))}
                </div>
              )}

              {/* Renderizador de formulario */}
              {activeView && VISTAS[activeView]?.form && (
                <div style={{ backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2', padding: '40px 48px' }}>
                  <div className="mono" style={{ fontSize: '11px', color: '#8a8472', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    INFOBAE · OPERACIONES · FORMULARIO
                  </div>
                  <h2 className="serif" style={{ fontSize: '26px', fontWeight: 500, margin: '0 0 6px' }}>{VISTAS[activeView].titulo}</h2>
                  <div className="serif" style={{ fontSize: '14.5px', color: '#5a544c', fontStyle: 'italic', marginBottom: '28px' }}>{VISTAS[activeView].subtitulo}</div>
                  {VISTAS[activeView].campos.map((campo, i) => (
                    <div key={i} style={{ marginBottom: '16px' }}>
                      <label className="mono micro" style={{ color: '#5a544c', display: 'block', marginBottom: '6px' }}>{campo.label}</label>
                      {campo.tipo === 'text' && <input type="text" placeholder={campo.placeholder} className="mono" style={{ width: '100%', padding: '10px 12px', fontSize: '12px', backgroundColor: '#f0ecde', border: '1px solid #d9d4c2', color: '#1f1f1f', fontFamily: "'JetBrains Mono', monospace", boxSizing: 'border-box' }} />}
                      {campo.tipo === 'textarea' && <textarea placeholder={campo.placeholder} className="mono" style={{ width: '100%', minHeight: '70px', padding: '10px 12px', fontSize: '12px', backgroundColor: '#f0ecde', border: '1px solid #d9d4c2', color: '#1f1f1f', fontFamily: "'JetBrains Mono', monospace", boxSizing: 'border-box', resize: 'vertical' }} />}
                      {campo.tipo === 'select' && <select className="mono" style={{ width: '100%', padding: '10px 12px', fontSize: '12px', backgroundColor: '#f0ecde', border: '1px solid #d9d4c2', color: '#1f1f1f', fontFamily: "'JetBrains Mono', monospace" }}>{campo.opciones.map((op, j) => <option key={j}>{op}</option>)}</select>}
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button onClick={() => showToast('Parte de despliegue registrado (demo)')} className="mono" style={{ padding: '10px 20px', fontSize: '11px', letterSpacing: '0.06em', backgroundColor: '#1f1f1f', color: '#f8f5ec', border: 'none', cursor: 'pointer' }}>REGISTRAR PARTE</button>
                    <button onClick={() => { setActiveView(null); setShowLanding(false); }} className="mono" style={{ padding: '10px 20px', fontSize: '11px', letterSpacing: '0.06em', backgroundColor: 'transparent', color: '#5a544c', border: '1px solid #d9d4c2', cursor: 'pointer' }}>CANCELAR</button>
                  </div>
                  <div className="mono" style={{ fontSize: '10px', color: '#8a8472', marginTop: '16px' }}>El parte se archiva en OP-SEC-LOG. Campos obligatorios: corresponsal, destino, fechas, fixer, seguro.</div>
                </div>
              )}

              {/* Renderizador de herramienta: Analista automatizado */}
              {activeView === 'analista_auto' && (
                <div style={{ backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2', padding: '40px 48px' }}>
                  <div className="mono" style={{ fontSize: '11px', color: '#8a8472', letterSpacing: '0.06em', marginBottom: '8px' }}>
                    INFOBAE · SEGURIDAD DIGITAL · HERRAMIENTA
                  </div>
                  <h2 className="serif" style={{ fontSize: '26px', fontWeight: 500, margin: '0 0 6px' }}>{VISTAS.analista_auto.titulo}</h2>
                  <div className="serif" style={{ fontSize: '14.5px', color: '#5a544c', fontStyle: 'italic', marginBottom: '20px' }}>{VISTAS.analista_auto.subtitulo}</div>
                  <div className="serif" style={{ fontSize: '14px', lineHeight: 1.6, color: '#1f1f1f', marginBottom: '12px' }}>{VISTAS.analista_auto.descripcion}</div>
                  <div style={{ padding: '12px 16px', backgroundColor: '#f0ecde', borderLeft: '2px solid #d9d4c2', marginBottom: '28px' }}>
                    <div className="mono" style={{ fontSize: '11.5px', lineHeight: 1.6, color: '#5a544c' }}>{VISTAS.analista_auto.contexto}</div>
                  </div>

                  <div style={{ backgroundColor: '#f0ecde', padding: '20px', border: '1px solid #d9d4c2' }}>
                    <label className="mono micro" style={{ color: '#5a544c', display: 'block', marginBottom: '8px' }}>
                      Describir situación o material a evaluar
                    </label>
                    <textarea
                      className="mono"
                      value={consultaInput}
                      onChange={e => setConsultaInput(e.target.value)}
                      placeholder="ej: Recibí un video por WhatsApp desde Arauca sin metadatos verificables. ¿Qué pasos de verificación aplican?"
                      style={{ width: '100%', minHeight: '90px', padding: '12px', fontSize: '12px', backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2', color: '#1f1f1f', fontFamily: "'JetBrains Mono', monospace", resize: 'vertical', boxSizing: 'border-box' }}
                    />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                      <button onClick={correrAnalisis} disabled={consultaResult.loading || !consultaInput.trim()} className="mono" style={{
                        padding: '10px 20px', fontSize: '11px', letterSpacing: '0.06em',
                        backgroundColor: consultaResult.loading ? '#8a8472' : '#1f1f1f',
                        color: '#f8f5ec', border: 'none',
                        cursor: consultaResult.loading || !consultaInput.trim() ? 'not-allowed' : 'pointer',
                        opacity: !consultaInput.trim() ? 0.5 : 1
                      }}>
                        {consultaResult.loading ? 'PROCESANDO...' : 'CORRER ANÁLISIS'}
                      </button>
                      {consultaResult.loading && <Loader2 size={14} color="#8a8472" style={{ animation: 'spin 1s linear infinite' }} />}
                    </div>

                    {consultaResult.text && (
                      <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2' }}>
                        <div className="mono micro" style={{ color: '#8a8472', marginBottom: '8px' }}>
                          respuesta del analista · {new Date().toISOString().slice(0, 16).replace('T', ' ')} · registrado en OP-SEC-LOG
                        </div>
                        <div className="serif" style={{ fontSize: '14px', lineHeight: 1.6, color: '#1f1f1f', whiteSpace: 'pre-wrap' }}>
                          {consultaResult.text}
                        </div>
                      </div>
                    )}

                    {consultaResult.error && (
                      <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#efe0d5', border: '1px solid #d9b8a0' }}>
                        <div className="mono" style={{ fontSize: '11px', color: '#bd2828' }}>
                          error de consulta · reintentar o escalar a seg. digital · {consultaResult.error.slice(0, 140)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mono" style={{ fontSize: '10px', color: '#8a8472', marginTop: '16px', lineHeight: 1.6 }}>
                    Modelo: Claude Sonnet · Contexto: OP-SEC-2029-004 ed. 4.2 · Retención de consultas: 5 años<br/>
                    Este analista también está disponible como sección 07 dentro del documento Higiene RF.
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* MAIN — DOCUMENTO */}
        <main style={{ backgroundColor: '#eceae4', padding: '32px 48px', display: (activeView || showLanding) ? 'none' : 'block' }}>

          {/* Barra de acciones del documento */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', fontSize: '12.5px', color: '#5a544c' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="mono" style={{ fontSize: '11.5px' }}>{DOC_META.codigo} · v{DOC_META.version}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={12} />
                <span>{DOC_META.clasificacion}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div onClick={handlePDF} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <Download size={13} />
                <span>PDF</span>
              </div>
              <div onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <Printer size={13} />
                <span>Imprimir</span>
              </div>
              <div onClick={handleCopyLink} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <Share2 size={13} />
                <span>Compartir</span>
              </div>
            </div>
          </div>

          {/* Documento (paper) */}
          <article id="doc-top" ref={articleRef} style={{ backgroundColor: '#f8f5ec', border: '1px solid #d9d4c2', boxShadow: '0 1px 0 rgba(26,24,22,0.04), 0 2px 8px rgba(26,24,22,0.03)', padding: '48px 56px' }}>

            {/* Document header */}
            <header style={{ borderBottom: '1px solid #d9d4c2', paddingBottom: '24px', marginBottom: '32px' }}>
              <div className="mono" style={{ fontSize: '11px', color: '#8a8472', letterSpacing: '0.06em', marginBottom: '10px' }}>
                INFOBAE · SEGURIDAD DIGITAL · MANUAL OPERATIVO · {DOC_META.codigo}
              </div>
              <h1 className="serif" style={{ fontSize: '32px', fontWeight: 500, lineHeight: 1.15, margin: '0 0 6px', letterSpacing: '-0.015em' }}>
                {DOC_META.titulo}
              </h1>
              <div className="serif" style={{ fontSize: '16px', color: '#5a544c', fontStyle: 'italic', marginBottom: '20px', fontWeight: 400 }}>
                {DOC_META.subtitulo}
              </div>
              <div className="mono" style={{ fontSize: '11px', color: '#5a544c', lineHeight: 1.7 }}>
                Edición {DOC_META.version} · publicada {DOC_META.edicionFecha} · vigente hasta {DOC_META.vigenteHasta}<br/>
                Autor: {DOC_META.autor} · Responsable: {DOC_META.responsable}<br/>
                Revisores: {DOC_META.revisores.join(', ')}<br/>
                Próxima revisión: {DOC_META.proximaRevision}
              </div>
            </header>

            {/* Table of contents */}
            <nav style={{ marginBottom: '40px', padding: '16px 20px', backgroundColor: '#f0ecde', borderLeft: '2px solid #bd2828' }}>
              <div className="mono micro" style={{ color: '#5a544c', marginBottom: '10px' }}>Contenido</div>
              <ol className="serif" style={{ margin: 0, paddingLeft: '22px', fontSize: '14px', lineHeight: 1.9, color: '#1f1f1f' }}>
                {[
                  ['sec-01', 'Alcance y vigencia'],
                  ['sec-02', 'Protocolo pre-despliegue'],
                  ['sec-03', 'Glosario de amenazas'],
                  ['sec-04', 'Cono de silencio RF'],
                  ['sec-05', 'Apéndice: dispositivos y mitigaciones'],
                  ['sec-06', 'Protocolo post-despliegue'],
                  ['sec-07', 'Consulta al analista automatizado'],
                  ['sec-08', 'Nota sobre alcance institucional y vacío ecosistémico']
                ].map(([id, label]) => (
                  <li key={id} onClick={() => scrollTo(id)} style={{ cursor: 'pointer' }}>
                    <span style={{ borderBottom: '1px solid transparent' }} onMouseEnter={e => e.target.style.borderBottomColor = '#bd2828'} onMouseLeave={e => e.target.style.borderBottomColor = 'transparent'}>
                      {label}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>

            {/* SECCIÓN 01 */}
            <section id="sec-01" style={{ marginBottom: '40px' }}>
              <div className="mono micro" style={{ color: '#8a8472', marginBottom: '6px' }}>Sección 01</div>
              <h2 className="serif" style={{ fontSize: '22px', fontWeight: 500, margin: '0 0 16px' }}>Alcance y vigencia</h2>
              <div className="serif" style={{ fontSize: '15px', lineHeight: 1.65, color: '#1f1f1f' }}>
                <p style={{ margin: '0 0 14px' }}>
                  Este manual establece el protocolo operativo de higiene electromagnética y seguridad RF para personal de Infobae desplegado en zonas de conflicto de intensidad variable, con foco inicial en la frontera colombo-venezolana (Arauca–Apure) durante el período de transición política venezolana.
                </p>
                <p style={{ margin: '0 0 14px' }}>
                  Aplica a corresponsales de staff, productores, operadores de cámara, fixers bajo contrato, y cualquier persona que opere equipamiento de transmisión asociado a un despliegue de Infobae. No sustituye los requisitos legales argentinos de comercio exterior (ANMaC, ENACOM) ni los protocolos de seguridad física.
                </p>
                <p style={{ margin: '0 0 14px', padding: '12px 16px', backgroundColor: '#f0ecde', borderLeft: '2px solid #bd2828' }}>
                  Acceso del fixer: este manual debe ser compartido en su totalidad con el fixer designado antes del despliegue. Un protocolo que protege al corresponsal pero no llega al periodista local que asume el riesgo de campo reproduce la brecha que pretende mitigar. Si el fixer no tiene acceso al documento, la cadena de seguridad está rota. Versión resumida disponible en español colombiano y español venezolano bajo código OP-SEC-2029-004-FX.
                </p>
                <p style={{ margin: '0 0 14px' }}>
                  La vigencia es de seis meses contados desde la publicación de cada edición. Las mitigaciones detalladas en el apéndice dependen de versiones de firmware específicas que pueden cambiar sin aviso. El manual se revisa trimestralmente y ante cualquier incidente operacional que lo amerite.
                </p>
                <p style={{ margin: 0 }}>
                  Nota sobre aplicabilidad doméstica: si bien el foco del manual es despliegue internacional, las secciones T-DOM y T-SPY del glosario aplican a periodistas de investigación que operan desde territorio argentino bajo condiciones de vigilancia estatal documentada. El vector doméstico no es menor ni separado — es previo al despliegue y persiste después del retorno.
                </p>
              </div>
            </section>

            {/* SECCIÓN 02 */}
            <section id="sec-02" style={{ marginBottom: '40px' }}>
              <div className="mono micro" style={{ color: '#8a8472', marginBottom: '6px' }}>Sección 02</div>
              <h2 className="serif" style={{ fontSize: '22px', fontWeight: 500, margin: '0 0 16px' }}>Protocolo pre-despliegue</h2>
              <div className="serif" style={{ fontSize: '15px', lineHeight: 1.6, color: '#1f1f1f', marginBottom: '18px' }}>
                Completar en orden antes de cada salida internacional. Tiempo mínimo recomendado: 30 días hábiles. Tiempo mínimo absoluto (salida urgente): 72 horas, con autorización del editor de turno y asunción documentada de riesgos no cubiertos por protocolo.
              </div>
              <ol className="mono" style={{ margin: 0, paddingLeft: '20px', fontSize: '12.5px', lineHeight: 1.8, color: '#1f1f1f' }}>
                {CHECKLIST_PREDESPLIEGUE.map((item, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
                ))}
              </ol>
            </section>

            {/* SECCIÓN 03 */}
            <section id="sec-03" style={{ marginBottom: '40px' }}>
              <div className="mono micro" style={{ color: '#8a8472', marginBottom: '6px' }}>Sección 03</div>
              <h2 className="serif" style={{ fontSize: '22px', fontWeight: 500, margin: '0 0 16px' }}>Glosario de amenazas</h2>
              <div className="serif" style={{ fontSize: '15px', lineHeight: 1.6, color: '#1f1f1f', marginBottom: '20px' }}>
                Las siete categorías documentadas como vigentes en zona primaria de aplicación y territorio doméstico. Actualización continua por el equipo de Seguridad Digital.
              </div>
              {THREAT_GLOSSARY.map(t => (
                <div key={t.codigo} style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px dashed #c9c1ab' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px' }}>
                    <div className="mono" style={{ fontSize: '12px', fontWeight: 500, color: '#bd2828' }}>{t.codigo}</div>
                    <h3 className="serif" style={{ fontSize: '17px', fontWeight: 500, margin: 0 }}>{t.nombre}</h3>
                  </div>
                  <div className="serif" style={{ fontSize: '14px', lineHeight: 1.6, color: '#1f1f1f', marginBottom: '10px' }}>
                    {t.cuerpo}
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <div className="mono micro" style={{ color: '#8a8472', marginBottom: '3px' }}>Implicación operacional</div>
                    <div className="serif" style={{ fontSize: '13.5px', lineHeight: 1.55, color: '#3d3931' }}>{t.vectorPractico}</div>
                  </div>
                  <div>
                    <div className="mono micro" style={{ color: '#8a8472', marginBottom: '3px' }}>Mitigación</div>
                    <div className="mono" style={{ fontSize: '12px', lineHeight: 1.6, color: '#1f1f1f' }}>{t.mitigacion}</div>
                  </div>
                </div>
              ))}
            </section>

            {/* SECCIÓN 04 — Cono de silencio RF (SVG) */}
            <section id="sec-04" style={{ marginBottom: '40px' }}>
              <div className="mono micro" style={{ color: '#8a8472', marginBottom: '6px' }}>Sección 04</div>
              <h2 className="serif" style={{ fontSize: '22px', fontWeight: 500, margin: '0 0 16px' }}>Cono de silencio RF</h2>
              <div className="serif" style={{ fontSize: '15px', lineHeight: 1.6, color: '#1f1f1f', marginBottom: '20px' }}>
                Modelo operativo para transmisiones desde zona activa. No busca invisibilidad RF — busca reducir la exposición a ventanas acotadas en el tiempo y detectables solo retroactivamente.
              </div>
              <div className="serif" style={{ fontSize: '15px', lineHeight: 1.6, color: '#1f1f1f', marginBottom: '20px', padding: '14px 18px', backgroundColor: '#f0ecde', borderLeft: '2px solid #bd2828' }}>
                El patrón de referencia en organizaciones con capacidad de despliegue madura es: llegar al punto, desplegar equipamiento, transmitir en ventana breve, desarmar y abandonar el punto. Todo el ciclo en menos de 15 minutos en zona activa. El tiempo que el equipo está desplegado y emitiendo es tiempo en que la presencia es detectable. La diferencia entre un equipo entrenado y uno que no lo es se mide en minutos de exposición RF, no en calidad de imagen.
              </div>

              <div style={{ backgroundColor: '#f0ecde', padding: '32px', border: '1px solid #d9d4c2' }}>
                <svg viewBox="0 0 600 260" style={{ width: '100%', height: 'auto' }} xmlns="http://www.w3.org/2000/svg">
                  {/* Eje temporal */}
                  <line x1="40" y1="180" x2="560" y2="180" stroke="#5a544c" strokeWidth="0.8" />
                  <polygon points="560,180 553,177 553,183" fill="#5a544c" />

                  {/* Zonas de silencio */}
                  <rect x="40" y="140" width="180" height="40" fill="#e5e1d3" stroke="#c9c1ab" strokeDasharray="3 3" strokeWidth="0.8" />
                  <rect x="340" y="140" width="220" height="40" fill="#e5e1d3" stroke="#c9c1ab" strokeDasharray="3 3" strokeWidth="0.8" />

                  {/* Ventana de transmisión */}
                  <rect x="220" y="120" width="120" height="60" fill="#bd2828" opacity="0.15" stroke="#bd2828" strokeWidth="1" />

                  {/* Cono de emisión */}
                  <polygon points="280,150 420,70 420,230" fill="#bd2828" opacity="0.08" stroke="#bd2828" strokeWidth="0.8" strokeDasharray="2 3" />

                  {/* Punto equipo */}
                  <circle cx="280" cy="150" r="5" fill="#1f1f1f" />
                  <text x="280" y="210" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#1f1f1f">TERMINAL</text>

                  {/* Labels */}
                  <text x="130" y="135" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9.5" fill="#5a544c">SILENCIO PRE (≥60 MIN)</text>
                  <text x="280" y="110" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9.5" fill="#bd2828" fontWeight="500">VENTANA ACTIVA (2–5 MIN)</text>
                  <text x="450" y="135" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="9.5" fill="#5a544c">SILENCIO POST (≥60 MIN)</text>

                  <text x="430" y="70" fontFamily="JetBrains Mono" fontSize="9" fill="#bd2828">radio de detección</text>
                  <text x="430" y="82" fontFamily="JetBrains Mono" fontSize="9" fill="#bd2828">varios km (sensor pasivo)</text>

                  {/* Eje tiempo label */}
                  <text x="560" y="198" textAnchor="end" fontFamily="JetBrains Mono" fontSize="9" fill="#5a544c">tiempo →</text>
                </svg>
              </div>

              <div className="mono" style={{ fontSize: '11.5px', color: '#5a544c', marginTop: '12px', lineHeight: 1.6 }}>
                Ventana activa: máximo 5 minutos de transmisión continua.<br/>
                Silencio pre y post: el terminal debe permanecer apagado, no solo en reposo.<br/>
                No ejecutar ventana activa durante traslado. Definir coordenadas fijas antes de activar.
              </div>
            </section>

            {/* SECCIÓN 05 */}
            <section id="sec-05" style={{ marginBottom: '40px' }}>
              <div className="mono micro" style={{ color: '#8a8472', marginBottom: '6px' }}>Sección 05</div>
              <h2 className="serif" style={{ fontSize: '22px', fontWeight: 500, margin: '0 0 16px' }}>Apéndice: dispositivos y mitigaciones</h2>
              <div className="serif" style={{ fontSize: '15px', lineHeight: 1.6, color: '#1f1f1f', marginBottom: '20px' }}>
                Listado curado de equipamiento con estado actual. Cualquier dispositivo fuera de esta lista requiere evaluación específica por Seguridad Digital antes de ser incorporado al kit de despliegue.
              </div>
              <div style={{ border: '1px solid #d9d4c2' }}>
                <div className="mono" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 2fr 1fr', backgroundColor: '#f0ecde', padding: '10px 14px', fontSize: '10.5px', letterSpacing: '0.04em', color: '#5a544c', textTransform: 'uppercase' }}>
                  <div>Modelo</div>
                  <div>Firmware requerido</div>
                  <div>Mitigación</div>
                  <div>Estado</div>
                </div>
                {DEVICES_APPENDIX.map((d, i) => (
                  <div key={i} className="mono" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 2fr 1fr', padding: '12px 14px', fontSize: '11.5px', borderTop: '1px solid #d9d4c2', lineHeight: 1.5 }}>
                    <div style={{ fontWeight: 500 }}>{d.modelo}<div style={{ fontWeight: 400, color: '#8a8472', fontSize: '10.5px', marginTop: '2px' }}>{d.fabricante}</div></div>
                    <div style={{ color: '#3d3931' }}>{d.firmware}</div>
                    <div style={{ color: '#3d3931' }}>{d.mitigacion}</div>
                    <div style={{ color: d.estado === 'no_recomendado' ? '#bd2828' : d.estado === 'aprobado' ? '#5a6e3c' : '#6b6454' }}>{d.estado.replace(/_/g, ' ')}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECCIÓN 06 */}
            <section id="sec-06" style={{ marginBottom: '40px' }}>
              <div className="mono micro" style={{ color: '#8a8472', marginBottom: '6px' }}>Sección 06</div>
              <h2 className="serif" style={{ fontSize: '22px', fontWeight: 500, margin: '0 0 16px' }}>Protocolo post-despliegue</h2>
              <div className="serif" style={{ fontSize: '15px', lineHeight: 1.6, color: '#1f1f1f', marginBottom: '18px' }}>
                Completar dentro de las 72 horas del retorno. El incumplimiento dentro de este plazo activa alerta al editor de seguridad y al responsable del despliegue.
              </div>
              <ol className="mono" style={{ margin: 0, paddingLeft: '20px', fontSize: '12.5px', lineHeight: 1.8, color: '#1f1f1f' }}>
                {POST_DESPLIEGUE.map((item, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>{item}</li>
                ))}
              </ol>
            </section>

            {/* SECCIÓN 07 — Widget Claudeception */}
            <section id="sec-07" style={{ marginBottom: '20px' }}>
              <div className="mono micro" style={{ color: '#8a8472', marginBottom: '6px' }}>Sección 07</div>
              <h2 className="serif" style={{ fontSize: '22px', fontWeight: 500, margin: '0 0 16px' }}>Consulta al analista automatizado</h2>
              <div className="serif" style={{ fontSize: '15px', lineHeight: 1.6, color: '#1f1f1f', marginBottom: '20px' }}>
                Herramienta complementaria al manual para casos no cubiertos explícitamente. Asistencia orientativa — no sustituye consulta a Seguridad Digital ni decisión editorial humana. Cada consulta se registra en OP-SEC-LOG con timestamp, usuario y contenido.
              </div>

              <div style={{ backgroundColor: '#f0ecde', padding: '20px', border: '1px solid #d9d4c2' }}>
                <label className="mono micro" style={{ color: '#5a544c', display: 'block', marginBottom: '8px' }}>
                  Describir situación o material a evaluar
                </label>
                <textarea
                  value={consultaInput}
                  onChange={e => setConsultaInput(e.target.value)}
                  placeholder="ej: recibí un video del fixer en Arauca transmitido por Starlink durante 18 minutos continuos. ¿riesgo?"
                  className="mono"
                  style={{ width: '100%', minHeight: '80px', padding: '10px 12px', fontSize: '12px', lineHeight: 1.5, backgroundColor: '#f8f5ec', border: '1px solid #c9c1ab', color: '#1f1f1f', resize: 'vertical', fontFamily: "'JetBrains Mono', monospace", boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <div className="mono" style={{ fontSize: '10.5px', color: '#8a8472' }}>
                    modelo: claude-sonnet-4 · usuario: mondini.l · consulta registrada
                  </div>
                  <button onClick={correrAnalisis} disabled={consultaResult.loading || !consultaInput.trim()} className="mono" style={{
                    padding: '8px 16px', fontSize: '11px', letterSpacing: '0.06em',
                    backgroundColor: consultaResult.loading ? '#8a8472' : '#1f1f1f',
                    color: '#f8f5ec', border: 'none',
                    cursor: consultaResult.loading || !consultaInput.trim() ? 'not-allowed' : 'pointer',
                    opacity: !consultaInput.trim() ? 0.5 : 1
                  }}>
                    {consultaResult.loading ? 'PROCESANDO...' : 'CORRER ANÁLISIS'}
                  </button>
                </div>

                {consultaResult.text && (
                  <div style={{ marginTop: '16px', padding: '14px 16px', backgroundColor: '#f8f5ec', borderLeft: '2px solid #1f1f1f' }}>
                    <div className="mono micro" style={{ color: '#8a8472', marginBottom: '8px' }}>
                      RESPUESTA · {formatUTC(now)}
                    </div>
                    <div className="mono" style={{ fontSize: '11.5px', lineHeight: 1.65, color: '#1f1f1f', whiteSpace: 'pre-wrap' }}>
                      {consultaResult.text}
                    </div>
                    <div className="mono" style={{ fontSize: '10px', color: '#8a8472', marginTop: '10px', fontStyle: 'italic' }}>
                      análisis orientativo · escalamiento humano requerido para decisión editorial
                    </div>
                  </div>
                )}

                {consultaResult.error && (
                  <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#efe0d5', border: '1px solid #d9b8a0' }}>
                    <div className="mono" style={{ fontSize: '11px', color: '#bd2828' }}>
                      error de consulta · reintentar o escalar a seg. digital · {consultaResult.error.slice(0, 140)}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* SECCIÓN 08 — Nota de encuadre */}
            <section id="sec-08" style={{ marginBottom: '20px' }}>
              <div className="mono micro" style={{ color: '#8a8472', marginBottom: '6px' }}>Sección 08</div>
              <h2 className="serif" style={{ fontSize: '22px', fontWeight: 500, margin: '0 0 16px' }}>Nota sobre alcance institucional y vacío ecosistémico</h2>
              <div className="serif" style={{ fontSize: '15px', lineHeight: 1.65, color: '#1f1f1f' }}>
                <p style={{ margin: '0 0 14px' }}>
                  Este manual es un documento interno de un medio. No es un estándar sectorial, no tiene fuerza normativa fuera de Infobae, y no fue validado por ningún organismo de seguridad para periodistas ni por ninguna institución de defensa.
                </p>
                <p style={{ margin: '0 0 14px' }}>
                  Hasta la fecha de publicación de esta edición, no existe un protocolo equivalente publicado por ACOS Alliance, CPJ, RSF, UNESCO ni ninguna organización internacional de seguridad para periodistas que aborde específicamente el vector de localización pasiva por WPS o el de detección RF de terminales satelitales. La investigación técnica que sustenta las secciones T-WPS y T-RF de este manual (Rye & Levin, IEEE S&P 2024) fue publicada en peer review hace cinco años. La traducción de ese hallazgo a doctrina operativa para civiles en zona de conflicto no fue realizada por ninguna institución durante ese período. Este manual es un intento parcial de cubrir ese vacío desde un medio individual.
                </p>
                <p style={{ margin: '0 0 14px' }}>
                  La pregunta que este documento no puede responder por sí solo es quién debería estandarizar el protocolo a escala. Un manual de un medio argentino no sustituye un marco compartido entre medios, organizaciones de formación HEFAT, proveedores de equipamiento, y agencias de seguridad digital. Ese marco no existe. Este documento funciona mientras tanto.
                </p>
                <p style={{ margin: 0, color: '#5a544c', fontStyle: 'italic' }}>
                  Si este manual llega a manos de personal de otras organizaciones y resulta útil, puede ser reproducido y adaptado sin autorización previa. Citar como: Infobae, OP-SEC-2029-004, edición 4.2. Errores y omisiones: <a href="mailto:seg.digital@infobae.interna" className="mono" style={{ fontSize: '14px' }}>seg.digital@infobae.interna</a>.
                </p>
              </div>
            </section>

            {/* Footer del documento */}
            <footer style={{ borderTop: '1px solid #d9d4c2', paddingTop: '20px', marginTop: '40px' }}>
              <div className="mono" style={{ fontSize: '10.5px', color: '#5a544c', lineHeight: 1.7 }}>
                {DOC_META.codigo} · Edición {DOC_META.version} · {DOC_META.clasificacion}<br/>
                {DOC_META.responsable} · Publicado {DOC_META.edicionFecha}<br/>
                Este documento reemplaza a la edición 4.1 tras el aviso WPS-2029-04. Para señalar errores o proponer actualización: <a href="mailto:seg.digital@infobae.interna" style={{ color: '#5a544c' }}>seg.digital@infobae.interna</a>
              </div>
            </footer>

          </article>
        </main>

        {/* RIGHT SIDEBAR — Metadata dinámico */}
        <aside style={{ backgroundColor: '#f0ede4', borderLeft: '1px solid #d9d4c2', padding: '32px 24px', fontSize: '12.5px', display: (showLanding || (activeView && !VISTAS[activeView]?.doc && !VISTAS[activeView]?.contenido)) ? 'none' : 'block' }}>

          {/* Metadatos de Higiene RF (documento principal) */}
          {!activeView && !showLanding && (<>
          <div style={{ marginBottom: '28px' }}>
            <div className="mono micro" style={{ color: '#8a8472', marginBottom: '10px' }}>Metadatos</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div>
                <div className="mono micro" style={{ color: '#8a8472', fontSize: '9.5px' }}>Código</div>
                <div className="mono" style={{ color: '#1f1f1f' }}>{DOC_META.codigo}</div>
              </div>
              <div>
                <div className="mono micro" style={{ color: '#8a8472', fontSize: '9.5px' }}>Versión</div>
                <div className="mono" style={{ color: '#1f1f1f' }}>{DOC_META.version}</div>
              </div>
              <div>
                <div className="mono micro" style={{ color: '#8a8472', fontSize: '9.5px' }}>Clasificación</div>
                <div className="mono" style={{ color: '#bd2828' }}>{DOC_META.clasificacion}</div>
              </div>
              <div>
                <div className="mono micro" style={{ color: '#8a8472', fontSize: '9.5px' }}>Responsable</div>
                <div style={{ color: '#1f1f1f' }}>{DOC_META.responsable}</div>
              </div>
              <div>
                <div className="mono micro" style={{ color: '#8a8472', fontSize: '9.5px' }}>Idiomas</div>
                <div className="mono" style={{ color: '#1f1f1f' }}>{DOC_META.idiomas.join(' · ')}</div>
              </div>
              <div>
                <div className="mono micro" style={{ color: '#8a8472', fontSize: '9.5px' }}>Próxima revisión</div>
                <div className="mono" style={{ color: '#1f1f1f' }}>{DOC_META.proximaRevision}</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <div className="mono micro" style={{ color: '#8a8472', marginBottom: '10px' }}>Actividad reciente</div>
            {ACTIVIDAD_RECIENTE.map((a, i) => (
              <div key={i} style={{ marginBottom: '10px', fontSize: '11.5px', lineHeight: 1.5 }}>
                <div className="mono" style={{ color: '#8a8472', fontSize: '10.5px' }}>{a.fecha}</div>
                <div style={{ color: '#1f1f1f' }}>
                  <span className="mono" style={{ fontWeight: 500 }}>{a.usuario}</span> {a.accion}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '28px' }}>
            <div className="mono micro" style={{ color: '#8a8472', marginBottom: '10px' }}>Documentos relacionados</div>
            {DOCUMENTOS_RELACIONADOS.map((d, i) => (
              <div key={i} style={{ marginBottom: '10px', padding: '8px 0', borderBottom: i < DOCUMENTOS_RELACIONADOS.length - 1 ? '1px solid #d9d4c2' : 'none' }}>
                <div className="doc-link" style={{ display: 'block', cursor: 'pointer' }} onClick={() => {
                  const viewMap = { 'OP-LEG-2028-007': 'anmac_enacom', 'OP-SEC-2028-011': 'comunicacion_cifrada', 'OP-SEC-2029-001': 'verificacion_c2pa', 'OP-SEC-2029-003': 'compromiso_dispositivo', 'OP-LEG-2029-002': 'exportacion_equip', 'OP-LEG-2028-014': 'seguros_riesgo', 'OP-HR-2027-012': 'jtsn_apoyo', 'OP-HR-2028-003': 'politica_despliegue', 'OP-HR-2029-001': 'contactos_emergencia', 'OP-SEC-2029-004-FX': 'version_fixer', 'EXT-FOPEA-2028': 'fopea_protocolo' };
                  if (viewMap[d.codigo]) { setActiveView(viewMap[d.codigo]); } else { handleDocNoDisponible(d.titulo); }
                }}>
                  <div className="mono" style={{ fontSize: '10.5px', color: '#8a8472', marginBottom: '2px' }}>{d.codigo} · v{d.version}</div>
                  <div style={{ fontSize: '12px', lineHeight: 1.35 }}>{d.titulo}</div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="mono micro" style={{ color: '#8a8472', marginBottom: '10px' }}>Visualizaciones</div>
            <div className="mono" style={{ fontSize: '11px', color: '#5a544c', lineHeight: 1.6 }}>
              127 vistas últimos 30 días<br/>
              14 personas en el último día<br/>
              última visita: mondini.l · hoy 09:12
            </div>
          </div>
          </>)}

          {/* Metadatos de documentos genéricos */}
          {activeView && VISTAS[activeView]?.doc && (() => {
            const d = VISTAS[activeView].doc;
            return (<>
              <div style={{ marginBottom: '28px' }}>
                <div className="mono micro" style={{ color: '#8a8472', marginBottom: '10px' }}>Metadatos</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div>
                    <div className="mono micro" style={{ color: '#8a8472', fontSize: '9.5px' }}>Código</div>
                    <div className="mono" style={{ color: '#1f1f1f' }}>{d.codigo}</div>
                  </div>
                  <div>
                    <div className="mono micro" style={{ color: '#8a8472', fontSize: '9.5px' }}>Versión</div>
                    <div className="mono" style={{ color: '#1f1f1f' }}>{d.version}</div>
                  </div>
                  <div>
                    <div className="mono micro" style={{ color: '#8a8472', fontSize: '9.5px' }}>Clasificación</div>
                    <div className="mono" style={{ color: '#bd2828' }}>USO INTERNO · distribución controlada</div>
                  </div>
                  <div>
                    <div className="mono micro" style={{ color: '#8a8472', fontSize: '9.5px' }}>Responsable</div>
                    <div style={{ color: '#1f1f1f' }}>{d.responsable}</div>
                  </div>
                  <div>
                    <div className="mono micro" style={{ color: '#8a8472', fontSize: '9.5px' }}>Publicado</div>
                    <div className="mono" style={{ color: '#1f1f1f' }}>{d.fecha}</div>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: '28px' }}>
                <div className="mono micro" style={{ color: '#8a8472', marginBottom: '10px' }}>Navegación</div>
                <div onClick={() => { setActiveView('folder_segdigital'); setShowLanding(false); }} className="doc-link" style={{ cursor: 'pointer', fontSize: '12px', padding: '6px 0', borderBottom: '1px solid #d9d4c2' }}>
                  ← Seguridad Digital
                </div>
                {d.fuentes && (
                  <div style={{ marginTop: '16px' }}>
                    <div className="mono micro" style={{ color: '#8a8472', marginBottom: '6px' }}>Fuentes</div>
                    <div className="mono" style={{ fontSize: '10.5px', color: '#5a544c', lineHeight: 1.6 }}>{d.fuentes}</div>
                  </div>
                )}
              </div>
            </>);
          })()}

          {/* Metadatos de ANMaC/ENACOM (contenido custom) */}
          {activeView === 'anmac_enacom' && (
            <div>
              <div style={{ marginBottom: '28px' }}>
                <div className="mono micro" style={{ color: '#8a8472', marginBottom: '10px' }}>Metadatos</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div>
                    <div className="mono micro" style={{ color: '#8a8472', fontSize: '9.5px' }}>Código</div>
                    <div className="mono" style={{ color: '#1f1f1f' }}>OP-LEG-2028-007</div>
                  </div>
                  <div>
                    <div className="mono micro" style={{ color: '#8a8472', fontSize: '9.5px' }}>Versión</div>
                    <div className="mono" style={{ color: '#1f1f1f' }}>4.0</div>
                  </div>
                  <div>
                    <div className="mono micro" style={{ color: '#8a8472', fontSize: '9.5px' }}>Clasificación</div>
                    <div className="mono" style={{ color: '#bd2828' }}>USO INTERNO · distribución controlada</div>
                  </div>
                  <div>
                    <div className="mono micro" style={{ color: '#8a8472', fontSize: '9.5px' }}>Responsable</div>
                    <div style={{ color: '#1f1f1f' }}>l. pollastri (legales)</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mono micro" style={{ color: '#8a8472', marginBottom: '10px' }}>Navegación</div>
                <div onClick={() => { setActiveView('folder_segdigital'); setShowLanding(false); }} className="doc-link" style={{ cursor: 'pointer', fontSize: '12px' }}>
                  ← Seguridad Digital
                </div>
              </div>
            </div>
          )}

        </aside>
      </div>

      {/* ======================= FOOTER CORPORATIVO ======================= */}
      <footer style={{ backgroundColor: '#1f1f1f', color: '#d9d4c2', padding: '20px 24px', fontSize: '11.5px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div className="sans">
            © Infobae · Interna corporativa · acceso restringido a personal autorizado
          </div>
          <div className="mono" style={{ fontSize: '10.5px', color: '#8a8472' }}>
            sesión: mondini.l · nodo BsAs · {formatUTC(now)}
          </div>
        </div>
      </footer>

      {/* ======================= TOAST ======================= */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#1f1f1f', color: '#f0ecde', padding: '10px 20px',
          fontSize: '12.5px', zIndex: 100, maxWidth: '480px',
          boxShadow: '0 4px 12px rgba(31,31,31,0.25)',
          animation: 'toastIn 0.2s ease-out'
        }} className="mono">
          {toast}
        </div>
      )}
      <style>{`@keyframes toastIn { from { opacity:0; transform: translateX(-50%) translateY(8px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`}</style>

    </div>
  );
}
