/* =============================================================
   MIKADO JAPANESE RESTAURANT — main.js
   ============================================================= */

(function () {
  'use strict';

  /* ---- Navbar scroll behaviour ---- */
  const header = document.getElementById('site-header');
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      }
    });

    // Close on nav link click (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
      });
    });
  }

  /* ---- Hero Carousel ---- */
  var slides     = Array.from(document.querySelectorAll('.carousel-slide'));
  var dots       = Array.from(document.querySelectorAll('.carousel-dots .dot'));
  var prevBtn    = document.getElementById('carouselPrev');
  var nextBtn    = document.getElementById('carouselNext');
  var current    = 0;
  var isAnimating = false;
  var autoTimer;

  function goTo(index, direction) {
    if (isAnimating || index === current) return;
    isAnimating = true;

    var prev = current;
    var next = ((index % slides.length) + slides.length) % slides.length;

    // Determine exit direction
    var exitClass = direction === 'prev' ? 'exit-left' : 'exit-left';
    if (direction === 'prev') {
      slides[prev].style.transform  = 'translateX(40px)';
      slides[next].style.transform  = 'translateX(-40px)';
    } else {
      slides[prev].style.transform  = 'translateX(-40px)';
      slides[next].style.transform  = 'translateX(40px)';
    }

    // Make previous slide fade out
    slides[prev].style.opacity = '0';
    slides[prev].style.pointerEvents = 'none';

    // Prepare next slide (hidden but in position)
    slides[next].classList.add('active');
    slides[next].style.position = 'absolute';
    slides[next].style.opacity = '0';

    // Force reflow
    void slides[next].offsetWidth;

    // Animate next slide in
    slides[next].style.transition = 'opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)';
    slides[prev].style.transition = 'opacity 0.55s cubic-bezier(0.4,0,0.2,1), transform 0.55s cubic-bezier(0.4,0,0.2,1)';

    requestAnimationFrame(function () {
      slides[next].style.opacity = '1';
      slides[next].style.transform = 'translateX(0)';
    });

    setTimeout(function () {
      // Clean up previous slide
      slides[prev].classList.remove('active');
      slides[prev].style.position = 'absolute';
      slides[prev].style.opacity  = '';
      slides[prev].style.transform = '';
      slides[prev].style.transition = '';
      slides[prev].style.pointerEvents = '';

      // Make next slide the actual active one
      slides[next].style.position   = '';
      slides[next].style.transition = '';

      current = next;
      isAnimating = false;
      updateDots();
    }, 580);
  }

  function updateDots() {
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function () {
      goTo(current + 1, 'next');
    }, 4500);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  if (slides.length > 0) {
    // Initial setup: make first slide relative, rest absolute
    slides.forEach(function (slide, i) {
      if (i !== 0) {
        slide.style.position = 'absolute';
        slide.style.opacity  = '0';
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        stopAuto();
        goTo(current - 1, 'prev');
        startAuto();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        stopAuto();
        goTo(current + 1, 'next');
        startAuto();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var i = parseInt(dot.dataset.index, 10);
        stopAuto();
        goTo(i, i > current ? 'next' : 'prev');
        startAuto();
      });
    });

    startAuto();
  }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---- Add reveal class to key sections ---- */
  var revealTargets = document.querySelectorAll(
    '.about-grid, .feature-card, .menu-card, .location-grid, .section-header'
  );
  revealTargets.forEach(function (el, i) {
    el.classList.add('reveal');
    if (el.classList.contains('menu-card') || el.classList.contains('feature-card')) {
      el.style.transitionDelay = (i % 3) * 0.1 + 's';
    }
  });
  // Re-run observer on new elements
  if ('IntersectionObserver' in window) {
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---- Menu card — link to order page ---- */
  document.querySelectorAll('.menu-card').forEach(function (card) {
    card.addEventListener('click', function () {
      window.open('https://menuorg.online/mobile-shop/shop/20227', '_blank', 'noopener');
    });
  });

  /* ---- Legacy analytics ---- */
  function formatDate(date, fmt) {
    var map = {
      YYYY: date.getFullYear(),
      MM: ('0' + (date.getMonth() + 1)).slice(-2),
      DD: ('0' + date.getDate()).slice(-2),
      HH: ('0' + date.getHours()).slice(-2),
      mm: ('0' + date.getMinutes()).slice(-2),
      ss: ('0' + date.getSeconds()).slice(-2)
    };
    return fmt.replace(/YYYY|MM|DD|HH|mm|ss/g, function (m) { return map[m]; });
  }

  function postAnalytics(clickType) {
    var refSource = '';
    try { refSource = document.referrer || ''; } catch (e) {}
    try { if (!refSource && opener && opener.location.href) refSource = opener.location.href; } catch (e) {}

    var rdId = (document.querySelector('input[name="rdid"]') || {}).value || '20227';
    var isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);

    var data = {
      ref_source:    refSource,
      user_agent:    navigator.userAgent,
      current_page:  window.location.href,
      rd_id:         rdId,
      platform_type: 'mgmt',
      option_type:   isMobile ? 'seo-首页-移动端' : 'seo-首页-pc端',
      browse_time:   formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'),
      event_type:    clickType || 'viewHome'
    };

    fetch('https://api.menuorg.com/app/v1/browse_records/add', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data)
    }).catch(function () {}); // Silently ignore errors
  }

  postAnalytics('viewHome');

})();
