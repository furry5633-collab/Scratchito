/* ===== Scratchito · Biblioteca gráfica v2 — arte vectorial con volumen ===== */
const svg = s => 'data:image/svg+xml;base64,' +
  btoa(String.fromCharCode(...new TextEncoder().encode(s)));

/* Envoltorio con defs reutilizables: sombra de contacto y brillo suave */
const W = (inner, defs = '') => svg(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">` +
  `<defs>${defs}` +
  `<radialGradient id="sh" cx="50%" cy="50%"><stop offset="0%" stop-color="#1b2340" stop-opacity=".28"/><stop offset="100%" stop-color="#1b2340" stop-opacity="0"/></radialGradient>` +
  `<linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff" stop-opacity=".55"/><stop offset="60%" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
  `</defs>${inner}</svg>`);

const piso = (cy = 111, rx = 30) => `<ellipse cx="60" cy="${cy}" rx="${rx}" ry="6" fill="url(#sh)"/>`;

/* Ojos con iris, pupila y destello — la clave del aspecto "pro" */
const eye = (x, y, r = 8, look = 0, lid = 0) => `
 <ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.12}" fill="#fff"/>
 <ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.12}" fill="none" stroke="#2a3050" stroke-opacity=".16" stroke-width="1"/>
 <circle cx="${x + look}" cy="${y + r * .16}" r="${r * .52}" fill="#2B3350"/>
 <circle cx="${x + look - r * .18}" cy="${y - r * .18}" r="${r * .2}" fill="#fff" opacity=".95"/>
 ${lid ? `<path d="M${x - r} ${y - r * .3} a${r} ${r} 0 0 1 ${r * 2} 0 z" fill="#2a3050" opacity=".0"/>` : ''}`;
const eyes = (y = 50, sep = 14, r = 8, look = 0) => eye(60 - sep, y, r, look) + eye(60 + sep, y, r, look);
const smile = (y = 70, w = 16, d = 11) =>
  `<path d="M${60 - w} ${y} Q60 ${y + d} ${60 + w} ${y}" stroke="#7A4B2A" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".85"/>`;
const blush = (y = 64, o = .5) =>
  `<ellipse cx="34" cy="${y}" rx="8" ry="5" fill="#FF7B8A" opacity="${o}"/><ellipse cx="86" cy="${y}" rx="8" ry="5" fill="#FF7B8A" opacity="${o}"/>`;

/* ======================= PERSONAJES ======================= */
const gatoDefs = `
 <radialGradient id="gcuerpo" cx="38%" cy="28%"><stop offset="0%" stop-color="#FFC06A"/><stop offset="55%" stop-color="#F99B32"/><stop offset="100%" stop-color="#E07C18"/></radialGradient>
 <linearGradient id="gcola" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#F99B32"/><stop offset="100%" stop-color="#E07C18"/></linearGradient>`;
const gatoBase = (look, boca, patas) => `
 ${piso()}
 <path d="M96 92 q22 -6 16 -26" stroke="url(#gcola)" stroke-width="11" fill="none" stroke-linecap="round"/>
 <path d="M32 44 L27 16 L52 32 Z" fill="#F99B32" stroke="#C9761B" stroke-width="2.5" stroke-linejoin="round"/>
 <path d="M88 44 L93 16 L68 32 Z" fill="#F99B32" stroke="#C9761B" stroke-width="2.5" stroke-linejoin="round"/>
 <path d="M35 40 L33 25 L46 34 Z" fill="#FF9BA6" opacity=".75"/>
 <path d="M85 40 L87 25 L74 34 Z" fill="#FF9BA6" opacity=".75"/>
 <rect x="41" y="74" width="38" height="30" rx="14" fill="url(#gcuerpo)" stroke="#C9761B" stroke-width="2.5"/>
 ${patas}
 <ellipse cx="60" cy="52" rx="35" ry="31" fill="url(#gcuerpo)" stroke="#C9761B" stroke-width="2.5"/>
 <ellipse cx="60" cy="40" rx="27" ry="16" fill="url(#gloss)"/>
 ${eyes(50, 15, 8.5, look)}
 <path d="M54 61 h12 l-6 6 z" fill="#C9542B" stroke="#A53F1D" stroke-width="1.2" stroke-linejoin="round"/>
 ${boca}
 ${blush(66, .35)}
 <g stroke="#C9761B" stroke-width="2.2" stroke-linecap="round" opacity=".9">
  <path d="M24 58 H5 M24 65 H8 M96 58 h19 M96 65 h16"/></g>`;

