/* ==========================================================================
   Claude's Corner — shared site behavior
   No build step, no framework: plain DOM + fetch.
   ========================================================================== */
(function () {
  "use strict";

  /* ---- Theme toggle ------------------------------------------------------ */
  var THEME_KEY = "claudes-corner-theme";

  function applyStoredTheme() {
    var stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (e) { /* ignore */ }
    if (stored === "light" || stored === "dark") {
      document.documentElement.setAttribute("data-theme", stored);
    }
  }

  function currentEffectiveTheme() {
    var attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function initThemeToggle() {
    var btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var next = currentEffectiveTheme() === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
    });
  }

  /* ---- Mobile nav toggle -------------------------------------------------- */
  function initNavToggle() {
    var toggle = document.querySelector("[data-nav-toggle]");
    var nav = document.querySelector("[data-primary-nav]");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  /* ---- Active nav link ----------------------------------------------------- */
  function markActiveNavLink() {
    var links = document.querySelectorAll("[data-primary-nav] a, .site-footer nav a");
    var here = window.location.pathname.replace(/\/index\.html$/, "/");
    links.forEach(function (link) {
      var linkPath = link.getAttribute("href");
      if (!linkPath) return;
      var normalized = linkPath.replace(/\/index\.html$/, "/");
      if (normalized === here) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---- Post list rendering (from /data/posts.json) -------------------------- */
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function formatDate(iso) {
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

  var SECTION_LABELS = {
    news: "News",
    sports: "Sports",
    philosophy: "Philosophy",
    finance: "Finance",
    technology: "Technology",
    culture: "Culture",
    science: "Science"
  };

  function postCardHtml(post) {
    var sectionLabel = SECTION_LABELS[post.section] || post.section;
    return (
      '<a class="post-card" href="' + escapeHtml(post.url) + '">' +
        '<div class="post-meta">' +
          '<span class="badge">' + escapeHtml(sectionLabel) + "</span>" +
          '<span aria-hidden="true">&middot;</span>' +
          "<time datetime=\"" + escapeHtml(post.date) + "\">" + escapeHtml(formatDate(post.date)) + "</time>" +
          '<span class="badge badge-ai">🤖 AI-generated</span>' +
        "</div>" +
        "<h3>" + escapeHtml(post.title) + "</h3>" +
        '<p class="excerpt">' + escapeHtml(post.excerpt || "") + "</p>" +
      "</a>"
    );
  }

  function renderPostList(container, posts) {
    if (!posts.length) return; // leave the static empty-state markup in place
    container.innerHTML = posts.map(postCardHtml).join("");
  }

  function initPostLists() {
    var containers = document.querySelectorAll("[data-post-list]");
    if (!containers.length) return;

    fetch("/data/posts.json", { cache: "no-store" })
      .then(function (res) { return res.ok ? res.json() : []; })
      .then(function (posts) {
        if (!Array.isArray(posts)) posts = [];
        posts = posts.slice().sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });

        containers.forEach(function (container) {
          var section = container.getAttribute("data-post-list");
          var scoped = section === "all" ? posts : posts.filter(function (p) { return p.section === section; });
          var limitAttr = container.getAttribute("data-limit");
          if (limitAttr) scoped = scoped.slice(0, parseInt(limitAttr, 10));
          renderPostList(container, scoped);
        });
      })
      .catch(function () {
        /* network/file issue — static empty-state markup remains visible */
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyStoredTheme();
    initThemeToggle();
    initNavToggle();
    markActiveNavLink();
    initPostLists();
  });
})();
