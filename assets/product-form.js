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
        productUrlInput.value = productUrl;
        variantIdInput.value = variantId;
        productUrlInput.dispatchEvent(new Event('input'));
        variantIdInput.dispatchEvent(new Event('input'));
      });
    }
  }
}
customElements.define("product-option-value", ProductOptionValue);

class ProductForm extends HTMLElement {
  constructor() {
    super();
  }
  updateView() {
    const productUrlInput = this.querySelector(`form [name="url"]`);
    const variantIdInput = this.querySelector(`form [name="id"]`);
    const sellingPlanInput = this.querySelector(`form [name="selling_plan"]`);
    const fetchUrl = new URL(location);
    fetchUrl.pathname = productUrlInput.value;
    if(!!variantIdInput?.value) {
      fetchUrl.searchParams.set('variant', variantIdInput.value);
    }
    if(!!sellingPlanInput?.value) {
      fetchUrl.searchParams.set('selling_plan', sellingPlanInput.value);
    }
    console.log(fetchUrl.href);
  }
  connectedCallback() {
    const variantIdInput = this.querySelector(`form [name="id"]`);
    const sellingPlanInput = this.querySelector(`form [name="selling_plan"]`);
    variantIdInput?.addEventListener('input', this.updateView.bind(this));
    sellingPlanInput?.addEventListener('input', this.updateView.bind(this));
  }
}
customElements.define("product-form", ProductForm);