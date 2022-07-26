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
            title={__('SEO Options', 'demo')}
          >
            <ToggleControl
              label={__('Obfuscate', 'demo')}
              help={__('Remove the link for the robots', 'demo')}
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

new ObfuscateOption('demo/obfuscate', allowedBlocks, customSettings);
