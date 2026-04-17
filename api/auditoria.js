export const maxDuration = 30;

const ESTADO_MUNDO_PATH = 'src/data/estado-mundo.json';

async function ghFetch(token, url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'user-agent': 'infobae-auditoria',
      ...(init.headers || {})
    }
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`github ${init.method || 'GET'} ${url} ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : {};
}

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const key = url.searchParams.get('key');
  const expected = process.env.AUDIT_KEY;

  if (!expected) return res.status(500).json({ error: 'AUDIT_KEY not configured on server' });
  if (!key || key !== expected) return res.status(401).json({ error: 'unauthorized' });

  const ghToken = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO || 'nbronzina/infobae';
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!ghToken) return res.status(500).json({ error: 'missing GITHUB_TOKEN' });

  try {
    const base = `https://api.github.com/repos/${repo}`;
    const existing = await ghFetch(ghToken, `${base}/contents/${ESTADO_MUNDO_PATH}?ref=${branch}`);
    const estadoMundo = JSON.parse(Buffer.from(existing.content, 'base64').toString('utf8'));

    const hoy = new Date().toISOString().slice(0, 10);
    const anterior = estadoMundo.ultima_auditoria_humana || null;

    if (anterior === hoy) {
      return res.status(200).json({ status: 'no-change', ultima_auditoria_humana: hoy });
    }

    estadoMundo.ultima_auditoria_humana = hoy;
    const nuevoContenido = JSON.stringify(estadoMundo, null, 2) + '\n';

    const commit = await ghFetch(ghToken, `${base}/contents/${ESTADO_MUNDO_PATH}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `Auditoría humana registrada: ${hoy}`,
        content: Buffer.from(nuevoContenido, 'utf8').toString('base64'),
        sha: existing.sha,
        branch
      })
    });

    return res.status(200).json({
      status: 'ok',
      anterior,
      ultima_auditoria_humana: hoy,
      commit: commit.commit?.sha || null
    });
  } catch (e) {
    return res.status(500).json({ status: 'error', error: e.message });
  }
}
