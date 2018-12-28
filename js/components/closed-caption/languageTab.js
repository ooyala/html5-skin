let React = require('react');

let DataSelector = require('../dataSelector');

let CONSTANTS = require('../../constants/constants');

let values = require('lodash.values');
let createReactClass = require('create-react-class');
let PropTypes = require('prop-types');

let LanguageTab = createReactClass({
  getInitialState: function() {
    return {
      selectedLanguage: this.props.closedCaptionOptions.availableLanguages.locale[
        this.props.closedCaptionOptions.language
      ],
    };
  },

  changeLanguage: function(language) {
    let availableLanguages = this.props.closedCaptionOptions.availableLanguages;
    let invertedLocale = {};
    for (let i = 0; i < availableLanguages.languages.length; i++) {
      invertedLocale[availableLanguages.locale[availableLanguages.languages[i]]] =
        availableLanguages.languages[i];
    }

    if (!this.props.closedCaptionOptions.enabled) {
      this.props.controller.toggleClosedCaptionEnabled();
    }

    this.props.controller.onClosedCaptionChange('language', invertedLocale[language]);
    this.setState({
      selectedLanguage: language,
    });
  },

  render: function() {
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
