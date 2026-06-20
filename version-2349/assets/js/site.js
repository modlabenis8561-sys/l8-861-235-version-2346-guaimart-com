
(() => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      mobileNav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-hero-slider]').forEach((slider) => {
    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const thumbs = Array.from(slider.querySelectorAll('[data-hero-target]'));
    const next = slider.querySelector('[data-hero-next]');
    const prev = slider.querySelector('[data-hero-prev]');
    let index = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
    let timer = null;

    const show = (target) => {
      if (!slides.length) {
        return;
      }
      index = (target + slides.length) % slides.length;
      slides.forEach((slide, itemIndex) => {
        slide.classList.toggle('is-active', itemIndex === index);
      });
      thumbs.forEach((thumb, itemIndex) => {
        thumb.classList.toggle('is-active', itemIndex === index);
      });
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => show(index + 1), 5200);
    };

    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };

    thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        show(Number(thumb.getAttribute('data-hero-target')) || 0);
        start();
      });
    });

    if (next) {
      next.addEventListener('click', () => {
        show(index + 1);
        start();
      });
    }

    if (prev) {
      prev.addEventListener('click', () => {
        show(index - 1);
        start();
      });
    }

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    show(index);
    start();
  });

  const params = new URLSearchParams(window.location.search);
  const query = (params.get('q') || '').trim().toLowerCase();
  const searchInput = document.querySelector('[data-search-input]');
  const cards = Array.from(document.querySelectorAll('[data-search]'));
  const empty = document.querySelector('[data-search-empty]');

  if (searchInput && query) {
    searchInput.value = query;
  }

  if (cards.length && (searchInput || query)) {
    const runFilter = (value) => {
      const term = value.trim().toLowerCase();
      let visible = 0;
      cards.forEach((card) => {
        const text = (card.getAttribute('data-search') || '').toLowerCase();
        const matched = !term || text.includes(term);
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    };

    runFilter(query);

    if (searchInput) {
      searchInput.addEventListener('input', () => runFilter(searchInput.value));
    }
  }
})();
