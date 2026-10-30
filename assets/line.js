/* Metal Intellectual – karakalem üretim hattı: lazer kesim, abkant büküm, TIG kaynak, ölçü kontrolü.
   Tüm ölçüler mm cinsinden kurulur, ölçekle piksele çevrilir. */
(function(){
  const svg=document.getElementById('sim'); if(!svg) return;
  const NS='http://www.w3.org/2000/svg';
  const L=document.getElementById('simL');
  const tabs=[...document.querySelectorAll('.sim-tabs button')];
  const cells=[...document.querySelectorAll('.sim-data div')];
  const noteEl=document.getElementById('simNote');
  const playBtn=document.getElementById('simPlay');
  const T=k=>window.MI_T?window.MI_T(k):k;
  const lang=()=>document.documentElement.lang||'tr';
  const num=(v,d)=>{let s=v.toFixed(d); if(lang()==='tr') s=s.replace('.',','); return s;};
  const rad=d=>d*Math.PI/180, deg=r=>r*180/Math.PI;
  const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
  const ease=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
  const seg=(u,a,b)=>clamp((u-a)/(b-a),0,1);
  const rnd=(a,b)=>a+Math.random()*(b-a);
  function el(tag,a,parent){const e=document.createElementNS(NS,tag);for(const k in a)e.setAttribute(k,a[k]);parent.appendChild(e);return e;}
  const P=A=>A.map(q=>q[0].toFixed(2)+','+q[1].toFixed(2)).join(' ');

  const G='#2B2D30', G2='#6A6E73', BLUE='#2C5A94', OR='#D45A1E';

  /* ---------- kağıt, kalem, tarama ---------- */
  const defs=svg.querySelector('defs')||el('defs',{},svg);
  defs.insertAdjacentHTML('beforeend',`
   <filter id="fPencil" x="-5%" y="-5%" width="110%" height="110%">
     <feTurbulence id="fTurb" type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="2" result="n"/>
     <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" xChannelSelector="R" yChannelSelector="G"/></filter>
   <filter id="fGrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/>
     <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.34  0 0 0 0 0.32  0 0 0 .09 0"/></filter>
   <filter id="fSoft"><feGaussianBlur stdDeviation="2.2"/></filter>
   <pattern id="hL" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><line x1="0" y1="0" x2="0" y2="5" stroke="${G}" stroke-width=".55" opacity=".42"/></pattern>
   <pattern id="hM" width="3.6" height="3.6" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><line x1="0" y1="0" x2="0" y2="3.6" stroke="${G}" stroke-width=".7" opacity=".55"/></pattern>
   <pattern id="hX" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><path d="M0 0V4M0 0H4" stroke="${G}" stroke-width=".7" opacity=".6"/></pattern>
   <pattern id="hV" width="3" height="3" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="3" stroke="${G}" stroke-width=".5" opacity=".35"/></pattern>
   <radialGradient id="gGlow"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".3" stop-color="#FFE6A6"/><stop offset=".65" stop-color="#FF9440" stop-opacity=".45"/><stop offset="1" stop-color="#FF7A1A" stop-opacity="0"/></radialGradient>
   <radialGradient id="gArc"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".3" stop-color="#EAF2FF"/><stop offset=".6" stop-color="#9DBBFF" stop-opacity=".5"/><stop offset="1" stop-color="#7C9BFF" stop-opacity="0"/></radialGradient>`);
  const turb=document.getElementById('fTurb');
  // sabit kağıt zemini
  const bg=svg.querySelector('rect'); if(bg) bg.setAttribute('fill','#F3F2EE');
  el('rect',{width:640,height:380,filter:'url(#fGrain)',opacity:'1'},svg).parentNode.insertBefore(svg.lastChild,L);

  let ink,fx;   // ink: kalemle çizilen (titrek), fx: ışık, kıvılcım, yazı
  function reset(){L.textContent='';ink=el('g',{filter:'url(#fPencil)'},L);fx=el('g',{},L);}
  const line=(x1,y1,x2,y2,w,c,par)=>el('line',{x1,y1,x2,y2,stroke:c||G,'stroke-width':w||1.2,'stroke-linecap':'round'},par||ink);
  const poly=(pts,fill,w,par,extra)=>el('polygon',Object.assign({points:P(pts),fill:fill||'none',stroke:G,'stroke-width':w||1.3,'stroke-linejoin':'round'},extra||{}),par||ink);
  const pline=(pts,w,c,par,extra)=>el('polyline',Object.assign({points:P(pts),fill:'none',stroke:c||G,'stroke-width':w||1.3,'stroke-linejoin':'round','stroke-linecap':'round'},extra||{}),par||ink);
  const path=(d,fill,w,c,par,extra)=>el('path',Object.assign({d,fill:fill||'none',stroke:c||G,'stroke-width':w||1.3,'stroke-linejoin':'round','stroke-linecap':'round'},extra||{}),par||ink);
  const text=(x,y,s,a)=>{const e=el('text',Object.assign({x,y,fill:G2,'font-size':'12.5'},a||{}),fx);e.textContent=s;return e;};
  // 3B derinlik: ön yüz + üst/yan yüzler taralı
  function solid(front,dx,dy,shade,par){
    par=par||ink; const n=front.length, back=front.map(([x,y])=>[x+dx,y+dy]);
    for(let i=0;i<n;i++){const a=front[i],b=front[(i+1)%n];
      const nx=b[1]-a[1], ny=-(b[0]-a[0]); // dış normal (saat yönü varsayımı yok, iki yüz de çizilir)
      if(nx*dx+ny*dy>0) poly([a,b,back[(i+1)%n],back[i]],shade==='none'?'none':'url(#hL)',1,par);}
    poly(front,shade||'url(#hM)',1.4,par);
  }

  /* ---------- kıvılcım parçacıkları ---------- */
  let sparks=[];
  function spawn(x,y,n,o){for(let i=0;i<n;i++){const a=rnd(o.a0,o.a1),v=rnd(o.v0,o.v1);sparks.push({x,y,vx:Math.cos(a)*v+(o.vx||0),vy:Math.sin(a)*v,life:rnd(o.l0||.2,o.l1||.6),age:0,g:o.g||0,floor:o.floor||1e9});}}
  function stepSparks(dt){
    sparks=sparks.filter(s=>(s.age+=dt)<s.life);
    sparks.forEach(s=>{s.vy+=s.g*dt;s.x+=s.vx*dt;s.y+=s.vy*dt;
      if(s.y>s.floor){s.y=s.floor;s.vy*=-.25;s.vx*=.5;}
      const k=1-s.age/s.life;
      el('line',{x1:s.x,y1:s.y,x2:s.x-s.vx*.03,y2:s.y-s.vy*.03,stroke:k>.65?'#FFF3C4':k>.35?'#FFAE45':'#D9581C','stroke-width':(1.5*k+.4).toFixed(2),'stroke-linecap':'round',opacity:k.toFixed(2)},fx);});
  }

  const DUR=[11000,16000,10000,10000];
  let stage=0,t0=performance.now(),playing=true,frozenU=null,lastNow=performance.now(),dt=.016,lastSeed=0;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){playing=false;frozenU=1;}

  /* =================== 1. LAZER KESİM (yandan kesit + üstten detay) =================== */
  // Açınım (üstten): 520 x 150 mm, iki oval delik; sıra: delik 1, delik 2, dış kontur
  const FLAT={w:520,h:150};
  function contours(){
    const sl=(cx,cy)=>{const p=[];for(let i=0;i<=40;i++){const t=i/40;let x,y;
        if(t<.3){x=cx-22+44*(t/.3);y=cy-7;}
        else if(t<.5){const a=-Math.PI/2+Math.PI*((t-.3)/.2);x=cx+22+7*Math.cos(a);y=cy+7*Math.sin(a);}
        else if(t<.8){x=cx+22-44*((t-.5)/.3);y=cy+7;}
        else{const a=Math.PI/2+Math.PI*((t-.8)/.2);x=cx-22+7*Math.cos(a);y=cy+7*Math.sin(a);}
        p.push([x,y]);}return p;};
    const out=[[0,60],[0,0],[520,0],[520,150],[0,150],[0,60]];
    return [sl(250,45),sl(250,105),out];
  }
  const CT=contours();
  const plen=p=>{let s=0;for(let i=1;i<p.length;i++)s+=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);return s;};
  const pat=(p,d)=>{for(let i=1;i<p.length;i++){const l=Math.hypot(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);if(d<=l){const m=d/l;return [p[i-1][0]+(p[i][0]-p[i-1][0])*m,p[i-1][1]+(p[i][1]-p[i-1][1])*m];}d-=l;}return p[p.length-1];};
  // zaman çizelgesi: hızlı geçiş, delme, kesim
  const PLAN=(()=>{const s=[];let pos=[-40,75];
    CT.forEach((c,i)=>{s.push({k:'rapid',a:pos,b:c[0],w:.6});s.push({k:'pierce',p:c[0],w:i<2?.5:.7});s.push({k:'cut',c,i,w:plen(c)/90});pos=c[c.length-1];});
    s.push({k:'rapid',a:pos,b:[560,-30],w:.6});const tot=s.reduce((a,b)=>a+b.w,0);s.forEach(x=>x.w/=tot);return s;})();
  function laserState(u){let acc=0;const done=[0,0,0];let st=null;
    for(const s of PLAN){if(u<=acc+s.w){const k=(u-acc)/s.w;st={s,k};break;}acc+=s.w;if(s.k==='cut')done[s.i]=1;}
    if(!st)st={s:PLAN[PLAN.length-1],k:1};
    const s=st.s,k=st.k;let pos,mode=s.k,partial=null;
    if(s.k==='rapid'){const m=ease(k);pos=[s.a[0]+(s.b[0]-s.a[0])*m,s.a[1]+(s.b[1]-s.a[1])*m];}
    else if(s.k==='pierce')pos=s.p;
    else{const L0=plen(s.c);pos=pat(s.c,k*L0);partial={i:s.i,d:k*L0};}
    return {pos,mode,done,partial,pk:k};
  }
  let prevHX=null;
  function drawCut(u){
    const st=laserState(u);
    const X0=60, SY=250, K=1;                         // yandan görünüş: sac üst yüzü y=250
    const hx=X0+st.pos[0]*K;
    // gantri kirişi (üstte, boydan boya)
    solid([[0,22],[640,22],[640,62],[0,62]],18,-10,'url(#hL)');
    line(0,58,640,58,1);
    // ızgara lamelleri (testere dişli) + tabla
    for(let x=X0-30;x<=X0+560;x+=34){const teeth=[];for(let k=0;k<=3;k++){teeth.push([x+k*2,SY+2+(k%2?6:0)]);}
      poly([[x,SY+2],[x+2,SY+8],[x+4,SY+2],[x+6,SY+8],[x+6,348],[x,348]],'url(#hM)',1);}
    poly([[0,348],[640,348],[640,380],[0,380]],'url(#hX)',1.2);
    // sac (2 mm) – kesit + üst yüz
    poly([[X0,SY-3],[X0+520,SY-3],[X0+520,SY],[X0,SY]],G,1);
    poly([[X0,SY-3],[X0+520,SY-3],[X0+520+26,SY-17],[X0+26,SY-17]],'url(#hL)',1);
    // kesim kafası (Z ekseni + gövde + nozul)
    const H=el('g',{transform:`translate(${hx} ${SY-4})`},ink);
    poly([[-28,-196],[28,-196],[28,-188],[-28,-188]],'url(#hX)',1.2,H);           // araba
    poly([[-20,-188],[20,-188],[20,-112],[-20,-112]],'url(#hL)',1.3,H);           // Z plakası + gövde
    poly([[-15,-112],[15,-112],[15,-58],[-15,-58]],'none',1.3,H);                 // pencere kartuşu
    line(-15,-92,15,-92,1,G,H); line(18,-104,26,-104,1,G,H); line(26,-104,26,-150,1,G,H); // kablo/gaz
    poly([[-11,-58],[11,-58],[11,-30],[-11,-30]],'url(#hL)',1.2,H);              // sensör gövdesi
    poly([[-9,-30],[9,-30],[9,-22],[-9,-22]],'#FFFFFF',1.2,H);                    // seramik halka
    poly([[-8,-22],[8,-22],[3,0],[-3,0]],'url(#hM)',1.3,H);                       // bakır nozul
    // lazer ışını (kafa içinde, sadece kesimde)
    const on=st.mode==='cut'||st.mode==='pierce';
    // ölçek oku: nozul–sac mesafesi
    // ışık ve kıvılcım
    const vx=prevHX==null?0:(hx-prevHX)/Math.max(dt,.001); prevHX=hx;
    if(on){
      el('circle',{cx:hx,cy:SY-1,r:(10+Math.random()*4).toFixed(1),fill:'url(#gGlow)'},fx);
      if(st.mode==='pierce'&&st.pk<.7){ // delme: erimiş metal yukarı sıçrar
        spawn(hx,SY-3,3,{a0:-Math.PI*.95,a1:-Math.PI*.05,v0:40,v1:120,l0:.15,l1:.35,g:400});
      } else { // kesim: kıvılcım sacın altından aşağı, kesim yönünün tersine akar
        spawn(hx,SY+1,6,{a0:Math.PI*.38,a1:Math.PI*.62,v0:160,v1:300,vx:-vx*.45,l0:.18,l1:.4,g:500,floor:346});
      }
    }
    stepSparks(dt);
    // etiketler
    text(hx+34,SY-150,T('sim.cut.head'));
    text(X0+300,SY+40,T('sim.cut.slat'));
    text(X0,SY-26,'AISI 304 · 2 mm'.replace(' · ',', '));
    // ÜSTTEN DETAY (sağ üst kutu)
    const ix=430,iy=74,s=.36;
    el('rect',{x:ix-8,y:iy-22,width:520*s+16,height:150*s+34,fill:'#FBFAF7',stroke:G,'stroke-width':'1'},fx);
    const I=el('g',{filter:'url(#fPencil)'},fx);
    text(ix-2,iy-8,T('sim.top'),{'font-size':'11.5'});
    poly([[ix,iy],[ix+520*s,iy],[ix+520*s,iy+150*s],[ix,iy+150*s]],'url(#hL)',1,I);
    [38,146,374,482].forEach(x=>line(ix+x*s,iy,ix+x*s,iy+150*s,.9,OR,I).setAttribute('stroke-dasharray','3 2'));
    CT.forEach((c,i)=>{
      if(st.done[i]){ if(i<2) poly(c.map(([x,y])=>[ix+x*s,iy+y*s]),G,1,I); else pline(c.map(([x,y])=>[ix+x*s,iy+y*s]),1.6,G,I); }
      else if(st.partial&&st.partial.i===i){const pts=[];const L0=plen(c);for(let d=0;d<=st.partial.d;d+=2)pts.push(pat(c,d));pts.push(pat(c,st.partial.d));
        pline(pts.map(([x,y])=>[ix+x*s,iy+y*s]),1.6,G,I);}
      else pline(c.map(([x,y])=>[ix+x*s,iy+y*s]),.8,G2,I,{'stroke-dasharray':'2 2'});
    });
    const cx=ix+st.pos[0]*s, cy=iy+st.pos[1]*s;
    el('circle',{cx,cy,r:on?3.2:2.4,fill:on?OR:'none',stroke:OR,'stroke-width':'1.2'},fx);
    return st.mode==='cut'?(st.partial.i<2?T('sim.cut.inner'):T('sim.cut.outer')):(u>=.98?T('sim.cut.done'):T('sim.cut.move'));
  }

  /* =================== 2. ABKANT (yandan kesit, gerçek oranlar) =================== */
  const KB=1.15, TH=2, V=16;
  const D={x:410,y:252};           // kalıp omuz çizgisi ortası
  const LIP=40,FL=110,BASE=220;
  function profile(ang){
    function side(sgn,aFl,aLip){const Q=[];let x=sgn*BASE/2,y=0,a=0;Q.push([x,y]);
      a+=aFl;x+=sgn*FL*Math.cos(rad(a));y-=FL*Math.sin(rad(a));Q.push([x,y]);
      a+=aLip;x+=sgn*LIP*Math.cos(rad(a));y-=LIP*Math.sin(rad(a));Q.push([x,y]);return Q;}
    return side(-1,ang[2],ang[0]).reverse().concat(side(1,ang[3],ang[1]));
  }
  const BENDS=[{v:1,back:0,gauge:LIP},{v:4,back:5,gauge:LIP},{v:2,back:1,gauge:FL},{v:3,back:4,gauge:FL}];
  function bis(Q,v){const A=Q[v-1],Vv=Q[v],C=Q[v+1];
    const d1=[Vv[0]-A[0],Vv[1]-A[1]],d2=[C[0]-Vv[0],C[1]-Vv[1]];const n1=Math.hypot(...d1),n2=Math.hypot(...d2);
    const b=[d2[0]/n2-d1[0]/n1,d2[1]/n2-d1[1]/n1];const nb=Math.hypot(...b);return nb<.02?[0,-1]:[b[0]/nb,b[1]/nb];}
  function place(ang,bi,a){ // parçayı makineye yerleştir: büküm çizgisi kalıpta, iç taraf yukarı, kısa taraf arka dayamada
    const Q=profile(ang),v=BENDS[bi].v,b=bis(Q,v),th=-Math.PI/2-Math.atan2(b[1],b[0]);
    const h=(V/2)*Math.tan(rad(a/2));                     // kanat omuzlardan dönerken büküm çizgisi kalıba iner
    const vy=D.y+(h-TH/2)*KB;
    let W=Q.map(([x,y])=>{const X=(x-Q[v][0])*Math.cos(th)-(y-Q[v][1])*Math.sin(th),Y=(x-Q[v][0])*Math.sin(th)+(y-Q[v][1])*Math.cos(th);return [D.x+X*KB,vy+Y*KB];});
    if(W[BENDS[bi].back][0]<D.x) W=W.map(([x,y])=>[2*D.x-x,y]);   // ters çevir (operatör parçayı uçtan uca döndürür)
    return {W,vy};
  }
  function bendTimeline(u){
    const n=4,s=u*n;let i=Math.min(n-1,Math.floor(s));const k=u>=1?1:s-i;
    const ang=[0,0,0,0];for(let j=0;j<i;j++)ang[j]=90;
    let a=0,ram=1,load=0,unload=0,gaugeOff=0;
    if(k<.18){load=1-ease(k/.18);}
    else if(k<.27){ram=1-ease((k-.18)/.09)*.985;}
    else if(k<.31){ram=.015;gaugeOff=ease((k-.27)/.04)*6;}
    else if(k<.68){ram=0;a=92*ease((k-.31)/.37);gaugeOff=6;}
    else if(k<.74){ram=0;a=92-2*ease((k-.68)/.06);gaugeOff=6;}
    else if(k<.84){a=90;ram=ease((k-.74)/.1);gaugeOff=6*(1-(k-.74)/.1);}
    else{a=90;ram=1;unload=ease((k-.84)/.16);}
    ang[i]=a;return {i,k,ang,a,ram,load,unload,gaugeOff};
  }
  function drawBend(u){
    const st=bendTimeline(u),i=st.i,B=BENDS[i];
    // C gövde yan plakası (arka planda)
    path(`M300 0H640V380H300V${D.y+56}H540V${D.y-132}H300Z`,'url(#hL)',1,G,ink,{opacity:.45});
    // ön destek kolu (operatör tarafı)
    poly([[60,D.y],[250,D.y],[250,D.y+10],[60,D.y+10]],'none',1.1);
    line(120,D.y+10,150,D.y+46,1.1);line(205,D.y+10,190,D.y+46,1.1);
    // alt kalıp V16, 88° + tutucu + alt tabla
    const dd=8/Math.tan(rad(44));
    const die=[[-20,0],[-8,0],[0,dd],[8,0],[20,0],[20,60],[-20,60]].map(([x,y])=>[D.x+x*KB,D.y+y*KB]);
    solid(die,14,-9,'url(#hM)');
    solid([[-30,60],[30,60],[30,92],[-30,92]].map(([x,y])=>[D.x+x*KB,D.y+y*KB]),14,-9,'url(#hX)');
    poly([[-42,92],[42,92],[42,200],[-42,200]].map(([x,y])=>[D.x+x*KB,D.y+y*KB]),'url(#hX)',1.4);
    line(D.x,D.y-150,D.x,D.y+70,.6,G2).setAttribute('stroke-dasharray','6 4');
    // parça (yükleme/boşaltma hareketiyle)
    let {W,vy}=place(st.ang,i,st.a);
    const offX=-90*st.load-110*st.unload, offY=-26*st.load-34*st.unload;
    W=W.map(([x,y])=>[x+offX,y+offY]);
    const DX=26,DY=-16, Bk=W.map(([x,y])=>[x+DX,y+DY]);
    const op=String(1-st.unload*.85);
    const PG=el('g',{opacity:op},ink);
    for(let j=0;j<W.length-1;j++) poly([W[j],W[j+1],Bk[j+1],Bk[j]],'url(#hL)',.9,PG);
    pline(Bk,.9,G2,PG);
    pline(W,TH*KB+1.2,G,PG);
    // arka dayama (parmak + kiriş), büküm çizgisinden 'gauge' kadar geride; sıkıştırınca 6 mm geri çekilir
    const gx=D.x+(B.gauge+st.gaugeOff)*KB+TH*KB*.2;
    window.__gx=window.__gx==null?gx:window.__gx+(gx-window.__gx)*Math.min(1,dt*7);
    const fxp=window.__gx;
    poly([[fxp,D.y-20],[fxp+16,D.y-20],[fxp+16,D.y-30],[fxp+70,D.y-30],[fxp+70,D.y-6],[fxp+4,D.y-6],[fxp,D.y-10]],'url(#hM)',1.3);
    poly([[fxp+70,D.y-34],[640,D.y-34],[640,D.y-22],[fxp+70,D.y-22]],'url(#hL)',1.1);
    // X ölçüsü (mavi kalem)
    const dimY=D.y-52;
    line(D.x,dimY,fxp,dimY,1,BLUE,fx);line(D.x,dimY-6,D.x,dimY+6,1,BLUE,fx);line(fxp,dimY-6,fxp,D.y-34,1,BLUE,fx);
    text((D.x+fxp)/2,dimY-6,'X = '+num(B.gauge+st.gaugeOff,1),{'text-anchor':'middle',fill:BLUE,'font-size':'12'});
    // üst bıçak (kaz boynu, 88°) + koç: sadece dikey
    const tipY=vy-(TH/2)*KB-st.ram*110*KB;
    const PU=el('g',{transform:`translate(${D.x} ${tipY}) scale(${KB})`},ink);
    const punch=[[0,0],[4.2,-4.3],[6,-30],[11,-42],[11,-96],[16,-106],[16,-118],[-16,-118],[-16,-106],[-11,-101],[-11,-66],[-30,-50],[-30,-24],[-4.2,-4.3]];
    const pb=punch.map(([x,y])=>[x+12,y-8]);
    for(let j=0;j<punch.length;j++){const a=punch[j],b=punch[(j+1)%punch.length];if(b[1]<a[1]-1||a[0]>0&&b[0]>0)poly([a,b,pb[(j+1)%punch.length],pb[j]],'url(#hL)',.8/KB,PU);}
    poly(punch,'url(#hM)',1.3/KB,PU);
    poly([[-38,-118],[38,-118],[38,-300],[-38,-300]],'url(#hX)',1.3/KB,PU);       // koç (üst kiriş)
    poly([[-22,-118],[22,-118],[22,-128],[-22,-128]],'none',1/KB,PU);             // bıçak bağlama
    // hidrolik silindir (üstte, sabit) + piston kolu
    poly([[D.x-30,0],[D.x+30,0],[D.x+30,22],[D.x-30,22]],'url(#hX)',1.3);
    // CNC (gerçek okunan değerler)
    const Ymm=(st.ram*110+(V/2)*Math.tan(rad(st.a/2))).toFixed(2);
    const cx=14,cy=14;
    el('rect',{x:cx,y:cy,width:168,height:96,rx:'5',fill:'#1A1E22',stroke:'#3A424C','stroke-width':'2'},fx);
    const row=(y,k2,v,c)=>{text(cx+10,cy+y,k2,{fill:'#8C97A2','font-size':'11.5'});text(cx+158,cy+y,v,{'text-anchor':'end',fill:c||'#7BE0A2','font-size':'14','font-weight':'700','font-family':'ui-monospace,Consolas,monospace'});};
    text(cx+10,cy+18,`${i+1}/4  ${T('sim.b'+(i+1))}`,{fill:'#E9EEF3','font-size':'12.5','font-weight':'700'});
    row(42,'Y',lang()==='tr'?Ymm.replace('.',','):Ymm);
    row(62,'X',num(B.gauge+st.gaugeOff,1));
    row(84,T('sim.bend.angle'),num(st.a,1)+'°',st.a>90.05?'#FFB347':'#7BE0A2');
    if(st.k>.66&&st.k<.8) text(cx,cy+116,T('sim.bend.spring'),{fill:OR,'font-size':'12.5','font-weight':'700'});
    // etiketler
    text(D.x+60*KB,D.y+40,T('sim.bend.die'));
    text(D.x+30,tipY-70,T('sim.bend.punch'));
    text(fxp+18,D.y+14,T('sim.bend.gauge'));
    text(64,D.y+28,T('sim.op'));
    // parça özeti (sağ üst)
    const ix=478,iy=20,s=.28;
    el('rect',{x:ix,y:iy,width:150,height:96,fill:'#FBFAF7',stroke:G,'stroke-width':'1'},fx);
    text(ix+8,iy+15,T('sim.part'),{'font-size':'11.5'});
    const Q=profile(st.ang).map(([x,y])=>[ix+75+x*s,iy+82+y*s]);
    pline(Q,2,G,fx);
    const vv=Q[B.v]; el('circle',{cx:vv[0],cy:vv[1],r:4,fill:'none',stroke:OR,'stroke-width':'1.6'},fx);
    return T('sim.b'+(i+1));
  }

  /* =================== 3. TIG KAYNAK (yandan, gerçek açılar) =================== */
  function drawWeld(u){
    const K=2.2, SY=258, x0=90, x1=520;
    const k=seg(u,.05,.92), cx=x0+(x1-x0)*k, on=k>0&&k<1;
    // kaynak masası + sac (3 mm)
    poly([[0,SY+3*K],[640,SY+3*K],[640,SY+3*K+26],[0,SY+3*K+26]],'url(#hX)',1.3);
    line(40,SY+3*K+26,40,380,4);line(600,SY+3*K+26,600,380,4);
    poly([[0,SY],[640,SY],[640,SY+3*K],[0,SY+3*K]],'url(#hL)',1.3);
    poly([[0,SY],[640,SY],[660,SY-14],[20,SY-14]],'url(#hL)',.9);
    // dikiş (yandan profil: hafif bombe) + ısı rengi
    const bead=[];for(let x=x0;x<=cx;x+=2){const age=cx-x;const hh=Math.min(1,age/10)*1.5*K;bead.push([x,SY-hh]);}
    if(bead.length>1){ path('M'+P(bead).replace(/ /g,' L')+` L${cx} ${SY} L${x0} ${SY}Z`,'url(#hM)',1.2);
      for(let x=x0+3;x<cx-4;x+=4) line(x,SY,x+1.5,SY-1.5*K+.5,.6,G2);
      const band=(a,b,c,o)=>{if(cx-a<=x0)return;el('rect',{x:Math.max(x0,cx-b),y:SY-1.6*K,width:Math.max(0,Math.min(b,cx-x0)-a),height:1.6*K+1,fill:c,opacity:o},fx);};
      band(0,14,'#FFE7A0',.95);band(14,34,'#F2A04A',.75);band(34,70,'#C98E45',.55);band(70,120,'#C9A86A',.45);band(120,190,'#7781AE',.35);
    }
    // ÜSTTEN DETAY: balık pulu dikiş + ısı rengi bantları
    const ix=376,iy=20,iw=250,ih=80;
    el('rect',{x:ix,y:iy,width:iw,height:ih,fill:'#FBFAF7',stroke:G,'stroke-width':'1'},fx);
    text(ix+8,iy+15,T('sim.top'),{'font-size':'11.5'});
    const I=el('g',{filter:'url(#fPencil)'},fx), my=iy+50, sx=ix+14+(iw-28)*k;
    line(ix+10,my,ix+iw-10,my,.7,G2,I).setAttribute('stroke-dasharray','3 3');
    if(k>0){
      el('rect',{x:ix+14,y:my-15,width:Math.max(0,sx-ix-14),height:30,fill:'#C9A86A',opacity:'.25'},fx);
      el('rect',{x:ix+14,y:my-11,width:Math.max(0,sx-ix-14),height:22,fill:'#7781AE',opacity:'.15'},fx);
      for(let x=ix+16;x<sx-2;x+=4.2) path(`M${x-4} ${my-7}Q${x+3} ${my} ${x-4} ${my+7}`,'none',.8,G,I);
      pline([[ix+14,my-7],[sx,my-7]],.9,G,I);pline([[ix+14,my+7],[sx,my+7]],.9,G,I);
      if(on){el('ellipse',{cx:sx,cy:my,rx:7,ry:7.5,fill:'#FFD58A'},fx);el('circle',{cx:sx,cy:my,r:3,fill:'#FFFFFF'},fx);}
    }
    // torç: dik eksenden 15° geriye yatık, iter yönde; tungsten Ø2,4, ark boyu ≈ 2,5 mm
    const arc=2.5*K, tipY=SY-1.5*K-arc;
    const tilt=rad(15), ax=-Math.sin(tilt), ay=-Math.cos(tilt);   // torç ekseni yukarı-geriye
    const nx=Math.cos(tilt), ny=-Math.sin(tilt);
    const pt=(along,side)=>[cx+ax*along*K+nx*side*K, tipY+ay*along*K+ny*side*K];
    const tor=el('g',{},ink);
    poly([pt(0,-1.2),pt(0,1.2),pt(5,1.2),pt(5,-1.2)],'#E8E9EB',1,tor);                         // tungsten (5 mm çıkıntı)
    poly([pt(5,-6.4),pt(5,6.4),pt(30,9.5),pt(30,-9.5)],'#F1E3D6',1.3,tor);                      // seramik nozul #8
    poly([pt(30,-11),pt(30,11),pt(48,11),pt(48,-11)],'url(#hM)',1.3,tor);                       // torç kafası
    poly([pt(48,-8),pt(48,8),pt(110,8),pt(110,-8)],'url(#hX)',1.3,tor);                         // uzun arka kapak
    const hb=pt(40,-9), hd=[Math.cos(-rad(125)),Math.sin(-rad(125))];                              // tutamak
    poly([[hb[0],hb[1]],[hb[0]+hd[0]*120+8,hb[1]+hd[1]*120+4],[hb[0]+hd[0]*120-6,hb[1]+hd[1]*120-10],[hb[0]-10,hb[1]-14]],'url(#hL)',1.3,tor);
    path(`M${hb[0]+hd[0]*120} ${hb[1]+hd[1]*120}C${hb[0]+hd[0]*170} ${hb[1]+hd[1]*170} ${20} ${20} ${0} ${30}`,'none',5,G,tor);
    // koruyucu gaz
    for(let s=-1;s<=1;s+=2) path(`M${pt(30,s*9)[0]} ${pt(30,s*9)[1]}Q${cx+s*14} ${SY-12} ${cx+s*26} ${SY-3}`,'none',.6,G2,fx,{'stroke-dasharray':'2 3'});
    // dolgu teli: yüzeye ~15°, banyonun ön kenarına girip çıkar
    const dip=(Math.sin(performance.now()/170)+1)/2;
    const ra=rad(15), rx0=cx+6+dip*10, ry0=SY-1.2-dip*2.6;
    const rodEnd=[rx0+Math.cos(ra)*260,ry0-Math.sin(ra)*260];
    line(rx0,ry0,rodEnd[0],rodEnd[1],2.4*K*.5+1,G,ink);
    line(rx0+1,ry0-1.5,rodEnd[0],rodEnd[1]-1.5,.6,'#FFFFFF',fx);
    if(on){
      el('circle',{cx:cx,cy:SY-2,r:(70+rnd(-6,6)).toFixed(0),fill:'url(#gArc)',opacity:'.35'},fx);
      el('ellipse',{cx:cx+1,cy:SY-1.4*K,rx:9,ry:3.2,fill:'#FFC968'},fx);
      el('path',{d:`M${cx-1.2} ${tipY}L${cx+1.2} ${tipY}L${cx+7} ${SY-2}L${cx-7} ${SY-2}Z`,fill:'url(#gArc)'},fx);
      el('circle',{cx:cx,cy:(tipY+SY)/2,r:(9+rnd(-1.5,1.5)).toFixed(1),fill:'url(#gArc)'},fx);
      el('circle',{cx:rx0,cy:ry0,r:2.6,fill:dip<.45?'#FFB347':'#CFCFCF'},fx);
      if(Math.random()<.08) spawn(cx,SY-3,1,{a0:-Math.PI*.9,a1:-Math.PI*.1,v0:40,v1:90,l0:.15,l1:.3,g:300});
    }
    stepSparks(dt);
    // açı ve etiketler
    const lbl=pt(80,14);
    text(lbl[0]+12,lbl[1],T('sim.weld.torch'));
    text(rodEnd[0]-120,rodEnd[1]+8,T('sim.weld.rod'));
    const a1=pt(0,0),a2=pt(60,0);
    line(cx,tipY,cx,tipY-60,.8,BLUE,fx).setAttribute('stroke-dasharray','4 3');
    path(`M${cx} ${tipY-44}A44 44 0 0 0 ${cx-44*Math.sin(tilt)} ${tipY-44*Math.cos(tilt)}`,'none',1,BLUE,fx);
    text(cx-24,tipY-50,'15°',{fill:BLUE,'font-size':'12','text-anchor':'end'});
    text(x0,SY+3*K+44,T('sim.weld.seam'),{fill:BLUE});
    return k>=1?T('sim.weld.done'):T('sim.weld.run');
  }

  /* =================== 4. ÖLÇÜ KONTROLÜ (pleyt üzerinde) =================== */
  function caliperH(xa,xb,yBeam,reading,par){ // yatay kumpas: dış ölçü çeneleri aşağı
    const g=par||ink;
    poly([[xa-30,yBeam-12],[xb+150,yBeam-12],[xb+150,yBeam],[xa-30,yBeam]],'url(#hL)',1.2,g);
    for(let x=xa-26;x<xb+146;x+=4) line(x,yBeam-12,x,yBeam-12+((Math.round((x-xa)/4))%5?3:6),.5,G,g);
    poly([[xa-30,yBeam],[xa,yBeam],[xa,yBeam+64],[xa-6,yBeam+70],[xa-30,yBeam+20]],'url(#hM)',1.3,g);   // sabit çene
    poly([[xb,yBeam],[xb+30,yBeam],[xb+30,yBeam+20],[xb+6,yBeam+70],[xb,yBeam+64]],'url(#hM)',1.3,g);  // hareketli çene
    poly([[xb,yBeam-20],[xb+110,yBeam-20],[xb+110,yBeam+12],[xb,yBeam+12]],'url(#hX)',1.3,g);          // sürgü
    el('rect',{x:xb+14,y:yBeam-15,width:64,height:20,rx:2,fill:'#BFCDB4',stroke:G,'stroke-width':'1'},fx);
    el('text',{x:xb+74,y:yBeam,'text-anchor':'end',fill:'#1F2B1B','font-size':'14','font-weight':'700','font-family':'ui-monospace,Consolas,monospace'},fx).textContent=reading;
    el('circle',{cx:xb+94,cy:yBeam-4,r:5,fill:'none',stroke:G,'stroke-width':'1.2'},g);
  }
  function caliperV(ya,yb,xBeam,reading){ // dikey kumpas: alt çene pleytte, üst çene flanş üstünde
    poly([[xBeam,yb+40],[xBeam+12,yb+40],[xBeam+12,ya-120],[xBeam,ya-120]],'url(#hL)',1.2);
    for(let y=yb+36;y>ya-116;y-=4) line(xBeam,y,xBeam+((Math.round((yb-y)/4))%5?3:6),y,.5,G);
    poly([[xBeam,yb],[xBeam-56,yb],[xBeam-56,yb-6],[xBeam,yb-16]],'url(#hM)',1.3);
    poly([[xBeam,ya],[xBeam-56,ya],[xBeam-56,ya+6],[xBeam,ya+16]],'url(#hM)',1.3);
    poly([[xBeam-4,ya-6],[xBeam+30,ya-6],[xBeam+30,ya-96],[xBeam-4,ya-96]],'url(#hX)',1.3);
    el('rect',{x:xBeam+34,y:ya-70,width:66,height:22,rx:2,fill:'#BFCDB4',stroke:G,'stroke-width':'1'},fx);
    el('text',{x:xBeam+96,y:ya-54,'text-anchor':'end',fill:'#1F2B1B','font-size':'14','font-weight':'700','font-family':'ui-monospace,Consolas,monospace'},fx).textContent=reading;
  }
  function drawCheck(u){
    const K=1.15, PY=318, X0=36;
    // granit pleyt
    solid([[0,PY],[420,PY],[420,PY+40],[0,PY+40]],14,-9,'url(#hX)');
    // U profil (dış ölçüler 220 x 110, dudak 40), kesit + derinlik
    const W=220*K,H=110*K,Lp=40*K,t=TH*K+1;
    const prof=[[X0+Lp,PY-H],[X0,PY-H],[X0,PY],[X0+W,PY],[X0+W,PY-H],[X0+W-Lp,PY-H]];
    const bk=prof.map(([x,y])=>[x+22,y-14]);
    for(let j=0;j<prof.length-1;j++) poly([prof[j],prof[j+1],bk[j+1],bk[j]],'url(#hL)',.9);
    pline(prof,t+1,G);
    const m1=seg(u,.04,.36), m2=seg(u,.40,.70), m3=seg(u,.74,.92);
    const ph=u<.38?1:u<.72?2:u<.94?3:0;
    if(ph===1){ // genişlik 220
      const open=40*(1-ease(clamp(m1/.6,0,1))), drop=60*(1-ease(clamp(m1/.35,0,1)));
      const rd=m1<.6?num(220+open/K,2):num(220.2,2);
      caliperH(X0-t/2,X0+W+t/2+open,PY-H-34-drop,rd);
    }
    if(ph===2){ // yükseklik 110
      const open=36*(1-ease(clamp(m2/.6,0,1)));
      caliperV(PY-H-t/2-open,PY,X0+W+48,m2<.6?num(110+open/K,2):num(110.1,2));
    }
    if(ph===3){ // açı: dijital açıölçer, taban altı ve flanş dış yüzü
      const c=[X0+W,PY];
      poly([[c[0]+4,c[1]-4],[c[0]+12,c[1]-4],[c[0]+12,c[1]-H+10],[c[0]+4,c[1]-H+10]],'url(#hM)',1.2);
      poly([[c[0]+4,c[1]+2],[c[0]+120,c[1]+2],[c[0]+120,c[1]+10],[c[0]+4,c[1]+10]],'url(#hM)',1.2);
      el('circle',{cx:c[0]+8,cy:c[1]+6,r:9,fill:'#FBFAF7',stroke:G,'stroke-width':'1.2'},ink);
      el('rect',{x:c[0]+24,y:c[1]-40,width:70,height:22,rx:2,fill:'#BFCDB4',stroke:G,'stroke-width':'1'},fx);
      el('text',{x:c[0]+90,y:c[1]-24,'text-anchor':'end',fill:'#1F2B1B','font-size':'14','font-weight':'700','font-family':'ui-monospace,Consolas,monospace'},fx).textContent=m3<.5?num(88+m3*4,1)+'°':'90°10′';
    }
    // kontrol formu (el yazısı)
    const fx0=470, fy0=40, rowH=34;
    el('rect',{x:fx0-12,y:fy0-26,width:170,height:210,fill:'#FBFAF7',stroke:G,'stroke-width':'1'},fx);
    text(fx0,fy0-8,T('sim.chk.title'),{fill:G,'font-size':'13','font-weight':'700'});
    text(fx0,fy0+14,T('sim.chk.nom'),{'font-size':'11'});text(fx0+92,fy0+14,T('sim.chk.meas'),{'font-size':'11'});
    line(fx0-12,fy0+22,fx0+158,fy0+22,1,G,fx);
    const rows=[['220 ± '+num(.5,1),num(220.2,1),m1>=1],['110 ± '+num(.3,1),num(110.1,1),m2>=1],['90° ± 0°30′','90°10′',m3>=1]];
    rows.forEach((r,j)=>{const y=fy0+48+j*rowH; line(fx0-12,y+12,fx0+158,y+12,.5,G2,fx);
      text(fx0,y,r[0],{fill:G,'font-size':'12.5'});
      if(r[2]){text(fx0+90,y,r[1],{fill:BLUE,'font-size':'19','font-family':"'Caveat','Segoe Print','Bradley Hand',cursive"});
        path(`M${fx0+140} ${y-6}l4 5 9-11`,'none',2,'#2E7D4F',fx);}
    });
    if(u>.94){text(fx0,fy0+165,T('sim.chk.ok'),{fill:'#2E7D4F','font-size':'20','font-family':"'Caveat','Segoe Print',cursive"});}
    text(14,PY+52,T('sim.chk.plate'));
    return u>.94?T('sim.chk.ok'):T('sim.chk.run');
  }

  /* ---------- oynatma ---------- */
  const DRAW=[drawCut,drawBend,drawWeld,drawCheck];
  function setStageUI(){
    tabs.forEach((b,i)=>b.setAttribute('aria-selected',String(i===stage)));
    cells.forEach((c,i)=>{c.querySelector('small').textContent=T(`sim.s${stage+1}.k${i+1}`);c.querySelector('b').textContent=T(`sim.s${stage+1}.v${i+1}`);});
    noteEl.textContent=T(`sim.s${stage+1}.note`);
  }
  let lastU=0;
  function render(u){lastU=u;reset();DRAW[stage](u);
    tabs.forEach((b,i)=>{const bar=b.querySelector('.bar');if(bar)bar.style.width=(i===stage&&playing?u*100:0)+'%';});}
  function go(i){stage=i;sparks=[];prevHX=null;window.__gx=null;t0=performance.now();setStageUI();render(frozenU!==null?frozenU:0);}
  tabs.forEach((b,i)=>b.addEventListener('click',()=>go(i)));
  playBtn.addEventListener('click',()=>{playing=!playing;frozenU=playing?null:lastU;
    playBtn.textContent=T(playing?'sim.pause':'sim.play');
    if(playing){t0=performance.now()-lastU*DUR[stage];lastNow=performance.now();requestAnimationFrame(loop);}});
  let visible=true;
  if('IntersectionObserver' in window) new IntersectionObserver(es=>{visible=es[0].isIntersecting;}).observe(svg);
  function loop(now){
    if(!playing) return;
    if(!visible){t0+=now-lastNow;lastNow=now;requestAnimationFrame(loop);return;}
    dt=Math.min(.05,(now-lastNow)/1000);lastNow=now;
    if(now-lastSeed>125){lastSeed=now;turb.setAttribute('seed',String(1+Math.floor(Math.random()*4)));} // el çizimi titreşimi
    let u=(now-t0)/DUR[stage];
    if(u>1.12){stage=(stage+1)%4;t0=now;u=0;sparks=[];prevHX=null;window.__gx=null;setStageUI();}
    render(clamp(u,0,1));
    requestAnimationFrame(loop);
  }
  window.MI_SIM_REFRESH=()=>{setStageUI();playBtn.textContent=T(playing?'sim.pause':'sim.play');render(lastU);};
  window.MI_SIM_SET=(s,u)=>{playing=false;stage=s;setStageUI();sparks=[];window.__gx=null;for(let k=0;k<20;k++){dt=.016;render(u);}}; // test için
  setStageUI();playBtn.textContent=T(playing?'sim.pause':'sim.play');
  if(playing)requestAnimationFrame(loop);else render(1);
})();
