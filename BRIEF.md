BRIEF PARA CLAUDE CODE
Qué es esto
Infobae · Bitácora es una obra de ficción que explora el futuro
cercano del periodismo de investigación y la corresponsalía
internacional argentina a través del kit operativo de uno de sus
medios icónicos — Infobae — en 2029.
Es un diegetic prototype en la tradición de Near Future Laboratory /
Superflux / Nick Foster (Future Mundane). La ficción está en que el
sistema existe, no en lo que dice. Cada protocolo, norma y herramienta
es extensión plausible de algo que existe hoy. Los personajes y los
despliegues son ficticios. Las fuentes externas, las regulaciones y
los papers citados son reales.
Pregunta madre: ¿Cómo se organizarían los periodistas de investigación
y corresponsales para entrenarse, informarse, prepararse y trabajar —
tanto en campo internacional como en investigación doméstica?
Dirección actual (post-feedback Fabien Girardin, 22 abril 2026)
Tres decisiones clave
1. Local-first, no cloud.
Un periodista bajo vigilancia no debería depender de internet para
acceder a su protocolo de seguridad. La versión final es una app local
(Electron o Tauri) con modelo local (Ollama) para el analista. Sin
servidor, sin DNS, sin tráfico de red identificable. La versión Vercel
se mantiene como demo de portfolio. La versión local es el artefacto
"real".
2. No es una intranet — es un kit operativo personal.
"Intranet" implica red corporativa, servidor central, IT department.
Lo que el corresponsal necesita es algo que vive en su dispositivo y
no depende de nadie más. El formato es más cercano a Obsidian o un
field manual digital que a un portal web interno.
3. Experiencia interactiva, no archivo de documentos.
Tres líneas narrativas como tres escenarios operacionales. El usuario
elige una línea, entra a ese escenario, y opera dentro de él: toma
decisiones, completa checklists, consulta al analista, responde a
situaciones. Los documentos no se navegan — se encuentran cuando los
necesitás.
Lo que NO decir en el artefacto

No decir "IA" ni "inteligencia artificial" ni "asistente" — en 2029
nadie nombra la tecnología como novedad. El analista es un rol, no
una herramienta. Decir "analista", "analista de guardia", "módulo de
análisis", "sistema de evaluación".
No decir "intranet" — es un kit operativo, bitácora de campo,
sistema de consulta local.
No decir "modelo: Claude Sonnet" ni revelar el stack dentro del
artefacto. Rompe diegesis.

Estado actual del artefacto
Arquitectura técnica (versión web)

React single component (~2000 líneas) con datos como objetos/arrays
Vite 5 + React 18 + lucide-react
Vercel deploy con serverless functions
Contenido dinámico en 5 JSON: noticias, actividad, notificaciones,
agenda, directorio
Contenido estático en App.jsx (documentos, threat glossary,
checklist, dispositivos)
Analista: llamada real a API Anthropic (claude-sonnet-4-20250514)
con system prompt diegético
Pipeline de automatización: monitor → generación → validación →
consolidación → publicación (lunes 9am UTC)
Estado-mundo y hechos como memoria de largo plazo
Throttle por ausencia de curación (30 días → conservador,
60 días → pausa)

Landing pública (página de entrada)
Fondo negro, wordmark infobae + BITÁCORA. Estructura propuesta:

Wordmark + BITÁCORA
Pregunta madre en Georgia itálica (gancho)
Una línea de anclaje: "Una obra de ficción ambientada en 2029.
Tres escenarios. Todo el research es real."
Tres cards compactas (una por línea), cada una con: nombre,
código de teatro, frase de tensión, estado, CTA "ENTRAR →"
Footer: contexto meta-diegético + autoría

Las cards deben ser compactas — frase de tensión, no descripción.
Ejemplos de tensión:

Internacional: "Sacar equipamiento de guerra de un país para
proteger civiles en otro."
Rosario: "La amenaza es doméstica. No hay chaleco que te proteja
de un GPS."
Inteligencia: "El adversario tiene las mismas herramientas que
vos, o mejores."

Tres líneas narrativas

Internacional — ARQ-042, Arauca/Apure (COL/VEN), post-captura
Maduro ene 2026. Línea vigente, actualización automática.
Nacional Rosario — ROS-038, Los Monos / clan Cantero, nexo
narco-estatal. Congelada 2029-04-17.
Nacional Inteligencia — Anaconda-2, vigilancia estatal
argentina, zonas grises legales. Congelada 2029-04-17.

Personaje principal
Lucía Mondini — corresponsal ficticia compuesta de:

Hugo Alconada Mon (investigación doméstica, vigilancia SIDE)
Teresa Bo (despliegue internacional, Al Jazeera)
Sebastiana Barráez (diáspora venezolana)

