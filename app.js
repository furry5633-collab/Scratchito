/* ================== Scratchito · Motor principal ================== */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const uid = () => Math.random().toString(36).slice(2, 9);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------------- Estado del proyecto ---------------- */
let P = null;          // proyecto
let sel = null;        // sprite seleccionado
let running = false;
let threads = [];
let answer = '';
let timerStart = Date.now();
let mouse = { x: 0, y: 0, down: false };
const keysDown = new Set();

function nuevoSprite(libItem, x = 0, y = 0) {
  return {
    id: uid(), name: libItem.name, x, y, dir: 90, size: 100, visible: true,
    costumes: libItem.costumes.map(c => ({ ...c })), costume: 0,
    sounds: [{ ...SOUNDS[0] }, { ...SOUNDS[1] }],
    scripts: [], effects: { fantasma: 0, brillo: 0, color: 0, pixelar: 0 },
    rot: 'todo alrededor', bubble: null, pen: { down: false, color: '#4c97ff', size: 3 },
    volume: 100, isClone: false
  };
}

function proyectoNuevo() {
  const gato = nuevoSprite(LIBRARY[0]);
  return {
    name: 'Mi proyecto',
    sprites: [gato],
    backdrops: [BACKDROPS[0], BACKDROPS[1]],
    backdrop: 1,
    vars: { 'mi variable': 0 },
    varsShown: { 'mi variable': true },
    lists: { 'mi lista': [] },
    msgs: ['mensaje1'],
    stageScripts: []
  };
}

/* ================== BLOQUES: modelo ================== */
function nuevoBloque(op) {
  const def = BLOCKS[op];
  const b = { id: uid(), op, fields: {}, inputs: {} };
  const walk = spec => spec.forEach(p => {
    if (p.t === 'num' || p.t === 'text') b.fields[p.k] = p.d;
    if (p.t === 'menu') b.fields[p.k] = resolveMenu(p)[0] ?? p.d;
    if (p.t === 'color') b.fields[p.k] = p.d;
    if (p.t === 'slot') b.inputs[p.k] = p.d;
    if (p.t === 'bool') b.inputs[p.k] = null;
  });
  walk(def.spec); if (def.spec2) walk(def.spec2);
  if (def.shape === 'c' || def.shape === 'c2') b.children = [];
  if (def.shape === 'c2') b.children2 = [];
  return b;
}

function resolveMenu(p) {
  let out = [];
  for (const o of p.opts) {
    if (o === '@disfraces') out.push(...(sel ? sel.costumes.map(c => c.name) : []));
    else if (o === '@fondos') out.push(...P.backdrops.map(b => b.name));
    else if (o === '@sonidos') out.push(...(sel ? sel.sounds.map(s => s.name) : []));
    else if (o === '@objetos') out.push(...P.sprites.filter(s => s !== sel).map(s => s.name));
    else if (o === '@vars') out.push(...Object.keys(P.vars));
    else if (o === '@listas') out.push(...Object.keys(P.lists));
    else out.push(o);
  }
  if (!out.length) out = ['—'];
  return out;
}

/* ================== BLOQUES: render DOM ================== */
function renderBlock(b, opts = {}) {
  const def = BLOCKS[b.op];
  const wrap = document.createElement('div');
  wrap.className = 'blockrow';
  wrap.dataset.bid = b.id;

  const el = document.createElement('div');
  el.className = 'block';           // ¡ojo! nunca añadir def.shape como clase: 'stack' colisiona con .stack{position:absolute}
  if (def.shape === 'hat') el.classList.add('hat');
  if (def.shape === 'cap') el.classList.add('cap');
  if (def.shape === 'reporter') el.classList.add('reporter');
  if (def.shape === 'boolean') el.classList.add('boolean');
  el.dataset.cat = def.cat; el.dataset.bid = b.id;
  el.append(...renderSpec(b, def.spec, opts));
  wrap.append(el);

  if (def.shape === 'c' || def.shape === 'c2') {
    wrap.append(mkBody(b, 'children', def.cat, opts));
    if (def.shape === 'c2') {
      const el2 = document.createElement('div');
      el2.className = 'block'; el2.dataset.cat = def.cat; el2.dataset.bid = b.id; el2.dataset.part = '2';
      el2.append(...renderSpec(b, def.spec2, opts));
      wrap.append(el2, mkBody(b, 'children2', def.cat, opts));
    }
    const foot = document.createElement('div');
    foot.className = 'cfoot'; foot.dataset.cat = def.cat;
    if (!def.cap) wrap.append(foot); else { foot.style.borderRadius = '0 0 14px 14px'; wrap.append(foot); }
  }
  return wrap;
}

function mkBody(b, key, cat, opts) {
  const body = document.createElement('div');
  body.className = 'cbody' + ((b[key] || []).length ? '' : ' empty');
  body.dataset.cat = cat; body.dataset.body = key; body.dataset.owner = b.id;
  (b[key] || []).forEach(ch => body.append(renderBlock(ch, opts)));
  return body;
}

function renderSpec(b, spec, opts) {
  const nodes = [];
  for (const p of spec) {
    if (p.t === 'label') {
      const s = document.createElement('span');
      if (p.v.includes('@')) {
        // "girar @rot-cw" -> texto + icono CSS
        s.innerHTML = p.v.replace(/@([a-z-]+)/g, '<span class="ic ic-$1 blk-ic"></span>');
      } else s.textContent = p.v;
      nodes.push(s);
    }
    else if (p.t === 'num' || p.t === 'text') {
      const i = document.createElement('input');
      i.className = 'bfield' + (p.t === 'text' ? ' text' : '');
      i.value = b.fields[p.k]; i.size = Math.max(2, String(b.fields[p.k]).length);
      if (p.t === 'num') i.inputMode = 'decimal';
      i.oninput = () => { b.fields[p.k] = i.value; i.size = Math.max(2, i.value.length); };
      i.onpointerdown = e => e.stopPropagation();
      nodes.push(i);
    }
    else if (p.t === 'menu') {
      const s = document.createElement('select'); s.className = 'bfield';
      const list = resolveMenu(p);
      if (b.fields[p.k] && !list.includes(b.fields[p.k])) list.unshift(b.fields[p.k]);
      list.forEach(o => { const op = document.createElement('option'); op.value = op.textContent = o; s.append(op); });
      s.value = b.fields[p.k] ?? list[0];
      s.onchange = () => b.fields[p.k] = s.value;
      s.onpointerdown = e => e.stopPropagation();
      nodes.push(s);
    }
    else if (p.t === 'color') {
      const i = document.createElement('input'); i.type = 'color'; i.className = 'colorfield';
      i.value = b.fields[p.k]; i.oninput = () => b.fields[p.k] = i.value;
      i.onpointerdown = e => e.stopPropagation(); nodes.push(i);
    }
    else if (p.t === 'slot' || p.t === 'bool') {
      const slot = document.createElement('div');
      slot.className = 'bslot' + (p.t === 'bool' ? ' bool' : '');
      slot.dataset.slot = p.k; slot.dataset.owner = b.id; slot.dataset.kind = p.t;
      const val = b.inputs[p.k];
      if (val && typeof val === 'object') { slot.classList.add('filled'); slot.append(renderBlock(val, opts)); }
      else if (p.t === 'slot') {
        const i = document.createElement('input'); i.className = 'bfield';
        i.value = val ?? ''; i.size = Math.max(2, String(val ?? '').length);
        i.oninput = () => { b.inputs[p.k] = i.value; i.size = Math.max(2, i.value.length); };
        i.onpointerdown = e => e.stopPropagation();
        slot.classList.add('filled'); slot.append(i);
      }
      nodes.push(slot);
    }
  }
  return nodes;
}

/* ================== Lienzo de scripts ================== */
const layer = () => $('#scriptLayer');
function scripts() { return sel ? sel.scripts : P.stageScripts; }

function renderScripts() {
  const lay = layer(); lay.innerHTML = '';
  const hint = document.querySelector('#canvasHint');
  if (hint) hint.style.display = scripts().length ? 'none' : 'block';
  const bc = document.querySelector('#blkCount');
  if (bc) { const n = scripts().reduce((a, s) => a + s.blocks.length, 0); bc.textContent = n ? `(${n})` : ''; }
  scripts().forEach(st => {
    const d = document.createElement('div');
    d.className = 'stack'; d.style.left = st.x + 'px'; d.style.top = st.y + 'px';
    d.dataset.sid = st.id;
    st.blocks.forEach(b => d.append(renderBlock(b)));
    lay.append(d);
  });
}

function findStack(id) { return scripts().find(s => s.id === id); }

/* --- localizar un bloque y su contenedor --- */
function locate(bid, arr = null, parent = null) {
  const roots = arr || scripts().map(s => s.blocks);
  for (const list of (arr ? [arr] : scripts().map(s => s.blocks))) {
    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      if (b.id === bid) return { list, i, b };
      for (const k of ['children', 'children2']) if (b[k]) { const r = locate(bid, b[k]); if (r) return r; }
      for (const k in b.inputs) { const v = b.inputs[k]; if (v && typeof v === 'object') { if (v.id === bid) return { input: b, key: k, b: v }; const r = locate(bid, [v]); if (r) return r; } }
    }
  }
  return null;
}

/* ================== Arrastre ================== */
const isMobile = () => window.innerWidth <= 900;
function nextFreeY() {
  const ss = scripts(); if (!ss.length) return 40;
  return Math.max(...ss.map(s => s.y)) + 120;
}
let drag = null;

