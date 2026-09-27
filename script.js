(function () {
  "use strict";

  /* ============================================================
     Contagem regressiva — 19/09/2026 às 16h
     Horário de Brasília
     ============================================================ */

  var WEDDING_DATE = new Date("2026-09-19T16:00:00-03:00").getTime();

  var elDias = document.getElementById("cd-dias");
  var elHoras = document.getElementById("cd-horas");
  var elMinutos = document.getElementById("cd-minutos");
  var elSegundos = document.getElementById("cd-segundos");
  var elCountdown = document.getElementById("countdown");
  var elCountdownDone = document.getElementById("countdownDone");

  function pad(numero) {
    return String(numero).padStart(2, "0");
  }

  function updateCountdown() {
    var agora = Date.now();
    var diferenca = WEDDING_DATE - agora;

    if (diferenca <= 0) {
      if (elCountdown) {
        elCountdown.hidden = true;
      }

      if (elCountdownDone) {
        elCountdownDone.hidden = false;
      }

      return;
    }

    var dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    var horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
    var minutos = Math.floor((diferenca / (1000 * 60)) % 60);
    var segundos = Math.floor((diferenca / 1000) % 60);

    if (elDias) {
      elDias.textContent = pad(dias);
    }

    if (elHoras) {
      elHoras.textContent = pad(horas);
    }

    if (elMinutos) {
      elMinutos.textContent = pad(minutos);
    }

    if (elSegundos) {
      elSegundos.textContent = pad(segundos);
    }
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
    if (!pixFeedback) {
      return;
    }

    pixFeedback.hidden = false;
    clearTimeout(feedbackTimer);

    feedbackTimer = setTimeout(function () {
      pixFeedback.hidden = true;
    }, 3200);
  }

  function fallbackCopy(texto) {
    var textarea = document.createElement("textarea");

    textarea.value = texto;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";

    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
    } catch (erro) {
      console.error("Não foi possível copiar a chave PIX.", erro);
    }

    document.body.removeChild(textarea);
  }

  if (btnCopyPix) {
    btnCopyPix.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(PIX_KEY)
          .then(showPixFeedback)
          .catch(function () {
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
      var menuAberto = navMenu.classList.toggle("is-open");

      navToggle.setAttribute(
        "aria-expanded",
        menuAberto ? "true" : "false"
      );

      navToggle.setAttribute(
        "aria-label",
        menuAberto ? "Fechar menu" : "Abrir menu"
      );
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
     Galeria premium
     31 fotos | 6 visíveis | 1 troca a cada 8 segundos
     ============================================================ */

  var TOTAL_FOTOS = 31;
  var FOTOS_VISIVEIS = 6;
  var INTERVALO_TROCA = 8000;
  var DURACAO_FADE = 650;

  var gallery = document.getElementById("gallery");
  var todasAsFotos = [];
  var filaDeFotos = [];
  var fotosExibidas = [];
  var indiceSlotTroca = 0;
  var temporizadorGaleria = null;
  var lightboxIndice = 0;

  for (var numeroFoto = 1; numeroFoto <= TOTAL_FOTOS; numeroFoto += 1) {
    todasAsFotos.push(
      "assets/fotos/foto" +
      String(numeroFoto).padStart(2, "0") +
      ".jpeg"
    );
  }

  function embaralhar(lista) {
    var copia = lista.slice();

    for (var i = copia.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temporario = copia[i];

      copia[i] = copia[j];
      copia[j] = temporario;
    }

    return copia;
  }

  function recarregarFila() {
    filaDeFotos = embaralhar(
      todasAsFotos.filter(function (foto) {
        return fotosExibidas.indexOf(foto) === -1;
      })
    );

    if (filaDeFotos.length === 0) {
      filaDeFotos = embaralhar(todasAsFotos);
    }
  }

  function obterProximaFoto() {
    if (filaDeFotos.length === 0) {
      recarregarFila();
    }

    var proximaFoto = filaDeFotos.shift();
    var seguranca = 0;

    while (
      fotosExibidas.indexOf(proximaFoto) !== -1 &&
      seguranca < todasAsFotos.length
    ) {
      filaDeFotos.push(proximaFoto);
      proximaFoto = filaDeFotos.shift();
      seguranca += 1;
    }

    return proximaFoto;
  }

  function carregarImagem(caminho) {
    return new Promise(function (resolve, reject) {
      var imagem = new Image();

      imagem.onload = function () {
        resolve();
      };

      imagem.onerror = function () {
        reject(new Error("Erro ao carregar " + caminho));
      };

      imagem.src = caminho;
    });
  }

  function criarItemGaleria(caminho, indice) {
    var figure = document.createElement("figure");
    var imagem = document.createElement("img");

    figure.className = "gallery__item is-visible";
    figure.dataset.gallerySlot = String(indice);
    figure.dataset.fotoAtual = caminho;
    figure.tabIndex = 0;
    figure.setAttribute("role", "button");
    figure.setAttribute("aria-label", "Abrir foto em tela cheia");

    imagem.src = caminho;
    imagem.alt = "Bruna e Wellington — momento a dois";
    imagem.loading = "eager";
    imagem.decoding = "async";

    figure.appendChild(imagem);

    figure.addEventListener("click", function () {
      abrirLightbox(figure.dataset.fotoAtual);
    });

    figure.addEventListener("keydown", function (evento) {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        abrirLightbox(figure.dataset.fotoAtual);
      }
    });

    return figure;
  }

  function trocarUmaFoto() {
    if (!gallery || document.hidden) {
      return;
    }

    var itens = gallery.querySelectorAll(".gallery__item");

    if (itens.length !== FOTOS_VISIVEIS) {
      return;
    }

    var slot = indiceSlotTroca;
    var item = itens[slot];
    var imagem = item.querySelector("img");
    var novaFoto = obterProximaFoto();

    carregarImagem(novaFoto)
      .then(function () {
        item.classList.add("is-changing");

        setTimeout(function () {
          imagem.src = novaFoto;
          item.dataset.fotoAtual = novaFoto;
          fotosExibidas[slot] = novaFoto;
          item.classList.remove("is-changing");
        }, DURACAO_FADE);
      })
      .catch(function (erro) {
        console.warn(erro.message);
      });

    indiceSlotTroca = (indiceSlotTroca + 1) % FOTOS_VISIVEIS;
  }

  function iniciarGaleria() {
    if (!gallery) {
      return;
    }

    gallery.innerHTML = "";
    fotosExibidas = [];
    recarregarFila();

    for (var i = 0; i < FOTOS_VISIVEIS; i += 1) {
      var foto = obterProximaFoto();

      fotosExibidas.push(foto);
      gallery.appendChild(criarItemGaleria(foto, i));
    }

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      temporizadorGaleria = setInterval(
        trocarUmaFoto,
        INTERVALO_TROCA
      );
    }
  }

  /* ============================================================
     Lightbox
     ============================================================ */

  function adicionarEstilosGaleria() {
    if (document.getElementById("galleryPremiumStyles")) {
      return;
    }

    var style = document.createElement("style");
    style.id = "galleryPremiumStyles";
    style.textContent = [
      ".gallery__item{cursor:pointer;transition:opacity .65s ease,transform .65s ease;}",
      ".gallery__item.is-changing{opacity:0;transform:scale(.985);}",
      ".gallery__item img{display:block;width:100%;height:100%;object-fit:cover;}",
      ".gallery-lightbox{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(8,17,31,.94);opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease;}",
      ".gallery-lightbox.is-open{opacity:1;visibility:visible;}",
      ".gallery-lightbox__image{display:block;max-width:min(92vw,1200px);max-height:84vh;object-fit:contain;border-radius:10px;box-shadow:0 22px 70px rgba(0,0,0,.45);}",
      ".gallery-lightbox__close,.gallery-lightbox__prev,.gallery-lightbox__next{position:absolute;border:1px solid rgba(255,255,255,.35);background:rgba(16,32,59,.72);color:#fff;cursor:pointer;display:grid;place-items:center;}",
      ".gallery-lightbox__close{top:20px;right:20px;width:46px;height:46px;border-radius:50%;font-size:28px;}",
      ".gallery-lightbox__prev,.gallery-lightbox__next{top:50%;width:48px;height:60px;border-radius:12px;font-size:34px;transform:translateY(-50%);}",
      ".gallery-lightbox__prev{left:20px;}",
      ".gallery-lightbox__next{right:20px;}",
      ".gallery-lightbox__counter{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);color:#fff;background:rgba(16,32,59,.72);padding:8px 14px;border-radius:999px;font:14px Jost,sans-serif;}",
      "@media(max-width:700px){.gallery-lightbox{padding:16px}.gallery-lightbox__prev{left:8px}.gallery-lightbox__next{right:8px}.gallery-lightbox__close{top:10px;right:10px}}"
    ].join("");

    document.head.appendChild(style);
  }

  function criarLightbox() {
    if (document.getElementById("galleryLightbox")) {
      return;
    }

    var lightbox = document.createElement("div");
    lightbox.id = "galleryLightbox";
    lightbox.className = "gallery-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Galeria em tela cheia");

    lightbox.innerHTML =
      '<button class="gallery-lightbox__close" type="button" aria-label="Fechar">×</button>' +
      '<button class="gallery-lightbox__prev" type="button" aria-label="Foto anterior">‹</button>' +
      '<img class="gallery-lightbox__image" alt="Bruna e Wellington — momento a dois">' +
      '<button class="gallery-lightbox__next" type="button" aria-label="Próxima foto">›</button>' +
      '<div class="gallery-lightbox__counter" aria-live="polite"></div>';

    document.body.appendChild(lightbox);

    lightbox
      .querySelector(".gallery-lightbox__close")
      .addEventListener("click", fecharLightbox);

    lightbox
      .querySelector(".gallery-lightbox__prev")
      .addEventListener("click", function () {
        navegarLightbox(-1);
      });

    lightbox
      .querySelector(".gallery-lightbox__next")
      .addEventListener("click", function () {
        navegarLightbox(1);
      });

    lightbox.addEventListener("click", function (evento) {
      if (evento.target === lightbox) {
        fecharLightbox();
      }
    });
  }

  function atualizarLightbox() {
    var lightbox = document.getElementById("galleryLightbox");

    if (!lightbox) {
      return;
    }

    lightbox.querySelector(".gallery-lightbox__image").src =
      todasAsFotos[lightboxIndice];

    lightbox.querySelector(".gallery-lightbox__counter").textContent =
      (lightboxIndice + 1) + " / " + todasAsFotos.length;
  }

  function abrirLightbox(caminho) {
    var lightbox = document.getElementById("galleryLightbox");

    if (!lightbox) {
      return;
    }

    lightboxIndice = todasAsFotos.indexOf(caminho);

    if (lightboxIndice < 0) {
      lightboxIndice = 0;
    }

    atualizarLightbox();
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";

    if (temporizadorGaleria) {
      clearInterval(temporizadorGaleria);
      temporizadorGaleria = null;
    }
  }

  function fecharLightbox() {
    var lightbox = document.getElementById("galleryLightbox");

    if (!lightbox) {
      return;
    }

    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";

    if (
      !temporizadorGaleria &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      temporizadorGaleria = setInterval(
        trocarUmaFoto,
        INTERVALO_TROCA
      );
    }
  }

  function navegarLightbox(direcao) {
    lightboxIndice =
      (lightboxIndice + direcao + todasAsFotos.length) %
      todasAsFotos.length;

    atualizarLightbox();
  }

  document.addEventListener("keydown", function (evento) {
    var lightbox = document.getElementById("galleryLightbox");

    if (!lightbox || !lightbox.classList.contains("is-open")) {
      return;
    }

    if (evento.key === "Escape") {
      fecharLightbox();
    } else if (evento.key === "ArrowLeft") {
      navegarLightbox(-1);
    } else if (evento.key === "ArrowRight") {
      navegarLightbox(1);
    }
  });

  adicionarEstilosGaleria();
  criarLightbox();
  iniciarGaleria();

  /* ============================================================
     Álbum do Casamento — fotos e vídeos, 9 itens visíveis.
     Uma mídia é trocada a cada 8 segundos, como em Nossa História.
     ============================================================ */
  (function () {
    var albumGaleria = document.getElementById("albumCasamento");
    if (!albumGaleria) return;

    var albumMidias = [];
    for (var foto = 1; foto <= 40; foto += 1) {
      albumMidias.push({
        tipo: "foto",
        src: "assets/casamento/casamento" + String(foto).padStart(2, "0") + ".jpg",
        titulo: "Foto " + foto + " do casamento"
      });
    }

    [
      ["1RiJq2ah6TNGMbOx-48MboKOZjl_jB-n8", "Vídeo do casamento 1"],
      ["1jtldmwrVsmTBkj7lHWK_mdd7wR22zxz3", "Vídeo do casamento 2"],
      ["1WqX92dcv_D0A5mwGyK28bjeodm2_5BR1", "Vídeo do casamento 3"],
      ["1jU5bSKvjE-4MjIsXnD1MHHQH68Q8qoL-", "Vídeo do casamento 4"],
      ["1ZOmhCGrlTk3DLACG48aLMLPte0Pefz6K", "Vídeo do casamento 5"],
      ["1l2TLUfcJfALFOYa5Pc7cM8XO5mru0n4x", "Vídeo do casamento 6"],
      ["1Sod4QZW3JhrmQivLhLZq024qfeKA-wC_", "Vídeo do casamento 7"],
      ["15EMDDhvNd_wRK0HhWpQEcyAY5-GpA_Vz", "Vídeo do casamento 8"],
      ["1PYJFNG8-WQDPQwqJeCMBJ9ZJxqv0iMfQ", "Vídeo do casamento 9"],
      ["1FbZveNzW3ucOiudl0IJtVFYQqgsHZbvj", "Vídeo do casamento 10"],
      ["1kqp8ye2nEJeQ46UEieFOQmxIKxebzGIX", "Vídeo do casamento 11"],
      ["1GWpo1gGjKxsA2MNEcHK4QDEToHo7CU0K", "Vídeo do casamento 12"],
      ["1l1QqPph4FT0QoE4ArgEnWS22r0m_lhve", "Vídeo do casamento 13"],
      ["17UBIlnkXRjEqVHMZjCsKamJp-4j5JbdU", "Vídeo do casamento 14"],
      ["1qxQwxGdsCYVgGjePkOZ61sAxPiIJhiaF", "Vídeo do casamento 15"],
      ["11imdQ1pmVi7PxCFfAZTUmTJFxFzo25p-", "Vídeo do casamento 16"]
    ].forEach(function (video) {
      albumMidias.push({
        tipo: "video",
        id: video[0],
        src: "https://drive.google.com/thumbnail?id=" + video[0] + "&sz=w1200",
        preview: "https://drive.google.com/file/d/" + video[0] + "/preview",
        titulo: video[1]
      });
    });

    var visiveis = 9;
    var intervalo = 8000;
    var indiceTroca = 0;
    var fila = albumMidias.slice(visiveis);
    var timer = null;
    var indiceAberto = 0;
    var focoAnterior = null;
    var movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    albumGaleria.innerHTML = "";

    function criarCartao(midia) {
      var figure = document.createElement("figure");
      var imagem = document.createElement("img");
      figure.className = "gallery__item is-visible";
      figure.tabIndex = 0;
      figure.setAttribute("role", "button");
      figure.setAttribute("aria-label", midia.tipo === "video" ? "Reproduzir " + midia.titulo : "Abrir " + midia.titulo);
      figure.dataset.albumIndice = String(albumMidias.indexOf(midia));
      imagem.src = midia.src;
      imagem.alt = midia.titulo;
      imagem.loading = "lazy";
      imagem.decoding = "async";
      figure.appendChild(imagem);
      if (midia.tipo === "video") {
        figure.classList.add("gallery__item--video");
        var play = document.createElement("span");
        play.className = "gallery__play";
        play.setAttribute("aria-hidden", "true");
        play.textContent = "▶";
        figure.appendChild(play);
      }
      figure.addEventListener("click", function () { abrir(Number(figure.dataset.albumIndice)); });
      figure.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter" || evento.key === " ") {
          evento.preventDefault();
          abrir(Number(figure.dataset.albumIndice));
        }
      });
      return figure;
    }

    albumMidias.slice(0, visiveis).forEach(function (midia) {
      albumGaleria.appendChild(criarCartao(midia));
    });

    var modal = document.createElement("div");
    modal.id = "albumLightbox";
    modal.className = "gallery-lightbox";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Álbum do casamento em tela cheia");
    modal.innerHTML =
      '<button class="gallery-lightbox__close" type="button" aria-label="Fechar">×</button>' +
      '<button class="gallery-lightbox__prev" type="button" aria-label="Mídia anterior">‹</button>' +
      '<div class="album-lightbox__media"></div>' +
      '<button class="gallery-lightbox__next" type="button" aria-label="Próxima mídia">›</button>' +
      '<div class="gallery-lightbox__counter" aria-live="polite"></div>';
    document.body.appendChild(modal);

    function atualizarModal() {
      var midia = albumMidias[indiceAberto];
      var area = modal.querySelector(".album-lightbox__media");
      area.innerHTML = "";
      if (midia.tipo === "video") {
        var frame = document.createElement("iframe");
        frame.src = midia.preview;
        frame.title = midia.titulo;
        frame.allow = "autoplay; fullscreen";
        frame.allowFullscreen = true;
        area.appendChild(frame);
      } else {
        var imagem = document.createElement("img");
        imagem.className = "gallery-lightbox__image";
        imagem.src = midia.src;
        imagem.alt = midia.titulo;
        area.appendChild(imagem);
      }
      modal.querySelector(".gallery-lightbox__counter").textContent =
        (indiceAberto + 1) + " / " + albumMidias.length;
    }

    function abrir(indice) {
      indiceAberto = indice;
      focoAnterior = document.activeElement;
      clearInterval(timer);
      timer = null;
      atualizarModal();
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
      modal.querySelector(".gallery-lightbox__close").focus();
    }

    function fechar() {
      modal.classList.remove("is-open");
      modal.querySelector(".album-lightbox__media").innerHTML = "";
      document.body.style.overflow = "";
      if (focoAnterior) focoAnterior.focus();
      iniciarTimer();
    }

    function navegar(direcao) {
      indiceAberto = (indiceAberto + direcao + albumMidias.length) % albumMidias.length;
      atualizarModal();
    }

    function trocarUmaMidia() {
      if (document.hidden || modal.classList.contains("is-open") || !fila.length) return;
      var item = albumGaleria.querySelectorAll(".gallery__item")[indiceTroca];
      var proxima = fila.shift();
      var atual = albumMidias[Number(item.dataset.albumIndice)];
      fila.push(atual);
      var novo = criarCartao(proxima);
      novo.classList.add("is-changing");
      item.classList.add("is-changing");
      setTimeout(function () {
        item.replaceWith(novo);
        requestAnimationFrame(function () { novo.classList.remove("is-changing"); });
      }, 650);
      indiceTroca = (indiceTroca + 1) % visiveis;
    }

    function iniciarTimer() {
      if (!timer && !movimentoReduzido) timer = setInterval(trocarUmaMidia, intervalo);
    }

    modal.querySelector(".gallery-lightbox__close").addEventListener("click", fechar);
    modal.querySelector(".gallery-lightbox__prev").addEventListener("click", function () { navegar(-1); });
    modal.querySelector(".gallery-lightbox__next").addEventListener("click", function () { navegar(1); });
    modal.addEventListener("click", function (evento) { if (evento.target === modal) fechar(); });
    document.addEventListener("keydown", function (evento) {
      if (!modal.classList.contains("is-open")) return;
      if (evento.key === "Escape") fechar();
      else if (evento.key === "ArrowLeft") navegar(-1);
      else if (evento.key === "ArrowRight") navegar(1);
    });

    var estilo = document.createElement("style");
    estilo.textContent =
      ".gallery__item--video::before{content:'Vídeo';position:absolute;top:12px;left:12px;z-index:2;padding:6px 10px;border-radius:999px;background:rgba(16,32,59,.82);color:#fff;font:500 11px Jost,sans-serif;letter-spacing:.08em;text-transform:uppercase}" +
      ".gallery__play{position:absolute;inset:50% auto auto 50%;z-index:2;display:grid;place-items:center;width:58px;height:58px;padding-left:4px;border:2px solid rgba(255,255,255,.9);border-radius:50%;color:#fff;background:rgba(16,32,59,.72);font-size:22px;transform:translate(-50%,-50%);box-shadow:0 8px 28px rgba(0,0,0,.35)}" +
      ".album-lightbox__media{display:flex;align-items:center;justify-content:center;width:min(92vw,1200px);height:84vh}" +
      ".album-lightbox__media iframe{width:100%;height:100%;border:0;border-radius:10px;background:#000;box-shadow:0 22px 70px rgba(0,0,0,.45)}";
    document.head.appendChild(estilo);
    iniciarTimer();

        function aplicarAlbumDoDrive(resposta) {
      if (!resposta || !Array.isArray(resposta.itens) || !resposta.itens.length) return;
      var vistos = {};
      albumMidias = resposta.itens.filter(function (midia) {
        if (!midia || !midia.id || vistos[midia.id]) return false;
        vistos[midia.id] = true;
        return midia.tipo === "foto" || midia.tipo === "video";
      });

      clearInterval(timer);
      timer = null;
      indiceTroca = 0;
      fila = albumMidias.slice(visiveis);
      albumGaleria.innerHTML = "";
      albumMidias.slice(0, visiveis).forEach(function (midia) {
        albumGaleria.appendChild(criarCartao(midia));
      });
      iniciarTimer();
    }

    if (window.ALBUM_API_URL) {
      var callbackAlbum = "receberAlbumCasamento_" + Date.now();
      var carregadorAlbum = document.createElement("script");
      window[callbackAlbum] = function (resposta) {
        aplicarAlbumDoDrive(resposta);
        delete window[callbackAlbum];
        carregadorAlbum.remove();
      };
      carregadorAlbum.onerror = function () {
        delete window[callbackAlbum];
        carregadorAlbum.remove();
        console.warn("Não foi possível atualizar o álbum pelo Google Drive.");
      };
      carregadorAlbum.src = window.ALBUM_API_URL +
        (window.ALBUM_API_URL.indexOf("?") === -1 ? "?" : "&") +
        "callback=" + encodeURIComponent(callbackAlbum) + "&_=" + Date.now();
      document.head.appendChild(carregadorAlbum);
    }

  })();

  /* ============================================================
     Animações de entrada
     ============================================================ */

  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var revealTargets = document.querySelectorAll(
    "[data-reveal], .gallery__item"
  );

  if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    revealTargets.forEach(function (elemento) {
      elemento.classList.add("is-visible");
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
      {
        threshold: 0.15
      }
    );

    revealTargets.forEach(function (elemento) {
      observer.observe(elemento);
    });
  }

  /* ============================================================
     Sombra da navegação ao rolar
     ============================================================ */

  var nav = document.getElementById("nav");

  if (nav) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 12) {
        nav.style.boxShadow =
          "0 8px 24px -18px rgba(16,32,59,0.4)";
      } else {
        nav.style.boxShadow = "none";
      }
    });
  }
})();
