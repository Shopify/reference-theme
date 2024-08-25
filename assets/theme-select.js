class ThemeSelect extends HTMLElement {
  static OPEN_ATTRIBUTE = "open";
  #initialized = false;
  #options = [];
  #value;
  #shadow;
  #shadowOptions;
  #shadowSelectedValue;
  constructor() {
    super();
  }
  connectedCallback() {
    this.#options = this.querySelectorAll("option");
    this.updateSelectedOption();
    this.value = this.selectedOption?.value ?? "";
    this.#shadow = this.attachShadow({ mode: "open" });

    this.render();

    document.body.addEventListener("click", (e) => {
      if (this.isOpen()) {
        const boundingBox = this.getBoundingClientRect();
        const clickInside =
          e.clientX > boundingBox.x &&
          e.clientX < boundingBox.x + boundingBox.width &&
          e.clientY > boundingBox.y &&
          e.clientY < boundingBox.y + boundingBox.height;
        if (!clickInside) {
          this.close();
        }
      }
    });

    this.#initialized = true;
  }
  updateSelectedOption() {
    const selectedOption = Array.from(this.#options).find((o) => o.hasAttribute("selected"));
    const optionFromValue = Array.from(this.#options).find((o) => o.value == this.value);
    const firstOption = this.#options.length > 0 ? this.#options[0] : null;
    this.selectedOption = selectedOption || optionFromValue || firstOption;
    if (this.selectedOption == null) {
      console.warn(`[${this.tagName}] Could not identify selected option.`);
    }
  }
  render() {
    this.#shadow.innerHTML = `
      <div part="selected-value">
        <span>${this.selectedOption?.innerHTML ?? ""}</span>
      </div>
      <div part="dropdown">
        ${Array.from(this.#options)
          .map(
            (o) =>
              `<option part="option ${this.selectedOption == o ? "selected" : ""} ${o.disabled ? "disabled" : ""}" value="${o.value}" ${this.selectedOption == o ? "selected" : ""} ${o.disabled ? "disabled" : ""}>${o.innerHTML}</option>`,
          )
          .join("")}
      </div>
    `;
    this.#shadowOptions = this.#shadow.querySelectorAll("option");
    this.#shadowOptions.forEach((option) => {
      option.addEventListener("click", () => {
        this.value = option.value;
        this.selectOptionByValue(option.value);
        this.updateSelectedOption();
        this.update();
        this.close();
      });
    });

    this.#shadowSelectedValue = this.#shadow.querySelector('div[part="selected-value"]');
    this.#shadowSelectedValue.addEventListener("click", () => {
      this.toggle();
    });
  }
  selectOptionByValue(value) {
    this.#options.forEach((o) => (o.value == value ? o.setAttribute("selected", true) : o.removeAttribute("selected")));
  }

  update() {
    this.dispatchEvent(new Event("change"));
    this.render();
  }
  close() {
    this.removeAttribute(ThemeSelect.OPEN_ATTRIBUTE);
  }
  open() {
    this.setAttribute(ThemeSelect.OPEN_ATTRIBUTE, true);
  }
  isOpen() {
    return this.hasAttribute(ThemeSelect.OPEN_ATTRIBUTE);
  }
  toggle() {
    this.isOpen() ? this.close() : this.open();
  }
  set value(v) {
    this.#value = v;
    this.setAttribute("value", v);
  }
  get value() {
    return this.#value;
  }

  static get observedAttributes() {
    return ["name", "value", "id", "open"];
  }
  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (property === "value") {
      this.selectOptionByValue(newValue);
      this.updateSelectedOption();
      if (this.#initialized) {
        this.render();
      }
      return;
    }
    if (property === ThemeSelect.OPEN_ATTRIBUTE) {
      this.hasAttribute(ThemeSelect.OPEN_ATTRIBUTE) ? this.open() : this.close();
      return;
    }
    this[property] = newValue;
  }
}
customElements.define("theme-select", ThemeSelect);
