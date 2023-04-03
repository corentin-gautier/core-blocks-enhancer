/* Add custom attribute to image block, in Sidebar */
import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';

import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { BlockModifier } from '../block-modifier';

class ObfuscateOption extends BlockModifier {
  getEditForm(BlockEdit, props) {

    const { attributes, setAttributes } = props;
    const { obfuscate } = attributes;

    return (
      <Fragment>
        <BlockEdit {...props} />
        <InspectorControls>
          <PanelBody
            title={__('SEO Options', 'core-blocks-enhancer')}
          >
            <ToggleControl
              label={__('Obfuscate', 'core-blocks-enhancer')}
              help={__('Remove the link for the robots', 'core-blocks-enhancer')}
              checked={obfuscate}
              onChange={(value) => {
                setAttributes({
                  obfuscate: value,
                });
              }}
            />
          </PanelBody>
        </InspectorControls>
      </Fragment>
    );
  }
}

const allowedBlocks = ['core/button', 'core/paragraph'];

const customSettings = {
  obfuscate: { type: 'boolean' }
};

new ObfuscateOption('core-blocks-enhancer/obfuscate', allowedBlocks, customSettings);
