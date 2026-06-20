(function () {
  document.querySelectorAll('[data-player]').forEach(function (shell) {
    var stream = shell.getAttribute('data-stream');
    var video = shell.querySelector('video');
    var overlay = shell.querySelector('[data-play-button]');
    var started = false;
    var hls = null;

    function bindStream() {
      if (!video || !stream || started) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }

      started = true;
    }

    function playVideo() {
      bindStream();
      shell.classList.add('is-playing');
      if (video) {
        video.controls = true;
        var playTask = video.play();
        if (playTask && typeof playTask.catch === 'function') {
          playTask.catch(function () {});
        }
      }
    }

    if (overlay) {
      overlay.addEventListener('click', playVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          playVideo();
        }
      });
      video.addEventListener('play', function () {
        shell.classList.add('is-playing');
      });
    }

    window.addEventListener('pagehide', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  });
})();
