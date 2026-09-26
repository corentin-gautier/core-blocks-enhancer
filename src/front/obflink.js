/**
 * Obfuscated links: <a encoded-url="base64"> elements without href.
 *
 * Uses a delegated listener instead of a customized built-in element (<a is="obf-link">),
 * which Safari doesn't support. It also handles links added to the page later on.
 */
export class ObfLink {

  static #selector = '[encoded-url]';

  static #openUrl(link, event) {
    const url = window.atob(link.getAttribute('encoded-url'));
    const target = event.ctrlKey || event.metaKey ? '_blank' : (link.target || '_self');

    window.open(decodeURIComponent(url), target);
  }

  static registerElement() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest(ObfLink.#selector);

      if (link) {
        event.preventDefault();
        ObfLink.#openUrl(link, event);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter') return;

      const link = event.target.closest(ObfLink.#selector);

      if (link) {
        event.preventDefault();
        ObfLink.#openUrl(link, event);
      }
    });
  }
}
