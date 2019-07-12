import React from 'react';
import values from 'lodash.values';
import PropTypes from 'prop-types';
import CONSTANTS from '../../constants/constants';
import DataSelector from '../dataSelector';

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
    const { closedCaptionOptions, controller } = this.props;
    const { availableLanguages } = closedCaptionOptions;
    const invertedLocale = {};
    availableLanguages.languages.forEach((current) => {
      invertedLocale[availableLanguages.locale[current]] = current;
    });

    if (!closedCaptionOptions.enabled) {
      controller.toggleClosedCaptions();
    }

    controller.onClosedCaptionChange('language', invertedLocale[language]);
    this.setState({
      selectedLanguage: language,
    });
  }

  render() {
    const {
      responsiveView,
      dataItemsPerPage,
      closedCaptionOptions,
    } = this.props;

    const { selectedLanguage } = this.state;
    return (
      <div className="oo-language-tab">
        <DataSelector
          {...this.props}
          ariaLabel={CONSTANTS.ARIA_LABELS.LANGUAGE_MENU}
          viewSize={responsiveView}
          dataItemsPerPage={dataItemsPerPage}
          selectedData={selectedLanguage}
          enabled={closedCaptionOptions.enabled}
          availableDataItems={values(closedCaptionOptions.availableLanguages.locale)}
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
