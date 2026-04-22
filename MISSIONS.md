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

## Línea Nacional Rosario — ROS-038 · Los Monos

**Tono:** Civil War (A24) + Spotlight. La amenaza está en tu ciudad.

**Premisa:** estructuras sucesoras del clan Cantero post-detención
de Dylan Cantero (dic 2025). Lavado de activos vía inmuebles y
financieras, nexos con fuerzas de seguridad provinciales. Mondini
investiga desde Buenos Aires con fuentes judiciales en Rosario. No
hay despliegue, no hay zona de conflicto delimitada. La zona de
conflicto es todo.

**Variables de estado:** `profundidad_investigacion` (0-10),
`estado_mental` (hereda de línea anterior si se jugó). **Flags:**
`fuente_judicial_activa`, `osint_registros_cruzados`,
`fopea_activado`, `contra_vigilancia_activa`,
`patron_seguimiento_detectado`, `material_custodiado`,
`colega_protegido`.

### Objetivo 1 — Onboarding: "Lunes. Redacción. Bitácora abierta."

**Situación:** Mondini abre Bitácora en la redacción de Buenos
Aires. Es una mañana normal de trabajo. En el registro de
comunicaciones hay un intercambio viejo con Roca (Bogotá) sobre
cruces OSINT de registros inmobiliarios en Rosario. Hay una nota de
Pollastri sobre el marco legal de publicación de datos de personas
jurídicas. Y hay una entrada en el diario de campo que Mondini
escribió hace dos semanas: "Colega de Rosario mencionó que lo están
siguiendo. No quiso dar detalles por teléfono."

No hay urgencia. No hay 72 horas. Hay un escritorio, una
computadora, y una investigación que avanza despacio.

**Decisión 1.1 — ¿Por dónde empezás hoy?**
- **(A)** Abrís la herramienta OSINT y cruzás registros de
  propiedad con la lista de personas vinculadas al clan Cantero →
  aprendés cómo funciona el cruce de datos. `+1 profundidad`. El
  sistema te muestra coincidencias. Spotlight: cruzar registros
  como cruzar listas parroquiales.
- **(B)** Revisás la entrada vieja del diario sobre el colega
  seguido → el sistema te sugiere activar protocolo FOPEA.
  Aprendés cómo funciona el editor de fuentes (para registrar al
  colega como fuente de riesgo).
- **(C)** Leés el documento de contra-vigilancia doméstica →
  aprendés el protocolo. No pasa nada visible. Pero la lectura
  desbloquea opciones en objetivo 3 y 4.

**Decisión 1.2 — Pollastri te dejó una nota legal:** "Los registros
de propiedad de sociedades son públicos. Los de personas físicas,
no sin orden judicial."
- **(A)** Te limitás a registros de sociedades → legal, más lento,
  menos info.
- **(B)** Le pedís a la fuente judicial que consiga los de personas
  físicas → más info, dependés de la fuente, riesgo de exposición.
- **(C)** Buscás los registros por vía OSINT sin pedir formalmente
  → zona gris legal. Pollastri no lo aprueba. Flag
  `metodo_cuestionable`.

**Convergencia:** fin del lunes. Bitácora registra el estado de la
investigación. No hay parte de aptitud — hay un estado de avance.
La investigación doméstica no tiene fecha de cierre.

### Objetivo 2 — Preparación: "La fuente judicial"

**Situación:** tu fuente en Rosario es un funcionario judicial que
tiene acceso a expedientes del caso Cantero. Nunca se vieron en
persona. Todo fue por Signal. Ahora quiere reunirse presencialmente
porque tiene material que no puede enviar digitalmente. Querés ir a
Rosario.

**Decisión 2.1 — ¿Cómo te preparás para el viaje a Rosario?**
- **(A)** Evaluación de teatro para Rosario → el sistema te muestra
  amenazas: T-DOM (vigilancia doméstica), T-PHYS (seguimiento
  físico, antecedente de amenazas a periodistas De los Santos y
  Lascano). No es Arauca pero el threat assessment existe.
