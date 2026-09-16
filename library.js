/* =====================================================================
   Scratchito · Biblioteca procedural — 1000+ personajes y 200+ fondos
   Cada entrada se dibuja SOLO cuando se usa (lazy) para no penalizar la carga.
   ===================================================================== */

/* ---------- Paletas de color (luz / medio / sombra) ---------- */
const PAL = [
  ['Naranja', '#FFC77A', '#F99B32', '#D97812'], ['Rojo', '#FF8A80', '#E94F4F', '#B93636'],
  ['Rosa', '#FFB3D1', '#FF6FA8', '#D94480'], ['Morado', '#C9A8FF', '#9966FF', '#6F42C9'],
  ['Azul', '#8FC0FF', '#4C97FF', '#2F6FCC'], ['Celeste', '#A8E6FF', '#5CB1D6', '#2E8EB8'],
  ['Turquesa', '#8CEBD8', '#2FC4A8', '#1E8E7A'], ['Verde', '#A8E88C', '#59C059', '#389438'],
  ['Lima', '#E4F58A', '#BFD62F', '#8CA320'], ['Amarillo', '#FFE98A', '#FFC93C', '#E0A200'],
  ['Marrón', '#D9A578', '#A9703F', '#7B4B27'], ['Gris', '#D5DDEA', '#98A6B8', '#6E7C93'],
  ['Blanco', '#FFFFFF', '#EEF1F8', '#C8CFE0'], ['Negro', '#6A7086', '#3D4358', '#242938'],
  ['Menta', '#CFF5E4', '#7ED6AE', '#4CA684'], ['Coral', '#FFC2A8', '#FF8358', '#D65A31'],
  ['Índigo', '#9FA8FF', '#5A63E8', '#3A41B0'], ['Arena', '#F5DFB0', '#DDBB72', '#B0904A']
];

const grad = (id, p) =>
  `<radialGradient id="${id}" cx="35%" cy="28%"><stop offset="0%" stop-color="${p[1]}"/><stop offset="55%" stop-color="${p[2]}"/><stop offset="100%" stop-color="${p[3]}"/></radialGradient>`;

/* ---------- Especies: orejas/extras dibujados tras y sobre la cabeza ---------- */
const SPECIES = {
  'Gato': { back: p => `<path d="M32 42 L27 15 L52 31 Z" fill="${p[2]}" stroke="${p[3]}" stroke-width="2.5" stroke-linejoin="round"/><path d="M88 42 L93 15 L68 31 Z" fill="${p[2]}" stroke="${p[3]}" stroke-width="2.5" stroke-linejoin="round"/><path d="M35 39 L33 24 L46 33 Z" fill="#FF9BA6" opacity=".7"/><path d="M85 39 L87 24 L74 33 Z" fill="#FF9BA6" opacity=".7"/><path d="M96 92 q22 -6 16 -26" stroke="${p[2]}" stroke-width="10" fill="none" stroke-linecap="round"/>`, nose: '#C9542B', whisk: 1 },
  'Perro': { back: p => `<ellipse cx="27" cy="54" rx="12" ry="22" fill="${p[3]}"/><ellipse cx="93" cy="54" rx="12" ry="22" fill="${p[3]}"/><path d="M94 92 q20 -4 14 -22" stroke="${p[2]}" stroke-width="9" fill="none" stroke-linecap="round"/>`, snout: 1, nose: '#33384F' },
  'Oso': { back: p => `<circle cx="30" cy="30" r="14" fill="${p[2]}" stroke="${p[3]}" stroke-width="2.5"/><circle cx="90" cy="30" r="14" fill="${p[2]}" stroke="${p[3]}" stroke-width="2.5"/><circle cx="30" cy="30" r="7" fill="#FF9BA6" opacity=".6"/><circle cx="90" cy="30" r="7" fill="#FF9BA6" opacity=".6"/>`, snout: 1, nose: '#33384F' },
  'Conejo': { back: p => `<ellipse cx="44" cy="18" rx="9" ry="24" fill="${p[2]}" stroke="${p[3]}" stroke-width="2.5"/><ellipse cx="76" cy="18" rx="9" ry="24" fill="${p[2]}" stroke="${p[3]}" stroke-width="2.5"/><ellipse cx="44" cy="20" rx="4.5" ry="16" fill="#FFB3C6" opacity=".8"/><ellipse cx="76" cy="20" rx="4.5" ry="16" fill="#FFB3C6" opacity=".8"/>`, nose: '#E06C8A', whisk: 1 },
  'Zorro': { back: p => `<path d="M30 44 L24 14 L54 32 Z" fill="${p[2]}" stroke="${p[3]}" stroke-width="2.5" stroke-linejoin="round"/><path d="M90 44 L96 14 L66 32 Z" fill="${p[2]}" stroke="${p[3]}" stroke-width="2.5" stroke-linejoin="round"/><path d="M33 40 L31 22 L45 33 Z" fill="#2E3548" opacity=".55"/><path d="M87 40 L89 22 L75 33 Z" fill="#2E3548" opacity=".55"/><path d="M95 94 q26 -8 18 -30" stroke="${p[2]}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M108 70 q6 -6 5 -6" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/>`, nose: '#2E3548', whisk: 1 },
  'Panda': { back: p => `<circle cx="30" cy="30" r="14" fill="#3D4358"/><circle cx="90" cy="30" r="14" fill="#3D4358"/>`, patch: 1, snout: 1, nose: '#2E3548' },
  'Rana': { back: p => `<circle cx="38" cy="26" r="14" fill="${p[2]}" stroke="${p[3]}" stroke-width="2.5"/><circle cx="82" cy="26" r="14" fill="${p[2]}" stroke="${p[3]}" stroke-width="2.5"/><circle cx="38" cy="24" r="7" fill="#fff"/><circle cx="82" cy="24" r="7" fill="#fff"/><circle cx="38" cy="25" r="3.4" fill="#2B3350"/><circle cx="82" cy="25" r="3.4" fill="#2B3350"/>`, noeyes: 1, wide: 1 },
  'Cerdo': { back: p => `<path d="M34 40 L30 22 L50 32 Z" fill="${p[2]}" stroke="${p[3]}" stroke-width="2.5" stroke-linejoin="round"/><path d="M86 40 L90 22 L70 32 Z" fill="${p[2]}" stroke="${p[3]}" stroke-width="2.5" stroke-linejoin="round"/>`, snout: 2, nose: '#D96A8A' },
  'Ratón': { back: p => `<circle cx="30" cy="32" r="16" fill="${p[2]}" stroke="${p[3]}" stroke-width="2.5"/><circle cx="90" cy="32" r="16" fill="${p[2]}" stroke="${p[3]}" stroke-width="2.5"/><circle cx="30" cy="32" r="9" fill="#FFB3C6" opacity=".7"/><circle cx="90" cy="32" r="9" fill="#FFB3C6" opacity=".7"/><path d="M94 94 q24 0 20 -20" stroke="${p[3]}" stroke-width="4" fill="none" stroke-linecap="round"/>`, nose: '#E06C8A', whisk: 1 },
  'Pingüino': { back: p => `<ellipse cx="22" cy="70" rx="10" ry="18" fill="${p[3]}" transform="rotate(20 22 70)"/><ellipse cx="98" cy="70" rx="10" ry="18" fill="${p[3]}" transform="rotate(-20 98 70)"/>`, belly: 1, beak: 1 },
  'Búho': { back: p => `<path d="M30 34 L28 16 L46 26 Z" fill="${p[3]}"/><path d="M90 34 L92 16 L74 26 Z" fill="${p[3]}"/>`, bigeyes: 1, beak: 1 },
  'Dragón': { back: p => `<path d="M40 26 l7-12 7 12z M56 20 l7-12 7 12z M72 24 l7-12 7 12z" fill="${p[3]}"/><path d="M96 92 q24 -6 18 -28" stroke="${p[2]}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M24 54 q-16 -10 -18 4 q10 8 18 2z" fill="${p[1]}" opacity=".9"/><path d="M96 54 q16 -10 18 4 q-10 8 -18 2z" fill="${p[1]}" opacity=".9"/>`, horns: 1, nose: '#8E3B33' },
  'Alien': { back: p => `<path d="M40 24 q-6 -14 2 -16 q6 -2 8 12" stroke="${p[3]}" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="41" cy="8" r="5" fill="${p[1]}"/><path d="M80 24 q6 -14 -2 -16 q-6 -2 -8 12" stroke="${p[3]}" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="79" cy="8" r="5" fill="${p[1]}"/>`, bigeyes: 1, wide: 1 },
  'Unicornio': { back: p => `<path d="M60 4 l7 26h-14z" fill="#FFD84C" stroke="#E0A800" stroke-width="2" stroke-linejoin="round"/><path d="M34 40 L30 20 L50 30 Z" fill="${p[2]}" stroke="${p[3]}" stroke-width="2.5"/><path d="M86 40 L90 20 L70 30 Z" fill="${p[2]}" stroke="${p[3]}" stroke-width="2.5"/><path d="M76 26 q18 6 14 26" stroke="#FF8FC7" stroke-width="7" fill="none" stroke-linecap="round"/>`, nose: '#D96A8A' },
  'Monstruo': { back: p => `<path d="M34 34 l-8 -16 14 6z M86 34 l8 -16 -14 6z" fill="${p[3]}"/><path d="M26 86 l-10 14 M94 86 l10 14" stroke="${p[3]}" stroke-width="6" stroke-linecap="round"/>`, teeth: 1, wide: 1 },
  'Pollito': { back: p => `<path d="M60 16 q-4 -10 4 -12 q4 6 0 12z" fill="${p[3]}"/>`, beak: 1, small: 1 }
};

