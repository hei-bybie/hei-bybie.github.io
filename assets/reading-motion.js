(() => {
  const reduce=matchMedia('(prefers-reduced-motion:reduce)');
  const smooth=value=>{
    const t=Math.max(0,Math.min(1,value));
    return t*t*(3-2*t);
  };
  const revealChange=node=>{
    if(reduce.matches || !node.animate)return;
    const css=getComputedStyle(node);
    node.getAnimations().filter(a=>a.id==='stage-reveal').forEach(a=>a.cancel());
    const effect=node.animate([{opacity:.25,translate:'0 6px'},{opacity:1,translate:'0 0'}],{
      duration:parseFloat(css.getPropertyValue('--motion-time'))||320,
      easing:css.getPropertyValue('--motion-curve').trim()||'ease-in-out'
    });
    effect.id='stage-reveal';
  };
  window.HemuduMotion=Object.freeze({smooth,revealChange});
  const bar=document.querySelector('.topbar');
  const measure=()=>document.documentElement.style.setProperty('--nav-height',bar.getBoundingClientRect().height+'px');
  measure();
  new ResizeObserver(measure).observe(bar);
})();
