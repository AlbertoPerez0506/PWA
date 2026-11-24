import {getState,setState,getPreference,savePreference} from './db.js';
import {initAudio,setAudioEnabled} from './audio.js';
const splash=document.querySelector('#splash-screen');
const welcome=document.querySelector('#welcome-screen');
const shell=document.querySelector('#app-shell');
const toastRegion=document.querySelector('#toast-region');
export function toast(message,type='success',duration=3000){if(!toastRegion)return;const item=document.createElement('div');item.className=`toast ${type}`;item.textContent=message;toastRegion.appendChild(item);window.setTimeout(()=>item.remove(),duration);}
async function showEntryFlow(){const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;await new Promise(resolve=>window.setTimeout(resolve,reduced?140:1050));splash?.classList.add('is-leaving');const seen=await getState('welcomeSeen',false).catch(()=>false);window.setTimeout(()=>{splash?.classList.add('is-hidden');if(seen)shell?.classList.remove('is-hidden');else welcome?.classList.remove('is-hidden');},reduced?0:360);}
welcome?.querySelector('#start-exploration')?.addEventListener('click',async event=>{const button=event.currentTarget;button.disabled=true;await setState('welcomeSeen',true).catch(console.warn);welcome.classList.add('is-hidden');shell?.classList.remove('is-hidden');toast('¡Tu aventura comienza! La primera isla está disponible.');});
async function initSound(){await initAudio();const button=document.querySelector('#sound-toggle'),target=document.querySelector('#sound-icon');if(!button)return;const paint=enabled=>{button.setAttribute('aria-pressed',String(enabled));button.title=enabled?'Silenciar sonidos':'Activar sonidos';target.textContent=enabled?'♫':'×';};paint(await getPreference('soundEnabled',!(await getPreference('muted',false))));button.addEventListener('click',async()=>{const enabled=button.getAttribute('aria-pressed')!=='true';await setAudioEnabled(enabled);paint(enabled);toast(enabled?'Sonidos activados.':'Sonidos silenciados.');});}
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(error=>console.warn('Service Worker:',error)));
initSound().catch(console.warn);showEntryFlow().catch(error=>{console.error(error);splash?.classList.add('is-hidden');welcome?.classList.add('is-hidden');shell?.classList.remove('is-hidden');});
