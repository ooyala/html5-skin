var React = require('react'),
    ClassNames = require('classnames'),
    Utils = require('../utils'),
    CONSTANTS = require('../../constants/constants'),
    SelectionContainer = require('./selectionContainer'),
    Slider = require('../slider');

var CaptionOpacityTab = React.createClass({

  changeTextOpacity: function(value) {
    if (!this.props.closedCaptionOptions.enabled) {
      this.props.controller.toggleClosedCaptionEnabled();
    }
    this.props.controller.onClosedCaptionChange('textOpacity', value);
  },

  changeBackgroundOpacity: function(value) {
    if (!this.props.closedCaptionOptions.enabled) {
      this.props.controller.toggleClosedCaptionEnabled();
    }
    this.props.controller.onClosedCaptionChange('backgroundOpacity', value);
  },

  changeWindowOpacity: function(value) {
    if (!this.props.closedCaptionOptions.enabled) {
      this.props.controller.toggleClosedCaptionEnabled();
    }
    this.props.controller.onClosedCaptionChange('windowOpacity', value);
  },

  percentString: function(number) {
    //if (number == 0) return "Transparent";
    return (number * 100).toString() + "%"
  },

  render: function(){

    var textOpacityTitle = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.TEXT_OPACITY, this.props.localizableStrings);
    var backgroundOpacityTitle = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.BACKGROUND_OPACITY, this.props.localizableStrings);
    var windowOpacityTitle = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.WINDOW_OPACITY, this.props.localizableStrings);

    return(
      <div className="oo-caption-opacity-tab">
        <div
          className="oo-caption-opacity-inner-wrapper"
          aria-label={CONSTANTS.ARIA_LABELS.CAPTION_OPACITY_MENU}
          role={CONSTANTS.ARIA_ROLES.MENU}>
          <SelectionContainer
            title={textOpacityTitle}
            selectionText={this.percentString(this.props.closedCaptionOptions.textOpacity)}>
            <Slider
              value={parseFloat(this.props.closedCaptionOptions.textOpacity)}
              onChange={this.changeTextOpacity}
              className="oo-slider-caption-opacity"
              itemRef="textOpacitySlider"
              minValue={0}
              maxValue={1}
              step={0.1}
              usePercentageForAria={true}
              ariaLabel={textOpacityTitle}
              settingName={textOpacityTitle}/>
          </SelectionContainer>

          <SelectionContainer
            title={backgroundOpacityTitle}
            selectionText={this.percentString(this.props.closedCaptionOptions.backgroundOpacity)}>
            <Slider
              value={parseFloat(this.props.closedCaptionOptions.backgroundOpacity)}
              onChange={this.changeBackgroundOpacity}
              className="oo-slider-caption-opacity"
              itemRef="backgroundOpacitySlider"
              minValue={0}
              maxValue={1}
              step={0.1}
              usePercentageForAria={true}
              ariaLabel={backgroundOpacityTitle}
              settingName={backgroundOpacityTitle}/>
          </SelectionContainer>

          <SelectionContainer
            title={windowOpacityTitle}
            selectionText={this.percentString(this.props.closedCaptionOptions.windowOpacity)}>
            <Slider
              value={parseFloat(this.props.closedCaptionOptions.windowOpacity)}
              onChange={this.changeWindowOpacity}
              className="oo-slider-caption-opacity"
              itemRef="windowOpacitySlider"
              minValue={0}
              maxValue={1}
              step={0.1}
              usePercentageForAria={true}
              ariaLabel={windowOpacityTitle}
              settingName={windowOpacityTitle}/>
          </SelectionContainer>
        </div>
      </div>
    );
  }
});

module.exports = CaptionOpacityTab;
