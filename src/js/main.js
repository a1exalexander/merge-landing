import clamp from 'clamp-js-main';
import AOS from 'aos';
import anime from 'animejs';

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
  const $iconQuotes = $('#slider-icon-qoutes');

  $comments.each((idx, el) => {
    clamp(el, { clamp: 4 });
  });

  const setIconPosition = () => {
    const $activeText = $('.slick-active [data-value="comment"]');
    if ($activeText.length) {
      const offset = $activeText.offset().left - $activeText.parent().offset().left;
      const left = offset ? offset + 4 : offset + 16;
      $iconQuotes.animate({ left });
    }
  };

  const replaceText = (name) => {
    const $text = $(`.slick-active [data-value="${name}"]`);
    $text.html($text.text().replace(/\S/g, "<span class='letter'>$&</span>"));
    $text.css({ visibility: 'visible' });
  };

  const getAnimateConfig = (name, delay) => {
    return {
      targets: `.slick-active [data-value="${name}"] .letter`,
      translateX: [40, 0],
      translateZ: 0,
      opacity: [0, 1],
      easing: 'easeOutExpo',
      duration: 3000,
      delay,
      delay: (el, i) => 500 + 30 * i,
    };
  };

  const animateText = () => {
    replaceText('author');
    replaceText('company');
    anime
      .timeline()
      .add(getAnimateConfig('company'), 0)
      .add(getAnimateConfig('author'), 500);
  };

  const init = () => {
    setIconPosition();
    animateText();
  };

  $.when(
    $('#comments-slider')
      .not('.slick-initialized')
      .slick({
        arrows: true,
        infinite: true,
        speed: 800,
        autoplay: true,
        autoplaySpeed: 5000,
        draggable: true,
        touchThreshold: 100,
        prevArrow: false,
        nextArrow: '.comments-slider__arrow',
        dots: true,
        appendDots: '.comments-slider__dots',
      })
      .on('init', () => {
        console.log('init');
        setTimeout(() => {
          setIconPosition();
        }, 10);
      })
      .on('beforeChange', () => {
        setTimeout(() => {
          init();
          const $author = $(`.slick-active [data-value="author"]`);
          const $company = $(`.slick-active [data-value="company"]`);
          $author.css({ visibility: 'hidden' });
          $company.css({ visibility: 'hidden' });
        }, 10);
      })
      .on('afterChange', () => {
        console.log('after change');
        animateText();
      })
  ).then(init());
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
  fuse(installModals, installComments, installAOS, installHeaderStyles, installDribbleSlider);
});
