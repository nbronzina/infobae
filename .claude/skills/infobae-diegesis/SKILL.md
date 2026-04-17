---
name: infobae-diegesis
description: Biblia del universo diegético de la intranet ficticia de Infobae 2029. Contiene personajes, timeline, códigos de documento, sistema de diseño, y reglas del mundo. Activar SIEMPRE que se trabaje sobre el proyecto — no existe trabajo sobre este proyecto sin este skill activo.
---

## QUÉ ES ESTO
Diegetic prototype de una intranet corporativa de Infobae ambientada en 2029. Design fiction en la tradición de Near Future Laboratory / Nick Foster (Future Mundane). La ficción está en que el sistema existe, no en lo que dice.

## PERSONAJE PRINCIPAL
Lucía Mondini — corresponsal Infobae, base Buenos Aires. Compuesta de:
- Hugo Alconada Mon (investigación doméstica, vigilancia SIDE, legajo "Anaconda")
- Teresa Bo (despliegue internacional, Al Jazeera, HEFAT institucional)
- Sebastiana Barráez (diáspora venezolana, cobertura Venezuela)

## EQUIPO (todos ficticios)
- Javier Fiorella: seguridad digital lead, Buenos Aires
- Marina Villafañe: operaciones de campo, Buenos Aires
- Lucas Pollastri: legales, Buenos Aires
- Daniela Roca: verificación y OSINT, Bogotá
- Felipe Zelaya: editor guardia turno noche, Madrid
- Sofía Peralta: formación y capacitación, Buenos Aires
- Tomás Quiroga: freelancer liaison, Lima
- R. Velásquez: fixer externo, Arauca (contacto solo vía Signal)

## TEATROS ACTIVOS
- ARQ-042: Arauca/Apure (COL/VEN), cerrado, post-captura Maduro ene 2026
- ROS-038: Rosario, Santa Fe, en curso. Los Monos / clan Cantero, nexo narco-estatal

## CÓDIGOS DE DOCUMENTO
Formato: OP-[ÁREA]-[AÑO]-[NNN]
- OP-RED: Redacción
- OP-SEC: Seguridad Digital
- OP-LEG: Legales
- OP-HR: Recursos Humanos
- OP-INV: Investigación
- OP-TOOL: Herramientas
- EXT-: Documento externo de referencia

## AMENAZAS (glosario)
T-WPS, T-RF, T-SPY, T-SYNTH, T-CKP, T-PHYS, T-DOM

## SISTEMA DE DISEÑO
Colores primarios:
- #f18b1e — naranja marca (SOLO logo)
- #bd2828 — rojo alertas y clasificación (callouts, tags, badges, "USO INTERNO", enlaces mailto)
- #1f1f1f — negro corporativo (texto primario, borde activo de sidebar)
- #f8f5ec — paper (fondo documentos)
- #f0ede4 — sidebar
- #eceae4 — fondo base
- #f0ecde — bloques destacados / callouts
- #d9d4c2 — separadores
- #5a6e3c — verde vigente (sobre #e8f0de)
- #8a6d2b — ámbar revisión (sobre #f5edd5)
- #8a8472 — gris metadata (uso decorativo; para texto legible usar #5a544c)

Tokens funcionales:
- #2a2a2a, #3d3931 — panel de login (fondo oscuro corporativo)
- #5a544c — texto secundario y metadata accesible (AA sobre #f0ede4 y #f8f5ec)
- #e5e1d3 — hover/active en sidebar
- #e8f0de — chip de fondo workflow vigente
- #f5edd5 — chip de fondo workflow revisión
- #f5d5d5 — chip de fondo estado off-line / alerta
- #f7f5ee — breadcrumb bar

Tipografía:
- IBM Plex Sans — chrome corporativo, UI
- Fraunces — editorial, títulos, lectura
- JetBrains Mono — metadata, códigos, operaciones

Workflow states: vigente (verde), en_revision (ámbar), borrador (gris)

## REGLA MADRE
El sistema no le habla al usuario. Registra condiciones. Si suena a app, está mal. Si suena a documento institucional que alguien imprimiría y dejaría en un escritorio, está bien.