let LIBRARY = [
  {
    name: 'Gatito', tags: ['animales'],
    costumes: [
      { name: 'gatito-a', src: W(gatoBase(0, smile(68, 13, 9), `<rect x="45" y="98" width="13" height="11" rx="5.5" fill="#E88B24" stroke="#C9761B" stroke-width="2"/><rect x="62" y="98" width="13" height="11" rx="5.5" fill="#E88B24" stroke="#C9761B" stroke-width="2"/>`), gatoDefs) },
      { name: 'gatito-b', src: W(gatoBase(2, `<ellipse cx="60" cy="72" rx="8" ry="9" fill="#8E3B33"/><ellipse cx="60" cy="75" rx="5" ry="5" fill="#FF8FA0"/>`, `<rect x="39" y="96" width="15" height="11" rx="5.5" fill="#E88B24" stroke="#C9761B" stroke-width="2" transform="rotate(-20 46 101)"/><rect x="66" y="96" width="15" height="11" rx="5.5" fill="#E88B24" stroke="#C9761B" stroke-width="2" transform="rotate(20 74 101)"/>`), gatoDefs) }
    ]
  },
  {
    name: 'Perrito', tags: ['animales'],
    costumes: [
      {
        name: 'perrito-a', src: W(`
     ${piso()}
     <path d="M92 94 q20 -4 14 -22" stroke="#A9703F" stroke-width="10" fill="none" stroke-linecap="round"/>
     <ellipse cx="27" cy="56" rx="12" ry="22" fill="#8B5E3C"/><ellipse cx="93" cy="56" rx="12" ry="22" fill="#8B5E3C"/>
     <rect x="43" y="76" width="34" height="28" rx="13" fill="url(#pc)" stroke="#9A6534" stroke-width="2.5"/>
     <ellipse cx="60" cy="52" rx="33" ry="30" fill="url(#pc)" stroke="#9A6534" stroke-width="2.5"/>
     <ellipse cx="60" cy="41" rx="25" ry="15" fill="url(#gloss)"/>
     ${eyes(48, 14, 8)}
     <ellipse cx="60" cy="68" rx="15" ry="11" fill="#F6E5D3"/>
     <ellipse cx="60" cy="62" rx="7.5" ry="5.5" fill="#33384F"/>
     <path d="M60 67 v5 M60 72 q-6 5 -11 1 M60 72 q6 5 11 1" stroke="#7A5638" stroke-width="2.6" fill="none" stroke-linecap="round"/>
     <rect x="46" y="98" width="13" height="11" rx="5.5" fill="#B57C48" stroke="#9A6534" stroke-width="2"/>
     <rect x="62" y="98" width="13" height="11" rx="5.5" fill="#B57C48" stroke="#9A6534" stroke-width="2"/>`,
          `<radialGradient id="pc" cx="38%" cy="28%"><stop offset="0%" stop-color="#E3B183"/><stop offset="60%" stop-color="#C08552"/><stop offset="100%" stop-color="#A86F41"/></radialGradient>`)
      },
      {
        name: 'perrito-b', src: W(`
     ${piso()}
     <path d="M92 90 q22 -10 12 -26" stroke="#A9703F" stroke-width="10" fill="none" stroke-linecap="round"/>
     <ellipse cx="25" cy="62" rx="12" ry="22" fill="#8B5E3C" transform="rotate(-22 25 62)"/>
     <ellipse cx="95" cy="62" rx="12" ry="22" fill="#8B5E3C" transform="rotate(22 95 62)"/>
     <rect x="43" y="76" width="34" height="28" rx="13" fill="url(#pc)" stroke="#9A6534" stroke-width="2.5"/>
     <ellipse cx="60" cy="52" rx="33" ry="30" fill="url(#pc)" stroke="#9A6534" stroke-width="2.5"/>
     <ellipse cx="60" cy="41" rx="25" ry="15" fill="url(#gloss)"/>
     ${eyes(48, 14, 8, 1)}
     <ellipse cx="60" cy="68" rx="15" ry="11" fill="#F6E5D3"/>
     <ellipse cx="60" cy="62" rx="7.5" ry="5.5" fill="#33384F"/>
     <path d="M49 72 q11 13 22 0 z" fill="#8E3B33"/>
     <path d="M55 78 q5 10 10 0 z" fill="#FF8FA0"/>
     <rect x="42" y="96" width="14" height="12" rx="6" fill="#B57C48" stroke="#9A6534" stroke-width="2" transform="rotate(-14 49 102)"/>
     <rect x="64" y="96" width="14" height="12" rx="6" fill="#B57C48" stroke="#9A6534" stroke-width="2" transform="rotate(14 71 102)"/>`,
          `<radialGradient id="pc" cx="38%" cy="28%"><stop offset="0%" stop-color="#E3B183"/><stop offset="60%" stop-color="#C08552"/><stop offset="100%" stop-color="#A86F41"/></radialGradient>`)
      }
    ]
  },
  {
    name: 'Robot', tags: ['fantasía'],
    costumes: [
      {
        name: 'robot-a', src: W(`
     ${piso()}
     <rect x="57.5" y="10" width="5" height="14" rx="2.5" fill="#8794AA"/>
     <circle cx="60" cy="9" r="5.5" fill="#FF6B6B"/><circle cx="58.4" cy="7.4" r="1.8" fill="#FFC9C9"/>
     <rect x="18" y="72" width="16" height="9" rx="4.5" fill="#8794AA"/><rect x="86" y="72" width="16" height="9" rx="4.5" fill="#8794AA"/>
     <rect x="37" y="74" width="46" height="30" rx="11" fill="url(#rb)" stroke="#6E7C93" stroke-width="2.5"/>
     <rect x="47" y="82" width="26" height="14" rx="4" fill="#4A576D" opacity=".5"/>
     <rect x="29" y="24" width="62" height="48" rx="14" fill="url(#rb)" stroke="#6E7C93" stroke-width="2.5"/>
     <rect x="38" y="35" width="44" height="22" rx="8" fill="#232C3D"/>
     <rect x="38" y="35" width="44" height="11" rx="8" fill="#fff" opacity=".10"/>
     <circle cx="51" cy="46" r="5.5" fill="#4CE0B3"/><circle cx="69" cy="46" r="5.5" fill="#4CE0B3"/>
     <circle cx="49.4" cy="44.4" r="1.8" fill="#DFFFF5"/><circle cx="67.4" cy="44.4" r="1.8" fill="#DFFFF5"/>
     <rect x="29" y="24" width="62" height="24" rx="14" fill="url(#gloss)"/>
     <rect x="44" y="105" width="14" height="7" rx="3.5" fill="#6E7C93"/><rect x="62" y="105" width="14" height="7" rx="3.5" fill="#6E7C93"/>`,
          `<linearGradient id="rb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#D5DDEA"/><stop offset="55%" stop-color="#B2BECF"/><stop offset="100%" stop-color="#93A1B6"/></linearGradient>`)
      },
      {
        name: 'robot-b', src: W(`
     ${piso()}
     <rect x="57.5" y="10" width="5" height="14" rx="2.5" fill="#8794AA"/>
     <circle cx="60" cy="9" r="5.5" fill="#FFD84C"/><circle cx="58.4" cy="7.4" r="1.8" fill="#FFF3C4"/>
     <rect x="16" y="58" width="16" height="9" rx="4.5" fill="#8794AA" transform="rotate(-25 24 62)"/>
     <rect x="88" y="58" width="16" height="9" rx="4.5" fill="#8794AA" transform="rotate(25 96 62)"/>
     <rect x="37" y="74" width="46" height="30" rx="11" fill="url(#rb)" stroke="#6E7C93" stroke-width="2.5"/>
     <rect x="47" y="82" width="26" height="14" rx="4" fill="#4A576D" opacity=".5"/>
     <rect x="29" y="24" width="62" height="48" rx="14" fill="url(#rb)" stroke="#6E7C93" stroke-width="2.5"/>
     <rect x="38" y="35" width="44" height="22" rx="8" fill="#232C3D"/>
     <rect x="45" y="44" width="12" height="4.5" rx="2.2" fill="#4CE0B3"/><rect x="63" y="44" width="12" height="4.5" rx="2.2" fill="#4CE0B3"/>
     <rect x="29" y="24" width="62" height="24" rx="14" fill="url(#gloss)"/>
     <rect x="44" y="105" width="14" height="7" rx="3.5" fill="#6E7C93"/><rect x="62" y="105" width="14" height="7" rx="3.5" fill="#6E7C93"/>`,
          `<linearGradient id="rb" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#D5DDEA"/><stop offset="55%" stop-color="#B2BECF"/><stop offset="100%" stop-color="#93A1B6"/></linearGradient>`)
      }
    ]
  },
  {
    name: 'Dino', tags: ['animales'],
    costumes: [
      {
        name: 'dino-a', src: W(`
     ${piso(113, 32)}
     <path d="M20 92 Q2 80 14 66 Q30 76 34 88 Z" fill="#3E9142"/>
     <ellipse cx="60" cy="78" rx="36" ry="25" fill="url(#dn)"/>
     <path d="M40 30 l7-13 7 13z M56 24 l7-13 7 13z M72 26 l7-13 7 13z" fill="#2E7D32"/>
     <circle cx="76" cy="46" r="25" fill="url(#dn)"/>
     <ellipse cx="72" cy="36" rx="17" ry="10" fill="url(#gloss)"/>
     <ellipse cx="58" cy="88" rx="24" ry="14" fill="#CFE9A8" opacity=".85"/>
     ${eye(84, 42, 8)}
     <path d="M66 56 q14 9 26 1" stroke="#256B29" stroke-width="3.2" fill="none" stroke-linecap="round"/>
     <circle cx="92" cy="50" r="2" fill="#256B29" opacity=".6"/>
     <rect x="44" y="96" width="14" height="15" rx="6" fill="#3E9142"/><rect x="68" y="96" width="14" height="15" rx="6" fill="#3E9142"/>`,
          `<radialGradient id="dn" cx="35%" cy="28%"><stop offset="0%" stop-color="#7FD683"/><stop offset="55%" stop-color="#55BE59"/><stop offset="100%" stop-color="#3E9142"/></radialGradient>`)
      },
      {
        name: 'dino-b', src: W(`
     ${piso(113, 32)}
     <path d="M20 86 Q0 72 12 58 Q30 70 34 82 Z" fill="#3E9142"/>
     <ellipse cx="60" cy="76" rx="36" ry="25" fill="url(#dn)"/>
     <path d="M40 28 l7-13 7 13z M56 22 l7-13 7 13z M72 24 l7-13 7 13z" fill="#2E7D32"/>
     <circle cx="76" cy="44" r="25" fill="url(#dn)"/>
     <ellipse cx="72" cy="34" rx="17" ry="10" fill="url(#gloss)"/>
     <ellipse cx="58" cy="86" rx="24" ry="14" fill="#CFE9A8" opacity=".85"/>
     ${eye(84, 40, 8, 1)}
     <path d="M64 50 q16 18 30 3 q-14 10 -30 -3z" fill="#8E3B33"/>
     <path d="M64 50 q16 18 30 3" stroke="#256B29" stroke-width="3" fill="none" stroke-linecap="round"/>
     <rect x="40" y="94" width="14" height="16" rx="6" fill="#3E9142" transform="rotate(-14 47 102)"/>
     <rect x="72" y="94" width="14" height="16" rx="6" fill="#3E9142" transform="rotate(14 79 102)"/>`,
          `<radialGradient id="dn" cx="35%" cy="28%"><stop offset="0%" stop-color="#7FD683"/><stop offset="55%" stop-color="#55BE59"/><stop offset="100%" stop-color="#3E9142"/></radialGradient>`)
      }
    ]
  },
  {
    name: 'Pelota', tags: ['objetos'],
    costumes: [
      { name: 'pelota-roja', src: W(`${piso(106, 26)}<circle cx="60" cy="58" r="40" fill="url(#pr)"/><path d="M24 42 q36 20 72 0" stroke="#fff" stroke-width="7" fill="none" opacity=".9" stroke-linecap="round"/><ellipse cx="46" cy="38" rx="16" ry="11" fill="#fff" opacity=".35"/>`, `<radialGradient id="pr" cx="35%" cy="28%"><stop offset="0%" stop-color="#FF8080"/><stop offset="55%" stop-color="#E94F4F"/><stop offset="100%" stop-color="#B93636"/></radialGradient>`) },
      { name: 'pelota-azul', src: W(`${piso(106, 26)}<circle cx="60" cy="58" r="40" fill="url(#pa)"/><path d="M24 42 q36 20 72 0" stroke="#fff" stroke-width="7" fill="none" opacity=".9" stroke-linecap="round"/><ellipse cx="46" cy="38" rx="16" ry="11" fill="#fff" opacity=".35"/>`, `<radialGradient id="pa" cx="35%" cy="28%"><stop offset="0%" stop-color="#8FC0FF"/><stop offset="55%" stop-color="#4C97FF"/><stop offset="100%" stop-color="#2F6FCC"/></radialGradient>`) },
      { name: 'balon', src: W(`${piso(106, 26)}<circle cx="60" cy="58" r="40" fill="url(#bl)"/><path d="M60 34 l15 11 -6 18h-18l-6-18z" fill="#2E3548"/><path d="M60 20v14M28 50l14 7M92 50l-14 7M44 94l7-16M76 94l-7-16" stroke="#2E3548" stroke-width="3.4" stroke-linecap="round"/><circle cx="60" cy="58" r="40" fill="none" stroke="#C2C9DA" stroke-width="2"/><ellipse cx="46" cy="38" rx="15" ry="10" fill="#fff" opacity=".4"/>`, `<radialGradient id="bl" cx="35%" cy="28%"><stop offset="0%" stop-color="#fff"/><stop offset="70%" stop-color="#F0F3F9"/><stop offset="100%" stop-color="#D6DCE8"/></radialGradient>`) }
    ]
  },
  {
    name: 'Nave', tags: ['objetos'],
    costumes: [
      {
        name: 'nave-a', src: W(`
     <path d="M36 66 l-16 26 q14 4 20 -6 z" fill="#E94F4F"/><path d="M84 66 l16 26 q-14 4 -20 -6 z" fill="#C93B3B"/>
     <path d="M60 8 q24 28 24 62 h-48 q0-34 24-62z" fill="url(#nv)" stroke="#95A3B8" stroke-width="2.5"/>
     <ellipse cx="60" cy="30" rx="13" ry="20" fill="#fff" opacity=".35"/>
     <circle cx="60" cy="46" r="11" fill="url(#cp)" stroke="#2E8EB8" stroke-width="2.5"/>
     <circle cx="56.5" cy="42.5" r="3.4" fill="#fff" opacity=".8"/>
     <rect x="48" y="70" width="24" height="9" rx="3" fill="#C3CDDC"/>
     <path d="M53 80 q7 20 7 30 q0-10 7-30z" fill="url(#fl)"/>`,
          `<linearGradient id="nv" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#fff"/><stop offset="55%" stop-color="#E8EEF6"/><stop offset="100%" stop-color="#C4CEDD"/></linearGradient>
      <radialGradient id="cp" cx="35%" cy="30%"><stop offset="0%" stop-color="#BFEAFF"/><stop offset="100%" stop-color="#5CB1D6"/></radialGradient>
      <linearGradient id="fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFD84C"/><stop offset="100%" stop-color="#FF6B18"/></linearGradient>`)
      },
      {
        name: 'nave-b', src: W(`
     <path d="M36 66 l-16 26 q14 4 20 -6 z" fill="#E94F4F"/><path d="M84 66 l16 26 q-14 4 -20 -6 z" fill="#C93B3B"/>
     <path d="M60 8 q24 28 24 62 h-48 q0-34 24-62z" fill="url(#nv)" stroke="#95A3B8" stroke-width="2.5"/>
     <ellipse cx="60" cy="30" rx="13" ry="20" fill="#fff" opacity=".35"/>
     <circle cx="60" cy="46" r="11" fill="url(#cp)" stroke="#2E8EB8" stroke-width="2.5"/>
     <circle cx="56.5" cy="42.5" r="3.4" fill="#fff" opacity=".8"/>
     <rect x="48" y="70" width="24" height="9" rx="3" fill="#C3CDDC"/>
     <path d="M50 80 q10 30 10 40 q0-10 10-40z" fill="url(#fl)"/>
     <path d="M55 82 q5 18 5 26 q0-8 5-26z" fill="#FFF3B0" opacity=".9"/>`,
          `<linearGradient id="nv" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#fff"/><stop offset="55%" stop-color="#E8EEF6"/><stop offset="100%" stop-color="#C4CEDD"/></linearGradient>
      <radialGradient id="cp" cx="35%" cy="30%"><stop offset="0%" stop-color="#BFEAFF"/><stop offset="100%" stop-color="#5CB1D6"/></radialGradient>
      <linearGradient id="fl" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFD84C"/><stop offset="100%" stop-color="#FF6B18"/></linearGradient>`)
      }
    ]
  },
  {
    name: 'Estrella', tags: ['objetos'],
    costumes: [
      { name: 'estrella', src: W(`<path d="M60 12 l14 29 32 4.5 -23 22 5.5 32 -28.5-15.5 -28.5 15.5 5.5-32 -23-22 32-4.5z" fill="url(#st)" stroke="#E0A800" stroke-width="3" stroke-linejoin="round"/><path d="M60 22 l10 21 -10 6 -10-6z" fill="#fff" opacity=".35"/>`, `<radialGradient id="st" cx="40%" cy="30%"><stop offset="0%" stop-color="#FFF3A8"/><stop offset="60%" stop-color="#FFD84C"/><stop offset="100%" stop-color="#F0B400"/></radialGradient>`) },
      { name: 'estrella-guiño', src: W(`<path d="M60 12 l14 29 32 4.5 -23 22 5.5 32 -28.5-15.5 -28.5 15.5 5.5-32 -23-22 32-4.5z" fill="url(#st)" stroke="#E0A800" stroke-width="3" stroke-linejoin="round"/>${eye(50, 54, 6.5)}<path d="M64 54 q6 -5 12 0" stroke="#2B3350" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M52 68 q8 9 16 0" stroke="#2B3350" stroke-width="3.2" fill="none" stroke-linecap="round"/>`, `<radialGradient id="st" cx="40%" cy="30%"><stop offset="0%" stop-color="#FFF3A8"/><stop offset="60%" stop-color="#FFD84C"/><stop offset="100%" stop-color="#F0B400"/></radialGradient>`) }
    ]
  },
  {
    name: 'Maga', tags: ['personas'],
    costumes: [
      {
        name: 'maga-a', src: W(`
     ${piso(113, 26)}
     <path d="M42 78 h36 l12 32 h-60z" fill="url(#rob)"/>
     <path d="M52 78 h16 l4 32 h-24z" fill="#fff" opacity=".12"/>
     <circle cx="60" cy="58" r="19" fill="url(#pi)"/>
     <path d="M41 56 q4 -18 19 -18 q15 0 19 18 q-8 -8 -19 -8 q-11 0 -19 8z" fill="#7B4B2A"/>
     ${eyes(57, 8, 5.5)}
     <path d="M55 68 q5 5 10 0" stroke="#A85A4A" stroke-width="2.6" fill="none" stroke-linecap="round"/>
     ${blush(64, .4)}
     <path d="M60 6 L88 44 H32 Z" fill="url(#hat)"/>
     <ellipse cx="60" cy="45" rx="30" ry="7" fill="#5D42B8"/>
     <path d="M52 30 l3 6 6 2 -6 2 -3 6 -3-6 -6-2 6-2z" fill="#FFE98A" opacity=".9"/>
     <rect x="84" y="46" width="4.5" height="46" rx="2.2" fill="#8B5E3C" transform="rotate(-16 86 68)"/>
     <circle cx="80" cy="44" r="8" fill="#FFF07A"/><circle cx="80" cy="44" r="13" fill="#FFF07A" opacity=".25"/>`,
          `<linearGradient id="rob" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#9C80FF"/><stop offset="100%" stop-color="#6A4FCB"/></linearGradient>
      <linearGradient id="hat" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8265E0"/><stop offset="100%" stop-color="#553CB0"/></linearGradient>
      <radialGradient id="pi" cx="38%" cy="30%"><stop offset="0%" stop-color="#FFE3C8"/><stop offset="100%" stop-color="#F0C49C"/></radialGradient>`)
      },
      {
        name: 'maga-b', src: W(`
     ${piso(113, 26)}
     <path d="M42 78 h36 l14 32 h-64z" fill="url(#rob)"/>
     <circle cx="60" cy="58" r="19" fill="url(#pi)"/>
     <path d="M41 56 q4 -18 19 -18 q15 0 19 18 q-8 -8 -19 -8 q-11 0 -19 8z" fill="#7B4B2A"/>
     ${eyes(57, 8, 5.5, 1)}
     <ellipse cx="60" cy="69" rx="5" ry="6" fill="#8E3B33"/>
     ${blush(64, .4)}
     <path d="M60 4 L92 44 H28 Z" fill="url(#hat)" transform="rotate(-6 60 30)"/>
     <ellipse cx="60" cy="45" rx="31" ry="7" fill="#5D42B8"/>
     <rect x="30" y="34" width="4.5" height="46" rx="2.2" fill="#8B5E3C" transform="rotate(16 32 56)"/>
     <circle cx="38" cy="32" r="9" fill="#FFF07A"/><circle cx="38" cy="32" r="15" fill="#FFF07A" opacity=".25"/>
     <path d="M52 20 l2 5 5 2 -5 2 -2 5 -2-5 -5-2 5-2z" fill="#FFF3C4"/>`,
          `<linearGradient id="rob" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#9C80FF"/><stop offset="100%" stop-color="#6A4FCB"/></linearGradient>
      <linearGradient id="hat" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#8265E0"/><stop offset="100%" stop-color="#553CB0"/></linearGradient>
      <radialGradient id="pi" cx="38%" cy="30%"><stop offset="0%" stop-color="#FFE3C8"/><stop offset="100%" stop-color="#F0C49C"/></radialGradient>`)
      }
    ]
  },
  {
    name: 'Fantasma', tags: ['fantasía'],
    costumes: [
      { name: 'fantasma-a', src: W(`<path d="M26 102 V56 a34 34 0 0 1 68 0 v46 l-11.5-10 -11 10 -11.5-10 -11 10 -12-10z" fill="url(#fg)"/><ellipse cx="60" cy="40" rx="22" ry="13" fill="#fff" opacity=".7"/>${eyes(54, 13, 8)}<ellipse cx="60" cy="74" rx="7" ry="9" fill="#4A5170"/>${blush(68, .25)}`, `<linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#D9DFF2"/></linearGradient>`) },
      { name: 'fantasma-b', src: W(`<path d="M26 102 V56 a34 34 0 0 1 68 0 v46 l-11.5-10 -11 10 -11.5-10 -11 10 -12-10z" fill="url(#fg)" opacity=".8"/><path d="M40 52 q7 -7 14 0 M66 52 q7 -7 14 0" stroke="#4A5170" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="74" rx="11" ry="8" fill="#4A5170"/>`, `<linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#C9D1EA"/></linearGradient>`) }
    ]
  },
  {
    name: 'Manzana', tags: ['comida'],
    costumes: [
      { name: 'manzana', src: W(`${piso(110, 24)}<path d="M60 34 q-32-11-32 28 0 36 32 46 32-10 32-46 0-39-32-28z" fill="url(#mz)"/><path d="M60 34 q3-15 18-19 q-2 15-18 19z" fill="#4CAF50"/><path d="M60 34 q3-15 18-19 q-8 12 -18 19z" fill="#3E8E41" opacity=".5"/><rect x="57.5" y="18" width="5" height="18" rx="2.5" fill="#7B4B27"/><ellipse cx="44" cy="52" rx="10" ry="15" fill="#fff" opacity=".28" transform="rotate(-20 44 52)"/>`, `<radialGradient id="mz" cx="35%" cy="28%"><stop offset="0%" stop-color="#FF7B6B"/><stop offset="55%" stop-color="#E33B3B"/><stop offset="100%" stop-color="#B02222"/></radialGradient>`) },
      { name: 'manzana-mordida', src: W(`${piso(110, 24)}<path d="M60 34 q-32-11-32 28 0 36 32 46 32-10 32-46 0-39-32-28z" fill="url(#mz)"/><path d="M92 58 a17 17 0 1 0 -2 20 q6-10 2-20z" fill="#FDF6EC"/><rect x="57.5" y="18" width="5" height="18" rx="2.5" fill="#7B4B27"/><ellipse cx="44" cy="52" rx="10" ry="15" fill="#fff" opacity=".28" transform="rotate(-20 44 52)"/>`, `<radialGradient id="mz" cx="35%" cy="28%"><stop offset="0%" stop-color="#FF7B6B"/><stop offset="55%" stop-color="#E33B3B"/><stop offset="100%" stop-color="#B02222"/></radialGradient>`) }
    ]
  },
  {
    name: 'Coche', tags: ['objetos'],
    costumes: [
      {
        name: 'coche', src: W(`${piso(104, 40)}
     <path d="M30 60 l13-20 q2-3 5-3 h26 q3 0 5 3 l14 20z" fill="url(#cab)"/>
     <path d="M34 58 l10-15 h13 v15z M63 58 v-15 h11 l11 15z" fill="#BFE0FF"/>
     <rect x="12" y="58" width="96" height="26" rx="11" fill="url(#car)"/>
     <rect x="12" y="58" width="96" height="11" rx="10" fill="#fff" opacity=".18"/>
     <circle cx="15" cy="70" r="4" fill="#FFE98A"/><circle cx="105" cy="70" r="3.5" fill="#FF7373"/>
     <circle cx="36" cy="86" r="13" fill="#2E3548"/><circle cx="84" cy="86" r="13" fill="#2E3548"/>
     <circle cx="36" cy="86" r="5.5" fill="#C8D0E0"/><circle cx="84" cy="86" r="5.5" fill="#C8D0E0"/>`,
          `<linearGradient id="car" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#78B4FF"/><stop offset="100%" stop-color="#3B7FE0"/></linearGradient>
      <linearGradient id="cab" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8FC2FF"/><stop offset="100%" stop-color="#5A9BF0"/></linearGradient>`)
      }
    ]
  },
  {
    name: 'Corazón', tags: ['objetos'],
    costumes: [
      { name: 'corazon', src: W(`<path d="M60 102 C8 68 20 26 46 28 c9 1 13 7 14 11 1-4 5-10 14-11 26-2 38 40-14 74z" fill="url(#hr)"/><ellipse cx="42" cy="46" rx="11" ry="8" fill="#fff" opacity=".35" transform="rotate(-30 42 46)"/>`, `<radialGradient id="hr" cx="35%" cy="28%"><stop offset="0%" stop-color="#FF8FA8"/><stop offset="55%" stop-color="#FF4D6D"/><stop offset="100%" stop-color="#C92348"/></radialGradient>`) },
      { name: 'corazon-roto', src: W(`<path d="M60 102 C8 68 20 26 46 28 c9 1 13 7 14 11 1-4 5-10 14-11 26-2 38 40-14 74z" fill="url(#hr)"/><path d="M60 39 l-9 17 13 9 -11 15 9 22" stroke="#FDF6EC" stroke-width="5" fill="none" stroke-linejoin="round"/>`, `<radialGradient id="hr" cx="35%" cy="28%"><stop offset="0%" stop-color="#FF8FA8"/><stop offset="55%" stop-color="#FF4D6D"/><stop offset="100%" stop-color="#C92348"/></radialGradient>`) }
    ]
  }
];

