# BIOISLAS REWILD · Actualización visual 5.1.1

Este paquete añade el selector de apariencia Claro / Oscuro / Sistema, los iconos de marca locales y una renovación visual 3D de la página del equipo. No reconstruye la aplicación ni modifica preguntas, desbloqueos o el esquema IndexedDB.

## Archivos que se sustituyen

- `about.html`
- `settings.html`
- `manifest.webmanifest`
- `sw.js`
- `js/experience.js`
- `js/settings.js`

## Archivos nuevos

- `js/theme.js`
- `css/theme.css`
- `assets/icon/LEEME_ICONOS.txt`

## Instalación en tu carpeta local

1. Haz una copia de seguridad de `C:\Users\ivana\Downloads\App_PWA`.
2. Extrae este paquete dentro de `App_PWA`, conservando la estructura de carpetas y permitiendo sustituir los archivos indicados.
3. Asegúrate de que existan estos dos archivos de imagen (son tus recursos, no vienen dentro del ZIP):
   - `assets/icon/icon_radio.png`
   - `assets/icon/icon_redondo.png`
4. No elimines `assets/images/` ni sus iconos anteriores: se conservan como respaldo y para el icono maskable del manifest.
5. Ejecuta desde la raíz del proyecto:

   ```powershell
   py -m http.server 5500
   ```

6. Abre `http://localhost:5500/` y entra a Ajustes para probar los tres modos.

## Cómo funciona la apariencia

- **Claro:** mantiene la identidad visual clara REWILD.
- **Oscuro:** aplica una paleta oscura en las pantallas de la aplicación.
- **Sistema:** sigue automáticamente la preferencia de apariencia de Windows, Android, iOS o el sistema operativo del dispositivo.

La selección se almacena en `localStorage` con la clave `bioislas-theme-mode`. Es independiente de `BioislasDB`, por lo que no requiere migraciones ni cambia el progreso del estudiante.

## Iconos y uso offline

Los iconos son recursos locales. El código no carga una librería de iconos ni imágenes desde un CDN. El favicon y los iconos de instalación apuntan a `assets/icon/`; el Service Worker precarga ambos archivos cuando están disponibles. El icono redondo se usa para Apple Touch Icon y dispositivos con puntero táctil; el cuadrado queda como icono principal de escritorio.

El `manifest.webmanifest` declara las variantes de tamaño 192 y 512. Comprueba que los PNG tengan esos tamaños reales; si solo tienes una resolución, lo ideal es exportar versiones de 192 × 192 y 512 × 512 y actualizar las entradas `sizes` para que coincidan con los archivos.

## Pruebas recomendadas

1. Abrir `index.html`, navegar por módulos, juegos, progreso, guía, equipo y ajustes.
2. En Ajustes, seleccionar Claro, Oscuro y Sistema; navegar a otras pantallas y comprobar que la selección persiste.
3. Cambiar el tema del sistema operativo mientras BIOISLAS está en modo Sistema.
4. Probar la instalación y comprobar icono en escritorio / pantalla de inicio.
5. En Chrome/Edge: DevTools → Application → Service Workers y Storage. Confirmar que el worker activo es `bioislas-rewild-v5.1.0`.
6. Abrir la aplicación una vez para llenar la caché; después activar Offline en DevTools → Network y recargar.
7. Comprobar que el progreso de módulos, estrellas e historial continúa presente.

La PWA debe servirse desde `http://localhost` o HTTPS. No abrirla con `file://`, porque los módulos JavaScript y el Service Worker requieren un origen compatible.

## Consideraciones

- El repositorio público inspeccionado está en la rama `main`; este paquete no realiza commits, pushes ni cambios remotos.
- El Service Worker ahora usa `bioislas-rewild-v5.1.1` para renovar la caché y precarga los dos iconos como recursos opcionales para que un icono ausente no bloquee la instalación del worker.
- La pantalla de carga y la bienvenida dejaron de utilizar `tucan-guide.jpg` y la identificación de Lumi; el recurso histórico se conserva en `assets/images/`, pero ya no forma parte de la precarga principal. La sección del equipo conserva los siete nombres. Para Anett, Ronay y Ayelen se usa una descripción general porque sus funciones específicas no estaban confirmadas en el contexto de trabajo.
- No se ejecutó una prueba visual dentro de un navegador real con los archivos PNG locales, porque esos dos PNG no se adjuntaron a esta conversación. Tampoco se validó todavía una instalación/offline real en el dispositivo.


## Integración publicada en main · 5.1.1

- La rama oficial de publicación es `main`; no se requiere un merge desde otra rama.
- `index.html` utiliza `assets/icon/icon_redondo.png` en móvil y `assets/icon/icon_radio.png` en escritorio para splash y bienvenida mediante `<picture>`.
- El favicon y Apple Touch Icon apuntan a los recursos de marca.
- `manifest.webmanifest` declara tamaños reales de 1024 × 1024 y 346 × 346.
- `sw.js` incrementa la caché a `bioislas-rewild-v5.1.1` y deja de precargar la antigua imagen del tucán.
- `about.html` emplea iconos SVG inline para las métricas y `css/theme.css` evita que el selector de texto sobrescriba sus estilos.
