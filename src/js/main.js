import clamp from 'clamp-js-main';

AOS.init({
  duration: 1000,
  anchorPlacement: 'top-bottom',
});

$(document).ready(function () {
  const $comments = $('.comments-slider__comment');
  $comments.each((idx, el) => {
    clamp(el, { clamp: 3 });
  });
  $('#comments-slider').slick({
    arrows: true,
    infinite: true,
    speed: 1000,
    fade: true,
    draggable: true,
    touchThreshold: 100,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    prevArrow: false,
    nextArrow: '.comments-slider__arrow',
    dots: true,
    appendDots: '.comments-slider__dots',
  });
});
