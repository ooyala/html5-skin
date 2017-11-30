var React = require('react'),
    ClassNames = require('classnames'),
    AccessibleButton = require('./accessibleButton'),
    AccessibleMenu = require('./higher-order/accessibleMenu'),
    CONSTANTS = require('../constants/constants');

var ColorSelector = React.createClass({
  setClassname: function(item){
    return ClassNames({
      'oo-item': true,
      'oo-item-selected': this.props.selectedColor == item && this.props.enabled,
      'oo-disabled': !this.props.enabled
    });
  },

  handleColorSelection: function(color) {
    this.props.onColorChange(color);
  },

  render: function() {
    var colorItems = [];
    for (var i = 0; i < this.props.colors.length; i++) {
      //accent color
      var isSelected = this.props.selectedColor === this.props.colors[i];
      var activeColorStyle = {};
      if (this.props.enabled && isSelected && this.props.skinConfig.general.accentColor) {
        var selectedColorStyle =  "solid ";
        selectedColorStyle += this.props.skinConfig.general.accentColor;
        activeColorStyle = {border: selectedColorStyle};
      }
      var ariaLabel = this.props.colors[i] + " " + this.props.ariaLabel;

      colorItems.push(
        <div
          key={i}
          className={this.setClassname(this.props.colors[i])}
          style={activeColorStyle}
          role={CONSTANTS.ARIA_ROLES.PRESENTATION}>
          <AccessibleButton
            className={"oo-color-item oo-color-item-" + this.props.colors[i]}
            ariaLabel={ariaLabel}
            ariaChecked={isSelected}
            role={CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO}
            onClick={this.handleColorSelection.bind(this, this.props.colors[i])}>
          </AccessibleButton>
        </div>
      );
    }

    return (
      <div
        className="oo-color-selector"
        aria-label={this.props.ariaLabel}
        role={CONSTANTS.ARIA_ROLES.MENU}>
        {colorItems}
      </div>
    );
  }
});

ColorSelector = AccessibleMenu(ColorSelector, { useRovingTabindex: true });

ColorSelector.propTypes = {
  ariaLabel: React.PropTypes.string.isRequired,
  colors: React.PropTypes.array.isRequired
};

module.exports = ColorSelector;