/* ======================= FONDOS ======================= */
const BD = (inner, defs = '') => svg(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360"><defs>${defs}</defs>${inner}</svg>`);

let BACKDROPS = [
  { name: 'Blanco', src: BD(`<rect width="480" height="360" fill="#ffffff"/>`) },

  {
    name: 'Cielo', src: BD(`
    <rect width="480" height="360" fill="url(#sky)"/>
    <circle cx="398" cy="66" r="34" fill="#FFE98A"/><circle cx="398" cy="66" r="52" fill="#FFE98A" opacity=".25"/>
    <g fill="#fff" opacity=".95">
      <ellipse cx="110" cy="92" rx="46" ry="26"/><ellipse cx="148" cy="98" rx="34" ry="20"/><ellipse cx="74" cy="100" rx="30" ry="18"/>
      <ellipse cx="300" cy="150" rx="34" ry="19" opacity=".8"/><ellipse cx="330" cy="154" rx="26" ry="15" opacity=".8"/>
    </g>
    <path d="M0 268 q80 -26 160 0 t160 0 t160 0 v92 H0z" fill="#7FCF7A"/>
    <path d="M0 292 q80 -22 160 0 t160 0 t160 0 v68 H0z" fill="#5FB95C"/>
    <g fill="#4FA34C" opacity=".5"><circle cx="70" cy="330" r="7"/><circle cx="210" cy="342" r="6"/><circle cx="360" cy="326" r="8"/></g>`,
      `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5FBFF9"/><stop offset="65%" stop-color="#A9E3FF"/><stop offset="100%" stop-color="#DBF4FF"/></linearGradient>`)
  },

  {
    name: 'Espacio', src: BD(`
    <rect width="480" height="360" fill="url(#spc)"/>
    <ellipse cx="240" cy="180" rx="300" ry="150" fill="#5B3FA8" opacity=".22"/>
    <ellipse cx="150" cy="120" rx="180" ry="90" fill="#2E6FCF" opacity=".18"/>
    <g fill="#fff">
      <circle cx="40" cy="44" r="2.4"/><circle cx="120" cy="28" r="1.6"/><circle cx="210" cy="60" r="2"/><circle cx="300" cy="34" r="1.5"/>
      <circle cx="392" cy="72" r="2.2"/><circle cx="66" cy="150" r="1.7"/><circle cx="168" cy="196" r="2.3"/><circle cx="268" cy="146" r="1.5"/>
      <circle cx="356" cy="210" r="2"/><circle cx="440" cy="160" r="1.8"/><circle cx="96" cy="290" r="2.1"/><circle cx="226" cy="312" r="1.6"/>
      <circle cx="330" cy="300" r="2.4"/><circle cx="420" cy="330" r="1.7"/><circle cx="20" cy="220" r="1.5"/>
    </g>
    <circle cx="404" cy="286" r="42" fill="url(#pl)"/>
    <ellipse cx="404" cy="286" rx="66" ry="14" fill="none" stroke="#FFD9A0" stroke-width="7" opacity=".8" transform="rotate(-18 404 286)"/>
    <circle cx="86" cy="80" r="17" fill="#E7ECFA"/><circle cx="80" cy="74" r="5" fill="#C3CBE0"/><circle cx="92" cy="88" r="3.4" fill="#C3CBE0"/>`,
      `<radialGradient id="spc" cx="50%" cy="40%"><stop offset="0%" stop-color="#1B2352"/><stop offset="100%" stop-color="#080C22"/></radialGradient>
     <radialGradient id="pl" cx="35%" cy="30%"><stop offset="0%" stop-color="#FFD98A"/><stop offset="100%" stop-color="#E08A3C"/></radialGradient>`)
  },

  {
    name: 'Mar', src: BD(`
    <rect width="480" height="360" fill="url(#sk2)"/>
    <circle cx="80" cy="60" r="28" fill="#FFF0A8"/>
    <rect y="170" width="480" height="190" fill="url(#sea)"/>
    <path d="M0 170 q30 12 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 v14 H0z" fill="#fff" opacity=".5"/>
    <g stroke="#fff" stroke-width="3" fill="none" opacity=".35" stroke-linecap="round">
      <path d="M40 220 q22 -10 44 0"/><path d="M280 250 q22 -10 44 0"/><path d="M150 300 q22 -10 44 0"/><path d="M370 210 q22 -10 44 0"/></g>
    <path d="M0 330 q60 -18 120 0 t120 0 t120 0 t120 0 v30 H0z" fill="#F2DFA8"/>`,
      `<linearGradient id="sk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6EC8F5"/><stop offset="100%" stop-color="#C8EEFF"/></linearGradient>
     <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3FA0D8"/><stop offset="100%" stop-color="#1C5E92"/></linearGradient>`)
  },

  {
    name: 'Bosque', src: BD(`
    <rect width="480" height="360" fill="url(#sk3)"/>
    <g opacity=".45"><path d="M-10 250 l70-110 70 110z" fill="#7FA8C9"/><path d="M110 250 l80-124 80 124z" fill="#6F9CC0"/><path d="M270 250 l70-104 70 104z" fill="#7FA8C9"/></g>
    <rect y="246" width="480" height="114" fill="#77BE63"/>
    <rect y="286" width="480" height="74" fill="#5EA84E"/>
    <g>
      <rect x="86" y="200" width="14" height="60" rx="5" fill="#7B4B27"/>
      <path d="M93 110 l44 64h-88z" fill="#2E7D32"/><path d="M93 148 l52 70h-104z" fill="#388E3C"/>
      <rect x="330" y="214" width="12" height="48" rx="5" fill="#7B4B27"/>
      <path d="M336 146 l36 52h-72z" fill="#2E7D32"/><path d="M336 178 l44 58h-88z" fill="#388E3C"/>
      <rect x="220" y="228" width="10" height="36" rx="4" fill="#7B4B27"/>
      <path d="M225 182 l28 42h-56z" fill="#43A047"/>
    </g>
    <g fill="#4A9440" opacity=".55"><ellipse cx="60" cy="320" rx="26" ry="8"/><ellipse cx="290" cy="336" rx="30" ry="9"/><ellipse cx="420" cy="310" rx="24" ry="8"/></g>`,
      `<linearGradient id="sk3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#9FD9F5"/><stop offset="100%" stop-color="#DCF1DA"/></linearGradient>`)
  },

  {
    name: 'Ciudad', src: BD(`
    <rect width="480" height="360" fill="url(#sun)"/>
    <circle cx="380" cy="86" r="38" fill="#FFCF6B" opacity=".9"/>
    <g fill="#5A6A85" opacity=".55"><rect x="20" y="150" width="60" height="140"/><rect x="380" y="130" width="70" height="160"/></g>
    <g fill="#3F4C63">
      <rect x="60" y="160" width="72" height="130" rx="4"/><rect x="150" y="100" width="86" height="190" rx="4"/>
      <rect x="252" y="176" width="64" height="114" rx="4"/><rect x="330" y="134" width="78" height="156" rx="4"/>
    </g>
    <g fill="#FFE07A" opacity=".9">
      <rect x="72" y="176" width="12" height="14" rx="2"/><rect x="96" y="176" width="12" height="14" rx="2"/><rect x="72" y="204" width="12" height="14" rx="2"/>
      <rect x="164" y="118" width="13" height="16" rx="2"/><rect x="192" y="118" width="13" height="16" rx="2"/><rect x="164" y="152" width="13" height="16" rx="2"/><rect x="192" y="186" width="13" height="16" rx="2"/>
      <rect x="266" y="194" width="12" height="14" rx="2"/><rect x="290" y="222" width="12" height="14" rx="2"/>
      <rect x="346" y="152" width="13" height="16" rx="2"/><rect x="376" y="186" width="13" height="16" rx="2"/><rect x="346" y="220" width="13" height="16" rx="2"/>
    </g>
    <rect y="290" width="480" height="70" fill="#6C7A93"/>
    <rect y="290" width="480" height="8" fill="#8493AC"/>
    <g stroke="#FFF" stroke-width="5" stroke-dasharray="26 22" opacity=".8"><path d="M0 326 H480"/></g>`,
      `<linearGradient id="sun" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFB36B"/><stop offset="55%" stop-color="#FFD9A0"/><stop offset="100%" stop-color="#FFEFD4"/></linearGradient>`)
  },

  {
    name: 'Cuadrícula', src: BD(`
    <rect width="480" height="360" fill="#FCFDFF"/>
    <g stroke="#DDE4F2" stroke-width="1">
      ${Array.from({ length: 24 }, (_, i) => `<line x1="${i * 20}" y1="0" x2="${i * 20}" y2="360"/>`).join('')}
      ${Array.from({ length: 18 }, (_, i) => `<line x1="0" y1="${i * 20}" x2="480" y2="${i * 20}"/>`).join('')}
    </g>
    <g stroke="#C3CDE3" stroke-width="1.5">
      ${Array.from({ length: 5 }, (_, i) => `<line x1="${i * 100 + 40}" y1="0" x2="${i * 100 + 40}" y2="360"/>`).join('')}
    </g>
    <line x1="240" y1="0" x2="240" y2="360" stroke="#93A0BC" stroke-width="2"/>
    <line x1="0" y1="180" x2="480" y2="180" stroke="#93A0BC" stroke-width="2"/>
    <g fill="#93A0BC" font-family="Arial" font-size="11" font-weight="bold">
      <text x="246" y="174">0,0</text><text x="440" y="174">240</text><text x="6" y="174">-240</text>
      <text x="246" y="16">180</text><text x="246" y="354">-180</text></g>`)
  },

  {
    name: 'Atardecer', src: BD(`
    <rect width="480" height="360" fill="url(#dusk)"/>
    <circle cx="240" cy="230" r="58" fill="#FFD66B" opacity=".95"/>
    <circle cx="240" cy="230" r="84" fill="#FFB86B" opacity=".28"/>
    <rect y="236" width="480" height="124" fill="url(#water)"/>
    <g fill="#FFD9A0" opacity=".55"><rect x="228" y="250" width="24" height="5" rx="2"/><rect x="220" y="268" width="40" height="5" rx="2"/><rect x="212" y="288" width="56" height="5" rx="2"/><rect x="204" y="310" width="72" height="5" rx="2"/></g>
    <path d="M0 236 q60 -14 120 0 t120 0 t120 0 t120 0 v10 H0z" fill="#B8619B" opacity=".35"/>
    <g fill="#3B2B52" opacity=".85"><path d="M60 236 l26-40 26 40z"/><path d="M370 236 l34-52 34 52z"/></g>`,
      `<linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3B2B6E"/><stop offset="40%" stop-color="#C75C8C"/><stop offset="75%" stop-color="#FF9D5C"/><stop offset="100%" stop-color="#FFD08A"/></linearGradient>
     <linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#7B4A88"/><stop offset="100%" stop-color="#2E2450"/></linearGradient>`)
  },

  {
    name: 'Neón', src: BD(`
    <rect width="480" height="360" fill="#0C0B22"/>
    <g opacity=".9">
      ${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="${210 + i * 14}" x2="480" y2="${210 + i * 14}" stroke="#FF3CAC" stroke-width="1.4" opacity="${.15 + i * .06}"/>`).join('')}
      ${Array.from({ length: 17 }, (_, i) => `<line x1="240" y1="206" x2="${i * 60 - 240}" y2="360" stroke="#00E5FF" stroke-width="1.2" opacity=".35"/>`).join('')}
    </g>
    <line x1="0" y1="206" x2="480" y2="206" stroke="#00E5FF" stroke-width="2.5"/>
    <circle cx="240" cy="206" r="70" fill="none" stroke="#FF3CAC" stroke-width="3" opacity=".8"/>
    <circle cx="240" cy="206" r="52" fill="#FF3CAC" opacity=".12"/>
    <g fill="#fff" opacity=".8"><circle cx="70" cy="50" r="1.8"/><circle cx="170" cy="90" r="1.4"/><circle cx="310" cy="56" r="1.7"/><circle cx="420" cy="110" r="1.5"/></g>`)
  }
];

/* ======================= SONIDOS ======================= */
const SOUNDS = [
  { name: 'Miau', kind: 'meow' },
  { name: 'Pop', kind: 'pop' },
  { name: 'Guau', kind: 'woof' },
  { name: 'Boing', kind: 'boing' },
  { name: 'Moneda', kind: 'coin' },
  { name: 'Láser', kind: 'laser' },
  { name: 'Tambor', kind: 'drum' },
  { name: 'Aplauso', kind: 'clap' },
  { name: 'Mágico', kind: 'magic' },
  { name: 'Fallo', kind: 'fail' },
  { name: 'Salto', kind: 'jump' },
  { name: 'Campana', kind: 'bell' }
];
