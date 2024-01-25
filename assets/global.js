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