const FANTASY = ['Dragón', 'Alien', 'Unicornio', 'Monstruo'];

/* ---------- Constructor de criatura ---------- */
function creature(p, spName, variant) {
  const sp = SPECIES[spName], open = variant === 1;
  const rx = sp.wide ? 37 : 34, ry = sp.small ? 28 : 31;
  let s = piso(111, 29);
  s += sp.back(p);
  s += `<rect x="42" y="74" width="36" height="30" rx="14" fill="url(#b)" stroke="${p[3]}" stroke-width="2.5"/>`;
  s += open
    ? `<rect x="38" y="96" width="15" height="12" rx="6" fill="${p[2]}" stroke="${p[3]}" stroke-width="2" transform="rotate(-18 45 102)"/><rect x="67" y="96" width="15" height="12" rx="6" fill="${p[2]}" stroke="${p[3]}" stroke-width="2" transform="rotate(18 75 102)"/>`
    : `<rect x="45" y="97" width="13" height="11" rx="5.5" fill="${p[2]}" stroke="${p[3]}" stroke-width="2"/><rect x="62" y="97" width="13" height="11" rx="5.5" fill="${p[2]}" stroke="${p[3]}" stroke-width="2"/>`;
  s += `<ellipse cx="60" cy="52" rx="${rx}" ry="${ry}" fill="url(#b)" stroke="${p[3]}" stroke-width="2.5"/>`;
  if (sp.patch) s += `<circle cx="42" cy="50" r="13" fill="#3D4358"/><circle cx="78" cy="50" r="13" fill="#3D4358"/>`;
  if (sp.belly) s += `<ellipse cx="60" cy="60" rx="24" ry="24" fill="#FFF8F0"/>`;
  s += `<ellipse cx="60" cy="40" rx="${rx - 8}" ry="15" fill="url(#gloss)"/>`;
  if (!sp.noeyes) {
    const er = sp.bigeyes ? 12 : 8.5, ey = sp.bigeyes ? 50 : 50, sep = sp.bigeyes ? 17 : 15;
    if (sp.bigeyes) s += `<circle cx="${60 - sep}" cy="${ey}" r="${er + 2}" fill="#FFF8F0"/><circle cx="${60 + sep}" cy="${ey}" r="${er + 2}" fill="#FFF8F0"/>`;
    s += eyes(ey, sep, er, open ? 2 : 0);
  }
  if (sp.snout) s += `<ellipse cx="60" cy="67" rx="${sp.snout === 2 ? 13 : 15}" ry="${sp.snout === 2 ? 10 : 11}" fill="#F8EDE0"/>`;
  if (sp.snout === 2) s += `<circle cx="55" cy="66" r="2.6" fill="#B2536F"/><circle cx="65" cy="66" r="2.6" fill="#B2536F"/>`;
  if (sp.beak) s += `<path d="M53 62 h14 l-7 9z" fill="#FFB020" stroke="#E08A00" stroke-width="1.5" stroke-linejoin="round"/>`;
  else if (sp.nose) s += `<path d="M54 61 h12 l-6 6z" fill="${sp.nose}" stroke="${sp.nose}" stroke-width="1.2" stroke-linejoin="round"/>`;
  if (sp.teeth) s += `<path d="M44 68 h32 v8 q-16 10 -32 0z" fill="#8E3B33"/><path d="M48 68 l4 7 4-7z M64 68 l4 7 4-7z" fill="#fff"/>`;
  else if (open) s += `<ellipse cx="60" cy="72" rx="8" ry="9" fill="#8E3B33"/><ellipse cx="60" cy="75" rx="5" ry="5" fill="#FF8FA0"/>`;
  else s += smile(sp.snout ? 71 : 68, 13, 9);
  if (sp.whisk) s += `<g stroke="${p[3]}" stroke-width="2.2" stroke-linecap="round" opacity=".85"><path d="M24 58 H6 M24 65 H9 M96 58 h18 M96 65 h15"/></g>`;
  s += blush(66, .3);
  return W(s, grad('b', p));
}

