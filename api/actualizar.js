import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const maxDuration = 300;

const MODEL = 'claude-sonnet-4-5';
const MAX_NOTICIAS = 12;
const MAX_ACTIVIDAD = 10;
const MAX_NOTIFICACIONES = 6;
const THROTTLE_DIAS = 30;
const PAUSE_DIAS = 60;
const DATA_PATHS = {
  noticias: 'src/data/noticias.json',
  actividad: 'src/data/actividad.json',
  notificaciones: 'src/data/notificaciones.json',
  estadoMundo: 'src/data/estado-mundo.json',
  hechos: 'src/data/hechos.json'
};

function stripTags(text) {
  if (typeof text !== 'string') return text;
  return text.replace(/\s*\[(?:operacional|contextual)\]\s*/gi, ' ').replace(/\s+/g, ' ').trim();
}

function cleanContent(c) {
  const out = { ...c };
  for (const k of ['titulo', 'texto', 'accion']) {
    if (typeof out[k] === 'string') out[k] = stripTags(out[k]);
  }
  return out;
}

function diasDesde(fechaISO) {
  const t = Date.parse(fechaISO);
  if (isNaN(t)) return Infinity;
  return Math.floor((Date.now() - t) / (1000 * 60 * 60 * 24));
}

function deepMerge(target, patch) {
  if (patch === null || typeof patch !== 'object' || Array.isArray(patch)) return patch;
  const out = { ...(target && typeof target === 'object' ? target : {}) };
  for (const key of Object.keys(patch)) {
    out[key] = deepMerge(out[key], patch[key]);
  }
  return out;
}

async function anthropic(apiKey, body) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`anthropic ${res.status}: ${text.slice(0, 500)}`);
  return JSON.parse(text);
}

function extractText(message) {
  return (message.content || [])
    .filter(c => c.type === 'text')
    .map(c => c.text)
    .join('');
}

function parseJSON(text, fallback) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1] : text;
  const obj = candidate.match(/\{[\s\S]*\}/);
  const arr = candidate.match(/\[[\s\S]*\]/);
  const pick = obj && arr ? (obj.index < arr.index ? obj[0] : arr[0]) : (obj ? obj[0] : arr ? arr[0] : null);
  if (!pick) return fallback;
  try { return JSON.parse(pick); } catch { return fallback; }
}

async function ghFetch(token, url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'user-agent': 'infobae-actualizar',
      ...(init.headers || {})
    }
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`github ${init.method || 'GET'} ${url} ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : {};
}

async function readFromGitHub(token, repo, branch) {
  const result = {};
  for (const [key, path] of Object.entries(DATA_PATHS)) {
    const data = await ghFetch(token, `https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`);
    result[key] = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
  }
  return result;
}

function readFromDisk() {
  const root = process.cwd();
  const result = {};
  for (const [key, path] of Object.entries(DATA_PATHS)) {
    result[key] = JSON.parse(readFileSync(join(root, path), 'utf8'));
  }
  return result;
}

async function commitToGitHub(token, repo, branch, updates, message) {
  const base = `https://api.github.com/repos/${repo}`;
  const ref = await ghFetch(token, `${base}/git/refs/heads/${branch}`);
  const parentSha = ref.object.sha;
  const parentCommit = await ghFetch(token, `${base}/git/commits/${parentSha}`);
  const baseTreeSha = parentCommit.tree.sha;

  const treeEntries = [];
  for (const [key, content] of Object.entries(updates)) {
    const body = JSON.stringify(content, null, 2) + '\n';
    const blob = await ghFetch(token, `${base}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify({ content: body, encoding: 'utf-8' })
    });
    treeEntries.push({ path: DATA_PATHS[key], mode: '100644', type: 'blob', sha: blob.sha });
  }

  const tree = await ghFetch(token, `${base}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeEntries })
  });

  const commit = await ghFetch(token, `${base}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: tree.sha, parents: [parentSha] })
  });

  await ghFetch(token, `${base}/git/refs/heads/${branch}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: commit.sha })
  });

  return commit.sha;
}