function onPointerDown(e) {
  const blockEl = e.target.closest('.block');
  if (!blockEl) return;
  if (e.target.closest('input,select')) return;
  const fromPalette = !!e.target.closest('#palette');
  const bid = blockEl.dataset.bid;
  e.preventDefault();

  let stackBlocks, origin;
  const canvasRect = $('#canvas').getBoundingClientRect();

  if (fromPalette) {
    const op = blockEl.dataset.op;
    stackBlocks = [nuevoBloque(op)];
    origin = { x: e.clientX, y: e.clientY };
  } else {
    const loc = locate(bid);
    if (!loc) return;
    if (loc.input) { const b = loc.b; loc.input.inputs[loc.key] = ''; stackBlocks = [b]; }
    else { stackBlocks = loc.list.splice(loc.i); }
    origin = { x: e.clientX, y: e.clientY };
  }

  const ghost = document.createElement('div');
  ghost.className = 'stack dragging';
  stackBlocks.forEach(b => ghost.append(renderBlock(b)));
  document.body.append(ghost);
  ghost.style.position = 'fixed';
  const r = blockEl.getBoundingClientRect();
  const off = { x: e.clientX - r.left, y: e.clientY - r.top };
  ghost.style.left = (e.clientX - off.x) + 'px';
  ghost.style.top = (e.clientY - off.y) + 'px';

  drag = { ghost, blocks: stackBlocks, off, fromPalette };
  renderScripts(); renderStage();
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp, { once: true });
}

function onPointerMove(e) {
  if (!drag) return;
  drag.ghost.style.left = (e.clientX - drag.off.x) + 'px';
  drag.ghost.style.top = (e.clientY - drag.off.y) + 'px';
  highlightTarget(e);
  const t = $('#trash').getBoundingClientRect();
  const over = e.clientX > t.left - 10 && e.clientX < t.right + 10 && e.clientY > t.top - 10 && e.clientY < t.bottom + 10;
  $('#trash').classList.toggle('hot', over);
}

let dropHint = null;
function clearHint() { if (dropHint) { dropHint.el?.remove(); dropHint = null; } }

function highlightTarget(e) {
  clearHint();
  const first = drag.blocks[0], def = BLOCKS[first.op];
  const px = e.clientX - drag.off.x + 10, py = e.clientY - drag.off.y + 10;

  if (def.shape === 'reporter' || def.shape === 'boolean') {
    const slots = $$('#scriptLayer .bslot').filter(s => def.shape === 'boolean' ? true : s.dataset.kind === 'slot');
    let best = null, bd = 60;
    slots.forEach(s => {
      if (s.closest('.stack.dragging')) return;
      if (def.shape === 'reporter' && s.dataset.kind === 'bool') return;
      const r = s.getBoundingClientRect();
      const d = Math.hypot(r.left + r.width / 2 - px, r.top + r.height / 2 - py);
      if (d < bd) { bd = d; best = s; }
    });
    if (best) { best.style.outline = '3px solid #ffde3a'; dropHint = { slot: best, el: null, clear: () => best.style.outline = '' }; }
    return;
  }
  if (def.shape === 'hat') return; // sombreros van sueltos
  // buscar punto de conexión de pila
  let best = null, bd = 70;
  $$('#scriptLayer .blockrow').forEach(row => {
    if (row.closest('.stack.dragging')) return;
    const rb = BLOCKS[findAnyBlock(row.dataset.bid)?.op];
    if (!rb) return;
    const r = row.getBoundingClientRect();
    const d = Math.hypot(r.left + 18 - px, r.bottom - py);
    if (d < bd && rb.shape !== 'reporter' && rb.shape !== 'boolean') { bd = d; best = { row, pos: 'after' }; }
  });
  $$('#scriptLayer .cbody').forEach(body => {
    if (body.closest('.stack.dragging')) return;
    const r = body.getBoundingClientRect();
    const d = Math.hypot(r.left + 18 - px, r.top + 4 - py);
    if (d < bd) { bd = d; best = { body, pos: 'in' }; }
  });
  if (best) {
    const line = document.createElement('div'); line.className = 'dropline';
    if (best.pos === 'after') best.row.after(line); else best.body.prepend(line);
    dropHint = { ...best, el: line, clear: () => { } };
  }
}

function findAnyBlock(bid, arr) {
  const lists = arr ? [arr] : scripts().map(s => s.blocks);
  for (const list of lists) for (const b of list) {
    if (b.id === bid) return b;
    for (const k of ['children', 'children2']) if (b[k]) { const r = findAnyBlock(bid, b[k]); if (r) return r; }
    for (const k in b.inputs) { const v = b.inputs[k]; if (v && typeof v === 'object') { const r = findAnyBlock(bid, [v]); if (r) return r; } }
  }
  return null;
}

function onPointerUp(e) {
  window.removeEventListener('pointermove', onPointerMove);
  if (!drag) return;
  const { blocks, ghost } = drag;
  const gr = ghost.getBoundingClientRect();
  ghost.remove();
  $('#trash').classList.remove('hot');

  const t = $('#trash').getBoundingClientRect();
  const inTrash = e.clientX > t.left - 10 && e.clientX < t.right + 10 && e.clientY > t.top - 10 && e.clientY < t.bottom + 10;
  const cv = $('#canvas').getBoundingClientRect();
  const insideCanvas = e.clientX > cv.left && e.clientX < cv.right && e.clientY > cv.top && e.clientY < cv.bottom;

  if (inTrash) { clearHint(); drag = null; renderScripts(); toast('Bloque borrado'); return; }

  // MÓVIL: soltar un bloque de la paleta lo envía al código y salta a esa vista
  if (isMobile() && drag.fromPalette && document.body.dataset.pane !== 'canvas') {
    const st = { id: uid(), x: 40, y: nextFreeY(), blocks };
    scripts().push(st);
    clearHint(); drag = null;
    setPane('canvas'); renderScripts(); save();
    toast('Añadido a tu código');
    return;
  }
  if (drag.fromPalette && !insideCanvas && !isMobile() && !dropHint) {
    clearHint(); drag = null; renderScripts(); return;
  }

  if (dropHint) {
    dropHint.clear?.();
    if (dropHint.slot) {
      const owner = findAnyBlock(dropHint.slot.dataset.owner);
      if (owner) owner.inputs[dropHint.slot.dataset.slot] = blocks[0];
    } else if (dropHint.pos === 'after') {
      const loc = locate(dropHint.row.dataset.bid);
      if (loc && loc.list) loc.list.splice(loc.i + 1, 0, ...blocks);
    } else {
      const owner = findAnyBlock(dropHint.body.dataset.owner);
      if (owner) owner[dropHint.body.dataset.body].unshift(...blocks);
    }
    dropHint.el?.remove(); dropHint = null;
  } else {
    // nueva pila suelta
    const lay = layer().getBoundingClientRect();
    scripts().push({ id: uid(), x: Math.max(4, gr.left - lay.left), y: Math.max(4, gr.top - lay.top), blocks });
  }
  drag = null;
  scripts().forEach((s, i) => { if (!s.blocks.length) scripts().splice(i, 1); });
  renderScripts(); save();
}

/* mover pila completa arrastrando su primer bloque ya está cubierto (se recrea) */

/* ================== ESCENARIO ================== */
const SW = 480, SH = 360;
function stageScale() { return $('#stage').clientWidth / SW; }

function renderStage() {
  const st = $('#stage');
  st.querySelectorAll('.sprite,.bubble').forEach(n => n.remove());
  $('#stageBg').src = P.backdrops[P.backdrop].src;
  const k = stageScale();
  P.sprites.forEach(sp => {
    if (!sp.visible) return;
    const img = document.createElement('img');
    img.className = 'sprite'; img.src = sp.costumes[sp.costume].src; img.dataset.id = sp.id;
    img.draggable = false;
    const size = 100 * (sp.size / 100) * k;
    img.style.width = size + 'px'; img.style.height = size + 'px';
    const cx = (sp.x + SW / 2) * k, cy = (SH / 2 - sp.y) * k;
    let rot = sp.rot === 'todo alrededor' ? (sp.dir - 90) : 0;
    let flip = (sp.rot === 'izquierda-derecha' && sp.dir < 0) ? -1 : 1;
    img.style.transform = `translate(${cx - size / 2}px,${cy - size / 2}px) rotate(${rot}deg) scaleX(${flip})`;
    img.style.opacity = 1 - (sp.effects.fantasma || 0) / 100;
    const f = [];
    if (sp.effects.brillo) f.push(`brightness(${1 + sp.effects.brillo / 100})`);
    if (sp.effects.color) f.push(`hue-rotate(${sp.effects.color * 1.8}deg)`);
    if (sp.effects.pixelar) f.push(`blur(${Math.min(6, sp.effects.pixelar / 20)}px)`);
    img.style.filter = f.join(' ');
    st.append(img);
    if (sp.bubble) {
      const b = document.createElement('div');
      b.className = 'bubble' + (sp.bubble.think ? ' think' : '');
      b.textContent = sp.bubble.text;
      b.style.left = clamp(cx + size / 3, 2, st.clientWidth - 100) + 'px';
      b.style.top = Math.max(2, cy - size / 2 - 34) + 'px';
      st.append(b);
    }
  });
  renderMonitors();
}

function renderMonitors() {
  const st = $('#stage');
  st.querySelectorAll('.var-monitor').forEach(n => n.remove());
  let i = 0;
  for (const k in P.vars) {
    if (!P.varsShown[k]) continue;
    const d = document.createElement('div');
    d.className = 'var-monitor'; d.style.left = '6px'; d.style.top = (6 + i * 22) + 'px';
    d.innerHTML = `<b>${k}</b><span>${P.vars[k]}</span>`;
    st.append(d); i++;
  }
}

/* ================== AUDIO ================== */
let AC = null;
const actx = () => (AC ||= new (window.AudioContext || window.webkitAudioContext)());
function env(g, t, a, d, peak = .3) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.001, t + a + d); }