/* ---------- Robot ---------- */
function robot(p, shape, variant) {
  const r = [14, 4, 26, 8][shape % 4];
  const ey = variant ? `<rect x="45" y="44" width="12" height="5" rx="2.5" fill="#4CE0B3"/><rect x="63" y="44" width="12" height="5" rx="2.5" fill="#4CE0B3"/>`
    : `<circle cx="51" cy="46" r="5.5" fill="#4CE0B3"/><circle cx="69" cy="46" r="5.5" fill="#4CE0B3"/><circle cx="49.4" cy="44.4" r="1.8" fill="#DFFFF5"/><circle cx="67.4" cy="44.4" r="1.8" fill="#DFFFF5"/>`;
  return W(`${piso()}
   <rect x="57.5" y="10" width="5" height="14" rx="2.5" fill="${p[3]}"/><circle cx="60" cy="9" r="5.5" fill="#FF6B6B"/>
   <rect x="${variant ? 16 : 18}" y="${variant ? 58 : 72}" width="16" height="9" rx="4.5" fill="${p[3]}" transform="rotate(${variant ? -25 : 0} 24 ${variant ? 62 : 76})"/>
   <rect x="${variant ? 88 : 86}" y="${variant ? 58 : 72}" width="16" height="9" rx="4.5" fill="${p[3]}" transform="rotate(${variant ? 25 : 0} 96 ${variant ? 62 : 76})"/>
   <rect x="37" y="74" width="46" height="30" rx="11" fill="url(#b)" stroke="${p[3]}" stroke-width="2.5"/>
   <rect x="47" y="82" width="26" height="14" rx="4" fill="#4A576D" opacity=".4"/>
   <rect x="29" y="24" width="62" height="48" rx="${r}" fill="url(#b)" stroke="${p[3]}" stroke-width="2.5"/>
   <rect x="38" y="35" width="44" height="22" rx="8" fill="#232C3D"/>${ey}
   <rect x="29" y="24" width="62" height="24" rx="${r}" fill="url(#gloss)"/>
   <rect x="44" y="105" width="14" height="7" rx="3.5" fill="${p[3]}"/><rect x="62" y="105" width="14" height="7" rx="3.5" fill="${p[3]}"/>`,
    `<linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${p[1]}"/><stop offset="55%" stop-color="${p[2]}"/><stop offset="100%" stop-color="${p[3]}"/></linearGradient>`);
}

/* ---------- Formas geométricas ---------- */
const SHAPES = {
  'Círculo': '<circle cx="60" cy="60" r="42" fill="url(#b)"/>',
  'Cuadrado': '<rect x="20" y="20" width="80" height="80" rx="8" fill="url(#b)"/>',
  'Triángulo': '<path d="M60 16 L104 98 H16 Z" fill="url(#b)" stroke-linejoin="round"/>',
  'Rombo': '<path d="M60 14 L106 60 L60 106 L14 60 Z" fill="url(#b)"/>',
  'Pentágono': '<path d="M60 14 l44 32 -17 52h-54l-17-52z" fill="url(#b)"/>',
  'Hexágono': '<path d="M38 20h44l22 40-22 40H38L16 60z" fill="url(#b)"/>',
  'Estrella': '<path d="M60 12 l14 29 32 4.5 -23 22 5.5 32 -28.5-15.5 -28.5 15.5 5.5-32 -23-22 32-4.5z" fill="url(#b)" stroke-linejoin="round"/>',
  'Corazón': '<path d="M60 102 C8 68 20 26 46 28 c9 1 13 7 14 11 1-4 5-10 14-11 26-2 38 40-14 74z" fill="url(#b)"/>',
  'Rayo': '<path d="M68 8 L32 64h24l-8 48 42-60H64z" fill="url(#b)" stroke-linejoin="round"/>',
  'Gota': '<path d="M60 12 q30 40 30 58 a30 30 0 0 1 -60 0 q0-18 30-58z" fill="url(#b)"/>',
  'Nube': '<g fill="url(#b)"><ellipse cx="46" cy="66" rx="26" ry="20"/><ellipse cx="74" cy="68" rx="22" ry="17"/><ellipse cx="60" cy="52" rx="22" ry="18"/></g>',
  'Luna': '<path d="M74 14 a46 46 0 1 0 0 92 a36 36 0 1 1 0-92z" fill="url(#b)"/>',
  'Flecha': '<path d="M14 46h50V22l44 38-44 38V74H14z" fill="url(#b)" stroke-linejoin="round"/>',
  'Cruz': '<path d="M46 14h28v32h32v28H74v32H46V74H14V46h32z" fill="url(#b)"/>',
  'Engranaje': '<g fill="url(#b)"><circle cx="60" cy="60" r="34"/><g>' + Array.from({ length: 8 }, (_, i) => `<rect x="53" y="10" width="14" height="18" rx="3" transform="rotate(${i * 45} 60 60)"/>`).join('') + '</g></g><circle cx="60" cy="60" r="13" fill="#fff" opacity=".85"/>',
  'Gema': '<path d="M36 26h48l22 26-46 48-46-48z" fill="url(#b)"/><path d="M36 26 L60 52 L84 26 M14 52h92M60 52v48" stroke="#fff" stroke-width="2.5" fill="none" opacity=".55"/>'
};

