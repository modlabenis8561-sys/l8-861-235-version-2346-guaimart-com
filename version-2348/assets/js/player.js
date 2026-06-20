(function () {
    window.initMoviePlayer = function (source) {
        var shell = document.querySelector("[data-player]");
        if (!shell) {
            return;
        }

        var video = shell.querySelector("video");
        var cover = shell.querySelector(".player-cover");
        var started = false;
        var hlsInstance = null;

        function bindSource() {
            if (started || !video) {
                return;
            }

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }

            started = true;
        }

        function startPlay() {
            bindSource();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            video.controls = true;
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {
                    video.controls = true;
                });
            }
        }

        if (cover) {
            cover.addEventListener("click", startPlay);
        }

        if (video) {
            video.addEventListener("click", function () {
                if (video.paused) {
                    startPlay();
                }
            });
        }

        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };
})();
