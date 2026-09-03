(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Slow, pointer-responsive color field inspired by the reference site's fluid material.
  const canvas = document.querySelector('#aurora-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d', { alpha: false });
    const palette = ['#ef9a80', '#e8bf67', '#6eb8bf', '#aaa0d9', '#efb7ad'];
    const blobs = palette.map((color, index) => ({
      color,
      phase: index * 1.37,
      radius: .34 + index * .018,
      speed: .00007 + index * .000012,
      x: .18 + (index % 3) * .31,
      y: .22 + (index % 2) * .52,
    }));
    let width = 1;
    let height = 1;
    let mx = .5;
    let my = .5;
    let pointerPower = 0;
    let animationId = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 1.45);
      width = Math.max(1, Math.round(rect.width * dpr));
      height = Math.max(1, Math.round(rect.height * dpr));
      canvas.width = width;
      canvas.height = height;
    };

    const render = (time = 1700) => {
      ctx.fillStyle = '#d59b88';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
      blobs.forEach((blob, index) => {
        const driftX = Math.sin(time * blob.speed + blob.phase) * .2;
        const driftY = Math.cos(time * blob.speed * 1.17 + blob.phase) * .17;
        const pull = pointerPower * (.05 + index * .008);
        const x = (blob.x + driftX + (mx - .5) * pull) * width;
        const y = (blob.y + driftY + (my - .5) * pull) * height;
        const r = Math.max(width, height) * blob.radius;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, blob.color + 'ee');
        gradient.addColorStop(.52, blob.color + 'ad');
        gradient.addColorStop(1, blob.color + '00');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      });
      ctx.globalCompositeOperation = 'source-over';
      const wash = ctx.createLinearGradient(0, 0, width, height);
      wash.addColorStop(0, 'rgba(255,255,255,.08)');
      wash.addColorStop(.55, 'rgba(255,235,210,.03)');
      wash.addColorStop(1, 'rgba(45,25,45,.08)');
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, width, height);
      if (!reduceMotion) animationId = requestAnimationFrame(render);
    };

    new ResizeObserver(resize).observe(canvas);
    resize();
    canvas.closest('.hero')?.addEventListener('pointermove', (event) => {
      const rect = canvas.getBoundingClientRect();
      mx = (event.clientX - rect.left) / rect.width;
      my = (event.clientY - rect.top) / rect.height;
      pointerPower = Math.min(1, pointerPower + .1);
    }, { passive: true });
    canvas.closest('.hero')?.addEventListener('pointerleave', () => { pointerPower = 0; });
    render();
    addEventListener('pagehide', () => cancelAnimationFrame(animationId), { once: true });
  }

  // Glass bubble cursor with spring-like movement and contextual labels.
  const lens = document.querySelector('.cursor-lens');
  if (lens && finePointer) {
    let targetX = -100;
    let targetY = -100;
    let x = -100;
    let y = -100;
    let frame = 0;
    const label = lens.querySelector('span');
    const move = () => {
      x += (targetX - x) * .19;
      y += (targetY - y) * .19;
      lens.style.left = `${x}px`;
      lens.style.top = `${y}px`;
      frame = requestAnimationFrame(move);
    };
    addEventListener('pointermove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      lens.classList.add('is-on');
      const target = event.target.closest('.interactive, a, button');
      lens.classList.toggle('is-target', Boolean(target));
      label.dataset.label = target?.dataset.cursor || (target?.matches('a') ? 'Open' : '');
      lens.style.opacity = '';
    }, { passive: true });
    addEventListener('pointerleave', () => lens.classList.remove('is-on'));
    move();
    addEventListener('pagehide', () => cancelAnimationFrame(frame), { once: true });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 55}ms`;
    observer.observe(element);
  });

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count || 0);
      if (reduceMotion) {
        element.textContent = target.toLocaleString('en-US');
      } else {
        const start = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - start) / 900, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          element.textContent = Math.round(target * eased).toLocaleString('en-US');
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
      countObserver.unobserve(element);
    });
  }, { threshold: .65 });
  document.querySelectorAll('[data-count]').forEach((element) => countObserver.observe(element));

  const progress = document.querySelector('.scroll-progress i');
  const menuButton = document.querySelector('.menu-toggle');
  menuButton?.addEventListener('click', () => {
    const nav = menuButton.closest('.glass-nav');
    const open = !nav.classList.contains('menu-open');
    nav.classList.toggle('menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
  });
  document.querySelectorAll('.glass-nav nav a').forEach((link) => link.addEventListener('click', () => {
    document.querySelector('.glass-nav')?.classList.remove('menu-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));
  const navLinks = [...document.querySelectorAll('[data-nav]')];
  const trackedSections = navLinks.map((link) => document.querySelector(`#${link.dataset.nav}`)).filter(Boolean);
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
    const point = scrollY + innerHeight * .4;
    let current = '';
    trackedSections.forEach((section) => { if (section.offsetTop <= point) current = section.id; });
    navLinks.forEach((link) => link.classList.toggle('is-active', link.dataset.nav === current));
    document.querySelector('.site-header')?.classList.toggle('on-paper', scrollY > innerHeight * .72);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Small proximity tilt: the material reacts, but content stays readable.
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.featured-project, .project-card, .closing-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const rx = ((event.clientY - rect.top) / rect.height - .5) * -1.2;
        const ry = ((event.clientX - rect.left) / rect.width - .5) * 1.2;
        card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      }, { passive: true });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }
})();
