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
    ClassNames = require('classnames');

var ClosedCaptionPanel = React.createClass({
  render: function(){
    var closedCaptionOptionsString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.CC_OPTIONS, this.props.localizableStrings);
    return (
        <div className = "closed-captions-panel">
          <div className = "closed-captions-panel-title">
            {closedCaptionOptionsString} 
            <span className={this.props.skinConfig.icons.cc.fontStyleClass}></span>
          </div>
          <OnOffSwitch {...this.props} />
          <LanguageTabContent {...this.props}/>
          <CCPreviewPanel {...this.props} />
        </div>
    );
  }
});
module.exports = ClosedCaptionPanel;

var OnOffSwitch = React.createClass({
  handleOnOffSwitch: function(evt){
    this.props.controller.toggleClosedCaptionEnabled();
  },

  render: function(){
    var switchThumbClassName = ClassNames({
      'switch-thumb': true,
      'switch-thumb-on': this.props.closedCaptionOptions.enabled,
      'switch-thumb-off': !this.props.closedCaptionOptions.enabled
    });
    var switchBodyClassName = ClassNames({
      'switch-body': true,
      'switch-body-off': !this.props.closedCaptionOptions.enabled
    });
    var onCaptionClassName = ClassNames({
      'switch-captions switch-captions-on': true,
      'switch-captions-active': this.props.closedCaptionOptions.enabled
    });
    var offCaptionClassName = ClassNames({
      'switch-captions switch-captions-off': true,
      'switch-captions-active': !this.props.closedCaptionOptions.enabled
    });

    var offString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.OFF, this.props.localizableStrings);
    var onString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.ON, this.props.localizableStrings);
    return (
        <div className="switch-container">
          <span className = {offCaptionClassName}>{offString}</span>
          <div className = "switch-element">
            <span className = {switchBodyClassName}></span>
            <span className = {switchThumbClassName}></span>
          </div>
          <span className = {onCaptionClassName}>{onString}</span>
          <a className="switch-container-selectable" onClick={this.handleOnOffSwitch}></a>
        </div>
    );
  }
});

var CCPreviewPanel = React.createClass({
  render: function(){
    var closedCaptionPreviewTitle = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.CLOSED_CAPTION_PREVIEW, this.props.localizableStrings);
    var closedCaptionSampleText =Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.SAMPLE_TEXT, this.props.localizableStrings);

    var previewCaptionClassName = ClassNames({
      'preview-caption': true,
      'disabled': !this.props.closedCaptionOptions.enabled
    });

    var previewTextClassName = ClassNames({
      'preview-text': true,
      'disabled': !this.props.closedCaptionOptions.enabled
    });

    return (
      <div className = "preview-panel">
        <div className = {previewCaptionClassName}>{closedCaptionPreviewTitle}</div>
        <div className = {previewTextClassName}>{closedCaptionSampleText}</div>
      </div>
    );
  }
});

var LanguageTabContent = React.createClass({
  getInitialState: function() {
    return {
      selectedLanguage: this.props.closedCaptionOptions.language,
      currentPage: 1
    };
  },

  changeLanguage: function(language){
    if (this.props.closedCaptionOptions.enabled){
      this.props.controller.onClosedCaptionLanguageChange(language);
    }
  },

  handleLeftChevronClick: function(evt){
    if (this.props.closedCaptionOptions.enabled){
      event.preventDefault();
      this.setState({
        currentPage: this.state.currentPage - 1
      });
    }
  },

  handleRightChevronClick: function(evt){
    if (this.props.closedCaptionOptions.enabled){
      event.preventDefault();
      this.setState({
        currentPage: this.state.currentPage + 1
      });
    }
  },

  setClassname: function(item){
    var classname = ClassNames({
      'item': true,
      'item-selected': this.props.closedCaptionOptions.language == item && this.props.closedCaptionOptions.enabled,
      'disabled': !this.props.closedCaptionOptions.enabled
    });
    return classname;
  },

  render: function(){
    var availableLanguages = this.props.closedCaptionOptions.availableLanguages; //getting list of languages

    if (availableLanguages.languages.length > 1){//if there is only one element, do not show it at all
      var languageCodes = availableLanguages.languages; // getting an array of all the codes

      var languagesPerPage = 1;
      if (this.props.screenSize == 'small'){
        var languagesPerPage = 1;
      }
      else if (this.props.screenSize == 'medium'){
        var languagesPerPage = 4;
      }
      else if (this.props.screenSize == 'large'){
        var languagesPerPage = 15;
      }

      var startAt = languagesPerPage * (this.state.currentPage - 1);
      var endAt = languagesPerPage * this.state.currentPage;
      var languagePage = availableLanguages.languages.slice(startAt,endAt);

      // Build language content blocks
      var languageContentBlocks = [];
      for (var i = 0; i < languagePage.length; i++) {
        languageContentBlocks.push(
          <div key={i}>
            <a onClick={this.changeLanguage.bind(this, languagePage[i])}>
              <div className = {this.setClassname(languagePage[i])}>{availableLanguages.locale[languagePage[i]]}</div>
            </a>
          </div>
        );
      }
    }
    var languagePanel = ClassNames({
      'language-panel': true,
      'language-panel-large': this.props.screenSize == 'large',
      'language-panel-medium': this.props.screenSize == 'medium',
      'language-panel-small': this.props.screenSize == 'small'
    });
    var leftChevron = ClassNames({
      'chevron-button-container left-chevron-container': true,
      'invisible': !this.props.closedCaptionOptions.enabled || this.state.currentPage <= 1
    });
    var rightChevron = ClassNames({
      'chevron-button-container right-chevron-container': true,
      'invisible': !this.props.closedCaptionOptions.enabled || this.state.currentPage >= availableLanguages.languages.length/languagesPerPage
    });

    return(
      <div className={languagePanel}>
        <div className={leftChevron}>
          <span className={this.props.skinConfig.icons.left.fontStyleClass} aria-hidden="true"></span>
          <a className="chevron-container-selectable" onClick={this.handleLeftChevronClick}></a>
        </div>
        <div className={rightChevron}>
          <span className={this.props.skinConfig.icons.right.fontStyleClass} aria-hidden="true"></span>
          <a className="chevron-container-selectable" onClick={this.handleRightChevronClick}></a>
        </div>
        <div className="language-container flexcontainer">
          {languageContentBlocks}
        </div>
      </div>
    );
  }
});