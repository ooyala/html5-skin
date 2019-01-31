import React from 'react';
import PropTypes from 'prop-types';
import ControlBar from './controlBar';

/**
 * Volume menu. This component is used for both the Popover and
 * Screen modes of the menu.
 */
class VolumePanel extends React.Component { // eslint-disable-line
  render() {
    const {
      a11yControls,
      buffered,
      componentWidth,
      currentPlayhead,
      duration,
      isLiveStream,
      playerState,
      playheadTime,
      responsiveId,
      totalTime,
    } = this.props;
    return (
      <div className="oo-absolute-centered oo-volume-panel">
        <ControlBar
          {...this.props}
          hideScrubberBar
          controlBarVisible
          playerState={playerState}
          isLiveStream={isLiveStream}
          a11yControls={a11yControls}
          currentPlayhead={currentPlayhead}
          duration={duration}
          totalTime={totalTime}
          playheadTime={playheadTime}
          buffered={buffered}
          responsiveView={responsiveId}
          componentWidth={componentWidth}
          controlBarItems={[{
            name: 'volume', location: 'controlBar', whenDoesNotFit: 'keep', minWidth: 200,
          }]}
        />
      </div>
    );
  }
}

VolumePanel.propTypes = {
  totalTime: PropTypes.string.isRequired,
  playheadTime: PropTypes.string.isRequired,
  clickToVolumeScreen: PropTypes.bool,
  hideVolumeControls: PropTypes.bool,
  hideScrubberBar: PropTypes.bool,
  audioOnly: PropTypes.bool,
  isLiveStream: PropTypes.bool,
  controlBarVisible: PropTypes.bool,
  playerState: PropTypes.string.isRequired,
  responsiveView: PropTypes.string,
  language: PropTypes.string,
  localizableStrings: PropTypes.shape({}),
  duration: PropTypes.number,
  currentPlayhead: PropTypes.number,
  componentWidth: PropTypes.number,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  skinConfig: PropTypes.shape({
    responsive: PropTypes.shape({
      breakpoints: PropTypes.object,
    }),
  }),
  controller: PropTypes.shape({
    state: PropTypes.object,
    videoVrSource: PropTypes.shape({
      vr: PropTypes.object,
    }),
    cancelTimer: PropTypes.func,
    startHideControlBarTimer: PropTypes.func,
    hideVolumeSliderBar: PropTypes.func,
    closePopover: PropTypes.func,
    closeOtherPopovers: PropTypes.func,
    isVrStereo: PropTypes.bool,
  }).isRequired,
};

VolumePanel.defaultProps = {
  clickToVolumeScreen: () => {},
  hideScrubberBar: () => {},
  hideVolumeControls: () => {},
  audioOnly: false,
  isLiveStream: false,
  controlBarVisible: false,
  responsiveView: 'md',
  language: 'en',
  localizableStrings: {},
  duration: 0,
  currentPlayhead: 0,
  componentWidth: 0,
  onFocus: () => {},
  onBlur: () => {},
  skinConfig: {},
};

module.exports = VolumePanel;
