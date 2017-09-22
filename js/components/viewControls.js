var React = require('react');
var DirectionControl = require('./directionControl');
var Icon = require('../components/icon');
var classnames = require('classnames');
var CONSTANTS = require('../constants/constants');

var ViewControls = React.createClass({
  handleDirection: function (rotate, direction) {
    this.props.controller.moveToDirection(rotate, direction);
  },
  
  componentWillMount: function () {
    this.isMobile = false;
    this.vr = false;
    this.icon = {};
    
    if (this.props.controller) {
      if (this.props.controller.videoVrSource) {
        this.vr = this.props.controller.videoVrSource;
      }
      
      if (this.props.controller && this.props.controller.state) {
        this.isMobile = this.props.controller.state.isMobile;
      }
    }
    
    if(!this.props.controller.state.isPlayingAd){
      if(!this.isMobile){
        var desktopContent = this.props.skinConfig.buttons.desktopContent;
        this.icon = _.find(desktopContent, function (el) {
          return el.location === "mainView";
        });
      }
    }
  },
  
  render: function () {
    var actionIconStyle = {
      position: 'absolute',
      display: 'block',
      width: '100%',
      opacity: 1,
      'font-size': '40px',
      'line-height': '40px'
    };
    
    var isShow = this.icon && this.icon.name;
    var iconClass = classnames({
      "oo-vr-icon-dir": true
    });
    
    var content = <div className={classnames("oo-vr-icon-container view-controls", {"oo-vr-icon-container--hidden": !this.props.controlBarVisible})}>
                    <Icon {...this.props} icon={this.icon.name} style={actionIconStyle}/>
                    <DirectionControl {...this.props} handleDirection={this.handleDirection} dir="left"/>
                    <DirectionControl {...this.props} handleDirection={this.handleDirection} dir="right"/>
                    <DirectionControl {...this.props} handleDirection={this.handleDirection} dir="up"/>
                    <DirectionControl {...this.props} handleDirection={this.handleDirection} dir="down"/>
                  </div>;
                  
    
    return isShow ? content : null;
  }
});

module.exports = ViewControls;