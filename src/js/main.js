import clamp from 'clamp-js-main';

AOS.init({
  duration: 1000,
  anchorPlacement: 'top-bottom',
});

$(document).ready(function () {
  const $comments = $('[data-value="comment"]');
  $comments.each((idx, el) => {
    clamp(el, { clamp: 4 });
  });
  $('#comments-slider').slick({
    arrows: true,
    infinite: true,
    speed: 800,
    draggable: true,
    touchThreshold: 100,
    prevArrow: false,
    nextArrow: '.comments-slider__arrow',
    dots: true,
    appendDots: '.comments-slider__dots',
  });
});
