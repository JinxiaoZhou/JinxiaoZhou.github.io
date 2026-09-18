/* =========================================================================
   Portfolio — interaction layer
   Vanilla JS, no dependencies. Progressive enhancement: the page is fully
   readable without it (English is baked into the markup).
   ========================================================================= */

(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var I18N = window.PORTFOLIO_I18N || { zh: {}, meta: {} };

  var STORAGE_LANG = "portfolio-lang";
  var STORAGE_THEME = "portfolio-theme";
  var DEFAULT_LANG = "en"; // English is the primary language

  /* ---------------------------------------------------------------------
     Capture the English source text so switching back never loses markup
     --------------------------------------------------------------------- */
  var textNodes = [];   // { el, key, original }
  var ariaNodes = [];   // { el, key, original }
  var titleEl = doc.querySelector("title");
  var metaDesc = doc.querySelector('meta[name="description"]');
  var metaOgTitle = doc.querySelector('meta[property="og:title"]');
  var metaOgDesc = doc.querySelector('meta[property="og:description"]');

  Array.prototype.forEach.call(doc.querySelectorAll("[data-i18n]"), function (el) {
    textNodes.push({ el: el, key: el.getAttribute("data-i18n"), original: el.innerHTML });
  });

  Array.prototype.forEach.call(doc.querySelectorAll("[data-i18n-html]"), function (el) {
    textNodes.push({ el: el, key: el.getAttribute("data-i18n-html"), original: el.innerHTML });
  });

  Array.prototype.forEach.call(doc.querySelectorAll("[data-i18n-aria]"), function (el) {
    ariaNodes.push({ el: el, key: el.getAttribute("data-i18n-aria"), original: el.getAttribute("aria-label") || "" });
  });

  var metaOriginal = {
    title: titleEl ? titleEl.textContent : "",
    description: metaDesc ? metaDesc.getAttribute("content") : "",
    ogTitle: metaOgTitle ? metaOgTitle.getAttribute("content") : "",
    ogDesc: metaOgDesc ? metaOgDesc.getAttribute("content") : ""
  };

  /* ---------------------------------------------------------------------
     Language-dependent file links (one résumé per language)
     Any element carrying data-href-en / data-href-zh gets its href swapped
     when the language changes, so the download also serves the right file.
     --------------------------------------------------------------------- */
  var linkNodes = [];
  Array.prototype.forEach.call(doc.querySelectorAll("[data-href-en][data-href-zh]"), function (el) {
    linkNodes.push({
      el: el,
      en: el.getAttribute("data-href-en"),
      zh: el.getAttribute("data-href-zh")
    });
  });

  function applyLanguageLinks(lang) {
    linkNodes.forEach(function (item) {
      item.el.setAttribute("href", lang === "zh" ? item.zh : item.en);
    });
  }

  function lookup(key, lang) {
    if (lang === "en") return null;
    var table = I18N[lang];
    return table && Object.prototype.hasOwnProperty.call(table, key) ? table[key] : null;
  }

  /* ---------------------------------------------------------------------
     Language
     --------------------------------------------------------------------- */
  var langButtons = Array.prototype.slice.call(doc.querySelectorAll("[data-lang]"));

  function applyLanguage(lang, persist) {
    if (lang !== "zh" && lang !== "en") lang = DEFAULT_LANG;

    textNodes.forEach(function (item) {
      var translated = lookup(item.key, lang);
      item.el.innerHTML = translated !== null ? translated : item.original;
    });

    ariaNodes.forEach(function (item) {
      var translated = lookup(item.key, lang);
      item.el.setAttribute("aria-label", translated !== null ? translated : item.original);
    });

    var meta = I18N.meta && I18N.meta[lang];
    if (meta) {
      if (titleEl) titleEl.textContent = meta.title;
      doc.title = meta.title;
      if (metaDesc) metaDesc.setAttribute("content", meta.description);
      if (metaOgTitle) metaOgTitle.setAttribute("content", meta.title);
      if (metaOgDesc) metaOgDesc.setAttribute("content", meta.description);
    } else {
      if (titleEl) titleEl.textContent = metaOriginal.title;
      doc.title = metaOriginal.title;
      if (metaDesc) metaDesc.setAttribute("content", metaOriginal.description);
      if (metaOgTitle) metaOgTitle.setAttribute("content", metaOriginal.ogTitle);
      if (metaOgDesc) metaOgDesc.setAttribute("content", metaOriginal.ogDesc);
    }

    root.setAttribute("lang", lang === "zh" ? "zh-CN" : "en");
    root.setAttribute("data-lang", lang);

    applyLanguageLinks(lang);

    langButtons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === lang));
    });

    refreshMenuLabel(lang);

    if (persist) {
      try { localStorage.setItem(STORAGE_LANG, lang); } catch (e) {}
    }
  }

  function currentLang() {
    return root.getAttribute("data-lang") === "zh" ? "zh" : "en";
  }

  langButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = btn.getAttribute("data-lang");
      if (next === currentLang()) return;
      applyLanguage(next, true);
    });
  });

  /* ---------------------------------------------------------------------
     Theme
     --------------------------------------------------------------------- */
  var themeToggle = doc.getElementById("theme-toggle");

  function setTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    var meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f6f8fb" : "#0b0f14");
    if (persist) {
      try { localStorage.setItem(STORAGE_THEME, theme); } catch (e) {}
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      setTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light", true);
    });
  }

  /* ---------------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------------- */
  var navToggle = doc.getElementById("nav-toggle");
  var nav = doc.getElementById("primary-nav");

  var MENU_LABEL = {
    en: { open: "Open menu", close: "Close menu" },
    zh: { open: "打开导航菜单", close: "关闭导航菜单" }
  };

  function refreshMenuLabel(lang) {
    if (!navToggle || !nav) return;
    var labels = MENU_LABEL[lang] || MENU_LABEL.en;
    navToggle.setAttribute("aria-label", nav.classList.contains("is-open") ? labels.close : labels.open);
  }

  function setMenu(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    refreshMenuLabel(currentLang());
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setMenu(false);
        navToggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) setMenu(false);
    });
  }

  /* ---------------------------------------------------------------------
     Header state + scroll progress + back to top
     --------------------------------------------------------------------- */
  var header = doc.getElementById("site-header");
  var progress = doc.getElementById("scroll-progress");
  var toTop = doc.getElementById("to-top");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    var max = doc.documentElement.scrollHeight - window.innerHeight;

    if (header) header.classList.toggle("is-scrolled", y > 8);
    if (progress) progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    if (toTop) toTop.hidden = y < 600;
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  if (toTop) {
    toTop.addEventListener("click", function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------------------- */
  var revealEls = Array.prototype.slice.call(doc.querySelectorAll(".reveal"));

  if (!("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 4, 3) * 60 + "ms";
      revealObserver.observe(el);
    });
  }

  /* ---------------------------------------------------------------------
     Active section in navigation
     --------------------------------------------------------------------- */
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll('.nav-list a[href^="#"]'));
  var sections = navLinks
    .map(function (a) { return doc.getElementById(a.getAttribute("href").slice(1)); })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  /* ---------------------------------------------------------------------
     Footer year
     --------------------------------------------------------------------- */
  var yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------------------------------------------------------------
     Graceful résumé link: hide the button when the PDF for the active
     language has not been uploaded yet. Only meaningful over http/https,
     since file:// blocks the request.
     --------------------------------------------------------------------- */
  (function () {
    var link = doc.querySelector(".hero-actions a[download]");
    if (!link || !/^https?:$/.test(window.location.protocol) || !window.fetch) return;

    var checked = {};

    function verify() {
      var href = link.getAttribute("href");
      if (!href || typeof checked[href] === "boolean") {
        if (typeof checked[href] === "boolean") link.hidden = checked[href];
        return;
      }
      link.hidden = true;
      fetch(href, { method: "HEAD" })
        .then(function (res) {
          checked[href] = !res.ok;
          if (link.getAttribute("href") === href) link.hidden = checked[href];
        })
        .catch(function () {
          checked[href] = true;
          if (link.getAttribute("href") === href) link.hidden = true;
        });
    }

    // Re-check whenever the language switch changes the target file.
    var observer = new MutationObserver(verify);
    observer.observe(link, { attributes: true, attributeFilter: ["href"] });
    verify();
  })();

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */
  var savedLang = DEFAULT_LANG;
  try {
    var stored = localStorage.getItem(STORAGE_LANG);
    if (stored === "zh" || stored === "en") savedLang = stored;
  } catch (e) {}

  applyLanguage(savedLang, false);
  onScroll();
})();
