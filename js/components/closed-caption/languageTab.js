const React = require('react');


const values = require('lodash.values');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const CONSTANTS = require('../../constants/constants');
const DataSelector = require('../dataSelector');

const LanguageTab = createReactClass({
  getInitialState() {
    return {
      selectedLanguage: this.props.closedCaptionOptions.availableLanguages.locale[
        this.props.closedCaptionOptions.language
      ],
    };
  },

  changeLanguage(language) {
    const availableLanguages = this.props.closedCaptionOptions.availableLanguages;
    const invertedLocale = {};
    for (let i = 0; i < availableLanguages.languages.length; i++) {
      invertedLocale[availableLanguages.locale[availableLanguages.languages[i]]] = availableLanguages.languages[i];
    }

    if (!this.props.closedCaptionOptions.enabled) {
      this.props.controller.toggleClosedCaptionEnabled();
    }

    this.props.controller.onClosedCaptionChange('language', invertedLocale[language]);
    this.setState({
      selectedLanguage: language,
    });
  },

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
  },
});

LanguageTab.propTypes = {
  dataItemsPerPage: PropTypes.objectOf(PropTypes.number),
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
