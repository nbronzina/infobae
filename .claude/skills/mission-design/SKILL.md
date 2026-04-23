---
name: mission-design
description: Reglas de diseño y schema de nodos para las misiones del livre-jeu de Infobae · Bitácora. Activar al escribir, editar o revisar nodos de mision_*.json, al extender el renderer de MisionView, al armar badges/gates, o al decidir cómo presentar consecuencias. Incluye los 8 principios operativos, los patrones referentes (Orwell, SIMULACRA, Detroit, Hacknet, Frictional), el sistema de gates tipo A/B y el schema JSON completo.
---

# DISEÑO DE MISIONES — BITÁCORA

Las misiones son livre-jeu con decisiones que importan. No son tutoriales disfrazados, no son exploración libre, no son puzzles. Son dilemas operativos con consecuencias demoradas.

## LAS OCHO REGLAS

### 1. Lenguaje claro, no técnico
El jugador no es periodista. No sabe qué es OSINT, HEFAT, ANMaC, BSSID, threat assessment. Los NPCs hablan como colegas, no como manuales. Si una opción no la entiende alguien que nunca trabajó en periodismo, hay que reescribirla. Los códigos OP-TOOL y OP-SEC aparecen en las herramientas y documentos, nunca en los mensajes de los NPCs ni en las opciones.

**Malo:** "Ejecutar protocolo de contra-vigilancia RF según sección 04 del manual OP-SEC-2029-004"
**Bueno:** "Mover el Starlink a 200 metros de donde estás para que la señal no coincida con tu ubicación"

**Malo:** "Realizá una evaluación de amenazas del teatro de operaciones"
**Bueno:** "Antes de moverte, fijate qué hay en la zona — abrí la evaluación"

### 2. Progresión por mensajes de NPC, no por pantallas de objetivo
No hay "Objetivo 1 — Onboarding" visible. No hay pantalla de progreso. No hay "Nivel 1 de 5". La transición entre objetivos es un nuevo mensaje de un NPC. Los NPCs envían mensajes que contienen la situación y motivan la acción.

Referentes: Orwell (handler Symes que te escribe cada caso), Hacknet (email de Bit como hilo narrativo).

### 3. Notification badges guían sin instruir
Cuando un NPC menciona una herramienta o un documento, aparece un badge naranja (punto, no número) en el tab correspondiente:
- `HERRAM.` con badge → hay una herramienta que usar
- `DOCS` con badge → hay un documento relevante

El badge desaparece cuando el jugador abre el elemento. Nunca más de 2-3 badges activos a la vez.

Referente: SIMULACRA (notifications que piden atención sin explicarse).

### 4. Opciones bloqueadas con condición legible
Si una opción requiere haber leído un documento o usado una herramienta, aparece grisada con texto tipo "necesitás haber leído el manual de higiene RF" — no "requiere OP-SEC-2029-004 §04". El jugador ve que la opción existe y qué le falta.

Referente: Detroit Become Human (opciones con requisito visible al lado).

### 5. Contexto en la situación, no antes
No hay briefings geopolíticos previos. La situación del nodo dice lo que el jugador necesita saber para decidir. "Zona de frontera, guerrilla activa, transición política inestable" — no un párrafo sobre el ELN y las disidencias FARC. Si el jugador quiere más contexto, los documentos están en DOCS.

### 6. Herramientas cuando la misión las necesita
El NPC dice algo que implica la herramienta. "Fiorella dejó pendiente la configuración de tus dispositivos" → badge en HERRAM. → el jugador abre y ve el checklist. La herramienta no se explica — se usa.

Referente: Hacknet (la carta de Bit ES el tutorial — no hay pantalla "cómo usar la terminal").

### 7. Diario y registro de fuentes son inventario
Lo que el jugador registró desbloquea opciones. Si documentó una fuente, tiene canal de respaldo. Si registró una anomalía, el sistema puede cruzar patrones. Lo que no registró, no existe para el sistema. La diligencia del jugador es la diligencia del personaje.

Referente: SIMULACRA 2 (el WARDEN scan sólo funciona sobre lo que el jugador archivó).

### 8. Consecuencias intrínsecas e inmediatas durante la misión
El mundo reacciona a las decisiones sin decir si acertaste. Si elegiste mal, la fuente no responde, el tiempo se pierde, la opción se cierra. No hay "respuesta incorrecta — intentá de nuevo". Hay consecuencias. El feedback analítico aparece sólo en el debriefing del objetivo 5.

