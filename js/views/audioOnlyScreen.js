/*********************************************************************
  AUDIO ONLY SCREEN
*********************************************************************/
const React = require('React');
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
    var titleStyle = {
      color: this.props.skinConfig.startScreen.titleFont.color
    };
    var infoPanelClass = ClassNames({
      'oo-state-screen-audio-title': true,
      'oo-inactive': false,
      'oo-flex-column': true
    });
    var titleClass = ClassNames({
      'oo-state-screen-audio-info': true
    });
    var textStyle = {
      'max-width': '70%'
    };
    var textClass = ClassNames({
      'oo-text-truncate': true
    });
    var titleMetadata = (
      <div style={textStyle} className={textClass}>
        <span className={titleClass} style={titleStyle}>
          {this.props.contentTree.title}
        </span>
        : {this.props.contentTree.description}
      </div>
    );
    return (
      <div className="oo-state-screen-audio oo-flex-column-parent">
        <div className={infoPanelClass}>
          {titleMetadata}
        </div>
        <div className="oo-interactive-container oo-flex-column oo-flex-column-parent">
          <ControlBar
            {...this.props}
            audioOnly={true}
            equalSpacing={true}
            hideVolumeControls={true}
            hideScrubberBar={true}
            controlBarVisible={true}
            playerState={this.props.playerState}
            isLiveStream={this.props.isLiveStream}
            a11yControls={this.props.controller.accessibilityControls}
            clickToVolumeScreen={true}
          />
        </div>
        <div className="oo-interactive-container oo-flex-column">
          <div className="oo-scrubber-bar-parent oo-flex-row-parent">
            <span className="oo-scrubber-bar-current-time">{this.props.getPlayheadTime()}</span>
            <ScrubberBar {...this.props}
              audioOnly={true}
            />
            <span className="oo-scrubber-bar-duration">{this.props.getTotalTime()}</span>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = AudioOnlyScreen;