import React from 'react';
import values from 'lodash.values';
import PropTypes from 'prop-types';
import CONSTANTS from '../../constants/constants';
import DataSelector from '../dataSelector';
/* eslint-disable react/destructuring-assignment */

/**
 * Tab to manage languages
 */
class LanguageTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLanguage: props.closedCaptionOptions.availableLanguages.locale[
        props.closedCaptionOptions.language
      ],
    };
  }

  /**
   * Process changing language
   * @param {string} language - two chars language key
   */
  changeLanguage = (language) => {
    const { availableLanguages } = this.props.closedCaptionOptions;
    const invertedLocale = {};
    availableLanguages.languages.forEach((current) => {
      invertedLocale[availableLanguages.locale[current]] = current;
    });

    if (!this.props.closedCaptionOptions.enabled) {
      this.props.controller.toggleClosedCaptionEnabled();
    }

    this.props.controller.onClosedCaptionChange('language', invertedLocale[language]);
    this.setState({
      selectedLanguage: language,
    });
  }

  render() {
    return (
      <div className="oo-language-tab">
        <DataSelector
          {...this.props}
          ariaLabel={CONSTANTS.ARIA_LABELS.LANGUAGE_MENU}
          viewSize={this.props.responsiveView}
          dataItemsPerPage={this.props.dataItemsPerPage}
          selectedData={this.state.selectedLanguage}
          enabled={this.props.closedCaptionOptions.enabled}
          availableDataItems={values(this.props.closedCaptionOptions.availableLanguages.locale)}
          onDataChange={this.changeLanguage}
        />
      </div>
    );
  }
}

LanguageTab.propTypes = {
  dataItemsPerPage: PropTypes.objectOf(PropTypes.number),
  responsiveView: PropTypes.string,
};

LanguageTab.defaultProps = {
  dataItemsPerPage: {
    xs: 1,
    sm: 4,
    md: 8,
    lg: 8,
  },
  responsiveView: 'md',
};

module.exports = LanguageTab;
