/* ============ Scratchito · Tutorial guiado + proyectos de ejemplo ============ */
const dem = (cat, txt) => `<span class="demo" style="background:var(--${cat})">${txt}</span>`;

const STEPS = [
  { t: '¡Bienvenido a Scratchito!', h: `
    Scratchito es un estudio de programación con bloques, igual que Scratch, pero pensado para que se entienda
    a la primera y funcione perfecto en <b>móvil y ordenador</b>.<br><br>
    <b>Las 3 zonas:</b><br>
    <span class="ic ic-bricks"></span> <b>Bloques</b> — la lista de piezas de colores.<br>
    <span class="ic ic-script"></span> <b>Área de código</b> — donde las encajas.<br>
    <span class="ic ic-stage"></span> <b>Escenario</b> — donde ocurre la magia.<br><br>
    En móvil usa la barra de abajo para cambiar de zona, y el conmutador <b>Bloques / Mi código</b> para pasar de la lista de piezas al área de montaje.` },
  { t: '1 · Tu primer bloque', h: `
    Ve a <b>Bloques → Eventos</b> y arrastra ${dem('events', 'al hacer clic en la bandera')} al área de código.<br><br>
    Los bloques con forma de <b>sombrero</b> (redondeados arriba) son los que <b>arrancan</b> un programa.
    Sin uno de ellos, tu código no se ejecuta solo.` },
  { t: '2 · Haz que se mueva', h: `
    En <b>Movimiento</b>, arrastra ${dem('motion', 'mover 10 pasos')} y suéltalo <b>justo debajo</b> del sombrero:
    aparecerá una <b>línea amarilla</b> indicando que va a encajar.<br><br>
    Pulsa el botón <b>Ejecutar</b> y mira el escenario. ¡Se movió!<br><br>
    Toca el número blanco para cambiarlo a <code>50</code>.` },
  { t: '3 · Bucles: repetir sin escribir 100 veces', h: `
    En <b>Control</b> coge ${dem('control', 'repetir 10')} — es un bloque en forma de <b>C</b>: otros bloques
    van <b>dentro</b> de su hueco.<br><br>
    Mete dentro <code>mover 10 pasos</code> y ${dem('looks', 'siguiente disfraz')} + ${dem('control', 'esperar 0.2 segundos')}.
    ¡Eso es una animación de caminar!<br><br>
    ${dem('control', 'por siempre')} repite eternamente, hasta que pulses el botón <b>Detener</b>.` },
  { t: '4 · Disfraces: la clave de la animación', h: `
    Cada personaje tiene varios <b>disfraces</b> (poses). Cambiar de disfraz rápido crea movimiento.<br><br>
    Abre la pestaña <b>Disfraces</b>: puedes <i>usar</i>, <i>renombrar</i>, <i>borrar</i> o <b>añadir</b> más desde la biblioteca.<br><br>
    Bloques clave: ${dem('looks', 'siguiente disfraz')} y ${dem('looks', 'cambiar disfraz a')}.` },
  { t: '5 · Sonidos', h: `
    En la pestaña <b>Sonidos</b> añade efectos (Miau, Pop, Láser, Moneda...). Pruébalos con el botón <b>Oír</b>.<br><br>
    Luego usa ${dem('sound', 'iniciar sonido')} (sigue sin esperar) o
    ${dem('sound', 'tocar sonido hasta que termine')} (espera a que acabe).<br><br>
    Con ${dem('sound', 'tocar nota 60 por 0.5 segundos')} puedes componer melodías: 60 = Do central.` },
  { t: '6 · Coordenadas del escenario', h: `
    El escenario mide <b>480 × 360</b>. El centro es <code>x:0 y:0</code>.<br>
    x va de <code>-240</code> a <code>240</code> &nbsp;·&nbsp; y va de <code>-180</code> a <code>180</code>.<br><br>
    Prueba ${dem('motion', 'ir a x: 0 y: 0')} o ${dem('motion', 'deslizar en 1 segs a x: 100 y: 50')}.<br><br>
    Truco: también puedes <b>arrastrar el personaje con el dedo</b> por el escenario cuando el proyecto está parado.` },
  { t: '7 · Condiciones y sensores', h: `
    Los bloques <b>hexagonales</b> responden sí/no y encajan en los huecos con punta.<br><br>
    Ejemplo clásico: ${dem('control', 'si')} + ${dem('sensing', '¿tocando el borde?')} → dentro ${dem('motion', 'si toca un borde, rebotar')}.<br><br>
    Otros sensores útiles: ${dem('sensing', '¿tecla espacio presionada?')}, ${dem('sensing', 'preguntar y esperar')}, ${dem('sensing', 'cronómetro')}.` },
  { t: '8 · Variables (marcador, vidas…)', h: `
    En <b>Variables</b> pulsa <b>+ Crear variable</b> y llámala <code>puntos</code>.<br><br>
    Usa ${dem('variables', 'fijar puntos a 0')} al empezar y ${dem('variables', 'cambiar puntos por 1')} cuando el jugador acierte.
    El marcador aparece arriba a la izquierda del escenario.` },
  { t: '9 · Mensajes entre personajes', h: `
    ¿Quieres que un personaje avise a otro? En <b>Eventos</b>: ${dem('events', 'enviar mensaje1')} y en el otro
    personaje ${dem('events', 'al recibir mensaje1')}.<br><br>
    Puedes crear mensajes nuevos con <b>+ Nuevo mensaje</b>. Así se coordinan escenas y niveles.` },
  { t: '10 · Clones y lápiz', h: `
    ${dem('control', 'crear clon de mí mismo')} duplica el personaje en vivo (perfecto para balas, lluvia, enemigos).
    Los clones arrancan con ${dem('control', 'al comenzar como clon')}.<br><br>
    En <b>Lápiz</b> tienes bajar lápiz, color, grosor y sellar: dibuja rastros y espirales geométricas.` },
  { t: '¡Ya sabes lo básico!', h: `
    Pulsa <b>Ejemplos</b> arriba para cargar proyectos completos ya montados y ver cómo están hechos:
    juego de atrapar, carrera de naves, dibujo con lápiz, piano...<br><br>
    Tu proyecto se guarda solo en este dispositivo. Con <b>Guardar</b> lo descargas y con <b>Abrir</b> lo recuperas.<br><br>
    <b>Consejo final:</b> arrastra un bloque a la papelera para borrarlo. ¡A crear!` }
];

