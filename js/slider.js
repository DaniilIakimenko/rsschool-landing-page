const slider = document.querySelector(".favorite__slider-wrapper");
const prevBtn = document.querySelector(".favorite__arrow--prev");
const nextBtn = document.querySelector(".favorite__arrow--next");
const dots = document.querySelectorAll(".favorite__dot");

let slideHeight = 0;
let currentIndex = 0;

const cloneSlides = () => {
  const firstClone = slider.firstElementChild.cloneNode(true);
  const lastClone = slider.lastElementChild.cloneNode(true);

  slider.appendChild(firstClone);
  slider.prepend(lastClone);
};

const initSlider = () => {
  slideWidth = slider.firstElementChild.offsetWidth;
  slider.style.transition = "none";
  slider.style.translate = `-${slideWidth * (currentIndex + 1)}px`;
};

const goToPrevSlide = () => {
  slideWidth = slider.firstElementChild.offsetWidth;

  currentIndex--;
  slider.style.transition = `translate 0.5s ease-in-out`;
  slider.style.translate = `-${slideWidth * (currentIndex + 1)}px`;

  activeDot();

  slider.addEventListener("transitionend", () => {
    if (currentIndex < 0) {
      currentIndex = 2;
      slider.style.transition = "none";
      slider.style.translate = `-${slideWidth * (currentIndex + 1)}px`;
    }
    activeDot();
  }, { once: true });
};

const goToNextSlide = () => {
  slideWidth = slider.firstElementChild.offsetWidth;

  currentIndex++;
  slider.style.transition = `translate 0.5s ease-in-out`;
  slider.style.translate = `-${slideWidth * (currentIndex + 1)}px`;

  activeDot();

  if (currentIndex >= 3) {
    nextBtn.disabled = true;
  }

  slider.addEventListener("transitionend", () => {
    if (currentIndex >= 3) {
      currentIndex = 0;
      slider.style.transition = "none";
      slider.style.translate = `-${slideWidth * (currentIndex + 1)}px`;
      nextBtn.disabled = false;
    }
    activeDot();
  }, { once: true });
};

const activeDot = () => {
  dots.forEach(dot => {
    dot.classList.remove('favorite__dot--active');
  });

  let dotIndex = currentIndex;
  if (dotIndex < 0) {
    dotIndex = 2;
  } else if (dotIndex >= 3) {
    dotIndex = 0;
  }

  if (dots[dotIndex]) {
    dots[dotIndex].classList.add('favorite__dot--active');
  }
};

prevBtn.addEventListener("click", goToPrevSlide);
nextBtn.addEventListener("click", goToNextSlide);
window.addEventListener('resize', initSlider);

document.addEventListener("DOMContentLoaded", () => {
  cloneSlides();
  initSlider();
});