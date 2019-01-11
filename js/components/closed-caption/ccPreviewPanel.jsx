import React from 'react';
import ClassNames from 'classnames';
import Utils from '../utils';
import CONSTANTS from '../../constants/constants';
import TextTrack from '../textTrackPanel';

/**
 * Closed captions preview
 * @param {object} props – Props of the component
 * @returns {Object} React element
 */
const CCPreviewPanel = (props) => {
  const { language, localizableStrings, closedCaptionOptions } = props;
  const closedCaptionPreviewTitle = Utils.getLocalizedString(
    language,
    CONSTANTS.SKIN_TEXT.CLOSED_CAPTION_PREVIEW,
    localizableStrings
  );
  let closedCaptionSampleText = Utils.getLocalizedString(
    closedCaptionOptions.language,
    CONSTANTS.SKIN_TEXT.SAMPLE_TEXT,
    localizableStrings
  );
  if (!closedCaptionSampleText) {
    closedCaptionSampleText = Utils.getLocalizedString(
      'en',
      CONSTANTS.SKIN_TEXT.SAMPLE_TEXT,
      props.localizableStrings
    );
  }

  const previewCaptionClassName = ClassNames({
    'oo-preview-caption': true,
    'oo-disabled': !closedCaptionOptions.enabled,
  });

  return (
    <div className="oo-preview-panel">
      <div className={previewCaptionClassName}>{closedCaptionPreviewTitle}</div>
      <TextTrack {...props} cueText={closedCaptionSampleText} />
    </div>
  );
};

module.exports = CCPreviewPanel;
