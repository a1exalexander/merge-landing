import anime from 'animejs';
import clamp from 'clamp-js-main';
import { fuse } from './helpers';

export class CommentsSlider {
  constructor() {
    this.maxHeight = 0;
    this.minHeight = 0;
    console.log('CommentsSlider init');
  }

  _replaceText = (name) => {
    const $text = $(`.slick-active [data-value="${name}"]`);
    $text.html($text.text().replace(/\S/g, "<span class='letter'>$&</span>"));
    $text.css({ visibility: 'visible' });
  };

  _truncateComments = () => {
    const $comments = $('[data-value="comment"]');

    $comments.each((idx, el) => {
      const $el = $(el);
      if (!$el.siblings().length) {
        $el.after(`<p class="comments-slider__comment _full">${$el.text()}</p>`);
      }
      clamp(el, { clamp: 4, useNativeClamp: false });
    });
  };

  _installAccordion = () => {
    const $comments = $('[data-value="comment-wrapper"]').not('._initialized');

    $comments.each((idx, el) => {
      const $el = $(el);
      const height = $el.find('[data-value="comment"]').outerHeight();
      const expandedHeight = $el.find('._full').outerHeight();
      if (height > this.minHeight) this.minHeight = height;
      if (expandedHeight > this.maxHeight) this.maxHeight = expandedHeight;
      $el.addClass('_initialized');
      $el.css({ height: `${this.minHeight}px` });
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

  _setIconPosition = () => {
    const $activeText = $('.slick-active [data-value="comment-wrapper"]');
    const $iconQuotes = $('#slider-icon-qoutes');

    if ($activeText.length) {
      const offset = $activeText.offset().left - $activeText.parent().offset().left;
      const left = offset > 0 ? offset + 4 : 16;
      $iconQuotes.animate({ left });
    }
  };

  _getAnimateConfig = (name, delay) => {
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

  _animateText = () => {
    this._replaceText('author');
    this._replaceText('company');
    anime
      .timeline()
      .add(this._getAnimateConfig('company'), 0)
      .add(this._getAnimateConfig('author'), 500);
  };

  _onInitSlider = () => {
    this._setIconPosition();
    this._animateText();
  };

  install = () => {
    $.when(fuse(this._truncateComments, this._installAccordion)).then(() => {
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
            this._onInitSlider();
          })
          .on('beforeChange', () => {
            const $el = $(`.slick-active [data-value="comment-wrapper"]`);
            if ($el.hasClass('_expanded')) {
              $el.removeClass('_expanded');
              $el.css({ height: `${this.minHeight}px` });
              $el.children().eq(1).hide().siblings().show();
            }
            setTimeout(() => {
              this._onInitSlider();
              const $author = $(`.slick-active [data-value="author"]`);
              const $company = $(`.slick-active [data-value="company"]`);

              $author.css({ visibility: 'hidden' });
              $company.css({ visibility: 'hidden' });
            }, 10);
          })
          .on('afterChange', () => {
            this._animateText();
          })
      ).then(this._onInitSlider());
    });
  };
}
