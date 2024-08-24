class FilterValue extends HTMLElement {
  constructor() {
    super();
  }
  updateDeepLinking(url) {
    const currentURL = new URL(location.href);
    const newURL = new URL(url, location.origin);
    // übernehme alle parameter die nichts mit dem filter zu tun haben
    currentURL.searchParams.forEach((value, key) => {
      if(!key.includes('filter')){
        newURL.searchParams.set(key, value);
      }
    });
    history.replaceState(null, '', newURL.href);
  }
  updateDOM(url){
    this.updateDeepLinking(url);
    const section = this.closest('[data-section-id]');
    if(!!section) {
      const section_id = section.dataset.sectionId;
      if(!!section_id && !!url){
        section.classList.add('loading');
        const fetch_url = new URL(url, location.origin);
        fetch_url.searchParams.set('section_id', section_id);
        fetch(fetch_url.href, {
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
          section.classList.remove('loading');
        }).catch(function(err) {
          section.classList.remove('loading');
          console.error(err);
        });
      }
    }
  }
}

class FilterValuePriceRange extends FilterValue {
  constructor() {
    super();
  }
  connectedCallback() {
    this.updateUrl = this.getAttribute('update-url');
    this.fromSlider = this.querySelector('#fromRange');
    this.toSlider = this.querySelector('#toRange');
    this.fromInput = this.querySelector('#fromValue');
    this.toInput = this.querySelector('#toValue');
    this.fillSlider(this.fromSlider, this.toSlider, 'rgba(25,10,0, 0.15)', 'var(--color-primary, #000)', this.toSlider);
    this.setToggleAccessible(this.toSlider);
    this.fromSlider.addEventListener('input', this.controlFromSlider.bind(this));
    this.toSlider.addEventListener('input', this.controlToSlider.bind(this));
    this.fromInput.addEventListener('input', this.controlFromInput.bind(this));
    this.toInput.addEventListener('input', this.controlToInput.bind(this));
    this.fromSlider.addEventListener('input', this.debounce(this.handleInput.bind(this), 500));
    this.toSlider.addEventListener('input', this.debounce(this.handleInput.bind(this), 500));
    this.fromInput.addEventListener('input', this.debounce(this.handleInput.bind(this), 500));
    this.toInput.addEventListener('input', this.debounce(this.handleInput.bind(this), 500));
  }
  debounce(fn, wait) {
    const that = this; 
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(that, args), wait);
    };
  }
  handleInput() {
    const that = this;
    let url = that.updateUrl;
    const range_min = 0;
    const range_max = Number(that.toInput.max) ? Number(that.toInput.max) : 1000000;
    const min = that.fromInput.value;
    const max = that.toInput.value;
    if(url.includes('?')){
      if(!!min && min > range_min){
        url += `&filter.v.price.gte=${min}`
      }
    } else {
      if(!!min && min > range_min){
        url += `?filter.v.price.gte=${that.fromInput.value}`
      }
    }
    if(url.includes('?')){
      if(!!max && max < range_max){
        url += `&filter.v.price.lte=${max}`
      }
    } else {
      if(!!max && max < range_max){
        url += `?filter.v.price.lte=${max}`
      }
    }
    super.updateDOM(url);
  }
  controlFromInput() {
    const that = this;
    const [from, to] = that.getParsed(that.fromInput, that.toInput);
    that.fillSlider(that.fromInput, that.toInput, 'rgba(25,10,0, 0.15)', 'var(--color-primary, #000)', that.toSlider);
    if (from > to) {
      that.fromSlider.value = to;
      that.fromInput.value = to;
    } else {
      that.fromSlider.value = from;
    }
  }
  controlToInput() {
    const that = this;
    const [from, to] = that.getParsed(that.fromInput, that.toInput);
    that.fillSlider(that.fromInput, that.toInput, 'rgba(25,10,0, 0.15)', 'var(--color-primary, #000)', that.toSlider);
    that.setToggleAccessible(that.toInput);
    if (from <= to) {
      that.toSlider.value = to;
      that.toInput.value = to;
    } else {
      that.toInput.value = from;
    }
  }
  controlFromSlider() {
    const that = this;
    const [from, to] = that.getParsed(that.fromSlider, that.toSlider);
    that.fillSlider(that.fromSlider, that.toSlider, 'rgba(25,10,0, 0.15)', 'var(--color-primary, #000)', that.toSlider);
    if (from > to) {
      that.fromSlider.value = to;
      that.fromInput.value = to;
    } else {
      that.fromInput.value = from;
    }
  }
  controlToSlider() {
    const that = this;
    const [from, to] = that.getParsed(that.fromSlider, that.toSlider);
    that.fillSlider(that.fromSlider, that.toSlider, 'rgba(25,10,0, 0.15)', 'var(--color-primary, #000)', that.toSlider);
    that.setToggleAccessible(that.toSlider);
    if (from <= to) {
      that.toSlider.value = to;
      that.toInput.value = to;
    } else {
      that.toInput.value = from;
      that.toSlider.value = from;
    }
  }
  getParsed(currentFrom, currentTo) {
    const from = parseInt(currentFrom.value, 10);
    const to = parseInt(currentTo.value, 10);
    return [from, to];
  }
  fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max-to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
      ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
      ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} 100%)`;
  }
  setToggleAccessible(currentTarget) {
    const that = this;
    const toSlider = that.querySelector('#toRange');
    if (Number(currentTarget.value) <= 0 ) {
      toSlider.style.zIndex = 2;
    } else {
      toSlider.style.zIndex = 0;
    }
  }
}
customElements.define('filter-value-price-range', FilterValuePriceRange);

class FilterValueBoolean extends FilterValue {
  constructor() {
    super();
  }
  connectedCallback() {
    this.addEventListener('click', () => {
      const url = this.getAttribute('update-url');
      if(!!url){
        super.updateDOM(url);
      }
    });
  }
}
customElements.define('filter-value-boolean', FilterValueBoolean);

class FilterValueList extends FilterValue {
  constructor() {
    super();
  }
  connectedCallback() {
    this.addEventListener('click', () => {
      const url = this.getAttribute('update-url');
      if(!!url){
        super.updateDOM(url);
      }
    });
  }
}
customElements.define('filter-value-list', FilterValueList);

class FilterValueRemove extends FilterValue {
  constructor() {
    super();
  }
  connectedCallback() {
    this.addEventListener('click', () => {
      const url = this.getAttribute('update-url');
      if(!!url){
        super.updateDOM(url);
      }
    });
  }
}
customElements.define('filter-value-remove', FilterValueRemove);

class PaginationNext extends HTMLElement {
  constructor() {
    super();
  }
  updateDOM(url){
    const section = this.closest('[data-section-id]');
    if(!!section) {
      section.classList.add('loading');
      const section_id = section.dataset.sectionId;
      if(!!section_id && !!url){
        const fetch_url = new URL(url, location.origin);
        fetch_url.searchParams.set('section_id', section_id); 
        fetch(fetch_url.href, {
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
          section.classList.remove('loading');
        }).catch(function(err) {
          section.classList.remove('loading');
          console.error(err);
        });
      }
    }
  }
  connectedCallback() {
    this.validateItems();
    this.addEventListener('click', () => {
      const url = this.getAttribute('paginate-next');
      if(!!url){
        this.updateDOM(url);
      }
    });
  }
}
customElements.define('pagination-next', PaginationNext);