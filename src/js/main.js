import AOS from 'aos';
import 'uikit';
import { installCommentsSlider } from './source/comments';
import { fuse } from './source/helpers';

let init = false;

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


const installAOS = () => {
  AOS.init({
    duration: 1000,
    anchorPlacement: 'top-bottom',
    once: true,
  });
};

const installHeaderStyles = () => {
  const $header = $('.header');
  const $bookButtonMobile = $('#header-book-button-mobile');

  if ($header.length && $bookButtonMobile.length) {
    $(document).on('scroll', (e, d) => {
      const offset = $(document).scrollTop();
      if (offset > 40 && !$header.hasClass('_shadow')) {
        $header.addClass('_shadow');
        $bookButtonMobile.removeClass('button--black');
      } else if (offset <= 40 && $header.hasClass('_shadow')) {
        $header.removeClass('_shadow');
        $bookButtonMobile.addClass('button--black');
      }
    });
  }
};

const installDribbleSlider = () => {
  const delay = 5000;
  const $slider = $('#dribble-slider');
  const $slides = $slider.find('img');
  let slideIdx = 0;
  let slidesLength = 0;
  if (!$slider.hasClass('_active') && $slider.length && $slides.length > 1) {
    $slider.addClass('_active');
    slidesLength = $slides.length - 1;
    $slides.each((idx, el) => {
      if (idx === 0) {
        $(el).addClass('uk-animation-kenburns _active');
      } else {
        $(el).hide();
      }
    });
    let timer = setTimeout(function slider() {
      const oldIdx = slideIdx;
      if (slideIdx < slidesLength) {
        slideIdx += 1;
      } else {
        slideIdx = 0;
      }

      $slides.eq(slideIdx).addClass('uk-animation-kenburns _active').fadeIn(1000);
      $.when($slides.eq(oldIdx).removeClass('_active').fadeOut(1000)).then(() => {
        $slides.eq(oldIdx).removeClass('uk-animation-kenburns');
      });
      timer = setTimeout(slider, delay);
    }, delay);
  }
};

$(() => {
  if (!init) {
    fuse(installModals, installCommentsSlider, installAOS, installHeaderStyles, installDribbleSlider);
    init = true;
  }
});
