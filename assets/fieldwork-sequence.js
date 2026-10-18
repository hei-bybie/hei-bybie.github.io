
(() => {
  'use strict';
  const scene = document.getElementById('fieldwork-bridge');
  const canvas = document.getElementById('fieldwork-sequence');
  const config = window.HEMUDU_CONFIG?.sequence;
  if (!scene || !canvas || !config || !window.requestAnimationFrame || !window.matchMedia) return;
  canvas.width=config.width;canvas.height=config.height;
  const context = canvas.getContext('2d', {alpha:false});
  if (!context) return;
  const frames = Array.from({length:config.frameCount},(_,i)=>config.directory+'/frame-'+String(i+1).padStart(4,'0')+'.webp');
  if (!Array.isArray(frames) || frames.length < 2) return;
  const pin = scene.querySelector('.bridge-pin');
  const intro = scene.querySelector('.bridge-copy');
  const outro = scene.querySelector('.bridge-endcopy');
  const progressBar = scene.querySelector('.bridge-progress > span');
  const hint = scene.querySelector('.bridge-direction');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const cache = new Map();
  const loading = new Map();
  const failed = new Set();
  const MAX_DECODED = 10;
  const MAX_LOADING = 3;
  let queue = [], desired = 0, painted = -1, lastDesired = 0, tick = 0;
  let disposed = false;
  const clamp = value => Math.max(0, Math.min(1, value));
  function trimCache() {
    while (cache.size > MAX_DECODED) {
      const key = cache.keys().next().value;
      if (key === desired) { const value=cache.get(key);cache.delete(key);cache.set(key,value);continue; }
      cache.delete(key);
    }
  }
  function draw(index) {
    const image = cache.get(index);
    if (!image || index === painted) return;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    painted = index;
    cache.delete(index); cache.set(index, image);
    scene.classList.add('is-frame-painted');
  }
  function drawNearest() {
    if (cache.has(desired)) { draw(desired); return; }
    let best = -1, distance = Infinity;
    cache.forEach((image,index) => {
      const d = Math.abs(index - desired);
      if (d < distance) { best=index;distance=d; }
    });
    // While a new frame decodes, retain the current image unless a closer neighbour is ready.
    if (best >= 0 && (painted < 0 || distance < Math.abs(painted - desired))) draw(best);
  }
  function loadQueued() {
    if (disposed || reducedMotion.matches) return;
    while (loading.size < MAX_LOADING && queue.length) {
      const index = queue.shift();
      if (cache.has(index) || loading.has(index) || failed.has(index)) continue;
      const image = new Image();
      loading.set(index,image);
      image.decoding='async';
      image.onload = () => {
        loading.delete(index);
        if (disposed) return;
        cache.set(index,image);trimCache();
        if (!reducedMotion.matches) drawNearest();
        loadQueued();
      };
      image.onerror = () => {
        loading.delete(index);failed.add(index);
        if (index === 0 && !cache.size) {
          disposed=true;scene.classList.remove('has-scroll-sequence');
          hint.textContent='向下继续，走进实地考察';
        } else loadQueued();
      };
      image.src=frames[index];
    }
  }
  function requestFrame(index, near) {
    const direction = index >= lastDesired ? 1 : -1;
    lastDesired=index; desired=index;
    const wanted = near ? [index,index+direction,index-direction,index+2*direction,index-2*direction,index+3*direction,index+4*direction] : [index];
    queue = [...new Set(wanted)].filter(i=>i>=0 && i<frames.length && !cache.has(i) && !loading.has(i) && !failed.has(i));
    drawNearest();loadQueued();
  }
  function update() {
    tick=0;
    if (disposed || reducedMotion.matches) return;
    const box=scene.getBoundingClientRect();
    const stickyTop=parseFloat(window.getComputedStyle(pin).top) || 0;
    const travel=Math.max(1,scene.offsetHeight-pin.offsetHeight);
    const progress=clamp((stickyTop-box.top)/travel);
    const index=Math.round(progress*(frames.length-1));
    const near=box.top < window.innerHeight*2 && box.bottom > -window.innerHeight;
    requestFrame(index,near);
    const introOpacity=1-clamp((progress-.14)/.25);
    const outroOpacity=clamp((progress-.68)/.2);
    intro.style.opacity=String(introOpacity);
    intro.style.transform=`translateY(calc(-50% - ${(1-introOpacity)*20}px))`;
    outro.style.opacity=String(outroOpacity);
    outro.style.transform=`translateY(calc(-50% + ${(1-outroOpacity)*24}px))`;
    progressBar.style.transform=`scaleX(${progress})`;
    hint.textContent=progress > .95 ? '继续向下，走进实地考察' : '向下展开视野 · 向上回看';
  }
  function schedule() {
    if (!tick && !disposed && !reducedMotion.matches) tick=window.requestAnimationFrame(update);
  }
  function applyMotionPreference() {
    scene.classList.toggle('has-scroll-sequence',!reducedMotion.matches && !disposed);
    if (reducedMotion.matches) {
      queue=[];
      intro.style.opacity='1';intro.style.transform='translateY(-50%)';
      outro.style.opacity='0';
    } else schedule();
  }
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  window.addEventListener('pageshow',schedule);
  window.addEventListener('hashchange',schedule);
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change',applyMotionPreference);
  else if (reducedMotion.addListener) reducedMotion.addListener(applyMotionPreference);
  applyMotionPreference();
})();

