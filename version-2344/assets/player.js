(function () {
  "use strict";

  document.querySelectorAll("video[data-video]").forEach(function (video) {
    var source = video.getAttribute("data-video");
    var frame = video.closest(".player-frame");
    var playButton = frame ? frame.querySelector("[data-play-button]") : null;
    var message = frame ? frame.querySelector("[data-player-message]") : null;
    var loaded = false;
    var hls = null;

    function setMessage(text) {
      if (message) {
        message.textContent = text || "";
      }
    }

    function load() {
      if (loaded || !source) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setMessage("");
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setMessage("视频加载失败，请刷新页面重试");
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else {
        setMessage("此浏览器暂不支持该播放格式");
      }

      loaded = true;
    }

    function play() {
      load();
      var action = video.play();

      if (action && typeof action.then === "function") {
        action.then(function () {
          if (frame) {
            frame.classList.add("is-playing");
          }
        }).catch(function () {
          setMessage("点击视频画面即可继续播放");
        });
      } else if (frame) {
        frame.classList.add("is-playing");
      }
    }

    if (playButton) {
      playButton.addEventListener("click", play);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener("play", function () {
      if (frame) {
        frame.classList.add("is-playing");
      }
    });

    video.addEventListener("pause", function () {
      if (frame && video.currentTime === 0) {
        frame.classList.remove("is-playing");
      }
    });

    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
