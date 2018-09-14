/*********************************************************************
  AUDIO ONLY SCREEN
*********************************************************************/
const React = require('react');
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
      animate: false
    };
  }

  render() {
    const titleStyle = {
      color: this.props.skinConfig.startScreen.titleFont.color
    };
    const infoPanelClass = ClassNames({
      'oo-state-screen-audio-title': true
    });
    const titleClass = ClassNames({
      'oo-state-screen-audio-info': true
    });
    const textStyle = {
      'maxWidth': '70%'
    };
    const textClass = ClassNames({
      'oo-text-truncate': true
    });
    const titleMetadata = (
      <div style={textStyle} className={textClass}>
        <span className={titleClass} style={titleStyle}>
          {this.props.contentTree.title}
        </span>
        : {this.props.contentTree.description}
      </div>
    );
    //TODO: Consider multiple styling options for the control bar. We are restricted to a single row at this moment
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
            <span className="oo-scrubber-bar-current-time">{this.props.playheadTime}</span>
            <ScrubberBar {...this.props}
              audioOnly={true}
            />
            <span className="oo-scrubber-bar-duration">{this.props.totalTime}</span>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = AudioOnlyScreen;