function playSound(kind, vol = 100) {
  const ctx = actx(); if (ctx.state === 'suspended') ctx.resume();
  const t = ctx.currentTime, V = vol / 100;
  const out = ctx.createGain(); out.gain.value = V; out.connect(ctx.destination);
  const tone = (type, f0, f1, dur, peak = .3, delay = 0) => {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t + delay);
    o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + delay + dur);
    env(g, t + delay, .01, dur, peak); o.connect(g).connect(out); o.start(t + delay); o.stop(t + delay + dur + .05);
  };
  const noise = (dur, peak = .3, delay = 0, hp = 800) => {
    const n = ctx.createBufferSource(), buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    n.buffer = buf; const g = ctx.createGain(); env(g, t + delay, .005, dur, peak);
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
    n.connect(f).connect(g).connect(out); n.start(t + delay);
  };
  switch (kind) {
    case 'meow': tone('sawtooth', 700, 420, .45, .18); tone('sine', 350, 220, .45, .12); break;
    case 'pop': tone('sine', 900, 200, .09, .35); break;
    case 'woof': tone('square', 260, 90, .22, .22); noise(.12, .08, 0, 400); break;
    case 'boing': tone('sine', 180, 900, .18, .28); tone('sine', 900, 200, .2, .2, .18); break;
    case 'coin': tone('square', 988, 988, .08, .22); tone('square', 1319, 1319, .2, .22, .08); break;
    case 'laser': tone('sawtooth', 1800, 120, .25, .2); break;
    case 'drum': tone('sine', 160, 45, .22, .5); noise(.05, .12, 0, 200); break;
    case 'clap': for (let i = 0; i < 4; i++) noise(.06, .18, i * .035, 1200); break;
    case 'magic': [523, 659, 784, 1047].forEach((f, i) => tone('triangle', f, f, .22, .16, i * .07)); break;
    case 'fail': tone('sawtooth', 400, 120, .45, .22); break;
    case 'jump': tone('square', 300, 900, .14, .2); break;
    case 'bell': tone('sine', 1047, 1047, .9, .22); tone('sine', 1568, 1568, .6, .1); break;
    default: tone('sine', 440, 440, .2, .2);
  }
  return kindDur(kind);
}
function kindDur(k) { return ({ meow: .5, pop: .12, woof: .3, boing: .4, coin: .3, laser: .3, drum: .3, clap: .25, magic: .5, fail: .5, jump: .18, bell: 1 })[k] || .3; }
function playNote(n, dur, vol = 100) {
  const ctx = actx(); if (ctx.state === 'suspended') ctx.resume();
  const f = 440 * Math.pow(2, (n - 69) / 12), t = ctx.currentTime;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'triangle'; o.frequency.value = f;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.25 * vol / 100, t + .02);
  g.gain.setValueAtTime(.25 * vol / 100, t + Math.max(.05, dur - .05));
  g.gain.exponentialRampToValueAtTime(.001, t + dur);
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + .05);
}

/* ================== LÁPIZ ================== */
function penCtx() {
  const c = $('#penLayer');
  if (c.width !== SW || c.height !== SH) { c.width = SW; c.height = SH; }
  return c.getContext('2d');
}
function penLine(sp, x0, y0, x1, y1) {
  const g = penCtx(); g.save();
  g.globalAlpha = sp.pen.alpha ?? 1;
  g.strokeStyle = sp.pen.color; g.lineWidth = sp.pen.size; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x0 + SW / 2, SH / 2 - y0); g.lineTo(x1 + SW / 2, SH / 2 - y1); g.stroke();
  g.restore();
}
/* Desplaza el matiz de un color hex (para "cambiar color por") */
function shiftHue(hex, deg) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) / 255, g2 = ((n >> 8) & 255) / 255, b2 = (n & 255) / 255;
  const mx = Math.max(r, g2, b2), mn = Math.min(r, g2, b2), d = mx - mn;
  let h = 0; const l = (mx + mn) / 2;
  const s2 = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d) { h = mx === r ? ((g2 - b2) / d) % 6 : mx === g2 ? (b2 - r) / d + 2 : (r - g2) / d + 4; h *= 60; }
  h = (h + deg) % 360; if (h < 0) h += 360;
  const c = (1 - Math.abs(2 * l - 1)) * s2, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
  const t = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + t.map(v => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('');
}

/* ================== INTÉRPRETE ================== */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const frame = () => new Promise(r => requestAnimationFrame(r));
class StopSignal { }

function num(v) { const n = parseFloat(v); return isNaN(n) ? 0 : n; }

async function evalInput(v, ctx) {
  if (v && typeof v === 'object') return await evalBlock(v, ctx);
  return v;
}

async function evalBlock(b, ctx) {
  const sp = ctx.sprite, f = b.fields;
  const A = async k => await evalInput(b.inputs[k], ctx);
  switch (b.op) {
    case 'posX': return Math.round(sp.x);
    case 'posY': return Math.round(sp.y);
    case 'direccion': return sp.dir;
    case 'numDisfraz': return sp.costume + 1;
    case 'tamano': return sp.size;
    case 'volumen': return sp.volume;
    case 'respuesta': return answer;
    case 'ratonX': return Math.round(mouse.x);
    case 'ratonY': return Math.round(mouse.y);
    case 'ratonAbajo': return mouse.down;
    case 'cronometro': return +((Date.now() - timerStart) / 1000).toFixed(1);
    case 'reiniciarCrono': timerStart = Date.now(); return;
    case 'fechaActual': { const d = new Date(); return ({ 'año': d.getFullYear(), 'mes': d.getMonth() + 1, 'día': d.getDate(), 'hora': d.getHours(), 'minuto': d.getMinutes(), 'segundo': d.getSeconds() })[f.u]; }
    case 'teclaPulsada': return keyIsDown(f.tecla);
    case 'tocando': return isTouching(sp, f.obj);
    case 'tocandoColor': return isTouching(sp, 'puntero del ratón') && false || touchingColorApprox(sp, f.col);
    case 'distanciaA': {
      if (f.obj === 'puntero del ratón') return Math.round(Math.hypot(sp.x - mouse.x, sp.y - mouse.y));
      const o = P.sprites.find(s => s.name === f.obj); return o ? Math.round(Math.hypot(sp.x - o.x, sp.y - o.y)) : 0;
    }
    case 'sumar': return num(await A('a')) + num(await A('b'));
    case 'restar': return num(await A('a')) - num(await A('b'));
    case 'multiplicar': return num(await A('a')) * num(await A('b'));
    case 'dividir': { const d = num(await A('b')); return d ? num(await A('a')) / d : 0; }
    case 'azar': { const a = num(f.a), b2 = num(f.b); const r = a + Math.random() * (b2 - a); return (String(f.a).includes('.') || String(f.b).includes('.')) ? +r.toFixed(2) : Math.round(r); }
    case 'mayor': return cmp(await A('a'), await A('b')) > 0;
    case 'menor': return cmp(await A('a'), await A('b')) < 0;
    case 'igual': return cmp(await A('a'), await A('b')) === 0;
    case 'y': return !!(await A('a')) && !!(await A('b'));
    case 'o': return !!(await A('a')) || !!(await A('b'));
    case 'no': return !(await A('a'));
    case 'unir': return String(await A('a')) + String(await A('b'));
    case 'letraDe': return String(await A('s'))[num(f.n) - 1] ?? '';
    case 'largoDe': return String(await A('s')).length;
    case 'contiene': return String(await A('a')).toLowerCase().includes(String(await A('b')).toLowerCase());
    case 'modulo': { const d = num(await A('b')); return d ? ((num(await A('a')) % d) + d) % d : 0; }
    case 'redondear': return Math.round(num(await A('a')));
    case 'mateDe': {
      const x = num(await A('a'));
      return ({ abs: Math.abs(x), 'piso': Math.floor(x), 'techo': Math.ceil(x), 'raíz': Math.sqrt(x), sin: +Math.sin(x * Math.PI / 180).toFixed(4), cos: +Math.cos(x * Math.PI / 180).toFixed(4), tan: +Math.tan(x * Math.PI / 180).toFixed(4), ln: Math.log(x), log: Math.log10(x), 'e^': Math.exp(x), '10^': Math.pow(10, x) })[f.f];
    }
    // --- apariencia ---
    case 'nombreDisfraz': return sp.costumes[sp.costume].name;
    case 'nombreFondo': return P.backdrops[P.backdrop].name;
    case 'numFondo': return P.backdrop + 1;
    case 'estaVisible': return !!sp.visible;
    // --- sonido ---
    case 'tono': return sp.tono || 0;
    // --- eventos ---
    case 'mensajeRecibido': return P.ultimoMsg || '';
    // --- control ---
    case 'contador': return ctx.contador ?? 0;
    // --- sensores ---
    case 'tocandoBorde': {
      const bx = spriteBox(sp);
      const t = { superior: bx.t >= SH / 2, inferior: bx.b <= -SH / 2, izquierdo: bx.l <= -SW / 2, derecho: bx.r >= SW / 2 };
      return f.b === 'cualquiera' ? Object.values(t).some(Boolean) : t[f.b];
    }
    case 'clicEnMi': return mouse.down && isTouching(sp, 'puntero del ratón');
    case 'propiedadDe': {
      const o = P.sprites.find(x => x.name === f.obj) || sp;
      return ({ 'posición en x': Math.round(o.x), 'posición en y': Math.round(o.y), 'dirección': o.dir, 'tamaño': o.size, 'número de disfraz': o.costume + 1 })[f.prop];
    }
    case 'anchoEscenario': return SW;
    case 'altoEscenario': return SH;
    case 'numObjetos': return P.sprites.length;
    case 'esMovil': return window.innerWidth <= 900;
    // --- movimiento ---
    case 'distanciaXY': return Math.round(Math.hypot(sp.x - num(f.x), sp.y - num(f.y)));
    // --- operadores ---
    case 'mayorIgual': return cmp(await A('a'), await A('b')) >= 0;
    case 'menorIgual': return cmp(await A('a'), await A('b')) <= 0;
    case 'distinto': return cmp(await A('a'), await A('b')) !== 0;
    case 'entre': { const v = num(await A('a')), lo = num(await A('b')), hi = num(await A('c')); return v >= Math.min(lo, hi) && v <= Math.max(lo, hi); }
    case 'potencia': return Math.pow(num(await A('a')), num(await A('b')));
    case 'minimo': return Math.min(num(await A('a')), num(await A('b')));
    case 'maximo': return Math.max(num(await A('a')), num(await A('b')));
    case 'limitar': { const lo = num(await A('b')), hi = num(await A('c')); return clamp(num(await A('a')), Math.min(lo, hi), Math.max(lo, hi)); }
    case 'mayusculas': { const t = String(await A('s')); return f.caso === 'MAYÚSCULAS' ? t.toUpperCase() : t.toLowerCase(); }
    case 'reemplazar': return String(await A('s')).split(String(await A('a'))).join(String(await A('b')));
    case 'esNumero': { const v = String(await A('a')).trim(); return v !== '' && !isNaN(Number(v)); }
    case 'redondearA': { const d = Math.max(0, Math.min(10, num(f.n))); return +num(await A('a')).toFixed(d); }
    // --- listas ---
    case 'listaContiene': return (P.lists[f.l] || []).map(String).includes(String(await A('val')));
    case 'posEnLista': return (P.lists[f.l] || []).map(String).indexOf(String(await A('val'))) + 1;
    case 'elemAzar': { const l = P.lists[f.l] || []; return l.length ? l[Math.floor(Math.random() * l.length)] : ''; }
    case 'listaComoTexto': return (P.lists[f.l] || []).join(f.sep ?? ', ');
    case 'leerVar': return P.vars[f.v] ?? 0;
    case 'elemLista': return (P.lists[f.l] || [])[num(f.i) - 1] ?? '';
    case 'largoLista': return (P.lists[f.l] || []).length;
  }
  return 0;
}
function cmp(a, b) {
  const na = parseFloat(a), nb = parseFloat(b);
  if (!isNaN(na) && !isNaN(nb) && String(a).trim() !== '' && String(b).trim() !== '') return na - nb;
  return String(a).toLowerCase().localeCompare(String(b).toLowerCase());
}
function keyIsDown(k) {
  if (k === 'cualquiera') return keysDown.size > 0;
  const map = { 'espacio': ' ', 'flecha arriba': 'arrowup', 'flecha abajo': 'arrowdown', 'flecha derecha': 'arrowright', 'flecha izquierda': 'arrowleft' };
  return keysDown.has((map[k] || k).toLowerCase());
}
function spriteBox(sp) { const s = 100 * sp.size / 100; return { l: sp.x - s / 2, r: sp.x + s / 2, t: sp.y + s / 2, b: sp.y - s / 2 }; }
function isTouching(sp, target) {
  if (target === 'puntero del ratón') { const b = spriteBox(sp); return mouse.x > b.l && mouse.x < b.r && mouse.y > b.b && mouse.y < b.t; }
  if (target === 'borde') { const b = spriteBox(sp); return b.l <= -SW / 2 || b.r >= SW / 2 || b.t >= SH / 2 || b.b <= -SH / 2; }
  const o = P.sprites.find(s => s.name === target && s !== sp);
  if (!o || !o.visible) return false;
  const a = spriteBox(sp), c = spriteBox(o);
  return a.l < c.r && a.r > c.l && a.b < c.t && a.t > c.b;
}
function touchingColorApprox(sp, hex) { return false; }

