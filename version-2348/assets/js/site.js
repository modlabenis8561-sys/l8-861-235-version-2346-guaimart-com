(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var mobileNav = document.querySelector("[data-mobile-nav]");

        if (toggle && mobileNav) {
            toggle.addEventListener("click", function () {
                mobileNav.classList.toggle("is-open");
            });
        }

        document.querySelectorAll("[data-site-search]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = form.querySelector("input[name='q']");
                var query = input ? input.value.trim() : "";
                var path = form.getAttribute("data-search-path") || "./search.html";
                window.location.href = query ? path + "?q=" + encodeURIComponent(query) : path;
            });
        });

        var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var current = 0;

        function setSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                setSlide(index);
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                setSlide(current + 1);
            }, 5200);
        }

        setSlide(0);

        var searchInput = document.querySelector("[data-card-search]");
        var yearFilter = document.querySelector("[data-year-filter]");
        var genreFilter = document.querySelector("[data-genre-filter]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-title]"));
        var emptyState = document.querySelector("[data-empty-state]");

        function normalize(text) {
            return (text || "").toString().toLowerCase();
        }

        function filterCards() {
            if (!cards.length) {
                return;
            }
            var keyword = normalize(searchInput ? searchInput.value.trim() : "");
            var year = yearFilter ? yearFilter.value : "";
            var genre = genreFilter ? genreFilter.value : "";
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags")
                ].join(" "));
                var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var matchYear = !year || card.getAttribute("data-year") === year;
                var matchGenre = !genre || normalize(card.getAttribute("data-genre")).indexOf(normalize(genre)) !== -1;
                var show = matchKeyword && matchYear && matchGenre;
                card.style.display = show ? "" : "none";
                if (show) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.style.display = visible ? "none" : "block";
            }
        }

        if (searchInput || yearFilter || genreFilter) {
            [searchInput, yearFilter, genreFilter].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", filterCards);
                    control.addEventListener("change", filterCards);
                }
            });

            var params = new URLSearchParams(window.location.search);
            var query = params.get("q");
            if (query && searchInput) {
                searchInput.value = query;
            }
            filterCards();
        }
    });
})();
