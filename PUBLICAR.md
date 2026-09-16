# Cómo publicar Scratchito en GitHub

El repositorio Git ya está creado y con el commit inicial hecho. Solo falta enviarlo a GitHub.

---

## 1. Crea el repositorio vacío en GitHub

Ve a **https://github.com/new** y rellena:

- **Repository name**: `scratchito`
- **Visibility**: **Public**
- **NO marques** "Add a README file", ni `.gitignore`, ni licencia.
  (Ya los tenemos; si los añades, el push dará conflicto.)

Pulsa **Create repository**.

---

## 2. Sube el código

Descarga la carpeta del proyecto, abre una terminal dentro de ella y ejecuta,
sustituyendo `TU-USUARIO` por tu nombre de usuario de GitHub:

```bash
git remote add origin https://github.com/TU-USUARIO/scratchito.git
git branch -M main
git push -u origin main
```

Si Git te pide contraseña, **no uses la de tu cuenta**: GitHub exige un token.
Créalo en https://github.com/settings/tokens → *Generate new token (classic)* →
marca el permiso **`repo`** → y pega ese token cuando te pida la contraseña.

> Alternativa con SSH, si ya tienes clave configurada:
> `git remote add origin git@github.com:TU-USUARIO/scratchito.git`

---

## 3. Activa GitHub Pages

En tu repositorio: **Settings** → **Pages** (menú lateral izquierdo).

- **Source**: `Deploy from a branch`
- **Branch**: `main` · carpeta `/ (root)`
- **Save**

Espera 1–2 minutos. Tu Scratchito quedará jugable en:

```
https://TU-USUARIO.github.io/scratchito/
```

Funciona directamente porque `index.html` está en la raíz y es autocontenido:
no necesita servidor, ni build, ni conexión a internet una vez cargado.

---

## 4. Toque final (opcional)

En la portada del repositorio, pulsa el engranaje junto a *About* (arriba a la derecha) y añade:

- **Description**: `Réplica de Scratch 3.0 en español, para móvil y ordenador. 170 bloques, tutorial integrado y 2.049 gráficos. Todo en un solo archivo HTML.`
- **Website**: `https://TU-USUARIO.github.io/scratchito/`
- **Topics**: `scratch` `educacion` `programacion-visual` `javascript` `espanol` `sin-dependencias`

---

## Cambios futuros

Recuerda que **`index.html` se genera**. Edita las fuentes y luego:

```bash
python3 build.py
git add -A
git commit -m "Describe tu cambio"
git push
```

Pages se actualiza sola en menos de un minuto.
