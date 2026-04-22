# BRIEF PARA CLAUDE CODE

## Qué es esto

Infobae · Bitácora es una obra de ficción interactiva que explora el
futuro cercano del periodismo de investigación y la corresponsalía
internacional argentina. El jugador opera como corresponsal de
Infobae en 2029 a través de tres escenarios: corresponsalía
internacional en zona de conflicto, investigación de narcotráfico
doméstico, y contra-vigilancia por inteligencia estatal.

Es un diegetic prototype en la tradición de Near Future Laboratory /
Superflux / Nick Foster (Future Mundane). La ficción está en que el
sistema existe, no en lo que dice. Cada protocolo, norma y
herramienta es extensión plausible de algo que existe hoy.

Pregunta madre: ¿Cómo se organizarían los periodistas de
investigación y corresponsales para entrenarse, informarse,
prepararse y trabajar — tanto en campo internacional como en
investigación doméstica?

## Principio fundacional: el objeto real y el objeto ficticio son el mismo

La herramienta que el jugador usa ES la herramienta que el personaje
usa. No hay un "juego" que simula una herramienta. Hay una
herramienta que se usa como juego. La distinción desaparece.

Esto implica:

- La app no simula estar offline — está offline.
- La app no simula correr sin servidor — corre sin servidor.
- La app no simula que el analista funciona sin internet — funciona
  sin internet.
- Cuando presentás Bitácora en un workshop, no decís "esto simula lo
  que usaría un periodista". Decís "esto es lo que usaría un
  periodista. Probalo."

## Tono general: The Conversation (1974)

Harry Caul solo en su departamento, escuchando grabaciones,
reconstruyendo la verdad con las herramientas que tiene, paranoico
de que lo estén escuchando a él. Esa es la experiencia de usar
Bitácora: aislamiento operativo, concentración, la herramienta como
compañera y como vulnerabilidad. El tono de toda la app debería
sentirse así.

## Diseño offline-first

**No llega nada. Todo está ahí.**
Cuando abrís Bitácora, no hay mensajes nuevos, no hay feed, no hay
notificaciones. Hay un estado del mundo cargado desde la última
sync. Los documentos están en tu disco. Las misiones están
pre-cargadas. El analista corre en tu máquina. Vos operás con lo
que tenés.

**La comunicación con el equipo no es en tiempo real.**
Zelaya no te "manda un mensaje". Hay un registro de comunicaciones
previas — como un log de Signal exportado, como un buzón que leíste
antes de desconectarte. La última comunicación tiene fecha y hora.
Todo lo posterior a eso es silencio.

**El sync es un acto deliberado y riesgoso.**
Conectarte para actualizar es una decisión operacional. Conectar
implica emitir. En la ficción y en la realidad. "¿Conecto para
recibir updates o mantengo silencio de radio?" Eso es una decisión
del juego, no una feature del backend.

**La tensión de estar offline ES la mecánica.**
No sabés si la situación cambió. No sabés si Fiorella te mandó una
alerta. Operás con información desactualizada y tomás decisiones
con lo que tenés. Exactamente como un corresponsal real en zona de
conflicto.

**El analista no "consulta" nada externo.**
Razona sobre los datos que tiene localmente: glosario de amenazas,
protocolos, estado del mundo cargado. Sus respuestas están
limitadas por lo que tu dispositivo sabe.

## Lo que NO decir en el artefacto

- No "IA", "inteligencia artificial", "asistente", "modelo" — el
  analista es un rol, no una herramienta. Decir "analista",
  "analista de guardia", "módulo de análisis".
- No "intranet" — es un kit operativo, bitácora de campo, sistema
  de consulta local.
- No revelar stack dentro del artefacto. Rompe diegesis.
- No "conexión", "online", "servidor" — el sistema opera en
  aislamiento. Si hay comunicación, es un acto deliberado.

## Estructura del juego: livre-jeu (gamebook)

Referentes: Soldier's Companion (DefTech/armasuisse), In 90 Days
(Humanitarian Leadership Academy), Humanitarian Worker Simulator
(ex-MSF). Marco teórico: "Game Design Fiction" (Design Friction /
Anticipation 2019), Coulton et al. "Games as Speculative Design"
(DRS 2016).

### Tres líneas = tres misiones

