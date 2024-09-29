
class Collapsible extends HTMLElement {
  static formAssociated = true;
  constructor() {
    super();
  }
  connectedCallback() {
    this.transitionDuration = this.getAttribute("transition-duration") || 300;
    this.content = this.querySelector("collapsible-content");
    this.label = this.querySelector("collapsible-label");

    if (this.isOpen()) {
      this.content.style.position = "static";
      this.style.height = "auto";
      requestAnimationFrame(() => {
        this.setHeight();
      });
    }

    this.label.addEventListener("click", (e) => {
      this.toggle();
    });
  }
  isOpen() {
    return this.hasAttribute("open");
  }
  setInitialHeight() {
    const labelHeight = this.label.getBoundingClientRect().height;
    this.style.height = labelHeight + "px";
  }
  setHeight() {
    const contentHeight = this.content.getBoundingClientRect().height;
    const labelHeight = this.label.getBoundingClientRect().height;
    this.style.height = contentHeight + labelHeight + "px";
  }
  open() {
    this.setAttribute("open", true);
    this.setInitialHeight();
    this.setHeight();

    setTimeout(() => {
      this.content.style.position = "static";
      this.style.height = "auto";
      this.dispatchEvent(new Event("collapsible:opened"));
    }, this.transitionDuration);
  }
  close() {
    this.removeAttribute("open");
    this.setHeight();
    window.requestAnimationFrame(() => {
      this.content.style.position = "";
      this.setInitialHeight();
      this.dispatchEvent(new Event("collapsible:closed"));
    });
  }
  toggle() {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }
}
customElements.define("collapsible-outer", Collapsible);
customElements.define("collapsible-content", class extends HTMLElement {});
customElements.define("collapsible-label", class extends HTMLElement {});
