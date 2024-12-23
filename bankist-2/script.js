"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnLearnMore = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const navContainer = document.querySelector(".nav");
const header = document.querySelector(".header");
const sections = document.querySelectorAll(".section");
const slides = document.querySelectorAll(".slide");
const btnLeftSlider = document.querySelector(".slider__btn--left");
const btnRightSlider = document.querySelector(".slider__btn--right");
const dotContainer = document.querySelector(".dots");

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((button) => button.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

btnLearnMore.addEventListener("click", () =>
  section1.scrollIntoView({ behavior: "smooth" })
);

document
  .querySelector(".nav__links")
  .addEventListener("click", function (event) {
    const target = event.target;
    event.preventDefault();
    if (
      target.classList.contains("nav__link") &&
      target.getAttribute("href").includes("section")
    ) {
      const section = target.getAttribute("href");
      document.querySelector(section).scrollIntoView({ behavior: "smooth" });
    }
  });

tabsContainer.addEventListener("click", function (event) {
  const clickedTab = event.target.closest(".operations__tab");

  if (clickedTab) {
    tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
    tabsContent.forEach((tabContent) =>
      tabContent.classList.remove("operations__content--active")
    );
    clickedTab.classList.add("operations__tab--active");
    document
      .querySelector(`.operations__content--${clickedTab.dataset.tab}`)
      .classList.add("operations__content--active");
  }
});

const navHoverHandler = function (event) {
  if (event.target.classList.contains("nav__link")) {
    const linkSiblings = navContainer.querySelectorAll(".nav__link");
    const logo = navContainer.querySelector(".nav__logo");

    linkSiblings.forEach((link) => {
      if (link !== event.target) link.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

navContainer.addEventListener("mouseover", navHoverHandler.bind(0.5));

navContainer.addEventListener("mouseout", navHoverHandler.bind(1));

const stickyNav = function (entries) {
  const entry = entries[0];

  if (!entry.isIntersecting) {
    navContainer.classList.add("sticky");
  } else {
    navContainer.classList.remove("sticky");
  }
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navContainer.getBoundingClientRect().height}px`,
});

headerObserver.observe(header);

const displaySection = function (entries, observer) {
  const entry = entries[0];

  if (entry.isIntersecting) {
    entry.target.classList.remove("section--hidden");
    observer.unobserve(entry.target);
  }
};

const sectionObserver = new IntersectionObserver(displaySection, {
  root: null,
  threshold: 0.2,
});
sections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

const lazyImgs = document.querySelectorAll("img[data-src]");

const loadLazyImgs = function (entries, observer) {
  const entry = entries[0];

  if (entry.isIntersecting) {
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener("load", function () {
      entry.target.classList.remove("lazy-img");
    });
    observer.unobserve(entry.target);
  }
};

const lazyImgsObserver = new IntersectionObserver(loadLazyImgs, {
  root: null,
  threshold: 0,
  rootMargin: "-200px",
});

lazyImgs.forEach((img) => lazyImgsObserver.observe(img));

const moveSlides = function (position) {
  slides.forEach(
    (slide, i) =>
      (slide.style.transform = `translateX(${100 * (i - position)}%)`)
  );
};

let currSlide = 0;
moveSlides(currSlide);

const createDots = function () {
  slides.forEach((slide, i) =>
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide="${i}"></button>`
    )
  );
};

const activateDot = function (position) {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));
  document
    .querySelector(`.dots__dot[data-slide="${position}"]`)
    .classList.add("dots__dot--active");
};

createDots();
activateDot(0);
dotContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("dots__dot")) {
    currSlide = Number(event.target.dataset.slide);
    moveSlides(currSlide);
    activateDot(currSlide);
  }
});

const moveToPrevSlide = function () {
  if (currSlide === 0) {
    currSlide = slides.length - 1;
  } else {
    currSlide--;
  }

  moveSlides(currSlide);
  activateDot(currSlide);
};

const moveToNextSlide = function () {
  if (currSlide === slides.length - 1) {
    currSlide = 0;
  } else {
    currSlide++;
  }

  moveSlides(currSlide);
  activateDot(currSlide);
};

btnLeftSlider.addEventListener("click", moveToPrevSlide);

btnRightSlider.addEventListener("click", moveToNextSlide);

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    moveToPrevSlide();
  } else if (event.key === "ArrowRight") {
    moveToNextSlide();
  }
});
