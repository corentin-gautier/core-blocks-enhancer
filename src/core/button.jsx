/* Add custom attribute to button block, in Sidebar */
import { InspectorControls, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
  PanelBody, TextareaControl,
  __experimentalToolsPanel as ToolsPanel
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { BlockModifier } from '../block-modifier';

import IconSettings from '../custom/icon-settings';

class ButtonModifier extends BlockModifier {
  getEditorRender(BlockListBlock, props) {
    const { attributes } = props;
    const { iconPlacement, icon, iconSize, iconColor, iconGradient, iconReplaceColors } = attributes;

    const wrapperProps = {
      ...props.wrapperProps
    };

    if (icon && icon.id) {
      wrapperProps.style = {
        '--icon': 'url(' + icon.sizes?.full?.url + ')',
        '--icon-size': (iconSize || 24) + 'px',
        '--icon-border': '1em solid' + (iconColor ? ' ' + iconColor : ''),
        '--icon-gradient': iconGradient
      };
      const placement = iconPlacement || 'left';
      const type = icon.subtype.replace('+', '-');
      const classes = classNames(
        'with-icon',
        { 'with-icon--replace': iconReplaceColors },
        'with-icon--' + type,
        'with-icon--' + placement,
        { 'with-icon--gradient': !!iconGradient }
      );

      return <BlockListBlock {...props} wrapperProps={wrapperProps} className={classes} />;
    }

    return <BlockListBlock {...props} />;

  }

  getEditForm(BlockEdit, props) {
    const { attributes, setAttributes } = props;
    const { alt, icon } = attributes;
    const ALLOWED_MEDIA_TYPES = ['image'];

    return (
      <Fragment>
        <BlockEdit {...props} />
        <InspectorControls>
          <PanelBody
            title={__('Accessibility', 'core-blocks-enhancer')}
          >
            <TextareaControl
              label={__('Button label', 'core-blocks-enhancer')}
              help={__('Adds an Aria label to the button', 'core-blocks-enhancer')}
              value={alt}
              onChange={(value) => {
                setAttributes({
                  alt: value,
                });
              }}
            />
          </PanelBody>
        </InspectorControls>
        <InspectorControls>
          <ToolsPanel
            resetAll={() => setAttributes({
              iconPlacement: undefined,
              icon: undefined,
              iconSize: undefined,
              iconColor: undefined,
              iconGradient: undefined,
              iconReplaceColors: undefined
            })}
            label={__('Button icon', 'core-blocks-enhancer')}>
            <MediaUploadCheck>
              <MediaUpload
                onSelect={(media) => {
                  if (media) {
                    setAttributes({
                      icon: media,
                      iconSize: 24
                    });

                    if (media.subtype !== 'xml+svg') {
                      setAttributes({
                        iconGradient: null,
                        iconColor: null
                      });
                    }
                  }
                }}
                allowedTypes={ALLOWED_MEDIA_TYPES}
                value={(icon || {}).id}
                render={({ open }) => (
                  <IconSettings onClickMedia={open} {...props} />
                )}
              />
            </MediaUploadCheck>
          </ToolsPanel>
        </InspectorControls>
      </Fragment>
    );
  }
}

new ButtonModifier('core-blocks-enhancer/button', ['core/button'], {
  alt: { type: 'text' },
  iconPlacement: { type: 'text', default: 'left' },
  icon: { type: 'object' },
  iconSize: { type: 'number' },
  iconColor: { type: 'string' },
  iconGradient: { type: 'string' },
  iconReplaceColors: { type: 'boolean', default: true },
});
