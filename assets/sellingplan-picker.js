class SellingPlanPicker extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback(){
    const purchseOptions = this.querySelectorAll('[name="purchase-option"]');
    const sellingPlanSelects = this.querySelectorAll('theme-select.selling-plan-select');
    for(const purchseOption of purchseOptions) {
      purchseOption.addEventListener('input', event => {
        if(purchseOption.value == 'subscription') {
          const label = this.querySelector(`label[for="${purchseOption.id}"]`);
          const sellingPlan = label.querySelector('[name="current-selling-plan"]');
          if(!!sellingPlan){
            this.setSellingPlan(sellingPlan.value);
          }
        }
        if(purchseOption.value == 'onetime') {
          this.removeSellingPlan();
        }
      });
    }
    for(const sellingPlanSelect of sellingPlanSelects) {
      sellingPlanSelect.addEventListener('change', event => {
        const sellingPlan = sellingPlanSelect.value;
        if(!!sellingPlan){
          this.setSellingPlan(sellingPlan);
        }
      });
    }
  }
  updateDOM(newURL, sellingPlanId){
    const that = this;
    const sectionId = that.dataset.sectionId;
    that.classList.remove('loading');
    fetch(newURL, {
      credentials: 'same-origin',
      headers: {'X-Requested-With': 'XMLHttpRequest'},
      method: 'GET'
    })
    .then(response => response.text())
    .then(data => {
      const template = document.createElement('template');
      template.innerHTML = data.trim();
      console.log('handle response TODO', template.content);
      // TODO
      // handle response and update
      window.dispatchEvent(new CustomEvent('sellingplan:changed', {bubbles: true, cancelable: false, detail: sellingPlanId}));
      that.classList.remove('loading');
    })
    .catch(function(err) {
      that.classList.remove('loading');
      console.error(err);
    });
  }
  updateURL(variantId, sellingPlanId){
    const newURL = new URL(document.location);
    if(!!variantId){
      newURL.searchParams.set('variant', variantId);
    } else {
      newURL.searchParams.delete('variant');
    }
    if(!!sellingPlanId){
      newURL.searchParams.set('selling_plan', sellingPlanId);
    } else {
      newURL.searchParams.delete('selling_plan');
    }
    history.replaceState(null, '', newURL.href);
  }
  setSellingPlan(sellingPlanId) {
    const form = this.closest('form.shopify-product-form');
    const current_variant_input = form.querySelector('input[name="id"]');
    const variantId = current_variant_input.value;
    this.updateURL(variantId, sellingPlanId);

    const sectionId = this.dataset.sectionId;
    const productUrl = this.dataset.productUrl;
    const newURL = `${productUrl}?variant=${variantId}&selling_plan=${sellingPlanId}&section_id=${sectionId}`;
    this.updateDOM(newURL, sellingPlanId);
  }
  removeSellingPlan() {
    const form = this.closest('form.shopify-product-form');
    const current_variant_input = form.querySelector('input[name="id"]');
    const variantId = current_variant_input.value;
    this.updateURL(variantId, null);

    let sectionId = this.dataset.sectionId;
    if(!sectionId) {
      sectionId = this.closest('form')?.querySelector('input[name="section-id"]')?.value;
    }
    const productUrl = this.dataset.productUrl;
    const newURL = `${productUrl}?variant=${variantId}&section_id=${sectionId}`;
    this.updateDOM(newURL, null);
  }
}
customElements.define('selling-plan-picker', SellingPlanPicker);