async function faseMonitor(apiKey) {
  const prompt = `Buscá novedades de las últimas 2 semanas en estas áreas, todas relevantes para una redacción argentina con cobertura internacional:

- CPJ (Committee to Protect Journalists) — casos de libertad de prensa en Argentina, Colombia, Venezuela
- ANMaC (Argentina) — normativa sobre armas y material sensible
- ENACOM (Argentina) — resoluciones de telecomunicaciones, Starlink, satelital
- RSF LATAM (Reporteros Sin Fronteras) — seguridad para periodistas en América Latina
- FOPEA (Foro de Periodismo Argentino) — activaciones de protocolo, amenazas a periodistas
- C2PA / IPTC — novedades en autenticidad de contenido digital
- Rosario narcotráfico — operativos, detenciones, causas judiciales
- Starlink Argentina — cambios regulatorios o de servicio
- Dart Center / JTSN — apoyo psicológico a periodistas

Descartá todo lo de relevancia baja. Retené alta y media.

Clasificá la CONFIANZA de cada hallazgo:
- "primaria": boletín oficial, resolución publicada, paper peer-reviewed, comunicado institucional del organismo mencionado.
- "secundaria": nota periodística de medio establecido con cita directa a fuente primaria.
- "terciaria": opinión, tuit, blog, foro, nota sin fuente directa, refrito.

Respondé EXCLUSIVAMENTE con un JSON array válido, sin texto previo ni posterior, sin markdown:
[{"fuente":"CPJ","titulo":"...","fecha":"YYYY-MM-DD","url":"https://...","resumen":"2-3 líneas","relevancia":"alta|media","confianza":"primaria|secundaria|terciaria"}]

Si no hay hallazgos, respondé [].`;

  const res = await anthropic(apiKey, {
    model: MODEL,
    max_tokens: 4000,
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 12 }],
    messages: [{ role: 'user', content: prompt }]
  });

  return parseJSON(extractText(res), []);
}

async function faseGeneracion(apiKey, findings, current, throttled) {
  const lastNoticia = current.noticias[0]?.fecha || '2029-04-17';
  const lastActividad = current.actividad[0]?.fecha || '2029-04-17 09:00';

  const utiles = (findings || []).filter(f => f.confianza === 'primaria' || f.confianza === 'secundaria');

  const findingsBlock = throttled
    ? 'MODO THROTTLE (auditoría humana desactualizada): ignorá los hallazgos del monitor. Generá solo contenido operacional de los personajes — sin extrapolaciones del mundo real.'
    : utiles.length
      ? `Tenés estos hallazgos con confianza primaria o secundaria — usalos como base factual verificable. Traducí al universo 2029 sin inventar datos. Los hallazgos terciarios se descartan.\n${JSON.stringify(utiles, null, 2)}`
      : 'No hay hallazgos con confianza primaria o secundaria. Generá contenido operacional puro: qué hicieron los personajes, sin referenciar normativas ni eventos que no figuren en los hechos establecidos.';

  const tarea = throttled
    ? 'Generá: 1 noticia y 1 entrada de actividad. Nada más. Solo oraciones [operacional]. Campo notificacion: null.'
    : 'Generá: 2 noticias, 2 entradas de actividad, 1 notificación.';

  const prompt = `Sos el generador de contenido diegético del proyecto Infobae Interna 2029.

CONTEXTO DEL UNIVERSO
Personajes (solo estos, ninguno más): Mondini (corresponsal BA), Fiorella (seg. digital BA), Villafañe (operaciones BA), Pollastri (legales BA), Roca (verificación/OSINT Bogotá), Zelaya (editor guardia noche Madrid), Peralta (formación BA), Quiroga (freelancer liaison Lima), Velásquez (fixer externo Arauca, solo Signal).
Teatros: ARQ-042 (Arauca/Apure, cerrado), ROS-038 (Rosario, en curso).
Normativa citable: Ley 20.429, Decreto 395/75, Res. ANMaC 83/2023, Disp. RENAR 883/11, Res. ENACOM 955/2025, Berkeley Protocol 2022. Ninguna más.

ESTADO ACTUAL DEL MUNDO (respetar ubicaciones y estados — no mover personajes que están en descanso)
${JSON.stringify(current.estadoMundo, null, 2)}

HECHOS ESTABLECIDOS (no contradecir — son canon)
${JSON.stringify(current.hechos, null, 2)}

HALLAZGOS DE INTELIGENCIA
${findingsBlock}

ÚLTIMA ENTRADA EXISTENTE
- noticias: fecha más reciente ${lastNoticia}
- actividad: fecha más reciente ${lastActividad}

REGLAS
- Fechas: posteriores a las últimas pero dentro del mismo ciclo semanal (1-5 días después).
- Registro técnico institucional. Sin marketing. Sin drama. Sin adjetivos de superioridad.
- El sistema no le habla al usuario: registra condiciones.
- Sin tecnología que no sea extensión de algo de 2024-2025.
- ETIQUETADO OBLIGATORIO: clasificá cada oración como [operacional] (acción concreta de un personaje del elenco) o [contextual] (afirmación sobre el mundo real: normas, eventos externos, datos). Cada oración arranca con su etiqueta entre corchetes. No incluyas oraciones [contextual] que no estén respaldadas por un hallazgo del monitor con confianza primaria o secundaria.

ESQUEMAS (respetar nombres de campos)
Noticia: { "fecha": "YYYY-MM-DD", "tag": "MAYÚSCULAS", "titulo": "...", "texto": "[operacional] ... [contextual] ..." }
Actividad: { "fecha": "YYYY-MM-DD HH:MM", "usuario": "inicial. apellido", "accion": "[operacional] ..." }
Notificación: { "tiempo": "hace Nh" | "ayer HH:MM", "usuario": "inicial. apellido", "texto": "[operacional] ...", "leida": false }

TAREA
${tarea}

Respondé EXCLUSIVAMENTE con JSON válido, sin markdown ni texto adicional:
{"noticias":[...],"actividad":[...],"notificacion":{...} | null}`;

  const res = await anthropic(apiKey, {
    model: MODEL,
    max_tokens: 2500,
    messages: [{ role: 'user', content: prompt }]
  });

  return parseJSON(extractText(res), { noticias: [], actividad: [], notificacion: null });
}

