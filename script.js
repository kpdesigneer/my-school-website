/* ===== SCRIPT.JS – My School Website ===== */

document.addEventListener('DOMContentLoaded', () => {

  // ──────────────────────────────
  // 1. LOADER
  // ──────────────────────────────
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 1800);

  // Video removed, background is now dynamic image

  // ──────────────────────────────
  // 2. NAVBAR – scroll behaviour
  // ──────────────────────────────
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
    revealElements();
    toggleBackToTop();
    triggerCounters();
  });

  // ──────────────────────────────
  // 3. HAMBURGER MENU
  // ──────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksEl.classList.toggle('open');
    document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu on link click
  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinksEl.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ──────────────────────────────
  // 4. ACTIVE NAV LINK ON SCROLL
  // ──────────────────────────────
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    let scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      if (
        scrollPos >= section.offsetTop &&
        scrollPos < section.offsetTop + section.offsetHeight
      ) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${section.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ──────────────────────────────
  // 5. SCROLL REVEAL
  // ──────────────────────────────
  // Add reveal class to elements
  const revealTargets = document.querySelectorAll(
    '.program-card, .stat-card, .event-card, .gallery-item, .af-item, .why-item, .ci-item, .wcs-card, .as-step'
  );
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 0.07}s`;
  });

  function revealElements() {
    revealTargets.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        el.classList.add('visible');
      }
    });
  }
  // Trigger once on load
  revealElements();

  // ──────────────────────────────
  // 6. COUNTER ANIMATION
  // ──────────────────────────────
  let countersTriggered = false;

  function triggerCounters() {
    if (countersTriggered) return;
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      countersTriggered = true;
      document.querySelectorAll('.count').forEach(counter => {
        animateCounter(counter);
      });
    }
  }

  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000;
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOut(progress) * target);
      element.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ──────────────────────────────
  // 7. TESTIMONIALS SLIDER
  // ──────────────────────────────
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let sliderInterval;

  function goToSlide(index) {
    testimonialCards[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    testimonialCards[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % testimonialCards.length);
  }

  function startSlider() {
    sliderInterval = setInterval(nextSlide, 4000);
  }
  startSlider();

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(sliderInterval);
      goToSlide(i);
      startSlider();
    });
  });

  // ──────────────────────────────
  // 8. BACK TO TOP
  // ──────────────────────────────
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ──────────────────────────────
  // 9. FORM SUBMISSION
  // ──────────────────────────────
  const admissionForm = document.getElementById('admissionForm');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  admissionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const parentName = document.getElementById('parentName').value.trim();
    const studentName = document.getElementById('studentName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!parentName || !studentName || !phone || !email) {
      showToast('⚠️ Please fill in all required fields.', true);
      return;
    }

    // Simulate form submission
    const btn = admissionForm.querySelector('.btn-form');
    btn.innerHTML = '<span>Submitting...</span>';
    btn.disabled = true;

    setTimeout(() => {
      admissionForm.reset();
      btn.innerHTML = `<span>Submit Application</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      btn.disabled = false;
      showToast('✅ Application submitted successfully! We\'ll reach out soon.');
    }, 1500);
  });

  function showToast(message, isError = false) {
    toast.querySelector('.toast-icon').textContent = isError ? '⚠️' : '✅';
    toastMsg.textContent = message.replace(/^[✅⚠️]\s*/, '');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // ──────────────────────────────
  // 10. SMOOTH LINK SCROLL
  // ──────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ──────────────────────────────
  // 11. HERO PARALLAX (subtle)
  // ──────────────────────────────
  const heroShapes = document.querySelectorAll('.shape');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroShapes.forEach((shape, i) => {
      const speed = 0.03 + i * 0.015;
      shape.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });

  // ──────────────────────────────
  // 13. GALLERY – handled via CSS
  // (real photos now; hover zoom via CSS transition)
  // ──────────────────────────────

  // ──────────────────────────────
  // 14. LIGHTBOX
  // ──────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (lightbox && lightboxImg && galleryItems.length > 0) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightbox.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (!lightbox.classList.contains('active')) {
          lightboxImg.src = '';
        }
      }, 300);
    };

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target !== lightboxImg) {
        closeLightbox();
      }
    });
  }

  // Initial triggers
  updateActiveLink();
  toggleBackToTop();
  triggerCounters();

});
