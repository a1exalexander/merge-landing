import anime from 'animejs';
import clamp from 'clamp-js-main';
import { fuse } from './helpers';

const commentHeight = {
  min() {
    return localStorage.getItem('min-comment-height');
  },
  max() {
    return localStorage.getItem('max-comment-height');
  },
  setMin(height) {
    localStorage.setItem('min-comment-height', height);
  },
  setMax(height) {
    localStorage.setItem('max-comment-height', height);
  }
}

const replaceText = (name) => {
  const $text = $(`.slick-active [data-value="${name}"]`);
  $text.html($text.text().replace(/\S/g, "<span class='letter'>$&</span>"));
  $text.css({ visibility: 'visible' });
};

const truncateComments = () => {
  const $comments = $('[data-value="comment"]');

  $comments.each((idx, el) => {
    const $el = $(el);
    if (!$el.siblings().length) {
      $el.after(`<p class="comments-slider__comment _full">${$el.text()}</p>`);
    }
    clamp(el, { clamp: 4, useNativeClamp: false });
  });
};

const installAccordion = () => {
  const $comments = $('[data-value="comment-wrapper"]').not('._initialized');

  $comments.each((idx, el) => {
    const $el = $(el);
    const height = $el.find('[data-value="comment"]').outerHeight();
    const expandedHeight = $el.find('._full').outerHeight();
    if (height > commentHeight.min()) commentHeight.setMin(height);
    if (expandedHeight > commentHeight.max()) commentHeight.setMax(height);
    $el.addClass('_initialized');
    $el.css({ height: `${commentHeight.min()}px` });
    $el.on('click', () => {
      if ($el.hasClass('_expanded')) {
        $el.removeClass('_expanded');
        $.when($el.animate({ height: `${height}px` }, 200)).then(() =>
          $el.children().eq(1).hide().siblings().show()
        );
      } else {
        $el.addClass('_expanded');
        $.when($el.children().eq(0).hide().siblings().show()).then(() => {
          $el.animate({ height: `${expandedHeight}px` }, 200);
        });
      }
    });
  });
};

const setIconPosition = () => {
  const $activeText = $('.slick-active [data-value="comment"]');
  const $iconQuotes = $('#slider-icon-qoutes');

  if ($activeText.length) {
    const offset = $activeText.offset().left - $activeText.parent().offset().left;
    const left = offset ? offset + 4 : offset + 16;
    console.log(left);
    $iconQuotes.animate({ left });
  }
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
  anime.timeline().add(getAnimateConfig('company'), 0).add(getAnimateConfig('author'), 500);
};

const onInitSlider = () => {
  setIconPosition();
  animateText();
};

export const installCommentsSlider = () => {
  $.when(fuse(truncateComments, installAccordion)).then(() => {
    $.when(
      $('#comments-slider')
        .not('.slick-initialized')
        .slick({
          arrows: true,
          infinite: true,
          speed: 800,
          // autoplay: true,
          // autoplaySpeed: 5000,
          draggable: true,
          touchThreshold: 100,
          prevArrow: false,
          nextArrow: '.comments-slider__arrow',
          dots: true,
          appendDots: '.comments-slider__dots',
        })
        .on('init', () => {
          console.log('init');
          onInitSlider();
        })
        .on('beforeChange', () => {
          const $el = $(`.slick-active [data-value="comment-wrapper"]`);
          if ($el.hasClass('_expanded')) {
            $el.removeClass('_expanded');
            $el.css({ height: `${commentHeight.min()}px` });
            $el.children().eq(1).hide().siblings().show();
          }
          setTimeout(() => {
            onInitSlider();
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
    ).then(onInitSlider());
  });
};
