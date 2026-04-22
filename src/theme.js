// Paleta por modo. Se consume desde los componentes con themeFor(modo).
// Los nombres son semánticos, no literales — lo que cambia entre modos
// no es sólo el color, es la jerarquía visual.

export const CAMPO = {
  modo: 'campo',
  bg: '#0d0d0d',
  bgCard: '#141414',
  bgAccent: '#1a1a1a',
  bgElevated: '#1f1f1f',
  bgInput: '#1a1a1a',
  border: '#262626',
  borderStrong: '#3a3a3a',
  borderFocus: '#f18b1e',
  text: '#e8e4db',
  textSecondary: '#a8a096',
  textMeta: '#8a8472',
  accent: '#f18b1e',
  alert: '#e85656',
  alertBg: '#2a1515',
  vigente: '#8aa861',
  vigenteBg: '#1a2310',
  revision: '#c89a4b',
  revisionBg: '#241a0b',
  info: '#8aa8c2',
  infoBg: '#111a22',
  docLink: '#e8e4db'
};

export const REDACCION = {
  modo: 'redaccion',
  bg: '#f8f5ec',
  bgCard: '#f8f5ec',
  bgAccent: '#f0ecde',
  bgElevated: '#ece7d6',
  bgInput: '#f0ecde',
  border: '#d9d4c2',
  borderStrong: '#1f1f1f',
  borderFocus: '#1f1f1f',
  text: '#1f1f1f',
  textSecondary: '#5a544c',
  textMeta: '#6b6454',
  accent: '#1f1f1f',
  alert: '#bd2828',
  alertBg: '#f5d5d5',
  vigente: '#5a6e3c',
  vigenteBg: '#e8f0de',
  revision: '#8a6d2b',
  revisionBg: '#f5edd5',
  info: '#3d5a77',
  infoBg: '#e8eef5',
  docLink: '#1f1f1f'
};

export function themeFor(modo) {
  return modo === 'campo' ? CAMPO : REDACCION;
}

export const SERIF = "'Fraunces', Georgia, serif";
export const SANS = "'IBM Plex Sans', system-ui, sans-serif";
export const MONO = "'JetBrains Mono', Consolas, monospace";

// Dimensiones base por modo. Campo apunta a touch (Pixel ~5-6");
// redacción apunta a lectura en e-ink Boox.
export function sizesFor(modo) {
  const campo = modo === 'campo';
  return {
    campo,
    redaccion: !campo,
    touchMin: campo ? 48 : 44,
    buttonHeight: campo ? 52 : 40,
    padSm: campo ? 10 : 8,
    padMd: campo ? 14 : 12,
    padLg: campo ? 18 : 20,
    fsBody: campo ? 15 : 15,
    fsTitle: campo ? 22 : 26,
    fsSub: campo ? 14 : 14,
    fsMono: campo ? 12 : 11.5,
    fsMicro: campo ? 10.5 : 10.5,
    lhBody: campo ? 1.6 : 1.7,
    lhTitle: 1.3,
    maxReadCh: campo ? 'none' : '38em'
  };
}
