/* Add custom attribute to image block, in Sidebar */
import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { BlockModifier } from '../block-modifier';

class ImageModifier extends BlockModifier {
  getEditForm(BlockEdit, props) {
    const { attributes, setAttributes } = props;
    const { useForSeoRanking } = attributes;

    return (
      <Fragment>
        <BlockEdit {...props} />
        <InspectorControls>
          <PanelBody
            title={__('SEO Options', 'demo')}
          >
            <ToggleControl
              label={__('Use for ranking', 'demo')}
              help={__('Adds aria-hidden="true" to an illustrative image allowing the use of the alt text for ranking purposes', 'demo')}
              checked={useForSeoRanking}
              onChange={(value) => {
                setAttributes({
                  useForSeoRanking: value,
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
  useForSeoRanking: { type: 'boolean' }
};

new ImageModifier('demo/images', allowedBlocks, customSettings);
