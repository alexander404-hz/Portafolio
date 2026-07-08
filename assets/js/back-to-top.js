const btnBackToTop = document.querySelector(".back-to-top-wrapper");
console.log(btnBackToTop);

const VISIBLE_CLASS = "back-to-top-wrapper--visible";
const SCROLL_THRESHOLD = 1000;

if (btnBackToTop) {
  window.addEventListener("scroll", () => {
    const shouldShow = window.scrollY > SCROLL_THRESHOLD;
    btnBackToTop.classList.toggle(VISIBLE_CLASS, shouldShow);
  });

  btnBackToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}
