const React = require('react');

const createReactClass = require('create-react-class');
const Utils = require('../utils');

const CONSTANTS = require('../../constants/constants');

const SelectionContainer = require('./selectionContainer');

const ColorSelector = require('../colorSelector');

const ColorSelectionTab = createReactClass({
  getInitialState() {
    return {
      selectedTextColor: this.props.closedCaptionOptions.textColor,
      selectedWindowColor: this.props.closedCaptionOptions.windowColor,
      selectedBackgroundColor: this.props.closedCaptionOptions.backgroundColor,
      textColors: ['White', 'Blue', 'Magenta', 'Green', 'Yellow', 'Red', 'Cyan', 'Black'],
      windowColors: ['Transparent', 'White', 'Blue', 'Magenta', 'Green', 'Yellow', 'Red', 'Cyan', 'Black'],
      backgroundColors: ['Transparent', 'White', 'Blue', 'Magenta', 'Green', 'Yellow', 'Red', 'Cyan', 'Black'],
    };
  },

  changeTextColor(color) {
    if (!this.props.closedCaptionOptions.enabled) {
      this.props.controller.toggleClosedCaptionEnabled();
    }
    this.props.controller.onClosedCaptionChange('textColor', color);
    this.setState({
      selectedTextColor: color,
    });
  },

  changeWindowColor(color) {
    if (!this.props.closedCaptionOptions.enabled) {
      this.props.controller.toggleClosedCaptionEnabled();
    }
    this.props.controller.onClosedCaptionChange('windowColor', color);
    this.setState({
      selectedWindowColor: color,
    });
  },

  changeBackgroundColor(color) {
    if (!this.props.closedCaptionOptions.enabled) {
      this.props.controller.toggleClosedCaptionEnabled();
    }
    this.props.controller.onClosedCaptionChange('backgroundColor', color);
    this.setState({
      selectedBackgroundColor: color,
    });
  },

  render() {
    const textColorTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.TEXT_COLOR,
      this.props.localizableStrings
    );
    const textColorSelection = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT[this.props.closedCaptionOptions.textColor.toUpperCase()],
      this.props.localizableStrings
    );

    const backgroundColorTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.BACKGROUND_COLOR,
      this.props.localizableStrings
    );
    const backgroundColorSelection = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT[this.props.closedCaptionOptions.backgroundColor.toUpperCase()],
      this.props.localizableStrings
    );

    const windowColorTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.WINDOW_COLOR,
      this.props.localizableStrings
    );
    const windowColorSelection = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT[this.props.closedCaptionOptions.windowColor.toUpperCase()],
      this.props.localizableStrings
    );

    return (
      <div className="oo-color-selection-tab">
        <div className="oo-color-selection-inner-wrapper">
          <SelectionContainer
            className="oo-text-color-selection-container"
            title={textColorTitle}
            selectionText={textColorSelection}
          >
            <div className="oo-text-color-items-container">
              <ColorSelector
                {...this.props}
                ariaLabel={CONSTANTS.ARIA_LABELS.TEXT_COLOR_MENU}
                colors={this.state.textColors}
                onColorChange={this.changeTextColor}
                selectedColor={this.props.closedCaptionOptions.textColor}
                enabled={this.props.closedCaptionOptions.enabled}
              />
            </div>
          </SelectionContainer>

          <SelectionContainer title={backgroundColorTitle} selectionText={backgroundColorSelection}>
            <ColorSelector
              {...this.props}
              ariaLabel={CONSTANTS.ARIA_LABELS.BACKGROUND_COLOR_MENU}
              colors={this.state.backgroundColors}
              onColorChange={this.changeBackgroundColor}
              selectedColor={this.props.closedCaptionOptions.backgroundColor}
              enabled={this.props.closedCaptionOptions.enabled}
            />
          </SelectionContainer>

          <SelectionContainer title={windowColorTitle} selectionText={windowColorSelection}>
            <ColorSelector
              {...this.props}
              ariaLabel={CONSTANTS.ARIA_LABELS.WINDOW_COLOR_MENU}
              colors={this.state.windowColors}
              onColorChange={this.changeWindowColor}
              selectedColor={this.props.closedCaptionOptions.windowColor}
              enabled={this.props.closedCaptionOptions.enabled}
            />
          </SelectionContainer>
        </div>
      </div>
    );
  },
});

module.exports = ColorSelectionTab;
