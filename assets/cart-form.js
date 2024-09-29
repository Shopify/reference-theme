
class CartForm extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const quantities = this.querySelectorAll(`[name="updates[]"]`);
    const removeButtons = this.querySelectorAll(`[name="line-item-remove"]`);

    quantities.forEach((qty) => {
      qty.addEventListener("change", (e) => {
        this.loading = true;
        this.updateCart({ [qty.dataset.lineItemKey]: Number(qty.value) }).then((res) => {
          this.updateView(res.sections[this.section]);
          this.loading = false;
        });
      });
    });

    removeButtons.forEach((rm) => {
      rm.addEventListener("click", (e) => {
        e.preventDefault();
        this.removeByUrl(rm.href);
      });
    });

    window.addEventListener("cart:add", (e) => {
      this.loading = true;
      this.updateView(e.detail?.sections[this.section]);
      this.loading = false;
    });
  }

  get section() {
    return this.getAttribute("section") || "cart-main";
  }

  removeByUrl(href) {
    this.loading = true;
    const url = new URL(href);
    url.searchParams.append("sections", this.section);
    fetch(`${url}`, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        this.updateView(res.sections[this.section]);
        this.loading = false;
      })
      .catch((err) => {
        console.error(err);
        this.loading = false;
      });
  }

  updateView(htmlString) {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    const newForm = div.querySelector("cart-form");
    this.replaceWith(newForm);
    window.dispatchEvent(new CustomEvent("cart:updated"));
  }

  async updateCart(updates) {
    return new Promise((resolve) => {
      Shopify.theme.cart.update({ updates }, {
        events: true,
        callback: (cart) => {},
        sections: [this.section]
      });
    });
  }
  set loading(v) {
    if (v) {
      this.setAttribute("loading", v);
    } else {
      this.removeAttribute("loading");
    }
  }
  get loading() {
    return this.hasAttribute("loading");
  }

  static get observedAttributes() {
    return [];
  }
  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[property] = newValue;
  }
}

customElements.define("cart-form", CartForm);