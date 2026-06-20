(function () {
  "use strict";

  var input = document.querySelector("[data-search-input]");
  var results = document.querySelector("[data-search-results]");
  var status = document.querySelector("[data-search-status]");
  var params = new URLSearchParams(window.location.search);
  var query = (params.get("q") || "").trim();

  function createCard(item) {
    var card = document.createElement("a");
    var poster = document.createElement("span");
    var img = document.createElement("img");
    var shade = document.createElement("span");
    var type = document.createElement("span");
    var play = document.createElement("span");
    var body = document.createElement("span");
    var title = document.createElement("strong");
    var meta = document.createElement("small");
    var line = document.createElement("em");
    var tags = document.createElement("span");

    card.className = "movie-card js-movie-card";
    card.href = item.href;
    poster.className = "poster-wrap";
    img.src = item.image;
    img.alt = item.title;
    img.loading = "lazy";
    shade.className = "poster-shade";
    type.className = "card-type";
    type.textContent = item.category;
    play.className = "play-mark";
    play.textContent = "▶";
    body.className = "card-body";
    title.textContent = item.title;
    meta.textContent = item.year + " · " + item.region + " · " + item.type;
    line.textContent = item.oneLine;
    tags.className = "tag-row";

    item.tags.slice(0, 3).forEach(function (tag) {
      var tagNode = document.createElement("span");
      tagNode.textContent = tag;
      tags.appendChild(tagNode);
    });

    poster.appendChild(img);
    poster.appendChild(shade);
    poster.appendChild(type);
    poster.appendChild(play);
    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(line);
    body.appendChild(tags);
    card.appendChild(poster);
    card.appendChild(body);
    return card;
  }

  function render(term) {
    if (!results || !Array.isArray(window.CATALOG_ITEMS)) {
      return;
    }

    var normalized = term.trim().toLowerCase();
    var list = window.CATALOG_ITEMS.filter(function (item) {
      if (!normalized) {
        return true;
      }

      return item.search.indexOf(normalized) !== -1;
    }).slice(0, normalized ? 120 : 48);

    results.innerHTML = "";

    if (status) {
      status.textContent = normalized ? "以下是匹配内容" : "热门内容";
    }

    if (!list.length) {
      if (status) {
        status.textContent = "没有匹配内容，请尝试更换关键词";
      }
      return;
    }

    list.forEach(function (item) {
      results.appendChild(createCard(item));
    });
  }

  if (input) {
    input.value = query;
    input.addEventListener("input", function () {
      render(input.value);
    });
  }

  render(query);
})();
