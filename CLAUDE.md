# CLAUDE.md

## Proyecto
Intranet ficticia de Infobae (2029) — design fiction / diegetic prototype.

## Stack
- React (single component, ~1945 líneas)
- Vite para build
- Google Fonts (IBM Plex Sans, Fraunces, JetBrains Mono)
- Lucide React para íconos
- Anthropic API para widget de análisis IA (Claudeception)
- Deploy: Vercel

## Archivos
- `src/App.jsx` — componente principal (renombrado de infobae-interna.jsx)
- `BRIEF.md` — contexto completo del proyecto, personajes, fuentes verificadas

## Reglas
- No cambiar contenido de documentos sin verificar fuentes
- No agregar copy tipo app/producto — registro institucional siempre
- Paleta fija: #f18b1e (marca), #bd2828 (alertas), #1f1f1f (negro)
- Tres fuentes, no agregar más
- La API key de Anthropic va como VITE_ANTHROPIC_API_KEY en .env
- Anti-slop: no adjetivos valorativos, no "revolucionario", no "poderoso"

## Comandos
```
npm install
npm run dev
npm run build
```