let stepIdx = 0;
function initTutorial() {
  document.querySelector('#btnTut').onclick = () => document.querySelector('#tutorial').classList.add('open');
  document.querySelector('#tutClose').onclick = () => document.querySelector('#tutorial').classList.remove('open');
  document.querySelector('#tutNext').onclick = () => { stepIdx = Math.min(STEPS.length - 1, stepIdx + 1); paintStep(); };
  document.querySelector('#tutPrev').onclick = () => { stepIdx = Math.max(0, stepIdx - 1); paintStep(); };
  paintStep();
}
function paintStep() {
  const s = STEPS[stepIdx];
  document.querySelector('#tutStep').innerHTML = `<h4>${s.t}</h4>${s.h}`;
  document.querySelector('#tutProg').textContent = `Paso ${stepIdx + 1} de ${STEPS.length}`;
  document.querySelector('#tutNext').textContent = stepIdx === STEPS.length - 1 ? '¡Listo!' : 'Siguiente ▶';
}

/* ================== EJEMPLOS ================== */
const bk = (op, fields = {}, inputs = {}, children = null, children2 = null) => {
  const b = nuevoBloque(op);
  Object.assign(b.fields, fields);
  for (const k in inputs) b.inputs[k] = inputs[k];
  if (children) b.children = children;
  if (children2) b.children2 = children2;
  return b;
};

