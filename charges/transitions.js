(() => {
  'use strict';
  const system=document.getElementById('vf-curtain-system');
  const curtain=document.getElementById('vf-curtain');
  const label=document.getElementById('vf-curtain-word');
  const topCurve=curtain?.querySelector('.vf-curtain-cap.top');
  const bottomCurve=curtain?.querySelector('.vf-curtain-cap.bottom');
  if(!system||!curtain||!label||!topCurve||!bottomCurve)return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const storageKey='vfChargesPageTransitionV1';
  const normalize=path=>{
    let result=path.replace(/\/index\.html$/i,'/');
    if(!result.endsWith('/'))result+='/';
    return result;
  };
  const titles={
    '/charges/':'Our Services',
    '/charges/weddings/':'Wedding Packages',
    '/charges/video-editing/':'Video Editing Packages',
    '/charges/graduation/':'Graduation Packages',
    '/charges/social-media-management/':'Social Media Management',
    '/charges/corporate-coverage/':'Corporate Coverage',
    '/charges/photography-and-events/':'Photography & Events'
  };
  const elements=[curtain,topCurve,bottomCurve,label];
  const cancel=()=>elements.forEach(el=>el.getAnimations().forEach(animation=>animation.cancel()));
  const frame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
  const hold=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const setLabel=(name,home)=>{
    if(home){
      const img=document.createElement('img');
      img.className='vf-home-transition-mark';
      img.alt='VIEWFINITY';
      img.decoding='async';
      img.src='/assets/media/be5f484c23a19e9923.png';
      label.replaceChildren(img);
    }else label.textContent=name;
    label.classList.toggle('is-home-symbol',!!home);
    label.classList.toggle('is-long',!home&&name.length>17);
  };
  const reset=()=>{
    cancel();
    document.documentElement.classList.remove('vf-charges-incoming','vf-charges-leaving');
    system.classList.remove('is-active');
    curtain.style.transform='translate3d(0,118%,0)';
    topCurve.style.transform='scaleY(.12)';
    bottomCurve.style.transform='scaleY(.12)';
    label.style.opacity='0';
    label.style.transform='translate3d(0,48px,0)';
  };
  let busy=false;
  async function cover(nextName,home=false){
    setLabel(nextName,home);
    reset();
    document.documentElement.classList.add('vf-charges-leaving');
    system.classList.add('is-active');
    await frame();
    const timing='cubic-bezier(.76,0,.19,1)';
    const rise=curtain.animate([{transform:'translate3d(0,118%,0)'},{transform:'translate3d(0,0,0)'}],{duration:820,easing:timing,fill:'forwards'});
    const bend=topCurve.animate([{transform:'scaleY(.12)',offset:0},{transform:'scaleY(1)',offset:.44},{transform:'scaleY(.28)',offset:1}],{duration:820,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
    const word=label.animate([{opacity:0,transform:'translate3d(0,48px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:430,delay:270,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
    await Promise.all([rise.finished,bend.finished,word.finished]);
    curtain.style.transform='translate3d(0,0,0)';
    topCurve.style.transform='scaleY(.28)';
    label.style.opacity='1';
    label.style.transform='translate3d(0,0,0)';
    rise.cancel();bend.cancel();word.cancel();
  }
  async function reveal(){
    // Continuation of the same wipe after the next HTML page has loaded.
    const pending=document.documentElement.classList.contains('vf-charges-incoming');
    try{sessionStorage.removeItem(storageKey)}catch(_){}
    if(!pending)return;
    busy=true;
    system.classList.add('is-active');
    curtain.style.transform='translate3d(0,0,0)';
    topCurve.style.transform='scaleY(.28)';
    label.style.opacity='1';
    label.style.transform='translate3d(0,0,0)';
    await frame();
    await hold(230);
    try{
      const timing='cubic-bezier(.76,0,.19,1)';
      const exit=curtain.animate([{transform:'translate3d(0,0,0)'},{transform:'translate3d(0,-118%,0)'}],{duration:930,easing:timing,fill:'forwards'});
      const bend=bottomCurve.animate([{transform:'scaleY(.20)',offset:0},{transform:'scaleY(1)',offset:.49},{transform:'scaleY(.12)',offset:1}],{duration:930,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
      const word=label.animate([{opacity:1,transform:'translate3d(0,0,0)'},{opacity:0,transform:'translate3d(0,-38px,0)'}],{duration:440,delay:270,easing:'cubic-bezier(.42,0,.86,1)',fill:'forwards'});
      const main=document.querySelector('.page-main');
      if(main)main.animate([{transform:'translate3d(0,25px,0)'},{transform:'translate3d(0,0,0)'}],{duration:850,delay:160,easing:'cubic-bezier(.22,1,.36,1)'});
      await Promise.all([exit.finished,bend.finished,word.finished]);
    }catch(error){if(error?.name!=='AbortError')console.warn('VIEWFINITY Charges entrance interrupted',error)}
    finally{reset();busy=false}
  }
  document.addEventListener('click',event=>{
    if(busy||reduce||!navigator.onLine||event.defaultPrevented||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    const anchor=event.target.closest('a[href]');
    if(!anchor||anchor.hasAttribute('download')||(anchor.target&&anchor.target!=='_self'))return;
    let url;
    try{url=new URL(anchor.href,location.href)}catch(_){return}
    if(url.origin!==location.origin||!/^https?:$/.test(url.protocol))return;
    const targetPath=normalize(url.pathname);
    const currentPath=normalize(location.pathname);
    if(targetPath===currentPath && url.hash===location.hash)return;
    const targetName=titles[targetPath]||(url.hash.startsWith('#/contact')?'Contact':url.hash.startsWith('#/about')?'About':'Home');
    const goingHome=targetPath==='/'&&!url.hash.startsWith('#/contact')&&!url.hash.startsWith('#/about');
    event.preventDefault();
    busy=true;
    (async()=>{
      try{
        await cover(targetName,goingHome);
        // Same-origin cross-document pages: complete the curtain on the destination.
        if(targetPath.startsWith('/charges/')){
          try{sessionStorage.setItem(storageKey,JSON.stringify({pathname:targetPath,started:Date.now()}))}catch(_){}
        }
      }catch(error){console.warn('VIEWFINITY Charges transition interrupted',error)}
      location.assign(url.href);
    })();
  },true);
  window.addEventListener('pageshow',event=>{if(event.persisted){busy=false;reset()}});
  reveal();
})();