Cada línea es una misión con 5 objetivos. El jugador puede empezar
por cualquiera. No hay orden obligatorio. Cada línea tiene su
propio onboarding como primer objetivo.

### 5 objetivos por línea

1. **Onboarding** — te sitúa en el mundo de esa línea y te enseña
   las mecánicas relevantes operando, no leyendo.
2. **Preparación** — planificás, evaluás riesgos, armás lo que
   necesitás.
3. **Operación** — estás en el teatro, trabajando.
4. **Complicación** — algo sale mal, tus decisiones anteriores
   pesan.
5. **Resolución** — cierre de misión, debriefing como parte
   firmado.

### Arquitectura diamond-chain dentro de cada objetivo

Cada objetivo bifurca en 2-3 opciones. Las ramas divergen y
convergen en un punto obligatorio antes del siguiente objetivo.
Agencia real sin explosión combinatoria.

### Mecánicas clave

- **Consecuencias demoradas**: el error del objetivo 1 no se revela
  hasta el objetivo 3 o 4.
- **Información incompleta**: el jugador solo ve lo que el
  personaje sabría en ese momento. Opciones se desbloquean por
  acciones previas.
- **Estado mental**: fatiga, tensión, agotamiento afectan las
  opciones disponibles en objetivos posteriores. El agotamiento
  causa errores, los errores escalan.
- **Feedback instruccional solo en el debriefing**: durante la
  misión, el mundo reacciona sin decir si acertaste. El analista
  da pistas, no respuestas. El parte firmado del objetivo 5 es el
  único análisis.
- **Las herramientas son mecánicas de juego**: el checklist no es
  un formulario sino el proceso de preparar el despliegue. La
  evaluación de teatro es cómo evaluás tus opciones. El diario es
  el artefacto que el debriefing retroalimenta.
- **Documentos como armamento informacional**: el jugador los lee
  porque los necesita para tomar mejores decisiones, no porque son
  lectura asignada. Si leíste el manual RF, tenés una opción que
  otros no tienen.

## Tensión sin violencia ni gamificación

Sin puntos, medallas, leaderboards, countdown artificiales. La
tensión viene de: presión de tiempo diegética (un contacto que
cierra ventana), información incompleta (fuente de fiabilidad
desconocida), dilemas éticos sin respuesta correcta (publicar vs.
proteger fuente), y consecuencias acumuladas de decisiones
moralmente ambiguas.

## Las tres líneas: tono cinematográfico

### Línea Internacional — ARQ-042 · Arauca/Apure

Tono: The Killing Fields + Warfare

La relación periodista-fixer es el centro. Cuando el corresponsal
se va, el fixer se queda. La tensión es logística y ética: sacar
equipamiento controlado de Argentina, operar en zona de conflicto
con información parcial, y decidir cuánto riesgo delegás a alguien
que no tiene tu protección institucional.

Fog of war: información parcial, decisiones rápidas, no sabés qué
está pasando del otro lado. El objetivo 3 se siente como Warfare —
operás con lo que tenés y lo que no sabés puede comprometerte.

Premisa: post-captura de Maduro (enero 2026), transición venezolana
inestable, ELN y disidencias FARC en la zona. Mondini tiene 72
horas para prepararse y 13 días de despliegue. Fixer: Velásquez
(Signal).

### Línea Nacional Rosario — ROS-038 · Los Monos

Tono: Civil War (A24) + Spotlight

Periodistas cubriendo conflicto en su propio país. No hay
exfiltración posible porque ya estás en tu casa. La amenaza no es
un checkpoint en Arauca — es un GPS en tu auto en Buenos Aires.
Cruzar registros inmobiliarios como el equipo de Spotlight cruzaba
registros parroquiales.

Premisa: estructuras sucesoras del clan Cantero post-detención de
Dylan Cantero (dic 2025). Lavado vía inmuebles y financieras,
nexos con fuerzas de seguridad. Investigación en curso desde
Buenos Aires con fuentes judiciales en Rosario.

### Línea Nacional Inteligencia — ANA-047 · Anaconda-2

Tono: Todos los hombres del presidente + The French Connection +
The Spy

Investigación de largo aliento contra el aparato de inteligencia
estatal. El estacionamiento de Deep Throat es la reunión con la
fuente en un lugar sin cámaras. La contra-vigilancia de Popeye
Doyle pero invertida: alguien te sigue a vos. El costo ético de
The Spy: construir acceso a información con promesas que no podés
cumplir.

