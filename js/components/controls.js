var React = require('react');
var classNames = require('classnames');
var Utils = require('./utils');
var CONSTANTS = require('../constants/constants');
var ScrubberBar = require('./scrubberBar');
var AccessibleButton = require('./accessibleButton');
var Icon = require('./icon');

var Controls = React.createClass({

  getInitialState: function() {
    var controlsConfig;

    if (this.props.params.controlsConfig) {
      controlsConfig = this.props.params.controlsConfig;
    } else {
      controlsConfig = {
        topRow: {
          left: ['discovery', 'share'],
          right: ['quality', 'ellipsis']
        },
        middleRow: {
          center: ['playPause']
        },
        bottomRow: {
          left: ['volume'],
          center: 'scrubberBar',
          right: ['expand']
        }
      };
    }

    return { controlsConfig: controlsConfig };
  },

  componentDidMount: function() {
    console.log(">>>frank show what", this.props);

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

  getButton: function(name) {
    var dynamicStyles = this.setupItemStyle();

    var icon = name;
    if (name === 'playPause') {
      icon = this.props.playerState === CONSTANTS.STATE.PLAYING ? 'pause' : 'play'
    }

    return (
      <AccessibleButton
        className={classNames("oo-control-bar-item", {
          "oo-play-pause": name === 'playPause'
        })}
        key={name}
        focusId={Date.now()}
        onClick={name === 'playPause' ? this.handlePlayClick : null}>
        <Icon {...this.props} icon={icon} style={dynamicStyles.iconCharacter} />
      </AccessibleButton>
    );
  },

  render: function() {
    // if (!this.props.controlBarVisible) {
    //   return null;
    // };

    return (
      <div className="oo-controls" onMouseUp={this.onMouseUp}>
        <div className="oo-controls-row oo-top-row">
          {
            this.state.controlsConfig.topRow.left === 'scrubberBar' ?
              <ScrubberBar {...this.props} />
            :
              <div className="oo-controls-row-item">
                {this.state.controlsConfig.topRow.left.map(function(buttonName) {
                  return this.getButton(buttonName);
                }, this)}
              </div>
          }
          {
            this.state.controlsConfig.topRow.right === 'scrubberBar' ?
              <ScrubberBar {...this.props} />
            :
              <div className="oo-controls-row-item">
                {this.state.controlsConfig.topRow.right.map(function(buttonName) {
                  return this.getButton(buttonName);
                }, this)}
              </div>
          }
        </div>
        <div className="oo-controls-row oo-center-row">
          {
            this.state.controlsConfig.middleRow.center === 'scrubberBar' ?
              <ScrubberBar {...this.props} />
            :
              <div className="oo-controls-row-item">
                {this.state.controlsConfig.middleRow.center.map(function(buttonName) {
                  return this.getButton(buttonName);
                }, this)}
              </div>
          }
        </div>
        <div className="oo-controls-row oo-bottom-row">
          {
            this.state.controlsConfig.bottomRow.left === 'scrubberBar' ?
              <ScrubberBar {...this.props} />
            :
              <div className="oo-controls-row-item">
                {this.state.controlsConfig.bottomRow.left.map(function(buttonName) {
                  return this.getButton(buttonName);
                }, this)}
              </div>
          }
          {
            this.state.controlsConfig.bottomRow.center === 'scrubberBar' ?
              <ScrubberBar {...this.props} />
            :
              <div className="oo-controls-row-item">
                {this.state.controlsConfig.bottomRow.center.map(function(buttonName) {
                  return this.getButton(buttonName);
                }, this)}
              </div>
          }
          {
            this.state.controlsConfig.bottomRow.right === 'scrubberBar' ?
              <ScrubberBar {...this.props} />
            :
              <div className="oo-controls-row-item">
                {this.state.controlsConfig.bottomRow.right.map(function(buttonName) {
                  return this.getButton(buttonName);
                }, this)}
              </div>
          }
        </div>
      </div>
    );
  }

});


module.exports = Controls;
