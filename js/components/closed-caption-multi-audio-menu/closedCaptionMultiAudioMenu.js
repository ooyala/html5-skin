var React = require('react');
var ReactDOM = require('react-dom');
var Utils = require('../utils');
var classnames = require('classnames');
var CONSTANTS = require('../../constants/constants');
var Tab = require('./tab');
var MultiAudioTab = require('./multiAudioTab');

var ClosedCaptionMultiAudioMenu = React.createClass({
  componentDidMount: function() {
    var multiAudioCol = ReactDOM.findDOMNode(this.refs.multiAudioCol);
    var closeCaptionsCol = ReactDOM.findDOMNode(this.refs.closeCaptionsCol);
    if (multiAudioCol && closeCaptionsCol && typeof Utils.getMaxElementWidth === 'function') {
      var maxWidth = Utils.getMaxElementWidth(multiAudioCol, closeCaptionsCol);
      multiAudioCol.style.width = maxWidth + 'px';
      closeCaptionsCol.style.width = maxWidth + 'px';
    }
  },
  /**
   *
   * @param languages {Array} - list of available languages
   * @param language {String} - a selected language
   * @returns {Array<{id: String, label: String, enabled: Boolean}>} an array of languages info objects
   * @private
   */
  getClosedCaptions: function(languages, language) {
    var closeCaptions = [];
    if (Array.isArray(languages)) {
      for (var index = 0; index < languages.length; index++) {
        var isSelectedCc = languages[index] === language;
        var cc = {
          id: languages[index],
          label: languages[index],
          enabled: isSelectedCc
        };
        closeCaptions.push(cc);
      }
    }
    return closeCaptions;
  },

  /**
   * when clicking on an item from an cc list, set the corresponding cc value
   * @param id {string} - id of clicked element
   */
  handleClickCC: function(id) {
    if (this.props.controller && typeof this.props.controller.onClosedCaptionChange === 'function') {
      this.props.controller.onClosedCaptionChange('language', id);
    }
  },

  /**
   * when clicking on an item from an audio list, set the corresponding audio value
   * @param id {string} - id of clicked element
   */
  handleClickMA: function(id) {
    if (this.props.controller && typeof this.props.controller.setCurrentAudio === 'function') {
      this.props.controller.setCurrentAudio(id);
    }
  },

  render: function() {
    var multiAudioCol = null;
    var closeCaptionsCol = null;
    if (
      this.props.controller &&
      this.props.controller.state &&
      this.props.controller.state.multiAudio &&
      this.props.controller.state.multiAudio.tracks &&
      this.props.controller.state.multiAudio.tracks.length > 0
    ) {
      multiAudioCol = (
        <MultiAudioTab
          ref="multiAudioCol"
          handleClick={this.handleClickMA}
          skinConfig={this.props.skinConfig}
          list={this.props.controller.state.multiAudio.tracks}
        />
      );
    }
    if (
      this.props.controller &&
      this.props.controller.state &&
      this.props.controller.state.closedCaptionOptions &&
      this.props.controller.state.closedCaptionOptions.availableLanguages &&
      this.props.controller.state.closedCaptionOptions.availableLanguages.languages &&
      this.props.controller.state.closedCaptionOptions.availableLanguages.languages.length > 0
    ) {
      var closedCaptions = this.getClosedCaptions(
        this.props.controller.state.closedCaptionOptions.availableLanguages.languages,
        this.props.controller.state.closedCaptionOptions.language
      );
      closeCaptionsCol = (
        <Tab
          ref="closeCaptionsCol"
          handleClick={this.handleClickCC}
          skinConfig={this.props.skinConfig}
          list={closedCaptions}
          header={CONSTANTS.SKIN_TEXT.SUBTITLES}
        />
      );
    }

    return (
      <div className={classnames('oo-cc-ma-menu', this.props.menuClassName)}>
        {multiAudioCol}
        {closeCaptionsCol}
      </div>
    );
  }
});

ClosedCaptionMultiAudioMenu.propTypes = {
  menuClassName: React.PropTypes.string,
  skinConfig: React.PropTypes.object,
  controller: React.PropTypes.shape({
    setCurrentAudio: React.PropTypes.func,
    onClosedCaptionChange: React.PropTypes.func,
    state: React.PropTypes.shape({
      closedCaptionOptions: React.PropTypes.object,
      multiAudio: React.PropTypes.shape({
        tracks: React.PropTypes.array
      })
    })
  })
};

module.exports = ClosedCaptionMultiAudioMenu;
