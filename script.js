// ═══════════════════════════════════════════════════════════
//  OMAR AL-REFAEY PORTFOLIO — script.js
// ═══════════════════════════════════════════════════════════

// ── NAVBAR: scroll effect + mobile toggle ───────────────────
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // Animate the hamburger icon
  const spans = navToggle.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
  spans[1].style.opacity   = isOpen ? '0' : '';
  spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
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
        // Also reset inline styles (used by stat-cards and skill-pillars)
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // only animate once
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
document.querySelectorAll('.stat-card').forEach((el, i) => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(20px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`;
  observer.observe(el);
});

// Watch skill pillars
document.querySelectorAll('.skill-pillar').forEach((el, i) => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(20px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
  observer.observe(el);
});

// ── ACTIVE NAV LINK: highlight on scroll ────────────────────
const sections = document.querySelectorAll('section[id]');

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
  { threshold: 0.4 }
);

sections.forEach(s => navObserver.observe(s));

// ── SMOOTH STAT COUNTER ANIMATION ───────────────────────────
function animateCounter(el, target, suffix = '', duration = 1200) {
  const isRange = target.includes('–');
  if (isRange) return; // skip range values, they're fine as-is

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

// Trigger counters when stats come into view
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl   = entry.target.querySelector('.stat-number');
        const original = numEl.dataset.original || numEl.textContent;
        numEl.dataset.original = original;

        if (original === '150+') animateCounter(numEl, '150', '+');
        else if (original === '80–100') { /* leave as-is */ }
        else if (original === '3+') animateCounter(numEl, '3', '+');
        else if (original === '6')  animateCounter(numEl, '6', '');

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
