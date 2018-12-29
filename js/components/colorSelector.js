const React = require('react');

const ClassNames = require('classnames');

const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const AccessibleButton = require('./accessibleButton');

const AccessibleMenu = require('./higher-order/accessibleMenu');

const CONSTANTS = require('../constants/constants');

let ColorSelector = createReactClass({
  setClassname(item) {
    return ClassNames({
      'oo-item': true,
      'oo-item-selected': this.props.selectedColor === item && this.props.enabled,
      'oo-disabled': !this.props.enabled,
    });
  },

  handleColorSelection(color) {
    this.props.onColorChange(color);
  },

  render() {
    const colorItems = [];
    for (let i = 0; i < this.props.colors.length; i++) {
      // accent color
      const isSelected = this.props.selectedColor === this.props.colors[i];
      let activeColorStyle = {};
      if (this.props.enabled && isSelected && this.props.skinConfig.general.accentColor) {
        let selectedColorStyle = 'solid ';
        selectedColorStyle += this.props.skinConfig.general.accentColor;
        activeColorStyle = { border: selectedColorStyle };
      }
      const ariaLabel = `${this.props.ariaLabel} ${this.props.colors[i]}`;

      colorItems.push(
        <div
          key={i}
          className={this.setClassname(this.props.colors[i])}
          style={activeColorStyle}
          role={CONSTANTS.ARIA_ROLES.PRESENTATION}
        >
          <AccessibleButton
            className={`oo-color-item oo-color-item-${this.props.colors[i]}`}
            ariaLabel={ariaLabel}
            ariaChecked={isSelected}
            role={CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO}
            onClick={this.handleColorSelection.bind(this, this.props.colors[i])}
          />
        </div>
      );
    }

    return (
      <div className="oo-color-selector" aria-label={this.props.ariaLabel} role={CONSTANTS.ARIA_ROLES.MENU}>
        {colorItems}
      </div>
    );
  },
});

ColorSelector = AccessibleMenu(ColorSelector, { useRovingTabindex: true });

ColorSelector.propTypes = {
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

module.exports = ColorSelector;
