/**
* WordPress dependencies
*/
import { useMemo } from '@wordpress/element';
import { useSettings } from '@wordpress/block-editor';
import { _x } from '@wordpress/i18n';

export function useCommonSingleMultipleSelects() {
  const [customColors, customGradients] = useSettings('color.custom', 'color.customGradient');

  return {
    disableCustomColors: !customColors,
    disableCustomGradients: !customGradients,
  };
}

/**
* Retrieves color and gradient related settings.
*
* The arrays for colors and gradients are made up of color palettes from each
* origin i.e. "Core", "Theme", and "User".
*
* @return {Object} Color and gradient related settings.
*/
export function useMultipleOriginColorsAndGradients() {
  const colorGradientSettings = useCommonSingleMultipleSelects();
  const [
    customColors,
    themeColors,
    defaultColors,
    shouldDisplayDefaultColors,
    customGradients,
    themeGradients,
    defaultGradients,
    shouldDisplayDefaultGradients,
  ] = useSettings(
    'color.palette.custom',
    'color.palette.theme',
    'color.palette.default',
    'color.defaultPalette',
    'color.gradients.custom',
    'color.gradients.theme',
    'color.gradients.default',
    'color.defaultGradients'
  );

  colorGradientSettings.colors = useMemo(() => {
    const result = [];
    if (themeColors && themeColors.length) {
      result.push({
        name: _x(
          'Theme',
          'Indicates this palette comes from the theme.'
        ),
        colors: themeColors,
      });
    }
    if (
      shouldDisplayDefaultColors &&
      defaultColors &&
      defaultColors.length
    ) {
      result.push({
        name: _x(
          'Default',
          'Indicates this palette comes from WordPress.'
        ),
        colors: defaultColors,
      });
    }
    if (customColors && customColors.length) {
      result.push({
        name: _x(
          'Custom',
          'Indicates this palette comes from the theme.'
        ),
        colors: customColors,
      });
    }
    return result;
  }, [defaultColors, themeColors, customColors]);

  colorGradientSettings.gradients = useMemo(() => {
    const result = [];
    if (themeGradients && themeGradients.length) {
      result.push({
        name: _x(
          'Theme',
          'Indicates this palette comes from the theme.'
        ),
        gradients: themeGradients,
      });
    }
    if (
      shouldDisplayDefaultGradients &&
      defaultGradients &&
      defaultGradients.length
    ) {
      result.push({
        name: _x(
          'Default',
          'Indicates this palette comes from WordPress.'
        ),
        gradients: defaultGradients,
      });
    }
    if (customGradients && customGradients.length) {
      result.push({
        name: _x(
          'Custom',
          'Indicates this palette is created by the user.'
        ),
        gradients: customGradients,
      });
    }
    return result;
  }, [customGradients, themeGradients, defaultGradients]);

  return colorGradientSettings;
}
