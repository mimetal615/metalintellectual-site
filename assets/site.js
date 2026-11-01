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

  // projeler: fotoğraf yerine çalışma animasyonu (görününce oynar)
  const MV={scissor:'hero-scissor',gate:'gate-open',spiral:'spiral-turn',sgate:'sgate',burma:'burma',press:'press',lift:'lift',conveyor:'conveyor',kitchen:'kitchen',tank:'tank',tava:'tava'};
  const vname=src=>{const m=/assets\/img\/r-([a-z]+?)t?\.jpg/.exec(src||'');if(!m)return null;const v=MV[m[1]];return v?(v===1?m[1]:v):null;};
  const mkv=(img,v)=>{const e=document.createElement('video');e.muted=true;e.loop=true;e.playsInline=true;['muted','playsinline','loop'].forEach(a=>e.setAttribute(a,''));
    e.preload='none';e.poster='assets/video/'+v+'.jpg';e.className=img.className;e.setAttribute('aria-label',img.alt||'');if(img.dataset.iAlt)e.dataset.iAria=img.dataset.iAlt;
    e.setAttribute('data-inview','');['webm','mp4'].forEach(x=>{const so=document.createElement('source');so.src='assets/video/'+v+'.'+x;so.type='video/'+x;e.appendChild(so);});
    if(img.getAttribute('width')){e.setAttribute('width',img.getAttribute('width'));e.setAttribute('height',img.getAttribute('height'));}
    img.replaceWith(e);return e;};
  document.querySelectorAll('img[src*="assets/img/r-"]').forEach(img=>{if(img.closest('.lb')||img.classList.contains('sc-ln'))return;const v=vname(img.getAttribute('src'));if(!v)return;
    const a=img.closest('a.ph');if(a)a.dataset.v=v;const im=img.closest('.sc-im');if(im){const ln=im.querySelector('.sc-ln');ln&&ln.remove();}mkv(img,v);});

  // fotoğraf büyütme
  const lb=document.getElementById('lb');
  if(lb&&lb.showModal){
    const ps=[...document.querySelectorAll('a.ph')],im=lb.querySelector('img'),cp=lb.querySelector('p');let k=0;
    const lv=document.createElement('video');lv.muted=true;lv.loop=true;lv.playsInline=true;['muted','playsinline','loop'].forEach(a=>lv.setAttribute(a,''));lv.hidden=true;lb.insertBefore(lv,cp);
    const wb=lv.canPlayType('video/webm; codecs="vp9"')?'.webm':'.mp4';
    const show=i=>{k=(i+ps.length)%ps.length;const a=ps[k],t=a.querySelector('img,video'),al=t.alt||t.getAttribute('aria-label')||'';cp.textContent=al;
      if(a.dataset.v){im.hidden=true;lv.hidden=false;lv.poster='assets/video/'+a.dataset.v+'.jpg';lv.src='assets/video/'+a.dataset.v+wb;lv.setAttribute('aria-label',al);const p=lv.play();p&&p.catch(()=>{});}
      else{lv.pause();lv.hidden=true;im.hidden=false;im.src=a.href;im.alt=al;}};
    lb.addEventListener('close',()=>lv.pause());
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
  if(hero){const sl=[...hero.querySelectorAll('.ph-slide')],dots=[...hero.querySelectorAll('.ph-dot')],sp=[...hero.querySelectorAll('.ph-sp')],D=6000;let k=0,t=null;
    const red=matchMedia('(prefers-reduced-motion: reduce)').matches,isV=s=>s&&s.tagName==='VIDEO';
    // her video bir kez baştan sona oynar, bitince sıradakine geçer; sıradaki önceden yüklenir (takılma/titreme olmasın)
    const prep=s=>{if(!isV(s))return;if(s.dataset.poster&&!s.poster)s.poster=s.dataset.poster;if(s.preload!=='auto'){s.preload='auto';s.load();}};
    const len=s=>isV(s)?((isFinite(s.duration)&&s.duration>0)?s.duration*1000:+(s.dataset.dur||9000)):+(s.dataset.dur||D);
    const bar=()=>{hero.style.setProperty('--dur',len(sl[k])+'ms');dots.forEach((d,i)=>{d.classList.toggle('on',i===k);const b=d.querySelector('i');if(b){b.style.animation='none';b.offsetWidth;b.style.animation='';}});};
    const arm=()=>{clearTimeout(t);if(red)return;t=setTimeout(()=>go(k+1),len(sl[k])+(isV(sl[k])?2500:0));};
    const play=v=>{const p=v.play();p&&p.catch(()=>{});};
    const go=n=>{const prev=sl[k];k=(n+sl.length)%sl.length;const cur=sl[k];
      prep(cur);if(isV(cur)&&!red){try{cur.currentTime=0;}catch(e){}play(cur);}
      sl.forEach((s,i)=>s.classList.toggle('on',i===k));sp.forEach((s,i)=>s.classList.toggle('on',i===k));
      if(isV(prev)&&prev!==cur)setTimeout(()=>{if(sl[k]!==prev)prev.pause();},1500);
      bar();arm();setTimeout(()=>prep(sl[(k+1)%sl.length]),1200);};
    sl.forEach(s=>{if(!isV(s))return;s.loop=false;s.removeAttribute('loop');
      s.addEventListener('ended',()=>{if(sl[k]===s&&!red)go(k+1);});
      s.addEventListener('loadedmetadata',()=>{if(sl[k]===s){bar();arm();}});});
    if(red){sl.forEach(s=>{if(isV(s)){s.removeAttribute('autoplay');s.pause();prep(s);}});}
    hero.classList.add('has-vid');
    dots.forEach((d,i)=>d.addEventListener('click',()=>go(i)));
    document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(t);isV(sl[k])&&sl[k].pause();}else{isV(sl[k])&&!red&&play(sl[k]);arm();}});
    if(isV(sl[0])&&!red)play(sl[0]);bar();arm();setTimeout(()=>prep(sl[1]),2500);}

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
