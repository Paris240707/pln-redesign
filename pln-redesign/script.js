/* ============================================
   PLN INDONESIA – JAVASCRIPT
   script.js
   ============================================ */

/* ──────────────────────────────────────────
   1. MOBILE MENU TOGGLE
   ────────────────────────────────────────── */
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const isOpen = menu.classList.toggle('open');
  document.body.style.overflow = isOpen ? 'hidden' : '';

  // Animasi hamburger → X
  const bars = document.querySelectorAll('.hamburger span');
  if (isOpen) {
    bars[0].style.cssText = 'transform: rotate(45deg) translate(5px, 5px)';
    bars[1].style.cssText = 'opacity: 0; transform: scaleX(0)';
    bars[2].style.cssText = 'transform: rotate(-45deg) translate(5px, -5px)';
  } else {
    bars.forEach(b => b.style.cssText = '');
  }
}

// Tutup menu saat klik di luar
document.addEventListener('click', (e) => {
  const menu   = document.getElementById('mobileMenu');
  const burger = document.querySelector('.hamburger');
  if (
    menu.classList.contains('open') &&
    !menu.contains(e.target) &&
    !burger.contains(e.target)
  ) {
    toggleMenu();
  }
});

// Tutup menu saat resize ke layar besar
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024) {
    const menu = document.getElementById('mobileMenu');
    if (menu.classList.contains('open')) toggleMenu();
  }
});


/* ──────────────────────────────────────────
   2. NAVBAR – SCROLL EFFECT
   ────────────────────────────────────────── */
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.style.boxShadow = '0 4px 24px rgba(10,22,40,0.14)';
    navbar.style.background = 'rgba(255,255,255,0.97)';
    navbar.style.backdropFilter = 'blur(10px)';
  } else {
    navbar.style.boxShadow = '0 2px 16px rgba(10,22,40,0.08)';
    navbar.style.background = '#ffffff';
    navbar.style.backdropFilter = 'none';
  }
});


/* ──────────────────────────────────────────
   3. NAVBAR – ACTIVE LINK saat SCROLL
   ────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      current = sec.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});


/* ──────────────────────────────────────────
   4. FADE-UP SCROLL ANIMATION
   ────────────────────────────────────────── */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, (i % 4) * 100);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));


/* ──────────────────────────────────────────
   5. ANIMASI COUNTER ANGKA
   ────────────────────────────────────────── */
