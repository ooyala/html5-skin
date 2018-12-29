import React from 'react';
import ClassNames from 'classnames';
import createReactClass from 'create-react-class';
import PropTypes from 'prop-types';
import Utils from '../utils';
import AccessibleButton from '../accessibleButton';
import AccessibleMenu from '../higher-order/accessibleMenu';
import CONSTANTS from '../../constants/constants';
import SelectionContainer from './selectionContainer';

let TextEnhancementsTab = createReactClass({
  getInitialState() {
    return {
      selectedTextEnhancement: this.props.closedCaptionOptions.textEnhancement,
      textEnhancements: ['Uniform', 'Depressed', 'Raised', 'Shadow'],
    };
  },

  changeTextEnhancement(textEnhancement) {
    if (!this.props.closedCaptionOptions.enabled) {
      this.props.controller.toggleClosedCaptionEnabled();
    }
    this.props.controller.onClosedCaptionChange('textEnhancement', textEnhancement);
    this.setState({
      selectedTextEnhancement: textEnhancement,
    });
  },

  setClassname(item, elementType) {
    return ClassNames({
      'oo-text-enhancement-letter': elementType === 'letter',
      'oo-text-enhancement-label': elementType === 'label',
      'oo-text-enhancement-selected':
        this.props.closedCaptionOptions.textEnhancement === item && this.props.closedCaptionOptions.enabled,
      'oo-text-enhancement-label-selected':
        this.props.closedCaptionOptions.textEnhancement === item
        && this.props.closedCaptionOptions.enabled
        && elementType === 'label',
      'oo-disabled': !this.props.closedCaptionOptions.enabled,
    });
  },

  render() {
    const textEnhancementTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.TEXT_ENHANCEMENT,
      this.props.localizableStrings
    );
    const textEnhancementSelection = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT[this.props.closedCaptionOptions.textEnhancement.toUpperCase()],
      this.props.localizableStrings
    );
    const textEnhancementItems = [];
    for (let i = 0; i < this.state.textEnhancements.length; i++) {
      // accent color
      const isSelected = this.props.closedCaptionOptions.textEnhancement === this.state.textEnhancements[i];
      let selectedTextEnhancementStyle = {};
      if (
        this.props.closedCaptionOptions.enabled
        && this.props.skinConfig.general.accentColor
        && isSelected
      ) {
        selectedTextEnhancementStyle = { color: this.props.skinConfig.general.accentColor };
      }
      const itemLabel = Utils.getLocalizedString(
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
          onClick={this.changeTextEnhancement.bind(this, this.state.textEnhancements[i])}
        >
          <span
            className={
              `${this.setClassname(this.state.textEnhancements[i], 'letter')
              } oo-text-enhancement-letter-${
                this.state.textEnhancements[i]}`
            }
            style={selectedTextEnhancementStyle}
          >
            A
          </span>
          <span
            className={this.setClassname(this.state.textEnhancements[i], 'label')}
            style={selectedTextEnhancementStyle}
          >
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
            role={CONSTANTS.ARIA_ROLES.MENU}
          >
            {textEnhancementItems}
          </SelectionContainer>
        </div>
      </div>
    );
  },
});

TextEnhancementsTab = AccessibleMenu(TextEnhancementsTab, { useRovingTabindex: true });

TextEnhancementsTab.propTypes = {
  language: PropTypes.string,
  localizableStrings: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)),
  controller: PropTypes.shape({
    toggleClosedCaptionEnabled: PropTypes.func.isRequired,
    onClosedCaptionChange: PropTypes.func.isRequired,
  }),
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

module.exports = TextEnhancementsTab;
