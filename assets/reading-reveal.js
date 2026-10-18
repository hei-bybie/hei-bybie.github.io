
(() => {
  'use strict';
  const targets = Array.from(document.querySelectorAll([
    '#story .feature-heading',
    '#story .feature-cover-copy > p',
    '#story .feature-cover-copy > h2',
    '#story .essay-side',
    '#story .essay-body > h3',
    '#story .essay-body > p',
    '#story .article-takeaway',
    '#story .rice-timeline',
    '#story .research-comparison',
    '.artifact-reading-intro > div',
    '.artifact-reading-intro > p',
    '.artifact-essay-side',
    '.artifact-essay-body > h4',
    '.artifact-essay-body > p',
    '.artifact-essay-source'
  ].join(',')));
  if (!targets.length || !window.requestAnimationFrame || !window.matchMedia) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const states = targets.map(node => ({ node, offset: 0 }));
  let frame = 0;
  let enabled = true;
  const viewportHeight = () => window.innerHeight || document.documentElement.clientHeight;
  const paint = (state, progress) => {
    const offset = 22 * (1 - progress);
    state.node.style.setProperty('--reading-opacity', String(progress));
    state.node.style.setProperty('--reading-offset', `${offset}px`);
    state.offset = offset;
  };
  const stop = () => {
    enabled = false;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    window.removeEventListener('hashchange', schedule);
    window.removeEventListener('pageshow', schedule);
    document.removeEventListener('focusin', schedule);
    document.removeEventListener('focusout', schedule);
    if (motion.removeEventListener) motion.removeEventListener('change', onMotionChange);
    else if (motion.removeListener) motion.removeListener(onMotionChange);
  };
  const revealAll = () => {
    states.forEach(state => {
      state.node.classList.remove('reading-reveal');
      state.node.style.removeProperty('--reading-opacity');
      state.node.style.removeProperty('--reading-offset');
      state.offset = 0;
    });
    stop();
  };
  const update = () => {
    frame = 0;
    if (!enabled) return;
    try {
      const height = viewportHeight();
      const start = height * .96;
      const end = height * .72;
      // Read every position before writing styles. Subtract our last translation
      // so repeated updates at the same scroll position never drift.
      const positions = states.map(state => state.node.getBoundingClientRect().top - state.offset);
      states.forEach((state, index) => {
        const focused = state.node.contains(document.activeElement);
        const progress = motion.matches || focused ? 1 : Math.max(0, Math.min(1, (start - positions[index]) / (start - end)));
        // A shared scroll position gives the same appearance in both directions.
        paint(state, progress * progress * (3 - 2 * progress));
      });
    } catch (_) { revealAll(); }
  };
  function schedule() {
    if (enabled && !frame) frame = window.requestAnimationFrame(update);
  }
  function onMotionChange() {
    // Media queries remove translation immediately; reset the matching baseline.
    states.forEach(state => paint(state, 1));
    schedule();
  }
  try {
    targets.forEach(node => node.classList.add('reading-reveal'));
    update();
    if (!enabled) return;
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('hashchange', schedule);
    window.addEventListener('pageshow', schedule);
    document.addEventListener('focusin', schedule);
    document.addEventListener('focusout', schedule);
    if (motion.addEventListener) motion.addEventListener('change', onMotionChange);
    else if (motion.addListener) motion.addListener(onMotionChange);
  } catch (_) {
    revealAll();
  }
})();
