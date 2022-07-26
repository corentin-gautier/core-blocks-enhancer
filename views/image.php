<?php if(!isset($context)) return; ?>
<picture>
	<?php
		$uri = wp_get_original_image_path($context['image']);
		$infos = pathinfo($uri);
		$w = (int)$context['width'];
		$h = (int)$context['height'];
		$w2 = $w * 2;
		$h2 = $h * 2;
		$ext = $infos['extension'];

		$file_end = "-${w}x${h}.${ext}";
		$file_end_2x = "-${w2}x${h2}.${ext}";

		$resized_path = $infos['dirname'] . '/' . $infos['filename'] . $file_end;
		$resized_path_2x = $infos['dirname'] . '/' . $infos['filename'] . $file_end_2x;
		$url = wp_upload_dir()['baseurl'] . '/' . explode('/uploads/', $resized_path)[1];
		$url_2x = wp_upload_dir()['baseurl'] . '/' . explode('/uploads/', $resized_path_2x)[1];
		$image = wp_get_image_editor( $uri );

		if ( !file_exists($resized_path) && !is_wp_error( $image )) {
			$image->set_quality( 100 );
			$image->resize( $w, $h, true );
			$image->save($resized_path);
		}

		if( !file_exists($resized_path_2x) && !is_wp_error( $image )) {
			$image->set_quality( 100 );
			$image->resize( $w2, $h2, true );
			$image->save($resized_path_2x);
		}
	?>
	<?php if( file_exists($resized_path) ): ?>
		<img
			og="<?php echo $uri ?>"
			width="<?php echo $w ?>"
			height="<?php echo $h ?>"
			src="<?php echo $url ?>"
			srcset="
            <?php echo $url ?> 1x,
            <?php echo $url_2x ?> 2x"
			alt="<?php echo get_post_meta($context['image'], '_wp_attachment_image_alt', true) ?>"
			loading="lazy">
	<?php endif; ?>
</picture>
