Shopify.theme = Shopify.theme || {};
Shopify.theme.cart = Shopify.theme.cart || {};
Shopify.theme.cart.action = Shopify.theme.cart.action || "redirect";
Shopify.theme.cart = {
  sections: ["cart-drawer", "cart-main"],
  init: function () {
    window.addEventListener("cart:add", function (e) {
      e.preventDefault();
      if (Shopify.theme.cart.action == "redirect") {
        location.pathname = window.Shopify.routes.cartUrl;
      } else if (Shopify.theme.cart.action == "drawer") {
        window.dispatchEvent(new CustomEvent("cart:drawer:open"));
      }
    });
  },
  /**
   * Callback to do custom responsehandling for all cart api calls
   * @callback cartCallback
   * @param {Object} response
   */
  /**
   * Adds items to cart.
   * @param {boolean} itemsToAdd - products to add example: {items:[{id: variant.id, quantity: variant.quantity}]}
   * @param {boolean} events - fire cart:add event default true.
   * @param {cartCallback} callback - the callback that handles the response.
   */
  addToCart: function (itemsToAdd, events = true, callback = (cart) => {}) {
    const url = window.Shopify.routes.cartAddUrl + "?sections=" + this.sections.join(",");
    fetch(url, {
      body: JSON.stringify(itemsToAdd),
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
      method: "POST",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        if (response.status) {
          if (events) {
            window.dispatchEvent(new CustomEvent("cart:add", { detail: {} }));
          }
          const error_string = `\nCART ADD FAILED \nStatus: ${response.status} \nMessage: ${response.message} \nDescription: ${response.description}`;
          throw new Error(error_string, { cause: "Cart Error" });
        } else {
          callback(response);
          if (events) {
            window.dispatchEvent(new CustomEvent("cart:add", { detail: { ...response } }));
          }
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  },
  /**
   * Gets the cart and provides it via events.
   * @param {boolean} events - fire cart:add event default true.
   * @param {cartCallback} callback - the callback that handles the response.
   */
  getCart: function (events = true, callback = (cart) => {}) {
    const url = window.Shopify.routes.cartUrl + "?sections=" + this.sections.join(",");
    fetch(window.Shopify.routes.cartUrl, {
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
      method: "GET",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        if (response.status) {
          const error_string = `\nCART GET FAILED \nStatus: ${response.status} \nMessage: ${response.message} \nDescription: ${response.description}`;
          throw new Error(error_string, { cause: "Cart Error" });
        } else {
          callback(response);
          if (events) {
            window.dispatchEvent(new CustomEvent("cart:changed", { detail: { ...response } }));
          }
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  },
  /**
   * Updates one or multiple line_items either by specifying the line_index or the variant.id.
   * @param {boolean} itemsToUpdate - items to update example: {updates:{variant.id: 2}}
   * @param {boolean} events - fire cart:add event default true.
   * @param {cartCallback} callback - the callback that handles the response.
   */
  updateCart: function (itemsToUpdate, events = true, callback = (cart) => {}) {
    const url = window.Shopify.routes.cartUpdateUrl + "?sections=" + this.sections.join(",");
    fetch(url, {
      body: JSON.stringify(itemsToUpdate),
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
      method: "POST",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        if (response.status) {
          const error_string = `\nCART UPDATE FAILED \nStatus: ${response.status} \nMessage: ${response.message} \nDescription: ${response.description}`;
          throw new Error(error_string, { cause: "Cart Error" });
        } else {
          callback(response);
          if (events) {
            window.dispatchEvent(new CustomEvent("cart:changed", { detail: { ...response } }));
          }
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  },
  /**
   * Clears the cart and returns the empty cart via events.
   * @param {boolean} events - fire cart:add event default true.
   * @param {cartCallback} callback - the callback that handles the response.
   */
  clearCart: function (events = true, callback = (cart) => {}) {
    const url = window.Shopify.routes.cartClearUrl + "?sections=" + this.sections.join(",");
    fetch(url, {
      body: "",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
      method: "POST",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        if (response.status) {
          const error_string = `\nCART CLEAR FAILED \nStatus: ${response.status} \nMessage: ${response.message} \nDescription: ${response.description}`;
          throw new Error(error_string, { cause: "Cart Error" });
        } else {
          callback(response);
          if (events) {
            window.dispatchEvent(new CustomEvent("cart:changed", { detail: { ...response } }));
          }
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  },
  /**
   * Change quantity or properties of a line_item with a given variant.key.
   * @param {boolean} itemToChange - item to change example: {id: variant.key, quantity: variant.quantity}
   * @param {boolean} events - fire cart:add event default true.
   * @param {cartCallback} callback - the callback that handles the response.
   */
  changeItem: function (itemToChange, events = true, callback = (cart) => {}) {
    const url = window.Shopify.routes.cartChangeUrl + "?sections=" + this.sections.join(",");
    fetch(url, {
      body: JSON.stringify(itemToChange),
      credentials: "same-origin",
      headers: { "Content-Type": "application/json", Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
      method: "POST",
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        if (response.status) {
          const error_string = `\nCART CHANGE FAILED \nStatus: ${response.status} \nMessage: ${response.message} \nDescription: ${response.description}`;
          throw new Error(error_string, { cause: "Cart Error" });
        } else {
          callback(response);
          if (events) {
            window.dispatchEvent(new CustomEvent("cart:changed", { detail: { ...response } }));
          }
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  },
};
Shopify.theme.cart.init();