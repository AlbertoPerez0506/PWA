# Manual de Usuario — BIOISLAS

## 1. ¿Qué es BIOISLAS?
Aplicación web progresiva (PWA) educativa sobre biotecnología y bioprocesos. Cinco islas, tres juegos y un examen final.

## 2. Requisitos
- Navegador moderno (Chrome, Edge, Firefox, Safari).
- Conexión a internet **solo la primera vez** (para instalar y cachear).
- Después funciona sin conexión.

## 3. Cómo abrirla
1. Copia el proyecto a un servidor local.
2. Ejecuta `npx serve .` o `python -m http.server 8080`.
3. Abre `http://localhost:8080` en el navegador.
4. **Nota:** no abras `index.html` con doble clic (`file://`); el Service Worker no funcionará.

## 4. Cómo instalarla
- **Android/Chrome:** menú → "Instalar aplicación" o "Agregar a pantalla de inicio".
- **Escritorio/Chrome/Edge:** icono de instalación en la barra de direcciones.
- **iOS/Safari:** Compartir → "Añadir a pantalla de inicio".

## 5. Recorrido
1. **Bienvenida** → "Comenzar aventura".
2. **Mapa:** cinco islas.
3. **Isla 01 — Explora:** tres módulos informativos. NO hay preguntas.
4. **Isla 02 — Memorama:** encuentra 6 parejas. ★1.
5. **Isla 03 — Ahorcado:** resuelve 5 palabras. ★2.
6. **Isla 04 — Arma el bioproceso:** ordena 7 etapas. ★3.
7. **Isla 05 — Examen:** 12 preguntas aleatorias. Aprobado ≥70/100.

## 6. Estrellas y desbloqueos
- ★1 → desbloquea Isla 03.
- ★2 → desbloquea Isla 04.
- ★3 → desbloquea Isla 05 (examen).

Cada estrella se obtiene **una sola vez**. Puedes repetir juegos sin duplicar.

## 7. Progreso
Todo se guarda automáticamente en IndexedDB del navegador. Puedes:
- Exportar respaldo JSON en **Configuración**.
- Importar respaldo previo.
- Borrar todo el progreso (irreversible).

## 8. Modo offline
Una vez cargada la primera vez con internet, la app funciona sin conexión.

## 9. Audio
Configura sonido y volumen en **Configuración**. Los sonidos se generan con Web Audio API.

## 10. Preguntas frecuentes
**¿Se sincroniza entre dispositivos?** No. Los datos son locales al navegador. Usa exportar/importar.

**¿Puedo perder las estrellas si repruebo el examen?** No. Las estrellas no se pierden.

**¿Cuántos intentos de examen puedo hacer?** Ilimitados. Se guarda el historial completo.

**¿Qué pasa si borro los datos del navegador?** Pierdes todo el progreso. Exporta antes.

**¿Necesito cuenta?** No. Todo es local.

## 11. Créditos
Proyecto académico — Universidad Tecnológica del Usumacinta.