function animateCounter(el, target, suffix, duration) {
  duration = duration || 1800;
  const isFloat = String(target).includes('.');
  let start = 0;
  const step = target / (duration / 16);

  const tick = () => {
    start += step;
    if (start >= target) {
      el.textContent = (isFloat ? target.toFixed(1) : Math.floor(target)) + suffix;
      return;
    }
    el.textContent = (isFloat ? start.toFixed(1) : Math.floor(start)) + suffix;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el     = entry.target;
    const val    = parseFloat(el.dataset.val);
    const suffix = el.dataset.suffix || '';
    if (!isNaN(val)) animateCounter(el, val, suffix);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

// Hero stats
const heroStatMap = [
  { val: 88,   suffix: 'M+' },
  { val: 99.8, suffix: '%'  },
  { val: 48,   suffix: ' GW'},
];
document.querySelectorAll('.hero-stat-num').forEach((el, i) => {
  if (heroStatMap[i]) {
    el.dataset.val    = heroStatMap[i].val;
    el.dataset.suffix = heroStatMap[i].suffix;
    el.textContent    = '0';
    counterObserver.observe(el);
  }
});

// Stats banner
const statBannerMap = [
  { val: 88,   suffix: '' },
  { val: 99.8, suffix: '' },
  { val: 48,   suffix: '' },
  { val: 100,  suffix: '' },
];
document.querySelectorAll('.stat-num').forEach((el, i) => {
  if (statBannerMap[i]) {
    // simpan <span> suffix asli
    const span = el.querySelector('span');
    const spanHTML = span ? span.outerHTML : '';
    el.dataset.val    = statBannerMap[i].val;
    el.dataset.suffix = statBannerMap[i].suffix;
    el.dataset.span   = spanHTML;
    // kosongkan teks awal (tapi biarkan span)
    el.childNodes[0].textContent = '0';

    const specialObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const target  = parseFloat(entry.target.dataset.val);
        const isFloat = String(target).includes('.');
        let cur = 0;
        const s = target / (1800 / 16);
        const tick = () => {
          cur += s;
          if (cur >= target) {
            entry.target.childNodes[0].textContent =
              (isFloat ? target.toFixed(1) : Math.floor(target));
            return;
          }
          entry.target.childNodes[0].textContent =
            (isFloat ? cur.toFixed(1) : Math.floor(cur));
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        specialObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    specialObserver.observe(el);
  }
});


/* ──────────────────────────────────────────
   6. SMOOTH SCROLL untuk anchor link
   ────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href   = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.offsetTop - (navbar.offsetHeight + 12),
      behavior: 'smooth',
    });
  });
});


/* ──────────────────────────────────────────
   7. TOOLTIP pada Quick Access
   ────────────────────────────────────────── */
const qaTooltips = [
  'Cek tagihan listrik Anda',
  'Beli token listrik prabayar',
  'Laporkan gangguan listrik',
  'Ajukan pasang baru',
  'Unduh rekening digital',
  'Ubah kapasitas daya',
];

document.querySelectorAll('.qa-item').forEach((el, i) => {
  if (!qaTooltips[i]) return;

  const tip = document.createElement('div');
  tip.textContent = qaTooltips[i];
  tip.style.cssText = [
    'position:absolute',
    'bottom:calc(100% + 8px)',
    'left:50%',
    'transform:translateX(-50%)',
    'background:#0A1628',
    'color:#fff',
    'font-size:11px',
    'font-weight:600',
    'padding:5px 10px',
    'border-radius:6px',
    'white-space:nowrap',
    'pointer-events:none',
    'opacity:0',
    'transition:opacity .2s',
    'z-index:50',
  ].join(';');

  el.style.position = 'relative';
  el.appendChild(tip);

  el.addEventListener('mouseenter', () => { tip.style.opacity = '1'; });
  el.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
});


/* ──────────────────────────────────────────
   8. PROGRESS BAR ANIMASI (hero)
   ────────────────────────────────────────── */
const progressFill = document.querySelector('.progress-fill');
if (progressFill) {
  progressFill.style.width = '0%';

  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          progressFill.style.transition = 'width 1.4s cubic-bezier(.4,0,.2,1)';
          progressFill.style.width = '88%';
        }, 400);
      }
    });
  }, { threshold: 0.5 }).observe(progressFill);
}


/* ──────────────────────────────────────────
   9. RIPPLE EFFECT pada card saat klik
   ────────────────────────────────────────── */
// Inject keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = '@keyframes rippleAnim { to { transform:scale(2.8); opacity:0; } }';
document.head.appendChild(rippleStyle);

document.querySelectorAll('.berita-card, .layanan-card, .qa-item').forEach(card => {
  card.addEventListener('click', function(e) {
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.style.cssText = [
      'position:absolute',
      'border-radius:50%',
      'pointer-events:none',
      'background:rgba(26,79,160,0.13)',
      'animation:rippleAnim .5s ease-out forwards',
      'width:'  + size + 'px',
      'height:' + size + 'px',
      'left:'   + (e.clientX - rect.left  - size / 2) + 'px',
      'top:'    + (e.clientY - rect.top   - size / 2) + 'px',
      'transform:scale(0)',
    ].join(';');
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 520);
  });
});


/* ──────────────────────────────────────────
   10. BACK TO TOP BUTTON
   ────────────────────────────────────────── */
