(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
      menuButton.addEventListener('click', function () {
        mobileNav.classList.toggle('is-open');
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === activeIndex);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === activeIndex);
      });
    }

    function startHero() {
      if (timer) {
        window.clearInterval(timer);
      }

      if (slides.length > 1) {
        timer = window.setInterval(function () {
          showSlide(activeIndex + 1);
        }, 5200);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = parseInt(dot.getAttribute('data-hero-dot'), 10) || 0;
        showSlide(index);
        startHero();
      });
    });

    startHero();

    var filterArea = document.querySelector('[data-filter-list]');
    var searchInput = document.querySelector('[data-search-input]');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-button]'));
    var noResult = document.querySelector('[data-no-result]');

    if (filterArea) {
      var cards = Array.prototype.slice.call(filterArea.querySelectorAll('[data-card]'));
      var activeFilter = 'all';

      function applyFilter() {
        var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var visibleCount = 0;

        cards.forEach(function (card) {
          var haystack = (card.getAttribute('data-search') || '').toLowerCase();
          var category = card.getAttribute('data-category') || '';
          var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchesFilter = activeFilter === 'all' || haystack.indexOf(activeFilter.toLowerCase()) !== -1 || category === activeFilter;
          var visible = matchesKeyword && matchesFilter;

          card.style.display = visible ? '' : 'none';
          if (visible) {
            visibleCount += 1;
          }
        });

        if (noResult) {
          noResult.classList.toggle('is-visible', visibleCount === 0);
        }
      }

      if (searchInput) {
        searchInput.addEventListener('input', applyFilter);
      }

      filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          activeFilter = button.getAttribute('data-filter-button') || 'all';
          filterButtons.forEach(function (item) {
            item.classList.toggle('is-active', item === button);
          });
          applyFilter();
        });
      });

      applyFilter();
    }
  });
})();
