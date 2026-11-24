# BIOISLAS V4 — Paquete de implementación

Este paquete contiene los archivos completos para transformar `AlbertoPerez0506/PWA` en una PWA educativa con un recorrido visual de cinco islas, inspirado en el mapa de progreso de la captura de referencia.

**No requiere framework, bundler, instalación de dependencias ni compilación.** Mantiene HTML, CSS y JavaScript nativo como el proyecto actual.

## 1. Antes de modificar el proyecto

Abre PowerShell en la carpeta local de tu repositorio. Primero revisa si tienes cambios sin guardar:

```powershell
git status
```

Crea una rama para trabajar sin tocar directamente `main`:

```powershell
git switch -c feature/bioislas-archipelago-v4
```

También conserva una copia de seguridad de la carpeta del proyecto. No borres el repositorio anterior.

## 2. Dónde van los archivos

1. Descarga y extrae `BIOISLAS_V4_IMPLEMENTACION_COMPLETA.zip`.
2. Abre la carpeta `BIOISLAS_V4` que viene dentro del ZIP.
3. Copia **su contenido**, no la carpeta contenedora, en la raíz de tu repositorio `PWA`.
4. Cuando Windows pregunte si debe combinar carpetas y reemplazar archivos, permite combinar y reemplazar los archivos que tengan la misma ruta.
5. Conserva archivos de tu repositorio que no aparecen en el paquete, por ejemplo `vercel.json`, configuración de Git y otros recursos propios.

La estructura resultante debe verse así:

```text
PWA/
├── index.html                  # Reemplazar
├── modules.html                # Nuevo
├── game-memorama.html          # Nuevo
├── game-terms.html             # Nuevo
├── game-sequence.html          # Nuevo
├── exam.html                   # Reemplazar
├── results.html                # Reemplazar
├── settings.html               # Reemplazar
├── manual.html                 # Reemplazar
├── games.html                  # Reemplazar por redirección al mapa
├── game-biodiversity.html      # Reemplazar por redirección compatible
├── game-ecosystem.html         # Reemplazar por redirección compatible
├── game-conservation.html      # Reemplazar por redirección compatible
├── manifest.webmanifest        # Reemplazar
├── sw.js                       # Reemplazar
├── css/
│   └── styles.css              # Reemplazar
├── js/
│   ├── app.js                  # Reemplazar
│   ├── audio.js                # Reemplazar
│   ├── db.js                   # Reemplazar
│   ├── data.js                 # Reemplazar
│   ├── notifications.js        # Reemplazar
│   ├── content.js              # Nuevo
│   ├── map.js                  # Nuevo
│   ├── modules.js              # Nuevo
│   ├── game-guard.js            # Nuevo
│   ├── game-memorama.js        # Nuevo
│   ├── game-terms.js           # Nuevo
│   ├── game-sequence.js        # Nuevo
│   ├── exam.js                 # Nuevo
│   ├── results.js              # Nuevo
│   └── settings.js             # Nuevo
└── assets/
    └── images/
        ├── app-icon.svg
        ├── app-icon-192.png
        ├── app-icon-512.png
        ├── app-icon-maskable-512.png
        ├── mascot.svg
        ├── island-01.svg ... island-05.svg
        └── instruments/
            ├── bioreactor.svg
            ├── microscope.svg
            ├── pipette.svg
            ├── autoclave.svg
            ├── centrifuge.svg
            └── ph-meter.svg
```

Los archivos antiguos que no se listan pueden permanecer en el proyecto. Por ejemplo, `js/quiz-game.js`, `js/icons.js`, `js/pages.js` o `css/layout.css` ya no son usados por estas nuevas pantallas, pero no hace falta borrarlos para que BIOISLAS V4 funcione.

## 3. Qué implementa esta versión

### Entrada y mapa principal

- Pantalla de carga con el icono de BIOISLAS.
- Pantalla de bienvenida en la primera visita.
- En visitas posteriores se muestra el splash y después el mapa.
- Mapa oscuro con cinco islas ilustradas individualmente, ruta curva, nodos de acción verdes, estados bloqueados, disponibles y completados.
- Mascota guía llamada Lumi.
- Resumen de módulos, estrellas y porcentaje de recorrido.
- Navegación inferior en móvil y panel lateral de progreso en pantallas amplias.

### Isla 01 — Descubriendo los bioprocesos

Incluye tres módulos formativos:

1. Fundamentos de biotecnología y bioprocesos.
2. Funcionamiento y etapas de un bioproceso, con upstream y downstream.
3. Instrumentos de laboratorio y aplicaciones alimentarias, farmacéuticas, agrícolas y ambientales.

Los módulos se completan en orden. Al completar los tres se desbloquea la Isla 02.

### Isla 02 — Memorama de laboratorio

- Doce tarjetas aleatorias que forman seis parejas.
- Relaciona una ilustración de instrumento con su nombre y función.
- Contador de parejas, movimientos y tiempo.
- Una pista por partida.
- Reinicio disponible.
- La primera finalización concede la primera estrella.

### Isla 03 — Adivina el término

- Elige cinco palabras aleatorias de un banco de catorce términos.
- Muestra una definición como pista inicial.
- Teclado interactivo de letras.
- Máximo de seis errores por palabra; al alcanzar el límite, esa misma palabra vuelve a empezar.
- Una pista adicional por palabra.
- Al terminar presenta las cinco definiciones.
- La primera finalización concede la segunda estrella.

### Isla 04 — Arma el bioproceso

