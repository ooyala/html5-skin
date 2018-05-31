var React = require('react');
var ClassNames = require('classnames');
var Utils = require('./utils');
var AccessibleButton = require('./accessibleButton');
var Icon = require('./icon');
var CONSTANTS = require('../constants/constants');

var Toolbar = React.createClass({

  setupItemStyle: function() {
    var returnStyles = {};

    returnStyles.iconCharacter = {
      color: this.props.skinConfig.controlBar.iconStyle.inactive.color,
      opacity: this.props.skinConfig.controlBar.iconStyle.inactive.opacity
    };
    return returnStyles;
  },

  onClick: function() {
    console.log(">>>>clickbait");
  },

  onSkipForward: function() {
    this.props.controls.seekBy(30, true);
  },

  onSkipBack: function() {
    this.props.controls.seekBy(30, false);
  },

  render: function() {

    var dynamicStyles = this.setupItemStyle();
    var className = ClassNames('oo-toolbar', { 'oo-hiddens': this.props.hidden });

    return (
      <div className={className}>
        <AccessibleButton className="oo-control-bar-item">
          <Icon {...this.props} icon="previousVideo" style={dynamicStyles.iconCharacter}/>
        </AccessibleButton>
        <AccessibleButton className="oo-control-bar-item oo-center-button" onClick={this.onSkipBack}>
          <Icon {...this.props} icon="replay" style={dynamicStyles.iconCharacter}/>
          <span className="oo-digit">30</span>
        </AccessibleButton>
        <AccessibleButton className="oo-control-bar-item oo-center-button" onClick={this.onSkipForward}>
          <Icon {...this.props} icon="skipForward" style={dynamicStyles.iconCharacter}/>
          <span className="oo-digit">30</span>
        </AccessibleButton>
        <AccessibleButton className="oo-control-bar-item" onClick={this.onClick}>
          <Icon {...this.props} icon="nextVideo" style={dynamicStyles.iconCharacter}/>
        </AccessibleButton>
      </div>
    );
  }
});


module.exports = Toolbar;
