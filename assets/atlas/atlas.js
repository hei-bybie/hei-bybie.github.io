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
  const compact = matchMedia('(max-width:720px), (max-height:540px), (pointer:coarse) and (max-width:1100px)');
  let stableWidth = innerWidth;
  let stableHeight = innerHeight;
  const flow = document.createElement('div');
  flow.className = 'atlas-flow';
  const flowEntries = stops.map((stop, i) => {
    const article = document.createElement('article');
    article.id = 'atlas-stop-' + i;
    article.className = 'atlas-flow-entry';
    article.tabIndex = -1;
    const age = document.createElement('p');
    age.className = 'atlas-age';
    age.textContent = stop.age;
    const name = document.createElement('h3');
    name.className = 'atlas-name';
    name.textContent = stop.name;
    const place = document.createElement('p');
    place.className = 'atlas-place';
    place.textContent = stop.location + ' · ' + stop.landmark;
    article.append(age, name, place);
    stop.note.split(/\n\s*\n/).forEach(text => {
      const paragraph = document.createElement('p');
      paragraph.className = 'atlas-note';
      paragraph.textContent = text;
      article.append(paragraph);
    });
    flow.append(article);
    return article;
  });
  info.after(flow);

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

  function renderFlow() {
    const nav = topbar.getBoundingClientRect().height;
    const canvas = map.querySelector('.atlas-canvas');
    // Only a width/orientation change resets sizing. Safari toolbar animation
    // can emit resize events repeatedly while the user is simply scrolling.
    if (Math.abs(innerWidth - stableWidth) > 1) {
      stableWidth = innerWidth;
      stableHeight = innerHeight;
    }
    document.documentElement.style.setProperty('--atlas-stable-height', stableHeight + 'px');
    const canvasHeight = Math.max(100, Math.min(200, stableHeight * .25));
    map.style.setProperty('--atlas-map-height', canvasHeight + 'px');
    map.style.setProperty('--atlas-nav', nav + 'px');
    const focusLine = nav + canvasHeight + 45;
    const tops = flowEntries.map(node => node.getBoundingClientRect().top);
    let current = 0;
    tops.forEach((top, i) => { if (top <= focusLine) current = i; });
    select(current);
    const blend = reduced.matches ? 0 : smooth((focusLine + 140 - tops[last]) / 200);
    map.style.setProperty('--map-scale', 1 - .24 * blend);
    map.style.setProperty('--row-lift', (-14 * blend) + 'px');
    map.style.setProperty('--row-drop', (14 * blend) + 'px');
    map.classList.toggle('atlas-arrival', blend > 0);
    flowEntries.forEach(node => node.style.scrollMarginTop = (nav + canvasHeight + 18) + 'px');
    flowEntries[last].querySelectorAll('.atlas-note').forEach(node => {
      const top = node.getBoundingClientRect().top;
      const progress = reduced.matches ? 1 : smooth((stableHeight - 24 - top) / 100);
      node.style.opacity = progress;
    });
  }

  function render() {
    pending = false;
    map.classList.toggle('atlas-mobile', compact.matches);
    document.body.classList.toggle('atlas-mobile-view', compact.matches);
    if (compact.matches) { renderFlow(); return; }
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
    if (compact.matches) {
      const inset = topbar.offsetHeight + map.querySelector('.atlas-canvas').offsetHeight + 18;
      scrollBy({top:flowEntries[i].getBoundingClientRect().top - inset, behavior:'instant'});
      render();
      return;
    }
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
  compact.addEventListener('change', queue);
  document.fonts?.ready.then(queue);
  render();
})();