async function faseValidacion(apiKey, generated, current, findings) {
  const items = [
    ...generated.noticias.map(c => ({ tipo: 'noticia', contenido: c })),
    ...generated.actividad.map(c => ({ tipo: 'actividad', contenido: c }))
  ];
  if (generated.notificacion) items.push({ tipo: 'notificacion', contenido: generated.notificacion });

  const system = `Sos el subagente de validación del proyecto Infobae Interna 2029.
Revisá el contenido generado contra estas reglas:

REGLA 1 — FACT-CHECK: El contenido NO puede inventar leyes, resoluciones, papers, organizaciones ni herramientas que no existan. Si referencia una normativa, debe ser una ya citada en el proyecto (Ley 20.429, Decreto 395/75, Res. ANMaC 83/2023, Disp. RENAR 883/11, Res. ENACOM 955/2025, Berkeley Protocol 2022). Si no está en esta lista, RECHAZAR el item.

REGLA 2 — DIEGESIS: Solo los 9 personajes conocidos pueden aparecer (Mondini, Fiorella, Villafañe, Pollastri, Roca, Zelaya, Peralta, Quiroga, Velásquez). No inventar personas nuevas. Los teatros activos son ARQ-042 (cerrado) y ROS-038 (en curso). No inventar teatros nuevos sin hallazgo real que lo justifique.

REGLA 3 — ANTI-SLOP: Sin "es importante", "sin dudas", "claramente", adjetivos de superioridad, preguntas retóricas, metáforas de viaje. Registro técnico institucional. Si suena a app o marketing, RECHAZAR.

REGLA 4 — HEATED-FICTION: El contenido debe sentirse como un martes de 2029, no como ciencia ficción. Sin tecnología que no exista hoy por extensión. Sin espectacularidad.

REGLA 5 — CRONOLOGÍA: Las fechas generadas deben ser posteriores a la última fecha en los JSON existentes y anteriores a la fecha actual del sistema.

REGLA 6 — ESTADO-MUNDO: Verificá que ningún personaje aparezca en un lugar incompatible con su ubicación actual en el estado-mundo. Si Mondini está en "descanso post-ARQ-042 hasta 2029-05-01", no puede estar desplegada. Si un personaje está en standby, no puede estar ejecutando una acción operativa. RECHAZAR si hay incompatibilidad.

REGLA 7 — HECHOS: Verificá que ningún item contradice un hecho establecido en la lista de hechos canónicos. Si un hecho dice que ARQ-042 cerró el 2029-04-17, no se puede generar contenido que lo muestre abierto después. RECHAZAR si hay contradicción.

REGLA 8 — ETIQUETADO: Rechazá cualquier oración marcada [contextual] que no tenga respaldo explícito en un hallazgo del monitor con confianza primaria o secundaria. Las oraciones [operacional] no necesitan respaldo externo — son ficción del mundo. Si una oración no tiene etiqueta, RECHAZAR el item por formato incorrecto.

Para cada item, respondé SOLO con JSON:
{ "items": [{ "contenido": {...}, "aprobado": true/false, "razon": "..." }] }

Rechazá sin piedad. Es preferible publicar 0 items a publicar 1 que rompa la coherencia.`;

  const userMessage = `Fecha de referencia (última entrada de cada feed):
- noticias: ${current.noticias[0]?.fecha || 'n/a'}
- actividad: ${current.actividad[0]?.fecha || 'n/a'}

Estado actual del mundo:
${JSON.stringify(current.estadoMundo, null, 2)}

Hechos canónicos:
${JSON.stringify(current.hechos, null, 2)}

Hallazgos del monitor (con confianza para evaluar respaldo de oraciones [contextual]):
${JSON.stringify(findings || [], null, 2)}

Items a validar (preservá el orden en la respuesta):
${JSON.stringify(items, null, 2)}`;

  const res = await anthropic(apiKey, {
    model: MODEL,
    max_tokens: 3000,
    system,
    messages: [{ role: 'user', content: userMessage }]
  });

  const parsed = parseJSON(extractText(res), { items: [] });
  const verdicts = parsed.items || [];

  return items.map((it, i) => ({
    ...it,
    aprobado: Boolean(verdicts[i]?.aprobado),
    razon: verdicts[i]?.razon || 'sin dictamen'
  }));
}

