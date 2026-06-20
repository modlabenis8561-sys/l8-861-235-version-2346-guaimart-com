(function () {
  var input = document.getElementById('searchInput');
  var button = document.getElementById('searchButton');
  var results = document.getElementById('searchResults');
  var status = document.getElementById('searchStatus');
  var data = [];

  var getQuery = function () {
    var params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  };

  var viewCount = function (value) {
    if (value >= 10000) {
      return (value / 10000).toFixed(1) + '万';
    }
    return String(value);
  };

  var escapeHtml = function (text) {
    return String(text).replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  };

  var render = function (items, label) {
    status.textContent = label;
    results.innerHTML = items.map(function (movie) {
      return '<article class="movie-card">'
        + '<a href="' + movie.url + '" class="poster-shell" aria-label="观看' + escapeHtml(movie.title) + '">'
        + '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">'
        + '<span class="duration">' + escapeHtml(movie.duration) + '</span>'
        + '<span class="play-mark">▶</span>'
        + '</a>'
        + '<div class="card-body">'
        + '<div class="card-meta"><span>' + escapeHtml(movie.category) + '</span><span>' + escapeHtml(movie.year) + '</span></div>'
        + '<h2><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h2>'
        + '<p>' + escapeHtml(movie.oneLine || movie.genre) + '</p>'
        + '<div class="card-score"><span>👁 ' + viewCount(movie.views) + '</span><span>★ ' + Number(movie.rating).toFixed(1) + '</span></div>'
        + '</div>'
        + '</article>';
    }).join('');

    results.querySelectorAll('img').forEach(function (image) {
      image.addEventListener('error', function () {
        image.classList.add('image-missing');
      });
    });
  };

  var search = function () {
    var keyword = input.value.trim().toLowerCase();

    if (!keyword) {
      render(data.slice(0, 24), '热门推荐');
      return;
    }

    var found = data.filter(function (movie) {
      return movie.searchText.indexOf(keyword) !== -1;
    }).slice(0, 80);

    render(found, '找到 ' + found.length + ' 条相关结果');
  };

  fetch('assets/search-data.json')
    .then(function (response) {
      return response.json();
    })
    .then(function (items) {
      data = items;
      var query = getQuery();

      if (query) {
        input.value = query;
      }

      search();
    });

  if (button) {
    button.addEventListener('click', search);
  }

  if (input) {
    input.addEventListener('input', search);
  }
}());
