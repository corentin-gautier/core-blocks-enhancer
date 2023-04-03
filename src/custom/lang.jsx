import { BlockControls } from '@wordpress/block-editor';
import { Popover, TextControl, ToggleControl, ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { applyFormat, registerFormatType, removeFormat, toggleFormat, unregisterFormatType, useAnchor } from '@wordpress/rich-text';

const name = 'core-blocks-enhancer/lang';

const LangController = (props) => {
  const { contentRef, isActive, activeAttributes, onChange, value } = props;

  const [showPopover, setShowPopover] = useState(false);

  const anchorRef = useAnchor({ ref: contentRef, value });

  const customIcon = <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><path d="M12.7,14.4l-1.9-1.9l0,0c1.3-1.5,2.3-3.2,2.8-5h2.2V5.9h-5.4V4.3H8.9v1.5H3.6v1.5h8.6c-0.5,1.5-1.3,2.9-2.4,4.1 C9,10.7,8.4,9.8,7.9,8.9H6.4c0.6,1.2,1.3,2.4,2.3,3.5l-3.9,3.8l1.1,1.1l3.8-3.8l2.4,2.4C12.1,15.9,12.7,14.4,12.7,14.4z M17,10.5 h-1.5L12,19.7h1.5l0.9-2.3H18l0.9,2.3h1.5L17,10.5z M15,15.8l1.2-3.3l1.2,3.3C17.5,15.8,15,15.8,15,15.8z" /></svg>

  const setFormat = (newLang, newDir) => {
    const newAttributes = {};

    // Changing the lang
    if (newLang !== null) {
      if (newLang.length) {
        newAttributes.lang = newLang;
      }

      if (activeAttributes.dir) {
        newAttributes.dir = activeAttributes.dir;
      }
    }

    // Changing the dir
    if (newDir !== null) {
      if (activeAttributes.lang) {
        newAttributes.lang = activeAttributes.lang;
      }

      if (newDir === 'rtl') {
        newAttributes.dir = 'rtl';
      }
    }

    if (newAttributes.lang || (newAttributes.dir && newAttributes.dir === 'rtl')) {
      onChange(
        applyFormat(value, {
          type: name,
          attributes: newAttributes
        })
      );
    } else {
      onChange(
        toggleFormat(value, {
          type: name
        })
      )
    }
  }

  const hasValues = () => {
    return new Boolean(!!activeAttributes.lang || activeAttributes.dir === 'rtl');
  }

  return (
    <Fragment>
      <BlockControls>
        <ToolbarGroup label={__('Accessibility', 'core-blocks-enhancer')}>
          <ToolbarButton
            isActive={isActive}
            icon={customIcon}
            onClick={() => {
              if (hasValues()) {
                setFormat(null, null);
              } else {
                setShowPopover(true);
              }
            }}
          />
        </ToolbarGroup>
      </BlockControls>

      {(showPopover || isActive) && (
        <Popover
          anchorRef={anchorRef}
          className="lang-popover"
          position="bottom center"
          onClose={() => {
            setShowPopover(false);

            if (!hasValues()) {
              onChange(
                removeFormat(value, { type: name })
              )
            }
          }}
        >
          <div style={{ padding: "15px", width: '90vw', maxWidth: '320px', minWidth: 'auto' }}>
            <TextControl
              placeholder={__('eg: fr, en-GB, ja-Kana', 'core-blocks-enhancer')}
              label={__('Language code', 'core-blocks-enhancer')}
              help={__('Use a valid BCP47 language tag', 'core-blocks-enhancer')}
              value={activeAttributes.lang}
              onChange={(str) => setFormat(str, null)} />
            <ToggleControl
              label={__('Right To Left', 'core-blocks-enhancer')}
              help={__('Check this if the language uses right to left', 'core-blocks-enhancer')}
              checked={activeAttributes.dir === 'rtl'}
              onChange={(bool) => setFormat(null, bool ? 'rtl' : 'ltr')}
            />
          </div>
        </Popover>
      )}
    </Fragment>
  );
}

unregisterFormatType('core/underline');
registerFormatType(name, {
  title: 'Lang',
  tagName: 'span',
  className: null,
  attributes: {
    lang: 'lang',
    dir: 'dir'
  },
  edit: LangController
});
