# Scratchito

Una réplica de Scratch 3.0 en español, pensada para ser **más entendible** que el original y funcionar igual de bien en **móvil y ordenador**.

Todo vive en un único archivo `index.html` autocontenido: sin dependencias, sin build en el navegador, sin conexión a internet. Ábrelo y funciona.

## Qué incluye

- **170 bloques** repartidos en 9 categorías (Movimiento 24, Apariencia 28, Sonido 13, Eventos 11, Control 16, Sensores 19, Operadores 30, Variables 16, Lápiz y Mis bloques 13), con los colores y las formas oficiales de Scratch: sombreros redondeados, bloques apilables, bloques en C, booleanos hexagonales y reporteros ovalados.
- **Tutorial integrado** de 12 pasos que guía desde el primer bloque hasta clones y lápiz.
- **6 proyectos de ejemplo** cargables con un clic.
- **Catálogo de 2.049 gráficos generados proceduralmente**: 1.104 personajes con 1.764 disfraces, 285 fondos y 12 sonidos, todos SVG vectoriales, buscables y organizados en categorías y subcategorías.
- **Disfraces y sonidos** por objeto, como en Scratch.
- **Escenario 480×360** con el sistema de coordenadas original, capa de lápiz, clones, variables y listas.
- **Interfaz móvil dedicada**: vistas conmutables (escenario / código / recursos), barra de ejecución fija, paleta deslizante y gestos táctiles para arrastrar bloques.
- **Iconografía 100 % CSS**: 56 iconos SVG por máscara que heredan `currentColor`. Cero emojis.

## Uso

Abre `index.html` en cualquier navegador moderno. No hace falta nada más.

## Desarrollo

Las fuentes están separadas y se empaquetan en el `index.html` final:

| Archivo | Contenido |
|---|---|
| `src.html` | Estructura HTML |
| `icons.css` | Sistema de 56 iconos CSS |
| `styles.css` | Estilos, tema y diseño responsive |
| `assets.js` | Helpers SVG y recursos base |
| `library.js` | Generador procedural del catálogo |
| `blocks.js` | Definición de los 170 bloques y la paleta |
| `app.js` | Motor de ejecución, editor y UI |
| `tutorial.js` | Tutorial y proyectos de ejemplo |

Tras cualquier cambio:

```bash
python3 build.py
```

Esto regenera `index.html`. **No edites `index.html` a mano**, se sobrescribe.

Para probarlo en local:

```bash
python3 -m http.server 8080
```

## Licencia

MIT
