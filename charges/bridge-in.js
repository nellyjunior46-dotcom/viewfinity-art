/* VIEWFINITY /charges to main-site incoming curtain continuation. Scope: this handoff only. */
(()=>{
 'use strict';
 const pending=window.__vfChargesIncomingHandoff;
 if(!pending)return;
 const html=document.documentElement;
 const system=document.getElementById('vf-curtain-system');
 const curtain=document.getElementById('vf-curtain');
 const label=document.getElementById('vf-curtain-word');
 const top=curtain?.querySelector('.vf-curtain-cap.top');
 const bottom=curtain?.querySelector('.vf-curtain-cap.bottom');
 const preloader=document.getElementById('preloader');
 const key='vf-charges-handoff-v2';
 const finish=()=>{
   html.classList.remove('vf-charges-handoff','vf-charges-waiting');
   system?.classList.remove('is-active');
   try{sessionStorage.removeItem(key);sessionStorage.removeItem('vf-wipe-v14')}catch(_){}
 };
 if(!system||!curtain||!label||!top||!bottom){finish();return}
 preloader?.classList.add('is-gone');
 document.body.classList.add('is-entered');
 system.classList.add('is-active');
 curtain.style.transform='translate3d(0,0,0)';
 top.style.transform='scaleY(.28)';
 label.style.opacity='1';
 label.style.transform='translate3d(0,0,0)';
 async function playExit(){
   // The main hash router has already rendered Contact or Home by DOMContentLoaded.
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   html.classList.remove('vf-charges-waiting');
   await new Promise(resolve=>setTimeout(resolve,230));
   if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return}
   try{
     const ease='cubic-bezier(.76,0,.19,1)';
     const exit=curtain.animate([{transform:'translate3d(0,0,0)'},{transform:'translate3d(0,-118%,0)'}],{duration:930,easing:ease,fill:'forwards'});
     const bend=bottom.animate([{transform:'scaleY(.20)',offset:0},{transform:'scaleY(1)',offset:.49},{transform:'scaleY(.12)',offset:1}],{duration:930,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
     const word=label.animate([{opacity:1,transform:'translate3d(0,0,0)'},{opacity:0,transform:'translate3d(0,-38px,0)'}],{duration:440,delay:270,easing:'cubic-bezier(.42,0,.86,1)',fill:'forwards'});
     const content=document.querySelector('#vf-view-contact:not([hidden]),#vf-view-about:not([hidden]),#vf-view-home:not([hidden])');
     if(content)content.animate([{transform:'translate3d(0,25px,0)'},{transform:'translate3d(0,0,0)'}],{duration:850,delay:160,easing:'cubic-bezier(.22,1,.36,1)'});
     await Promise.all([exit.finished,bend.finished,word.finished]);
   }catch(error){if(error?.name!=='AbortError')console.warn('VIEWFINITY incoming transition interrupted',error)}
   finally{finish()}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',playExit,{once:true});
 else playExit();
})();