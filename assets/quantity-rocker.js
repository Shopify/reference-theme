class QuantityRocker extends HTMLElement {
  #value = 1;
  #min = 0;
  #max = 999;
  #shadow = null;
  #shadowDecement = null;
  #shadowInput = null;
  #shadowIncrement = null;

  constructor() {
    super();
  }
  connectedCallback() {
    this.#shadow = this.attachShadow({ mode: "open" });
    this.render();
  }

  render() {
    this.#shadow.innerHTML = `
      <style>
        input::-webkit-outer-spin-button,input::-webkit-inner-spin-button {-webkit-appearance: none; margin: 0;}
        input:focus{outline: none;}
      </style>
      <div part="wrapper">
          <button part="decrement" ${this.value == this.min ? "disabled" : ""}>-</button>
          <input part="input" type="number" value="${this.value}" min="${this.min}" max="${this.max}">
          <button part="increment" ${this.value == this.max ? "disabled" : ""}>+</button>
      </div>
    `;
    this.#shadowDecement = this.#shadow.querySelector('[part="decrement"]');
    this.#shadowDecement.addEventListener("click", () => {
      this.value = Number(this.value) - 1;
      this.update();
    });
    this.#shadowInput = this.#shadow.querySelector('[part="input"]');
    this.#shadowInput.addEventListener("change", () => {
      this.value = Number(this.#shadowInput.value);
      this.update();
    });
    this.#shadowIncrement = this.#shadow.querySelector('[part="increment"]');
    this.#shadowIncrement.addEventListener("click", () => {
      this.value = Number(this.value) + 1;
      this.update();
    });
  }
  update() {
    this.dispatchEvent(new Event("change"));
    this.render();
  }
  set value(v) {
    const clampedValue = Math.max(this.#min, Math.min(this.#max, Number(v)));
    this.#value = clampedValue;
    this.setAttribute("value", clampedValue);
  }
  get value() {
    return this.#value;
  }
  set min(v) {
    this.#min = Number(v);
    this.setAttribute("min", v);
  }
  get min() {
    return this.#min;
  }
  set max(v) {
    this.#max = Number(v);
    this.setAttribute("max", v);
  }
  get max() {
    return this.#max;
  }

  static get observedAttributes() {
    return ["value", "id", "min", "max"];
  }
  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[property] = newValue;
    this.render();
  }
}
customElements.define("quantity-rocker", QuantityRocker);
