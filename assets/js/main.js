(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // nav: shadow on scroll, mobile menu, theme toggle
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
  $('#burger')?.addEventListener('click', (e) => {
    const open = $('#links').classList.toggle('open');
    e.currentTarget.setAttribute('aria-expanded', open);
  });
  $('#theme')?.addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('sl-theme', next); } catch (e) {}
  });

  // reveal on scroll
  const items = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach((el) => io.observe(el));
  } else items.forEach((el) => el.classList.add('in'));

  // count-up numbers
  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count, suffix = el.dataset.suffix || '';
    if (reduce || !('IntersectionObserver' in window) || end === 0) { el.textContent = end + suffix; return; }
    el.textContent = '0' + suffix;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now(), dur = 1400;
      const tick = (t) => { const p = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 3))); el.textContent = v + suffix; if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
  });

  // typed terminal
  const typed = $('#typed');
  if (typed) {
    const text = (typed.dataset.lines || '').replace(/&#10;/g, '\n');
    if (reduce) typed.textContent = text;
    else {
      let i = 0;
      const step = () => {
        typed.textContent = text.slice(0, ++i);
        if (i < text.length) setTimeout(step, text[i - 1] === '\n' ? 420 : 26 + Math.random() * 38);
      };
      setTimeout(step, 900);
    }
  }

  // copy buttons (hero terminal + code blocks)
  const attachCopy = (btn, getText) => btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(getText()); btn.classList.add('done'); setTimeout(() => btn.classList.remove('done'), 1400); } catch (e) {}
  });
  $$('button.copy[data-copy]').forEach((b) => attachCopy(b, () => b.dataset.copy));
  $$('.prose pre').forEach((pre) => {
    const b = document.createElement('button');
    b.className = 'copy'; b.setAttribute('aria-label', 'Copy code'); b.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>';
    pre.appendChild(b); attachCopy(b, () => pre.querySelector('code')?.innerText ?? pre.innerText);
  });

  // feature-card glow follows the pointer
  $$('.card.glow').forEach((c) => c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px'); }));

  // 3D tilt on the screenshots
  if (!reduce && matchMedia('(hover: hover)').matches) $$('.tilt').forEach((el) => {
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `rotateY(${x * 5}deg) rotateX(${-y * 4}deg) translateZ(0)`; });
    el.addEventListener('pointerleave', () => (el.style.transform = ''));
  });

  // tabs (install page)
  $$('[data-tabs]').forEach((box) => {
    const list = $('.tab-list', box), panels = $$('.tab-panel', box);
    panels.forEach((p, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.role = 'tab'; b.textContent = p.dataset.title;
      b.addEventListener('click', () => select(i)); list.appendChild(b);
    });
    const select = (i) => { $$('button', list).forEach((b, j) => b.setAttribute('aria-selected', j === i)); panels.forEach((p, j) => p.classList.toggle('on', j === i)); };
    const ua = navigator.userAgent; const want = /Mac/.test(ua) ? 'macOS' : /Win/.test(ua) ? 'Windows' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : 'Linux';
    const idx = panels.findIndex((p) => p.dataset.title.includes(want));
    select(idx >= 0 && box.hasAttribute('data-os') ? idx : 0);
  });

  // docs: highlight the section in view
  const toc = $$('.docs-toc nav a');
  if (toc.length && 'IntersectionObserver' in window) {
    const map = new Map(toc.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { toc.forEach((a) => a.classList.remove('on')); map.get(e.target.id)?.classList.add('on'); } }), { rootMargin: '-90px 0px -70% 0px' });
    $$('.prose h2[id], .prose h3[id]').forEach((h) => io.observe(h));
  }
})();