/* ---------- Comida ---------- */
const FOODS = {
  'Manzana': p => `<path d="M60 34 q-32-11-32 28 0 36 32 46 32-10 32-46 0-39-32-28z" fill="url(#b)"/><path d="M60 34 q3-15 18-19 q-2 15-18 19z" fill="#4CAF50"/><rect x="57.5" y="18" width="5" height="18" rx="2.5" fill="#7B4B27"/>`,
  'Naranja': p => `<circle cx="60" cy="62" r="40" fill="url(#b)"/><circle cx="60" cy="62" r="40" fill="none" stroke="#fff" stroke-width="1.5" opacity=".3"/><path d="M60 24 q4-12 16-14 q-2 12-16 14z" fill="#4CAF50"/>`,
  'Pera': p => `<path d="M60 30 q-14 14 -14 26 q-14 12 -14 28 a28 28 0 0 0 56 0 q0-16 -14-28 q0-12 -14-26z" fill="url(#b)"/><rect x="57.5" y="16" width="5" height="18" rx="2.5" fill="#7B4B27"/>`,
  'Sandía': p => `<path d="M14 54 a46 46 0 0 0 92 0z" fill="#E94F4F"/><path d="M14 54 a46 46 0 0 0 92 0z" fill="none" stroke="#fff" stroke-width="6"/><path d="M8 54 a52 52 0 0 0 104 0z" fill="none" stroke="#3E9142" stroke-width="7"/><g fill="#2E3548"><circle cx="48" cy="72" r="3"/><circle cx="72" cy="72" r="3"/><circle cx="60" cy="86" r="3"/></g>`,
  'Plátano': p => `<path d="M24 40 q4 52 56 56 q16 2 18-8 q-40-4-56-50 q-6-12-18 2z" fill="url(#b)" stroke="#D9A21B" stroke-width="2"/>`,
  'Fresa': p => `<path d="M60 36 q-34 0 -34 26 q0 30 34 44 q34-14 34-44 q0-26 -34-26z" fill="url(#b)"/><path d="M42 34 h36 l-8 10h-20z" fill="#4CAF50"/><g fill="#FFE98A"><circle cx="50" cy="58" r="2.4"/><circle cx="70" cy="58" r="2.4"/><circle cx="60" cy="72" r="2.4"/><circle cx="44" cy="76" r="2.4"/><circle cx="76" cy="76" r="2.4"/></g>`,
  'Cereza': p => `<circle cx="42" cy="82" r="20" fill="url(#b)"/><circle cx="80" cy="86" r="17" fill="url(#b)"/><path d="M42 62 q6-34 26-40 M80 69 q0-30 -12-47" stroke="#4CAF50" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  'Uvas': p => `<g fill="url(#b)"><circle cx="60" cy="42" r="13"/><circle cx="44" cy="60" r="13"/><circle cx="76" cy="60" r="13"/><circle cx="60" cy="66" r="13"/><circle cx="52" cy="84" r="13"/><circle cx="70" cy="84" r="13"/></g><path d="M60 30 q2-16 16-20" stroke="#4CAF50" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  'Helado': p => `<path d="M38 56 h44 l-22 54z" fill="#E0B070"/><circle cx="46" cy="46" r="18" fill="url(#b)"/><circle cx="74" cy="46" r="18" fill="#FFF0F5"/><circle cx="60" cy="32" r="18" fill="#FFD1E0"/><circle cx="60" cy="14" r="6" fill="#E94F4F"/>`,
  'Donut': p => `<circle cx="60" cy="60" r="42" fill="#E0B070"/><path d="M60 18 a42 42 0 0 1 0 84 a42 42 0 0 1 0-84z" fill="url(#b)"/><circle cx="60" cy="60" r="15" fill="#FDF6EC"/><g stroke="#fff" stroke-width="4" stroke-linecap="round"><path d="M40 38l6 6M78 40l-6 6M36 76l7-5M82 74l-7-5M58 24l0 8"/></g>`,
  'Pizza': p => `<path d="M60 14 L106 96 H14 Z" fill="#F2C46B" stroke-linejoin="round"/><path d="M60 26 L96 92 H24 Z" fill="#E8853C"/><g fill="#D9382F"><circle cx="60" cy="56" r="7"/><circle cx="44" cy="78" r="7"/><circle cx="76" cy="78" r="7"/></g>`,
  'Tarta': p => `<rect x="22" y="56" width="76" height="44" rx="6" fill="url(#b)"/><rect x="22" y="56" width="76" height="12" fill="#FFF0F5"/><rect x="57" y="30" width="6" height="22" fill="#FFE98A"/><ellipse cx="60" cy="26" rx="5" ry="8" fill="#FF8A3C"/>`
};

