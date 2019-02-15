import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import AccessibleButton from './accessibleButton';
import AccessibleMenu from './higher-order/accessibleMenu';
import CONSTANTS from '../constants/constants';

/**
 * The color selector component
 */
class ColorSelectorProto extends React.Component {
  /**
   * based on the item data set up the class name
   * @param {Object} item – the item component
   * @returns {Object} classNames
   */
  setClassname = (item) => {
    const {
      selectedColor,
      enabled,
    } = this.props;
    return ClassNames({
      'oo-item': true,
      'oo-item-selected': selectedColor === item && enabled,
      'oo-disabled': !enabled,
    });
  }

  render() {
    const {
      ariaLabel,
      selectedColor,
      skinConfig,
      enabled,
      onColorChange,
      colors,
    } = this.props;
    const colorItems = [];
    colors.forEach((color, index) => {
      // accent color
      const isSelected = selectedColor === color;
      let activeColorStyle = {};
      if (enabled && isSelected && skinConfig.general.accentColor) {
        let selectedColorStyle = 'solid ';
        selectedColorStyle += skinConfig.general.accentColor;
        activeColorStyle = { border: selectedColorStyle };
      }
      const currentAriaLabel = `${ariaLabel} ${color}`;

      colorItems.push(
        <div
          key={index} // eslint-disable-line
          className={this.setClassname(color)}
          style={activeColorStyle}
          role={CONSTANTS.ARIA_ROLES.PRESENTATION}
        >
          <AccessibleButton
            className={`oo-color-item oo-color-item-${color}`}
            ariaLabel={currentAriaLabel}
            ariaChecked={isSelected}
            role={CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO}
            onClick={() => onColorChange(color)}
          />
        </div>
      );
    });

    return (
      <div className="oo-color-selector" aria-label={ariaLabel} role={CONSTANTS.ARIA_ROLES.MENU}>
        {colorItems}
      </div>
    );
  }
}

const ColorSelector = AccessibleMenu(ColorSelectorProto, { useRovingTabindex: true });

ColorSelectorProto.propTypes = {
  enabled: PropTypes.bool,
  selectedColor: PropTypes.string,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  ariaLabel: PropTypes.string.isRequired,
  onColorChange: PropTypes.func,
  skinConfig: PropTypes.shape({
    general: PropTypes.shape({
      accentColor: PropTypes.string,
    }),
  }),
};

ColorSelectorProto.defaultProps = {
  enabled: false,
  selectedColor: undefined,
  onColorChange: () => {},
  skinConfig: {
    general: {
      accentColor: 'red',
    },
  },
};

module.exports = ColorSelector;
