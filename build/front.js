(function(){'use strict';class ObfLink extends HTMLAnchorElement {
  
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
    });
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
}class BetterYoutube extends HTMLAnchorElement {

  #button;
  #thumbnail;
  #iframe;
  #options;
  #ID;
  #URL;
  #parent;
  #isSufficientConnection = false;

  constructor() {
    super();
  }

  connectedCallback() {
    this.#parent = this.parentNode;
    this.#URL = new URL(this.getAttribute('href'));
    this.#ID = this.#URL.search.split('?v=')[1];

    this.#isSufficientConnection = parseInt(navigator.connection.effectiveType, 10) > 3;

    this.#showUI();
  }

  #showUI() {
    const thumbnailQuality = this.#isSufficientConnection ? 'sddefault' : 'default';
    
    this.classList.add('iframe-placeholder');
    this.innerHTML = '<svg class="ytb-button" width="68px" height="48px" version="1.1" viewBox="0 0 68 48" width="100%"><path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>';
    
    this.#thumbnail = document.createElement('img');
    this.#thumbnail.src = `https://i.ytimg.com/vi_webp/${this.#ID}/${thumbnailQuality}.webp`;

    this.#thumbnail.setAttribute('loading', 'lazy');
    
    this.prepend(this.#thumbnail);

    if (!this.#isSufficientConnection) {
      return;
    }

    this.addEventListener('click', this.#showIframe.bind(this));
    this.#button = document.createElement('button');
    this.#button.classList.add('iframe-placeholder');

    this.style.display = 'block';

    this.#options = { ...this.dataset };
  }

  #showIframe(event) {
    if (event.metaKey) {
      return;
    }
    event.preventDefault();
    this.style.display = 'none';
    this.#iframe = document.createElement('iframe');
    this.#iframe.frameBorder = 0;
    this.#iframe.src = this.#URL.origin + '/embed/' + this.#ID + '?autoplay=1';

    for (const key in this.#options) {
      this.#iframe.setAttribute(key, this.#options[key]);
    }

    this.#parent.append(this.#iframe);
  }

  static registerElement() {
    if (window.customElements) {
      customElements.define('better-youtube', BetterYoutube, {
        extends: 'a'
      });
    }
  }
}ObfLink.registerElement();
BetterYoutube.registerElement();})();