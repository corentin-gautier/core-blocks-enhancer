import {
  __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
  __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from '@wordpress/block-editor';
import {
  FontSizePicker,
  Button, ButtonGroup,
  __experimentalToolsPanelItem as ToolsPanelItem,
  __experimentalToggleGroupControl as ToggleGroupControl,
  __experimentalToggleGroupControlOption as ToggleGroupControlOption
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { _x, __ } from '@wordpress/i18n';

import { useMultipleOriginColorsAndGradients as AltUseMultipleOriginColorsAndGradients } from './utils';

export default function IconSettings(props) {
  const { attributes, setAttributes, clientId, onClickMedia } = props;
  const { iconPlacement, icon, iconSize, iconColor, iconGradient } = attributes;

  const buttonText = !!icon ? __('Change image', 'demo') : __('Open media library', 'demo');

  const colorSettings = (useMultipleOriginColorsAndGradients || AltUseMultipleOriginColorsAndGradients)();

  return (
    <Fragment>
      {!!icon && (
        <Fragment>
          <ToolsPanelItem
            hasValue={() => !!icon}
            onDeselect={() => setAttributes({
              icon: undefined,
              iconSize: undefined,
              iconPlacement: undefined,
              iconColor: undefined,
              iconGradient: undefined
            })}
            label={__('Icon', 'demo')}
            isShownByDefault
            style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '18px' }}>
            <img onClick={onClickMedia} src={icon.sizes.thumbnail.url} width={icon.width} style={{ maxWidth: '50px', width: '100%', cursor: 'pointer', padding: '4px', border: '1px solid rgba(0,0,0,.1)', borderRadius: '2px' }} />
            <ToggleGroupControl
              label={__('Placement', 'demo')}
              value={iconPlacement || 'left'}
              onChange={(value) => {
                setAttributes({
                  iconPlacement: value
                })
              }}>
              <ToggleGroupControlOption value="left" label={__('Left', 'demo')}></ToggleGroupControlOption>
              <ToggleGroupControlOption value="right" label={__('Right', 'demo')}></ToggleGroupControlOption>
            </ToggleGroupControl>
          </ToolsPanelItem>

          {icon.subtype === 'svg+xml' && (
            <div style={{ borderTop: '1px solid #0000001a', gridColumn: 'span 2' }}>
              <ColorGradientSettingsDropdown
                className={'first'}
                __experimentalHasMultipleOrigins
                __experimentalIsRenderedInSidebar
                onDeselect={() => setAttributes({
                  iconColor: undefined,
                  iconGradient: undefined
                })}
                settings={[
                  {
                    label: __('Icon Color', 'demo'),
                    colorValue: iconColor,
                    gradientValue: iconGradient,
                    onColorChange: (c) => setAttributes({ iconColor: c }),
                    onGradientChange: (v) => setAttributes({ iconGradient: v })
                  }
                ]}
                {...colorSettings}
              />
            </div>
          )}

          <ToolsPanelItem
            hasValue={() => !!iconSize}
            onDeselect={() => setAttributes({
              iconSize: undefined
            })}
            label={__('Icon Size', 'demo')}
            isShownByDefault>
            <FontSizePicker
              fallbackFontSize={24}
              value={(iconSize || 24)}
              fontSizes={[
                {
                  name: 'Small',
                  size: 16,
                  slug: 'small'
                },
                {
                  name: 'Normal',
                  size: 24,
                  slug: 'normal'
                },
                {
                  name: 'Big',
                  size: 32,
                  slug: 'big'
                }
              ]}
              onChange={(value) => {
                setAttributes({
                  iconSize: value
                });
              }}
            />
          </ToolsPanelItem>
        </Fragment>
      )}
      {!icon && (
        <ButtonGroup style={{ gridColumn: 'span 2' }}>
          <Button variant="secondary" onClick={onClickMedia}>{buttonText}</Button>
        </ButtonGroup>
      )}
    </Fragment>
  )
}