- **(B)** Activás protocolo FOPEA de aviso mutuo para el viaje →
  flag `fopea_activado`. Red de protección activa. Si algo pasa, 3
  contactos FOPEA saben dónde estás.
- **(C)** Viajás sin avisar a nadie más que a la redacción →
  operás sola. Sin red de protección externa.

**Decisión 2.2 — ¿Cómo vas a la reunión con la fuente?**
- **(A)** En tu auto personal → si leíste contra-vigilancia: sabés
  que tenés que revisar el vehículo. Si no leíste: no sabés y el
  flag `vehiculo_no_revisado` se activa.
- **(B)** En transporte público → menos rastreable pero no
  controlás el entorno de la reunión.
- **(C)** Le pedís a la fuente que viaje a Buenos Aires → invertís
  el riesgo. Él queda expuesto viajando. Vos quedás en territorio
  conocido.

**Decisión 2.3 — La fuente te entrega documentos físicos.**
Expedientes judiciales con nombres de policías vinculados al clan.
- **(A)** Los escaneás con el teléfono en el momento → tenés copia
  digital pero si te revisan el teléfono, el material está ahí.
- **(B)** Los llevás físicamente y los escaneás en la redacción →
  más seguro pero viajás con material sensible.
- **(C)** Los leés, tomás notas a mano, y le devolvés los
  originales → no tenés el material, tenés tus notas. La fuente
  conserva la custodia.

**Convergencia:** volvés a Buenos Aires con (o sin) el material.
La investigación avanzó (o no). La fuente está registrada (o no).

### Objetivo 3 — Operación: "Cruces. Semana 3."

**Situación:** tres semanas de investigación. Bitácora tiene
acumulado: registros de propiedad cruzados, material de la fuente
judicial, entradas en el diario de campo. Hoy el cruce OSINT arroja
una coincidencia que no esperabas: una financiera vinculada a los
Cantero tiene domicilio en un edificio que pertenece a un oficial
de policía provincial activo.

**Decisión 3.1 — Tenés el dato. ¿Qué hacés?**
- **(A)** Verificás con una segunda fuente antes de avanzar →
  protocolo correcto. Tardás, pero el dato se sostiene (o no).
  `+2 profundidad`.
- **(B)** Publicás la coincidencia como nota con la evidencia de
  registros públicos → impacto inmediato, pero si hay error,
  quedás expuesta. Y si es correcto, el oficial sabe que lo
  investigás.
- **(C)** Se lo pasás a la fuente judicial para que lo cruce con
  el expediente → dependés de la fuente. Si la fuente está
  comprometida (no lo sabés todavía), acabás de revelar tu línea de
  investigación.

**Decisión 3.2 — El colega de Rosario** (el que mencionó que lo
seguían) te escribe por Signal: "Necesito hablar. No por teléfono."
- **(A)** Lo registrás como fuente en Bitácora y coordinás reunión
  con protocolo → flag `colega_protegido`. Aprendés que el editor
  de fuentes no es solo para informantes — es para proteger
  colegas.
- **(B)** Lo llamás por teléfono a pesar de su pedido → violás su
  pedido de seguridad. Si `contra_vigilancia_activa`: sabés que no
  debés. Si no leíste el doc: la opción parece razonable.
- **(C)** Le respondés por Signal: "Vení a Buenos Aires" → lo
  sacás de Rosario pero le pedís que se mueva.

**Decisión 3.3 — Al salir de la redacción, notás un auto
estacionado que viste ayer en el mismo lugar.** ¿Lo registrás?
- **(A)** Abrís el diario de campo y registrás: ubicación, hora,
  descripción del vehículo, tipo "anomalía" → el sistema cruza
  contra entradas anteriores del diario. Si hay patrón (3+ entradas
  con T-PHYS en 7 días), genera alerta. Flag
  `patron_seguimiento_detectado`.
- **(B)** Lo ignorás → no queda registro. Si hay seguimiento real,
  no tenés documentación.