Premisa: legajo referenciado internamente como Anaconda-2,
operaciones de inteligencia estatal, vigilancia documentada sobre
periodistas. Material en dispositivo air-gapped, custodia con
abogado, protocolo FOPEA activo.

## Variable transversal: estado mental (A Private War)

Marie Colvin volviendo una y otra vez. El costo personal
acumulado. La sesión JTSN al final de cada misión no es trámite —
es lo que Colvin no hizo. Si el jugador la ignora, el estado
mental de Mondini se degrada para la siguiente línea.

## Personaje principal

Lucía Mondini — corresponsal ficticia compuesta de:

- Hugo Alconada Mon (investigación doméstica, vigilancia SIDE,
  legajo "Anaconda")
- Teresa Bo (despliegue internacional, Al Jazeera, HEFAT
  institucional)
- Sebastiana Barráez (diáspora venezolana, cobertura Venezuela)

## Equipo ficticio (9 personas)

Fiorella (seg digital), Villafañe (operaciones), Pollastri
(legales), Roca (verificación, Bogotá), Zelaya (editor guardia,
Madrid), Peralta (formación), Quiroga (freelancers, Lima),
Velásquez (fixer externo, Arauca).

Ninguno "manda mensajes en tiempo real". Hay registros de
comunicaciones previas. La última comunicación tiene fecha y hora.

## Interacciones implementadas

Cinco herramientas operativas que son mecánicas de juego, no menú:

1. **Evaluación de teatro** — 5 teatros, parte firmado
   determinístico
2. **Checklist pre-despliegue** — 10 items, parte de aptitud
3. **Simulador de compromiso** — 3 escenarios, drill tipo HEFAT
4. **Editor de fuentes** — registro con nivel de protección,
   protocolo
5. **Diario de campo** — registro vivo con detección de amenazas

Estas herramientas aparecen dentro de las misiones cuando la
situación las requiere, no como menú accesible desde el sidebar.

## Documentos del artefacto (21+)

Redacción (3): manual_estilo, fuentes_anonimas, verificacion_prepub

Seguridad Digital (6): comunicacion_cifrada, verificacion_c2pa,
higiene_rf (8 secciones + SVG), compromiso_dispositivo,
vigilancia_destino, version_fixer

Legales (3): anmac_enacom, exportacion_equip, seguros_riesgo

RRHH (3): jtsn_apoyo, politica_despliegue, contactos_emergencia

Investigación (4): docs_filtrados, osint_investigacion,
redes_internacionales, contravigilancia

Herramientas (4): analista, parte_despliegue,
pipeline_verificacion, opsec_log

Los documentos no se navegan desde un menú. Se encuentran cuando
la misión los necesita. Si leíste el manual RF, tenés opciones en
la misión que otros no tienen.

## Sistema de diseño

Colores: #f18b1e (naranja, SOLO logo), #bd2828 (rojo alertas),
#1f1f1f (negro), #f8f5ec (paper), #f0ede4 (sidebar), #eceae4
(base), #5a6e3c (vigente), #8a6d2b (revisión)

Tipografía: IBM Plex Sans (chrome), Fraunces (editorial),
JetBrains Mono (metadata/operaciones)

## Fuentes técnicas verificadas

- Rye & Levin, IEEE S&P 2024, arXiv:2405.14975 (WPS/Starlink)
- ANMaC: Ley 20.429, Decreto 395/75, Res. 83/2023, Disp. RENAR
  883/11
- ENACOM: Res. 955/2025 (Starlink), RAMATEL
- RSF España: rsf-es.org/seguridad-para-periodistas
- Sam Gregory, Journalism Practice 2022 (C2PA/deepfakes)
- IPTC Origin Verifier: originverify.iptc.org
- Dart Center / JTSN: dartcenter.org
- FOPEA: fopea.org
- Bellingcat Online Investigation Toolkit
- Berkeley Protocol (ONU/ACNUDH, 2022)
- ICIJ, OCCRP Aleph, GIJN
- Los Monos / Clan Cantero: InSight Crime, PFA Plan Bandera dic
  2025
- De los Santos & Lascano, "Los Monos" (premio FOPEA)

## Lo que NO está verificado

