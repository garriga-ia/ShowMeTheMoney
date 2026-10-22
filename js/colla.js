/**
 * COLLA.JS - Dades dels personatges i generador d'avatars SVG interactius
 */

function makeAvatarSVG(o) {
  const hairStyles = {
    short: `<path d="M9 22c0-9 6-14 15-14s15 5 15 14c-4-5-9-7-15-7s-11 2-15 7z" fill="${o.hair}"/>`,
    curly: `<g fill="${o.hair}"><circle cx="12" cy="17" r="6"/><circle cx="19" cy="11" r="6.5"/><circle cx="29" cy="11" r="6.5"/><circle cx="36" cy="17" r="6"/><circle cx="24" cy="9" r="6"/></g>`,
    long:  `<path d="M8 26c-1-12 5-19 16-19s17 7 16 19v14c-3 2-5 1-6-3V23c-4-2-8-4-12-8-3 4-6 6-9 8v14c-1 4-3 5-5 3z" fill="${o.hair}"/>`,
    bun:   `<g fill="${o.hair}"><circle cx="24" cy="5" r="5"/><path d="M9 23c0-10 6-15 15-15s15 5 15 15c-5-5-9-7-15-7s-10 2-15 7z"/></g>`
  };

  const hair = hairStyles[o.style] || hairStyles.short;
  const back = o.style === 'long' ? hair : '';
  const front = o.style === 'long' ? `<path d="M10 22c3-1 9-3 14-9 4 5 9 8 14 9-2-9-7-14-14-14s-12 5-14 14z" fill="${o.hair}"/>` : hair;
  const glasses = o.glasses ? `<g fill="none" stroke="#2b2b2b" stroke-width="1.6"><circle cx="18" cy="26" r="4.2"/><circle cx="30" cy="26" r="4.2"/><path d="M22 26h4"/></g>` : '';

  return `<svg viewBox="0 0 48 48" class="avatar" aria-hidden="true">
    <rect width="48" height="48" fill="${o.bg}"/>
    ${back}
    <path d="M6 48c1-9 8-13 18-13s17 4 18 13z" fill="${o.shirt}"/>
    <rect x="20" y="30" width="8" height="7" rx="3" fill="${o.skin}"/>
    <ellipse cx="24" cy="24" rx="11" ry="12" fill="${o.skin}"/>
    ${front}
    <circle cx="19" cy="26" r="1.5" fill="#222"/>
    <circle cx="29" cy="26" r="1.5" fill="#222"/>
    ${glasses}
    <path d="${o.mouth}" stroke="#8a3b2e" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </svg>`;
}

const COLLA = {
  marc: {
    key: "marc",
    name: "Marc",
    role: "el calculador",
    tagline: "Fa números abans de gastar",
    color: "var(--n-marc)",
    svg: makeAvatarSVG({bg: "#cfe3f2", skin: "#e8b98f", hair: "#3a2a20", style: "short", shirt: "#2f5d8a", glasses: true, mouth: "M20 32q4 2.5 8 0"})
  },
  nil: {
    key: "nil",
    name: "Nil",
    role: "l'impulsiu",
    tagline: "FOMO i ganes de viure",
    color: "var(--n-nil)",
    svg: makeAvatarSVG({bg: "#fde0b8", skin: "#c98f66", hair: "#1d1a18", style: "curly", shirt: "#d9531e", glasses: false, mouth: "M19 31q5 5 10 0"})
  },
  marta: {
    key: "marta",
    name: "Marta",
    role: "la prudent",
    tagline: "Primer el coixí de seguretat",
    color: "var(--n-marta)",
    svg: makeAvatarSVG({bg: "#d9efd2", skin: "#f0c9a6", hair: "#7a4a21", style: "long", shirt: "#3f8f5a", glasses: false, mouth: "M20 32q4 2 8 0"})
  },
  aina: {
    key: "aina",
    name: "Aina",
    role: "la que s'ho mira tot",
    tagline: "Llegeix la lletra petita",
    color: "var(--n-aina)",
    svg: makeAvatarSVG({bg: "#ecd9f2", skin: "#8d5a3b", hair: "#201512", style: "bun", shirt: "#7b3f98", glasses: false, mouth: "M20 32q4 1.5 8 0"})
  },
  pau: {
    key: "pau",
    name: "Pau",
    role: "el que ja ha treballat",
    tagline: "Experiència real al món laboral",
    color: "var(--n-pau)",
    svg: makeAvatarSVG({bg: "#f5e7c0", skin: "#d9a577", hair: "#8a5a2b", style: "short", shirt: "#b8891a", glasses: false, mouth: "M20 31q4 3 8 0"})
  },
  me: {
    key: "me",
    name: "Tu",
    role: "protagonista",
    tagline: "Pren les decisions",
    color: "var(--teal)",
    svg: makeAvatarSVG({bg: "#f7e8a6", skin: "#e2ac82", hair: "#46352a", style: "short", shirt: "#0f766e", glasses: false, mouth: "M20 31q4 3 8 0"})
  }
};
