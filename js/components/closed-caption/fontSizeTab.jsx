import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import Utils from '../utils';
import AccessibleButton from '../accessibleButton';
import AccessibleMenu from '../higher-order/accessibleMenu';
import CONSTANTS from '../../constants/constants';
import SelectionContainer from './selectionContainer';

/**
 * Manage font size tuning
 */
class FontSizeTabProto extends React.Component {
  constructor(props) {
    super(props);
    const { closedCaptionOptions } = this.props;
    this.state = {
      selectedFontSize: closedCaptionOptions.fontSize, // eslint-disable-line
      fontSizes: ['Small', 'Medium', 'Large', 'Extra Large'],
    };
  }

  /**
   * Set up classname attribute of the element
   * @param {*} item - element where the component get's mounted
   * @param {*} elementType - type of the element
   * @returns {Array} list of classes
   */
  setClassname(item, elementType) {
    const { closedCaptionOptions } = this.props;
    return ClassNames({
      'oo-font-size-letter': elementType === 'letter',
      'oo-font-size-label': elementType === 'label',
      'oo-font-size-selected':
        closedCaptionOptions.fontSize === item && closedCaptionOptions.enabled,
      'oo-font-size-label-selected':
        closedCaptionOptions.fontSize === item
        && closedCaptionOptions.enabled
        && elementType === 'label',
      'oo-disabled': !closedCaptionOptions.enabled,
    });
  }

  /**
   * Handle change font size
   * @param {number} fontSize - the size of a font
   */
  changeFontSize = (fontSize) => {
    const { closedCaptionOptions, controller } = this.props;
    if (!closedCaptionOptions.enabled) {
      controller.toggleClosedCaptionEnabled();
    }
    controller.onClosedCaptionChange('fontSize', fontSize);
    this.setState({
      selectedFontSize: fontSize, // eslint-disable-line
    });
  }

  render() {
    const {
      language,
      localizableStrings,
      closedCaptionOptions,
      skinConfig,
    } = this.props;
    const { fontSizes } = this.state;
    const fontSizeTitle = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT.FONT_SIZE,
      localizableStrings
    );
    const fontSizeSelection = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT[closedCaptionOptions.fontSize.toUpperCase().replace(' ', '_')],
      localizableStrings
    );
    const fontItems = [];
    fontSizes.forEach((fontSize, index) => {
      // accent color
      const isSelected = closedCaptionOptions.fontSize === fontSize;
      let selectedFontSizeStyle = {};
      if (
        closedCaptionOptions.enabled
        && skinConfig.general.accentColor
        && isSelected
      ) {
        selectedFontSizeStyle = { color: skinConfig.general.accentColor };
      }
      const itemLabel = Utils.getLocalizedString(
        language,
        CONSTANTS.SKIN_TEXT[fontSize.toUpperCase().replace(' ', '_')],
        localizableStrings
      );

      fontItems.push(
        <AccessibleButton
          key={index} // eslint-disable-line
          className="oo-font-size-container"
          ariaLabel={itemLabel}
          ariaChecked={isSelected}
          role={CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO}
          onClick={() => this.changeFontSize(fontSize)}
        >
          <span
            className={
              `${this.setClassname(fontSize, 'letter')
              } oo-font-size-letter-${
                fontSize.replace(' ', '-')}`
            }
            style={selectedFontSizeStyle}
          >
            A
          </span>
          <span className={this.setClassname(fontSize, 'label')} style={selectedFontSizeStyle}>
            {itemLabel}
          </span>
        </AccessibleButton>
      );
    });

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
}

const FontSizeTab = AccessibleMenu(FontSizeTabProto, { useRovingTabindex: true });

FontSizeTabProto.propTypes = {
  language: PropTypes.string,
  localizableStrings: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
  closedCaptionOptions: PropTypes.shape({
    enabled: PropTypes.bool,
    fontSize: PropTypes.string,
  }),
  controller: PropTypes.shape({
    toggleClosedCaptionEnabled: PropTypes.func.isRequired,
    onClosedCaptionChange: PropTypes.func.isRequired,
  }).isRequired,
  skinConfig: PropTypes.shape({
    general: PropTypes.shape({
      accentColor: PropTypes.string,
    }),
  }),
};

FontSizeTabProto.defaultProps = {
  language: 'en',
  localizableStrings: {},
  closedCaptionOptions: {},
  skinConfig: {},
};

module.exports = FontSizeTab;
