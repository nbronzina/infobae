---
name: react-intranet
description: Patrones de código específicos para este proyecto. App.jsx es un componente monolítico de ~2000 líneas con arquitectura de datos + renderizadores genéricos. Activar al modificar código.
---

## ARQUITECTURA
Un solo componente (App.jsx) con:
- Datos como objetos/arrays en el scope del componente (DOC_META, THREAT_GLOSSARY, VISTAS, etc.)
- Estado de navegación via activeView (string) + showLanding (bool)
- Renderizadores genéricos que leen propiedades del objeto VISTAS

## AGREGAR UN DOCUMENTO NUEVO
1. Agregar entrada en VISTAS con key única y propiedad `doc: { area, codigo, version, fecha, responsable, titulo, subtitulo, secciones: [{ titulo, texto }], fuentes }`
2. Agregar a la folder view correspondiente (folder_xxx) con key, codigo, titulo, version, estado
3. Agregar al sidebar como div con onClick={() => setActiveView('key')} y estado activo visual
4. Agregar al breadcrumb docFolders mapping
5. Agregar al folderChildren del folder padre
6. Si es doc relacionado del manual principal, agregar al viewMap
7. El renderizador genérico se encarga del resto — no escribir JSX de documento

## AGREGAR UNA VISTA/PÁGINA
1. Agregar entrada en VISTAS con key y propiedades de la vista
2. Agregar renderizador condicional en el bloque de vistas
3. Conectar desde sidebar o top nav con setActiveView + setShowLanding(false)

## REGLAS DE ESTADO
- Todo setActiveView(null) DEBE incluir setShowLanding(false) o setShowLanding(true) según destino
- Todo setActiveView('algo') implícitamente desactiva landing (el condicional de rendering lo maneja)
- El useEffect de auto-expand expande la carpeta padre al navegar a un hijo

## PALETA EN CÓDIGO
No usar hex directamente — respetar los colores del sistema de diseño (ver infobae-diegesis). Los colores más usados:
- Fondo papel: #f8f5ec
- Fondo sidebar: #f0ede4
- Borde/separador: #d9d4c2
- Texto primario: #1f1f1f
- Texto secundario: #5a544c
- Metadata: #8a8472
- Alerta: #bd2828
- Vigente: #5a6e3c sobre #e8f0de
- En revisión: #8a6d2b sobre #f5edd5
