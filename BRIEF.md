# BRIEF PARA CLAUDE CODE

## Qué es esto

Prototipo de design fiction. Una intranet corporativa ficticia de Infobae 
ambientada en 2029 que responde a la pregunta: ¿cómo se organizarían los 
periodistas de investigación y corresponsales de una agencia de noticias 
para entrenarse, informarse, prepararse y trabajar — tanto en campo 
internacional como en investigación doméstica?

El artefacto es un diegetic prototype en la tradición de Near Future 
Laboratory / Superflux / Nick Foster (Future Mundane). La ficción está 
en que el sistema existe, no en lo que dice.

## Estado actual

El archivo `App.jsx` (renombrar desde `infobae-interna.jsx`) es un 
componente React standalone de ~1945 líneas que funciona como artifact 
de Claude.ai. Incluye:

### Estructura
- Login screen (fondo negro, wordmark naranja, auto-fill mondini.l)
- Landing page operativa (brief del día, despliegues, pendientes, accesos rápidos)
- Intranet shell (header, sidebar colapsable, breadcrumb dinámico, metadata panel)
- 21+ documentos navegables con renderizador genérico
- Widget de consulta IA (llamada real a API Claude — Claudeception)
- Formulario de parte de despliegue interactivo
- Sistema de notificaciones (bell dropdown con overlay de cierre)
- Search bar expandible

### Navegación (70 onClick handlers, 0 dead links)
- Top nav: Inicio, Redacción, Documentos, Directorio, Herramientas, Soporte
- Sidebar izquierdo colapsable a icon rail (52px)
- 6 carpetas expandibles: Redacción, Seguridad Digital, Legales, RRHH, Investigación, Herramientas
- Folder views con workflow states (vigente/en revisión/borrador)
- Breadcrumb dinámico por tipo de vista
- Estado activo visual en todos los items (borde rojo + fondo + peso 500)
- Carpeta padre se marca activa cuando un hijo está seleccionado
- Auto-expand de carpeta al navegar a un documento hijo

### Documentos por área
**Redacción (3):** Manual de estilo, Fuentes anónimas, Verificación pre-pub
**Seguridad Digital (6):** Comunicación cifrada, Verificación C2PA, Higiene RF (doc principal con 8 secciones + SVG), Compromiso de dispositivo, Vigilancia en destino, Versión fixer
**Legales (3):** ANMaC/ENACOM (render custom con tablas), Exportación equipamiento, Seguros alto riesgo
**RRHH (3):** Apoyo psicológico JTSN, Política de despliegue, Contactos emergencia
**Investigación (4):** Documentos filtrados, Metodología OSINT, Redes internacionales (ICIJ/OCCRP), Contra-vigilancia doméstica
**Herramientas (4):** Analista automatizado (Claudeception), Parte de despliegue (formulario), Pipeline verificación, OP-SEC-LOG
**Extras (2):** Versión fixer, Protocolo FOPEA (doc externo)

### Personaje
Lucía Mondini — corresponsal Infobae, base Buenos Aires. Trabaja en dos 
frentes simultáneos: corresponsalía internacional (ARQ-042, Arauca/Apure, 
cerrado) e investigación doméstica (ROS-038, Rosario, Los Monos, en curso).

### Paleta verificada contra Infobae real
- Naranja marca (solo logo): #f18b1e
- Rojo alertas/clasificación: #bd2828
- Negro corporativo: #1f1f1f
- Fondos: #eceae4 (base), #f0ede4 (sidebar), #f8f5ec (paper), #f0ecde (bloques)
- Verde aprobación: #5a6e3c
- Ámbar revisión: #8a6d2b / #f5edd5
- Gris metadata: #8a8472
- Separadores: #d9d4c2

### Tipografía (3 fuentes, Google Fonts CDN)
- IBM Plex Sans: chrome corporativo, UI general
- Fraunces: contenido editorial, títulos, lectura larga
- JetBrains Mono: metadata, códigos, operaciones, formularios

## Lo que necesita para deploy

1. Migrar de artifact React a Vite + React standalone
2. Resolver fonts via Google Fonts (ya están como CDN en useEffect)
3. La llamada a la API de Claude en el analista automatizado necesita 
   proxy o variable de entorno para la API key
4. Deploy a Netlify — URL limpia, sin subpath
5. El archivo se llama infobae-interna.jsx — renombrar a App.jsx en src/

## Restricciones de voz

El sistema no le habla al usuario. Registra condiciones. 
Nunca copy tipo app/producto. Nunca gesto literario. 
Todo en registro de documento técnico institucional.

## Fuentes técnicas verificadas
- Rye & Levin, IEEE S&P 2024, arXiv:2405.14975 (WPS/Starlink)
- ANMaC: Ley 20.429, Decreto 395/75, Res. 83/2023, Disp. RENAR 883/11
- ENACOM: Res. 955/2025 (Starlink), RAMATEL
- RSF España: rsf-es.org/seguridad-para-periodistas
- Sam Gregory, Journalism Practice 2022 (C2PA/deepfakes)
- IPTC Origin Verifier: originverify.iptc.org
- Dart Center / JTSN: dartcenter.org
- FOPEA: fopea.org
- Bellingcat Online Investigation Toolkit
- Berkeley Protocol on Digital Open Source Investigations (ONU, 2022)
- ICIJ, OCCRP Aleph, GIJN
- Los Monos / Clan Cantero: InSight Crime, PFA Plan Bandera (dic 2025)
- De los Santos & Lascano, "Los Monos" (premio FOPEA)

## Contexto completo del universo ficticio

Teatro internacional: frontera Arauca (COL) / Apure (VEN), 2029, 
post-captura de Maduro (enero 2026), transición venezolana inestable.

Teatro doméstico: Rosario, Santa Fe. Estructuras sucesoras del clan 
Cantero post-detención de Dylan Cantero (dic 2025). Nexo narcotráfico-
fuerzas de seguridad. Investigación en curso con protocolo de 
contra-vigilancia doméstica activo.

Equipo ficticio: Mondini (corresponsal), Fiorella (seg digital), 
Villafañe (operaciones), Pollastri (legales), Roca (verificación, Bogotá), 
Zelaya (editor guardia, Madrid), Peralta (formación), Quiroga (freelancers, Lima), 
Velásquez (fixer externo, Arauca).

## Primera instrucción para Claude Code

"Leé BRIEF.md y el archivo infobae-interna.jsx. Migrá a Vite + React. 
Configurá deploy a Netlify. La API key de Anthropic va como variable 
de entorno VITE_ANTHROPIC_API_KEY. No cambies contenido ni diseño, 
solo infraestructura."
