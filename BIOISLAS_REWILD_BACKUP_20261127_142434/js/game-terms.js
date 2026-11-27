import {requireGameAccess} from './game-guard.js';
import {termsBank} from './data.js';
import {completeGame} from './db.js';
import {initAudio,sounds} from './audio.js';
await initAudio();

const $=id=>document.getElementById(id);
const alphabet='ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
const shuffle=items=>{const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;};
let words=[],wordIndex=0,errors=0,guessed=new Set(),hintUsed=false,seconds=0,timer=null,active=false,solved=0,wordLocked=false;
function timeText(){return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;}
function startClock(){clearInterval(timer);timer=setInterval(()=>{seconds++;$('time').textContent=timeText();},1000);}
function drawFigure(){const parts=[
 '<path d="M35 190 H160 M70 190 V25 H135 V45"/>',
 '<circle cx="135" cy="65" r="20"/>',
 '<path d="M135 85 V135"/>',
 '<path d="M135 98 L105 118"/>',
 '<path d="M135 98 L165 118"/>',
 '<path d="M135 135 L110 165 M135 135 L160 165"/>'
 ];$('hangman-figure').innerHTML=`<svg viewBox="0 0 210 210" role="img" aria-label="Intentos fallidos: ${errors} de 6"><g fill="none" stroke="#b7c6ce" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${parts.slice(0,errors+1).join('')}</g></svg>`;}
function paintWord(){const current=words[wordIndex];$('hangman-word').innerHTML=current.word.split('').map((letter,index)=>`<span class="letter-slot">${guessed.has(letter)?letter:' '}</span>`).join('');$('word-count').textContent=`${wordIndex+1}/5`;$('errors').textContent=`${errors}/6`;drawFigure();}
function paintKeyboard(){const keyboard=$('letter-keyboard');keyboard.innerHTML=alphabet.map(letter=>`<button type="button" class="letter-key" data-letter="${letter}" ${guessed.has(letter)?'disabled':''}>${letter}</button>`).join('');keyboard.querySelectorAll('[data-letter]').forEach(button=>button.addEventListener('click',()=>guess(button.dataset.letter)));}
function loadWord(){errors=0;guessed=new Set();hintUsed=false;wordLocked=false;const current=words[wordIndex];$('term-hint').textContent=current.hint;$('term-feedback').textContent='Selecciona una letra para comenzar.';$('term-hint-btn').disabled=false;paintWord();paintKeyboard();}
function guess(letter){if(!active||wordLocked||guessed.has(letter))return;guessed.add(letter);const current=words[wordIndex];if(!current.word.includes(letter)){sounds.wrong();errors++;$('term-feedback').textContent=`La letra ${letter} no aparece en la palabra.`;}else{sounds.correct();$('term-feedback').textContent='¡Bien! Esa letra sí forma parte del término.';}paintWord();paintKeyboard();if(current.word.split('').every(char=>guessed.has(char))){wordLocked=true;solved++;$('term-feedback').textContent=`¡Correcto! ${current.word}: ${current.definition}`;window.setTimeout(nextWord,1100);}else if(errors>=6){wordLocked=true;$('term-feedback').textContent=`Se agotaron los seis intentos. La palabra vuelve a comenzar: ${current.hint}`;window.setTimeout(loadWord,1400);}}
function hint(){if(!active||wordLocked||hintUsed)return;hintUsed=true;const current=words[wordIndex];const missing=[...new Set(current.word.split('').filter(letter=>!guessed.has(letter)))];if(!missing.length)return;const letter=missing[Math.floor(Math.random()*missing.length)];guessed.add(letter);$('term-feedback').textContent=`Pista utilizada: se reveló la letra ${letter}.`;$('term-hint-btn').disabled=true;paintWord();paintKeyboard();if(current.word.split('').every(char=>guessed.has(char))){wordLocked=true;solved++;window.setTimeout(nextWord,900);}}
function restartWord(){if(!active)return;loadWord();}
function start(){sounds.click();words=shuffle(termsBank).slice(0,5);wordIndex=0;solved=0;seconds=0;active=true;$('time').textContent='00:00';$('terms-intro').hidden=true;$('terms-result').hidden=true;$('terms-area').hidden=false;loadWord();startClock();}
function nextWord(){if(!active)return;if(wordIndex<4){wordIndex++;loadWord();}else finish();}
async function finish(){sounds.complete();active=false;clearInterval(timer);$('terms-area').hidden=true;$('terms-result').hidden=false;const result=await completeGame('game-terms','Adivina el término',5,5,{seconds,terms:words.map(item=>item.word)});$('terms-result').innerHTML=`<div class="result-medal">★</div><h2>¡Terminaste los cinco términos!</h2><p>Repasa las definiciones para reforzar el vocabulario científico.</p><div class="definition-list">${words.map(item=>`<article><strong>${item.word}</strong><p>${item.definition}</p></article>`).join('')}</div><div class="summary-grid"><div class="summary-tile"><strong>5/5</strong><small>Palabras resueltas</small></div><div class="summary-tile"><strong>${timeText()}</strong><small>Tiempo</small></div><div class="summary-tile"><strong>${result.firstTime?'★':'✓'}</strong><small>${result.firstTime?'Segunda estrella':'Estrella ya conseguida'}</small></div></div><a class="button button-primary" href="/index.html">Volver al mapa</a> <button class="button button-secondary" id="terms-again">Jugar de nuevo</button>`;$('terms-again').addEventListener('click',start);}
$('terms-start').addEventListener('click',start);$('term-hint-btn').addEventListener('click',hint);$('term-reset-btn').addEventListener('click',restartWord);
if(await requireGameAccess('game-terms'))$('terms-intro').hidden=false;