- StarLock / Excem Technologies — pendiente de verificación
- Plazos exactos de trámite de egreso ANMaC — no publicado
- Requisito ENACOM para sacar terminal satelital al exterior — no
  encontrado

## Referentes de diseño de juego

- **Soldier's Companion** (DefTech/armasuisse) — livre-jeu, 4
  objetivos por misión, "Companion" como asistente, evaluación
  retrospectiva
- **In 90 Days** (Humanitarian Leadership Academy / PRELOADED) —
  variabilidad por partida, anclaje en estándares profesionales,
  credenciales verificables
- **Humanitarian Worker Simulator** (ex-MSF) — cada mecánica
  anclada en documento real, 3 outcomes por decisión, burnout
  como KPI
- **Papers Please** — dilemas morales sin respuesta correcta,
  burocracia como tensión, consecuencias acumuladas
- **This War of Mine** — escasez, ambigüedad moral, consecuencias
  psicológicas diegéticas
- **Train (Brenda Romero)** — "the mechanic is the message",
  complicidad involuntaria como experiencia pedagógica
- **"Game Design Fiction"** (Anticipation 2019) — juego como
  diegetic prototype que mapea espacio de decisiones
- **Coulton et al. "Games as Speculative Design"** (DRS 2016) —
  juegos para explorar presentes alternativos y futuros plausibles

## Referentes cinematográficos (brief emocional)

- **The Conversation** — tono general de toda la app. Aislamiento
  operativo, la herramienta como compañera y vulnerabilidad.
- **The Killing Fields** — línea internacional. La relación
  periodista-fixer. Cuando te vas, el fixer se queda.
- **Civil War (A24)** — línea Rosario. Periodistas cubriendo
  conflicto en su propio país. No podés irte.
- **Todos los hombres del presidente** — línea inteligencia.
  Investigación de largo aliento contra el sistema.
- **Spotlight** — línea Rosario e inteligencia. Cruzar registros.
  Paciencia burocrática. La verdad está en los datos.
- **The French Connection** — contra-vigilancia. Popeye Doyle pero
  invertido: alguien te sigue a vos.
- **The Spy** — costo ético de extraer información. Acceso
  construido con promesas.
- **A Private War** — estado mental. El costo personal acumulado.
  Lo que pasa si ignorás el JTSN.
- **Warfare** — fog of war. Información parcial, decisiones
  rápidas, operar con lo que tenés.

## Skills instalados (.claude/skills/)

Custom (5): anti-slop, infobae-diegesis, fact-check,
react-intranet, heated-fiction

Externos (3): frontend-design (Anthropic), web-artifacts-builder
(Anthropic), ui-ux-pro-max (nextlevelbuilder)

## Arquitectura técnica

### Versión web actual (Vercel) — demo de portfolio

- React single component + Vite 5 + lucide-react
- Datos en JSON importados
- Analista: API Anthropic
- Pipeline de actualización semanal (lunes 9am UTC)
- URL: infobae-six.vercel.app

### Versión local (objetivo final)

- Electron o Tauri como shell
- Analista: Ollama en localhost (modelo local, sin internet)
- Datos: JSON en filesystem (~/.bitacora/data/)
- Estado de partida: JSON en filesystem (~/.bitacora/saves/)
- Sync: manual, deliberado, riesgoso (conectar = emitir)
- Sin login (es tu dispositivo, ya sos Mondini)
- Cero tráfico de red en operación normal

## Roadmap

### Fase actual — Diseñar e implementar misiones en web

- Diseñar los 5 objetivos de las tres líneas
- Implementar como JSON de nodos con opciones, flags,
  convergencias
- Integrar herramientas existentes como mecánicas dentro de
  misiones
- Implementar consecuencias demoradas y estado mental
- Implementar debriefing como parte firmado al cierre de misión
- Iterar hasta estable

### Fase siguiente — Migrar a local

- Electron o Tauri
- API Anthropic → Ollama local
- JSON importados → filesystem local
- Sync manual
- Vercel queda como demo pública

## Sobre Infobae

El medio digital más leído de Argentina, más de 100 millones de
visitas mensuales. Fundado en 2002 por Daniel Hadad. Ediciones en
Argentina, México, Colombia, Perú y España, más oficina en Miami.
Equipo de investigación activo en narcotráfico, corrupción e
inteligencia estatal.
