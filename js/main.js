jQuery(function ($) {
  "use strict";

  /* ============================================================
     1. LIBRERÍAS DE EFECTOS
     ============================================================ */

  /* AOS (Animate On Scroll): anima elementos al hacer scroll.*/

  AOS.init({
    duration: 800,
    easing: "ease-out-cubic",
    once: true,
    offset: 90
  });

  /* Typed.js: efecto "máquina de escribir" sobre el titular del hero. */
  
  if (window.Typed) {
    new Typed("#typed", {
      strings: ["desayunar", "leer", "quedarse", "soñar"],
      typeSpeed: 70,
      backSpeed: 40,
      backDelay: 1800,
      loop: true
    });
  }

  /* Muestra el año actual en el pie de página */
  $("#year").text(new Date().getFullYear());

  var $header = $(".site-header");
  var $navMenu = $("#nav-menu");
  var $navToggle = $(".nav-toggle");
  var $toTop = $(".to-top");

  /* ============================================================
     2. MENÚ DE NAVEGACIÓN RESPONSIVE (hamburguesa)
     ============================================================ */

  var DESKTOP = "(min-width: 1200px)";

  function closeMenu() {
    $navMenu.removeClass("is-open");
    $navToggle.removeClass("is-open").attr("aria-expanded", "false").attr("aria-label", "Abrir menú de navegación");
  }

  function openMenu() {
    $navMenu.addClass("is-open");
    $navToggle.addClass("is-open").attr("aria-expanded", "true").attr("aria-label", "Cerrar menú de navegación");
  }

  $navToggle.on("click", function (e) {
    e.stopPropagation();
    if ($navMenu.hasClass("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  $navMenu.find("a").on("click", function () {
    if (!window.matchMedia(DESKTOP).matches) {
      closeMenu();
    }
  });

  $(document).on("click", function (e) {
    if (!$navMenu.hasClass("is-open")) {
      return;
    }
    if ($(e.target).closest(".site-header").length) {
      return;
    }
    closeMenu();
  });

  $(document).on("keyup", function (e) {
    if (e.key === "Escape") {
      closeMenu();
    }
  });

  $(window).on("resize", function () {
    if (window.matchMedia(DESKTOP).matches) {
      closeMenu();
    }
  });

  /* ============================================================
     3. CABECERA AL HACER SCROLL Y BOTÓN "VOLVER ARRIBA"
     ============================================================ */

  $(window).on("scroll", function () {
    var y = $(window).scrollTop();
    $header.toggleClass("is-scrolled", y > 40);
    $toTop.toggleClass("is-visible", y > 600);
    highlightNav();
  });

  $toTop.on("click", function () {
    $("html, body").stop().animate({ scrollTop: 0 }, 600);
  });

  /* ============================================================
     4. ENLACE ACTIVO DEL MENÚ
     ============================================================ */

  var $sections = $("main section[id]");
  var $navLinks = $navMenu.find("a[href^='#']");

  function highlightNav() {
    var pos = $(window).scrollTop() + 120;
    var current = "";
    $sections.each(function () {
      if ($(this).offset().top <= pos) {
        current = "#" + this.id;
      }
    });
    $navLinks.each(function () {
      var href = $(this).attr("href");
      $(this).toggleClass("is-current", href === current && href !== "#top");
    });
  }

  /* ============================================================
     5. CONTADOR ANIMADO (sección "Nosotros")
     ============================================================ */

  function animateCounters() {
    $(".stat-num").each(function () {
      var $el = $(this);
      if ($el.data("done")) {
        return;
      }
      var rect = this.getBoundingClientRect();
      if (rect.top < $(window).height() - 60) {
        $el.data("done", true);
        $({ v: 0 }).animate({ v: parseInt($el.data("count"), 10) }, {
          duration: 1400,
          easing: "swing",
          step: function () {
            $el.text(Math.floor(this.v));
          },
          complete: function () {
            $el.text($el.data("count"));
          }
        });
      }
    });
  }

  $(window).on("scroll load", animateCounters);

  /* ============================================================
     6. SLIDER / CARRUSEL
     ============================================================ */

  var $track = $(".slider-track");
  var $slides = $track.find(".slide");
  var total = $slides.length;
  var index = 0;
  var timer = null;
  var AUTOPLAY = 5000;

  if (total) {
    var $dots = $(".slider-dots");
    for (var i = 0; i < total; i++) {
      $dots.append('<button class="slider-dot" type="button" aria-label="Ir a la imagen ' + (i + 1) + '"></button>');
    }
    var $dotEls = $dots.find(".slider-dot");

    function goTo(i) {
      index = (i + total) % total;
      $track.css("transform", "translateX(" + (-index * 100) + "%)");
      $dotEls.removeClass("is-active").eq(index).addClass("is-active").attr("aria-selected", "false");
      $dotEls.eq(index).attr("aria-selected", "true");
    }

    function next() {
      goTo(index + 1);
    }

    function startAuto() {
      stopAuto();
      timer = setInterval(next, AUTOPLAY);
    }

    function stopAuto() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    $(".slider-next").on("click", function () {
      next();
      startAuto();
    });

    $(".slider-prev").on("click", function () {
      goTo(index - 1);
      startAuto();
    });

    $dots.on("click", ".slider-dot", function () {
      goTo($dotEls.index(this));
      startAuto();
    });

    $(".slider").on("mouseenter", stopAuto).on("mouseleave", startAuto);

    var touchStartX = 0;
    var touchDelta = 0;

    $track.on("touchstart", function (e) {
      touchStartX = e.originalEvent.touches[0].clientX;
      touchDelta = 0;
      stopAuto();
    });

    $track.on("touchmove", function (e) {
      touchDelta = e.originalEvent.touches[0].clientX - touchStartX;
    });

    $track.on("touchend", function () {
      if (Math.abs(touchDelta) > 45) {
        goTo(touchDelta < 0 ? index + 1 : index - 1);
      }
      startAuto();
    });

    goTo(0);
    startAuto();
  }

  /* ============================================================
     7. PESTAÑAS / TABS 
     ============================================================ */

  $(".tab").on("click", function () {
    var $btn = $(this);
    var target = $btn.attr("aria-controls");

    $(".tab").removeClass("is-active").attr("aria-selected", "false");
    $btn.addClass("is-active").attr("aria-selected", "true");

    $(".tab-panel").removeClass("is-active").attr("hidden", true);
    $("#" + target).addClass("is-active").removeAttr("hidden");
  });

  /* ============================================================
     8. ACORDEÓN FAQ
     ============================================================ */

  $(".accordion-trigger").on("click", function () {
    var $trigger = $(this);
    var $panel = $trigger.closest(".accordion-item").find(".accordion-panel");
    var isOpen = $trigger.attr("aria-expanded") === "true";

    $(".accordion-trigger").attr("aria-expanded", "false");
    $(".accordion-panel").css("max-height", 0);

    if (!isOpen) {
      $trigger.attr("aria-expanded", "true");
      $panel.css("max-height", $panel.prop("scrollHeight") + "px");
    }
  });

  /* ============================================================
     9. VENTANA MODAL 
     ============================================================ */

  var $modal = $("#reserva-modal");

  function openModal(text) {
    if (text) {
      $("#modal-text").text(text);
    }
    $modal.removeAttr("hidden");
    $("body").addClass("is-locked");
    $modal.find(".modal-close").trigger("focus");
  }

  function closeModal() {
    $modal.attr("hidden", true);
    $("body").removeClass("is-locked");
  }

  $modal.on("click", "[data-close]", closeModal);

  $(document).on("keyup", function (e) {
    if (e.key === "Escape" && !$modal.is("[hidden]")) {
      closeModal();
    }
  });

  /* ============================================================
     10. VALIDACIÓN DEL FORMULARIO DE RESERVA
     ============================================================ */

  var patterns = {
    nombre: /^[a-zA-ZÀ-ÿ\s'.-]{3,60}$/,
    email: /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/,
    telefono: /^[+]?[\d\s().-]{9,20}$/
  };

  function validateField($field) {
    var $input = $field.find("input, select");
    var name = $input.attr("name");
    var value = $.trim($input.val());
    var error = "";
    var $error = $field.find(".field-error");

    if (!value) {
      error = "Este campo es obligatorio.";
    } else if (patterns[name] && !patterns[name].test(value)) {
      if (name === "email") {
        error = "Introduce un correo válido.";
      } else if (name === "telefono") {
        error = "Introduce un teléfono válido.";
      } else {
        error = "Introduce un nombre válido.";
      }
    }

    if (name === "fecha" && value) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(value + "T00:00:00") < today) {
        error = "Elige una fecha a partir de hoy.";
      }
    }

    $field.toggleClass("has-error", !!error);
    $error.text(error);
    return !error;
  }

  var $form = $("#reserva-form");

  $form.on("focusout", "input, select", function () {
    validateField($(this).closest(".field"));
  });

  $form.on("input change", "input, select", function () {
    var $field = $(this).closest(".field");
    if ($field.hasClass("has-error")) {
      validateField($field);
    }
  });

  $form.on("submit", function (e) {
    e.preventDefault();
    var ok = true;
    var firstBad = null;

    $form.find(".field").each(function () {
      if ($(this).find("input, select").length) {
        if (!validateField($(this))) {
          ok = false;
          if (!firstBad) {
            firstBad = $(this).find("input, select");
          }
        }
      }
    });

    if (!ok) {
      if (firstBad) {
        firstBad.trigger("focus");
      }
      return;
    }

    var nombre = $("#nombre").val();
    var personas = $("#personas").val();
    var fecha = $("#fecha").val();

    openModal("Gracias, " + nombre.split(" ")[0] + ". Hemos recibido tu reserva para " + personas + (personas === "1" ? " persona" : " personas") + " el " + fecha + ". Te confirmaremos por correo muy pronto.");
    this.reset();
    $form.find(".field").removeClass("has-error").find(".field-error").text("");
  });
});
