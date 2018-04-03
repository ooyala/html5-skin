var React = require('react');
var ClassNames = require('classnames');
var Utils = require('./utils');
var CONSTANTS = require('../constants/constants');
var ScrubberBar = require('./scrubberBar');
var AccessibleButton = require('./accessibleButton');
var Icon = require('./icon');

var Controls = React.createClass({

  getInitialState: function() {
    return {};
  },

  componentDidMount: function() {

  },

  handlePlayClick: function () {
    this.props.controller.togglePlayPause();
  },

  setupItemStyle: function () {
    var returnStyles = {};

    returnStyles.iconCharacter = {
      color: this.props.skinConfig.controlBar.iconStyle.inactive.color,
      opacity: this.props.skinConfig.controlBar.iconStyle.inactive.opacity

    };
    return returnStyles;
  },

  onMouseUp: function (evt) {
    if (this.props.playerState === CONSTANTS.STATE.PLAYING) {
      console.log(">>>what");
      //this.props.controller.startHideControlBarTimer();
    }
  },

  render: function() {
    var dynamicStyles = this.setupItemStyle();

    // if (!this.props.controlBarVisible) {
    //   return null;
    // };

    return (
      <div className="oo-controls" onMouseUp={this.onMouseUp}>
        <div className="oo-controls-row oo-top-row">
          <div className="oo-controls-row-item">
            <AccessibleButton
              className="oo-play-psause oo-control-bar-item"
              key="discovery"
              focusId={CONSTANTS.FOCUS_IDS.PLAY_PAUSE}>
              <Icon {...this.props} icon="discovery" style={dynamicStyles.iconCharacter} />
            </AccessibleButton>
            <AccessibleButton
              className="oo-play-psause oo-control-bar-item"
              key="discovery2"
              focusId={CONSTANTS.FOCUS_IDS.PLAY_PAUSE}>
              <Icon {...this.props} icon="share" style={dynamicStyles.iconCharacter} />
            </AccessibleButton>
          </div>
          <div className="oo-controls-row-item">
            <AccessibleButton
              className="oo-play-psause oo-control-bar-item"
              key="ellipsi2s"
              focusId={CONSTANTS.FOCUS_IDS.PLAY_PAUSE}>
              <Icon {...this.props} icon="quality" style={dynamicStyles.iconCharacter} />
            </AccessibleButton>
            <AccessibleButton
              className="oo-play-psause oo-control-bar-item"
              key="ellipsis"
              focusId={CONSTANTS.FOCUS_IDS.PLAY_PAUSE}>
              <Icon {...this.props} icon="ellipsis" style={dynamicStyles.iconCharacter} />
            </AccessibleButton>
          </div>
        </div>
        <div className="oo-controls-row oo-center-row">
          <AccessibleButton
            className="oo-play-pause oo-control-bar-item"
            key="playPause"
            focusId={CONSTANTS.FOCUS_IDS.PLAY_PAUSE}
            onClick={this.handlePlayClick}>
            <Icon {...this.props} icon={this.props.playerState === CONSTANTS.STATE.PLAYING ? 'pause' : 'play'} style={dynamicStyles.iconCharacter} />
          </AccessibleButton>
        </div>
        <div className="oo-controls-row oo-bottom-row">
          <div className="oo-controls-row-item">
            <AccessibleButton
              className="oo-play-psause oo-control-bar-item"
              key="butt"
              focusId={CONSTANTS.FOCUS_IDS.PLAY_PAUSE}>
              <Icon {...this.props} icon="volume" style={dynamicStyles.iconCharacter} />
            </AccessibleButton>
          </div>
          <ScrubberBar {...this.props} />
          <div className="oo-controls-row-item">
            <AccessibleButton
              className="oo-play-pasuse oo-control-bar-item"
              key="ock"
              focusId={CONSTANTS.FOCUS_IDS.PLAY_PAUSE}>
              <Icon {...this.props} icon="expand" style={dynamicStyles.iconCharacter} />
            </AccessibleButton>
          </div>
        </div>
      </div>
    );
  }

});


module.exports = Controls;
