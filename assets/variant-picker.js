class VariantPicker extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback(){
    const optionValues = this.querySelectorAll('input.product-option-value');
    for(const optionValue of optionValues){
      optionValue.addEventListener('input', event => {
        this.setVariant(optionValue.value);
      });
    }
  }
  updateDOM(newURL, variantId){
    const that = this;
    that.classList.add('loading');
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
      window.dispatchEvent(new CustomEvent('variant:changed', {bubbles: true, cancelable: false, detail: {variantId: variantId}}));
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
  setVariant(variantId){
    const form = this.closest('form.shopify-product-form');
    const current_selling_plan_input = form.querySelector('input[name="selling_plan"]');
    const sellingPlanId = current_selling_plan_input.value;
    this.updateURL(variantId, sellingPlanId);

    let sectionId = this.dataset.sectionId;
    if(!sectionId) {
      sectionId = this.closest('form')?.querySelector('input[name="section-id"]')?.value;
    }
    const productUrl = this.dataset.productUrl;
    const newURL = `${productUrl}?variant=${variantId}&selling_plan=${sellingPlanId}&section_id=${sectionId}`;
    this.updateDOM(newURL, variantId);
  }
}
customElements.define('variant-picker', VariantPicker);