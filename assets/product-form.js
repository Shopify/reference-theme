class ProductForm extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const variantIdInputs = this.querySelectorAll(`[name="id"]`);
    const sellingPlanInputs = this.querySelectorAll(`[name="selling_plan"]`);
  }
}
customElements.define("product-form", ProductForm);