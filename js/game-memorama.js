import {requireGameAccess} from './game-guard.js';
import {completeGame} from './db.js';
import {initAudio,sounds} from './audio.js';
await initAudio();

const instruments=[
 {id:'bioreactor',name:'Biorreactor',detail:'Cultiva sistemas biológicos bajo condiciones controladas.',symbol:'BR'},
 {id:'microscope',name:'Microscopio',detail:'Permite observar estructuras microscópicas.',symbol:'M'},
 {id:'pipette',name:'Pipeta',detail:'Mide y transfiere pequeños volúmenes de líquido.',symbol:'P'},
 {id:'autoclave',name:'Autoclave',detail:'Esteriliza materiales compatibles con vapor a presión.',symbol:'A'},
 {id:'centrifuge',name:'Centrífuga',detail:'Separa componentes mediante fuerza centrífuga.',symbol:'C'},
 {id:'ph-meter',name:'Medidor de pH',detail:'Mide la acidez o basicidad de una solución.',symbol:'pH'}
];
const $=id=>document.getElementById(id);
const shuffle=items=>{const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;};
let deck=[],first=null,locked=false,matches=0,moves=0,hintUsed=false,seconds=0,timer=null,started=false;
function clock(){seconds++;$('time').textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
function makeDeck(){deck=shuffle(instruments.flatMap(item=>[
 {id:item.id,type:'instrument',content:item.symbol,title:item.name,detail:'Identifica el instrumento'},
 {id:item.id,type:'description',content:item.name,title:item.name,detail:item.detail}
]));}
function paint(){const grid=$('memory-grid');grid.innerHTML=deck.map((card,index)=>`<button class="memory-card" type="button" data-card="${index}" data-pair="${card.id}" aria-label="Tarjeta ${index+1}" aria-pressed="false"><span class="memory-card-inner"><span class="memory-face memory-back">✦</span><span class="memory-face memory-front">${card.type==='instrument'?`<img class="instrument-art" src="/assets/images/instruments/${card.id}.svg" alt=""><strong>${card.title}</strong><small>Instrumento de laboratorio</small>`:`<b class="memory-name">${card.content}</b><small>${card.detail}</small>`}</span></span></button>`).join('');
 grid.querySelectorAll('[data-card]').forEach(button=>button.addEventListener('click',()=>flip(Number(button.dataset.card),button)));
 $('pairs').textContent=`${matches}/6`;$('moves').textContent=moves;$('memory-hint').disabled=hintUsed;
}
function flip(index,button){if(locked||!started)return;const card=deck[index];if(button.classList.contains('is-flipped')||button.classList.contains('is-matched'))return;button.classList.add('is-flipped');button.setAttribute('aria-pressed','true');if(!first){first={index,button,card};return;}moves++;$('moves').textContent=moves;const second={index,button,card};if(first.card.id===second.card.id){matchCards([first,second]);first=null;return;}locked=true;sounds.wrong();const previous=first;first=null;window.setTimeout(()=>{[previous,second].forEach(item=>{item.button.classList.remove('is-flipped');item.button.setAttribute('aria-pressed','false');});locked=false;},850);}
function matchCards(items){sounds.correct();items.forEach(item=>{item.button.classList.add('is-matched');item.button.disabled=true;item.button.setAttribute('aria-label',`${item.card.title}, pareja encontrada`);});matches++;$('pairs').textContent=`${matches}/6`;if(matches===6)finish();}
function hint(){if(hintUsed||locked||!started)return;hintUsed=true;if(first){first.button.classList.remove('is-flipped');first.button.setAttribute('aria-pressed','false');first=null;}const remaining=deck.map((card,index)=>({card,index,button:$(`[data-card="${index}"]`)})).filter(x=>x.button&&!x.button.classList.contains('is-matched'));const target=remaining[0];const partner=remaining.find(x=>x.card.id===target?.card.id&&x.index!==target.index);if(!target||!partner)return;locked=true;moves++;$('moves').textContent=moves;[target,partner].forEach(x=>x.button.classList.add('is-flipped'));$('memory-hint').disabled=true;window.setTimeout(()=>{matchCards([target,partner]);locked=false;},700);}
function start(){sounds.click();started=true;matches=0;moves=0;seconds=0;hintUsed=false;first=null;locked=false;clearInterval(timer);$('time').textContent='00:00';$('memory-intro').hidden=true;$('memory-result').hidden=true;$('memory-area').hidden=false;makeDeck();paint();timer=window.setInterval(clock,1000);}
async function finish(){sounds.complete();started=false;clearInterval(timer);$('memory-area').hidden=true;$('memory-result').hidden=false;const result=await completeGame('game-memorama','Memorama de laboratorio',6,6,{moves,seconds,hintUsed});$('memory-result').innerHTML=`<div class="result-medal">★</div><h2>¡Laboratorio completado!</h2><p>Encontraste las seis parejas de instrumentos. Repasa sus funciones antes de continuar.</p><div class="definition-list">${instruments.map(item=>`<article><strong>${item.name}</strong><p>${item.detail}</p></article>`).join('')}</div><div class="summary-grid"><div class="summary-tile"><strong>${moves}</strong><small>Movimientos</small></div><div class="summary-tile"><strong>${$('time').textContent}</strong><small>Tiempo</small></div><div class="summary-tile"><strong>${result.firstTime?'★':'✓'}</strong><small>${result.firstTime?'Primera estrella':'Estrella ya conseguida'}</small></div></div><a class="button button-primary" href="/index.html">Volver al mapa</a> <button class="button button-secondary" id="memory-again">Jugar de nuevo</button>`;$('memory-again').addEventListener('click',start);}
$('memory-start').addEventListener('click',start);$('memory-reset').addEventListener('click',start);$('memory-hint').addEventListener('click',hint);
if(await requireGameAccess('game-memorama')){$('memory-intro').hidden=false;}
