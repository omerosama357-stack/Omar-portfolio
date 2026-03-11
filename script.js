// ═══════════════════════════════════════════════════════════
//  OMAR AL-REFAEY PORTFOLIO — script.js
// ═══════════════════════════════════════════════════════════

// FIX: Wrapped in DOMContentLoaded for safety if script ever moves to <head>
document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR: scroll effect + mobile toggle ───────────────────
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  // FIX: Guard against null — if elements don't exist, skip gracefully
  if (!navbar || !navToggle || !navLinks) {
    console.warn('Portfolio: Nav elements not found.');
    return;
  }

  // FIX: Added { passive: true } for scroll performance
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    // FIX: Sync aria-expanded for screen reader accessibility
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
    spans[1].style.opacity   = isOpen ? '0' : '';
    spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity   = '';
      });
    });
  });

  // ── INTERSECTION OBSERVER: fade-in animations ───────────────
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Reset inline styles (used by stat-cards and skill-pillars)
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  // Watch timeline items
  document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
    observer.observe(el);
  });

  // Watch project cards
  document.querySelectorAll('.project-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
    observer.observe(el);
  });

  // Watch stat cards
  // FIX: Removed duplicate stat-card from general observer to avoid conflict with statObserver
  document.querySelectorAll('.stat-card').forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
    // NOTE: stat-cards are handled by statObserver below — NOT added to general observer
  });

  // Watch skill pillars
  document.querySelectorAll('.skill-pillar').forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
    observer.observe(el);
  });

  // ── ACTIVE NAV LINK: CSS class instead of inline style ──────
  // FIX: Use CSS .active class (defined in style.css) instead of inline style.color
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Remove active from all nav links
          document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
          const activeLink = document.querySelector(
            `.nav-links a[href="#${entry.target.id}"]`
          );
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => navObserver.observe(s));

  // ── SMOOTH STAT COUNTER ANIMATION ───────────────────────────
  function animateCounter(el, target, suffix = '', duration = 1200) {
    const num = parseInt(target.replace(/\D/g, ''));
    if (isNaN(num)) return;

    let start = 0;
    const step = Math.ceil(num / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, num);
      el.textContent = start + suffix;
      if (start >= num) clearInterval(timer);
    }, 16);
  }

  // FIX: statObserver now handles BOTH visibility fade-in AND counter trigger
  // (previously stat-cards were in the general observer too — removed to prevent conflict)
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card  = entry.target;
          const numEl = card.querySelector('.stat-number');
          if (!numEl) return;

          // Step 1: Fade the card in
          card.style.opacity   = '1';
          card.style.transform = 'translateY(0)';

          // Step 2: Run counter animation after a brief delay so card is visible first
          const original = numEl.dataset.original || numEl.textContent;
          numEl.dataset.original = original;

          setTimeout(() => {
            if (original === '150+')    animateCounter(numEl, '150', '+');
            else if (original === '80–100') { numEl.textContent = '80–100'; }
            else if (original === '3+') animateCounter(numEl, '3', '+');
            else if (original === '6')  animateCounter(numEl, '6', '');
          }, 200);

          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-card').forEach(el => statObserver.observe(el));

  // ── CONSOLE GREETING ────────────────────────────────────────
  console.log('%c✦ Omar Al-Refaey Portfolio ✦', 'color:#C8A560;font-size:1.2rem;font-family:serif;');
  console.log('%cBuilt with precision, curiosity, and AI.', 'color:#C1654B;font-size:0.9rem;');

}); // end DOMContentLoaded
