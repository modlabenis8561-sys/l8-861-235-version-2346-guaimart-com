(function () {
  function setupMoviePlayer(source, ids) {
    var video = document.getElementById(ids.videoId);
    var overlay = document.getElementById(ids.overlayId);
    var playButton = document.getElementById(ids.playButtonId);
    var centerButton = document.getElementById(ids.centerButtonId);
    var muteButton = document.getElementById(ids.muteButtonId);
    var fullscreenButton = document.getElementById(ids.fullscreenButtonId);
    var message = document.getElementById(ids.messageId);
    var controls = playButton ? playButton.closest('.player-controls') : null;
    var hls = null;

    if (!video || !source) {
      return;
    }

    function setMessage(text) {
      if (!message) {
        return;
      }

      message.textContent = text || '';
      message.classList.toggle('is-visible', Boolean(text));
    }

    function setPlayingState(isPlaying) {
      if (playButton) {
        playButton.textContent = isPlaying ? '❚❚' : '▶';
      }

      if (centerButton) {
        centerButton.textContent = isPlaying ? '❚❚' : '▶';
      }

      if (overlay) {
        overlay.classList.toggle('is-hidden', isPlaying);
      }

      if (controls) {
        controls.classList.toggle('is-active', isPlaying);
      }
    }

    function bindSource() {
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });

        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setMessage('');
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (!data || !data.fatal) {
            return;
          }

          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
            return;
          }

          if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
            return;
          }

          setMessage('播放暂时不可用，请稍后重试');
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else {
        setMessage('播放暂时不可用，请更换浏览器');
      }
    }

    function startPlayback() {
      var promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          setMessage('请再次点击播放');
        });
      }
    }

    function togglePlayback() {
      if (video.paused) {
        startPlayback();
      } else {
        video.pause();
      }
    }

    function handleButtonClick(event) {
      event.preventDefault();
      event.stopPropagation();
      togglePlayback();
    }

    bindSource();
    video.controls = true;
    video.addEventListener('play', function () {
      setPlayingState(true);
      setMessage('');
    });
    video.addEventListener('pause', function () {
      setPlayingState(false);
    });
    video.addEventListener('click', function () {
      togglePlayback();
    });

    if (overlay) {
      overlay.addEventListener('click', function () {
        startPlayback();
      });
    }

    if (playButton) {
      playButton.addEventListener('click', handleButtonClick);
    }

    if (centerButton) {
      centerButton.addEventListener('click', handleButtonClick);
    }

    if (muteButton) {
      muteButton.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        video.muted = !video.muted;
        muteButton.textContent = video.muted ? '🔇' : '🔊';
      });
    }

    if (fullscreenButton) {
      fullscreenButton.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.setupMoviePlayer = setupMoviePlayer;
})();
