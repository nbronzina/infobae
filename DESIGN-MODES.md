# DESIGN-MODES.md — Dos modos de la misma app

Especificación de la capa de presentación de Infobae · Bitácora.
Bitácora corre en dos dispositivos con contextos operacionales
distintos: un GrapheneOS (Pixel) para campo y un e-ink (Boox) para
redacción. Este documento describe cómo se rendiriza la misma data y
la misma lógica en cada contexto.

## Principio general

Una app, dos modos. La variable `modo: "campo" | "redaccion"`
determina cómo se renderiza todo. Se detecta automáticamente por
tamaño de pantalla (`< 768px` = campo, `>= 768px` = redacción) o se
fuerza manualmente con un toggle discreto. Los mismos componentes,
la misma data, la misma lógica — distinta presentación.

No es responsive design convencional (misma web más chica). Son dos
herramientas del mismo kit para dos contextos operacionales
distintos. El modo campo es un teléfono en un hotel de Arauca de
noche. El modo redacción es un e-ink en un escritorio de Buenos
Aires.

## Modo campo (GrapheneOS / Pixel)

**Contexto:** pantalla chica (5-6"), touch, una mano, posiblemente
de noche. El corresponsal está en campo. No navega carpetas —
necesita acceso rápido a lo urgente.

### Layout

- Pantalla completa, sin sidebar. Sin header fijo. Sin breadcrumb.
- Navegación por tabs en el borde inferior: 4 tabs máximo.
  **MISIÓN** (objetivo actual) | **HERRAMIENTAS** (analista,
  checklist, evaluación, fuentes, diario) | **DOCS** (búsqueda, no
  navegación por carpeta) | **ESTADO** (estado mental, flags
  activos, última sync).
- Una pantalla = un contenido. No hay columnas, no hay paneles
  laterales.
- Scroll vertical. Nunca horizontal.

### Color

- Modo oscuro por defecto. No "dark mode como opción" — oscuro ES
  el default.
- Fondo: `#0d0d0d` (casi negro, más oscuro que el `#1f1f1f` del
  modo redacción — no emitir luz).
- Texto principal: `#e8e4db` (paper invertido, no blanco puro —
  reduce fatiga).
- Texto secundario: `#8a8472`.
- Naranja: `#f18b1e` solo en wordmark y en indicadores de estado
  activo.
- Rojo: `#bd2828` solo en alertas y amenazas.
- Verde: `#5a6e3c` para estados completado/vigente.
- Sin fondos paper. Sin fondos sidebar. Todo oscuro.

### Tipografía

- Mismas 3 fuentes, tamaños más grandes.
- Cuerpo: 16px mínimo.
- Títulos: Fraunces 22px.
- Metadata: JetBrains Mono 13px.
- Chrome: IBM Plex Sans 14px.
- Line-height: 1.6 para lectura, 1.4 para metadata.

### Interacción

- Touch targets mínimo 48px (más que WCAG — se usa con guantes o
  en condiciones adversas).
- Botones de decisión en misiones: full-width, 56px de alto, uno
  debajo del otro.
- Swipe izquierda/derecha para navegar entre tabs.
- No hay hover states.
- Las decisiones de misión se presentan una a la vez: situación
  arriba, opciones abajo.

### Herramientas en modo campo

- **Analista:** input de texto + botón. Respuesta debajo. Sin
  decoración.
- **Checklist:** lista vertical, cada item es un row tocable.
- **Diario de campo:** textarea + selectors. Botón guardar.
  Timeline debajo.
- **Evaluación de teatro:** cards verticales tocables.
- **Editor de fuentes:** formulario vertical, scroll continuo.

### Lo que NO aparece en modo campo

Sidebar, header con navegación, breadcrumb, columnas de metadata,
barra de acciones de documento, footer, modal "Sobre este
artefacto".

### Misiones en modo campo

- Objetivo actual ocupa toda la pantalla.
- Situación como texto narrativo arriba (Fraunces).
- Opciones como botones full-width abajo (JetBrains Mono).
- Convergencia: bloque de texto que cierra el objetivo. Botón
  "Siguiente objetivo".
- Debriefing: scroll vertical largo con parte firmado completo.

**Tono visual:** The Conversation. Pantalla oscura, texto claro,
aislamiento. No parece una app — parece un terminal seguro.

## Modo redacción (e-ink / Boox)

**Contexto:** pantalla mediana (7-10"), stylus o touch, escala de
grises o color e-ink limitado, refresh lento. El corresponsal está
en la redacción, tiene tiempo, cruza datos.

### Layout

- Una columna central, ancho máximo 680px, centrada. Como un libro.
- Sin sidebar. Sin columnas laterales. Sin grid complejo.
- Navegación por menú discreto superior o hamburguesa.
- Los documentos son la interfaz principal — lectura extendida.
- Las herramientas se acceden desde menú, no desde tabs
  permanentes.

### Color

- Modo claro por defecto. Optimizado para e-ink.
- Fondo: `#f8f5ec` (paper).
- Texto principal: `#1f1f1f`.
- Texto secundario: `#5a544c`.
- Metadata: `#6b6454`.
- Separadores: `#d9d4c2`.
- Sin gradientes, sin sombras, sin transparencias. E-ink no los
  renderiza bien.
- El naranja se ve como gris medio en e-ink. Usarlo solo en
  wordmark donde el reconocimiento es por forma.
- Estados de alerta: usar iconografía + texto, no solo color. E-ink
  no distingue rojo de gris oscuro.

### Tipografía

- Cuerpo: 15px, line-height 1.7. Lectura extensa.
- Títulos: Fraunces 24px bold.
- Metadata: JetBrains Mono 12px.
- Párrafos: max-width 38em (medida óptima de lectura).

### Interacción

- Touch targets 44px.
- Sin animaciones. Cada cambio de pantalla es cambio de página
  completo (e-ink refresh lento).
- Scroll vertical para lectura.
- Decisiones de misión como texto corrido con opciones al final —
  como un livre-jeu físico.

### Herramientas en modo redacción

- **Analista:** más espacio para la respuesta. Tipografía de
  lectura.
- **Checklist:** tabla con columnas (item, responsable, estado).
  Más denso.
- **Diario de campo:** timeline detallada, entradas con más
  contexto visible.
- **Evaluación de teatro:** parte completo como documento, no como
  cards.
- **Editor de fuentes:** todos los campos visibles a la vez.
- **OSINT / cruces de datos:** tablas legibles, registros
  cruzados.

### Documentos en modo redacción

- Lectura larga. Metadata como encabezado del documento, no
  sidebar.
- Navegación entre documentos por links internos (wiki), no por
  sidebar.
- Se sienten como un libro. Papel, tipografía editorial, márgenes
  generosos.

### Misiones en modo redacción

- Se sienten como un livre-jeu físico. Texto narrativo largo,
  opciones como links al final del bloque.
- Menos urgencia que campo. Más reflexivo.
- Debriefing como informe impreso.

**Tono visual:** Spotlight. Papeles sobre un escritorio. Parece un
libro de trabajo, no una app.

## Transiciones entre modos

- El modo se puede cambiar manualmente (toggle en settings o
  long-press en wordmark).
- Al cambiar de modo, la pantalla se re-renderiza. No se pierde
  estado.
- La sync entre dispositivos transfiere: estado de misión (flags,
  objetivo actual), entradas de diario, registros de fuentes,
  estado mental. **No** transfiere preferencias de UI.
- Cada dispositivo recuerda su modo preferido.

## Orden de implementación

Empezá por el modo campo. Es la interfaz más restrictiva — si
funciona en un Pixel de noche en Arauca, funciona en todos lados.
El modo redacción se construye después como extensión.

No toques el contenido de las misiones (MISSIONS.md), los JSON de
datos, ni la lógica de las herramientas. Solo la capa de
presentación.