- **(C)** Cambiás la ruta al día siguiente → medida del protocolo
  de contra-vigilancia. Funciona como mitigación pero sin registro
  no podés demostrar el patrón.

**Convergencia:** fin de semana 3. La investigación tiene
profundidad X. El diario tiene (o no) un patrón documentado. El
colega está (o no) protegido. Y vos sabés (o no) si te están
siguiendo.

### Objetivo 4 — Complicación: "El patrón se confirma."

**Situación:** Bitácora muestra el resultado del cruce automático
del diario: 4 entradas en 10 días con indicadores T-PHYS y T-DOM.
El banner rojo dice: "Se sugiere revisión del protocolo de
contra-vigilancia doméstica (OP-INV-2028-004)." Al mismo tiempo, la
fuente judicial dejó de responder hace 48 horas. Y el colega de
Rosario te cuenta (si lo protegiste) que recibió una amenaza
directa.

French Connection invertido: alguien te sigue. No sabés quién.

**Decisión 4.1 — ¿Prioridad?**
- **(A)** Activar protocolo FOPEA completo: documentar ante FOPEA
  y CPJ, comunicar a dirección editorial, considerar publicación
  coordinada con otro medio como medida de protección → la
  visibilidad protege. Pero la investigación se expone antes de
  tiempo.
- **(B)** Intentar contactar a la fuente judicial por canal de
  respaldo → si la registraste: tenés respaldo. Si no: dependés de
  Signal y la fuente no responde.
- **(C)** Intensificar contra-vigilancia sin escalar → seguís
  investigando pero bajo vigilancia confirmada. Si `estado_mental
  == agotado`: opciones reducidas.

**Decisión 4.2 — Pollastri te contacta** (registro en Bitácora, no
en tiempo real): "Si publicamos, necesito saber qué material tenés
custodiado y dónde."
- **(A)** Todo digital en dispositivo air-gapped en la redacción →
  seguro pero accesible si hay allanamiento con orden judicial.
- **(B)** Copia con abogado personal bajo secreto profesional →
  máxima protección legal, Alconada Mon lo recomendaría. Flag
  `material_custodiado`.
- **(C)** No tenés copia de respaldo → si algo le pasa a tu
  dispositivo, perdés todo.

**Decisión 4.3 — El colega de Rosario:** "Si publicás, yo quedo
expuesto. Si no publicás, todo esto fue al pedo." Dilema ético sin
respuesta correcta. The Spy: el costo de extraer información de
alguien que confió en vos.
- **(A)** Publicar con su nombre oculto pero con datos que lo
  hacen identificable → protección nominal, exposición real.
- **(B)** Publicar sin ninguna referencia a él → la nota pierde
  peso probatorio.
- **(C)** Esperar y publicar solo cuando él esté fuera de Rosario
  → la ventana de impacto se cierra. La historia envejece.

**Convergencia:** las decisiones están tomadas. La investigación
llega a su punto de publicación o de pausa.

### Objetivo 5 — Resolución: "Bitácora abierta. Lo mismo de siempre."

No hay decisiones. Debriefing.

**Parte de cierre ROS-038 — firmado** (dirección editorial +
Pollastri + Fiorella):

- **Ruta de decisiones:** las 12-15 decisiones en el árbol.
- **Profundidad de investigación:** qué obtuviste según tus
  decisiones.
- **Estado de la fuente judicial:** activa, comprometida, o
  perdida.
- **Estado del colega:** protegido, expuesto, o amenazado.
- **Patrón de vigilancia:** documentado (con entradas del diario)
  o no documentado.
- **Material publicable:** desde "investigación completa con
  custodia legal" hasta "indicios sin verificar".
- **Sesión JTSN:** estado mental. Civil War: no podés irte de tu
  propia ciudad.

## Línea Nacional Inteligencia — ANA-047 · Anaconda-2

**Tono:** Todos los hombres del presidente + The French Connection
+ The Spy. The Conversation como atmósfera permanente.

