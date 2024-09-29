Shopify.theme = Shopify.theme || {};
Shopify.theme.cart = Shopify.theme.cart || {};
Shopify.theme.cart.action = Shopify.theme.cart.action || "redirect"; 
const DEFAULT_OPTIONS = {
  events: true, 
  sections: [],
  callback: (cart) => {}
}
Shopify.theme.cart = {
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
  add: function (itemsToAdd, options = DEFAULT_OPTIONS) {
    const url = window.Shopify.routes.cartAddUrl + "?sections=" + options.sections.join(",");
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
          if (options.events) {
            window.dispatchEvent(new CustomEvent("cart:add", { detail: {} }));
          }
          const error_string = `\nCART ADD FAILED \nStatus: ${response.status} \nMessage: ${response.message} \nDescription: ${response.description}`;
          throw new Error(error_string, { cause: "Cart Error" });
        } else {
          options.callback(response);
          if (options.events) {
            window.dispatchEvent(new CustomEvent("cart:add", { detail: { ...response } }));
          }
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  },
  get: function (options = DEFAULT_OPTIONS) {
    const url = window.Shopify.routes.cartUrl + "?sections=" + options.sections.join(",");
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
          options.callback(response);
          if (options.events) {
            window.dispatchEvent(new CustomEvent("cart:changed", { detail: { ...response } }));
          }
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  },
  update: function (itemsToUpdate, options = DEFAULT_OPTIONS) {
    const url = window.Shopify.routes.cartUpdateUrl + "?sections=" + options.sections.join(",");
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
          options.callback(response);
          if (options.events) {
            window.dispatchEvent(new CustomEvent("cart:changed", { detail: { ...response } }));
          }
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  },
  clear: function (options = DEFAULT_OPTIONS) {
    const url = window.Shopify.routes.cartClearUrl + "?sections=" + options.sections.join(",");
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
          options.callback(response);
          if (options.events) {
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