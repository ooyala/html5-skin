import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import Utils from '../utils';
import AccessibleButton from '../accessibleButton';
import AccessibleMenu from '../higher-order/accessibleMenu';
import CONSTANTS from '../../constants/constants';
import SelectionContainer from './selectionContainer';

/**
 * Manage text enhancements
 */
class TextEnhancementsTabProto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTextEnhancement: this.props.closedCaptionOptions.textEnhancement, // eslint-disable-line
      textEnhancements: ['Uniform', 'Depressed', 'Raised', 'Shadow'],
    };
  }

  /**
   * Update the classes of the element where the component is binded to
   * @param {*} item - the item
   * @param {*} elementType - the elementType
   * @returns {Array} list of classnames to get rendered
   */
  setClassname(item, elementType) {
    const { closedCaptionOptions } = this.props;
    return ClassNames({
      'oo-text-enhancement-letter': elementType === 'letter',
      'oo-text-enhancement-label': elementType === 'label',
      'oo-text-enhancement-selected':
        closedCaptionOptions.textEnhancement === item && closedCaptionOptions.enabled,
      'oo-text-enhancement-label-selected':
        closedCaptionOptions.textEnhancement === item
        && closedCaptionOptions.enabled
        && elementType === 'label',
      'oo-disabled': !closedCaptionOptions.enabled,
    });
  }

  /**
   * handle change of text enhancement by user
   * @param {string} textEnhancement - the value of textEhancement
   */
  changeTextEnhancement = (textEnhancement) => {
    const { closedCaptionOptions, controller } = this.props;
    if (!closedCaptionOptions.enabled) {
      controller.toggleClosedCaptionEnabled();
    }
    controller.onClosedCaptionChange('textEnhancement', textEnhancement);
    this.setState({
      selectedTextEnhancement: textEnhancement, // eslint-disable-line
    });
  }

  render() {
    const {
      closedCaptionOptions,
      language,
      localizableStrings,
      skinConfig,
    } = this.props;
    const { textEnhancements } = this.state;
    const textEnhancementTitle = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT.TEXT_ENHANCEMENT,
      localizableStrings
    );
    const textEnhancementSelection = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT[closedCaptionOptions.textEnhancement.toUpperCase()],
      localizableStrings
    );
    const textEnhancementItems = [];
    textEnhancements.forEach((textEnhancement, index) => {
      // accent color
      const isSelected = closedCaptionOptions.textEnhancement === textEnhancement;
      let selectedTextEnhancementStyle = {};
      if (
        closedCaptionOptions.enabled
        && skinConfig.general.accentColor
        && isSelected
      ) {
        selectedTextEnhancementStyle = { color: skinConfig.general.accentColor };
      }
      const itemLabel = Utils.getLocalizedString(
        language,
        CONSTANTS.SKIN_TEXT[textEnhancement.toUpperCase()],
        localizableStrings
      );

      textEnhancementItems.push(
        <AccessibleButton
          key={index} // eslint-disable-line
          className="oo-text-enhancements-container"
          ariaLabel={itemLabel}
          ariaChecked={isSelected}
          role={CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO}
          onClick={() => this.changeTextEnhancement(textEnhancement)}
        >
          <span
            className={
              `${this.setClassname(textEnhancement, 'letter')
              } oo-text-enhancement-letter-${
                textEnhancement}`
            }
            style={selectedTextEnhancementStyle}
          >
            A
          </span>
          <span
            className={this.setClassname(textEnhancement, 'label')}
            style={selectedTextEnhancementStyle}
          >
            {itemLabel}
          </span>
        </AccessibleButton>
      );
    });

    return (
      <div className="oo-text-enhancements-tab">
        <div className="oo-text-enhancements-inner-wrapper">
          <SelectionContainer
            title={textEnhancementTitle}
            selectionText={textEnhancementSelection}
            ariaLabel={CONSTANTS.ARIA_LABELS.TEXT_ENHANCEMENTS_MENU}
            role={CONSTANTS.ARIA_ROLES.MENU}
          >
            {textEnhancementItems}
          </SelectionContainer>
        </div>
      </div>
    );
  }
}

const TextEnhancementsTab = AccessibleMenu(TextEnhancementsTabProto, { useRovingTabindex: true });

TextEnhancementsTabProto.propTypes = {
  language: PropTypes.string,
  localizableStrings: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
  controller: PropTypes.shape({
    toggleClosedCaptionEnabled: PropTypes.func.isRequired,
    onClosedCaptionChange: PropTypes.func.isRequired,
  }).isRequired,
  skinConfig: PropTypes.shape({
    general: PropTypes.shape({
      accentColor: PropTypes.string,
    }),
  }),
  closedCaptionOptions: PropTypes.shape({
    textEnhancement: PropTypes.string,
    enabled: PropTypes.bool,
  }),
};

TextEnhancementsTabProto.defaultProps = {
  language: 'en',
  localizableStrings: {},
  skinConfig: {},
  closedCaptionOptions: {},
};

module.exports = TextEnhancementsTab;