/* ---------- Vehículos ---------- */
const VEHICLES = {
  'Coche': p => `${piso(104, 40)}<path d="M30 60 l13-20 q2-3 5-3 h26 q3 0 5 3 l14 20z" fill="${p[1]}"/><path d="M34 58 l10-15 h13 v15z M63 58 v-15 h11 l11 15z" fill="#BFE0FF"/><rect x="12" y="58" width="96" height="26" rx="11" fill="url(#b)"/><circle cx="36" cy="86" r="13" fill="#2E3548"/><circle cx="84" cy="86" r="13" fill="#2E3548"/><circle cx="36" cy="86" r="5.5" fill="#C8D0E0"/><circle cx="84" cy="86" r="5.5" fill="#C8D0E0"/>`,
  'Camión': p => `${piso(104, 44)}<rect x="10" y="44" width="54" height="40" rx="5" fill="url(#b)"/><path d="M64 56 h20 l16 16v12H64z" fill="${p[1]}"/><rect x="70" y="60" width="16" height="12" rx="2" fill="#BFE0FF"/><circle cx="32" cy="88" r="12" fill="#2E3548"/><circle cx="90" cy="88" r="12" fill="#2E3548"/>`,
  'Autobús': p => `${piso(104, 44)}<rect x="8" y="40" width="104" height="48" rx="10" fill="url(#b)"/><g fill="#BFE0FF"><rect x="16" y="48" width="20" height="16" rx="3"/><rect x="42" y="48" width="20" height="16" rx="3"/><rect x="68" y="48" width="20" height="16" rx="3"/><rect x="94" y="48" width="12" height="16" rx="3"/></g><circle cx="32" cy="90" r="11" fill="#2E3548"/><circle cx="88" cy="90" r="11" fill="#2E3548"/>`,
  'Avión': p => `<path d="M60 8 q12 20 12 50 l32 22v10l-32-10v18l12 12v8l-24-8-24 8v-8l12-12V80l-32 10V80l32-22q0-30 12-50z" fill="url(#b)" stroke="${p[3]}" stroke-width="2" stroke-linejoin="round"/>`,
  'Barco': p => `<path d="M14 76 h92 l-14 26H28z" fill="url(#b)"/><rect x="57" y="20" width="5" height="56" fill="#7B4B27"/><path d="M62 24 l30 40H62z" fill="#FFF0F5"/><path d="M56 30 L30 64h26z" fill="#E94F4F"/>`,
  'Cohete': p => `<path d="M36 66 l-16 26 q14 4 20 -6z" fill="#E94F4F"/><path d="M84 66 l16 26 q-14 4 -20 -6z" fill="#C93B3B"/><path d="M60 8 q24 28 24 62 h-48 q0-34 24-62z" fill="url(#b)" stroke="${p[3]}" stroke-width="2"/><circle cx="60" cy="46" r="11" fill="#BFEAFF" stroke="#2E8EB8" stroke-width="2.5"/><path d="M53 80 q7 20 7 30 q0-10 7-30z" fill="#FFB020"/>`,
  'Bici': p => `<circle cx="32" cy="80" r="24" fill="none" stroke="${p[2]}" stroke-width="5"/><circle cx="88" cy="80" r="24" fill="none" stroke="${p[2]}" stroke-width="5"/><path d="M32 80 L56 44 h22 l10 36 M56 44 L68 80 M78 44 h10" stroke="${p[3]}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  'Tren': p => `${piso(104, 44)}<rect x="14" y="44" width="60" height="44" rx="8" fill="url(#b)"/><rect x="74" y="58" width="32" height="30" rx="6" fill="${p[1]}"/><rect x="24" y="52" width="18" height="16" rx="3" fill="#BFE0FF"/><rect x="48" y="52" width="18" height="16" rx="3" fill="#BFE0FF"/><rect x="20" y="28" width="14" height="18" rx="4" fill="${p[3]}"/><circle cx="34" cy="92" r="10" fill="#2E3548"/><circle cx="66" cy="92" r="10" fill="#2E3548"/><circle cx="94" cy="92" r="8" fill="#2E3548"/>`
};

/* ---------- Pelotas y gemas ---------- */
const BALLS = {
  'Pelota': p => `${piso(106, 26)}<circle cx="60" cy="58" r="40" fill="url(#b)"/><path d="M24 42 q36 20 72 0" stroke="#fff" stroke-width="7" fill="none" opacity=".85" stroke-linecap="round"/><ellipse cx="46" cy="38" rx="15" ry="10" fill="#fff" opacity=".35"/>`,
  'Globo': p => `<path d="M60 88 q-4 8 0 16" stroke="#8E94AB" stroke-width="2.5" fill="none"/><ellipse cx="60" cy="52" rx="32" ry="38" fill="url(#b)"/><path d="M54 88 h12 l-6 8z" fill="${p[3]}"/><ellipse cx="48" cy="34" rx="10" ry="14" fill="#fff" opacity=".35"/>`,
  'Burbuja': p => `<circle cx="60" cy="60" r="42" fill="url(#b)" opacity=".55"/><circle cx="60" cy="60" r="42" fill="none" stroke="#fff" stroke-width="2.5" opacity=".7"/><ellipse cx="44" cy="40" rx="12" ry="8" fill="#fff" opacity=".7" transform="rotate(-30 44 40)"/>`,
  'Caramelo': p => `<circle cx="60" cy="60" r="28" fill="url(#b)"/><path d="M32 60 L10 44v32z M88 60 l22-16v32z" fill="${p[2]}"/><path d="M48 44 q12 16 0 32 M62 42 q12 18 0 36" stroke="#fff" stroke-width="4" fill="none" opacity=".6"/>`
};

/* ======================= CATÁLOGO ======================= */
function entry(name, emoji, tags, gen, cat, sub) {
  const e = { name, emoji, tags, gen, cat: cat || tags[0], sub: sub || '' };
  Object.defineProperty(e, 'costumes', { get() { return this._c || (this._c = this.gen()); }, configurable: true });
  return e;
}

const HERO_CAT = { 'Gatito': ['animales','Gato'], 'Perrito': ['animales','Perro'], 'Robot': ['robots','Robot clásico'],
  'Dino': ['fantasia','Dino'], 'Pelota': ['objetos','Pelota'], 'Nave': ['vehiculos','Cohete'],
  'Estrella': ['formas','Estrella'], 'Maga': ['personas','Maga'], 'Fantasma': ['fantasia','Fantasma'],
  'Manzana': ['comida','Manzana'], 'Coche': ['vehiculos','Coche'], 'Corazón': ['formas','Corazón'] };

function buildLibrary() {
  const out = HERO_LIBRARY.map(h => {
    const c = HERO_CAT[h.name] || ['objetos', h.name];
    return Object.assign(h, { cat: c[0], sub: c[1], destacado: true, tags: (h.tags || []).concat([c[0]]) });
  });
  const seen = new Set(out.map(o => o.name));
  const push = e => { if (!seen.has(e.name)) { seen.add(e.name); out.push(e); } };

  // 1) Criaturas: 16 especies × 18 colores = 288 (×2 disfraces)
  for (const sp in SPECIES)
    for (const p of PAL)
      push(entry(`${sp} ${p[0]}`, '', ['animales', sp.toLowerCase(), p[0].toLowerCase()],
        (() => { const _p = p, _s = sp; return () => [{ name: 'normal', src: creature(_p, _s, 0) }, { name: 'acción', src: creature(_p, _s, 1) }]; })(),
        FANTASY.includes(sp) ? 'fantasia' : 'animales', sp));

  // 2) Robots: 4 formas × 18 colores = 72
  for (let sh = 0; sh < 4; sh++)
    for (const p of PAL)
      push(entry(`Robot ${['clásico', 'cuadrado', 'redondo', 'mini'][sh]} ${p[0]}`, '', ['robots', p[0].toLowerCase()],
        (() => { const _p = p, _sh = sh; return () => [{ name: 'normal', src: robot(_p, _sh, 0) }, { name: 'acción', src: robot(_p, _sh, 1) }]; })(),
        'robots', 'Robot ' + ['clásico', 'cuadrado', 'redondo', 'mini'][sh]));

  // 3) Formas: 16 × 18 = 288
  for (const sn in SHAPES)
    for (const p of PAL)
      push(entry(`${sn} ${p[0]}`, '', ['formas', sn.toLowerCase(), p[0].toLowerCase()],
        (() => {
          const _p = p, _d = SHAPES[sn];
          return () => [
            { name: 'lisa', src: W(_d.replace(/url\(#b\)/g, 'url(#b)'), grad('b', _p)) },
            { name: 'contorno', src: W(`<g stroke="${_p[3]}" stroke-width="4">${_d}</g>`, grad('b', _p)) }
          ];
        })(), 'formas', sn));

  // 4) Comida: 12 × 8 colores = 96
  const fpal = PAL.filter(p => !['Blanco', 'Negro', 'Gris'].includes(p[0])).slice(0, 8);
  for (const fn in FOODS)
    for (const p of fpal)
      push(entry(`${fn} ${p[0]}`, '', ['comida', fn.toLowerCase()],
        (() => { const _p = p, _f = FOODS[fn]; return () => [{ name: 'normal', src: W(piso(112, 26) + _f(_p), grad('b', _p)) }]; })(), 'comida', fn));

  // 5) Vehículos: 8 × 12 = 96
  for (const vn in VEHICLES)
    for (const p of PAL.slice(0, 12))
      push(entry(`${vn} ${p[0]}`, '', ['vehiculos', vn.toLowerCase()],
        (() => { const _p = p, _v = VEHICLES[vn]; return () => [{ name: 'normal', src: W(_v(_p), grad('b', _p)) }]; })(), 'vehiculos', vn));

  // 6) Pelotas/globos: 4 × 18 = 72
  for (const bn in BALLS)
    for (const p of PAL)
      push(entry(`${bn} ${p[0]}`, '', ['objetos', bn.toLowerCase()],
        (() => { const _p = p, _b = BALLS[bn]; return () => [{ name: 'normal', src: W(_b(_p), grad('b', _p)) }]; })(), 'objetos', bn));

  // 7) Letras y números: 36 × 5 estilos = 180
  const CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
  const STY = [
    ['bloque', (c, p) => W(`<rect x="12" y="12" width="96" height="96" rx="18" fill="url(#b)"/><text x="60" y="60" font-family="Arial,Helvetica" font-size="66" font-weight="bold" fill="#fff" text-anchor="middle" dominant-baseline="central">${c}</text>`, grad('b', p))],
    ['redonda', (c, p) => W(`<circle cx="60" cy="60" r="48" fill="url(#b)"/><text x="60" y="60" font-family="Arial,Helvetica" font-size="62" font-weight="bold" fill="#fff" text-anchor="middle" dominant-baseline="central">${c}</text>`, grad('b', p))],
    ['contorno', (c, p) => W(`<text x="60" y="60" font-family="Arial,Helvetica" font-size="88" font-weight="bold" fill="url(#b)" stroke="${p[3]}" stroke-width="3" text-anchor="middle" dominant-baseline="central">${c}</text>`, grad('b', p))],
    ['globo', (c, p) => W(`<text x="60" y="62" font-family="Arial,Helvetica" font-size="92" font-weight="bold" fill="url(#b)" stroke="#fff" stroke-width="6" paint-order="stroke" text-anchor="middle" dominant-baseline="central">${c}</text>`, grad('b', p))],
    ['sombra', (c, p) => W(`<text x="64" y="64" font-family="Arial,Helvetica" font-size="88" font-weight="bold" fill="${p[3]}" opacity=".5" text-anchor="middle" dominant-baseline="central">${c}</text><text x="60" y="60" font-family="Arial,Helvetica" font-size="88" font-weight="bold" fill="url(#b)" text-anchor="middle" dominant-baseline="central">${c}</text>`, grad('b', p))]
  ];
  CH.forEach(c => STY.forEach(([sn, fn], i) => {
    const p = PAL[(CH.indexOf(c) + i * 3) % PAL.length];
    push(entry(`${/[0-9]/.test(c) ? 'Número' : 'Letra'} ${c} ${sn}`, '', ['letras', sn],
      (() => { const _c = c, _p = p, _f = fn; return () => [{ name: _c, src: _f(_c, _p) }]; })(),
      'letras', /[0-9]/.test(c) ? 'Números' : 'Letras'));
  }));

  return out;
}

/* ======================= FONDOS PROCEDURALES ======================= */
const BD2 = (inner, defs = '') => svg(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360" width="480" height="360"><defs>${defs}</defs>${inner}</svg>`);

