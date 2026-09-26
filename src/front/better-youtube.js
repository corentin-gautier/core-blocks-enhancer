/**
 * Replaces a youtube link (<a is="better-youtube">) by a thumbnail, the iframe is only loaded on click.
 *
 * Enhances plain anchors instead of using a customized built-in element, which Safari doesn't support.
 */
export class BetterYoutube {

  static #selector = 'a[is="better-youtube"]';
  static #enhanced = new WeakSet();

  #link;
  #parent;
  #ID;
  #options;
  #isSufficientConnection = false;

  constructor(link) {
    this.#link = link;
    this.#parent = link.parentNode;
    this.#ID = BetterYoutube.getVideoId(link.getAttribute('href'));

    if (this.#ID) {
      this.#isSufficientConnection = navigator.connection ? parseInt(navigator.connection.effectiveType, 10) > 3 : true;
      this.#showUI();
    }
  }

  /**
   * Supports youtu.be/ID, youtube.com/watch?v=ID, /embed/ID, /shorts/ID and /live/ID
   *
   * @param {string} href
   * @returns {string|null}
   */
  static getVideoId(href) {
    let url;

    try {
      url = new URL(href, window.location.href);
    } catch (e) {
      return null;
    }

    if (url.hostname === 'youtu.be') {
      return url.pathname.split('/')[1] || null;
    }

    if (url.searchParams.get('v')) {
      return url.searchParams.get('v');
    }

    const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/);
    return match ? match[1] : null;
  }

  #showUI() {
    const thumbnailQuality = this.#isSufficientConnection ? 'sddefault' : 'default';
    const link = this.#link;

    link.classList.add('iframe-placeholder');
    link.innerHTML = '<svg class="ytb-button" width="68px" height="48px" version="1.1" viewBox="0 0 68 48" width="100%"><path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>';

    const thumbnail = document.createElement('img');
    thumbnail.src = `https://i.ytimg.com/vi_webp/${this.#ID}/${thumbnailQuality}.webp`;
    thumbnail.setAttribute('loading', 'lazy');
    thumbnail.alt = '';

    link.prepend(thumbnail);

    if (!this.#isSufficientConnection) {
      return;
    }

    link.addEventListener('click', this.#onClick.bind(this));
    link.style.display = 'block';

    this.#options = { ...link.dataset };
  }

  #onClick(event) {
    if (event.metaKey || event.ctrlKey) {
      return;
    }

    if (typeof window.onYoutubePlaceholderClick === 'function') {
      event.preventDefault();

      return window.onYoutubePlaceholderClick(event).then(() => {
        this.#showIframe(event);
      }).catch((error) => {
        console.error(error);
      });
    }

    this.#showIframe(event);
  }

  #showIframe(event) {
    event.preventDefault();
    this.#link.style.display = 'none';

    const iframe = document.createElement('iframe');
    iframe.frameBorder = 0;
    iframe.src = 'https://www.youtube.com/embed/' + encodeURIComponent(this.#ID) + '?autoplay=1';

    for (const key in this.#options) {
      iframe.setAttribute(key, this.#options[key]);
    }

    this.#parent.append(iframe);
  }

  static #enhance(root) {
    const links = root.matches?.(BetterYoutube.#selector) ? [root] : root.querySelectorAll?.(BetterYoutube.#selector) || [];

    links.forEach((link) => {
      if (BetterYoutube.#enhanced.has(link)) return;

      BetterYoutube.#enhanced.add(link);
      new BetterYoutube(link);
    });
  }

  static registerElement() {
    BetterYoutube.#enhance(document);

    // Links added later on (ajax content, filters…)
    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            BetterYoutube.#enhance(node);
          }
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
}
