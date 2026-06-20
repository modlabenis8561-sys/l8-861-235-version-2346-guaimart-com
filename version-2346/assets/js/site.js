(function () {
    'use strict';

    var fallbackStreams = [
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/e398cb38b257828eeedbcaa0ae2856da/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/77ae15566dde5cfb920bae4712a38399/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/41cb67b47a3668efaea014219666e659/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/31227358d3c181b7168e28ad248cfb4e/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/d0af4221b8947fda8c23f4955947cb58/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/e70b98acb53eb889d108057988609efb/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/86ea18f9954dbaf22eff5e16c41b4a25/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/2df81e778442675885257ce3e84c7173/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/af3d3f3b4940cee04efcd8ff2c9eef0a/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/60b4ddb3d166e1239abfc7adf611a6a3/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/a27121d514ff0079e1e81a6678f14e0c/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/f0d38b8679a1231eff816a8e04cc1a0c/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/c66b5309b3b64d15ed856810d6cc0b72/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/c99d86ece73a935b77e57d322461ddb5/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/fe0c41d994d01211debb24e84e3384a9/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/929fdb8e536c1fc43a83b32d1a838547/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/fbc04ae173a0e633458658e80ee78c2a/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/0ba4f146b0e6ea192526706f495d460f/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/1e53f0e1aef7ec2fb5f30ef5d309d69c/manifest/video.m3u8",
    "https://customer-7t103rn8rocxo5v6.cloudflarestream.com/1116997bf50b78f22bbfaced8975a021/manifest/video.m3u8"
];

    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function initMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            button.classList.toggle('is-open');
            nav.classList.toggle('is-open');
        });
    }

    function initHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer = null;

        function show(next) {
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, current) {
                slide.classList.toggle('is-active', current === index);
            });
            dots.forEach(function (dot, current) {
                dot.classList.toggle('is-active', current === index);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var next = parseInt(dot.getAttribute('data-hero-dot'), 10) || 0;
                show(next);
                restart();
            });
        });

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5600);
        }

        restart();
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function initFilters() {
        var input = document.querySelector('[data-search-input]');
        var region = document.querySelector('[data-filter-region]');
        var year = document.querySelector('[data-filter-year]');
        var genre = document.querySelector('[data-filter-genre]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
        var status = document.querySelector('[data-search-status]');
        if (!cards.length || (!input && !region && !year && !genre)) {
            return;
        }

        function apply() {
            var keyword = normalize(input && input.value);
            var regionValue = normalize(region && region.value);
            var yearValue = normalize(year && year.value);
            var genreValue = normalize(genre && genre.value);
            var visible = 0;

            cards.forEach(function (card) {
                var search = normalize(card.getAttribute('data-search'));
                var cardRegion = normalize(card.getAttribute('data-region'));
                var cardYear = normalize(card.getAttribute('data-year'));
                var cardGenre = normalize(card.getAttribute('data-genre'));
                var match = true;

                if (keyword && search.indexOf(keyword) === -1) {
                    match = false;
                }
                if (regionValue && cardRegion !== regionValue) {
                    match = false;
                }
                if (yearValue && cardYear !== yearValue) {
                    match = false;
                }
                if (genreValue && cardGenre.indexOf(genreValue) === -1 && search.indexOf(genreValue) === -1) {
                    match = false;
                }

                card.classList.toggle('is-hidden', !match);
                if (match) {
                    visible += 1;
                }
            });

            if (status) {
                status.textContent = visible > 0 ? '筛选结果已更新' : '没有匹配内容';
            }
        }

        [input, region, year, genre].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });

        apply();
    }

    function initPlayer() {
        var video = document.getElementById('movie-player');
        var overlay = document.querySelector('[data-player-toggle]');
        var message = document.querySelector('[data-player-message]');
        if (!video) {
            return;
        }

        var source = video.getAttribute('data-src') || fallbackStreams[0] || '';
        var hls = null;
        var loaded = false;

        function setMessage(text) {
            if (message) {
                message.textContent = text || '';
            }
        }

        function bindSource() {
            if (loaded || !source) {
                return;
            }
            loaded = true;

            if (window.Hls && window.Hls.isSupported && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 90
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.ERROR, function (eventName, data) {
                    if (data && data.fatal) {
                        setMessage('视频加载失败，请刷新页面重试');
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else {
                setMessage('当前浏览器不支持 HLS 播放');
            }
        }

        function playVideo() {
            bindSource();
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {
                    setMessage('请再次点击播放按钮开始播放');
                });
            }
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        }

        if (overlay) {
            overlay.addEventListener('click', playVideo);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo();
            } else {
                video.pause();
            }
        });

        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        });

        video.addEventListener('pause', function () {
            if (overlay && video.currentTime === 0) {
                overlay.classList.remove('is-hidden');
            }
        });

        window.addEventListener('pagehide', function () {
            if (hls && hls.destroy) {
                hls.destroy();
            }
        });
    }

    ready(function () {
        initMenu();
        initHero();
        initFilters();
        initPlayer();
    });
}());