const backToTop = document.createElement('button');
backToTop.innerHTML = '&#8679;';
backToTop.setAttribute('title', 'Kembali ke atas');
backToTop.setAttribute('aria-label', 'Kembali ke atas');
backToTop.style.cssText = [
  'position:fixed',
  'bottom:28px',
  'right:28px',
  'width:46px',
  'height:46px',
  'border-radius:50%',
  'background:#1A4FA0',
  'color:white',
  'font-size:22px',
  'font-weight:700',
  'border:none',
  'cursor:pointer',
  'box-shadow:0 4px 16px rgba(26,79,160,0.35)',
  'display:flex',
  'align-items:center',
  'justify-content:center',
  'opacity:0',
  'transform:translateY(14px)',
  'transition:opacity .3s, transform .3s, background .2s',
  'z-index:200',
  'pointer-events:none',
].join(';');
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  const show = window.scrollY > 400;
  backToTop.style.opacity       = show ? '1' : '0';
  backToTop.style.transform     = show ? 'translateY(0)' : 'translateY(14px)';
  backToTop.style.pointerEvents = show ? 'auto' : 'none';
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

backToTop.addEventListener('mouseenter', () => {
  backToTop.style.background = '#1E5FBF';
  backToTop.style.transform  = 'translateY(-2px)';
});
backToTop.addEventListener('mouseleave', () => {
  backToTop.style.background = '#1A4FA0';
  backToTop.style.transform  = 'translateY(0)';
});


/* ──────────────────────────────────────────
   11. TOAST NOTIFICATION
   ────────────────────────────────────────── */
function showToast(msg, type) {
  type = type || 'info';
  const colors = {
    info:    '#1A4FA0',
    success: '#16a34a',
    warning: '#d97706',
  };
  const icons = { info: 'ℹ️', success: '✅', warning: '⚠️' };

  const toast = document.createElement('div');
  toast.style.cssText = [
    'position:fixed',
    'bottom:84px',
    'right:28px',
    'background:' + (colors[type] || colors.info),
    'color:white',
    'padding:12px 18px',
    'border-radius:10px',
    'font-size:13px',
    'font-weight:600',
    'font-family:"Plus Jakarta Sans",sans-serif',
    'display:flex',
    'align-items:center',
    'gap:10px',
    'box-shadow:0 6px 24px rgba(0,0,0,0.2)',
    'opacity:0',
    'transform:translateY(10px)',
    'transition:opacity .3s, transform .3s',
    'z-index:300',
    'max-width:290px',
    'line-height:1.4',
  ].join(';');
  toast.innerHTML = '<span>' + (icons[type] || icons.info) + '</span><span>' + msg + '</span>';
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity   = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

// Tombol kuning → toast info
document.querySelectorAll('.btn-yellow').forEach(btn => {
  btn.addEventListener('click', () => {
    showToast('Fitur ini tersedia di PLN Mobile', 'info');
  });
});

// Tombol download app
document.querySelectorAll('.app-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Mengalihkan ke toko aplikasi...', 'success');
  });
});

// Tombol lapor gangguan
document.querySelectorAll('.gangguan-actions .btn').forEach((btn, i) => {
  btn.addEventListener('click', () => {
    const msgs = [
      'Membuka peta gangguan wilayah Anda...',
      'Silakan isi formulir laporan gangguan',
    ];
    showToast(msgs[i] || msgs[0], 'warning');
  });
});


/* ──────────────────────────────────────────
   12. LAZY LOAD gambar (future-proof)
   ────────────────────────────────────────── */
if ('IntersectionObserver' in window) {
  const lazyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        lazyObserver.unobserve(img);
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach(img => lazyObserver.observe(img));
}


/* ──────────────────────────────────────────
   13. INIT
   ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Set nav link pertama aktif saat halaman pertama dibuka
  const firstLink = document.querySelector('.nav-links a');
  if (firstLink) firstLink.classList.add('active');

  console.log('%c⚡ PLN Indonesia', 'color:#1A4FA0;font-size:18px;font-weight:800;');
  console.log('%cscript.js loaded ✓', 'color:#22C55E;font-size:12px;');
});
