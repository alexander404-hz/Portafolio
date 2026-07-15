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

if (contenedorProjects) {
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

  if (window.matchMedia("(min-width: 768px)").matches) {
    if (window.matchMedia("(max-width: 1024px)").matches) {
      if (projects.length % 2 === 1) {
        projects[projects.length - 1].classList.add("project--one-horizontal");
      }
    } else {
        console.log("xd: ",projects.length%3);

      if (projects.length % 3 === 1) {
        projects[projects.length - 1].classList.add("project--horizontal");
      } else if (projects.length % 3 === 2) {
        projects[projects.length - 2].classList.add("project--two-horizontal");
        projects[projects.length - 1].classList.add("project--two-horizontal");
      }
    }
  }
}

ajustarDistribucion();

window.addEventListener("resize", ajustarDistribucion);
