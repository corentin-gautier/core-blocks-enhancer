<?php
/**
 * Core Block Enhancer
 *
 * @wordpress-plugin
 * Plugin Name: 		Core Blocks Enhancer
 * Description: 		Adds features to core blocks (accessibility, seo and button icons)
 * Version: 			1.0.0
 * Requires PHP:		7.4
 * Text Domain: 		core-blocks-enhancer
 * Domain Path: 		/languages
 * Author: 				Conserto
 * Author URI: 			https://conserto.pro
 */

defined('ABSPATH') || exit();

class CoreBlockEnhancerPlugin {

	const VERSION = '1.0.0';

	/**
	 * Store the instance of this class
	 *
	 * @var CoreBlockEnhancerPlugin
	 */
	protected static $instance;

	/**
	 * Singleton
	 *
	 * @return CoreBlockEnhancerPlugin
	 */
	public static function get_instance()  {
		if ( !isset(self::$instance) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	function __construct()
	{
		$this->version = CoreBlockEnhancerPlugin::VERSION;
		$this->path = __FILE__;

		require_once 'lib/render.php';

		add_action('enqueue_block_editor_assets', array($this, 'add_scripts'));
		add_filter('render_block', array($this, 'customize_core_blocks'), 10, 2);
	}

	public function add_scripts()
	{
		$src_dir = plugin_dir_path($this->path);
		$src_dir_uri = plugin_dir_url($this->path);

		if (is_file("{$src_dir}/build/index.js")) {
			$deps = [ 'wp-blocks', 'wp-dom', 'wp-dom-ready', 'wp-edit-post' ];
			wp_enqueue_script('core-blocks-enhancer', "${src_dir_uri}build/index.js", $deps, $this->version, true);
		}
	}

	public function customize_core_blocks($block_content, $block)
	{
		$name = str_replace('/', '_', $block['blockName']);
		$name = str_replace('-', '_', $name);

		$method = "render_${name}";

		if (method_exists('CoreBlockEnhancerRenderer', $method)) {
			$block_content = CoreBlockEnhancerRenderer::$method($block_content, $block);
		}

		return $block_content;
	}

}

CoreBlockEnhancerPlugin::get_instance();
