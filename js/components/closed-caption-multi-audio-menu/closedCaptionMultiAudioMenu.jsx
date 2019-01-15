import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Utils from '../utils';

import CONSTANTS from '../../constants/constants';
import Tab from './tab';
import MultiAudioTab from './multiAudioTab';

const ClosedCaptionMultiAudioMenu = (props) => {
  /**
   * Fetch closedCaptions from languageList
   * @param {Array} languageList - list of available languages
   * @param {String} language - the selected language
   * @returns {Array<{id: String, label: String, enabled: Boolean}>} an array of languages info objects
   * @private
   */
  const getClosedCaptions = (languageList, language) => {
    const closedCaptionList = [];
    if (Array.isArray(languageList)) {
      for (let index = 0; index < languageList.length; index++) { // eslint-disable-line
        const isSelectedCc = languageList[index] === language;
        const cc = {
          id: languageList[index],
          label: languageList[index],
          enabled: isSelectedCc,
        };
        closedCaptionList.push(cc);
      }
    }
    return closedCaptionList;
  };

  /**
   * when clicking on an item from an cc list, set the corresponding cc value
   * @param {string} id - id of clicked element
   */
  const handleClosedCaptionClick = (id) => {
    if (props.controller && typeof props.controller.onClosedCaptionChange === 'function') {
      props.controller.onClosedCaptionChange('language', id);
    }
  };

  /**
   * when clicking on an item from an audio list, set the corresponding audio value
   * @param {string} id - id of clicked element
   */
  const handleMultiAudioClick = (id) => {
    if (
      props.controller
      && typeof props.controller.setCurrentAudio === 'function'
      && props.controller.state
      && props.controller.state.multiAudio
      && props.controller.state.multiAudio.tracks
    ) {
      const { tracks } = props.controller.state.multiAudio;

      const selectedAudioTrack = tracks.find(track => track.id === id);
      props.controller.setCurrentAudio(selectedAudioTrack);
    }
    if (props.togglePopoverAction && typeof props.togglePopoverAction === 'function') {
      props.togglePopoverAction({
        restoreToggleButtonFocus: true,
      });
    }
  };

  let multiAudioCol = null;
  let closedCaptionsCol = null;
  const {
    controller,
    localizableStrings,
    language,
    skinConfig,
    menuClassName,
  } = props;
  if (controller
    && controller.state
    && controller.state.multiAudio
    && controller.state.multiAudio.tracks
    && controller.state.multiAudio.tracks.length > 0
  ) {
    multiAudioCol = (
      <MultiAudioTab
        header={Utils.getLocalizedString(
          language,
          CONSTANTS.SKIN_TEXT.AUDIO,
          localizableStrings
        )}
        handleClick={handleMultiAudioClick}
        skinConfig={skinConfig}
        audioTracksList={controller.state.multiAudio.tracks}
        language={language}
        languageList={controller.languageList}
        localizableStrings={localizableStrings}
      />
    );
  }
  if (
    controller
    && controller.state
    && controller.state.closedCaptionOptions
    && controller.state.closedCaptionOptions.availableLanguages
    && controller.state.closedCaptionOptions.availableLanguages.languages
    && controller.state.closedCaptionOptions.availableLanguages.languages.length > 0
  ) {
    const closedCaptionList = getClosedCaptions(
      controller.state.closedCaptionOptions.availableLanguages.languages,
      controller.state.closedCaptionOptions.language
    );
    closedCaptionsCol = (
      <Tab
        tabClassName="oo-hidden"
        handleClick={handleClosedCaptionClick}
        skinConfig={skinConfig}
        itemsList={closedCaptionList}
        header={Utils.getLocalizedString(
          language,
          CONSTANTS.SKIN_TEXT.SUBTITLES,
          localizableStrings
        )}
      />
    );
  }

  return (
    <div className={classnames('oo-cc-ma-menu', menuClassName)}>
      {multiAudioCol}
      {closedCaptionsCol}
    </div>
  );
};

ClosedCaptionMultiAudioMenu.propTypes = {
  menuClassName: PropTypes.string,
  skinConfig: PropTypes.shape({}),
  togglePopoverAction: PropTypes.func,
  language: PropTypes.string,
  localizableStrings: PropTypes.shape({}),
  controller: PropTypes.shape({
    setCurrentAudio: PropTypes.func,
    onClosedCaptionChange: PropTypes.func,
    state: PropTypes.shape({
      closedCaptionOptions: PropTypes.shape({}),
      multiAudio: PropTypes.shape({
        tracks: PropTypes.array,
      }),
    }),
    languageList: PropTypes.array,
  }).isRequired,
};

ClosedCaptionMultiAudioMenu.defaultProps = {
  menuClassName: '',
  skinConfig: {},
  togglePopoverAction: () => {},
  language: '',
  localizableStrings: {},
};

module.exports = ClosedCaptionMultiAudioMenu;
