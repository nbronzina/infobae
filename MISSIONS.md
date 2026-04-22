# MISSIONS.md — Diseño narrativo del livre-jeu

Diseño de las tres misiones de Infobae · Bitácora. Cada línea es una
misión con 5 objetivos. El jugador puede empezar por cualquiera. No
hay orden obligatorio. Cada línea tiene su propio onboarding como
primer objetivo.

Este documento es el diseño narrativo — no la implementación. Los
flags, variables de estado, convergencias y consecuencias demoradas
descritas acá se traducen después a JSON de nodos con opciones y
bifurcaciones diamond-chain.

## Línea Internacional — ARQ-042 · Arauca/Apure

**Tono:** The Killing Fields + Warfare. The Conversation como base.

**Premisa:** Infobae confirmó despliegue a la frontera
colombo-venezolana. Post-captura de Maduro (enero 2026), transición
inestable. ELN y disidencias FARC en la zona. Mondini tiene 72
horas para prepararse y 13 días de despliegue. Fixer: Velásquez
(Signal only).

**Variables de estado:** `nivel_preparacion` (0-10), `estado_mental`
(estable/tenso/agotado). **Flags booleanos:** `chaleco_tramitado`,
`starlink_configurado`, `hefat_vigente`, `fixer_briefeado`,
`fuente_registrada`, `dispositivo_secundario`, `informe_osint_leido`,
`destino_expuesto`.

### Objetivo 1 — Onboarding: "Último briefing antes de desconectar"

**Situación:** Mondini abre Bitácora en su departamento de Buenos
Aires. En el registro de comunicaciones hay un último mensaje de
Zelaya (Madrid), timestamp de anoche: "Mondini, confirmado Arauca.
Salís en 72 horas. Villafañe armó el parte de despliegue. Fiorella
preparó el kit digital. Velásquez en standby." Es el último
mensaje. A partir de ahora, todo lo que sabés es lo que cargaste.

**Propósito:** el jugador aprende las herramientas operando. No hay
tutorial — hay urgencia.

**Decisión 1.1 — Tu primera acción con Bitácora abierta.**
- **(A)** Abrís la evaluación de teatro para Arauca → el sistema
  muestra amenazas activas (T-WPS, T-RF, T-SPY, T-CKP) desde los
  datos locales. Aprendés cómo funciona la herramienta.
  `+1 preparacion`.
- **(B)** Revisás el registro de comunicaciones previas con
  Velásquez → hay un intercambio de hace 3 días donde te dice que
  la zona cambió. Ganás contexto pero no datos estructurados.
  `+1 relacion_fixer`.
- **(C)** Cerrás Bitácora, mañana arrancás → flag
  `preparacion_tardia`. Se pierde una ventana de 8 horas.
  Consecuencia en objetivo 3.

**Decisión 1.2 — Encontrás una nota de Fiorella en el sistema:
"Configuración pendiente — dispositivos de despliegue."**
- **(A)** Abrís el procedimiento y seguís los pasos: dispositivo
  secundario GrapheneOS + Signal configurado → aprendés la
  herramienta, flag `dispositivo_secundario` activo.
  `+2 preparacion`.
- **(B)** Ignorás, ya conocés Signal → flag `dispositivo_unico`.
  Consecuencia demorada en objetivo 4.
- **(C)** Leés todo el procedimiento de compromiso de dispositivo
  antes de configurar → la ruta más larga y completa.
  `+2 preparacion`, `estado_mental: estable` (porque te preparaste,
  no porque te fue bien).

**Convergencia:** Bitácora muestra el checklist de pre-despliegue
con 9 items obligatorios. El sistema no te explica qué es — es un
documento que estaba ahí desde antes. Tu nivel de preparación
actual aparece como estado.

### Objetivo 2 — Preparación: "72 horas sin conexión garantizada"

**Situación:** tres días hasta el vuelo. El checklist tiene 9 items.
Pero completarlos no es tickear casillas — cada uno implica una
decisión con trade-offs. Todo lo que hacés acá lo hacés offline, con
los datos que ya cargaste y los documentos que ya tenés.

**Decisión 2.1 — El HEFAT venció.** En el registro hay una nota de
Peralta: "Expiró hace 2 meses. Refresher de 4 horas disponible o
certificado provisorio."
- **(A)** Refresher → perdés medio día pero flag `hefat_vigente`.
  Si hay incidente médico en objetivo 3 o 4, tus opciones son
  completas.