Equipo ficticio (9 personas)
Fiorella (seg digital), Villafañe (operaciones), Pollastri (legales),
Roca (verificación, Bogotá), Zelaya (editor guardia, Madrid),
Peralta (formación), Quiroga (freelancers, Lima),
Velásquez (fixer externo, Arauca).
Documentos del artefacto (21+)
Redacción (3): manual_estilo, fuentes_anonimas, verificacion_prepub
Seguridad Digital (6): comunicacion_cifrada, verificacion_c2pa,
higiene_rf (doc principal 8 secciones + SVG), compromiso_dispositivo,
vigilancia_destino, version_fixer
Legales (3): anmac_enacom, exportacion_equip, seguros_riesgo
RRHH (3): jtsn_apoyo, politica_despliegue, contactos_emergencia
Investigación (4): docs_filtrados, osint_investigacion,
redes_internacionales, contravigilancia
Herramientas (4): analista (consulta operacional), parte_despliegue
(formulario), pipeline_verificacion, opsec_log
Sistema de diseño
Colores: #f18b1e (naranja, SOLO logo), #bd2828 (rojo alertas),
#1f1f1f (negro), #f8f5ec (paper), #f0ede4 (sidebar), #eceae4 (base),
#5a6e3c (vigente), #8a6d2b (revisión)
Tipografía: IBM Plex Sans (chrome), Fraunces (editorial),
JetBrains Mono (metadata/operaciones)
Workflow states: vigente (verde), en_revision (ámbar), borrador (gris)
Interacciones
Ya implementadas

Login con auto-fill
Analista de guardia (consulta con evaluación operacional)
Parte de despliegue (formulario interactivo)
Barra de acciones por documento (PDF, imprimir, compartir)

Planificadas

Evaluación de amenazas por teatro: elegir destino → threat
assessment personalizado con protocolos y equipamiento requerido
Checklist de pre-despliegue interactivo: items tickeables con
estado, genera parte de aptitud al completar
Simulador de compromiso de dispositivo: escenario → opciones →
evaluación contra protocolo (drill tipo HEFAT)
Editor de fuentes anónimas: registro de fuente con nivel de
protección → protocolo de comunicación sugerido
Diario de campo: bitácora personal con cruce automático contra
glosario de amenazas
Niveles operacionales: Redacción → Pre-despliegue → Despliegue →
Post-despliegue. La interfaz se adapta al estado del usuario.

Fuentes técnicas verificadas

Rye & Levin, IEEE S&P 2024, arXiv:2405.14975 (WPS/Starlink)
ANMaC: Ley 20.429, Decreto 395/75, Res. 83/2023, Disp. RENAR 883/11
ENACOM: Res. 955/2025 (Starlink), RAMATEL
RSF España: rsf-es.org/seguridad-para-periodistas
Sam Gregory, Journalism Practice 2022 (C2PA/deepfakes)
IPTC Origin Verifier: originverify.iptc.org
Dart Center / JTSN: dartcenter.org
FOPEA: fopea.org
Bellingcat Online Investigation Toolkit
Berkeley Protocol (ONU/ACNUDH, 2022)
ICIJ, OCCRP Aleph, GIJN
Los Monos / Clan Cantero: InSight Crime, PFA Plan Bandera dic 2025
De los Santos & Lascano, "Los Monos" (premio FOPEA)

Lo que NO está verificado (marcar si se usa)

StarLock / Excem Technologies — presentado en FEINDEF, pendiente
de verificación independiente
Plazos exactos de trámite de egreso ANMaC — no publicado
Requisito ENACOM para sacar terminal satelital al exterior — no
encontrado
Nombre "Anushka Jain" de Access Now — posible confabulación

Skills instalados (.claude/skills/)
Custom (5): anti-slop, infobae-diegesis, fact-check, react-intranet,
heated-fiction
Externos (3): frontend-design (Anthropic), web-artifacts-builder
(Anthropic), ui-ux-pro-max (nextlevelbuilder)
Env vars en Vercel

VITE_ANTHROPIC_API_KEY
GITHUB_TOKEN (fine-grained, Contents R/W, repo nbronzina/infobae)
GITHUB_REPO (nbronzina/infobae)
AUDIT_KEY (para /api/auditoria)

Roadmap
Fase actual — Iterar en web (Vercel)

Rediseñar landing pública con pregunta madre como gancho y
cards compactas con frases de tensión
Eliminar toda mención a "IA", "asistente", "modelo" del
artefacto visible
Implementar navegación por línea (elegir línea → entrar a
su escenario con documentos y herramientas contextuales)
Implementar niveles operacionales (Redacción → Pre-despliegue →
Despliegue → Post-despliegue)
Agregar interacciones: evaluación de amenazas, checklist,
simulador de compromiso, editor de fuentes, diario de campo
Iterar hasta estable

Fase siguiente — Migrar a local

Empaquetar en Electron o Tauri
Reemplazar fetch a Anthropic por llamada a Ollama (modelo local)
JSON en filesystem local en vez de imports
Sync opcional por USB/Signal/mesh para actualizar línea vigente
La versión Vercel queda como demo pública de portfolio

Sobre Infobae (contexto para quien no lo conoce)
Infobae es el medio digital más leído de Argentina, con más de 100
millones de visitas mensuales. Fundado en 2002 por Daniel Hadad.
Ediciones con redacción local en Argentina, México, Colombia, Perú y
España, más oficina en Miami. Su equipo de investigación cubre
narcotráfico, corrupción e inteligencia estatal. Si una redacción
argentina tuviera que montar un sistema operativo para corresponsales
e investigación, Infobae es de los pocos que tendrían la escala y la
necesidad real de hacerlo.
