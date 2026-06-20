(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.classList.add('image-missing');
    });
  });

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    var showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5000);
    }
  }

  document.querySelectorAll('[data-filter-panel]').forEach(function (panelElement) {
    var input = panelElement.querySelector('[data-filter-input]');
    var year = panelElement.querySelector('[data-year-filter]');
    var type = panelElement.querySelector('[data-type-filter]');
    var count = panelElement.querySelector('[data-filter-count]');
    var list = document.querySelector('[data-filter-list]');

    if (!list) {
      return;
    }

    var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

    var applyFilter = function () {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var selectedYear = year ? year.value : '';
      var selectedType = type ? type.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = card.getAttribute('data-search') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var cardType = card.getAttribute('data-type') || '';
        var ok = true;

        if (keyword && text.indexOf(keyword) === -1) {
          ok = false;
        }

        if (selectedYear && selectedYear !== cardYear) {
          ok = false;
        }

        if (selectedType && cardType.indexOf(selectedType) === -1) {
          ok = false;
        }

        card.hidden = !ok;

        if (ok) {
          visible += 1;
        }
      });

      if (count) {
        count.textContent = visible + ' 部';
      }
    };

    [input, year, type].forEach(function (element) {
      if (element) {
        element.addEventListener('input', applyFilter);
        element.addEventListener('change', applyFilter);
      }
    });
  });
}());
