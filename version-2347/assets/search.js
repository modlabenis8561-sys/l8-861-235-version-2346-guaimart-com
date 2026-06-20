(function () {
  var movies = window.__MOVIES__ || [];
  var params = new URLSearchParams(window.location.search);
  var query = (params.get('q') || '').trim();
  var resultBox = document.getElementById('search-results');
  var titleBox = document.getElementById('search-title');
  var searchInput = document.getElementById('search-input');

  if (searchInput) {
    searchInput.value = query;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function matchMovie(movie, words) {
    var text = [
      movie.title,
      movie.year,
      movie.region,
      movie.type,
      movie.genre,
      movie.category,
      movie.oneLine,
      (movie.tags || []).join(' ')
    ].join(' ').toLowerCase();

    return words.every(function (word) {
      return text.indexOf(word) !== -1;
    });
  }

  function card(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card">',
      '  <a class="poster" href="' + escapeHtml(movie.url) + '">',
      '    <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="duration">' + escapeHtml(movie.rating) + '分</span>',
      '    <span class="play-badge">▶</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <div class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
      '    <h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  if (!resultBox) {
    return;
  }

  var words = query.toLowerCase().split(/\s+/).filter(Boolean);
  var results = words.length ? movies.filter(function (movie) {
    return matchMovie(movie, words);
  }) : movies.slice(0, 48);

  if (titleBox) {
    titleBox.textContent = words.length ? '搜索结果' : '热门影片';
  }

  if (!results.length) {
    resultBox.innerHTML = '<div class="empty-state">没有找到匹配影片，可以尝试更换片名、类型、地区或年份。</div>';
    return;
  }

  resultBox.innerHTML = results.slice(0, 120).map(card).join('');
})();
