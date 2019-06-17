import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Utils from './utils';

const baseFontSize = 1.0;

/**
 * Display component for video text tracks
 */
class TextTrackPanel extends React.Component {
  colorMap = {
    White: '255,255,255',
    Blue: '0,0,255',
    Magenta: '255,0,255',
    Green: '0,255,0',
    Yellow: '255,255,0',
    Red: '255,0,0',
    Cyan: '0,255,255',
    Black: '0,0,0',
    Transparent: '0,0,0',
  }

  fontTypeMap = {
    'Monospaced Serif': '"Courier New", Courier, "Nimbus Mono L", "Cutive Mono", monospace',
    'Proportional Serif': '"Times New Roman", Times, Georgia, Cambria, "PT Serif Caption", serif',
    'Monospaced Sans-Serif': '"Deja Vu Sans Mono", "Lucida Console", Monaco, Consolas, "PT Mono", monospace',
    'Proportional Sans-Serif':
      'Roboto, "Arial Unicode Ms", Arial, Helvetica, Verdana, "PT Sans Caption", sans-serif',
    Casual: '"Comic Sans MS", Impact, Handlee, fantasy',
    Cursive: '"Monotype Corsiva", "URW Chancery L", "Apple Chancery", "Dancing Script", cursive',
    'Small Capitals': '"Arial Unicode Ms", Arial, Helvetica, Verdana, "Marcellus SC", sans-serif',
  }

  fontVariantMap = {
    'Monospaced Serif': 'normal',
    'Proportional Serif': 'normal',
    'Monospaced Sans-Serif': 'normal',
    'Proportional Sans-Serif': 'normal',
    Casual: 'normal',
    Cursive: 'normal',
    'Small Capitals': 'small-caps',
  }

  fontSizeMap = {
    Small: {
      xs: `${baseFontSize * 0.8}em`, // eslint-disable-line no-magic-numbers
      sm: `${baseFontSize * 1.0}em`, // eslint-disable-line no-magic-numbers
      md: `${baseFontSize * 1.2}em`, // eslint-disable-line no-magic-numbers
      lg: `${baseFontSize * 1.4}em`, // eslint-disable-line no-magic-numbers
    },
    Medium: {
      xs: `${baseFontSize * 1.2}em`, // eslint-disable-line no-magic-numbers
      sm: `${baseFontSize * 1.4}em`, // eslint-disable-line no-magic-numbers
      md: `${baseFontSize * 1.6}em`, // eslint-disable-line no-magic-numbers
      lg: `${baseFontSize * 1.8}em`, // eslint-disable-line no-magic-numbers
    },
    Large: {
      xs: `${baseFontSize * 1.6}em`, // eslint-disable-line no-magic-numbers
      sm: `${baseFontSize * 1.8}em`, // eslint-disable-line no-magic-numbers
      md: `${baseFontSize * 2.0}em`, // eslint-disable-line no-magic-numbers
      lg: `${baseFontSize * 2.2}em`, // eslint-disable-line no-magic-numbers
    },
    'Extra Large': {
      xs: `${baseFontSize * 2.0}em`, // eslint-disable-line no-magic-numbers
      sm: `${baseFontSize * 2.2}em`, // eslint-disable-line no-magic-numbers
      md: `${baseFontSize * 2.4}em`, // eslint-disable-line no-magic-numbers
      lg: `${baseFontSize * 2.6}em`, // eslint-disable-line no-magic-numbers
    },
  }

  textEnhancementMap = {
    Uniform: 'none',
    Depressed: '1px 1px white',
    Raised: '-1px -1px white, -3px 0px 5px black',
    Shadow: '2px 2px 2px #1a1a1a',
  }

  /**
   * Build CSS of the window
   * @param {string} color - a color of the window
   * @param {number} opacity - an opacity of the window
   * @returns {Object} CSS rules
   */
  buildWindowBackgroundStyle = (color, opacity) => {
    const correctedOpacity = color === 'Transparent' ? 0 : opacity;
    return {
      backgroundColor: `rgba(${this.colorMap[color]},${correctedOpacity})`,
    };
  }

  /**
   * Build CSS of the text
   * @param {string} color - a color
   * @param {number} opacity - an opacity
   * @param {string} fontType - the type of a font
   * @param {string} fontSize - the type of a font
   * @param {string} textEnhancement - the text enhancement
   * @param {string} readDirection - the direction
   * @returns {Object} CSS rules
   */
  buildTextStyle = (color, opacity, fontType, fontSize, textEnhancement, readDirection) => {
    const { responsiveView } = this.props;
    const styles = {
      color: `rgba(${this.colorMap[color]},${opacity})`,
      fontFamily: this.fontTypeMap[fontType],
      fontVariant: this.fontVariantMap[fontType],
      fontSize: this.fontSizeMap[fontSize][responsiveView],
      textShadow: this.textEnhancementMap[textEnhancement],
      direction: readDirection === 'rtl' ? 'rtl' : '',
    };
    return styles;
  }

  render() {
    const {
      closedCaptionOptions,
      cueText,
      isInBackground,
      readDirection,
    } = this.props;
    if (!cueText) {
      return null;
    }

    const className = classNames('oo-text-track-container', {
      'oo-in-background': isInBackground,
      'oo-text-track-container-left': readDirection === 'rtl',
    });
    return (
      <div className={className}>
        <div
          className="oo-text-track-window"
          style={this.buildWindowBackgroundStyle(
            closedCaptionOptions.windowColor,
            closedCaptionOptions.windowOpacity
          )}
        >
          <div
            className="oo-text-track-background"
            style={this.buildWindowBackgroundStyle(
              closedCaptionOptions.backgroundColor,
              closedCaptionOptions.backgroundOpacity
            )}
          >
            <div
              className="oo-text-track"
              dir="auto"
              style={this.buildTextStyle(
                closedCaptionOptions.textColor,
                closedCaptionOptions.textOpacity,
                closedCaptionOptions.fontType,
                closedCaptionOptions.fontSize,
                closedCaptionOptions.textEnhancement,
                readDirection
              )}
            >
              <span dangerouslySetInnerHTML={Utils.createMarkup(cueText)} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TextTrackPanel.propTypes = {
  cueText: PropTypes.string,
  isInBackground: PropTypes.bool,
  closedCaptionOptions: PropTypes.shape({
    textColor: PropTypes.string,
    windowColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    textOpacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    backgroundOpacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    windowOpacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fontType: PropTypes.string,
    fontSize: PropTypes.string,
    textEnhancement: PropTypes.string,
  }),
  readDirection: PropTypes.string,
  responsiveView: PropTypes.string,
};

TextTrackPanel.defaultProps = {
  cueText: null,
  isInBackground: false,
  closedCaptionOptions: {
    textColor: 'White',
    windowColor: 'Transparent',
    backgroundColor: 'Black',
    textOpacity: 1,
    backgroundOpacity: 0.6,
    windowOpacity: 0,
    fontType: 'Proportional Sans-Serif',
    fontSize: 'Medium',
    textEnhancement: 'Uniform',
  },
  readDirection: 'ltr',
  responsiveView: 'md',
};

module.exports = TextTrackPanel;