- **(B)** Certificado provisorio → ganás tiempo, flag
  `hefat_provisorio`. Opciones reducidas ante incidente médico.

**Decisión 2.2 — El trámite ANMaC del chaleco tiene demora.** Hay
una nota de Pollastri con tres opciones documentadas.
- **(A)** Acelerar con contacto de Pollastri en el organismo →
  chaleco a tiempo pero ANMaC sabe tu destino. Flag
  `destino_expuesto`. Consecuencia demorada: dato que puede
  filtrarse.
- **(B)** Esperar trámite normal → chaleco no llega. Flag
  `sin_chaleco`. Velásquez limita accesos en objetivo 3.
- **(C)** Préstamo RSF España (fianza 300€, documentado en
  sistema) → chaleco europeo sin registro ANMaC argentino. Flag
  `chaleco_rsf`. Riesgo en checkpoint de salida.

**Decisión 2.3 — En Bitácora hay un informe OSINT de Roca
(Bogotá), fecha de hace 5 días.** No es nuevo — estaba ahí.
- **(A)** Lo leés y lo cruzás con la evaluación de teatro →
  descubrís checkpoint nuevo en la ruta. Desbloquea opción en
  objetivo 3. Flag `informe_osint_leido`.
- **(B)** Lo salteás → no sabés del checkpoint. Te sorprende en
  objetivo 3.

**Convergencia:** las 72 horas terminan. Bitácora genera el parte
de aptitud según items completados: "apto", "apto con
observaciones", o "despliegue no recomendado — proceder bajo
responsabilidad del corresponsal". El `nivel_preparacion` acumulado
queda registrado. Viajás igual.

### Objetivo 3 — Operación: "Arauca, día 4. Sin sync desde el martes."

**Situación:** día 4 en Arauca. Última sync fue antes de salir de
Buenos Aires. Todo lo que sabés es lo que cargaste. Velásquez te
movió a ubicación segura. Starlink Mini operativo (si lo
configuraste). Un contacto de Velásquez ofrece acceso a campamento
de desplazados con ex-combatientes ELN que quieren hablar.

**Decisión 3.1 — ¿Cómo vas al campamento?**
- **(A)** Vehículo de Velásquez, él visible → ruta segura pero
  identificable. Si `destino_expuesto`: checkpoint te identifica.
  Si `informe_osint_leido`: sabés del checkpoint y podés evitarlo.
- **(B)** Transporte local, sin Velásquez → menos visible, sin
  protección fixer. Si no leíste informe OSINT: checkpoint sorpresa
  sin preparación.
- **(C)** Pedís que el contacto venga a vos → perdés acceso
  presencial al campamento. Historia testimonial indirecta. Seguro
  pero limitado.

**Decisión 3.2 — Un ex-combatiente te muestra un video en su
teléfono:** oficiales venezolanos en territorio colombiano. Sin
metadatos. ¿Qué hacés con el material?
- **(A)** Lo recibís en tu dispositivo → si `dispositivo_unico`:
  material sensible en teléfono personal sin compartimentar. Riesgo
  si te revisan.
- **(B)** Le pedís que lo mande por Signal al número operativo →
  compartimentado pero hay registro de comunicación.
- **(C)** Grabás desde la pantalla con tu cámara → peor calidad, no
  hay transferencia de archivo. Verificable visualmente con el
  analista después.
- **(D)** Rechazás hasta verificar identidad del contacto → perdés
  el video. El contacto puede no volver a ofrecerlo. Protocolo
  impecable.

**Decisión 3.3 — Corrés un diagnóstico local del Starlink.** El
resultado aparece en Bitácora: "BSSID no randomizado en último
update. Terminal emitiendo posición fija." Nadie te avisó. La
herramienta te lo muestra. Estás solo.
- **(A)** Apagás inmediatamente → perdés comunicación. Si
  `preparacion_tardia`: no tenés plan B.
- **(B)** Transmitís lo justo para enviar material y apagás →
  ventana de 15 minutos de emisión localizable.
- **(C)** Reubicás el Starlink 200m de tu posición → mitigación del
  manual RF sección 04. Solo funciona si leíste el documento — si
  no, la opción no aparece.

