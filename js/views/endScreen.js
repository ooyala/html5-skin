/********************************************************************
  END SCREEN
*********************************************************************/
var React = require('react'),
    ClassNames = require('classnames'),
    ControlBar = require('../components/controlBar'),
    Icon = require('../components/icon');

var EndScreen = React.createClass({
  getInitialState: function() {
    return {
      controlBarVisible: true
    };
  },

  handleClick: function(event) {
    // pause or play the video if the skin is clicked
    event.preventDefault();
    this.props.controller.state.accessibilityControlsEnabled = true;
    this.props.controller.togglePlayPause();
  },

  render: function() {
    var actionIconStyle = {
      color: this.props.skinConfig.endScreen.replayIconStyle.color,
      opacity: this.props.skinConfig.endScreen.replayIconStyle.opacity
    };

    var actionIconClass = ClassNames({
      'oo-action-icon': true,
      'oo-hidden': !this.props.skinConfig.endScreen.showReplayButton
    });

    return (
      <div className="oo-state-screen oo-end-screen">
        <div className="oo-underlay-gradient"></div>

        <a className="oo-state-screen-selectable" onClick={this.handleClick}></a>

        <a className={actionIconClass} onClick={this.handleClick}>
          <Icon {...this.props} icon="replay" style={actionIconStyle}/>
        </a>

        <div className="oo-interactive-container">
          <ControlBar {...this.props}
            controlBarVisible={this.state.controlBarVisible}
            playerState={this.props.playerState}
            isLiveStream={this.props.isLiveStream} />
        </div>
      </div>
    );
  }
});
module.exports = EndScreen;