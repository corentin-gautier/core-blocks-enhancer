export class ObfLink extends HTMLAnchorElement {
  
  #target;
  #url;

  constructor(element) {
    super();
    let ref = this;

    if (element) {
      ref = element;
    }

    this.#url = window.atob(ref.getAttribute('encoded-url'));
    this.#target = ref.target || '_self';

    ref.addEventListener('click', (e) => {
      e.preventDefault();
      this.#openUrl(e);
    });

    ref.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.#openUrl(e);
      }
    })
  }

  #openUrl(e) {
    const target = e.ctrlKey || e.metaKey ? '_blank' : this.#target;
    window.open(decodeURIComponent(this.#url), target);
  }

  static registerElement() {
    if (window.customElements) {
      customElements.define('obf-link', ObfLink, { extends: 'a' });
    }
  
    const links = document.querySelectorAll('[encoded-url]:not([is="obf-link"])');
    
    links.forEach(l => {
      new ObfLink(l);
    });
  }
}
