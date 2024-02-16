<?php

defined('ABSPATH') || exit();

class CoreBlockEnhancerRenderer {

	/**
	 * Util function to get a template
	 *
	 * @param string $name
	 * @return string
	 */
	public static function get_template($name, $context = [])
	{
		$filename = $name . '.php';

		if ( locate_template( $filename ) ) {
			$template = locate_template( $filename );
		} else {
			$path = plugin_dir_path(__FILE__) . '../views/' . $filename;

			if ( file_exists( $path ) ) {
				$template = $path;
			}
		}

		if (isset($template)) {
			ob_start();
    		require($template);
    		return ob_get_clean();
		}

		return null;
	}

	/**
	 * Util function to obfuscate a link
	 *
	 * @param string $string
	 * @return string
	 */
	public static function obfuscate_link($string)
	{
		return preg_replace_callback('/href="(.*?)"/', function ($m) {
			return 'is="obf-link" tabindex="0" encoded-url="' . base64_encode($m[1]) . '"';
		}, $string);
	}

	/**
	 * Change core paragraphs render
	 *
	 * @param string $content
	 * @param array $block
	 * @return void
	 */
	public static function render_core_paragraph($content, $block)
	{
		if (isset($block['attrs']['obfuscate']) && (bool)$block['attrs']['obfuscate']) {
			$content = self::obfuscate_link($content);
		}
		return $content;
	}

	/**
	 * Change core table render
	 *
	 * @param string $content
	 * @param array $block
	 * @return string
	 */
	public static function render_core_table($content, $block)
	{
		return preg_replace('/<th>/', '<th scope="col">', $content);
	}

	/**
	 * Change core heading render
	 *
	 * @param string $content
	 * @param array $block
	 * @return string
	 */
	public static function render_core_heading($content, $block)
	{
		if ( isset($block['attrs']['headingLevel']) ) {
			$level = $block['attrs']['headingLevel'];
			$role = (int)$level === 0 ? "presentation" : "heading";
			$alevel = $role === 'heading' ? "aria-level={$level}" : "";

			$content = preg_replace('/<h([1-6])(.*?)>(.*)<\/h([1-6])>/', "<h$1 $2 role='{$role}' {$alevel}>$3</h$1>", $content);
		}
		return $content;
	}

	/**
	 * Change core images render
	 *
	 * @param string $content
	 * @param array $block
	 * @return string
	 */
	public static function render_core_image($content, $block)
	{
		if (isset($block['attrs']['useForSeoRanking']) && (bool)$block['attrs']['useForSeoRanking']) {
			$content = preg_replace('/<img (.*)\/>/', '<img aria-hidden="true" $1/>', $content);
		}
		return $content;
	}

	/**
	 * Change core media/text render
	 *
	 * @param string $content
	 * @param array $block
	 * @return string
	 */
	public static function render_core_media_text($content, $block)
	{
		if (isset($block['attrs']['useForSeoRanking']) && (bool)$block['attrs']['useForSeoRanking']) {
			$content = preg_replace('/<figure class="wp-block-media-text__media"><img (.*)><\/figure>/', '<figure class="wp-block-media-text__media"><img aria-hidden="true" $1></figure>', $content);
		}
		return $content;
	}

	/**
	 * Change core buttons render
	 *
	 * @param string $content
	 * @param array $block
	 * @return void
	 */
	public static function render_core_button($content, $block)
	{
		$attrs = $block['attrs'];

		if (isset($attrs['obfuscate']) && (bool)$attrs['obfuscate']) {
			$content = self::obfuscate_link($content);
		}

		if (isset($attrs['alt']) && !empty($attrs['alt'])) {
			$alt = $attrs['alt'];
			$content = preg_replace('/<a (.*?)>/', "<a aria-label=\"{$alt}\" $1>", $content);
		}

		$leftIcon = '';
		$rightIcon = '';

		if (isset($attrs['icon'])) {
			$iconPlacement = isset($attrs['iconPlacement']) ? $attrs['iconPlacement'] : 'left';
			$icon = $attrs['icon'];
			$iconHtml = null;

			// print_r($attrs);

			$className = "with-icon with-icon--{$iconPlacement}";
			$iconSize = isset($attrs['iconSize']) ? $attrs['iconSize'] : 24;
			$iconGradient = isset($attrs['iconGradient']) ? $attrs['iconGradient'] : 'none';
			$iconBorder = isset($attrs['iconColor']) ? '1em solid ' . $attrs['iconColor'] : '1em solid';

			if ($icon['subtype'] === 'svg+xml') {
				$url = $icon['url'];
				$iconStyle = <<<CSS
				--icon: url({$url});--icon-size: {$iconSize}px;--icon-border: {$iconBorder};--icon-gradient: {$iconGradient};
				CSS;

				$className .= ' with-icon--svg-xml';

				if (isset($attrs['iconUseNativeColors']) && $attrs['iconUseNativeColors']) {
					$className .= ' with-icon--native-colors';
				}

				if ($iconGradient !== 'none') {
					$className .= ' with-icon--gradient';
				}

				if (strpos($content, 'style=')) {
					$content = preg_replace('/style="/', "style=\"{$iconStyle}", $content);
				} else {
					$content = preg_replace('/class="wp-block-button__link/', "style=\"{$iconStyle}\" class=\"wp-block-button__link", $content);
				}
			} else {
				$context = [
					'image' => $icon['id'],
					'width' => $iconSize,
					'height' => $iconSize,
				];

				$iconHtml = self::get_template('image', $context);
				$iconPlacement === 'right' ? $rightIcon = $iconHtml : $leftIcon = $iconHtml;
			}

			$content = preg_replace('/div class="wp-block-button/', "div class=\"wp-block-button {$className}", $content);
		}

		$content = preg_replace('/<a (.*?)>(.*)<\/a>/', "<a $1>{$leftIcon}<span class=\"wp-block-button__text\">$2</span>{$rightIcon}</a>", $content);
		return $content;
	}

	/**
	 * Replaces youtube iframes by a placeholder
	 * Avoids loading youtube libs at startup
	 *
	 * @param string $content
	 * @param array $block
	 * @return void
	 */
	public static function render_core_embed($content, $block) {
		if ($block['attrs']['providerNameSlug'] == 'youtube') {

			$link = $block['attrs']['url'];
			$title = __('View video', 'core-blocks-enhancer');
			
			$html = "<a title=\"{$title}\" is=\"better-youtube\" href=\"{$link}\" target=\"_blank\" data-frameborder=\"0\" data-allowfullscreen data-allow=\"fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\">{$title}</a>";

			$content = preg_replace('/<iframe (.*?)\/iframe>/', $html, $content);
		}

		return $content;
	}
}
