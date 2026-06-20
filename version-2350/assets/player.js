import { H as Hls } from './hls-vendor-dru42stk.js';

var players = document.querySelectorAll('[data-player]');

players.forEach(function (player) {
  var video = player.querySelector('video');
  var playButton = player.querySelector('[data-play]');

  if (!video || !playButton) {
    return;
  }

  var source = video.getAttribute('data-src');
  var hlsInstance = null;

  var loadVideo = function () {
    if (video.getAttribute('data-ready') === 'true') {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        maxBufferLength: 30,
        enableWorker: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }

    video.setAttribute('data-ready', 'true');
  };

  var activate = function () {
    loadVideo();
    player.classList.add('is-active');
    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        video.controls = true;
      });
    }
  };

  playButton.addEventListener('click', activate);

  video.addEventListener('click', function () {
    if (video.getAttribute('data-ready') !== 'true') {
      activate();
    }
  });

  video.addEventListener('emptied', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
});