**Premisa:** investigación sobre operaciones de inteligencia
estatal argentina. Legajo referenciado internamente como
Anaconda-2: vigilancia documentada sobre periodistas, operaciones
de recolección de información, zonas grises legales. La SIDE (o su
derivado actual) es el objeto de investigación y al mismo tiempo el
adversario con capacidad técnica de grado militar. Mondini
investiga lo que investiga Alconada Mon. La diferencia: en la
ficción, el sistema que la investiga sabe que ella los investiga.

**Variables de estado:** `nivel_acceso` (0-10), `estado_mental`
(hereda de líneas anteriores si se jugaron). **Flags:**
`fuente_inteligencia_activa`, `material_airgapped`,
`custodia_legal_activa`, `intermediario_establecido`,
`dispositivo_limpio`, `patron_digital_detectado`,
`publicacion_coordinada`.

### Objetivo 1 — Onboarding: "El legajo que no deberías tener."

**Situación:** Mondini abre Bitácora. En el diario de campo hay
una entrada vieja, de hace meses: "Fuente no identificada dejó
sobre con documentos en el buzón de la redacción. Sin remitente.
Contenido: hojas impresas con lo que parecen reportes internos de
monitoreo de periodistas. Código de referencia en el margen:
ANC-2." Los documentos físicos están en un cajón. Nadie en la
redacción sabe excepto dirección editorial.

The Conversation: tenés material que no pediste, no sabés quién te
lo dio ni por qué, y el acto de investigarlo puede ser el acto que
te expone.

**Decisión 1.1 — Los documentos están en tu cajón. ¿Qué hacés
primero?**
- **(A)** Abrís Bitácora y leés el protocolo de documentos
  filtrados (OP-INV-2028-001) → aprendés la herramienta: cadena de
  custodia, hash SHA-256, verificación de autenticidad.
  `+1 nivel_acceso`.
- **(B)** Escaneás los documentos con tu teléfono personal para
  tener copia digital → tenés copia pero en dispositivo conectado
  a red. Flag `material_en_dispositivo_personal`.
- **(C)** Le llevás los documentos a Pollastri (legales)
  directamente → Pollastri te dice que primero hay que documentar
  la recepción. Te manda de vuelta al protocolo. Ruta más larga
  pero con respaldo legal desde el inicio.

**Decisión 1.2 — Los documentos mencionan nombres de periodistas
bajo monitoreo. Uno es un colega de la redacción. ¿Se lo decís?**
- **(A)** Sí, en persona, fuera de la redacción → lo alertás pero
  ampliás el círculo de conocimiento. Si el colega habla, la
  investigación se compromete.
- **(B)** No, todavía no — primero verificás autenticidad →
  protocolo correcto. El colega sigue sin saber.
- **(C)** Se lo decís a dirección editorial y dejás que ellos
  decidan → delegás la decisión ética. La herramienta no te dice
  qué hacer.

**Convergencia:** los documentos están (o no) en cadena de
custodia correcta. Bitácora tiene (o no) registro de la recepción.
El colega sabe (o no).

### Objetivo 2 — Preparación: "Verificar sin exponerse"

**Situación:** hay que verificar si los documentos son auténticos
o plantados. Un documento filtrado de inteligencia puede ser
genuino — o puede ser una operación para identificar quién lo
recibe y qué hace con él. The Spy: cada paso de verificación es un
paso de exposición.

**Decisión 2.1 — ¿Cómo verificás la autenticidad?**
- **(A)** Cruzás metadata de los documentos con registros públicos
  (fechas, formato, numeración) → OSINT puro, sin contactar a
  nadie. Lento, parcial, pero seguro.
- **(B)** Contactás a un ex-funcionario de inteligencia que
  conocés como fuente → verificación rápida pero le revelás que
  tenés el material. Si él está comprometido, acabás de
  confirmarle a la SIDE que los documentos llegaron.