function EJEMPLOS() {
  return [
    {
      name: 'Gato que camina y rebota',
      desc: 'Animación básica con bucle, disfraces y rebote en los bordes.',
      build() {
        const P2 = proyectoNuevo();
        P2.backdrop = 1;
        const g = P2.sprites[0];
        g.scripts = [{
          id: uid(), x: 40, y: 40, blocks: [
            bk('alBandera'), bk('irA', { x: -150, y: 0 }), bk('apuntarA', { dir: 90 }), bk('estiloRot', { estilo: 'izquierda-derecha' }),
            bk('porSiempre', {}, {}, [bk('mover', { pasos: 6 }), bk('siguienteDisfraz'), bk('rebotar'), bk('esperar', { s: 0.08 })])
          ]
        }];
        return P2;
      }
    },
    {
      name: 'Atrapa la manzana (juego)',
      desc: 'Mueve el gato con las flechas y suma puntos. Variables, clones y sensores.',
      build() {
        const P2 = proyectoNuevo();
        P2.backdrop = 1; P2.vars = { puntos: 0 }; P2.varsShown = { puntos: true };
        const gato = P2.sprites[0];
        gato.scripts = [{
          id: uid(), x: 30, y: 30, blocks: [
            bk('alBandera'), bk('fijarVar', { v: 'puntos' }, { val: '0' }), bk('irA', { x: 0, y: -130 }), bk('fijarTam', { v: 70 }),
            bk('porSiempre', {}, {}, [
              bk('si', {}, { cond: bk('teclaPulsada', { tecla: 'flecha derecha' }) }, [bk('cambiarX', { v: 8 })]),
              bk('si', {}, { cond: bk('teclaPulsada', { tecla: 'flecha izquierda' }) }, [bk('cambiarX', { v: -8 })])
            ])
          ]
        }];
        const man = nuevoSprite(LIBRARY.find(l => l.name === 'Manzana'), 0, 150);
        man.size = 55;
        man.sounds = [{ name: 'Moneda', kind: 'coin' }];
        man.scripts = [
          { id: uid(), x: 30, y: 30, blocks: [bk('alBandera'), bk('esconder'), bk('porSiempre', {}, {}, [bk('crearClon', { obj: 'mí mismo' }), bk('esperar', { s: 1.2 })])] },
          {
            id: uid(), x: 30, y: 300, blocks: [
              bk('alClonar'), bk('mostrar'), bk('irA', { x: 0, y: 160 }), bk('fijarX', { v: 0 }),
              bk('irAObj', { destino: 'posición aleatoria' }), bk('fijarY', { v: 160 }),
              bk('repetirHasta', {}, { cond: bk('o', {}, { a: bk('tocando', { obj: 'Gatito' }), b: bk('menor', {}, { a: bk('posY'), b: '-150' }) }) },
                [bk('cambiarY', { v: -5 })]),
              bk('si', {}, { cond: bk('tocando', { obj: 'Gatito' }) }, [bk('tocarSonido', { snd: 'Moneda' }), bk('cambiarVar', { v: 'puntos', val: 1 })]),
              bk('borrarClon')
            ]
          }
        ];
        P2.sprites.push(man);
        return P2;
      }
    },
    {
      name: 'Nave esquiva asteroides',
      desc: 'Sigue al ratón/dedo, clones enemigos y fin de partida.',
      build() {
        const P2 = proyectoNuevo();
        P2.backdrops.push(BACKDROPS.find(b => b.name === 'Espacio')); P2.backdrop = P2.backdrops.length - 1;
        P2.sprites = [];
        const nave = nuevoSprite(LIBRARY.find(l => l.name === 'Nave'), 0, -100); nave.size = 60;
        nave.scripts = [{
          id: uid(), x: 30, y: 30, blocks: [
            bk('alBandera'), bk('mostrar'), bk('fijarTam', { v: 60 }),
            bk('porSiempre', {}, {}, [bk('irAObj', { destino: 'puntero del ratón' })])
          ]
        }];
        const roca = nuevoSprite(LIBRARY.find(l => l.name === 'Pelota'), 0, 160); roca.name = 'Asteroide'; roca.size = 45;
        roca.sounds = [{ name: 'Fallo', kind: 'fail' }];
        roca.scripts = [
          { id: uid(), x: 30, y: 30, blocks: [bk('alBandera'), bk('esconder'), bk('porSiempre', {}, {}, [bk('crearClon', { obj: 'mí mismo' }), bk('esperar', { s: 0.7 })])] },
          {
            id: uid(), x: 30, y: 280, blocks: [
              bk('alClonar'), bk('mostrar'), bk('irAObj', { destino: 'posición aleatoria' }), bk('fijarY', { v: 170 }),
              bk('repetir', { n: 40 }, {}, [bk('cambiarY', { v: -9 }), bk('girarD', { g: 12 }),
              bk('si', {}, { cond: bk('tocando', { obj: 'Nave' }) }, [bk('tocarSonido', { snd: 'Fallo' }), bk('decirPor', { msg: '¡Chocaste!', s: 1 }), bk('detener', { q: 'todos' })])]),
              bk('borrarClon')
            ]
          }
        ];
        P2.sprites.push(nave, roca);
        return P2;
      }
    },
    {
      name: 'Espiral con lápiz',
      desc: 'Geometría bonita con los bloques de lápiz y un bucle.',
      build() {
        const P2 = proyectoNuevo();
        const g = P2.sprites[0]; g.size = 30;
        g.scripts = [{
          id: uid(), x: 30, y: 30, blocks: [
            bk('alBandera'), bk('borrarLapiz'), bk('irA', { x: 0, y: 0 }), bk('grosorLapiz', { v: 2 }), bk('bajarLapiz'),
            bk('repetir', { n: 90 }, {}, [
              bk('colorLapiz', { col: '#4c97ff' }), bk('mover', { pasos: 5 }), bk('girarD', { g: 59 }),
              bk('cambiarTam', { v: 0 })
            ]),
            bk('subirLapiz'), bk('decir', { msg: '¡Arte!' })
          ]
        }];
        return P2;
      }
    },
    {
      name: 'Piano de teclas',
      desc: 'Pulsa a, s, d, f, g para tocar notas. Eventos de teclado y sonido.',
      build() {
        const P2 = proyectoNuevo();
        const g = P2.sprites[0];
        const notas = [['a', 60], ['s', 62], ['d', 64], ['f', 65], ['g', 67]];
        g.scripts = notas.map((n, i) => ({
          id: uid(), x: 30 + (i % 2) * 260, y: 30 + Math.floor(i) * 120,
          blocks: [bk('alTecla', { tecla: n[0] }), bk('decir', { msg: 'Nota ' + n[0].toUpperCase() }), bk('tocarNota', { nota: n[1], s: 0.4 }), bk('cambiarEfecto', { ef: 'color', v: 25 })]
        }));
        g.scripts.push({ id: uid(), x: 30, y: 640, blocks: [bk('alBandera'), bk('quitarEfectos'), bk('decir', { msg: 'Pulsa a s d f g' })] });
        return P2;
      }
    },
    {
      name: 'Quiz con preguntas',
      desc: 'Pregunta el nombre y hace una suma. Sensores, operadores y condiciones.',
      build() {
        const P2 = proyectoNuevo();
        P2.vars = { aciertos: 0 }; P2.varsShown = { aciertos: true };
        const g = P2.sprites[0];
        g.scripts = [{
          id: uid(), x: 30, y: 30, blocks: [
            bk('alBandera'), bk('fijarVar', { v: 'aciertos' }, { val: '0' }),
            bk('preguntar', { q: '¿Cómo te llamas?' }),
            bk('decirPor', { msg: '¡Hola!', s: 1 }),
            bk('preguntar', { q: '¿Cuánto es 7 x 6?' }),
            bk('siSino', {}, { cond: bk('igual', {}, { a: bk('respuesta'), b: '42' }) },
              [bk('decirPor', { msg: '¡Correcto!', s: 2 }), bk('cambiarVar', { v: 'aciertos', val: 1 })],
              [bk('decirPor', { msg: 'Casi... era 42', s: 2 })])
          ]
        }];
        return P2;
      }
    }
  ];
}

function openExamples() {
  const m = document.querySelector('#picker'), body = document.querySelector('#pickerBody');
  document.querySelector('#pickerTitle').textContent = 'Proyectos de ejemplo (se cargan listos para jugar)';
  body.innerHTML = '';
  EJEMPLOS().forEach(ex => {
    const b = document.createElement('button');
    b.className = 'example-card';
    b.innerHTML = `<b>${ex.name}</b><span>${ex.desc}</span>`;
    b.onclick = () => {
      if (!confirm('Se cargará el ejemplo y se sustituirá tu proyecto actual. ¿Seguir?')) return;
      P = ex.build(); sel = P.sprites[0]; refreshAll(); save();
      m.classList.remove('open');
      toast('Ejemplo cargado · pulsa  para jugar');
      greenFlag();
    };
    body.append(b);
  });
  m.classList.add('open');
}
