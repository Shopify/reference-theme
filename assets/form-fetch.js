class FormFetch extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.form = this.querySelector("form");
    this.onSuccess = Function(this.getAttribute("onsuccess"));
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();

      const formData = new FormData(this.form);

      fetch(this.form.action, {
        method: this.form.method,
        body: formData,
      })
        .then((res) => res.text())
        .then((res) => {
          this.onSuccess();
        })
        .catch(console.error);
    });
  }

  static get observedAttributes() {
    return [];
  }
  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;

    this[property] = newValue;
  }
}
customElements.define("form-fetch", FormFetch);