- **(C)** Le pedís al analista de guardia que evalúe los
  documentos contra patrones conocidos → el analista opera con lo
  que tiene localmente. Puede detectar inconsistencias formales
  pero no puede verificar contenido clasificado.

**Decisión 2.2 — Pollastri te dice:** "Si esto es real, necesitás
custodia legal desde ahora. Recomiendo intermediario — un abogado
externo con secreto profesional."
- **(A)** Establecés intermediario legal → flag
  `intermediario_establecido`, `custodia_legal_activa`. El material
  pasa a estar bajo doble protección: secreto profesional del
  abogado + protección de fuente periodística.
- **(B)** Mantenés custodia interna en la redacción → más
  accesible pero menos protegido ante requerimiento judicial.
- **(C)** No establecés custodia formal todavía → el material está
  en tu cajón. Si hay allanamiento, no hay protección.

**Decisión 2.3 — Necesitás un dispositivo limpio para trabajar el
material digital.** Fiorella te ofrece configurar un air-gapped.
- **(A)** Aceptás → dispositivo sin conexión a red, dedicado a
  Anaconda-2. Flag `dispositivo_limpio`. Todo el material vive ahí.
- **(B)** Usás tu dispositivo secundario (el de despliegues) → no
  es air-gapped pero está configurado con GrapheneOS. Riesgo
  intermedio.
- **(C)** Usás tu computadora de la redacción → conectada a red
  corporativa. Si la SIDE tiene acceso a la red (probable), el
  material está expuesto.

**Convergencia:** tenés (o no) custodia legal, dispositivo limpio,
y una evaluación de autenticidad. La investigación puede avanzar o
está comprometida desde el origen.

### Objetivo 3 — Operación: "La fuente que sabe demasiado"

**Situación:** la verificación sugiere que los documentos son
auténticos. Ahora necesitás una fuente interna que confirme y
amplíe. A través de un contacto indirecto, alguien dentro del
aparato de inteligencia acepta reunirse. Una sola vez, en un lugar
sin cámaras, sin dispositivos.

Deep Throat en el estacionamiento. Todos los hombres del
presidente.

**Decisión 3.1 — Preparación para la reunión.**
- **(A)** Dejás todos tus dispositivos en la redacción, incluyendo
  Bitácora → vas sin herramientas. Todo lo que recordés de la
  reunión lo registrás después.
- **(B)** Llevás un grabador analógico oculto → tenés registro
  pero violás la condición de la fuente.
- **(C)** Llevás solo un cuaderno → registro manual. Tenés notas
  pero no audio.

**Decisión 3.2 — La fuente te confirma que Anaconda-2 es un
programa activo de monitoreo de periodistas.** Te da un nombre: un
oficial que coordina la operación. Pero te pide algo a cambio:
quiere saber qué tenés vos. The Spy: el intercambio de información
como moneda.
- **(A)** Le mostrás una parte de lo que tenés (sin revelar la
  fuente original de los documentos) → intercambio parcial. La
  fuente te da más contexto. Pero ahora ella sabe qué sabés.
- **(B)** No le mostrás nada — solo escuchás → la fuente se siente
  no correspondida. Puede no volver a reunirse.
- **(C)** Le mentís sobre lo que tenés → la relación se construye
  sobre una mentira. Si lo descubre, perdés la fuente y tu
  credibilidad.

**Decisión 3.3 — Al volver a la redacción, abrís Bitácora y
registrás todo.** Mientras escribís en el diario de campo, corrés
un diagnóstico de tu dispositivo. El resultado: "Patrón de conexión
anómalo detectado en red de la redacción. Posible monitoreo." El
adversario tiene las mismas herramientas que vos, o mejores.
- **(A)** Desconectás el dispositivo de la red y pasás todo al
  air-gapped → perdés acceso a herramientas que necesitan red
  interna. Pero el material está seguro.
- **(B)** Reportás a Fiorella y esperás diagnóstico → flag
  `patron_digital_detectado`. Fiorella investiga pero pasó tiempo.
