(function () {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav__toggle');
  const nav = document.querySelector('.nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('is-active');
    }
  });

  const revealTargets = document.querySelectorAll('[data-reveal], [data-reveal-group]');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    revealTargets.forEach((el) => io.observe(el));
    setTimeout(() => {
      revealTargets.forEach((el) => el.classList.add('is-visible'));
    }, 1500);
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const countIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const duration = 1600;
          const start = performance.now();
          const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * eased);
            el.textContent = value + suffix;
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          countIo.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => countIo.observe(el));
  }

  const mailtoForm = document.querySelector('[data-mailto-form]');
  if (mailtoForm) {
    mailtoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(mailtoForm);
      const name = data.get('name') || '';
      const email = data.get('email') || '';
      const phone = data.get('phone') || '';
      const service = data.get('service') || '';
      const message = data.get('message') || '';
      const subject = encodeURIComponent('Website enquiry from ' + name);
      const body = encodeURIComponent(
        ['Name: ' + name, 'Email: ' + email, 'Phone: ' + phone, 'Service: ' + service, '', message].join('\n')
      );
      window.location.href = 'mailto:info@optimumconsultants.co.za?subject=' + subject + '&body=' + body;
    });
  }

  const filterBar = document.querySelector('[data-filter-bar]');
  if (filterBar) {
    const buttons = filterBar.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('[data-category]');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const filter = btn.dataset.filter;
        items.forEach((item) => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.style.display = match ? '' : 'none';
        });
      });
    });
  }
})();
