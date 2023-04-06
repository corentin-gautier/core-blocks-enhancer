<?php
/**
 * Core Block Enhancer
 *
 * @wordpress-plugin
 * Plugin Name: 		Core Blocks Enhancer
 * Description: 		Adds features to core blocks (accessibility, seo and button icons)
 * Version: 1.3.5
 * Requires PHP:		7.4
 * Text Domain: 		core-blocks-enhancer
 * Domain Path: 		/languages
 * Author: 				Conserto
 * Author URI: 			https://conserto.pro
 */

defined('ABSPATH') || exit();

class CoreBlockEnhancerPlugin {

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
		$this->version = get_plugin_data( __FILE__ )['Version'];
		$this->path = __FILE__;
		$this->src_dir = plugin_dir_path($this->path);
		$this->src_dir_uri = plugin_dir_url($this->path);

		require_once 'lib/render.php';

		add_action('wp_enqueue_scripts', array($this, 'add_front_scripts'));
		add_action('enqueue_block_editor_assets', array($this, 'add_scripts'));

		add_filter('render_block', array($this, 'customize_core_blocks'), 10, 2);
		add_filter('robots_txt', array($this, 'disallow_js'), 999999, 2);
	}
	
	public function add_scripts()
	{
		global $pagenow;

		if ($pagenow === 'widgets.php') {
			return;
		}

		if (is_file("{$this->src_dir}/build/index.css")) {
			wp_enqueue_style('core-blocks-enhancer', "{$this->src_dir_uri}build/index.css", null, $this->version);
		}
		
		if (is_file("{$this->src_dir}/build/index.js")) {
			$deps = [ 'wp-blocks', 'wp-dom', 'wp-dom-ready' ];
			wp_enqueue_script('core-blocks-enhancer', "{$this->src_dir_uri}build/index.js", $deps, $this->version, true);
		}
	}
	
	public function add_front_scripts()
	{
		if (is_file("{$this->src_dir}/build/index.css")) {
			wp_enqueue_style('core-blocks-enhancer', "{$this->src_dir_uri}build/index.css", null, $this->version);
		}

		if (is_file("{$this->src_dir}/build/front.js")) {
			wp_enqueue_script('core-blocks-enhancer-front', "{$this->src_dir_uri}build/front.js", null, $this->version, true);
		}
	}

	public function customize_core_blocks($block_content, $block)
	{
		if (!$block['blockName']) return $block_content;

		$name = str_replace('/', '_', $block['blockName']);
		$name = str_replace('-', '_', $name);

		$method = "render_${name}";

		if (method_exists('CoreBlockEnhancerRenderer', $method)) {
			$block_content = CoreBlockEnhancerRenderer::$method($block_content, $block);
		}

		return $block_content;
	}

	public function disallow_js($output, $public)
	{
		if (strpos($output, 'core-blocks-enhancer/build/front.js') === false) {
			$output = $output . PHP_EOL . PHP_EOL . 'Disallow: /wp-content/plugins/core-blocks-enhancer/build/front.js' . PHP_EOL;
		}
		return $output;
	}

}

CoreBlockEnhancerPlugin::get_instance();
