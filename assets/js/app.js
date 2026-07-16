// ----------------------------------------------------------------------------
// BACK-TO-TOP
// ----------------------------------------------------------------------------

const btnBackToTop = document.querySelector(".back-to-top-wrapper");

if (btnBackToTop) {
  window.addEventListener("scroll", () => {
    const shouldShow = window.scrollY > 1000;
    btnBackToTop.classList.toggle("back-to-top-wrapper--visible", shouldShow);
  });

  btnBackToTop?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ----------------------------------------------------------------------------
// SCROLL HORIZONTAL Y DRAG EN PROJECTS > PROJECT > TECHNOLOGIES
// ----------------------------------------------------------------------------

// Aplicar estilo scroll
const contenedorProjects = document.querySelector(".projects__grid");

const verificarOverflow = (techs) => {
  if (techs.scrollWidth > techs.clientWidth) {
    techs.classList.add("has-scroll");
  } else {
    techs.classList.remove("has-scroll");
  }
};

const inicializarProyectos = () => {
  document
    .querySelectorAll(".project__technologies")
    .forEach(verificarOverflow);
};

window.addEventListener("DOMContentLoaded", inicializarProyectos);
window.addEventListener("resize", inicializarProyectos);

if (contenedorProjects) {
  // Rueda del mouse (Wheel)
  contenedorProjects.addEventListener(
    "wheel",
    (evento) => {
      const techs = evento.target.closest(".has-scroll");
      if (!techs || evento.deltaY === 0) return;

      evento.preventDefault();
      techs.scrollBy({
        left: evento.deltaY * 0.5,
        behavior: "auto",
      });
    },
    { passive: false },
  );

  // Inicio del Arrastre (Mousedown)

  let activeTechs = null;
  let startX = 0;
  let scrollLeft = 0;

  contenedorProjects.addEventListener("mousedown", (evento) => {
    const techs = evento.target.closest(".has-scroll");
    if (!techs) return;

    activeTechs = techs;

    startX = evento.pageX - techs.offsetLeft;
    scrollLeft = techs.scrollLeft;
  });

  // Movimiento del Arrastre (Mousemove)
  contenedorProjects.addEventListener("mousemove", (evento) => {
    if (!activeTechs) return;
    evento.preventDefault();

    const x = evento.pageX - activeTechs.offsetLeft;
    const walk = (x - startX) * 1.5;
    activeTechs.scrollLeft = scrollLeft - walk;
  });

  // Fin del Arrastre
  const stopDragging = () => {
    if (!activeTechs) return;
    activeTechs = null;
  };

  contenedorProjects.addEventListener("mouseup", stopDragging);
  contenedorProjects.addEventListener("mouseleave", stopDragging);
}
// ----------------------------------------------------------------------------
// Flexbox adaptativo
// ----------------------------------------------------------------------------

const projects = document.querySelectorAll(".project");

function ajustarDistribucion() {
  projects.forEach((project) => {
    project.classList.remove(
      "project--one-horizontal",
      "project--horizontal",
      "project--two-horizontal",
    );
  });

  if (projects.length === 0) return;

  const esTabletOMas = window.matchMedia("(min-width: 768px)").matches;
  if (!esTabletOMas) return;

  const esSoloTablet = window.matchMedia("(max-width: 1024px)").matches;

  const aplicarSobrante = (grupo) => {
    if (grupo.length === 0) return;

    if (esSoloTablet) {
      if (grupo.length % 2 === 1) {
        grupo[grupo.length - 1].classList.add("project--one-horizontal");
      }
    } else {
      if (grupo.length % 3 === 1) {
        grupo[grupo.length - 1].classList.add("project--horizontal");
      } else if (grupo.length % 3 === 2) {
        grupo[grupo.length - 2].classList.add("project--two-horizontal");
        grupo[grupo.length - 1].classList.add("project--two-horizontal");
      }
    }
  };

  let grupoActual = [];

  projects.forEach((project) => {
    if (project.classList.contains("project--expanded")) {
      aplicarSobrante(grupoActual);
      grupoActual = [];
    } else {
      grupoActual.push(project);
    }
  });

  aplicarSobrante(grupoActual);
}

ajustarDistribucion();

window.addEventListener("resize", ajustarDistribucion);

// ----------------------------------------------------------------------------
// EXPANDIR / CONTRAER PROJECT CARD (con animación FLIP + scroll estable)
// ----------------------------------------------------------------------------

const raiz = getComputedStyle(document.documentElement);
const duracionFlip = raiz.getPropertyValue("--duration-medium").trim() || "0.4s";
const easeFlip = raiz.getPropertyValue("--ease-standard").trim() || "ease";

if (contenedorProjects) {
  contenedorProjects.addEventListener("click", (evento) => {
    const boton = evento.target.closest(".project__toggle");
    if (!boton) return;

    const project = boton.closest(".project");
    if (!project) return;

    const extra = project.querySelector(".project__extra");

    // 1) Guardamos la posición/tamaño ACTUAL de todas las cards 
    const cards = document.querySelectorAll(".project");
    const rectsAntes = new Map();
    cards.forEach((card) => rectsAntes.set(card, card.getBoundingClientRect()));
    const topAntes = project.getBoundingClientRect().top;

    // 2) Comportamiento de acordeón
    const seEstaExpandiendo = !project.classList.contains("project--expanded");

    if (seEstaExpandiendo) {
      cards.forEach((otraCard) => {
        if (otraCard === project) return;
        if (!otraCard.classList.contains("project--expanded")) return;

        otraCard.classList.remove("project--expanded");

        const otroBoton = otraCard.querySelector(".project__toggle");
        if (otroBoton) {
          otroBoton.setAttribute("aria-expanded", "false");
          otroBoton.setAttribute("aria-label", "Expandir proyecto");
          otroBoton.title = "Ver más detalles";
        }

        const otroExtra = otraCard.querySelector(".project__extra");
        if (otroExtra) {
          otroExtra.toggleAttribute("inert", true);
        }
      });
    }

    // 3) Aplicamos el cambio real sobre la card clicada
    const expandido = project.classList.toggle("project--expanded");

    boton.setAttribute("aria-expanded", String(expandido));
    boton.setAttribute(
      "aria-label",
      expandido ? "Contraer proyecto" : "Expandir proyecto",
    );
    boton.title = expandido ? "Ver menos detalles" : "Ver más detalles";

    if (extra) {
      extra.toggleAttribute("inert", !expandido);
    }

    ajustarDistribucion();
    inicializarProyectos();

    // 4) Compensamos el scroll
    const topDespues = project.getBoundingClientRect().top;
    const deltaScroll = topDespues - topAntes;
    if (deltaScroll !== 0) {
      window.scrollBy(0, deltaScroll);
    }

    // 5) Animamos (técnica FLIP) el reacomodo del resto de las cards
    const duracionFlipMs = parseFloat(duracionFlip) * 1000 || 500;

    cards.forEach((card) => {
      const antes = rectsAntes.get(card);
      const despues = card.getBoundingClientRect();

      const dx = antes.left - despues.left;
      const dy = antes.top - despues.top;
      const sx = antes.width / despues.width;
      const sy = antes.height / despues.height;

      const sinCambios =
        Math.abs(dx) < 1 &&
        Math.abs(dy) < 1 &&
        Math.abs(sx - 1) < 0.01 &&
        Math.abs(sy - 1) < 0.01;
      if (sinCambios) return;

      card.style.transformOrigin = "top left";

      // Mientras la card se mueve/redimensiona visualmente 
      card.style.pointerEvents = "none";

      const animacion = card.animate(
        [
          {
            transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
          },
          { transform: "translate(0, 0) scale(1, 1)" },
        ],
        {
          duration: duracionFlipMs,
          easing: easeFlip,
        },
      );

      animacion.onfinish = () => {
        card.style.transformOrigin = "";
        card.style.pointerEvents = "";
      };
    });
  });
}