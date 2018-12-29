const React = require('react');

const ClassNames = require('classnames');
const createReactClass = require('create-react-class');
const Utils = require('../utils');

const CONSTANTS = require('../../constants/constants');


const TextTrack = require('../textTrackPanel');

const CCPreviewPanel = createReactClass({
  render() {
    const closedCaptionPreviewTitle = Utils.getLocalizedString(
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

    const previewCaptionClassName = ClassNames({
      'oo-preview-caption': true,
      'oo-disabled': !this.props.closedCaptionOptions.enabled,
    });
    const previewTextClassName = ClassNames({
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
