import React from 'react';
import ClassNames from 'classnames';
import CONSTANTS from '../constants/constants';
import Utils from '../components/utils';
import ControlBar from '../components/controlBar';
import ScrubberBar from '../components/scrubberBar';
/* eslint-disable react/destructuring-assignment */

/**
 * The screen that is shown while the player state is playing, paused, or ended for the audio only player.
 * Will display a title with description, a control bar, and a scrubber bar.
 */
class AudioOnlyScreen extends React.Component {
  /**
   * Stop click propagation if clicked on 'live' button
   * @param {Object} event - event object
   */
  handleLiveClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    this.props.controller.onLiveClick();
    this.props.controller.seek(this.props.duration);
  }

  render() {
    const titleStyle = {
      color: this.props.skinConfig.startScreen.titleFont.color,
    };
    const infoPanelClass = ClassNames({
      'oo-state-screen-audio-title': true,
    });
    const titleClass = ClassNames({
      'oo-state-screen-audio-info': true,
    });
    const textStyle = {
      maxWidth: '70%',
    };
    const textClass = ClassNames({
      'oo-text-truncate': true,
    });
    const titleMetadata = (
      <div style={textStyle} className={textClass}>
        <span className={titleClass} style={titleStyle}>
          {this.props.contentTree.title}
        </span>
        :&nbsp;
        {this.props.contentTree.description}
      </div>
    );
    const liveText = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.LIVE,
      this.props.localizableStrings
    );

    const timeShift = this.props.currentPlayhead - this.props.duration;
    const isLiveNow = Math.abs(timeShift) < 1;
    let scrubberLeft = (
      <span className="oo-scrubber-bar-left oo-scrubber-bar-current-time">
        {this.props.playheadTime}
      </span>
    );
    let scrubberRight = (
      <span className="oo-scrubber-bar-right oo-scrubber-bar-duration">
        {this.props.totalTime}
      </span>
    );
    if (this.props.isLiveStream) {
      const dvrText = isLiveNow ? '--:--' : this.props.playheadTime;
      const liveClick = isLiveNow ? null : this.handleLiveClick;
      const liveClass = ClassNames({
        'oo-scrubber-bar-left oo-live oo-live-indicator': true,
        'oo-live-nonclickable': liveClick,
      });
      scrubberLeft = (
        <a // eslint-disable-line
          key={CONSTANTS.CONTROL_BAR_KEYS.LIVE}
          className={liveClass}
          onClick={liveClick}
        >
          <div className="oo-live-circle" />
          <span className="oo-live-text">{liveText}</span>
        </a>);
      scrubberRight = (<span className="oo-scrubber-bar-right oo-scrubber-bar-current-time">{dvrText}</span>);
    }

    const shift = -2;
    const coverImageHeight = `${CONSTANTS.UI.AUDIO_ONLY_WITH_COVER_HEIGHT.slice(0, shift)
      - CONSTANTS.UI.AUDIO_ONLY_DEFAULT_HEIGHT.slice(0, shift)}px`;

    const shouldRenderCoverImage = this.props.contentTree.promo_image
      && this.props.skinConfig.audio.displayTitleOnVideoCanvas;

    // TODO: Consider multiple styling options for the control bar. We are restricted to a single row at this moment
    return (
      <div>
        {shouldRenderCoverImage
          && (
            <img
              height={coverImageHeight}
              src={this.props.contentTree.promo_image}
              className="oo-audio-only-coverImg"
              alt="promo"
            />
          )
        }
        <div className="oo-state-screen-audio oo-flex-column-parent">
          <div className={infoPanelClass}>
            {titleMetadata}
          </div>
          <div className="oo-interactive-container">
            <ControlBar
              {...this.props}
              audioOnly
              hideVolumeControls
              hideScrubberBar
              controlBarVisible
              playerState={this.props.playerState}
              isLiveStream={this.props.isLiveStream}
              a11yControls={this.props.controller.accessibilityControls}
              clickToVolumeScreen
            />
          </div>
          <div className="oo-interactive-container">
            <div className="oo-scrubber-bar-parent oo-flex-row-parent">
              {scrubberLeft}
              <ScrubberBar
                {...this.props}
                audioOnly
                forceResize={this.props.isLiveStream}
              />
              {scrubberRight}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = AudioOnlyScreen;
