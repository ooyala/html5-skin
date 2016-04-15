/********************************************************************
  CLOSED CAPTION PANEL
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class ClosedCaptionPanel
* @constructor
*/
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    Utils = require('./utils'),
    ClassNames = require('classnames'),
    Icon = require('../components/icon');

var ClosedCaptionPanel = React.createClass({
  render: function(){
    var closedCaptionOptionsString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.CC_OPTIONS, this.props.localizableStrings);
    return (
        <div className="oo-closed-captions-panel">
          <div className="oo-closed-captions-panel-title">
            {closedCaptionOptionsString}
            <Icon {...this.props} icon="cc"/>
          </div>
          <OnOffSwitch {...this.props} />
          <LanguageTabContent {...this.props} />
          <CCPreviewPanel {...this.props} />
        </div>
    );
  }
});
module.exports = ClosedCaptionPanel;

var OnOffSwitch = React.createClass({
  handleOnOffSwitch: function() {
    this.props.controller.toggleClosedCaptionEnabled();
  },

  render: function(){
    var switchThumbClassName = ClassNames({
      'oo-switch-thumb': true,
      'oo-switch-thumb-on': this.props.closedCaptionOptions.enabled,
      'oo-switch-thumb-off': !this.props.closedCaptionOptions.enabled
    });
    var switchBodyClassName = ClassNames({
      'oo-switch-body': true,
      'oo-switch-body-off': !this.props.closedCaptionOptions.enabled
    });
    var onCaptionClassName = ClassNames({
      'oo-switch-captions oo-switch-captions-on': true,
      'oo-switch-captions-active': this.props.closedCaptionOptions.enabled
    });
    var offCaptionClassName = ClassNames({
      'oo-switch-captions oo-switch-captions-off': true,
      'oo-switch-captions-active': !this.props.closedCaptionOptions.enabled
    });

    var offString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.OFF, this.props.localizableStrings);
    var onString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.ON, this.props.localizableStrings);

    return (
        <div className="oo-switch-container">
          <span className={offCaptionClassName}>{offString}</span>
          <div className="oo-switch-element">
            <span className={switchBodyClassName}></span>
            <span className={switchThumbClassName}></span>
          </div>
          <span className={onCaptionClassName}>{onString}</span>
          <a className="oo-switch-container-selectable" onClick={this.handleOnOffSwitch}></a>
        </div>
    );
  }
});

var CCPreviewPanel = React.createClass({
  render: function(){
    var closedCaptionPreviewTitle = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.CLOSED_CAPTION_PREVIEW, this.props.localizableStrings);
    var closedCaptionSampleText = Utils.getLocalizedString(this.props.closedCaptionOptions.language, CONSTANTS.SKIN_TEXT.SAMPLE_TEXT, this.props.localizableStrings);
    if (!closedCaptionSampleText) closedCaptionSampleText = Utils.getLocalizedString('en', CONSTANTS.SKIN_TEXT.SAMPLE_TEXT, this.props.localizableStrings);

    var previewCaptionClassName = ClassNames({
      'oo-preview-caption': true,
      'oo-disabled': !this.props.closedCaptionOptions.enabled
    });
    var previewTextClassName = ClassNames({
      'oo-preview-text': true,
      'oo-disabled': !this.props.closedCaptionOptions.enabled
    });

    return (
      <div className="oo-preview-panel">
        <div className={previewCaptionClassName}>{closedCaptionPreviewTitle}</div>
        <div className={previewTextClassName}>{closedCaptionSampleText}</div>
      </div>
    );
  }
});

var LanguageTabContent = React.createClass({
  propTypes: {
    languagesPerPage: React.PropTypes.objectOf(React.PropTypes.number)
  },

  getDefaultProps: function () {
    return {
      languagesPerPage: {
        xs: 1,
        sm: 4,
        md: 4,
        lg: 15
      },
      responsiveView: 'md'
    }
  },

  getInitialState: function() {
    return {
      selectedLanguage: this.props.closedCaptionOptions.language,
      currentPage: 1
    };
  },

  componentWillReceiveProps: function(nextProps) {
    //If we are changing view sizes, adjust the currentPage number to reflect the new number of items per page.
    if (nextProps.responsiveView != this.props.responsiveView) {
      var currentViewSize = this.props.responsiveView;
      var nextViewSize = nextProps.responsiveView;
      var firstLanguageIndex = this.state.currentPage * this.props.languagesPerPage[currentViewSize] - this.props.languagesPerPage[currentViewSize];
      var newCurrentPage = Math.floor(firstLanguageIndex/nextProps.languagesPerPage[nextViewSize]) + 1;
      this.setState({
        currentPage: newCurrentPage
      });
    }
  },

  changeLanguage: function(language){
    if (this.props.closedCaptionOptions.enabled){
      this.props.controller.onClosedCaptionLanguageChange(language);
      this.setState({
        selectedLanguage: language
      });
    }
  },

  handleLeftChevronClick: function(event){
    event.preventDefault();
    this.setState({
      currentPage: this.state.currentPage - 1
    });
  },

  handleRightChevronClick: function(event){
    event.preventDefault();
    this.setState({
      currentPage: this.state.currentPage + 1
    });
  },

  setClassname: function(item){
    return ClassNames({
      'oo-item': true,
      'oo-item-selected': this.props.closedCaptionOptions.language == item && this.props.closedCaptionOptions.enabled,
      'oo-disabled': !this.props.closedCaptionOptions.enabled
    });
  },

  render: function(){
    var availableLanguages = this.props.closedCaptionOptions.availableLanguages; //getting list of languages

    //pagination
    var currentViewSize = this.props.responsiveView;
    var languagesPerPage = this.props.languagesPerPage[currentViewSize];
    var startAt = languagesPerPage * (this.state.currentPage - 1);
    var endAt = languagesPerPage * this.state.currentPage;
    var languagePage = availableLanguages.languages.slice(startAt,endAt);

    //if there is only one element, do not show it at all
    if (availableLanguages.languages.length > 1) {
      //Build language content blocks
      var languageContentBlocks = [];
      for (var i = 0; i < languagePage.length; i++) {
        languageContentBlocks.push(
          <a className={this.setClassname(languagePage[i])} onClick={this.changeLanguage.bind(this, languagePage[i])} key={i}>
            <span className="oo-language">{availableLanguages.locale[languagePage[i]]}</span>
          </a>
        );
      }
    }

    var leftChevron = ClassNames({
      'oo-left-button': true,
      'oo-hidden': !this.props.closedCaptionOptions.enabled || this.state.currentPage <= 1
    });
    var rightChevron = ClassNames({
      'oo-right-button': true,
      'oo-hidden': !this.props.closedCaptionOptions.enabled || endAt >= availableLanguages.languages.length
    });

    return(
      <div className="oo-language-container">
        <div className="oo-language-panel oo-flexcontainer">
          {languageContentBlocks}
        </div>

        <a className={leftChevron} ref="leftChevron" onClick={this.handleLeftChevronClick}>
          <Icon {...this.props} icon="left"/>
        </a>
        <a className={rightChevron} ref="rightChevron" onClick={this.handleRightChevronClick}>
          <Icon {...this.props} icon="right"/>
        </a>
      </div>
    );
  }
});