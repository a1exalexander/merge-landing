import clamp from 'clamp-js-main';
import AOS from 'aos';

const fuse = (...fns) => {
  fns.forEach((fn) => {
    try {
      fn();
    } catch (err) {
      console.error(`Function name: "${fn.name}": \n`, err);
    }
  });
};

const installModals = () => {
  const $linkToModalVideo = $('#modal-video');

  const $closeModalButtons = $('[data-modal="close"]');

  $linkToModalVideo.on('click', function (e) {
    if (e) e.preventDefault();
    const id = $(this).attr('id');
    $('html').addClass('modal-page');
    $(`.modal[data-modal-id="${id}"]`).fadeIn(200).addClass('_active');
  });

  $closeModalButtons.each((idx, el) => {
    $(el).on('click', function (e) {
      if (e) e.preventDefault();
      $('html').removeClass('modal-page');
      $(this).parents('.modal').removeClass('_active').fadeOut(200);
    });
  });
};

const installComments = () => {
  const $comments = $('[data-value="comment"]');

  $comments.each((idx, el) => {
    clamp(el, { clamp: 4 });
  });

  $('#comments-slider').not('.slick-initialized').slick({
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
};

const installAOS = () => {
  AOS.init({
    duration: 1000,
    anchorPlacement: 'top-bottom',
    once: true,
  });
};

$(() => {
  fuse(installModals, installComments, installAOS);
});
