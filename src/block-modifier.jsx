import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';

export class BlockModifier {

  constructor(namespace, allowedBlocks, settings) {
    this.namespace = namespace;
    this.allowedBlocks = allowedBlocks;
    this.settings = settings;

    this.addFilters();
  }

  addBlockOptions(settings, name) {
    // Register block custom atttributes here
    if (!this.isAllowed(name)) return settings;

    return Object.assign({}, settings, {
      attributes: Object.assign({}, settings.attributes, this.settings),
    });
  }

  addEditForm(BlockEdit) {
    return (props) => {

      if (!this.isAllowed(props.name)) {
        return (
          <BlockEdit {...props} />
        );
      }

      return this.getEditForm(BlockEdit, props);
    }
  }

  editorRender(BlockListBlock) {
    return (props) => {
      if (!this.isAllowed(props.name)) {
        return (
          <BlockListBlock {...props} />
        );
      }

      return this.getEditorRender(BlockListBlock, props);
    }
  }

  isAllowed(name) {
    return this.allowedBlocks.includes(name);
  }

  getEditForm() {
    // Custom form here
  }

  getEditorRender(BlockListBlock, props) {
    return <BlockListBlock {...props} />;
  }

  addFilters() {
    // Register options
    addFilter('blocks.registerBlockType', this.namespace + 'add-option', (s, n) => this.addBlockOptions(s, n));

    // Create the form in the edit view
    addFilter('editor.BlockEdit', this.namespace + 'edit', createHigherOrderComponent((BlockEdit) => {
      return this.addEditForm(BlockEdit);
    }));

    addFilter('editor.BlockListBlock', this.namespace + '/editor-render', createHigherOrderComponent((BlockListBlock) => {
      return this.editorRender(BlockListBlock)
    }))
  }
}
