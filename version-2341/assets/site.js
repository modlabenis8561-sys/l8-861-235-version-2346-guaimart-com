(function () {
  "use strict";

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function activateHero(hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var next = hero.querySelector(".hero-next");
    var prev = hero.querySelector(".hero-prev");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle("is-active", position === index);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle("is-active", position === index);
      });
    }

    function play() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        play();
      });
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        play();
      });
    }

    dots.forEach(function (dot, position) {
      dot.addEventListener("click", function () {
        show(position);
        play();
      });
    });

    show(0);
    play();
  }

  function activateSearch(input) {
    var scope = input.closest("[data-search-scope]") || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .ranking-card"));

    input.addEventListener("input", function () {
      var value = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
        card.classList.toggle("is-hidden", value && text.indexOf(value) === -1);
      });
    });
  }

  function activateMenu() {
    var button = document.querySelector(".menu-toggle");
    var nav = document.querySelector(".mobile-nav");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  ready(function () {
    activateMenu();
    var hero = document.querySelector("[data-hero]");
    if (hero) {
      activateHero(hero);
    }
    Array.prototype.slice.call(document.querySelectorAll("[data-search-input]")).forEach(activateSearch);
  });

  window.initMoviePlayer = function (streamUrl, videoId, coverId) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    var attached = false;
    var pending = false;
    var hls = null;

    if (!video || !cover || !streamUrl) {
      return;
    }

    function requestPlay() {
      var action = video.play();
      if (action && typeof action.catch === "function") {
        action.catch(function () {
          cover.classList.remove("is-hidden");
        });
      }
    }

    function attach() {
      if (attached) {
        return;
      }
      attached = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        if (pending) {
          requestPlay();
        }
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new Hls({ enableWorker: true });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          if (pending) {
            requestPlay();
          }
        });
        hls.on(Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            cover.classList.remove("is-hidden");
          }
        });
        return;
      }

      video.src = streamUrl;
      if (pending) {
        requestPlay();
      }
    }

    function start() {
      pending = true;
      cover.classList.add("is-hidden");
      attach();
      if (attached) {
        requestPlay();
      }
    }

    cover.addEventListener("click", start);
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      }
    });
    video.addEventListener("play", function () {
      cover.classList.add("is-hidden");
    });
    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
