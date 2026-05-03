(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll
  const revealElements = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach((el, i) => {
      if (el.classList.contains('box')) {
        el.style.setProperty('--reveal-delay', `${(i % 3) * 0.08}s`);
      }
      io.observe(el);
    });
  } else {
    revealElements.forEach((el) => el.classList.add('visible'));
  }

  // Header scroll style + back-to-top toggle
  const header = document.querySelector('.header');
  const backTop = document.getElementById('back-top');

  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 30);
    backTop?.classList.toggle('visible', y > 400);
    updateActiveNav();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  backTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');

  navToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });

  // Active nav link based on scroll position
  const sections = ['sobre', 'skills', 'projetos', 'contato']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navLinks = nav ? Array.from(nav.querySelectorAll('a')) : [];

  const updateActiveNav = () => {
    if (!sections.length || !navLinks.length) return;
    const offset = (header?.offsetHeight || 80) + 40;
    const scrollY = window.scrollY;
    let current = '';
    sections.forEach((section) => {
      if (section.offsetTop - offset <= scrollY) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  // Stat counter
  const counters = document.querySelectorAll('.stat strong[data-count]');
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count) || 0;
        const duration = 1200;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased) + (progress === 1 ? '+' : '');
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    }, { threshold: 0.4 });

    counters.forEach((el) => counterIO.observe(el));
  } else {
    counters.forEach((el) => {
      el.textContent = (el.dataset.count || '0') + '+';
    });
  }

  // Initial sync
  onScroll();
})();
