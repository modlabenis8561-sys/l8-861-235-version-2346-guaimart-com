(function () {
  var body = document.body;
  var menuButton = document.querySelector('[data-menu-button]');

  if (menuButton) {
    menuButton.addEventListener('click', function () {
      body.classList.toggle('nav-open');
    });
  }

  document.querySelectorAll('.hero-slider').forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var previous = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5600);
    }

    if (previous) {
      previous.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        restart();
      });
    });

    show(0);
    restart();
  });

  document.querySelectorAll('[data-card-filter]').forEach(function (input) {
    var target = document.querySelector(input.getAttribute('data-card-filter'));
    if (!target) {
      return;
    }

    var cards = Array.prototype.slice.call(target.querySelectorAll('[data-search]'));

    input.addEventListener('input', function () {
      var value = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        card.style.display = !value || text.indexOf(value) !== -1 ? '' : 'none';
      });
    });
  });
})();
