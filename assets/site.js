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
    try{window.dispatchEvent(new Event('mi-lang'));}catch(e){}
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
    sl.forEach(v=>{if(v.tagName==='VIDEO'){if(red){v.removeAttribute('autoplay');v.pause();}else if(v.classList.contains('on')){const p=v.play();p&&p.catch(()=>{});}}});
    const sp=[...hero.querySelectorAll('.ph-sp')];const go=n=>{k=(n+sl.length)%sl.length;sl.forEach((s,i)=>{s.classList.toggle('on',i===k);if(s.tagName==='VIDEO'){if(i===k&&!red){s.currentTime=0;const p=s.play();p&&p.catch(()=>{});}else s.pause();}});sp.forEach((s,i)=>s.classList.toggle('on',i===k));dots.forEach((d,i)=>{d.classList.toggle('on',i===k);const b=d.querySelector('i');b.style.animation='none';b.offsetWidth;b.style.animation='';});};
    const vid=sl.findIndex(x=>x.tagName==='VIDEO');const dur=()=>+(sl[k].dataset.dur||D);const run=()=>{clearTimeout(t);hero.style.setProperty('--dur',(vid>=0?8000:dur())+'ms');if(red)return;if(vid>=0){if(k!==vid)t=setTimeout(()=>{go(vid);run();},8000);return;}t=setTimeout(()=>{go(k+1);run();},dur());};
    hero.style.setProperty('--dur',D+'ms');if(vid>=0){hero.classList.add('has-vid');dots[vid]&&dots[vid].classList.add('is-vid');}
    dots.forEach((d,i)=>d.addEventListener('click',()=>{go(i);run();}));
    hero.addEventListener('mouseenter',()=>{clearTimeout(t);hero.classList.add('paused');});
    hero.addEventListener('mouseleave',()=>{hero.classList.remove('paused');run();});
    document.addEventListener('visibilitychange',()=>document.hidden?clearTimeout(t):run());
    run();}

  // bir parçanın yolculuğu: kaydırdıkça adım
  const jr=document.querySelector('.jr');
  if(jr&&'IntersectionObserver' in window){const st=[...jr.querySelectorAll('.jr-st')],im=[...jr.querySelectorAll('.jr-im')],bar=jr.querySelector('.jr-bar i'),num=jr.querySelector('.jr-num');
    im.forEach((m,i)=>{if(i<2)m.loading='eager';});
    const set=n=>{st.forEach((x,i)=>x.classList.toggle('on',i===n));im.forEach((x,i)=>x.classList.toggle('on',i===n));if(bar)bar.style.width=((n+1)/st.length*100)+'%';if(num)num.textContent=String(n+1).padStart(2,'0');};
    const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)set(+e.target.dataset.n);});},{rootMargin:'-42% 0px -42% 0px'});
    st.forEach(x=>io.observe(x));
    const pre=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){im.forEach(m=>{m.loading='eager';});pre.disconnect();}},{rootMargin:'600px 0px'});pre.observe(jr);}

  // hizmet kartları: render → teknik çizim (dokunmatikte görünür olunca bir kez)
  if(matchMedia('(hover: none)').matches&&'IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const io2=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const c=e.target;c.classList.add('peek');setTimeout(()=>c.classList.remove('peek'),1800);io2.unobserve(c);}}),{threshold:.7});
    document.querySelectorAll('.sc-card').forEach(c=>{if(c.querySelector('.sc-ln'))io2.observe(c);});}

  // 3B görüntüleyici: görünür olunca yüklenir
  const v3=document.querySelector('.v3d');
  if(v3){const load=src=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=no;document.head.appendChild(s);});
    const go3=async()=>{try{for(const f of ['three.min.js','GLTFLoader.js','OrbitControls.js','RoomEnvironment.js','viewer.js'])await load('assets/3d/'+f);window.MI_V3D&&window.MI_V3D(v3);}catch(e){v3.classList.add('v3d-fail');}};
    if('IntersectionObserver' in window){const io3=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io3.disconnect();go3();}},{rootMargin:'300px 0px'});io3.observe(v3);}else go3();}

  // görünür olunca oynayan videolar
  const ivs=[...document.querySelectorAll('video[data-inview]')];
  if(ivs.length&&'IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const io4=new IntersectionObserver(es=>es.forEach(e=>{const v=e.target;if(e.isIntersecting){const p=v.play();p&&p.catch(()=>{});}else v.pause();}),{threshold:.35});
    ivs.forEach(v=>io4.observe(v));}
})();
