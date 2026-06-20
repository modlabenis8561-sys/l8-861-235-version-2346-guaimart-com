(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMobileMenu() {
    var button = document.querySelector(".mobile-menu-button");
    var nav = document.querySelector(".mobile-nav");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initHero() {
    var carousel = document.querySelector("[data-hero-carousel]");
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
    var prev = carousel.querySelector("[data-hero-prev]");
    var next = carousel.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function schedule() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 6200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        schedule();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        schedule();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        schedule();
      });
    }

    if (slides.length > 1) {
      schedule();
    }
  }

  function initFilters() {
    var grids = Array.prototype.slice.call(document.querySelectorAll(".searchable-grid"));
    if (!grids.length) {
      return;
    }
    var input = document.querySelector("[data-card-search]");
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-filter-token]"));
    var empty = document.querySelector("[data-empty-state]");
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";
    var activeToken = "";

    if (input && initialQuery) {
      input.value = initialQuery;
    }

    function applyFilter() {
      var query = input ? input.value.trim().toLowerCase() : "";
      var visible = 0;
      grids.forEach(function (grid) {
        var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
        cards.forEach(function (card) {
          var haystack = (card.getAttribute("data-search") || "").toLowerCase();
          var matchedQuery = !query || haystack.indexOf(query) !== -1;
          var matchedToken = !activeToken || haystack.indexOf(activeToken.toLowerCase()) !== -1;
          var showCard = matchedQuery && matchedToken;
          card.hidden = !showCard;
          if (showCard) {
            visible += 1;
          }
        });
      });
      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    if (input) {
      input.addEventListener("input", applyFilter);
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        buttons.forEach(function (item) {
          item.classList.remove("is-active");
        });
        button.classList.add("is-active");
        activeToken = button.getAttribute("data-filter-token") || "";
        applyFilter();
      });
    });

    applyFilter();
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll(".player-shell"));
    players.forEach(function (shell) {
      var video = shell.querySelector("video");
      var button = shell.querySelector(".play-cover");
      var source = video ? video.querySelector("source") : null;
      if (!video || !source) {
        return;
      }
      var streamUrl = source.getAttribute("src");
      var loaded = false;
      var hls = null;

      function attachStream() {
        if (loaded) {
          return;
        }
        if (window.Hls && window.Hls.isSupported() && !video.canPlayType("application/vnd.apple.mpegurl")) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(streamUrl);
          hls.attachMedia(video);
        } else {
          video.src = streamUrl;
          video.load();
        }
        loaded = true;
      }

      function playVideo() {
        attachStream();
        shell.classList.add("is-playing");
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {
            shell.classList.remove("is-playing");
          });
        }
      }

      if (button) {
        button.addEventListener("click", playVideo);
      }

      video.addEventListener("play", function () {
        shell.classList.add("is-playing");
      });

      video.addEventListener("pause", function () {
        if (video.currentTime === 0 || video.ended) {
          shell.classList.remove("is-playing");
        }
      });

      video.addEventListener("ended", function () {
        shell.classList.remove("is-playing");
      });

      window.addEventListener("pagehide", function () {
        if (hls) {
          hls.destroy();
          hls = null;
        }
      });
    });
  }

  ready(function () {
    initMobileMenu();
    initHero();
    initFilters();
    initPlayers();
  });
})();