const SKY = [
  ['Día', '#5FBFF9', '#A9E3FF', '#DBF4FF'], ['Amanecer', '#FF9E6B', '#FFD1A0', '#FFF0D8'],
  ['Atardecer', '#5B3B8C', '#D9628C', '#FFB86B'], ['Noche', '#0C1230', '#1B2352', '#334077'],
  ['Tormenta', '#4A5468', '#78849A', '#A8B2C4'], ['Pastel', '#FFC7E0', '#D8C7FF', '#C7ECFF'],
  ['Menta', '#4FC7A8', '#A8EBD6', '#DFF8EF'], ['Fuego', '#7A1F1F', '#D64426', '#FFA03C'],
  ['Espacio', '#05071A', '#131A3D', '#2A2F63'], ['Ácido', '#2E7D32', '#8CD63F', '#E8F79B'],
  ['Hielo', '#5A8FC0', '#A8D4F0', '#E6F5FF'], ['Rosa', '#C9407A', '#FF8AB5', '#FFD6E8']
];
const GROUND = {
  'Pradera': ['#7FCF7A', '#5FB95C'], 'Desierto': ['#F0D79B', '#DBBB6E'], 'Nieve': ['#FFFFFF', '#DCE8F5'],
  'Roca': ['#9AA5B8', '#78859A'], 'Lava': ['#FF7A3C', '#C23A1E'], 'Agua': ['#4FA8DC', '#2C6FA8'],
  'Ciudad': ['#8493AC', '#6C7A93'], 'Arena': ['#F2DFA8', '#DCC488']
};

