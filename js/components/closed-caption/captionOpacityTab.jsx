import React from 'react';
import PropTypes from 'prop-types';
import Utils from '../utils';
import CONSTANTS from '../../constants/constants';
import SelectionContainer from './selectionContainer';
import Slider from '../slider';

/**
 * view to manage caption opacity
 */
class CaptionOpacityTab extends React.Component {
  /**
   * handle user select text opacity
   * @param {string} value - the text opacity value
   */
  changeTextOpacity = (value) => {
    const { closedCaptionOptions, controller } = this.props;
    if (!closedCaptionOptions.enabled) {
      controller.toggleClosedCaptionEnabled();
    }
    controller.onClosedCaptionChange('textOpacity', value);
  }

  /**
   * handle user select background opacity
   * @param {string} value - the background opacity value
   */
  changeBackgroundOpacity = (value) => {
    const { closedCaptionOptions, controller } = this.props;
    if (!closedCaptionOptions.enabled) {
      controller.toggleClosedCaptionEnabled();
    }
    controller.onClosedCaptionChange('backgroundOpacity', value);
  }

  /**
   * handle user select window opacity
   * @param {string} value – the window opacity value
   */
  changeWindowOpacity = (value) => {
    const { closedCaptionOptions, controller } = this.props;
    if (!closedCaptionOptions.enabled) {
      controller.toggleClosedCaptionEnabled();
    }
    controller.onClosedCaptionChange('windowOpacity', value);
  }

  /**
   * transform float to percent string
   * @param {number} number - percent
   * @returns {Object} React element
   */
  percentString = number => `${(number * 100).toString()}%`;

  render() {
    const {
      language,
      localizableStrings,
      closedCaptionOptions,
    } = this.props;

    const textOpacityTitle = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT.TEXT_OPACITY,
      localizableStrings
    );
    const backgroundOpacityTitle = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT.BACKGROUND_OPACITY,
      localizableStrings
    );
    const windowOpacityTitle = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT.WINDOW_OPACITY,
      localizableStrings
    );

    return (
      <div className="oo-caption-opacity-tab">
        <div
          className="oo-caption-opacity-inner-wrapper"
          aria-label={CONSTANTS.ARIA_LABELS.CAPTION_OPACITY_MENU}
          role={CONSTANTS.ARIA_ROLES.MENU}
        >
          <SelectionContainer
            title={textOpacityTitle}
            selectionText={this.percentString(closedCaptionOptions.textOpacity)}
          >
            <Slider
              value={parseFloat(closedCaptionOptions.textOpacity)}
              onChange={this.changeTextOpacity}
              className="oo-slider-caption-opacity"
              itemRef="textOpacitySlider"
              minValue={0}
              maxValue={1}
              step={0.1}
              usePercentageForAria
              ariaLabel={textOpacityTitle}
              settingName={textOpacityTitle}
            />
          </SelectionContainer>

          <SelectionContainer
            title={backgroundOpacityTitle}
            selectionText={this.percentString(closedCaptionOptions.backgroundOpacity)}
          >
            <Slider
              value={parseFloat(closedCaptionOptions.backgroundOpacity)}
              onChange={this.changeBackgroundOpacity}
              className="oo-slider-caption-opacity"
              itemRef="backgroundOpacitySlider"
              minValue={0}
              maxValue={1}
              step={0.1}
              usePercentageForAria
              ariaLabel={backgroundOpacityTitle}
              settingName={backgroundOpacityTitle}
            />
          </SelectionContainer>

          <SelectionContainer
            title={windowOpacityTitle}
            selectionText={this.percentString(closedCaptionOptions.windowOpacity)}
          >
            <Slider
              value={parseFloat(closedCaptionOptions.windowOpacity)}
              onChange={this.changeWindowOpacity}
              className="oo-slider-caption-opacity"
              itemRef="windowOpacitySlider"
              minValue={0}
              maxValue={1}
              step={0.1}
              usePercentageForAria
              ariaLabel={windowOpacityTitle}
              settingName={windowOpacityTitle}
            />
          </SelectionContainer>
        </div>
      </div>
    );
  }
}

CaptionOpacityTab.propTypes = {
  language: PropTypes.string,
  localizableStrings: PropTypes.shape({}),
  closedCaptionOptions: PropTypes.shape({
    enabled: PropTypes.bool,
    textOpacity: PropTypes.number,
    backgroundOpacity: PropTypes.number,
    windowOpacity: PropTypes.number,
  }),
  controller: PropTypes.shape({
    toggleClosedCaptionEnabled: PropTypes.func,
    onClosedCaptionChange: PropTypes.func,
  }).isRequired,
};

CaptionOpacityTab.defaultProps = {
  language: 'en',
  localizableStrings: {},
  closedCaptionOptions: {},
};

module.exports = CaptionOpacityTab;
