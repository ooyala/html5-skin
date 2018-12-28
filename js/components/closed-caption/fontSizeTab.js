let React = require('react');

let ClassNames = require('classnames');

let Utils = require('../utils');

let AccessibleButton = require('../accessibleButton');

let AccessibleMenu = require('../higher-order/accessibleMenu');

let CONSTANTS = require('../../constants/constants');

let SelectionContainer = require('./selectionContainer');
let createReactClass = require('create-react-class');
let PropTypes = require('prop-types');

let FontSizeTab = createReactClass({
  getInitialState: function() {
    return {
      selectedFontSize: this.props.closedCaptionOptions.fontSize,
      fontSizes: ['Small', 'Medium', 'Large', 'Extra Large'],
    };
  },

  changeFontSize: function(fontSize) {
    if (!this.props.closedCaptionOptions.enabled) {
      this.props.controller.toggleClosedCaptionEnabled();
    }
    this.props.controller.onClosedCaptionChange('fontSize', fontSize);
    this.setState({
      selectedFontSize: fontSize,
    });
  },

  setClassname: function(item, elementType) {
    return ClassNames({
      'oo-font-size-letter': elementType === 'letter',
      'oo-font-size-label': elementType === 'label',
      'oo-font-size-selected':
        this.props.closedCaptionOptions.fontSize === item && this.props.closedCaptionOptions.enabled,
      'oo-font-size-label-selected':
        this.props.closedCaptionOptions.fontSize === item &&
        this.props.closedCaptionOptions.enabled &&
        elementType === 'label',
      'oo-disabled': !this.props.closedCaptionOptions.enabled,
    });
  },

  render: function() {
    let fontSizeTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.FONT_SIZE,
      this.props.localizableStrings
    );
    let fontSizeSelection = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT[this.props.closedCaptionOptions.fontSize.toUpperCase().replace(' ', '_')],
      this.props.localizableStrings
    );
    let fontItems = [];
    for (let i = 0; i < this.state.fontSizes.length; i++) {
      // accent color
      let isSelected = this.props.closedCaptionOptions.fontSize === this.state.fontSizes[i];
      let selectedFontSizeStyle = {};
      if (
        this.props.closedCaptionOptions.enabled &&
        this.props.skinConfig.general.accentColor &&
        isSelected
      ) {
        selectedFontSizeStyle = { color: this.props.skinConfig.general.accentColor };
      }
      let itemLabel = Utils.getLocalizedString(
        this.props.language,
        CONSTANTS.SKIN_TEXT[this.state.fontSizes[i].toUpperCase().replace(' ', '_')],
        this.props.localizableStrings
      );

      fontItems.push(
        <AccessibleButton
          key={i}
          className="oo-font-size-container"
          ariaLabel={itemLabel}
          ariaChecked={isSelected}
          role={CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO}
          onClick={this.changeFontSize.bind(this, this.state.fontSizes[i])}
        >
          <span
            className={
              this.setClassname(this.state.fontSizes[i], 'letter') +
              ' oo-font-size-letter-' +
              this.state.fontSizes[i].replace(' ', '-')
            }
            style={selectedFontSizeStyle}
          >
            A
          </span>
          <span className={this.setClassname(this.state.fontSizes[i], 'label')} style={selectedFontSizeStyle}>
            {itemLabel}
          </span>
        </AccessibleButton>
      );
    }

    return (
      <div className="oo-font-size-tab">
        <div className="oo-font-size-inner-wrapper">
          <SelectionContainer
            title={fontSizeTitle}
            selectionText={fontSizeSelection}
            ariaLabel={CONSTANTS.ARIA_LABELS.FONT_SIZE_MENU}
            role={CONSTANTS.ARIA_ROLES.MENU}
          >
            {fontItems}
          </SelectionContainer>
        </div>
      </div>
    );
  },
});

FontSizeTab = AccessibleMenu(FontSizeTab, { useRovingTabindex: true });

FontSizeTab.propTypes = {
  language: PropTypes.string,
  localizableStrings: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
  closedCaptionOptions: PropTypes.shape({
    enabled: PropTypes.bool,
    fontSize: PropTypes.string,
  }),
  controller: PropTypes.shape({
    toggleClosedCaptionEnabled: PropTypes.func.isRequired,
    onClosedCaptionChange: PropTypes.func.isRequired,
  }),
  skinConfig: PropTypes.shape({
    general: PropTypes.shape({
      accentColor: PropTypes.string,
    }),
  }),
};

module.exports = FontSizeTab;