function sceneBD(sky, gname, deco) {
  const g = GROUND[gname];
  let s = `<rect width="480" height="360" fill="url(#sk)"/>`;
  if (sky[0] === 'Noche' || sky[0] === 'Espacio')
    s += `<g fill="#fff">` + Array.from({ length: 24 }, (_, i) => {
      const x = (i * 97 + 31) % 470, y = (i * 53 + 17) % 200;
      return `<circle cx="${x}" cy="${y}" r="${1.2 + (i % 3) * .5}" opacity="${.5 + (i % 4) * .12}"/>`;
    }).join('') + `</g><circle cx="404" cy="62" r="20" fill="#E7ECFA"/><circle cx="397" cy="55" r="6" fill="#C3CBE0"/>`;
  else s += `<circle cx="392" cy="70" r="34" fill="#FFF0A8" opacity=".95"/><circle cx="392" cy="70" r="52" fill="#FFF0A8" opacity=".22"/>`;
  if (deco === 'nubes') s += `<g fill="#fff" opacity=".85"><ellipse cx="108" cy="88" rx="44" ry="24"/><ellipse cx="146" cy="94" rx="32" ry="18"/><ellipse cx="74" cy="96" rx="28" ry="16"/><ellipse cx="300" cy="140" rx="32" ry="17"/><ellipse cx="328" cy="144" rx="24" ry="13"/></g>`;
  if (deco === 'montañas') s += `<g opacity=".5"><path d="M-10 256 l90-120 90 120z" fill="#7FA8C9"/><path d="M130 256 l100-140 100 140z" fill="#6F9CC0"/><path d="M300 256 l90-116 90 116z" fill="#7FA8C9"/></g>`;
  if (deco === 'árboles') s += `<g><rect x="80" y="206" width="14" height="56" rx="5" fill="#7B4B27"/><path d="M87 118 l46 66h-92z" fill="#2E7D32"/><path d="M87 156 l54 72h-108z" fill="#388E3C"/><rect x="336" y="218" width="12" height="46" rx="5" fill="#7B4B27"/><path d="M342 152 l38 54h-76z" fill="#2E7D32"/><path d="M342 184 l46 60h-92z" fill="#388E3C"/></g>`;
  if (deco === 'edificios') s += `<g fill="#3F4C63"><rect x="56" y="156" width="74" height="106" rx="4"/><rect x="148" y="104" width="88" height="158" rx="4"/><rect x="254" y="176" width="66" height="86" rx="4"/><rect x="334" y="136" width="80" height="126" rx="4"/></g><g fill="#FFE07A" opacity=".9">${Array.from({ length: 18 }, (_, i) => `<rect x="${68 + (i % 6) * 58}" y="${castY(i)}" width="12" height="15" rx="2"/>`).join('')}</g>`;
  if (deco === 'cactus') s += `<g fill="#3E9142"><rect x="90" y="190" width="20" height="72" rx="10"/><rect x="66" y="212" width="26" height="14" rx="7"/><rect x="108" y="200" width="26" height="14" rx="7"/><rect x="350" y="206" width="16" height="56" rx="8"/></g>`;
  if (deco === 'burbujas') s += `<g fill="#fff" opacity=".35">${Array.from({ length: 12 }, (_, i) => `<circle cx="${(i * 71 + 40) % 460}" cy="${290 - (i * 43) % 120}" r="${4 + (i % 4) * 3}"/>`).join('')}</g>`;
  s += `<path d="M0 258 q80 -22 160 0 t160 0 t160 0 v102 H0z" fill="${g[0]}"/>`;
  s += `<path d="M0 290 q80 -18 160 0 t160 0 t160 0 v70 H0z" fill="${g[1]}"/>`;
  return BD2(s, `<linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${sky[1]}"/><stop offset="60%" stop-color="${sky[2]}"/><stop offset="100%" stop-color="${sky[3]}"/></linearGradient>`);
}
function castY(i) { return [120, 176, 118, 196, 152, 168, 210, 148, 190, 230, 172, 206, 240, 196, 228, 250, 214, 244][i]; }