async function runStack(blocks, ctx) {
  for (const b of blocks) {
    if (ctx.stopped()) throw new StopSignal();
    await exec(b, ctx);
  }
}

async function exec(b, ctx) {
  const sp = ctx.sprite, f = b.fields;
  const A = async k => await evalInput(b.inputs[k], ctx);
  const upd = () => renderStage();
  switch (b.op) {
    /* Movimiento */
    case 'mover': { const r = sp.dir * Math.PI / 180, ox = sp.x, oy = sp.y; sp.x += Math.sin(r) * num(f.pasos); sp.y += Math.cos(r) * num(f.pasos); clampStage(sp); if (sp.pen.down) penLine(sp, ox, oy, sp.x, sp.y); upd(); break; }
    case 'girarD': sp.dir = wrapDir(sp.dir + num(f.g)); upd(); break;
    case 'girarI': sp.dir = wrapDir(sp.dir - num(f.g)); upd(); break;
    case 'irA': { const ox = sp.x, oy = sp.y; sp.x = num(f.x); sp.y = num(f.y); if (sp.pen.down) penLine(sp, ox, oy, sp.x, sp.y); upd(); break; }
    case 'irAObj': { const ox = sp.x, oy = sp.y; if (f.destino === 'puntero del ratón') { sp.x = mouse.x; sp.y = mouse.y; } else { sp.x = Math.round(Math.random() * SW - SW / 2); sp.y = Math.round(Math.random() * SH - SH / 2); } if (sp.pen.down) penLine(sp, ox, oy, sp.x, sp.y); upd(); break; }
    case 'deslizar': {
      const t0 = performance.now(), dur = num(f.s) * 1000, x0 = sp.x, y0 = sp.y, x1 = num(f.x), y1 = num(f.y);
      while (true) {
        if (ctx.stopped()) throw new StopSignal();
        const p = dur <= 0 ? 1 : Math.min(1, (performance.now() - t0) / dur);
        const ox = sp.x, oy = sp.y;
        sp.x = x0 + (x1 - x0) * p; sp.y = y0 + (y1 - y0) * p;
        if (sp.pen.down) penLine(sp, ox, oy, sp.x, sp.y);
        upd(); if (p >= 1) break; await frame();
      } break;
    }
    case 'apuntarA': sp.dir = wrapDir(num(f.dir)); upd(); break;
    case 'apuntarHacia': { const dx = mouse.x - sp.x, dy = mouse.y - sp.y; sp.dir = wrapDir(Math.atan2(dx, dy) * 180 / Math.PI); upd(); break; }
    case 'cambiarX': { const ox = sp.x; sp.x += num(f.v); clampStage(sp); if (sp.pen.down) penLine(sp, ox, sp.y, sp.x, sp.y); upd(); break; }
    case 'fijarX': sp.x = num(f.v); upd(); break;
    case 'cambiarY': { const oy = sp.y; sp.y += num(f.v); clampStage(sp); if (sp.pen.down) penLine(sp, sp.x, oy, sp.x, sp.y); upd(); break; }
    case 'fijarY': sp.y = num(f.v); upd(); break;
    case 'rebotar': {
      const b2 = spriteBox(sp);
      if (b2.l < -SW / 2 || b2.r > SW / 2) { sp.dir = wrapDir(-sp.dir); sp.x = clamp(sp.x, -SW / 2 + 20, SW / 2 - 20); }
      if (b2.t > SH / 2 || b2.b < -SH / 2) { sp.dir = wrapDir(180 - sp.dir); sp.y = clamp(sp.y, -SH / 2 + 20, SH / 2 - 20); }
      upd(); break;
    }
    case 'estiloRot': sp.rot = f.estilo; upd(); break;
    case 'irADeslizando': {
      const tx = f.destino === 'puntero del ratón' ? mouse.x : Math.round(Math.random() * SW - SW / 2);
      const ty = f.destino === 'puntero del ratón' ? mouse.y : Math.round(Math.random() * SH - SH / 2);
      await exec({ op: 'deslizar', fields: { s: f.s, x: tx, y: ty }, inputs: {} }, ctx); break;
    }
    case 'moverHacia': {
      let tx = mouse.x, ty = mouse.y;
      if (f.destino !== 'puntero del ratón') { const o = P.sprites.find(x => x.name === f.destino); if (o) { tx = o.x; ty = o.y; } }
      const d = Math.hypot(tx - sp.x, ty - sp.y) || 1, k = num(f.pasos) / d;
      const ox = sp.x, oy = sp.y;
      sp.x += (tx - sp.x) * k; sp.y += (ty - sp.y) * k;
      if (sp.pen.down) penLine(sp, ox, oy, sp.x, sp.y); upd(); break;
    }
    case 'apuntarObj': { const o = P.sprites.find(x => x.name === f.obj); if (o) sp.dir = wrapDir(Math.atan2(o.x - sp.x, o.y - sp.y) * 180 / Math.PI); upd(); break; }
    case 'cambiarXY': { const ox = sp.x, oy = sp.y; sp.x += num(f.x); sp.y += num(f.y); clampStage(sp); if (sp.pen.down) penLine(sp, ox, oy, sp.x, sp.y); upd(); break; }
    case 'rebotarSuave': {
      sp.vx = sp.vx ?? num(f.vx); sp.vy = sp.vy ?? num(f.v);
      const ox = sp.x, oy = sp.y;
      sp.x += sp.vx; sp.y += sp.vy;
      const bx = spriteBox(sp);
      if (bx.l < -SW / 2 || bx.r > SW / 2) { sp.vx *= -1; sp.x = clamp(sp.x, -SW / 2 + 20, SW / 2 - 20); }
      if (bx.t > SH / 2 || bx.b < -SH / 2) { sp.vy *= -1; sp.y = clamp(sp.y, -SH / 2 + 20, SH / 2 - 20); }
      if (sp.pen.down) penLine(sp, ox, oy, sp.x, sp.y); upd(); break;
    }
    case 'ponerEnBorde': {
      const h = 50 * sp.size / 100;
      if (f.borde === 'superior') sp.y = SH / 2 - h; if (f.borde === 'inferior') sp.y = -SH / 2 + h;
      if (f.borde === 'izquierdo') sp.x = -SW / 2 + h; if (f.borde === 'derecho') sp.x = SW / 2 - h;
      upd(); break;
    }

    /* Apariencia */
    case 'decirPor': sp.bubble = { text: f.msg }; upd(); await wait(num(f.s), ctx); sp.bubble = null; upd(); break;
    case 'decir': sp.bubble = String(f.msg).trim() ? { text: f.msg } : null; upd(); break;
    case 'pensarPor': sp.bubble = { text: f.msg, think: true }; upd(); await wait(num(f.s), ctx); sp.bubble = null; upd(); break;
    case 'pensar': sp.bubble = String(f.msg).trim() ? { text: f.msg, think: true } : null; upd(); break;
    case 'cambiarDisfraz': { const i = sp.costumes.findIndex(c => c.name === f.disfraz); if (i >= 0) sp.costume = i; upd(); break; }
    case 'siguienteDisfraz': sp.costume = (sp.costume + 1) % sp.costumes.length; upd(); break;
    case 'cambiarFondo': { const i = P.backdrops.findIndex(c => c.name === f.fondo); if (i >= 0) { P.backdrop = i; fireBackdrop(P.backdrops[i].name); } upd(); break; }
    case 'siguienteFondo': P.backdrop = (P.backdrop + 1) % P.backdrops.length; fireBackdrop(P.backdrops[P.backdrop].name); upd(); break;
    case 'cambiarTam': sp.size = clamp(sp.size + num(f.v), 5, 500); upd(); break;
    case 'fijarTam': sp.size = clamp(num(f.v), 5, 500); upd(); break;
    case 'cambiarEfecto': sp.effects[f.ef] = (sp.effects[f.ef] || 0) + num(f.v); upd(); break;
    case 'fijarEfecto': sp.effects[f.ef] = num(f.v); upd(); break;
    case 'quitarEfectos': sp.effects = { fantasma: 0, brillo: 0, color: 0, pixelar: 0 }; upd(); break;
    case 'mostrar': sp.visible = true; upd(); break;
    case 'esconder': sp.visible = false; upd(); break;
    case 'disfrazAnterior': sp.costume = (sp.costume - 1 + sp.costumes.length) % sp.costumes.length; upd(); break;
    case 'disfrazAzar': sp.costume = Math.floor(Math.random() * sp.costumes.length); upd(); break;
    case 'fondoAzar': P.backdrop = Math.floor(Math.random() * P.backdrops.length); fireBackdrop(P.backdrops[P.backdrop].name); upd(); break;
    case 'cambiarCapas': { const i = P.sprites.indexOf(sp), n = num(f.n) * (f.dir === 'adelante' ? 1 : -1); P.sprites.splice(i, 1); P.sprites.splice(clamp(i + n, 0, P.sprites.length), 0, sp); upd(); break; }
    case 'parpadear': { for (let i = 0; i < num(f.n); i++) { sp.visible = false; upd(); await wait(.15, ctx); sp.visible = true; upd(); await wait(.15, ctx); } break; }
    case 'rebotarTam': { const base = sp.size; for (const k of [1.25, .9, 1.08, 1]) { sp.size = base * k; upd(); await wait(.07, ctx); } sp.size = base; upd(); break; }
    case 'alFrente': { const i = P.sprites.indexOf(sp); P.sprites.splice(i, 1); f.capa === 'frontal' ? P.sprites.push(sp) : P.sprites.unshift(sp); upd(); break; }

    /* Sonido */
    case 'tocarSonido': { const s = sp.sounds.find(x => x.name === f.snd); if (s) playSound(s.kind, sp.volume); break; }
    case 'tocarSonidoHasta': { const s = sp.sounds.find(x => x.name === f.snd); if (s) { const d = playSound(s.kind, sp.volume); await wait(d, ctx); } break; }
    case 'pararSonidos': if (AC) { AC.close(); AC = null; } break;
    case 'tocarNota': playNote(num(f.nota), num(f.s), sp.volume); await wait(num(f.s), ctx); break;
    case 'tocarMelodia': {
      const M2 = { alegre: [60, 64, 67, 72], triste: [69, 67, 64, 60], victoria: [60, 64, 67, 72, 76], misterio: [61, 63, 66, 61], fanfarria: [67, 67, 67, 72] };
      for (const n2 of (M2[f.mel] || M2.alegre)) { playNote(n2 + (sp.tono || 0), .22, sp.volume); await wait(.22, ctx); } break;
    }
    case 'tocarTambor': { playSound({ bombo: 'drum', caja: 'clap', 'platillo': 'bell', tom: 'boing', palmada: 'clap' }[f.t] || 'drum', sp.volume); await wait(num(f.s), ctx); break; }
    case 'silencio': await wait(num(f.s), ctx); break;
    case 'cambiarTono': sp.tono = (sp.tono || 0) + num(f.v); break;
    case 'fijarTono': sp.tono = num(f.v); break;
    case 'cambiarVol': sp.volume = clamp(sp.volume + num(f.v), 0, 100); break;
    case 'fijarVol': sp.volume = clamp(num(f.v), 0, 100); break;

    /* Eventos */
    case 'enviar': P.ultimoMsg = f.msg; broadcast(f.msg); break;
    case 'enviarEsperar': P.ultimoMsg = f.msg; await Promise.all(broadcast(f.msg)); break;

    /* Control */
    case 'esperar': await wait(num(f.s), ctx); break;
    case 'repetir': { const n = num(f.n); for (let i = 0; i < n; i++) { if (ctx.stopped()) throw new StopSignal(); await runStack(b.children, ctx); await frame(); } break; }
    case 'porSiempre': while (true) { if (ctx.stopped()) throw new StopSignal(); await runStack(b.children, ctx); await frame(); } 
    case 'si': if (await A('cond')) await runStack(b.children, ctx); break;
    case 'siSino': if (await A('cond')) await runStack(b.children, ctx); else await runStack(b.children2, ctx); break;
    case 'esperarHasta': while (!(await A('cond'))) { if (ctx.stopped()) throw new StopSignal(); await frame(); } break;
    case 'repetirHasta': while (!(await A('cond'))) { if (ctx.stopped()) throw new StopSignal(); await runStack(b.children, ctx); await frame(); } break;
    case 'esperarFrames': { for (let i = 0; i < num(f.n); i++) { if (ctx.stopped()) throw new StopSignal(); await frame(); } break; }
    case 'repetirDesde': {
      const a = num(f.a), b2 = num(f.b), paso = b2 >= a ? 1 : -1;
      for (let i = a; paso > 0 ? i <= b2 : i >= b2; i += paso) {
        if (ctx.stopped()) throw new StopSignal();
        ctx.contador = i; await runStack(b.children, ctx); await frame();
      } break;
    }
    case 'mientras': while (await A('cond')) { if (ctx.stopped()) throw new StopSignal(); await runStack(b.children, ctx); await frame(); } break;
    case 'siNoEntonces': if (!(await A('cond'))) await runStack(b.children, ctx); break;
    case 'detener': if (f.q === 'todos') { stopAll(); throw new StopSignal(); } else throw new StopSignal();
    case 'crearClon': { crearClon(sp); break; }
    case 'borrarClon': if (sp.isClone) { P.sprites = P.sprites.filter(s => s !== sp); upd(); } throw new StopSignal();

    /* Sensores */
    case 'preguntar': { sp.bubble = { text: f.q }; upd(); answer = await ask(f.q, ctx); sp.bubble = null; upd(); break; }
    case 'reiniciarCrono': timerStart = Date.now(); break;

    /* Variables */
    case 'fijarVar': P.vars[f.v] = await A('val'); renderMonitors(); break;
    case 'cambiarVar': P.vars[f.v] = num(P.vars[f.v]) + num(f.val); renderMonitors(); break;
    case 'mostrarVar': P.varsShown[f.v] = true; renderMonitors(); break;
    case 'esconderVar': P.varsShown[f.v] = false; renderMonitors(); break;
    case 'anadirLista': (P.lists[f.l] ||= []).push(await A('val')); break;
    case 'borrarElem': { const l = P.lists[f.l] || []; const i = num(f.i) - 1; if (i >= 0 && i < l.length) l.splice(i, 1); break; }
    case 'insertarEn': { const l = (P.lists[f.l] ||= []); l.splice(clamp(num(f.i) - 1, 0, l.length), 0, await A('val')); break; }
    case 'reemplazarEn': { const l = P.lists[f.l] || []; const i = num(f.i) - 1; if (i >= 0 && i < l.length) l[i] = await A('val'); break; }
    case 'borrarLista': P.lists[f.l] = []; break;

    /* Lápiz */
    case 'borrarLapiz': penCtx().clearRect(0, 0, SW, SH); break;
    case 'bajarLapiz': sp.pen.down = true; break;
    case 'subirLapiz': sp.pen.down = false; break;
    case 'colorLapiz': sp.pen.color = f.col; break;
    case 'grosorLapiz': sp.pen.size = num(f.v); break;
    case 'cambiarColorLapiz': { sp.pen.color = shiftHue(sp.pen.color, num(f.v) * 3.6); break; }
    case 'colorAzarLapiz': sp.pen.color = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'); break;
    case 'cambiarGrosor': sp.pen.size = clamp(sp.pen.size + num(f.v), 1, 50); break;
    case 'transpLapiz': sp.pen.alpha = 1 - clamp(num(f.v), 0, 100) / 100; break;
    case 'dibujarCirculo': {
      const g = penCtx(); g.save(); g.globalAlpha = sp.pen.alpha ?? 1;
      g.strokeStyle = sp.pen.color; g.lineWidth = sp.pen.size;
      g.beginPath(); g.arc(sp.x + SW / 2, SH / 2 - sp.y, Math.abs(num(f.r)), 0, Math.PI * 2); g.stroke(); g.restore(); break;
    }
    case 'dibujarPoligono': {
      const n2 = Math.max(3, num(f.n)), t = num(f.t), g = penCtx();
      g.save(); g.globalAlpha = sp.pen.alpha ?? 1; g.strokeStyle = sp.pen.color; g.lineWidth = sp.pen.size;
      g.beginPath();
      for (let i = 0; i <= n2; i++) {
        const ang = (i / n2) * Math.PI * 2 + (sp.dir - 90) * Math.PI / 180;
        const px = sp.x + SW / 2 + Math.cos(ang) * t, py = SH / 2 - sp.y + Math.sin(ang) * t;
        i ? g.lineTo(px, py) : g.moveTo(px, py);
      }
      g.stroke(); g.restore(); break;
    }
    case 'escribirTexto': {
      const g = penCtx(); g.save(); g.globalAlpha = sp.pen.alpha ?? 1;
      g.fillStyle = sp.pen.color; g.font = `bold ${num(f.n)}px Arial, Helvetica, sans-serif`;
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(String(f.txt), sp.x + SW / 2, SH / 2 - sp.y); g.restore(); break;
    }
    case 'sello': { const g = penCtx(); const im = new Image(); im.src = sp.costumes[sp.costume].src; await new Promise(r => { im.onload = r; im.onerror = r; }); const s = 100 * sp.size / 100; g.save(); g.translate(sp.x + SW / 2, SH / 2 - sp.y); g.rotate((sp.dir - 90) * Math.PI / 180); g.drawImage(im, -s / 2, -s / 2, s, s); g.restore(); break; }
  }
}

