/* Metal Intellectual – ortak: dil, menü, çizim seti */
(function(){
  const D=window.MI_DICT||{en:{},ar:{},tr:{}};
  D.tr=D.tr||{};
  // Türkçe metinler sayfanın kendisinden okunur
  document.querySelectorAll('[data-i]').forEach(e=>{const k=e.dataset.i;if(!(k in D.tr))D.tr[k]=e.textContent;});
  document.querySelectorAll('[data-ih]').forEach(e=>{D.tr[e.dataset.ih]=e.innerHTML;});
  document.querySelectorAll('[data-i-aria]').forEach(e=>{D.tr[e.dataset.iAria]=e.getAttribute('aria-label');});
  document.querySelectorAll('[data-i-alt]').forEach(e=>{const k=e.dataset.iAlt;if(!(k in D.tr)&&e.alt)D.tr[k]=e.alt;});
  const md=document.querySelector('meta[name=description]');
  if(md&&md.dataset.i) D.tr[md.dataset.i]=md.content;
  let LANG='tr';
  const T=k=>(D[LANG]&&D[LANG][k]!=null)?D[LANG][k]:(D.tr[k]!=null?D.tr[k]:'');
  window.MI_T=T;

  function setLang(l,save){
    if(!D[l]) l='tr'; LANG=l;
    const r=document.documentElement; r.lang=l; r.dir=l==='ar'?'rtl':'ltr';
    document.querySelectorAll('[data-i]').forEach(e=>{e.textContent=T(e.dataset.i);});
    document.querySelectorAll('[data-ih]').forEach(e=>{e.innerHTML=T(e.dataset.ih);});
    document.querySelectorAll('[data-i-aria]').forEach(e=>{e.setAttribute('aria-label',T(e.dataset.iAria));});
    const wa=document.getElementById('waFab');if(wa)wa.href='https://wa.me/905335709301?text='+encodeURIComponent(T('wa.text'));
    document.querySelectorAll('[data-i-alt]').forEach(e=>{e.alt=T(e.dataset.iAlt);});
    if(md&&md.dataset.i) md.content=T(md.dataset.i);
    document.querySelectorAll('.dtable td:not([data-i])').forEach(e=>{if(e.dataset.tr==null)e.dataset.tr=e.textContent;e.textContent=l==='tr'?e.dataset.tr:e.dataset.tr.replace(/(\d),(\d)/g,'$1.$2');});
    document.querySelectorAll('.lang button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===l)));
    document.querySelectorAll('input[name=dil]').forEach(i=>i.value=l);
    if(window.MI_SIM_REFRESH) window.MI_SIM_REFRESH();
    if(save){try{localStorage.setItem('mi-lang',l);}catch(e){}}
  }
  document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang,true)));
  let l=null;
  try{l=new URLSearchParams(location.search).get('lang');}catch(e){}
  if(!l){try{l=localStorage.getItem('mi-lang');}catch(e){}}
  if(!l){const n=(navigator.language||'tr').toLowerCase();l=n.startsWith('tr')?'tr':n.startsWith('ar')?'ar':'en';}
  setLang(l,false);

  // mobil menü
  const mb=document.querySelector('.menu-btn'), nav=document.querySelector('.nav');
  if(mb&&nav) mb.addEventListener('click',()=>{const o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',String(o));});

  // fotoğraf büyütme
  const lb=document.getElementById('lb');
  if(lb&&lb.showModal){
    const ps=[...document.querySelectorAll('a.ph')],im=lb.querySelector('img'),cp=lb.querySelector('p');let k=0;
    const show=i=>{k=(i+ps.length)%ps.length;const a=ps[k],t=a.querySelector('img');im.src=a.href;im.alt=t.alt;cp.textContent=t.alt;};
    ps.forEach((a,i)=>a.addEventListener('click',e=>{e.preventDefault();show(i);lb.showModal();}));
    lb.querySelector('.lb-x').onclick=()=>lb.close();
    lb.querySelector('.lb-p').onclick=()=>show(k-1);
    lb.querySelector('.lb-n').onclick=()=>show(k+1);
    lb.addEventListener('click',e=>{if(e.target===lb)lb.close();});
    lb.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(k+(document.dir==='rtl'?-1:1));if(e.key==='ArrowLeft')show(k+(document.dir==='rtl'?1:-1));});
  }

  // ana sayfa: şeffaf başlık, kaydırınca dolu
  if(document.body.classList.contains('pg-index')){const h=document.querySelector('.hdr');const f=()=>h.classList.toggle('solid',scrollY>30||document.querySelector('.nav.open'));f();addEventListener('scroll',f,{passive:true});mb&&mb.addEventListener('click',f);}

  // açılış sahnesi: işler sırayla
  const hero=document.querySelector('.ph-hero');
  if(hero){const sl=[...hero.querySelectorAll('.ph-slide')],dots=[...hero.querySelectorAll('.ph-dot')],D=6000;let k=0,t=null;
    const red=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sp=[...hero.querySelectorAll('.ph-sp')];const go=n=>{k=(n+sl.length)%sl.length;sl.forEach((s,i)=>s.classList.toggle('on',i===k));sp.forEach((s,i)=>s.classList.toggle('on',i===k));dots.forEach((d,i)=>{d.classList.toggle('on',i===k);const b=d.querySelector('i');b.style.animation='none';b.offsetWidth;b.style.animation='';});};
    const run=()=>{clearInterval(t);if(!red)t=setInterval(()=>go(k+1),D);};
    hero.style.setProperty('--dur',D+'ms');
    dots.forEach((d,i)=>d.addEventListener('click',()=>{go(i);run();}));
    hero.addEventListener('mouseenter',()=>{clearInterval(t);hero.classList.add('paused');});
    hero.addEventListener('mouseleave',()=>{hero.classList.remove('paused');run();});
    document.addEventListener('visibilitychange',()=>document.hidden?clearInterval(t):run());
    run();}
})();