const PATTERNS = {
  'Liso': (a, b) => `<rect width="480" height="360" fill="${b}"/>`,
  'Degradado': (a, b) => `<rect width="480" height="360" fill="url(#pg)"/>`,
  'Rayas': (a, b) => `<rect width="480" height="360" fill="${b}"/><g fill="${a}" opacity=".55">${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 40}" y="0" width="20" height="360"/>`).join('')}</g>`,
  'Diagonales': (a, b) => `<rect width="480" height="360" fill="${b}"/><g stroke="${a}" stroke-width="18" opacity=".45">${Array.from({ length: 18 }, (_, i) => `<line x1="${i * 50 - 200}" y1="400" x2="${i * 50}" y2="-40"/>`).join('')}</g>`,
  'Lunares': (a, b) => `<rect width="480" height="360" fill="${b}"/><g fill="${a}" opacity=".55">${Array.from({ length: 60 }, (_, i) => `<circle cx="${(i % 10) * 48 + 24}" cy="${Math.floor(i / 10) * 60 + 30}" r="12"/>`).join('')}</g>`,
  'Cuadros': (a, b) => `<rect width="480" height="360" fill="${b}"/><g fill="${a}" opacity=".5">${Array.from({ length: 48 }, (_, i) => ((i % 8) + Math.floor(i / 8)) % 2 ? `<rect x="${(i % 8) * 60}" y="${Math.floor(i / 8) * 60}" width="60" height="60"/>` : '').join('')}</g>`,
  'Rejilla': (a, b) => `<rect width="480" height="360" fill="${b}"/><g stroke="${a}" stroke-width="2" opacity=".5">${Array.from({ length: 25 }, (_, i) => `<line x1="${i * 20}" y1="0" x2="${i * 20}" y2="360"/>`).join('')}${Array.from({ length: 19 }, (_, i) => `<line x1="0" y1="${i * 20}" x2="480" y2="${i * 20}"/>`).join('')}</g>`,
  'Zigzag': (a, b) => `<rect width="480" height="360" fill="${b}"/><g stroke="${a}" stroke-width="12" fill="none" opacity=".5">${Array.from({ length: 7 }, (_, r) => `<path d="${Array.from({ length: 13 }, (_, i) => `${i ? 'L' : 'M'}${i * 40} ${r * 56 + (i % 2 ? 20 : 0)}`).join(' ')}"/>`).join('')}</g>`,
  'Rayos': (a, b) => `<rect width="480" height="360" fill="${b}"/><g fill="${a}" opacity=".4">${Array.from({ length: 12 }, (_, i) => `<path d="M240 180 L${240 + 500 * Math.cos(i * Math.PI / 6)} ${180 + 500 * Math.sin(i * Math.PI / 6)} L${240 + 500 * Math.cos((i + .5) * Math.PI / 6)} ${180 + 500 * Math.sin((i + .5) * Math.PI / 6)} Z"/>`).join('')}</g>`,
  'Ondas': (a, b) => `<rect width="480" height="360" fill="${b}"/><g stroke="${a}" stroke-width="10" fill="none" opacity=".45">${Array.from({ length: 8 }, (_, r) => `<path d="M0 ${r * 48 + 20} q30 -20 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0"/>`).join('')}</g>`
};

function buildBackdrops() {
  const out = HERO_BACKDROPS.map(b => Object.assign(b, { cat: 'clasicos', sub: 'Clásicos', tags: ['clasicos'], destacado: true }));
  const seen = new Set(out.map(b => b.name));
  const add = (name, fn, tags = [], cat = 'clasicos', sub = '') => {
    if (seen.has(name)) return; seen.add(name);
    const o = { name, gen: fn, tags, cat, sub };
    Object.defineProperty(o, 'src', { get() { return this._s || (this._s = this.gen()); }, configurable: true });
    out.push(o);
  };
  // escenas: 12 cielos × 8 suelos = 96 (decorado según el suelo)
  const DEC = { 'Pradera': 'árboles', 'Desierto': 'cactus', 'Nieve': 'montañas', 'Roca': 'montañas', 'Lava': 'nubes', 'Agua': 'burbujas', 'Ciudad': 'edificios', 'Arena': 'nubes' };
  SKY.forEach(sk => Object.keys(GROUND).forEach(gn =>
    add(`${gn} · ${sk[0]}`, () => sceneBD(sk, gn, DEC[gn]), ['escenas', gn.toLowerCase(), sk[0].toLowerCase()], 'escenas', gn)));
  // patrones: 10 × 18 colores = 180
  Object.keys(PATTERNS).forEach(pn => PAL.forEach(p =>
    add(`${pn} ${p[0]}`, () => BD2(PATTERNS[pn](p[2], p[1]),
      `<linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="${p[1]}"/><stop offset="100%" stop-color="${p[3]}"/></linearGradient>`),
      ['patrones', pn.toLowerCase()], 'patrones', pn)));
  return out;
}

/* Sustituye las constantes base por el catálogo completo */
const HERO_LIBRARY = LIBRARY, HERO_BACKDROPS = BACKDROPS;
LIBRARY = buildLibrary();
BACKDROPS = buildBackdrops();

/* ======================= TAXONOMÍA PARA EL SELECTOR ======================= */
const SPRITE_CATS = [
  { id: '', name: 'Todos', icon: 'globe' },
  { id: 'destacados', name: 'Destacados', icon: 'star-fill' },
  { id: 'animales', name: 'Animales', icon: 'paw' },
  { id: 'fantasia', name: 'Fantasía', icon: 'flame' },
  { id: 'robots', name: 'Robots', icon: 'robot' },
  { id: 'personas', name: 'Personas', icon: 'person' },
  { id: 'comida', name: 'Comida', icon: 'food' },
  { id: 'vehiculos', name: 'Vehículos', icon: 'car' },
  { id: 'formas', name: 'Formas', icon: 'shape' },
  { id: 'objetos', name: 'Objetos', icon: 'balloon' },
  { id: 'letras', name: 'Letras', icon: 'type' }
];
const BACKDROP_CATS = [
  { id: '', name: 'Todos', icon: 'globe' },
  { id: 'clasicos', name: 'Clásicos', icon: 'star-fill' },
  { id: 'escenas', name: 'Escenas', icon: 'scene' },
  { id: 'patrones', name: 'Patrones', icon: 'pattern' }
];
/* Subcategorías disponibles dentro de una categoría */
function subsOf(list, cat) {
  const m = new Map();
  list.forEach(i => { if ((!cat || i.cat === cat) && i.sub && !m.has(i.sub)) m.set(i.sub, i); });
  return [...m.keys()].sort((a, b) => a.localeCompare(b, 'es'));
}
