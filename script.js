const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const menuClose = document.querySelector(".menu-close");
const menuOverlay = document.querySelector(".menu-overlay");
const mobileDrawer = document.querySelector(".mobile-drawer");
const drawerLinks = [...document.querySelectorAll(".mobile-drawer a")];

let returnFocusTarget = null;

const getFocusableElements = () =>
  [...mobileDrawer.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
    .filter((element) => !element.hasAttribute("hidden"));

const openMenu = () => {
  returnFocusTarget = document.activeElement;
  body.classList.add("menu-open");
  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close navigation menu");
  mobileDrawer.setAttribute("aria-hidden", "false");
  menuOverlay.setAttribute("aria-hidden", "false");

  window.requestAnimationFrame(() => {
    menuClose.focus();
  });
};

const closeMenu = ({ restoreFocus = true } = {}) => {
  if (!body.classList.contains("menu-open")) {
    return;
  }

  body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  mobileDrawer.setAttribute("aria-hidden", "true");
  menuOverlay.setAttribute("aria-hidden", "true");

  if (restoreFocus && returnFocusTarget instanceof HTMLElement) {
    returnFocusTarget.focus();
  }
};

menuToggle.addEventListener("click", () => {
  if (body.classList.contains("menu-open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

menuClose.addEventListener("click", () => closeMenu());
menuOverlay.addEventListener("click", () => closeMenu());

drawerLinks.forEach((link) => {
  link.addEventListener("click", () => closeMenu({ restoreFocus: false }));
});

document.addEventListener("keydown", (event) => {
  if (!body.classList.contains("menu-open")) {
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeMenu();
    return;
  }

  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = getFocusableElements();
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 1100) {
    closeMenu({ restoreFocus: false });
  }
});
