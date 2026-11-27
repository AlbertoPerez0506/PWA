import './experience.js';
import {getJourney,getGameProgress,getExamAttempts} from './db.js';
const [journey,games,exams]=await Promise.all([getJourney(),getGameProgress(),getExamAttempts()]);
document.getElementById('history-modules').textContent=`${journey.completedModules.length}/3`;
document.getElementById('history-stars').textContent=`${journey.stars}/3`;
const best=exams.reduce((max,item)=>Math.max(max,item.score||0),0);document.getElementById('history-best').textContent=exams.length?`${best}/100`:'—';
const examList=document.getElementById('exam-history');examList.innerHTML=exams.length?exams.map((item,index)=>`<article class="history-row"><span class="history-badge">${item.passed?'★':'↻'}</span><div class="history-info"><strong>Intento ${exams.length-index}</strong><small>${new Date(item.createdAt).toLocaleString('es-MX')} · ${Math.floor((item.elapsedSeconds||0)/60)} min ${String((item.elapsedSeconds||0)%60).padStart(2,'0')} s</small></div><span class="history-score">${item.score}/100</span></article>`).join(''):'<p class="muted">Todavía no has presentado el examen.</p>';
const gameList=document.getElementById('game-history');gameList.innerHTML=games.length?games.map(item=>`<article class="history-row"><span class="history-badge">✓</span><div class="history-info"><strong>${escapeHtml(item.gameName||'Actividad')}</strong><small>${new Date(item.completedAt).toLocaleString('es-MX')}</small></div><span class="history-score">${item.score}/${item.totalQuestions}</span></article>`).join(''):'<p class="muted">Aún no hay juegos completados.</p>';
if(!games.length&&!exams.length)document.getElementById('history-empty').hidden=false;
function escapeHtml(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
