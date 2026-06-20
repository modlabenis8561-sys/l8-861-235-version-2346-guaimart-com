(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  onReady(function () {
    initMenu();
    initSliders();
    initFilters();
    initPlayers();
  });

  function initMenu() {
    var button = document.querySelector("[data-nav-toggle]");
    var panel = document.querySelector("[data-mobile-nav]");

    if (!button || !panel) {
      return;
    }

    button.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function initSliders() {
    document.querySelectorAll("[data-slider]").forEach(function (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-slide]"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-slide-dot]"));
      var prev = slider.querySelector("[data-slider-prev]");
      var next = slider.querySelector("[data-slider-next]");
      var active = 0;
      var timer = null;

      if (!slides.length) {
        return;
      }

      function show(index) {
        active = (index + slides.length) % slides.length;

        slides.forEach(function (slide, itemIndex) {
          slide.classList.toggle("is-active", itemIndex === active);
        });

        dots.forEach(function (dot, itemIndex) {
          dot.classList.toggle("is-active", itemIndex === active);
          dot.setAttribute("aria-current", itemIndex === active ? "true" : "false");
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }

        timer = window.setInterval(function () {
          show(active + 1);
        }, 5200);
      }

      if (prev) {
        prev.addEventListener("click", function () {
          show(active - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(active + 1);
          restart();
        });
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
          restart();
        });
      });

      show(0);
      restart();
    });
  }

  function initFilters() {
    document.querySelectorAll("[data-filter-root]").forEach(function (root) {
      var search = root.querySelector("[data-search-input]");
      var type = root.querySelector("[data-filter-type]");
      var year = root.querySelector("[data-filter-year]");
      var region = root.querySelector("[data-filter-region]");
      var cards = Array.prototype.slice.call(root.querySelectorAll("[data-card]"));

      function valueOf(element) {
        return element ? String(element.value || "").trim().toLowerCase() : "";
      }

      function apply() {
        var keyword = valueOf(search);
        var selectedType = valueOf(type);
        var selectedYear = valueOf(year);
        var selectedRegion = valueOf(region);

        cards.forEach(function (card) {
          var text = [
            card.getAttribute("data-title"),
            card.getAttribute("data-tags"),
            card.getAttribute("data-region"),
            card.getAttribute("data-genre")
          ].join(" ").toLowerCase();
          var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchedType = !selectedType || String(card.getAttribute("data-type") || "").toLowerCase() === selectedType;
          var matchedYear = !selectedYear || String(card.getAttribute("data-year") || "").toLowerCase() === selectedYear;
          var matchedRegion = !selectedRegion || String(card.getAttribute("data-region") || "").toLowerCase().indexOf(selectedRegion) !== -1;

          card.hidden = !(matchedKeyword && matchedType && matchedYear && matchedRegion);
        });
      }

      [search, type, year, region].forEach(function (element) {
        if (element) {
          element.addEventListener("input", apply);
          element.addEventListener("change", apply);
        }
      });
    });
  }

  function initPlayers() {
    document.querySelectorAll("[data-player]").forEach(function (player) {
      var video = player.querySelector("video");
      var button = player.querySelector("[data-play-button]");
      var message = player.querySelector("[data-player-message]");

      if (!video || !button) {
        return;
      }

      function showMessage(text) {
        if (!message) {
          return;
        }

        message.textContent = text;
        message.classList.add("is-visible");
      }

      function attachStream() {
        if (video.getAttribute("data-ready") === "1") {
          return;
        }

        var stream = video.getAttribute("data-stream");

        if (!stream) {
          return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          video.hlsController = hls;
        } else {
          video.src = stream;
        }

        video.setAttribute("data-ready", "1");
      }

      function play() {
        attachStream();
        button.classList.add("is-hidden");
        var promise = video.play();

        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            button.classList.remove("is-hidden");
            showMessage("播放加载失败，请稍后再试。");
          });
        }
      }

      button.addEventListener("click", play);
      player.addEventListener("click", function (event) {
        if (event.target === video && video.paused) {
          play();
        }
      });
      video.addEventListener("play", function () {
        button.classList.add("is-hidden");
      });
      video.addEventListener("pause", function () {
        if (!video.ended) {
          button.classList.remove("is-hidden");
        }
      });
      video.addEventListener("ended", function () {
        button.classList.remove("is-hidden");
      });
    });
  }
})();
