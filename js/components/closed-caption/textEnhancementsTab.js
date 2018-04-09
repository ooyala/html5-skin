var React = require('react'),
  ClassNames = require('classnames'),
  Utils = require('../utils'),
  AccessibleButton = require('../accessibleButton'),
  AccessibleMenu = require('../higher-order/accessibleMenu'),
  CONSTANTS = require('../../constants/constants'),
  SelectionContainer = require('./selectionContainer');

var TextEnhancementsTab = React.createClass({
  getInitialState: function() {
    return {
      selectedTextEnhancement: this.props.closedCaptionOptions.textEnhancement,
      textEnhancements: ['Uniform', 'Depressed', 'Raised', 'Shadow']
    };
  },

  changeTextEnhancement: function(textEnhancement) {
    if (!this.props.closedCaptionOptions.enabled) {
      this.props.controller.toggleClosedCaptionEnabled();
    }
    this.props.controller.onClosedCaptionChange('textEnhancement', textEnhancement);
    this.setState({
      selectedTextEnhancement: textEnhancement
    });
  },

  setClassname: function(item, elementType) {
    return ClassNames({
      'oo-text-enhancement-letter': elementType == 'letter',
      'oo-text-enhancement-label': elementType == 'label',
      'oo-text-enhancement-selected': this.props.closedCaptionOptions.textEnhancement == item && this.props.closedCaptionOptions.enabled,
      'oo-text-enhancement-label-selected': this.props.closedCaptionOptions.textEnhancement == item && this.props.closedCaptionOptions.enabled && elementType == 'label',
      'oo-disabled': !this.props.closedCaptionOptions.enabled
    });
  },

  render: function() {
    var textEnhancementTitle = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.TEXT_ENHANCEMENT, this.props.localizableStrings);
    var textEnhancementSelection = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT[this.props.closedCaptionOptions.textEnhancement.toUpperCase()],
      this.props.localizableStrings
    );
    var textEnhancementItems = [];
    for (var i = 0; i < this.state.textEnhancements.length; i++) {
      // accent color
      var isSelected = this.props.closedCaptionOptions.textEnhancement === this.state.textEnhancements[i];
      var selectedTextEnhancementStyle = {};
      if (this.props.closedCaptionOptions.enabled && this.props.skinConfig.general.accentColor && isSelected) {
        selectedTextEnhancementStyle = {color: this.props.skinConfig.general.accentColor};
      }
      var itemLabel = Utils.getLocalizedString(
        this.props.language,
        CONSTANTS.SKIN_TEXT[this.state.textEnhancements[i].toUpperCase()],
        this.props.localizableStrings
      );

      textEnhancementItems.push(
        <AccessibleButton
          key={i}
          className="oo-text-enhancements-container"
          ariaLabel={itemLabel}
          ariaChecked={isSelected}
          role={CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO}
          onClick={this.changeTextEnhancement.bind(this, this.state.textEnhancements[i])}>
          <span
            className={this.setClassname(this.state.textEnhancements[i], 'letter') + ' oo-text-enhancement-letter-' + this.state.textEnhancements[i]}
            style={selectedTextEnhancementStyle}>
            A
          </span>
          <span
            className={this.setClassname(this.state.textEnhancements[i], 'label')}
            style={selectedTextEnhancementStyle}>
            {itemLabel}
          </span>
        </AccessibleButton>
      );
    }

    return (
      <div className="oo-text-enhancements-tab">
        <div className="oo-text-enhancements-inner-wrapper">
          <SelectionContainer
            title={textEnhancementTitle}
            selectionText={textEnhancementSelection}
            ariaLabel={CONSTANTS.ARIA_LABELS.TEXT_ENHANCEMENTS_MENU}
            role={CONSTANTS.ARIA_ROLES.MENU}>
            {textEnhancementItems}
          </SelectionContainer>
        </div>
      </div>
    );
  }
});

TextEnhancementsTab = AccessibleMenu(TextEnhancementsTab, { useRovingTabindex: true });

TextEnhancementsTab.propTypes = {
  language: React.PropTypes.string,
  localizableStrings: React.PropTypes.objectOf(React.PropTypes.objectOf(React.PropTypes.string)),
  controller: React.PropTypes.shape({
    toggleClosedCaptionEnabled: React.PropTypes.func.isRequired,
    onClosedCaptionChange: React.PropTypes.func.isRequired
  }),
  skinConfig: React.PropTypes.shape({
    general: React.PropTypes.shape({
      accentColor: React.PropTypes.string
    })
  }),
  closedCaptionOptions: React.PropTypes.shape({
    textEnhancement: React.PropTypes.string,
    enabled: React.PropTypes.bool
  })
};

module.exports = TextEnhancementsTab;
