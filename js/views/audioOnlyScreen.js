/*********************************************************************
  AUDIO ONLY SCREEN
*********************************************************************/
const React = require('react');
const CONSTANTS = require('../constants/constants');
const Utils = require('../components/utils');
const ControlBar = require('../components/controlBar');
const ClassNames = require('classnames');

const ScrubberBar = require('../components/scrubberBar');

/**
 * The screen that is shown while the player state is playing, paused, or ended for the audio only player.
 * Will display a title with description, a control bar, and a scrubber bar.
 */
class AudioOnlyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      controlBarVisible: true,
      animate: false,
      forceResize: false,
    };
    this.handleLiveClick = this.handleLiveClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // [PLAYER-4848] If we find out that this is a live stream, we need to force a resize of the scrubber bar.
    // This ensures the playhead offset is correctly calculated for the UI differences when the stream is LIVE.
    if (this.state.forceResize !== prevState.forceResize) {
      this.setState({ forceResize: false });
    } else if (
      !prevState.forceResize &&
        this.props.isLiveStream !== prevProps.isLiveStream &&
        this.props.isLiveStream
    ) {
      this.setState({ forceResize: true });
    }
  }

  handleLiveClick(evt) {
    evt.stopPropagation();
    evt.cancelBubble = true;
    evt.preventDefault();
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
      'maxWidth': '70%',
    };
    const textClass = ClassNames({
      'oo-text-truncate': true,
    });
    const titleMetadata = (
      <div style={textStyle} className={textClass}>
        <span className={titleClass} style={titleStyle}>
          {this.props.contentTree.title}
        </span>
        : {this.props.contentTree.description}
      </div>
    );
    const liveText = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.LIVE,
      this.props.localizableStrings
    );

    let timeShift = this.props.currentPlayhead - this.props.duration;
    let isLiveNow = Math.abs(timeShift) < 1;
    let scrubberLeft = (<span className="oo-scrubber-bar-left oo-scrubber-bar-current-time">{this.props.playheadTime}</span>);
    let scrubberRight = (<span className="oo-scrubber-bar-right oo-scrubber-bar-duration">{this.props.totalTime}</span>);
    if (this.props.isLiveStream) {
      let dvrText = isLiveNow ? '--:--' : this.props.playheadTime;
      let liveClick = isLiveNow ? null : this.handleLiveClick;
      const liveClass = ClassNames({
        'oo-scrubber-bar-left oo-live oo-live-indicator': true,
        'oo-live-nonclickable': liveClick,
      });
      scrubberLeft = (
        <a key={CONSTANTS.CONTROL_BAR_KEYS.LIVE} className={liveClass} ref="LiveButton" onClick={liveClick}>
          <div className="oo-live-circle" />
          <span className="oo-live-text">{liveText}</span></a>);
      scrubberRight = (<span className="oo-scrubber-bar-right oo-scrubber-bar-current-time">{dvrText}</span>);
    }

    // TODO: Consider multiple styling options for the control bar. We are restricted to a single row at this moment
    return (
      <div className="oo-state-screen-audio oo-flex-column-parent">
        <div className={infoPanelClass}>
          {titleMetadata}
        </div>
        <div className="oo-interactive-container">
          <ControlBar
            {...this.props}
            audioOnly={true}
            hideVolumeControls={true}
            hideScrubberBar={true}
            controlBarVisible={true}
            playerState={this.props.playerState}
            isLiveStream={this.props.isLiveStream}
            a11yControls={this.props.controller.accessibilityControls}
            clickToVolumeScreen={true}
          />
        </div>
        <div className="oo-interactive-container">
          <div className="oo-scrubber-bar-parent oo-flex-row-parent">
            {scrubberLeft}
            <ScrubberBar {...this.props}
              audioOnly={true}
              forceResize={this.state.forceResize}
            />
            {scrubberRight}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = AudioOnlyScreen;
