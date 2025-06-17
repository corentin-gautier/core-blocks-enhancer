/* Add custom attribute to image block, in Sidebar */
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { BlockModifier } from '../block-modifier';

class ImageModifier extends BlockModifier {
  getEditForm(BlockEdit, props) {
    const { attributes, setAttributes } = props;
    const { useForSeoRanking, lazyLoad } = attributes;

    return (
      <Fragment>
        <BlockEdit {...props} />
        <InspectorControls>
          <PanelBody
            title={__('SEO & Performance', 'core-blocks-enhancer')}
          >
            <ToggleControl
              label={__('Use for ranking', 'core-blocks-enhancer')}
              help={__('Adds aria-hidden="true" to an illustrative image allowing the use of the alt text for ranking purposes', 'core-blocks-enhancer')}
              checked={useForSeoRanking}
              onChange={(value) => {
                setAttributes({
                  useForSeoRanking: value,
                });
              }}
            />
            <ToggleControl
              label={__('Lazy load', 'core-blocks-enhancer')}
              help={__('Adds loading="lazy" to an image allowing the image to be loaded when it is in the viewport', 'core-blocks-enhancer')}
              checked={lazyLoad}
              onChange={(value) => {
                setAttributes({
                  lazyLoad: value,
                });
              }}
            />
          </PanelBody>
        </InspectorControls>
      </Fragment>
    );
  }
}

// Enable custom attributes on Image block
const allowedBlocks = [
  'core/image',
  'core/media-text'
];

const customSettings = {
  useForSeoRanking: { type: 'boolean' },
  lazyLoad: { type: 'boolean' }
};

new ImageModifier('core-blocks-enhancer/images', allowedBlocks, customSettings);
