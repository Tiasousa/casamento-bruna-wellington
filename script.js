(function () {
  "use strict";

  /* ============================================================
     Contagem regressiva — 19/09/2026 às 16:00 (horário de Brasília)
     ============================================================ */
  var WEDDING_DATE = new Date("2026-09-19T16:00:00-03:00").getTime();

  var elDias = document.getElementById("cd-dias");
  var elHoras = document.getElementById("cd-horas");
  var elMinutos = document.getElementById("cd-minutos");
  var elSegundos = document.getElementById("cd-segundos");
  var elCountdown = document.getElementById("countdown");
  var elCountdownDone = document.getElementById("countdownDone");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function updateCountdown() {
    var now = new Date().getTime();
    var diff = WEDDING_DATE - now;

    if (diff <= 0) {
      if (elCountdown) elCountdown.hidden = true;
      if (elCountdownDone) elCountdownDone.hidden = false;
      return;
    }

    var dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    var horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    var minutos = Math.floor((diff / (1000 * 60)) % 60);
    var segundos = Math.floor((diff / 1000) % 60);

    if (elDias) elDias.textContent = pad(dias);
    if (elHoras) elHoras.textContent = pad(horas);
    if (elMinutos) elMinutos.textContent = pad(minutos);
    if (elSegundos) elSegundos.textContent = pad(segundos);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ============================================================
     Copiar chave PIX
     ============================================================ */
  var btnCopyPix = document.getElementById("btnCopyPix");
  var pixFeedback = document.getElementById("pixFeedback");
  var PIX_KEY = "047.276.171-45";
  var feedbackTimer = null;

  function showPixFeedback() {
    if (!pixFeedback) return;
    pixFeedback.hidden = false;
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(function () {
      pixFeedback.hidden = true;
    }, 3200);
  }

  function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      /* silencioso: ambiente sem suporte a cópia */
    }
    document.body.removeChild(textarea);
  }

  if (btnCopyPix) {
    btnCopyPix.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(PIX_KEY).then(showPixFeedback, function () {
          fallbackCopy(PIX_KEY);
          showPixFeedback();
        });
      } else {
        fallbackCopy(PIX_KEY);
        showPixFeedback();
      }
    });
  }

  /* ============================================================
     Menu mobile
     ============================================================ */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  /* ============================================================
     Animações de entrada (fade-in + subida suave)
     ============================================================ */
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var revealTargets = document.querySelectorAll(
    "[data-reveal], .gallery__item"
  );

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     Sombra de navegação ao rolar
     ============================================================ */
  var nav = document.getElementById("nav");
  if (nav) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 12) {
        nav.style.boxShadow = "0 8px 24px -18px rgba(16,32,59,0.4)";
      } else {
        nav.style.boxShadow = "none";
      }
    });
  }
})();