function wrapDir(d) { d = ((d + 180) % 360 + 360) % 360 - 180; return d === -180 ? 180 : d; }
function clampStage(sp) { sp.x = clamp(sp.x, -SW / 2 - 20, SW / 2 + 20); sp.y = clamp(sp.y, -SH / 2 - 20, SH / 2 + 20); }
async function wait(sec, ctx) {
  const end = performance.now() + sec * 1000;
  while (performance.now() < end) { if (ctx.stopped()) throw new StopSignal(); await frame(); }
}
function ask(q, ctx) {
  return new Promise(res => {
    const box = $('#askBox'); box.style.display = 'flex';
    const inp = $('#askInput'); inp.value = ''; inp.placeholder = q; inp.focus();
    const done = () => { box.style.display = 'none'; $('#askOk').onclick = null; inp.onkeydown = null; res(inp.value); };
    $('#askOk').onclick = done;
    inp.onkeydown = e => { if (e.key === 'Enter') done(); };
  });
}

function crearClon(sp) {
  const c = JSON.parse(JSON.stringify({ ...sp, scripts: [] }));
  c.id = uid(); c.isClone = true; c.scripts = sp.scripts; c.name = sp.name;
  P.sprites.push(c); renderStage();
  startHats(c, b => b.op === 'alClonar');
}

