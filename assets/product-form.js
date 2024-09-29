class ProductForm extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const quantities = this.querySelectorAll(`[name="id"]`);
    const removeButtons = this.querySelectorAll(`[name="selling_plan"]`);
  }
}
customElements.define("product-form", ProductForm);