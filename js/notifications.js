import {getPreference,savePreference} from './db.js';
export function notificationsSupported(){return 'Notification'in window&&'serviceWorker'in navigator;}
export async function isNotificationsEnabled(){return notificationsSupported()&&(await getPreference('notificationsEnabled',false))&&Notification.permission==='granted';}
export async function enableNotifications(){if(!notificationsSupported())return false;const permission=await Notification.requestPermission();const enabled=permission==='granted';await savePreference('notificationsEnabled',enabled);return enabled;}
export async function disableNotifications(){await savePreference('notificationsEnabled',false);return false;}
export async function notify(title,body,url='/index.html'){if(!(await isNotificationsEnabled()))return;const registration=await navigator.serviceWorker.ready;await registration.showNotification(title,{body,icon:'/assets/images/app-icon.svg',badge:'/assets/images/app-icon.svg',data:{url}});}
