import { registerFormatType, unregisterFormatType } from '@wordpress/rich-text';

/**
 * Setting the lang/dir of a text selection is now handled by core's "Language" format (core/language, <bdo>).
 *
 * This format is kept without any UI so content created with the previous toolbar button
 * (<span lang="…" dir="…">) keeps its attributes when edited.
 * core/underline also handles bare <span> elements, it has to be unregistered for this format to be used.
 */
unregisterFormatType('core/underline');
registerFormatType('core-blocks-enhancer/lang', {
  title: 'Lang (legacy)',
  tagName: 'span',
  className: null,
  attributes: {
    lang: 'lang',
    dir: 'dir'
  }
});
