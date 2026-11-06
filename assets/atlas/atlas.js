(() => {
  const map = document.getElementById('prehistoric-atlas');
  if (!map) return;
  const stops = JSON.parse(map.querySelector('script[type="application/json"]').textContent);
  const panel = map.querySelector('.atlas-sticky');
  const info = map.querySelector('.atlas-info');
  const buttons = [...map.querySelectorAll('[data-select]')];
  const markers = [...map.querySelectorAll('[data-stop]')];
  const topbar = document.querySelector('.topbar');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const smooth = window.HemuduMotion.smooth;
  const last = stops.length - 1;
  const length = last + 4;
  const clamp = value => Math.min(1, Math.max(0, value));

  // Both texts share one column. Their measured heights let the layout open
  // gradually even when the final entry wraps into many lines on a phone.
  const earlier = document.createElement('div');
  earlier.className = 'atlas-entry';
  earlier.append(...info.childNodes);
  const ending = earlier.cloneNode(true);
  ending.classList.add('atlas-ending');
  const original = stops[last];
  function fill(layer, stop) {
    layer.querySelector('.atlas-age').textContent = stop.age;
    layer.querySelector('.atlas-name').textContent = stop.name;
    layer.querySelector('.atlas-place').textContent = stop.location + ' · ' + stop.landmark;
    layer.querySelector('.atlas-note').textContent = stop.note;
  }
  fill(ending, original);
  const note = ending.querySelector('.atlas-note');
  const paragraphs = original.note.split(/\n\s*\n/).map(text => {
    const span = document.createElement('span');
    span.className = 'atlas-paragraph';
    span.textContent = text;
    return span;
  });
  note.replaceChildren();
  paragraphs.forEach((element, i) => {
    if (i) note.append('\n\n');
    note.append(element);
  });
  info.append(earlier, ending);
  let selected = -1, pending = false;

  function select(index) {
    if (index === selected) return;
    if (index < last) {
      fill(earlier, stops[index]);
      if (selected >= 0 && selected < last) window.HemuduMotion.revealChange(earlier);
    } else {
      // A direct jump to Hemudu can skip the Shangshan frame entirely.
      fill(earlier, stops[last - 1]);
    }
    selected = index;
    markers.forEach((node, i) => {
      node.classList.toggle('seen', i <= index);
      node.classList.toggle('current', i === index);
    });
    buttons.forEach((node, i) => node.setAttribute('aria-pressed', String(i === index)));
    earlier.setAttribute('aria-hidden', String(index === last));
    ending.setAttribute('aria-hidden', String(index !== last));
  }

  function geometry() {
    const nav = topbar.getBoundingClientRect().height;
    const rect = map.getBoundingClientRect();
    return {nav, top:rect.top, distance:Math.max(1, rect.height - innerHeight + nav)};
  }

  function render() {
    pending = false;
    const {nav, top, distance} = geometry();
    const stage = Math.max(0, Math.min(length, (nav - top) / distance * length));
    const index = Math.min(last, Math.floor(stage));
    select(index);
    map.classList.toggle('atlas-arrival', stage >= last - .45);
    const t = stage - last;
    const still = reduced.matches;
    const blend = still ? Number(index === last) : smooth((t + .45) / 2.15);
    map.style.setProperty('--atlas-nav', nav + 'px');
    map.style.setProperty('--map-column', (1.9 - .94 * blend) + 'fr');
    map.style.setProperty('--map-scale', 1 - .24 * blend);
    map.style.setProperty('--row-lift', (still ? 0 : -14 * blend) + 'px');
    map.style.setProperty('--row-drop', (still ? 0 : 14 * blend) + 'px');
    earlier.style.opacity = still ? Number(index !== last) : 1 - smooth((t + .42) / .42);
    ending.style.opacity = still ? Number(index === last) : smooth(t / .45);
    paragraphs.forEach((paragraph, i) => {
      const amount = still ? 1 : smooth((t - .12 - i * .92) / .86);
      paragraph.style.opacity = amount;
      paragraph.style.translate = '0 ' + (10 * (1 - amount)) + 'px';
    });

    const mix = still ? Number(index === last) : smooth((t + .4) / 1.3);
    if (mix > 0 && mix < 1) {
      info.style.height = (earlier.offsetHeight * (1 - mix) + ending.offsetHeight * mix) + 'px';
    } else {
      info.style.height = '';
    }
    info.classList.toggle('ending-sized', mix === 1);
    const excess = Math.max(0, panel.offsetHeight + nav - innerHeight);
    let pan = smooth((stage - index - .25) / .65);
    if (stage >= last - .45) {
      // Carry the previous camera offset through the handoff on short screens.
      const carry = smooth((stage - (last - 1) - .25) / .65) * (1 - smooth((t + .45) / .65));
      pan = Math.max(carry, smooth((t - .5) / 2.65));
    }
    panel.style.setProperty('--atlas-pan', (excess * pan) + 'px');
  }
  function queue() {
    if (!pending) { pending = true; requestAnimationFrame(render); }
  }
  buttons.forEach((button, i) => button.addEventListener('click', () => {
    const {nav, top, distance} = geometry();
    const destination = i === last ? last + 3.25 : i + .25;
    scrollBy({top:top - nav + distance * destination / length, behavior:'instant'});
    render();
  }));
  map.style.setProperty('--atlas-steps', length);
  map.classList.add('ready');
  addEventListener('scroll', queue, {passive:true});
  addEventListener('resize', queue);
  addEventListener('pageshow', queue);
  reduced.addEventListener('change', queue);
  document.fonts?.ready.then(queue);
  render();
})();