/* --- hilos --- */
function mkCtx(sprite) { let dead = false; const c = { sprite, stopped: () => !running || dead, kill: () => dead = true }; return c; }

function startHats(sprite, pred) {
  const list = (sprite ? sprite.scripts : P.stageScripts);
  const out = [];
  list.forEach(st => {
    const head = st.blocks[0];
    if (!head || !pred(head)) return;
    const ctx = mkCtx(sprite || P.sprites[0]);
    threads.push(ctx);
    const p = runStack(st.blocks.slice(1), ctx).catch(e => { if (!(e instanceof StopSignal)) console.error(e); });
    out.push(p);
  });
  return out;
}

function allTargets() { return P.sprites; }
function broadcast(msg) {
  let ps = [];
  allTargets().forEach(sp => ps.push(...startHats(sp, b => b.op === 'alRecibir' && b.fields.msg === msg)));
  return ps;
}
function fireBackdrop(name) { allTargets().forEach(sp => startHats(sp, b => b.op === 'alFondo' && b.fields.fondo === name)); }

function greenFlag() {
  stopAll(); running = true; timerStart = Date.now();
  if (AC?.state === 'suspended') AC.resume();
  $('#flag').classList.add('glow');
  allTargets().forEach(sp => startHats(sp, b => b.op === 'alBandera' || b.op === 'alCargar'));
  startHats(null, b => b.op === 'alBandera' || b.op === 'alCargar');
  startWatchers();
}

/* Vigila los sombreros que dependen de una condición continua:
   "al tocar X" y "cuando cronómetro > N" (se disparan al pasar de falso a verdadero) */
let watchTimer = null;
const watchState = new Map();
function startWatchers() {
  clearInterval(watchTimer);
  watchState.clear();
  watchTimer = setInterval(() => {
    if (!running) return;
    P.sprites.forEach(sp => sp.scripts.forEach(st => {
      const h = st.blocks[0];
      if (!h) return;
      let on = false;
      if (h.op === 'alTocarObj') on = isTouching(sp, h.fields.obj);
      else if (h.op === 'alMayorQue') {
        const v = h.fields.q === 'cronómetro' ? (Date.now() - timerStart) / 1000 : 0;
        on = v > num(h.fields.v);
      } else return;
      const key = sp.id + st.id, prev = watchState.get(key) || false;
      watchState.set(key, on);
      if (on && !prev) {
        const ctx = mkCtx(sp); threads.push(ctx);
        runStack(st.blocks.slice(1), ctx).catch(e => { if (!(e instanceof StopSignal)) console.error(e); });
      }
    }));
  }, 100);
}
function stopAll() {
  running = false; clearInterval(watchTimer); watchTimer = null; watchState.clear();
  threads.forEach(t => t.kill()); threads = [];
  P.sprites = P.sprites.filter(s => !s.isClone);
  $('#flag').classList.remove('glow');
  $('#askBox').style.display = 'none';
  renderStage();
}

/* teclado / ratón */
window.addEventListener('keydown', e => {
  keysDown.add(e.key.toLowerCase());
  if (running) allTargets().forEach(sp => startHats(sp, b => b.op === 'alTecla' && (b.fields.tecla === 'cualquiera' || matchKey(b.fields.tecla, e.key))));
  if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && e.target === document.body) e.preventDefault();
});
window.addEventListener('keyup', e => keysDown.delete(e.key.toLowerCase()));
function matchKey(name, key) {
  const map = { 'espacio': ' ', 'flecha arriba': 'arrowup', 'flecha abajo': 'arrowdown', 'flecha derecha': 'arrowright', 'flecha izquierda': 'arrowleft' };
  return (map[name] || name).toLowerCase() === key.toLowerCase();
}

/* ================== Interacción escenario ================== */
function initStageEvents() {
  const st = $('#stage');
  const toStage = e => { const r = st.getBoundingClientRect(), k = SW / r.width; return { x: (e.clientX - r.left) * k - SW / 2, y: SH / 2 - (e.clientY - r.top) * k * (SW / SH) / (SW / SH) }; };
  st.addEventListener('pointermove', e => { const r = st.getBoundingClientRect(); mouse.x = clamp((e.clientX - r.left) / r.width * SW - SW / 2, -240, 240); mouse.y = clamp(SH / 2 - (e.clientY - r.top) / r.height * SH, -180, 180); });
  st.addEventListener('pointerdown', e => {
    mouse.down = true;
    const t = e.target.closest('.sprite');
    if (t) { const sp = P.sprites.find(s => s.id === t.dataset.id); if (sp && running) startHats(sp, b => b.op === 'alClicObjeto'); if (sp && !running) { selectSprite(sp); dragSpriteStart(e, sp); } }
  });
  window.addEventListener('pointerup', () => mouse.down = false);
}
function dragSpriteStart(e, sp) {
  const st = $('#stage'), r = st.getBoundingClientRect();
  const move = ev => { sp.x = clamp((ev.clientX - r.left) / r.width * SW - SW / 2, -240, 240); sp.y = clamp(SH / 2 - (ev.clientY - r.top) / r.height * SH, -180, 180); renderStage(); syncSpriteFields(); };
  const up = () => { window.removeEventListener('pointermove', move); save(); };
  window.addEventListener('pointermove', move); window.addEventListener('pointerup', up, { once: true });
}

/* ================== UI: paleta ================== */
let curCat = 'motion';
function renderCats() {
  const c = $('#cats'); c.innerHTML = '';
  CATS.forEach(cat => {
    const b = document.createElement('button');
    b.className = 'cat-item' + (cat.id === curCat ? ' active' : '');
    b.innerHTML = `<span class="cat-dot" style="background:${cat.color}"><span class="ic ic-${cat.icon}"></span></span>${cat.id === 'myblocks' ? 'Lápiz' : cat.name}`;
    b.onclick = () => { curCat = cat.id; renderCats(); renderPalette(); $('#palette').scrollTop = 0; };
    c.append(b);
  });
}
const CAT_NOTE = {
  motion: 'Mueve, gira y coloca a tu personaje por el escenario (480 × 360).',
  looks: 'Cambia disfraces, tamaño, efectos y haz que hable o piense.',
  sound: 'Reproduce efectos, notas musicales y controla el volumen.',
  events: 'Bloques sombrero: arrancan tus programas. ¡Empieza siempre por uno!',
  control: 'Bucles, condiciones, esperas y clones. El cerebro del proyecto.',
  sensing: 'Detecta teclas, ratón, contacto entre objetos y preguntas al usuario.',
  operators: 'Matemáticas, comparaciones, lógica y manipulación de texto.',
  variables: 'Guarda datos que cambian: puntos, vidas, tiempo, listas...',
  myblocks: 'Extensión Lápiz: dibuja trazos y sella al personaje en el escenario.'
};

