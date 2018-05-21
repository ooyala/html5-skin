var React = require('react'),
    ClassNames = require('classnames'),
    Utils = require('../utils'),
    AccessibleButton = require('../accessibleButton'),
    AccessibleMenu = require('../higher-order/accessibleMenu'),
    CONSTANTS = require('../../constants/constants'),
    SelectionContainer = require('./selectionContainer');

var FontSizeTab = React.createClass({
  getInitialState: function() {
    return {
      selectedFontSize: this.props.closedCaptionOptions.fontSize,
      fontSizes: ['Small', 'Medium', 'Large', 'Extra Large']
    };
  },

  changeFontSize: function(fontSize) {
    if (!this.props.closedCaptionOptions.enabled) {
      this.props.controller.toggleClosedCaptionEnabled();
    }
    this.props.controller.onClosedCaptionChange('fontSize', fontSize);
    this.setState({
      selectedFontSize: fontSize
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
      'oo-disabled': !this.props.closedCaptionOptions.enabled
    });
  },

  render: function() {
    var fontSizeTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.FONT_SIZE,
      this.props.localizableStrings
    );
    var fontSizeSelection = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT[this.props.closedCaptionOptions.fontSize.toUpperCase().replace(' ', '_')],
      this.props.localizableStrings
    );
    var fontItems = [];
    for (var i = 0; i < this.state.fontSizes.length; i++) {
      // accent color
      var isSelected = this.props.closedCaptionOptions.fontSize === this.state.fontSizes[i];
      var selectedFontSizeStyle = {};
      if (
        this.props.closedCaptionOptions.enabled &&
        this.props.skinConfig.general.accentColor &&
        isSelected
      ) {
        selectedFontSizeStyle = { color: this.props.skinConfig.general.accentColor };
      }
      var itemLabel = Utils.getLocalizedString(
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
  }
});

FontSizeTab = AccessibleMenu(FontSizeTab, { useRovingTabindex: true });

FontSizeTab.propTypes = {
  language: React.PropTypes.string,
  localizableStrings: React.PropTypes.objectOf(React.PropTypes.objectOf(React.PropTypes.string)),
  closedCaptionOptions: React.PropTypes.shape({
    enabled: React.PropTypes.bool,
    fontSize: React.PropTypes.string
  }),
  controller: React.PropTypes.shape({
    toggleClosedCaptionEnabled: React.PropTypes.func.isRequired,
    onClosedCaptionChange: React.PropTypes.func.isRequired
  }),
  skinConfig: React.PropTypes.shape({
    general: React.PropTypes.shape({
      accentColor: React.PropTypes.string
    })
  })
};

module.exports = FontSizeTab;
