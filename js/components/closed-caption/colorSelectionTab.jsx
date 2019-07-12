import React from 'react';
import Utils from '../utils';
import CONSTANTS from '../../constants/constants';
import SelectionContainer from './selectionContainer';
import ColorSelector from '../colorSelector';

const COLORS = {
  TEXT: ['White', 'Blue', 'Magenta', 'Green', 'Yellow', 'Red', 'Cyan', 'Black'],
  WINDOW: ['Transparent', 'White', 'Blue', 'Magenta', 'Green', 'Yellow', 'Red', 'Cyan', 'Black'],
  BACKGROUND: [
    'Transparent',
    'White',
    'Blue',
    'Magenta',
    'Green',
    'Yellow',
    'Red',
    'Cyan',
    'Black',
  ],
};

/**
 * Manage closed captions text color
 */
class ColorSelectionTab extends React.Component {
  /**
   * Handle changing text color by user
   * @param {string} color - the color code
   */
  changeTextColor = (color) => {
    const { closedCaptionOptions, controller } = this.props;
    if (!closedCaptionOptions.enabled) {
      controller.toggleClosedCaptionEnabled();
    }
    controller.onClosedCaptionChange('textColor', color);
  }

  /**
   * handle changing window color by user
   * @param {string} color - the color code
   */
  changeWindowColor = (color) => {
    const { closedCaptionOptions, controller } = this.props;
    if (!closedCaptionOptions.enabled) {
      controller.toggleClosedCaptionEnabled();
    }
    controller.onClosedCaptionChange('windowColor', color);
  }

  /**
   * handle changing background color by user
   * @param {string} color - the color code
   */
  changeBackgroundColor = (color) => {
    const { closedCaptionOptions, controller } = this.props;
    if (!closedCaptionOptions.enabled) {
      controller.toggleClosedCaptionEnabled();
    }
    controller.onClosedCaptionChange('backgroundColor', color);
  }

  render() {
    const { closedCaptionOptions, language, localizableStrings } = this.props;
    const textColorTitle = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT.TEXT_COLOR,
      localizableStrings
    );
    const textColorSelection = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT[closedCaptionOptions.textColor.toUpperCase()],
      localizableStrings
    );

    const backgroundColorTitle = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT.BACKGROUND_COLOR,
      localizableStrings
    );
    const backgroundColorSelection = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT[closedCaptionOptions.backgroundColor.toUpperCase()],
      localizableStrings
    );

    const windowColorTitle = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT.WINDOW_COLOR,
      localizableStrings
    );
    const windowColorSelection = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT[closedCaptionOptions.windowColor.toUpperCase()],
      localizableStrings
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
                colors={COLORS.TEXT}
                onColorChange={this.changeTextColor}
                selectedColor={closedCaptionOptions.textColor}
                enabled={closedCaptionOptions.enabled}
              />
            </div>
          </SelectionContainer>

          <SelectionContainer title={backgroundColorTitle} selectionText={backgroundColorSelection}>
            <ColorSelector
              {...this.props}
              ariaLabel={CONSTANTS.ARIA_LABELS.BACKGROUND_COLOR_MENU}
              colors={COLORS.BACKGROUND}
              onColorChange={this.changeBackgroundColor}
              selectedColor={closedCaptionOptions.backgroundColor}
              enabled={closedCaptionOptions.enabled}
            />
          </SelectionContainer>

          <SelectionContainer title={windowColorTitle} selectionText={windowColorSelection}>
            <ColorSelector
              {...this.props}
              ariaLabel={CONSTANTS.ARIA_LABELS.WINDOW_COLOR_MENU}
              colors={COLORS.WINDOW}
              onColorChange={this.changeWindowColor}
              selectedColor={closedCaptionOptions.windowColor}
              enabled={closedCaptionOptions.enabled}
            />
          </SelectionContainer>
        </div>
      </div>
    );
  }
}

module.exports = ColorSelectionTab;