**Convergencia:** fin del día 4. `estado_mental` se calcula:
cuántas decisiones bajo presión, nivel de preparación previo, si
tuviste respaldo o improvisaste. El analista (local, offline)
genera evaluación nocturna contra glosario de amenazas. No dice si
acertaste — dice el estado operacional.

### Objetivo 4 — Complicación: "Día 9. Todo a la vez."

**Situación:** día 9 de 13. Sin sync desde Buenos Aires. Todo se
complica simultáneamente. Bitácora muestra tres alertas del sistema
local:
1. El diagnóstico RF detectó una segunda emisión no identificada
   cerca de tu posición — puede ser un dron de reconocimiento.
2. Tu registro de fuentes muestra que el contacto del campamento
   no respondió al último protocolo de verificación.
3. En tus notas de comunicaciones pre-viaje, hay una línea de
   Zelaya que no habías leído: "Si recibís indicadores de
   compromiso, activá protocolo de salida. No esperes confirmación."

`estado_mental` de Mondini depende de decisiones acumuladas. Si
`agotado`: una opción de 4.1 no está disponible.

**Decisión 4.1 — Tres alertas simultáneas. ¿Prioridad?**
- **(A)** Evaluás la emisión RF con el analista → cruce contra
  T-RF y T-PHYS. Si apagaste Starlink a tiempo en 3.3A: riesgo
  bajo. Si no: riesgo alto, recomendación de mover ubicación.
- **(B)** Intentás verificar al contacto del campamento → si lo
  registraste en el editor de fuentes: tenés canal de respaldo. Si
  no: dependés de Velásquez.
- **(C)** Activás protocolo de salida según la nota de Zelaya →
  Bitácora te muestra el procedimiento de exfiltración cargado en
  tus docs locales. Perdés días operativos. Si `estado_mental ==
  agotado`: esta opción no está disponible. No podés gestionar
  crisis agotado.

**Decisión 4.2 — Velásquez, en persona:** "Hay que moverse. Dos
opciones: volver a la ciudad o ir más adentro hacia un contacto con
información sobre los oficiales."
- **(A)** Volver → seguridad. La historia se cierra con lo que
  tenés.
- **(B)** Ir más adentro → riesgo alto. Si `sin_chaleco`: "Sin
  protección no te llevo." Si `hefat_provisorio`: Velásquez duda.
- **(C)** Pedirle a Velásquez que vaya solo → delegás el riesgo al
  fixer. Killing Fields: él no tiene tu protección institucional.
  La herramienta no te dice que está mal. Vos sabés.

**Decisión 4.3 — Antes de moverte: qué hacés con el material
acumulado.**
- **(A)** Lo guardás en el dispositivo air-gapped y lo llevás
  físicamente → seguro salvo detención en checkpoint.
- **(B)** Sincronizás — conectás por primera vez desde Buenos
  Aires para enviar material a la redacción → el material se salva
  pero emitís. Conectar = emitir. La decisión de sync es la
  decisión del juego.
- **(C)** Le das una copia a Velásquez como respaldo → distribuís
  riesgo pero le das material sensible a alguien fuera de la
  estructura editorial.

**Convergencia:** las decisiones se toman. Día 9 cierra. Lo que
hiciste define cómo termina.

### Objetivo 5 — Resolución: "Buenos Aires. Bitácora abierta."

**Situación:** día 13. Mondini en su departamento. Bitácora
abierta. Como al principio. Sola con la herramienta.

No hay decisiones. Es el debriefing.

**Parte de cierre ARQ-042 — documento firmado** (Villafañe +
Fiorella + Pollastri):

- **Ruta de decisiones:** las 12-15 decisiones visualizadas como
  camino en el árbol.
- **Flags activados:** cada flag y dónde impactó. "No tramitaste
  ANMaC → viajaste sin chaleco → Velásquez limitó acceso día 9."
- **Estado mental final:** estable/tenso/agotado, con decisiones
  que contribuyeron.
- **Material obtenido:** qué historia tenés según lo que hiciste.
  Desde "material completo verificado" hasta "fragmentos
  indirectos".
- **Protocolos aplicados vs. no aplicados:** sin juicio. Registro.
- **Sesión JTSN:** el sistema muestra descanso obligatorio y
  sesión pendiente. A Private War: si la ignorás, el estado mental
  arrastra a la siguiente línea.
