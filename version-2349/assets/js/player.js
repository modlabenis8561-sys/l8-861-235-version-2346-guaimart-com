
import { H as Hls } from './hls-vendor.js';

const players = document.querySelectorAll('.js-player');

players.forEach((container) => {
  const video = container.querySelector('video');
  const button = container.querySelector('.player-overlay');
  const source = container.getAttribute('data-play');
  let hls = null;
  let loaded = false;

  const attach = () => {
    if (!video || !source || loaded) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }

    loaded = true;
  };

  const play = () => {
    attach();
    container.classList.add('is-playing');
    const promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => {});
    }
  };

  if (button) {
    button.addEventListener('click', play);
  }

  if (video) {
    video.addEventListener('click', () => {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', () => {
      container.classList.add('is-playing');
    });
  }

  window.addEventListener('pagehide', () => {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
});
