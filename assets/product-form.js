class ProductOptionValue extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const form = this.closest('form');
    const variantId = this.getAttribute('variant-id');
    const productUrl = this.getAttribute('product-url');
    if(!!form){
      const variantIdInput = form.querySelector(`[name="id"]`);
      const productUrlInput = form.querySelector(`[name="url"]`);
      this.addEventListener('click', () => {
        productUrlInput?.setAttribute('value', productUrl);
        variantIdInput?.setAttribute('value', variantId);
      });
    }
  }
}
customElements.define("product-option-value", ProductOptionValue);

class ProductForm extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const productUrlInput = this.querySelector(`[name="url"]`);
    const variantIdInput = this.querySelector(`[name="id"]`);
    const sellingPlanInput = this.querySelector(`[name="selling_plan"]`);
    variantIdInput.addEventListener('change', () => {
      console.log(productUrlInput?.value, variantIdInput?.value, sellingPlanInput?.value);
    });
  }
}
customElements.define("product-form", ProductForm);