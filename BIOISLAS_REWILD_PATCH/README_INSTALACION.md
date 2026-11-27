# BIOISLAS REWILD — Actualización visual y de experiencia

Esta actualización está diseñada como **overlay** sobre el repositorio original `AlbertoPerez0506/PWA`. Conserva el temario, los cinco hitos, los tres minijuegos, el banco de preguntas y el almacenamiento IndexedDB de BIOISLAS V4. No sustituye ni elimina los archivos pedagógicos existentes.

## Qué agrega

- Onboarding inicial de tres pasos con Lumi, el tucán de la imagen proporcionada. Solo aparece en la primera visita; después se muestra directamente el mapa.
- Pantalla de carga con Lumi, animación de flotación y barra de progreso.
- Renovación visual clara y mobile-first: papel blanco cálido, verde para avance, azul para acciones secundarias, jerarquía tipográfica y componentes redondeados.
- Microinteracciones, scroll reveal, parallax moderado, marquee y barra de lectura basada en scroll-driven animations cuando el navegador la soporta.
- Racha de estudio diaria. Se registra cuando el estudiante inicia un módulo, un juego o el examen; no se incrementa solo por abrir la página principal. La racha y el récord se guardan en `islandState` de la IndexedDB existente.
- Página `about.html` con el equipo creador y sus áreas de participación.
- Manifest y Service Worker actualizados para la nueva versión y los nuevos recursos.
- Compatibilidad con `prefers-reduced-motion` y dispositivos táctiles.

## Instalación sobre el repositorio

1. Descarga el ZIP y extrae `BIOISLAS_REWILD_PATCH`.
2. Copia la carpeta `BIOISLAS_REWILD_PATCH` dentro de la raíz local del repositorio `PWA`.
3. Abre PowerShell en la raíz del repositorio, donde están `index.html`, `manifest.webmanifest` y `sw.js`.
4. Ejecuta:

```powershell
powershell -ExecutionPolicy Bypass -File .\BIOISLAS_REWILD_PATCH\APLICAR.ps1
```

El script crea automáticamente una carpeta `BIOISLAS_REWILD_BACKUP_...` con los archivos que va a reemplazar, copia los archivos nuevos y actualizados, registra `experience.js` en los módulos de página existentes y cambia el color del tema en las páginas HTML. No elimina contenido original.

## Ejecutar en local

Desde la raíz de `PWA`:

```powershell
py -m http.server 5500
```

Abre `http://localhost:5500/`. No abras el proyecto con `file://`, porque IndexedDB, los módulos ES y el Service Worker requieren un servidor local o HTTPS.

## Despliegue en Vercel

El proyecto continúa siendo una PWA estática. Sube los cambios al repositorio conectado con Vercel o despliega la carpeta del proyecto desde la configuración existente. No necesita variables de entorno ni backend adicional para estas funciones.

## Verificación recomendada

- Primera visita: splash → onboarding 1/3 → 2/3 → 3/3 → mapa.
- Segunda visita: splash → mapa, sin volver a mostrar el onboarding.
- Iniciar un módulo, minijuego o examen debe registrar como máximo un día de racha por fecha local.
- Completar los tres módulos habilita el memorama; después se mantiene el orden de los otros dos juegos; las tres estrellas habilitan el examen.
- La actividad se conserva al recargar y volver a abrir la PWA.
- Comprobar instalación y navegación offline después de una visita online.
- Probar a 360, 390, 768, 1024 y 1440 px y con reducción de movimiento activa.

## Nota sobre los integrantes

La página de equipo muestra a Iván como responsable de programación y desarrollo PWA; Ariadna y Vanessa en UX/UI; Anett en organización y pruebas de experiencia; Cristell en conceptualización; Ronay en investigación/documentación y Ayelen en apoyo didáctico. Las áreas de Ronay y Ayelen se presentan como distribución sugerida de responsabilidades, ya que no se proporcionaron funciones concretas para ellas.
