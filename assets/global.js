const inputChangeEvent = new CustomEvent('inputChangeEvent', { bubbles: true });
class ProductInputs extends HTMLElement {
  constructor() {
    super();
    this.sectionId = this.dataset.section;
    this.section = this.closest('.shopify-section');
    this.hiddenInputs = this.section.querySelectorAll(`[id^="product-form-${this.sectionId }"] input[name="${ this.dataset.inputName }"]`);
    this.inputElement = this.querySelector(`[name="${ this.dataset.inputName }"]`);

    this.addEventListener('change', this.onInputChange);
    this.section.addEventListener('inputChangeEvent', (event) => {
      console.log(event.target);
      this.updateHiddenInputs();
    });
  }

  onInputChange() {
    this.dispatchEvent(inputChangeEvent);
  }

  updateHiddenInputs() {
    this.hiddenInputs.forEach((hiddenInput) => {
      hiddenInput.value = this.inputElement.value;
    });
  }
}

customElements.define('product-inputs', ProductInputs);


class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.minusButton = this.querySelector('[name="minus"]');
    this.plusButton = this.querySelector('[name="plus"]');
    this.inputElement = this.querySelector('input');
    [this.minusButton, this.plusButton].forEach((button) => {
      button.addEventListener('click', this.onButtonClick.bind(this));
    });
  }

  onButtonClick(event) {
    event.preventDefault();
    const currentValue = parseInt(this.inputElement.value);
    const newValue = event.target.name === 'plus' ? currentValue + 1 : currentValue - 1;
    this.inputElement.value = newValue > 0 ? newValue : 1;
    this.inputElement.dispatchEvent(inputChangeEvent);
  }
}

customElements.define('quantity-input', QuantityInput);

// Slideshow component
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
    let transitionDirection = target;

    switch (target) {
      case 'next':
        nextSlideIndex = parseInt(this.dataset.activeSlide) + 1;
        break;
      case 'previous':
        nextSlideIndex = parseInt(this.dataset.activeSlide) - 1;
        break;
      default:
        nextSlideIndex = target;
        transitionDirection = nextSlideIndex > this.dataset.activeSlide ? 'next' : 'previous';
        break;
    }

    if (nextSlideIndex < 0) {
      nextSlideIndex = this.slides.length - 1;
    }
    else if (nextSlideIndex >= this.slides.length) {
      nextSlideIndex = 0;
    }

    this.slideTransition(this.slides[this.dataset.activeSlide], this.slides[nextSlideIndex], transitionDirection);
    this.updateControls(nextSlideIndex);
    this.dataset.activeSlide = nextSlideIndex;
    this.currentSlideIndex = nextSlideIndex;
  }

  slideTransition(currentSlide, nextSlide, transitionDirection) {
    const slideshowControls = this.querySelectorAll('.slideshow-control');
    slideshowControls.forEach((control) => { control.setAttribute('disabled', 'true')});

    currentSlide.addEventListener('animationend', (event) => {
      if (event.animationName.includes('slideIn')) return;

      // Hide slides & reset transitions
      this.slides.forEach((slide) => {
        slide.setAttribute('aria-hidden', 'true');
        slide.classList.remove(`slide--transition-out-${transitionDirection}`);
      });

      // Set new slide to active
      nextSlide.setAttribute('aria-hidden', 'false');
      nextSlide.classList.remove(`slide--${transitionDirection}`);
      slideshowControls.forEach(control => { control.removeAttribute('disabled')});
    });

    // Start slide transition
    currentSlide.classList.add(`slide--transition-out-${transitionDirection}`);
    nextSlide.classList.add(`slide--${transitionDirection}`);
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
};

customElements.define('slideshow-component', SlideshowComponent);