Referente: Frictional Games (SOMA, Amnesia) — los documentos leídos desbloquean comprensión, la comprensión cambia las opciones disponibles más adelante.

## PATRONES REFERENTES (ROLES EN EL DISEÑO)

| Patrón | Juego/Obra | Uso en Bitácora |
|---|---|---|
| Handler messages | Orwell (Symes) | Cada nuevo objetivo arranca con un mensaje firmado de un NPC. El NPC da la situación, no un narrador omnisciente. |
| Notification badges | SIMULACRA | Punto naranja en tabs cuando hay algo que hacer. Se apaga al abrir. |
| Opciones bloqueadas con requisito | Detroit Become Human | "necesitás X" visible. Nunca esconder opciones. |
| Tutorial diegético | Hacknet (Bit) | La herramienta se presenta dentro del mensaje del NPC. No hay tooltips. |
| Docs como llaves | Frictional Games | Leer un documento real en DOCS setea flags que desbloquean opciones. La lectura es agency. |

## SISTEMA DE GATES

Dos tipos de restricción de opciones. Elegir el correcto según intención.

### Gate tipo A — opción bloqueada (soft gate)
La opción aparece grisada con su `requiere` y un texto legible. El jugador la ve pero no la puede elegir todavía. Puede ir, hacer lo que le falta (abrir la herramienta, leer el doc, marcar el checklist), volver al canal y ahora sí elegirla.

Schema en JSON:
```json
{
  "id": "a",
  "texto": "Abrir la evaluación de zona para Arauca.",
  "requiere": "evaluacion_arauca_abierta",
  "requiere_texto": "necesitás abrir la evaluación por teatro en HERRAM. y seleccionar Arauca/Apure",
  "flags_set": ["evaluacion_leida"],
  "preparacion": 1,
  "siguiente": "obj1_d1_a_resultado"
}
```

Variante: `requiere_sin` bloquea si el flag **está** presente (opción mutualmente excluyente con un estado previo).

### Gate tipo B — bloqueo duro de avance
Un nodo de `situacion` o `mensaje_npc` puede gatear su `continuar ↓`. Útil cuando un NPC "no te deja pasar" hasta que completaste algo — el caso canónico es Villafañe exigiendo un mínimo de items en el checklist antes de pasar al día siguiente.

Schema en JSON:
```json
{
  "id": "obj1_convergencia",
  "tipo": "mensaje_npc",
  "emisor": "villafañe",
  "texto": "...",
  "siguiente": "obj1_cierre",
  "avance_requiere": "checklist_tres_items",
  "avance_requiere_texto": "faltan items obligatorios en el checklist"
}
```

El link "continuar ↓" aparece grisado con el texto del gate debajo. No hay forma de saltarlo.

### Flags derivados de localStorage
Los gates no dependen sólo de las decisiones previas. `MisionView.derivarFlagsExternos()` lee el estado real del dispositivo y agrega flags:

| Flag derivado | Fuente |
|---|---|
| `evaluacion_arauca_abierta` | `infobae:teatro_seleccionado === 'ARQ-042'` |
| `teatro_abierto` | cualquier teatro seleccionado |
| `checklist_tocado` | 1+ items marcados en `infobae:checklist` |
| `checklist_tres_items` | 3+ items marcados |
| `checklist_completo` | 9+ items marcados |
| `manual_rf_leido` | `infobae:docs_leidos` incluye `'main'` |
| `doc_<key>_leido` | por cada doc abierto |

`flagsCombinados = partida.flags ∪ flagsDerivados` se evalúa en render y al elegir opción. Se recalcula al focus de ventana — volver al tab CANAL después de usar una herramienta actualiza los gates sin reload.

## SCHEMA DE NODOS JSON

Archivo: `src/data/mision_<linea>.json`

### Estructura raíz
```json
{
  "linea": "internacional",
  "codigo": "ARQ-042",
  "objetivos": [
    {
      "id": "obj1",
      "titulo_interno": "Último briefing antes de desconectar",
      "nodo_inicial": "obj1_inicio",
      "nodos": [ ... ]
    }
  ]
}
```

`titulo_interno` es sólo para referencia del diseñador — nunca se muestra al jugador (regla 2).