function renderPalette() {
  const p = $('#palette'); p.innerHTML = '';
  const cat = CATS.find(c => c.id === curCat);
  const t = document.createElement('div'); t.className = 'pal-title';
  t.innerHTML = `<span class="bubble-ic" style="background:${cat.color}"><span class="ic ic-${cat.icon}"></span></span>${curCat === 'myblocks' ? 'Lápiz' : cat.name}`;
  p.append(t);
  const note = document.createElement('div'); note.className = 'pal-note'; note.textContent = CAT_NOTE[curCat] || '';
  p.append(note);
  if (curCat === 'variables') {
    const btn = document.createElement('button'); btn.className = 'minibtn'; btn.innerHTML = '<span class="ic ic-plus"></span> Crear variable';
    btn.style.marginBottom = '8px';
    btn.onclick = () => { const n = prompt('Nombre de la variable:'); if (n) { P.vars[n] = 0; P.varsShown[n] = true; renderPalette(); renderMonitors(); save(); } };
    const btn2 = document.createElement('button'); btn2.className = 'minibtn'; btn2.innerHTML = '<span class="ic ic-plus"></span> Crear lista';
    btn2.style.cssText = 'margin:0 0 8px 6px';
    btn2.onclick = () => { const n = prompt('Nombre de la lista:'); if (n) { P.lists[n] = []; renderPalette(); save(); } };
    p.append(btn, btn2);
  }
  if (curCat === 'events') {
    const btn = document.createElement('button'); btn.className = 'minibtn'; btn.innerHTML = '<span class="ic ic-plus"></span> Nuevo mensaje';
    btn.style.marginBottom = '8px';
    btn.onclick = () => { const n = prompt('Nombre del mensaje:'); if (n) { P.msgs.push(n); renderPalette(); save(); } };
    p.append(btn);
  }
  PALETTE[curCat].forEach(op => {
    const b = nuevoBloque(op);
    if (op === 'alRecibir' || op === 'enviar' || op === 'enviarEsperar') b.fields.msg = P.msgs[0];
    const node = renderBlock(b);
    node.style.marginBottom = '10px';
    node.querySelectorAll('.block').forEach(el => el.dataset.op = op);
    node.querySelectorAll('input,select').forEach(i => i.tabIndex = -1);
    p.append(node);
  });
  // menús de mensaje personalizados
  p.querySelectorAll('select').forEach(s => { });
}

/* ================== UI: sprites ================== */
function renderSprites() {
  const l = $('#spriteList'); l.innerHTML = '';
  P.sprites.filter(s => !s.isClone).forEach(sp => {
    const c = document.createElement('div');
    c.className = 'sp-card' + (sp === sel ? ' sel' : '');
    c.innerHTML = `<img src="${sp.costumes[sp.costume].src}"><div>${sp.name}</div>`;
    if (P.sprites.length > 1) {
      const d = document.createElement('button'); d.className = 'del'; d.textContent = '×';
      d.onclick = ev => { ev.stopPropagation(); P.sprites = P.sprites.filter(s => s !== sp); if (sel === sp) sel = P.sprites[0]; refreshAll(); save(); };
      c.append(d);
    }
    c.onclick = () => selectSprite(sp);
    l.append(c);
  });
  $('#stageThumb').src = P.backdrops[P.backdrop].src;
  syncSpriteFields();
}
function selectSprite(sp) { sel = sp; refreshAll(); }
function syncSpriteFields() {
  if (!sel) return;
  $('#fName').value = sel.name; $('#fX').value = Math.round(sel.x); $('#fY').value = Math.round(sel.y);
  $('#fSize').value = Math.round(sel.size); $('#fDir').value = Math.round(sel.dir);
  $('#fShow').innerHTML = `<span class="ic ic-${sel.visible ? 'eye' : 'eye-off'}"></span>`;
  $('#fShow').classList.toggle('off', !sel.visible);
}
function refreshAll() { renderCats(); renderPalette(); renderScripts(); renderStage(); renderSprites(); renderAssets(); }

/* ================== Disfraces y sonidos ================== */
let assetTab = 'costumes';
function renderAssets() {
  const pane = $('#assetsPane'); if (!sel) return;
  pane.innerHTML = '';
    if (assetTab === 'costumes') {
    sel.costumes.forEach((c, i) => {
      const row = document.createElement('div'); row.className = 'asset-row';
      row.innerHTML = `<div class="thumbbox"><img src="${c.src}"></div><div><div class="nm">${i + 1}. ${c.name}</div><div class="sub">${i === sel.costume ? '<i class="dot"></i>en uso' : 'disfraz'}</div></div>`;
      const acts = document.createElement('div'); acts.className = 'acts';
      const use = mk('Usar', () => { sel.costume = i; renderStage(); renderSprites(); });
      const ren = mk('Nombre', () => { const n = prompt('Nuevo nombre:', c.name); if (n) { c.name = n; renderAssets(); renderPalette(); save(); } });
      const del = mk('Borrar', () => { if (sel.costumes.length > 1) { sel.costumes.splice(i, 1); sel.costume = 0; refreshAll(); save(); } }, true);
      acts.append(use, ren, del); row.append(acts); pane.append(row);
    });
    pane.append(mk('Añadir disfraz desde la biblioteca', () => openPicker('costume'), false, true, 'plus'));
  } else {
    sel.sounds.forEach((s, i) => {
      const row = document.createElement('div'); row.className = 'asset-row';
      row.innerHTML = `<div class="thumbbox"><span class="ic ic-note ic-lg"></span></div><div><div class="nm">${i + 1}. ${s.name}</div><div class="sub">efecto de sonido</div></div>`;
      const acts = document.createElement('div'); acts.className = 'acts';
      acts.append(mk('Oír', () => playSound(s.kind, 100)), mk('Borrar', () => { sel.sounds.splice(i, 1); renderAssets(); renderPalette(); save(); }, true));
      row.append(acts); pane.append(row);
    });
    pane.append(mk('Añadir sonido', () => openPicker('sound'), false, true, 'plus'));
  }
}
function mk(txt, fn, red, block, icon) {
  const b = document.createElement('button');
  b.className = block ? 'bigadd' : ('minibtn' + (red ? ' red' : ''));
  b.innerHTML = (icon ? `<span class="ic ic-${icon}"></span> ` : '') + txt;
  b.onclick = fn;
  return b;
}

/* ================== Selector (biblioteca) ==================
   Navegación en 2 niveles: categoría -> subcategoría, con buscador
   y carga por lotes. En móvil se comporta como hoja deslizante.     */
function openPicker(kind) {
  const m = $('#picker'), body = $('#pickerBody');
  const titles = { sprite: 'Personajes', costume: 'Disfraces', backdrop: 'Fondos', sound: 'Sonidos' };
  $('#pickerTitle').textContent = titles[kind];
  body.innerHTML = ''; body.scrollTop = 0;

  let items = [], cats = [];
  if (kind === 'sprite' || kind === 'costume') {
    items = LIBRARY.map(it => ({ lib: it, name: it.name, tags: it.tags || [], cat: it.cat, sub: it.sub, destacado: it.destacado }));
    cats = SPRITE_CATS;
  } else if (kind === 'backdrop') {
    items = BACKDROPS.map(b => ({ bd: b, name: b.name, tags: b.tags || [], cat: b.cat, sub: b.sub, destacado: b.destacado }));
    cats = BACKDROP_CATS;
  } else {
    items = SOUNDS.map(s => ({ snd: s, name: s.name, tags: [], cat: '', sub: '' }));
    cats = [{ id: '', name: 'Todos', icon: 'note' }];
  }

  let catSel = '', subSel = '', q = '';

  /* --- barra de búsqueda --- */
  const bar = document.createElement('div'); bar.className = 'pickbar';
  const sWrap = document.createElement('div'); sWrap.className = 'searchwrap';
  const search = document.createElement('input');
  search.className = 'picksearch'; search.type = 'search';
  search.placeholder = `Buscar entre ${items.length.toLocaleString('es')}…`;
  sWrap.append(search); bar.append(sWrap);

  /* --- fila de categorías --- */
  const catRow = document.createElement('div'); catRow.className = 'catrow';
  cats.forEach(c => {
    const b = document.createElement('button');
    b.className = 'catchip' + (c.id === catSel ? ' on' : '');
    b.innerHTML = `<span class="ci ic ic-${c.icon}"></span><span>${c.name}</span>`;
    b.onclick = () => {
      catSel = c.id; subSel = ''; q = ''; search.value = '';
      [...catRow.children].forEach(x => x.classList.remove('on')); b.classList.add('on');
      buildSubs(); refresh(); body.scrollTo({ top: 0, behavior: 'smooth' });
    };
    catRow.append(b);
  });
  bar.append(catRow);

  /* --- fila de subcategorías --- */
  const subRow = document.createElement('div'); subRow.className = 'subrow';
  bar.append(subRow);
  function buildSubs() {
    subRow.innerHTML = '';
    if (catSel === 'destacados' || kind === 'sound') { subRow.style.display = 'none'; return; }
    const subs = subsOf(items, catSel);
    if (subs.length < 2) { subRow.style.display = 'none'; return; }
    subRow.style.display = 'flex';
    const mk = (label, val) => {
      const b = document.createElement('button');
      b.className = 'subchip' + (val === subSel ? ' on' : '');
      b.textContent = label;
      b.onclick = () => { subSel = val; [...subRow.children].forEach(x => x.classList.remove('on')); b.classList.add('on'); refresh(); };
      subRow.append(b);
    };
    mk('Todo', '');
    subs.forEach(x => mk(x, x));
  }

  const count = document.createElement('div'); count.className = 'pickcount';
  const g = document.createElement('div'); g.className = 'grid';
  const more = document.createElement('div'); more.className = 'pickmore';
  body.append(bar, count, g, more);

  let filtered = items, shown = 0;
  const PAGE = 60;

  const choose = it => {
    if (kind === 'sprite') {
      const sp = nuevoSprite(it.lib, Math.round(Math.random() * 200 - 100), Math.round(Math.random() * 120 - 60));
      let n = 2, base = sp.name; while (P.sprites.some(s => s.name === sp.name)) sp.name = base + ' ' + n++;
      P.sprites.push(sp); sel = sp; refreshAll(); toast(`${sp.name} añadido`);
    }
    if (kind === 'costume') { it.lib.costumes.forEach(c => sel.costumes.push({ ...c })); renderAssets(); renderPalette(); toast('Disfraz añadido'); }
    if (kind === 'backdrop') {
      const bd = { name: it.bd.name, src: it.bd.src };
      if (!P.backdrops.some(x => x.name === bd.name)) P.backdrops.push(bd);
      P.backdrop = P.backdrops.findIndex(x => x.name === bd.name); refreshAll(); toast('Fondo aplicado');
    }
    if (kind === 'sound') { if (!sel.sounds.some(x => x.name === it.snd.name)) sel.sounds.push({ ...it.snd }); playSound(it.snd.kind); renderAssets(); renderPalette(); toast('Sonido añadido'); }
    closePicker(); save();
  };

  const card = it => {
    const b = document.createElement('button'); b.className = 'pick';
    let thumb;
    if (kind === 'sound') thumb = `<div class="sn"><span class="ic ic-note"></span></div>`;
    else if (it.bd) thumb = `<img loading="lazy" src="${it.bd.src}" class="bdthumb">`;
    else thumb = `<img loading="lazy" src="${it.lib.costumes[0].src}">`;
    b.innerHTML = thumb + `<div>${it.name}</div>`;
    b.onclick = () => choose(it);
    return b;
  };

  const renderBatch = () => {
    const slice = filtered.slice(shown, shown + PAGE);
    const frag = document.createDocumentFragment();
    slice.forEach(it => frag.append(card(it)));
    g.append(frag); shown += slice.length;
    more.textContent = shown < filtered.length ? `Desliza para ver más · ${shown} de ${filtered.length}` : (filtered.length ? '— fin de la lista —' : '');
  };
  const refresh = () => {
    filtered = items.filter(i =>
      (catSel === 'destacados' ? i.destacado : (!catSel || i.cat === catSel)) &&
      (!subSel || i.sub === subSel) &&
      (!q || i.name.toLowerCase().includes(q)));
    g.innerHTML = ''; shown = 0;
    count.textContent = filtered.length
      ? `${filtered.length.toLocaleString('es')} resultado${filtered.length === 1 ? '' : 's'}`
      : 'Sin resultados — prueba otra palabra';
    renderBatch();
  };
  let tmr; search.oninput = () => {
    clearTimeout(tmr);
    tmr = setTimeout(() => {
      q = search.value.trim().toLowerCase();
      if (q) { // buscar en todo el catálogo
        catSel = ''; subSel = '';
        [...catRow.children].forEach((x, i) => x.classList.toggle('on', i === 0));
        buildSubs();
      }
      refresh();
    }, 150);
  };
  body.onscroll = () => {
    if (shown < filtered.length && body.scrollTop + body.clientHeight > body.scrollHeight - 320) renderBatch();
  };

  buildSubs(); refresh();
  m.classList.add('open'); document.body.classList.add('modal-open');
  if (window.innerWidth > 900) setTimeout(() => search.focus(), 80);
}
function closePicker() {
  $('#picker').classList.remove('open');
  document.body.classList.remove('modal-open');
}

