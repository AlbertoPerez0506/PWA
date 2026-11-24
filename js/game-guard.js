import {getJourney} from './db.js';
export async function requireGameAccess(gameId){
 const j=await getJourney();
 const prereq={
  'game-memorama':()=>['module-1','module-2','module-3'].every(id=>j.completedModules.includes(id)),
  'game-terms':()=>j.completedGames.includes('game-memorama'),
  'game-sequence':()=>j.completedGames.includes('game-terms')
 }[gameId];
 if(!prereq||prereq())return true;
 document.body.innerHTML=`<main class="page-shell"><section class="content-panel locked-screen"><div class="locked-emblem">🔒</div><p class="eyebrow">RUTA BLOQUEADA</p><h1>Este desafío aún no está disponible</h1><p class="muted">Completa la etapa anterior para continuar tu recorrido por BIOISLAS.</p><a class="button button-primary" href="/index.html">Volver al mapa</a></section></main>`;
 return false;
}
