// Índice de documentos de Bitácora. El contenido (secciones, texto,
// fuentes) vive aparte — este archivo sólo registra metadata mínima
// para la vista de DOCS: código OP, título, versión, estado, y la
// carpeta a la que pertenecen.
//
// Estados posibles: 'vigente', 'en_revision', 'borrador'.

export const DOCUMENTOS_SECCIONES = [
  {
    key: 'redaccion',
    titulo: 'Redacción',
    subtitulo: 'Documentos operativos del área editorial',
    docs: [
      { key: 'manual_estilo', codigo: 'OP-RED-2027-001', titulo: 'Manual de estilo editorial', version: '12.3', estado: 'vigente' },
      { key: 'fuentes_anonimas', codigo: 'OP-RED-2028-003', titulo: 'Protocolo de fuentes anónimas', version: '3.0', estado: 'en_revision' },
      { key: 'verificacion_prepub', codigo: 'OP-RED-2029-005', titulo: 'Guía de verificación pre-publicación', version: '5.1', estado: 'vigente' }
    ]
  },
  {
    key: 'segdigital',
    titulo: 'Seguridad digital',
    subtitulo: 'Manuales operativos y protocolos de seguridad',
    docs: [
      { key: 'comunicacion_cifrada', codigo: 'OP-SEC-2028-011', titulo: 'Comunicación cifrada en campo', version: '3.1', estado: 'vigente' },
      { key: 'verificacion_c2pa', codigo: 'OP-SEC-2029-001', titulo: 'Verificación C2PA en redacción', version: '2.0', estado: 'en_revision' },
      { key: 'main', codigo: 'OP-SEC-2029-004', titulo: 'Higiene RF en despliegue internacional', version: '4.2', estado: 'vigente' },
      { key: 'compromiso_dispositivo', codigo: 'OP-SEC-2029-003', titulo: 'Procedimiento ante compromiso de dispositivo', version: '1.4', estado: 'vigente' },
      { key: 'vigilancia_destino', codigo: 'OP-SEC-2028-009', titulo: 'Protocolo de vigilancia en destino', version: '2.3', estado: 'vigente' },
      { key: 'version_fixer', codigo: 'OP-SEC-2029-004-FX', titulo: 'Higiene RF — versión fixer', version: '1.0', estado: 'borrador' }
    ]
  },
  {
    key: 'legales',
    titulo: 'Legales y regulatorio',
    subtitulo: 'Marco normativo y procedimientos',
    docs: [
      { key: 'anmac_enacom', codigo: 'OP-LEG-2028-007', titulo: 'Requisitos ANMaC / ENACOM', version: '4.0', estado: 'vigente' },
      { key: 'exportacion_equip', codigo: 'OP-LEG-2029-002', titulo: 'Exportación de equipamiento', version: '1.1', estado: 'vigente' },
      { key: 'seguros_riesgo', codigo: 'OP-LEG-2028-014', titulo: 'Seguros de alto riesgo', version: '2.0', estado: 'en_revision' }
    ]
  },
  {
    key: 'rrhh',
    titulo: 'Recursos humanos',
    subtitulo: 'Políticas de personal y apoyo',
    docs: [
      { key: 'jtsn_apoyo', codigo: 'OP-HR-2027-012', titulo: 'Apoyo psicológico (JTSN)', version: '2.2', estado: 'vigente' },
      { key: 'politica_despliegue', codigo: 'OP-HR-2028-003', titulo: 'Política de despliegue y descanso', version: '1.5', estado: 'vigente' },
      { key: 'contactos_emergencia', codigo: 'OP-HR-2029-001', titulo: 'Contactos de emergencia por región', version: '1.0', estado: 'vigente' },
      { key: 'onboarding', codigo: 'OP-HR-2029-002', titulo: 'Onboarding de personal', version: '1.0', estado: 'vigente' }
    ]
  },
  {
    key: 'investigacion',
    titulo: 'Investigación',
    subtitulo: 'Metodología, protocolos y herramientas para periodismo de investigación',
    docs: [
      { key: 'docs_filtrados', codigo: 'OP-INV-2028-001', titulo: 'Protocolo de documentos filtrados', version: '2.0', estado: 'vigente' },
      { key: 'osint_investigacion', codigo: 'OP-INV-2029-002', titulo: 'Metodología OSINT para investigaciones', version: '1.0', estado: 'vigente' },
      { key: 'redes_internacionales', codigo: 'OP-INV-2029-003', titulo: 'Redes internacionales (ICIJ, OCCRP, GIJN)', version: '1.0', estado: 'vigente' },
      { key: 'contravigilancia', codigo: 'OP-INV-2028-004', titulo: 'Contra-vigilancia doméstica', version: '3.0', estado: 'vigente' },
      { key: 'narco_cobertura', codigo: 'OP-INV-2029-005', titulo: 'Cobertura de narcotráfico y crimen organizado', version: '1.0', estado: 'vigente' },
      { key: 'inteligencia_investigacion', codigo: 'OP-INV-2029-007', titulo: 'Investigación sobre servicios de inteligencia', version: '1.0', estado: 'vigente' }
    ]
  },
  {
    key: 'herramientas',
    titulo: 'Herramientas',
    subtitulo: 'Flujos de verificación y bitácoras auditables',
    docs: [
      { key: 'pipeline_verificacion', codigo: 'OP-TOOL-2029-001', titulo: 'Pipeline de verificación', version: '1.0', estado: 'vigente' },
      { key: 'opsec_log', codigo: 'OP-TOOL-2029-002', titulo: 'OP-SEC-LOG: bitácora auditable', version: '1.0', estado: 'vigente' }
    ]
  },
  {
    key: 'externos',
    titulo: 'Referencias externas',
    subtitulo: 'Documentos de terceros citados por doctrina Infobae',
    docs: [
      { key: 'fopea_protocolo', codigo: 'EXT-FOPEA-2028', titulo: 'Protocolo de aviso mutuo entre colegas (FOPEA)', version: 'ext.', estado: 'vigente' }
    ]
  }
];

export function findDocMeta(key) {
  for (const s of DOCUMENTOS_SECCIONES) {
    const d = s.docs.find(x => x.key === key);
    if (d) return { ...d, seccion: s.titulo };
  }
  return null;
}

export function totalDocumentos() {
  return DOCUMENTOS_SECCIONES.reduce((n, s) => n + s.docs.length, 0);
}
