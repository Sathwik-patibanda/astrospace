/* =====================================================
   ASTROSATHWIK — JavaScript (Interactions & Animations)
   ===================================================== */

// ============== STARFIELD CANVAS ==============
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let shootingStars = [];
  let animFrame;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateStars();
  }

  function generateStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 3000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.6 + 0.2,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: ['#ffffff', '#b3d9ff', '#ffd4a8', '#d4b3ff'][Math.floor(Math.random() * 4)]
      });
    }
  }

  function spawnShootingStar() {
    if (shootingStars.length < 3 && Math.random() < 0.004) {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        vx: (Math.random() * 4 + 3),
        vy: (Math.random() * 3 + 2),
        len: Math.random() * 100 + 60,
        alpha: 1,
        life: 1
      });
    }
  }

  function drawFrame(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stars
    stars.forEach(s => {
      const twinkle = Math.sin(t * s.twinkleSpeed + s.twinkleOffset) * 0.3 + 0.7;
      ctx.globalAlpha = s.alpha * twinkle;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Shooting stars
    spawnShootingStar();
    shootingStars = shootingStars.filter(ss => ss.life > 0);
    shootingStars.forEach(ss => {
      ctx.globalAlpha = ss.alpha * ss.life;
      const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 20, ss.y - ss.vy * 20);
      grad.addColorStop(0, 'rgba(255,255,255,0.9)');
      grad.addColorStop(1, 'rgba(0,212,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ss.x, ss.y);
      ctx.lineTo(ss.x - ss.vx * 20, ss.y - ss.vy * 20);
      ctx.stroke();
      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.life -= 0.015;
    });

    ctx.globalAlpha = 1;
    animFrame = requestAnimationFrame(drawFrame);
  }

  window.addEventListener('resize', resize);
  resize();
  animFrame = requestAnimationFrame(drawFrame);
})();

// ============== NAVBAR SCROLL ==============
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    // Active link update
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile toggle
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close on link click
  links.forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
})();

// ============== SMOOTH SCROLL ==============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ============== SCROLL-REVEAL ANIMATIONS ==============
(function initScrollReveal() {
  const items = [
    { selector: '.news-card', delay: 80 },
    { selector: '.topic-item', delay: 100 },
    { selector: '.video-card', delay: 120 },
    { selector: '.perk-item', delay: 100 },
    { selector: '.social-card', delay: 80 },
    { selector: '.about-badge', delay: 100 },
    { selector: '.support-card', delay: 0 },
    { selector: '.support-perks', delay: 0 },
  ];

  // Apply initial hidden state
  items.forEach(({ selector }) => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(({ selector, delay }) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.style.transitionDelay = `${i * delay}ms`;
      observer.observe(el);
    });
  });
})();

// ============== UPI COPY ==============
function copyUPI() {
  const upiId = 'sathwikpatibanda@fam';
  navigator.clipboard.writeText(upiId).then(() => {
    showToast();
  }).catch(() => {
    // Fallback
    const tmp = document.createElement('textarea');
    tmp.value = upiId;
    document.body.appendChild(tmp);
    tmp.select();
    document.execCommand('copy');
    document.body.removeChild(tmp);
    showToast();
  });
}

function showToast() {
  const toast = document.getElementById('copyToast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ============== PARALLAX HERO ==============
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg-image');
  const heroContent = document.querySelector('.hero-content');

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      if (heroBg) heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
      if (heroContent) heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
  }, { passive: true });
})();

// ============== CURSOR GLOW EFFECT ==============
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();

// ============== POSTER LIGHTBOX ==============
(function initLightbox() {
  const posters = Array.from(document.querySelectorAll('.poster-card'));
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightboxImg');
  const lbEp       = document.getElementById('lightboxEp');
  const lbTitle    = document.getElementById('lightboxTitle');
  const lbClose    = document.getElementById('lightboxClose');
  const lbBackdrop = document.getElementById('lightboxBackdrop');
  const lbPrev     = document.getElementById('lightboxPrev');
  const lbNext     = document.getElementById('lightboxNext');

  if (!lightbox) return;

  let current = 0;

  function openLightbox(index) {
    current = index;
    const card = posters[index];
    lbImg.src   = card.dataset.src;
    lbImg.alt   = card.dataset.title;
    lbEp.textContent    = card.dataset.num + ' AstroXplained';
    lbTitle.textContent = card.dataset.title;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function navigate(dir) {
    current = (current + dir + posters.length) % posters.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      const card = posters[current];
      lbImg.src   = card.dataset.src;
      lbImg.alt   = card.dataset.title;
      lbEp.textContent    = card.dataset.num + ' AstroXplained';
      lbTitle.textContent = card.dataset.title;
      lbImg.style.opacity = '1';
    }, 150);
  }

  // Attach click to each poster card
  posters.forEach((card, i) => {
    card.addEventListener('click', () => openLightbox(i));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', (e) => { e.stopPropagation(); navigate(-1); });
  lbNext.addEventListener('click', (e) => { e.stopPropagation(); navigate(1); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  });
})();

// ============== ASTRONEWS FEED LIGHTBOX ==============
(function initFeedLightbox() {
  const feedCards  = Array.from(document.querySelectorAll('.feed-post-card'));
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lightboxImg');
  const lbEp       = document.getElementById('lightboxEp');
  const lbTitle    = document.getElementById('lightboxTitle');
  const lbClose    = document.getElementById('lightboxClose');
  const lbBackdrop = document.getElementById('lightboxBackdrop');

  if (!lightbox || feedCards.length === 0) return;

  let current = 0;

  function openFeed(index) {
    current = index;
    const card = feedCards[index];
    lbImg.src  = card.dataset.src;
    lbImg.alt  = card.dataset.title;
    lbEp.textContent    = card.dataset.ep + ' AstroNews';
    lbTitle.textContent = card.dataset.title;
    lightbox.dataset.mode = 'feed';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function navigate(dir) {
    if (lightbox.dataset.mode !== 'feed') return;
    current = (current + dir + feedCards.length) % feedCards.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      const card = feedCards[current];
      lbImg.src  = card.dataset.src;
      lbEp.textContent    = card.dataset.ep + ' AstroNews';
      lbTitle.textContent = card.dataset.title;
      lbImg.style.opacity = '1';
    }, 150);
  }

  feedCards.forEach((card, i) => {
    card.addEventListener('click', () => openFeed(i));
  });

  document.getElementById('lightboxPrev').addEventListener('click', () => navigate(-1));
  document.getElementById('lightboxNext').addEventListener('click', () => navigate(1));

  [lbClose, lbBackdrop].forEach(el => {
    el.addEventListener('click', () => { lightbox.dataset.mode = ''; });
  });
})();

// ============== CARD HOVER 3D TILT ==============
(function initTilt() {
  const tiltCards = document.querySelectorAll('.news-card, .video-card, .support-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${y * -6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// ============== NUMBER COUNTER ANIMATION ==============
(function initCounters() {
  // Future use: can animate stat numbers
})();

console.log('%c🔭 ASTROSATHWIK', 'font-size: 24px; font-weight: bold; color: #00d4ff; font-family: monospace;');
console.log('%cExploring the cosmos, one video at a time 🌌', 'color: #8a9bbf; font-family: monospace;');