/* ================== Guardado ================== */
function save() { try { localStorage.setItem('scratchito', JSON.stringify(P)); } catch (e) { } }
function load() {
  try { const s = localStorage.getItem('scratchito'); if (s) { const p = JSON.parse(s); if (p?.sprites?.length) return p; } } catch (e) { }
  return null;
}

/* ================== Arranque ================== */
function init() {
  P = load() || proyectoNuevo();
  sel = P.sprites[0];
  layer().addEventListener('pointerdown', onPointerDown);
  $('#palette').addEventListener('pointerdown', onPointerDown);
  initStageEvents();

  $('#flag').onclick = () => { if (AC?.state === 'suspended') AC.resume(); greenFlag(); };
  $('#stopb').onclick = stopAll;
  $('#addSprite').onclick = () => openPicker('sprite');
  $('#addBackdrop').onclick = () => openPicker('backdrop');
  $('#pickerClose').onclick = closePicker;
  $('#picker').onclick = e => { if (e.target.id === 'picker') closePicker(); };
  $('#trash').onclick = () => { if (confirm('¿Borrar TODOS los bloques de este objeto?')) { (sel ? sel : { scripts: P.stageScripts }).scripts = []; if (sel) sel.scripts = []; renderScripts(); save(); } };

  $('#fName').onchange = e => { sel.name = e.target.value || sel.name; refreshAll(); save(); };
  $('#fX').onchange = e => { sel.x = num(e.target.value); renderStage(); save(); };
  $('#fY').onchange = e => { sel.y = num(e.target.value); renderStage(); save(); };
  $('#fSize').onchange = e => { sel.size = clamp(num(e.target.value), 5, 500); renderStage(); save(); };
  $('#fDir').onchange = e => { sel.dir = wrapDir(num(e.target.value)); renderStage(); save(); };
  $('#fShow').onclick = () => { sel.visible = !sel.visible; syncSpriteFields(); renderStage(); save(); };

  $$('.tab').forEach(t => t.onclick = () => { $$('.tab').forEach(x => x.classList.remove('active')); t.classList.add('active'); assetTab = t.dataset.tab; renderAssets(); });
  $('#btnNew').onclick = () => { if (confirm('¿Empezar un proyecto nuevo? Se perderá el actual.')) { P = proyectoNuevo(); sel = P.sprites[0]; refreshAll(); save(); } };
  $('#btnSave').onclick = () => { save(); const blob = new Blob([JSON.stringify(P)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = (P.name || 'proyecto') + '.scratchito.json'; a.click(); toast('Proyecto descargado'); };
  $('#btnLoad').onclick = () => $('#fileIn').click();
  $('#fileIn').onchange = e => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { P = JSON.parse(r.result); sel = P.sprites[0]; refreshAll(); save(); toast('¡Proyecto cargado!'); } catch { toast('Archivo no válido'); } }; r.readAsText(f); };
  $('#btnEjemplos').onclick = openExamples;

  // ---- navegación móvil ----
  const setView = v => {
    document.body.dataset.view = v;
    $$('.mobile-tabs button').forEach(x => x.classList.toggle('active', x.dataset.view === v));
    if (v === 'code' && !document.body.dataset.pane) setPane('palette');
    setTimeout(renderStage, 60);
  };
  const setPane = p => {
    document.body.dataset.pane = p;
    $$('.codeswitch button').forEach(x => x.classList.toggle('on', x.dataset.pane === p));
  };
  window.setView = setView; window.setPane = setPane;
  $$('.mobile-tabs button').forEach(b => b.onclick = () => setView(b.dataset.view));
  $$('.codeswitch button').forEach(b => b.onclick = () => setPane(b.dataset.pane));

  // barra de ejecución móvil
  $('#mFlag').onclick = () => { if (AC?.state === 'suspended') AC.resume(); greenFlag(); if (window.innerWidth <= 900) setView('stage'); };
  $('#mStop').onclick = stopAll;
  $('#mMenu').onclick = () => openMobileMenu();

  if (window.innerWidth <= 900) { setView('stage'); setPane('palette'); }

  // tamaños de escenario
  $$('.size-btns button').forEach(b => b.onclick = () => {
    $$('.size-btns button').forEach(x => x.classList.remove('active')); b.classList.add('active');
    const m = b.dataset.mode;
    const w = m === 'small' ? '300px' : m === 'big' ? '520px' : '392px';
    const col = $('.stage-col'); col.style.flexBasis = w; col.style.width = w;
    setTimeout(renderStage, 80);
  });

  // zoom del lienzo
  let zoom = 1;
  const applyZoom = () => { layer().style.transform = `scale(${zoom})`; };
  $('#zin').onclick = () => { zoom = clamp(zoom + .15, .5, 2); applyZoom(); };
  $('#zout').onclick = () => { zoom = clamp(zoom - .15, .5, 2); applyZoom(); };
  $('#zreset').onclick = () => { zoom = 1; applyZoom(); };

  // nombre de proyecto
  $('#projName').value = P.name || 'Mi proyecto';
  $('#projName').oninput = e => { P.name = e.target.value; $('#mName').textContent = e.target.value; save(); };
  $('#mName').textContent = P.name || 'Mi proyecto';

  // pantalla completa del escenario
  $('#btnFull').onclick = () => {
    const el = document.querySelector('.stage-card-main');
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.().then(() => setTimeout(renderStage, 120)).catch(() => toast('Tu navegador no permite pantalla completa'));
  };
  document.addEventListener('fullscreenchange', () => setTimeout(renderStage, 120));

  window.addEventListener('resize', () => renderStage());
  refreshAll();
  initTutorial();
  if (!localStorage.getItem('scratchito_visto')) { $('#tutorial').classList.add('open'); localStorage.setItem('scratchito_visto', '1'); }
}

function openMobileMenu() {
  const m = $('#picker'), body = $('#pickerBody');
  $('#pickerTitle').textContent = 'Proyecto';
  body.innerHTML = '';
  const acts = [
    ['book', 'Tutorial guiado', () => { closePicker(); $('#tutorial').classList.add('open'); }],
    ['game', 'Proyectos de ejemplo', () => { closePicker(); setTimeout(openExamples, 120); }],
    ['sparkle', 'Nuevo proyecto', () => { closePicker(); $('#btnNew').click(); }],
    ['save', 'Guardar / descargar', () => { closePicker(); $('#btnSave').click(); }],
    ['folder', 'Abrir proyecto', () => { closePicker(); $('#fileIn').click(); }],
    ['expand', 'Escenario a pantalla completa', () => { closePicker(); $('#btnFull').click(); }],
    ['pen', 'Renombrar proyecto', () => { const n = prompt('Nombre del proyecto:', P.name || ''); if (n) { P.name = n; $('#projName').value = n; $('#mName').textContent = n; save(); } closePicker(); }]
  ];
  acts.forEach(([ic, tx, fn]) => {
    const b = document.createElement('button');
    b.className = 'example-card menu-item';
    b.innerHTML = `<b><span class="ic ic-${ic} ic-lg"></span>${tx}</b>`;
    b.onclick = fn; body.append(b);
  });
  m.classList.add('open'); document.body.classList.add('modal-open');
}

function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 1800); }
document.addEventListener('DOMContentLoaded', init);
