/* Add custom attribute to image block, in Sidebar */
import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { InspectorControls } from '@wordpress/block-editor';
import { BlockModifier } from '../block-modifier';

class TitlesModifier extends BlockModifier {
  getEditForm(BlockEdit, props) {
    const { attributes, setAttributes } = props;
    const { headingLevel } = attributes;

    return (
      <Fragment>
        <BlockEdit {...props} />
        <InspectorControls>
          <PanelBody
            title={__('Accessibility Options', 'demo')}
          >
            <SelectControl
              label={__('Override the heading level with Aria', 'demo')}
              value={headingLevel}
              options={[
                {
                  value: '',
                  label: __("Select an Option", 'demo')
                },
                {
                  value: '0',
                  label: __('None (role presentation)', 'demo')
                },
                {
                  value: '1',
                  label: 'H1'
                },
                {
                  value: '2',
                  label: 'H2'
                },
                {
                  value: '3',
                  label: 'H3'
                },
                {
                  value: '4',
                  label: 'H4'
                },
                {
                  value: '5',
                  label: 'H5'
                },
                {
                  value: '6',
                  label: 'H6'
                },
              ]}
              onChange={(value) => {
                setAttributes({
                  headingLevel: value,
                });
              }}
            />
          </PanelBody>
        </InspectorControls>
      </Fragment>
    );
  }
}

new TitlesModifier('demo/heading', ['core/heading'], {
  headingLevel: { type: 'string' }
});
