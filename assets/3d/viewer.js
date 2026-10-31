/* Metal Intellectual – makaslı tabla 3B görüntüleyici */
window.MI_V3D = function (root) {
  const T = window.MI_T || (k => '');
  const stage = root.querySelector('.v3d-stage');
  const msg = root.querySelector('.v3d-msg');
  const btnEx = root.querySelector('[data-act="ex"]');
  const btnRe = root.querySelector('[data-act="re"]');
  const chips = [...root.querySelectorAll('.v3d-legend button')];
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { root.classList.add('v3d-fail'); return; }
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(DPR);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  stage.prepend(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');

  const scene = new THREE.Scene();
  renderer.setClearColor(0x000000, 0);
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new THREE.RoomEnvironment(), 0.04).texture;

  const cam = new THREE.PerspectiveCamera(32, 1, 0.05, 50);
  const ctl = new THREE.OrbitControls(cam, renderer.domElement);
  ctl.enableDamping = true; ctl.dampingFactor = 0.08;
  ctl.enablePan = false; ctl.minDistance = 2.2; ctl.maxDistance = 9;
  ctl.maxPolarAngle = Math.PI * 0.49; ctl.minPolarAngle = Math.PI * 0.12;
  ctl.autoRotate = !matchMedia('(prefers-reduced-motion: reduce)').matches; ctl.autoRotateSpeed = 0.6;

  const key = new THREE.DirectionalLight(0xfff1dc, 3.2);
  key.position.set(-3, 5, 3); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -2.5, right: 2.5, top: 2.5, bottom: -2.5, near: 0.5, far: 15 });
  key.shadow.bias = -0.0004; key.shadow.radius = 4;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xc8d8ff, 1.4); rim.position.set(2.5, 3, -4); scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xdfe6ee, 0x0b0c0e, 0.35));

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.42 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  // baklava desenli sac için kabartma dokusu
  function tread() {
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
    x.fillStyle = '#000'; x.fillRect(0, 0, 128, 128);
    const lens = (cx, cy, a) => { x.save(); x.translate(cx, cy); x.rotate(a); const g = x.createLinearGradient(-22, 0, 22, 0); g.addColorStop(0, '#000'); g.addColorStop(0.5, '#fff'); g.addColorStop(1, '#000'); x.fillStyle = g; x.beginPath(); x.ellipse(0, 0, 22, 5, 0, 0, Math.PI * 2); x.fill(); x.restore(); };
    lens(32, 32, Math.PI / 4); lens(96, 96, Math.PI / 4); lens(96, 32, -Math.PI / 4); lens(32, 96, -Math.PI / 4);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(28, 16); return t;
  }
  const TREAD = tread();
  const groups = { platform: [], arms: [], hyd: [], base: [] };
  const OFF = { platform: new THREE.Vector3(0, 0.7, 0), arms: new THREE.Vector3(0, 0.32, 0), hyd: new THREE.Vector3(0, 0.2, 0.95), base: new THREE.Vector3(0, 0, 0) };
  let exploded = false, ex = 0, exT = 0;
  const HL = new THREE.Color(0xc29a55);

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
  }
  function home(anim) {
    const target = new THREE.Vector3(0, 0.55, 0), pos = new THREE.Vector3(3.6, 2.15, 4.3);
    if (!anim) { cam.position.copy(pos); ctl.target.copy(target); ctl.update(); return; }
    const p0 = cam.position.clone(), t0 = ctl.target.clone(); let k = 0;
    const step = () => { k = Math.min(1, k + 0.04); const e = k * k * (3 - 2 * k); cam.position.lerpVectors(p0, pos, e); ctl.target.lerpVectors(t0, target, e); ctl.update(); if (k < 1) requestAnimationFrame(step); };
    step();
  }
  resize(); home(false);
  new ResizeObserver(resize).observe(stage);

  msg.textContent = T('v3.load') || 'Model yükleniyor…';
  new THREE.GLTFLoader().load('assets/3d/scissor.glb', g => {
    const m = g.scene;
    m.traverse(o => {
      if (!o.isMesh) return;
      o.castShadow = true; o.receiveShadow = true;
      o.material = o.material.clone();
      o.material.envMapIntensity = 1.0;
      const mn = (o.material.name || '');
      if (mn.startsWith('checker')) { o.material.bumpMap = TREAD; o.material.bumpScale = 0.012; o.material.roughness = 0.38; o.material.metalness = 1; o.material.color.setRGB(0.6, 0.61, 0.62); }
      else if (mn.startsWith('coat_dark')) { o.material.roughness = 0.5; o.material.metalness = 0.15; }
      else if (mn.startsWith('chrome')) { o.material.roughness = 0.08; o.material.metalness = 1; o.material.envMapIntensity = 1.4; }
      const nm = (o.name || (o.parent && o.parent.name) || '');
      const gk = Object.keys(groups).find(k => nm.startsWith(k + '__')) || 'arms';
      o.userData.home = o.position.clone(); o.userData.g = gk;
      o.userData.em = o.material.emissive ? o.material.emissive.clone() : null;
      groups[gk].push(o);
    });
    scene.add(m);
    msg.textContent = ''; root.classList.add('v3d-ready');
  }, ev => {
    if (ev.total) msg.textContent = (T('v3.load') || 'Model yükleniyor…') + ' ' + Math.round(ev.loaded / ev.total * 100) + '%';
  }, () => { root.classList.add('v3d-fail'); });

  function highlight(gk) {
    Object.entries(groups).forEach(([k, arr]) => arr.forEach(o => {
      if (!o.material.emissive) return;
      if (k === gk) o.material.emissive.copy(HL).multiplyScalar(0.28); else o.material.emissive.copy(o.userData.em);
    }));
  }
  chips.forEach(b => {
    const gk = b.dataset.g;
    b.addEventListener('mouseenter', () => highlight(gk)); b.addEventListener('focus', () => highlight(gk));
    b.addEventListener('mouseleave', () => highlight(null)); b.addEventListener('blur', () => highlight(null));
    b.addEventListener('click', () => { if (!exploded) toggle(); highlight(gk); });
  });
  function toggle() {
    exploded = !exploded; exT = exploded ? 1 : 0;
    btnEx.setAttribute('aria-pressed', String(exploded));
    btnEx.querySelector('span').textContent = exploded ? (T('v3.as') || 'Birleştir') : (T('v3.ex') || 'Parçalarına ayır');
    ctl.autoRotate = false;
  }
  btnEx.addEventListener('click', toggle);
  btnRe.addEventListener('click', () => { if (exploded) toggle(); highlight(null); home(true); });
  renderer.domElement.addEventListener('pointerdown', () => { ctl.autoRotate = false; root.classList.add('v3d-touched'); });
  window.addEventListener('mi-lang', () => { btnEx.querySelector('span').textContent = exploded ? T('v3.as') : T('v3.ex'); });

  let vis = true;
  new IntersectionObserver(es => { vis = es[0].isIntersecting; if (vis) loop(); }).observe(stage);
  let raf = 0;
  function loop() {
    cancelAnimationFrame(raf);
    if (!vis) return;
    raf = requestAnimationFrame(loop);
    ex += (exT - ex) * 0.09;
    if (Math.abs(exT - ex) > 0.0005 || ex > 0.0005) {
      const e = ex * ex * (3 - 2 * ex);
      Object.entries(groups).forEach(([k, arr]) => arr.forEach(o => {
        o.position.copy(o.userData.home);
        if (o.parent && o.parent.type !== 'Scene' && o.parent.parent) {
          const v = OFF[k].clone().multiplyScalar(e); o.parent.worldToLocal(v.add(o.parent.getWorldPosition(new THREE.Vector3())));
          o.position.add(v);
        } else o.position.addScaledVector(OFF[k], e);
      }));
    }
    ctl.update();
    renderer.render(scene, cam);
  }
  loop();
};