async function faseConsolidacion(apiKey, approved, current, findings) {
  const prompt = `Sos el consolidador de estado del proyecto Infobae Interna 2029.

Items recién aprobados (ya limpios de etiquetas):
${JSON.stringify(approved.map(a => ({ tipo: a.tipo, contenido: a.contenido })), null, 2)}

Estado actual del mundo:
${JSON.stringify(current.estadoMundo, null, 2)}

Hechos canónicos existentes (no duplicar):
${JSON.stringify(current.hechos, null, 2)}

Hallazgos del monitor (para distinguir hechos reales vs diegéticos):
${JSON.stringify(findings || [], null, 2)}

TAREA
1. Derivá un patch parcial para estado-mundo.json reflejando cambios concretos que implican los items aprobados: ubicación de personajes que se movieron, despliegues que abrieron/cerraron, amenazas agregadas o removidas. NO toques ultima_auditoria_humana. Si no hay cambios, devolvé {} en el patch.
2. Generá la lista de hechos nuevos a agregar a hechos.json. Un hecho por línea, con fecha (YYYY-MM-DD) y tipo: "real" si viene de un hallazgo del monitor con confianza primaria o secundaria, "diegetico" si es interno del mundo. No repitas hechos ya presentes. Si no hay hechos nuevos, devolvé [].

Formato de patch: árbol parcial que se mergea sobre estado-mundo.json. Por ejemplo, si Mondini viajó a Rosario:
{ "personajes": { "mondini": { "ubicacion": "Rosario", "estado": "operativo" } } }

Respondé EXCLUSIVAMENTE con JSON válido, sin markdown:
{"estado_mundo_patch": {...}, "hechos_nuevos": [{"fecha":"YYYY-MM-DD","hecho":"...","tipo":"diegetico|real"}]}`;

  const res = await anthropic(apiKey, {
    model: MODEL,
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  });

  return parseJSON(extractText(res), { estado_mundo_patch: {}, hechos_nuevos: [] });
}