- **(C)** Ignorás y seguís trabajando → si el monitoreo es real,
  todo lo que escribas desde ahora está comprometido.

**Convergencia:** la fuente de inteligencia está (o no) activa. El
material está (o no) en dispositivo limpio. La red de la redacción
está (o no) comprometida.

### Objetivo 4 — Complicación: "El sistema se protege."

**Situación:** Bitácora muestra acumulado: diario de campo con
múltiples entradas T-DOM y T-SPY. El cruce automático genera banner
rojo. Al mismo tiempo, Pollastri registra en el sistema: "Recibimos
notificación del juzgado. Requerimiento de información sobre
periodistas de la redacción en relación a una causa de seguridad
nacional." Y la fuente interna manda un último mensaje por canal de
emergencia: "Saben. No me contactes más."

Todos los hombres del presidente: el sistema se protege cuando lo
investigás.

**Decisión 4.1 — El requerimiento judicial. ¿Cómo respondés?**
- **(A)** Activás protocolo legal completo: Pollastri responde con
  doctrina de secreto profesional periodístico (Campillay, CSJN
  1986) → la respuesta es legal pero confirma que hay investigación.
- **(B)** Publicás inmediatamente lo que tenés como medida de
  protección → la visibilidad protege, pero el material puede
  estar incompleto. "La publicación es el chaleco antibalas del
  periodista de investigación."
- **(C)** Coordinás publicación simultánea con otro medio (ICIJ,
  OCCRP) → máxima protección por visibilidad internacional, pero
  perdés exclusividad y control del timing.

**Decisión 4.2 — La fuente cortó comunicación. ¿La buscás?**
- **(A)** Respetás su pedido. No la contactás más → perdés la
  fuente pero la protegés.
- **(B)** Intentás un último contacto por canal de emergencia → si
  funciona, tenés confirmación final. Si no, quedó registro del
  intento.
- **(C)** Publicás sin la confirmación de la fuente interna → el
  material original (los documentos del buzón) más tu verificación
  OSINT, sin la fuente humana. Más débil pero publicable.

**Decisión 4.3 — Bitácora muestra diagnóstico:** "3 indicadores de
compromiso digital en 14 días. Se sugiere rotación de dispositivos
y revisión de seguridad perimetral de la redacción."
- **(A)** Rotación completa: dispositivos nuevos, cambio de
  rutinas, mudanza temporal de la operación → máxima seguridad,
  máxima disrupción.
- **(B)** Rotación parcial: solo dispositivos, no rutinas → mitiga
  lo digital, no lo físico.
- **(C)** No rotás — publicás lo antes posible y que la
  publicación sea la protección → apostás todo a que la
  visibilidad es más efectiva que la seguridad operacional.

**Convergencia:** la investigación llega al punto de publicar o
abortar.

### Objetivo 5 — Resolución: "Bitácora abierta. La misma mesa."

No hay decisiones. Debriefing.

**Parte de cierre ANA-047 — firmado** (dirección editorial +
Pollastri + Fiorella):

- **Ruta de decisiones:** las 12-15 decisiones en el árbol.
- **Nivel de acceso alcanzado:** qué profundidad de investigación
  lograste.
- **Estado de las fuentes:** fuente anónima original
  (activa/desconocida), fuente interna (cortada/protegida/expuesta),
  colega (alertado/no alertado).
- **Custodia del material:** con intermediario / en redacción /
  sin custodia formal.
- **Integridad digital:** dispositivo limpio / comprometido /
  parcialmente comprometido.
- **Publicación:** coordinada internacionalmente / exclusiva /
  abortada / parcial.
- **Nota final:** "Esta investigación no tiene cierre. Anaconda-2
  sigue activo. El monitoreo no se detuvo porque publicaste. Se
  detuvo (o no) porque cambiaron de objetivo."
- **Sesión JTSN:** estado mental. Todos los hombres del
  presidente: Woodward y Bernstein no durmieron durante meses.
  Mondini tampoco.
