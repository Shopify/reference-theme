if (!customElements.get('slideshow-component')) {
  customElements.define(
    'slideshow-component',
    class SlideshowComponent extends HTMLElement {
      constructor() {
        super();
        this.slides = this.querySelectorAll(".slideshow__slide");
        if ( this.slides.length <= 1) return;

        this.currentSlideIndicator = this.querySelector(".current-slide-indicator");
        this.currentSlideIndex = this.dataset.activeSlide;
        this.counterControls = this.querySelectorAll(".slideshow-controls__link");

        this.nextControl = this.querySelector(".slideshow-control--next");
        this.previousControl = this.querySelector(".slideshow-control--previous");

        if (this.getAttribute('data-autoplay') === 'true') {
          this.autoplaySpeed = parseInt(this.dataset.autoplaySpeed) * 1000;
          this.isAutoplayButtonSetToPlay = true;
          this.setAutoPlay();
        }

        this.initButtons();
      }

      initButtons() {
        this.nextControl.addEventListener("click", () => {
          this.updateSlideshow('next');
          this.resetAutoPlay();
        });

        this.previousControl.addEventListener("click", () => {
          this.updateSlideshow('previous');
          this.resetAutoPlay();
        });

        this.counterControls.forEach(control => {
          control.addEventListener("click", () => {
            if (this.currentSlideIndex == control.dataset.slideNumber) return;
            this.updateSlideshow(control.dataset.slideNumber);
            this.resetAutoPlay();
          });
        });
      }

      updateSlideshow(target = 'next') {
        let nextSlideIndex = 0;

        switch (target) {
          case 'next':
            nextSlideIndex = parseInt(this.dataset.activeSlide) + 1;
            break;
          case 'previous':
            nextSlideIndex = parseInt(this.dataset.activeSlide) - 1;
            break;
          default:
            nextSlideIndex = target;
            break;
        }

        const transitions = ['left', 'top', 'right', 'bottom'];
        const transitionStyle = nextSlideIndex > this.dataset.activeSlide ? this.dataset.transitionStyle : transitions[(transitions.indexOf(this.dataset.transitionStyle)+2) % transitions.length];

        if (nextSlideIndex < 0) {
          nextSlideIndex = this.slides.length - 1;
        }
        else if (nextSlideIndex >= this.slides.length) {
          nextSlideIndex = 0;
        }

        this.slideTransition(this.slides[this.dataset.activeSlide], this.slides[nextSlideIndex], transitionStyle);
        this.updateControls(nextSlideIndex);
        this.dataset.activeSlide = nextSlideIndex;
        this.currentSlideIndex = nextSlideIndex;
      }

      slideTransition(currentSlide, nextSlide, transitionStyle = 'left') {
        const slideshowControls = this.querySelectorAll('.slideshow-control');
        slideshowControls.forEach((control) => { control.setAttribute('disabled', 'true')});

        currentSlide.addEventListener('transitionend', (event) => {
          // Make sure we're only looking at the property that interest us
          if (event.propertyName !== 'transform') return;

          // Hide slides & reset transitions
          this.slides.forEach((slide) => {
            slide.setAttribute('aria-hidden', 'true');
            slide.classList.remove(`slide--transition-${transitionStyle}`);
          });

          // Set new slide to active
          nextSlide.setAttribute('aria-hidden', 'false');
          nextSlide.classList.remove('slide--next');
          slideshowControls.forEach(control => { control.removeAttribute('disabled')});
        });

        // Start slide transition
        currentSlide.classList.add(`slide--transition-${transitionStyle}`);
        nextSlide.classList.add('slide--next');
      }

      updateControls(newSlideIndex) {
        // If we have a current slide indicator (i.e. 2/3), update it
        if (this.currentSlideIndicator) {
          this.currentSlideIndicator.innerText = `${newSlideIndex + 1}/${this.slides.length}`;
          return;
        }

        this.counterControls.forEach(control => { control.classList.remove("slideshow-controls__link--active")});
        this.counterControls[newSlideIndex].classList.add("slideshow-controls__link--active");
      }

      resetAutoPlay() {
        if (this.isAutoplayButtonSetToPlay) {
          this.play();
        }
      }

      /* Handle autoplay */
      setAutoPlay() {
        this.addEventListener('mouseover', this.focusInHandling.bind(this));
        this.addEventListener('mouseleave', this.focusOutHandling.bind(this));
        this.addEventListener('focusin', this.focusInHandling.bind(this));
        this.addEventListener('focusout', this.focusOutHandling.bind(this));

        this.sliderAutoplayButton = this.querySelector('.slideshow-control--autoplay');
        this.sliderAutoplayButton.addEventListener('click', this.autoPlayToggle.bind(this));
        this.isAutoplayButtonSetToPlay = true;
        this.play();
      }

      autoPlayToggle() {
        this.togglePlayButtonState(this.isAutoplayButtonSetToPlay);
        this.isAutoplayButtonSetToPlay ? this.pause() : this.play();
        this.isAutoplayButtonSetToPlay = !this.isAutoplayButtonSetToPlay;
      }

      togglePlayButtonState(pauseAutoplay) {
        this.sliderAutoplayButton.classList.toggle('slideshow-control--autoplay--paused', pauseAutoplay);
        (pauseAutoplay) ? this.sliderAutoplayButton.setAttribute('aria-label', 'Play slideshow') : this.sliderAutoplayButton.setAttribute('aria-label', 'Pause slideshow');
      }

      play() {
        this.setAttribute('aria-live', 'off');
        clearInterval(this.autoplay);
        this.autoplay = setInterval(this.autoRotateSlides.bind(this), this.autoplaySpeed);
      }

      pause() {
        this.setAttribute('aria-live', 'polite');
        clearInterval(this.autoplay);
      }

      autoRotateSlides() {
        this.updateSlideshow('next');
      }

      focusOutHandling(event) {
        const focusedOnAutoplayButton =
          event.target === this.sliderAutoplayButton || this.sliderAutoplayButton.contains(event.target);

        if (this.isAutoplayButtonSetToPlay && !focusedOnAutoplayButton) this.play();
      }

      focusInHandling(event) {
        const focusedOnAutoplayButton =
          event.target === this.sliderAutoplayButton || this.sliderAutoplayButton.contains(event.target);

        if (this.isAutoplayButtonSetToPlay) {
          focusedOnAutoplayButton ? this.play() : this.pause();
        }
      }
    }
  );
}
