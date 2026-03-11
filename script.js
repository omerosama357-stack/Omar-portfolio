// ═══════════════════════════════════════════════════════════
//  OMAR AL-REFAEY PORTFOLIO — script.js
// ═══════════════════════════════════════════════════════════

// FIX: Wrapped in DOMContentLoaded so the script is safe if ever moved to <head>
document.addEventListener('DOMContentLoaded', () => {

  // ── NAVBAR: scroll effect + mobile toggle ─────────────────
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  // FIX: Null-guard before attaching listeners
  if (!navbar || !navToggle || !navLinks) {
    console.warn('Portfolio: navbar elements not found.');
    return;
  }

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    // FIX: Hamburger animation via CSS class (removed inline style manipulation)
    navToggle.classList.toggle('is-open', isOpen);
    // FIX: Keep aria-expanded in sync for accessibility
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });


  // ── INTERSECTION OBSERVER: fade-in animations ─────────────
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // FIX: Don't set inline opacity/transform — CSS handles it via .visible class.
          // Removed entry.target.style.opacity / style.transform overrides that
          // conflicted with CSS transition definitions.
          observer.unobserve(entry.target);
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

  // ── STAT CARD ENTRANCE (separate from counter) ────────────
  // FIX: Stat cards now only use one observer. The entrance animation
  // is handled via CSS (opacity/transform already defined inline below),
  // and the counter fires from statObserver below.
  document.querySelectorAll('.stat-card').forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
    // FIX: NOT observed by the general observer — only by statObserver below.
  });

  // Watch skill pillars
  document.querySelectorAll('.skill-pillar').forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
    observer.observe(el);
  });


  // ── ACTIVE NAV LINK: highlight on scroll ──────────────────
  const sections = document.querySelectorAll('section[id]');

  // FIX: Lowered threshold from 0.4 → 0.15 so tall sections on small
  // viewports still trigger nav highlighting correctly.
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll('.nav-links a').forEach(a => {
            a.style.color = '';
          });
          const activeLink = document.querySelector(
            `.nav-links a[href="#${entry.target.id}"]`
          );
          if (activeLink) activeLink.style.color = 'var(--gold-l)';
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach(s => navObserver.observe(s));


  // ── SMOOTH STAT COUNTER ANIMATION ─────────────────────────
  // FIX: Uses requestAnimationFrame instead of setInterval(fn, 16)
  // for smoother, battery-friendly animation.
  // FIX: Reads target from data attributes instead of brittle string matching.
  function animateCounter(el, target, suffix, duration = 1200) {
    const startTime = performance.now();
    const startVal  = 0;

    function tick(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out curve
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }

  // FIX: Single statObserver handles both entrance animation AND counter trigger.
  // Previously stat-cards were double-observed by both the main observer and statObserver.
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;

          // Entrance animation (was handled by general observer before — now here)
          el.style.opacity   = '1';
          el.style.transform = 'translateY(0)';

          // Counter animation — reads from data attributes
          const numEl  = el.querySelector('.stat-number');
          if (!numEl) return;

          const targetStr = numEl.dataset.target;
          const suffix    = numEl.dataset.suffix ?? '';

          if (targetStr === 'range') {
            // Leave range values (e.g. "80–100") as-is — no animation
          } else {
            const targetNum = parseInt(targetStr, 10);
            if (!isNaN(targetNum)) {
              animateCounter(numEl, targetNum, suffix);
            }
          }

          statObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-card').forEach(el => statObserver.observe(el));


  // ── CONSOLE GREETING ──────────────────────────────────────
  console.log('%c✦ Omar Al-Refaey Portfolio ✦', 'color:#C8A560;font-size:1.2rem;font-family:serif;');
  console.log('%cBuilt with precision, curiosity, and AI.', 'color:#C1654B;font-size:0.9rem;');

}); // end DOMContentLoaded