function mergeAndTrim(current, approved) {
  const noticiasNuevas = approved.filter(a => a.tipo === 'noticia').map(a => a.contenido);
  const actividadNuevas = approved.filter(a => a.tipo === 'actividad').map(a => a.contenido);
  const notificacionNueva = approved.filter(a => a.tipo === 'notificacion').map(a => a.contenido)[0];

  const existingIds = new Set(current.notificaciones.map(n => n.id));
  let nextId = 1;
  while (existingIds.has(`n${nextId}`)) nextId += 1;

  const notificaciones = notificacionNueva
    ? [{ id: `n${nextId}`, ...notificacionNueva }, ...current.notificaciones]
    : current.notificaciones;

  return {
    noticias: [...noticiasNuevas, ...current.noticias].slice(0, MAX_NOTICIAS),
    actividad: [...actividadNuevas, ...current.actividad].slice(0, MAX_ACTIVIDAD),
    notificaciones: notificaciones.slice(0, MAX_NOTIFICACIONES)
  };
}

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const dry = url.searchParams.get('dry') === '1' || url.searchParams.get('dry') === 'true';

  const apiKey = process.env.VITE_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;
  const ghToken = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || 'nbronzina/infobae';
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!apiKey) return res.status(500).json({ error: 'missing VITE_ANTHROPIC_API_KEY' });
  if (!ghToken && !dry) return res.status(500).json({ error: 'missing GITHUB_TOKEN (set dry=1 for local test)' });

  const diag = {
    phase: null, findings: 0, diasDesdeAuditoria: null,
    throttled: false, paused: false,
    generated: null, approved: 0, rejected: 0, commit: null, dry
  };

  try {
    diag.phase = 'monitor';
    const findings = await faseMonitor(apiKey);
    diag.findings = findings.length;

    diag.phase = 'read';
    const current = ghToken
      ? await readFromGitHub(ghToken, repo, branch)
      : readFromDisk();

    const dias = diasDesde(current.estadoMundo?.ultima_auditoria_humana);
    diag.diasDesdeAuditoria = dias;

    if (dias > PAUSE_DIAS) {
      diag.paused = true;
      return res.status(200).json({
        status: 'paused',
        razon: `${dias} días sin auditoría humana (umbral ${PAUSE_DIAS}). Solo monitor, sin generación.`,
        ...diag,
        hallazgos: findings
      });
    }

    diag.throttled = dias > THROTTLE_DIAS;

    await new Promise(r => setTimeout(r, 65000));

    diag.phase = 'generacion';
    const generated = await faseGeneracion(apiKey, findings, current, diag.throttled);
    diag.generated = {
      noticias: generated.noticias?.length || 0,
      actividad: generated.actividad?.length || 0,
      notificacion: generated.notificacion ? 1 : 0
    };

    await new Promise(r => setTimeout(r, 65000));

    diag.phase = 'validacion';
    const validated = await faseValidacion(apiKey, generated, current, findings);
    const approvedRaw = validated.filter(v => v.aprobado);
    const approved = approvedRaw.map(a => ({
      ...a,
      contenido: { ...cleanContent(a.contenido), origen: 'auto' }
    }));
    diag.approved = approved.length;
    diag.rejected = validated.length - approved.length;

    if (approved.length === 0) {
      return res.status(200).json({ status: 'no-changes', ...diag, verdicts: validated });
    }

    await new Promise(r => setTimeout(r, 65000));

    diag.phase = 'consolidacion';
    const consolidado = await faseConsolidacion(apiKey, approved, current, findings);

    const merged = mergeAndTrim(current, approved);
    const nuevoEstadoMundo = deepMerge(current.estadoMundo, consolidado.estado_mundo_patch || {});
    nuevoEstadoMundo.ultima_auditoria_humana = current.estadoMundo.ultima_auditoria_humana;
    const nuevosHechos = [...current.hechos, ...(consolidado.hechos_nuevos || [])];

    const updates = {
      noticias: merged.noticias,
      actividad: merged.actividad,
      notificaciones: merged.notificaciones,
      estadoMundo: nuevoEstadoMundo,
      hechos: nuevosHechos
    };

    if (dry) {
      return res.status(200).json({ status: 'dry-run', ...diag, verdicts: validated, updates });
    }

    diag.phase = 'publicacion';
    const commitSha = await commitToGitHub(
      ghToken, repo, branch, updates,
      `Actualizar feeds, estado-mundo y hechos (${approved.length} items)`
    );
    diag.commit = commitSha;

    return res.status(200).json({ status: 'ok', ...diag });
  } catch (e) {
    return res.status(500).json({ status: 'error', ...diag, error: e.message });
  }
}