- Siete piezas y siete posiciones numeradas.
- Las etapas aparecen en orden aleatorio.
- Selecciona una pieza y después el espacio donde debe colocarse.
- Una etapa solo permanece cuando se ubica en su posición correcta.
- Es posible retirar una etapa colocada.
- Registra intentos y tiempo.
- La primera finalización concede la tercera estrella.

### Isla 05 — Examen final

- Se desbloquea al reunir las tres estrellas.
- Selecciona doce reactivos aleatorios de un banco de veinticuatro.
- Incluye opción múltiple y verdadero/falso.
- Muestra una pregunta a la vez.
- Permite avanzar, retroceder y cambiar respuestas antes de entregar.
- Avisa cuántas preguntas están pendientes.
- No hay cuenta regresiva, pero se registra el tiempo utilizado.
- Las respuestas vacías cuentan como incorrectas.
- Califica de 0 a 100; se aprueba desde 70. Con doce reactivos, nueve respuestas correctas equivalen a 75 puntos.
- Permite intentos ilimitados y guarda historial y mejor calificación.
- Reprobar no elimina las estrellas conseguidas.

## 4. Migración y conservación de datos

La base conserva el nombre `BioislasDB` y los object stores históricos `gameProgress`, `examAnswers` y `preferences`. La base creada con Dexie `version(1)` utiliza versión nativa 10; esta implementación la actualiza a versión nativa 20 y agrega `islandState` y `examAttempts`.

La migración no borra los registros históricos existentes. Los antiguos resultados de biodiversidad permanecen como historial, pero no se convierten en estrellas de bioprocesos. El nuevo archipiélago comienza con cero módulos y cero estrellas porque corresponde a un contenido académico distinto.

**Antes de actualizar:** cierra las demás pestañas abiertas de la versión anterior de BIOISLAS. Si una pestaña mantiene la base abierta, IndexedDB puede bloquear temporalmente la actualización.

## 5. Cómo ejecutar en local

No abras el HTML con `file://`. La PWA utiliza módulos JavaScript, IndexedDB y Service Worker, por lo que debes usar un servidor local.

Desde PowerShell, ubicado en la raíz de `PWA`, puedes ejecutar:

```powershell
py -m http.server 5500
```

Después abre:

```text
http://localhost:5500/
```

También puedes usar Live Server de VS Code. Si utilizas `npx` en PowerShell y tu política bloquea `npm.ps1`, puedes abrir una terminal CMD o ejecutar el lanzador `npx.cmd`.

## 6. Pruebas antes de publicar

- [ ] Primera visita: splash → bienvenida → mapa.
- [ ] Siguiente visita: splash → mapa.
- [ ] El mapa muestra exactamente cinco islas.
- [ ] Las islas 02, 03, 04 y 05 permanecen bloqueadas hasta cumplir sus requisitos.
- [ ] Los tres módulos se completan en orden.
- [ ] El memorama presenta doce tarjetas, seis parejas, movimientos, tiempo y una sola pista.
- [ ] El memorama otorga una sola estrella aunque se repita.
- [ ] El ahorcado selecciona cinco términos sin repetirlos dentro de la misma partida.
- [ ] Seis errores reinician la palabra actual, sin avanzar automáticamente.
- [ ] Se puede utilizar una pista por palabra.
- [ ] El rompecabezas presenta siete etapas y permite retirar una pieza colocada.
- [ ] El examen no se abre sin las tres estrellas.
- [ ] El examen selecciona doce reactivos de los veinticuatro.
- [ ] Es posible regresar, cambiar respuestas y entregar con preguntas pendientes tras confirmarlo.
- [ ] Nueve aciertos producen 75 puntos y aprobación.
- [ ] El historial conserva los intentos y la mejor calificación.
- [ ] Cerrar y abrir la PWA conserva el progreso.
- [ ] La interfaz no genera desplazamiento horizontal a 360, 390, 768, 1024 y 1440 px.
- [ ] Se comprueba la instalación PWA y el modo offline después de una primera visita en línea.

## 7. Service Worker y caché

El `sw.js` usa el nombre de caché `bioislas-v4.0.0`. Al activarse elimina las cachés antiguas de la aplicación y precarga las nuevas páginas, estilos, scripts e ilustraciones locales.

Si después de desplegar sigues viendo la versión anterior, cierra la PWA, abre el sitio en el navegador y realiza una recarga forzada. Si persiste, desde DevTools → Application → Service Workers puedes desregistrar el Service Worker viejo y volver a cargar el sitio. No borres IndexedDB si deseas conservar tu progreso.

## 8. Publicación

Después de probar localmente:

```powershell
git status
git add .
git commit -m "Implementa BIOISLAS V4 con mapa de cinco islas"
git push -u origin feature/bioislas-archipelago-v4
```

Revisa la rama y después integra los cambios a `main` cuando hayas confirmado que los flujos funcionan. Vercel puede continuar sirviendo el proyecto como sitio estático; no se requiere una API nueva para las funcionalidades incluidas.

## 9. Alcance de verificación

Se comprobaron sintaxis estática de JavaScript, imports relativos, presencia de archivos referenciados, estructura de los datos (14 términos, 24 preguntas y siete etapas) y validez XML de los SVG. La ejecución automatizada en navegador no pudo completarse en el entorno de construcción por un bloqueo de navegación local del navegador. Por eso es necesario ejecutar el checklist en un navegador real antes de publicar, especialmente la instalación, los permisos de notificaciones, la persistencia IndexedDB y el funcionamiento offline.
