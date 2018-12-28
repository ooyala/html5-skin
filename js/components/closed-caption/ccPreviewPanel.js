let React = require('react');

let Utils = require('../utils');

let CONSTANTS = require('../../constants/constants');

let ClassNames = require('classnames');

let TextTrack = require('../textTrackPanel');
let createReactClass = require('create-react-class');

let CCPreviewPanel = createReactClass({
  render: function() {
    let closedCaptionPreviewTitle = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.CLOSED_CAPTION_PREVIEW,
      this.props.localizableStrings
    );
    let closedCaptionSampleText = Utils.getLocalizedString(
      this.props.closedCaptionOptions.language,
      CONSTANTS.SKIN_TEXT.SAMPLE_TEXT,
      this.props.localizableStrings
    );
    if (!closedCaptionSampleText) {
      closedCaptionSampleText = Utils.getLocalizedString(
        'en',
        CONSTANTS.SKIN_TEXT.SAMPLE_TEXT,
        this.props.localizableStrings
      );
    }

    let previewCaptionClassName = ClassNames({
      'oo-preview-caption': true,
      'oo-disabled': !this.props.closedCaptionOptions.enabled,
    });
    let previewTextClassName = ClassNames({
      'oo-preview-text': true,
      'oo-disabled': !this.props.closedCaptionOptions.enabled,
    });

    return (
      <div className="oo-preview-panel">
        <div className={previewCaptionClassName}>{closedCaptionPreviewTitle}</div>
        <TextTrack {...this.props} cueText={closedCaptionSampleText} />
      </div>
    );
  },
});

module.exports = CCPreviewPanel;
