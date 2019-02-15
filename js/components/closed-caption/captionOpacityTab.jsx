import React from 'react';
import PropTypes from 'prop-types';
import Utils from '../utils';
import CONSTANTS from '../../constants/constants';
import SelectionContainer from './selectionContainer';
import Slider from '../slider';
/* eslint-disable react/destructuring-assignment */

/**
 * view to manage caption opacity
 */
class CaptionOpacityTab extends React.Component {
  /**
   * handle user select text opacity
   * @param {string} value - the text opacity value
   */
  changeTextOpacity = (value) => {
    if (!this.props.closedCaptionOptions.enabled) {
      this.props.controller.toggleClosedCaptionEnabled();
    }
    this.props.controller.onClosedCaptionChange('textOpacity', value);
  }

  /**
   * handle user select background opacity
   * @param {string} value - the background opacity value
   */
  changeBackgroundOpacity = (value) => {
    if (!this.props.closedCaptionOptions.enabled) {
      this.props.controller.toggleClosedCaptionEnabled();
    }
    this.props.controller.onClosedCaptionChange('backgroundOpacity', value);
  }

  /**
   * handle user select window opacity
   * @param {string} value – the window opacity value
   */
  changeWindowOpacity = (value) => {
    if (!this.props.closedCaptionOptions.enabled) {
      this.props.controller.toggleClosedCaptionEnabled();
    }
    this.props.controller.onClosedCaptionChange('windowOpacity', value);
  }

  /**
   * transform float to percent string
   * @param {number} number - percent
   * @returns {Object} React element
   */
  percentString = number => `${(number * 100).toString()}%`; // eslint-disable-line

  render() {
    const textOpacityTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.TEXT_OPACITY,
      this.props.localizableStrings
    );
    const backgroundOpacityTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.BACKGROUND_OPACITY,
      this.props.localizableStrings
    );
    const windowOpacityTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.WINDOW_OPACITY,
      this.props.localizableStrings
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
            selectionText={this.percentString(this.props.closedCaptionOptions.textOpacity)}
          >
            <Slider
              value={parseFloat(this.props.closedCaptionOptions.textOpacity)}
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
            selectionText={this.percentString(this.props.closedCaptionOptions.backgroundOpacity)}
          >
            <Slider
              value={parseFloat(this.props.closedCaptionOptions.backgroundOpacity)}
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
            selectionText={this.percentString(this.props.closedCaptionOptions.windowOpacity)}
          >
            <Slider
              value={parseFloat(this.props.closedCaptionOptions.windowOpacity)}
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
