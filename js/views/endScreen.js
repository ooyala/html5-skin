/********************************************************************
  END SCREEN
*********************************************************************/
var React = require('react'),
    ClassNames = require('classnames'),
    ControlBar = require('../components/controlBar'),
    ScrubberBar = require('../components/scrubberBar'),
    ResizeMixin = require('../mixins/resizeMixin');

var EndScreen = React.createClass({
  mixins: [ResizeMixin],

  getInitialState: function() {
    return {
      controlBarVisible: true,
      controlBarWidth: 0
    };
  },

  componentDidMount: function() {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});
  },

  handleResize: function() {
    if (this.isMounted()) {
      this.setState({controlBarWidth: this.getDOMNode().clientWidth});
    }
  },

  handleClick: function(event) {
    // pause or play the video if the skin is clicked
    event.preventDefault();
    this.props.controller.state.accessibilityControlsEnabled = true;
    this.props.controller.togglePlayPause();
    if (this.props.controller.state.volumeState.volumeSliderVisible) {
      this.props.controller.hideVolumeSliderBar();
    }
  },

  render: function() {
    var actionIconStyle = {
      color: this.props.skinConfig.endScreen.replayIconStyle.color,
      opacity: this.props.skinConfig.endScreen.replayIconStyle.opacity
    };

    var actionIconClass = ClassNames({
      'action-icon': true,
      'hidden': !this.props.skinConfig.endScreen.showReplayButton
    });

    return (
    <div className="state-screen endScreen">
      <div className="underlay-gradient"></div>

      <a className="state-screen-selectable" onClick={this.handleClick}></a>

      <a className={actionIconClass} onClick={this.handleClick}>
          <span className={this.props.skinConfig.icons.replay.fontStyleClass}
                style={actionIconStyle}
                aria-hidden="true"></span>
      </a>

      <ScrubberBar {...this.props} 
        controlBarVisible={this.state.controlBarVisible} 
        controlBarWidth={this.state.controlBarWidth} />

      <ControlBar {...this.props} 
        controlBarVisible={this.state.controlBarVisible}
        controlBarWidth={this.state.controlBarWidth}
        playerState={this.props.playerState}
        authorization={this.props.authorization} />
    </div>
    );
  }
});
module.exports = EndScreen;