### Tipos de nodo

**`tipo: "situacion"`** — narrativa pura, sin emisor.
```json
{
  "id": "obj1_inicio",
  "tipo": "situacion",
  "emisor": null,
  "texto": "Son las 21:40. Estás en tu departamento de Buenos Aires...",
  "badges": ["herramientas"],
  "siguiente": "obj1_d1"
}
```
`emisor` debe ser `null`. Si hay remitente humano, usar `mensaje_npc`.

**`tipo: "mensaje_npc"`** — mensaje firmado.
```json
{
  "id": "obj2_peralta",
  "tipo": "mensaje_npc",
  "emisor": "peralta",
  "texto": "Mondini, me fijé: el curso te venció hace dos meses...",
  "badges": ["herramientas"],
  "siguiente": "obj2_d_hefat"
}
```
`emisor`: nombre corto, minúscula, sin título ni inicial. `"fiorella"`, `"zelaya"`, `"villafañe"`, `"velasquez"`, `"peralta"`, `"pollastri"`, `"roca"`, `"quiroga"`.

**`tipo: "decision"`** — bifurcación.
```json
{
  "id": "obj1_d1",
  "tipo": "decision",
  "texto": "¿Qué hacés primero?",
  "opciones": [ ... ]
}
```
Sin emisor, sin badges. El texto del nodo es la pregunta que precede las opciones.

**`tipo: "debriefing"`** — parte firmado al cierre de misión.
Forma custom con campos `facetas`, `cierre`, `firmas`. Es el único lugar donde metadata explícita (preparación, estado mental, ruta de decisiones) es legítima — forma parte del parte que firman los jefes, no es UI overlay.

### Campos de nodo

| Campo | Tipo | Usado en | Descripción |
|---|---|---|---|
| `id` | string | todos | Identificador único dentro del objetivo |
| `tipo` | enum | todos | `situacion` \| `mensaje_npc` \| `decision` \| `debriefing` |
| `emisor` | string \| null | situacion, mensaje_npc | Nombre corto del emisor o `null` para narrativa |
| `texto` | string | todos | Cuerpo del nodo o pregunta de decisión |
| `badges` | string[] | situacion, mensaje_npc | `["herramientas", "docs"]` — qué tabs resaltar |
| `siguiente` | string \| null | situacion, mensaje_npc | ID del próximo nodo |
| `siguiente_condicional` | array | situacion, mensaje_npc | Rutas alternativas según flags |
| `avance_requiere` | string | situacion, mensaje_npc | Flag requerido para activar `continuar ↓` |
| `avance_requiere_sin` | string | situacion, mensaje_npc | Flag cuya presencia bloquea el avance |
| `avance_requiere_texto` | string | situacion, mensaje_npc | Texto legible del gate tipo B |
| `opciones` | array | decision | Lista de opciones de bifurcación |

### Campos de opción (dentro de `decision`)

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | `"a"`, `"b"`, `"c"`... |
| `texto` | string | Texto de la opción, en segunda persona informal |
| `requiere` | string \| null | Flag requerido para que la opción sea clickeable |
| `requiere_sin` | string | Flag cuya presencia bloquea |
| `requiere_texto` | string | Texto legible del gate tipo A |
| `flags_set` | string[] | Flags que se setean al elegir esta opción |
| `preparacion` | number | Delta sumado al acumulador `partida.preparacion` |
| `estado_mental_set` | string | `"estable"` \| `"tenso"` \| `"agotado"` |
| `siguiente` | string | Próximo nodo por default |
| `siguiente_condicional` | array | Rutas condicionales: `[{ "flag": "X", "siguiente": "nodo_Y" }, ...]` evaluadas en orden; la primera que matchea gana |

### Badges actuales
- `"herramientas"` — punto naranja en tab `HERRAM.`
- `"docs"` — punto naranja en tab `DOCS`

### Convenciones de IDs
- `obj<N>_<slug>` — nodos del objetivo N. Ej: `obj1_inicio`, `obj2_d_hefat`.
- Resultados de decisión: `obj<N>_d<M>_<opcion>_res` o `_<variante>`. Ej: `obj1_d1_a_resultado`.
- Convergencias: `obj<N>_convergencia` o `obj<N>_<npc>`.
- Cierres: `obj<N>_cierre`.
