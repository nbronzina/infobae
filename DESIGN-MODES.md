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
