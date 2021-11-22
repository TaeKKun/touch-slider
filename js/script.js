const slider = document.querySelector(".slider-container"),
  slides = Array.from(document.querySelectorAll(".slide"));

let isDrag = false,
  startPos = 0,
  currTranslate = 0,
  prevTranslate = 0,
  animId = 0,
  currIndex = 0;

slides.forEach((slide, index) => {
  const slideImage = slide.querySelector("img");
  slideImage.addEventListener("dragstart", (e) => e.preventDefault());

  // touch events
  slide.addEventListener("touchstart", touchStart(index));
  slide.addEventListener("touchmove", touchMove);
  slide.addEventListener("touchend", touchEnd);

  // mouse events
  slide.addEventListener("mouseup", touchEnd);
  slide.addEventListener("mousemove", touchMove);
  slide.addEventListener("mousedown", touchStart(index));
  slide.addEventListener("mouseleave", touchEnd);
});

// disable context menu
window.oncontextmenu = function (event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

function touchStart(index) {
  return function (event) {
    currIndex = index;
    startPos = getPosX(event);
    // console.log(event.type.includes('mouse'));
    // console.log("start");
    isDrag = true;
    animId = requestAnimationFrame(animation);
    slider.classList.add("grabbing");
  };
}

function touchEnd() {
  // console.log("end");
  isDrag = false;
  cancelAnimationFrame(animId);

  const movedBy = currTranslate - prevTranslate;
  if (movedBy < -100 && currIndex < slides.length - 1) currIndex += 1;
  if (movedBy > 100 && currIndex > 0) currIndex -= 1;
  setPosByIndex();

  slider.classList.remove("grabbing");
}

function touchMove(event) {
  // console.log("move");
  if (isDrag) {
    // console.log("move");
    const currPos = getPosX(event);
    currTranslate = prevTranslate + currPos - startPos;
  }
}

function getPosX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

function animation() {
  setSliderPos();
  if (isDrag) requestAnimationFrame(animation);
}

function setSliderPos() {
  slider.style.transform = `translateX(${currTranslate}px)`;
}

function setPosByIndex() {
  currTranslate = currIndex * -window.innerWidth;
  prevTranslate = currTranslate;
  setSliderPos();
}
