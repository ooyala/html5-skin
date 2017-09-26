var React = require('react');
var DirectionControl = require('./directionControl');
var Icon = require('../components/icon');
var classnames = require('classnames');
var CONSTANTS = require('../constants/constants');
var _ = require('underscore');

var ViewControls = React.createClass({
  handleVRViewControlsClick: function(e, isRotated, direction) {
    if (e.type == 'touchend' || !this.props.controller.state.isMobile) {
      e.stopPropagation(); // W3C
      e.cancelBubble = true; // IE
      this.props.controller.state.accessibilityControlsEnabled = true;
    }
    this.props.controller.moveToDirection(isRotated, direction);
  },
  
  componentWillMount: function () {
    this.isMobile = false;
    this.vr = false;
    this.icon = {};
    
    if (this.props.controller) {
      if (this.props.controller.videoVrSource) {
        this.vr = this.props.controller.videoVrSource.vr;
      }
      
      if (this.props.controller.state) {
        this.isMobile = this.props.controller.state.isMobile;
      }
   
    
      if(!this.props.controller.state.isPlayingAd){
        if(!this.isMobile){
          var desktopContent = this.props.skinConfig.buttons.desktopContent;
          this.icon = _.find(desktopContent, function (el) {
            return el.location === "mainView";
          });
        }
      }
    }
  },
  
  render: function () {
    var isShow = this.icon && this.icon.name;
    
    return !isShow ? null :
      (<div className={classnames("oo-vr-icon-container view-controls", {"oo-vr-icon-container--hidden": !this.props.controlBarVisible})}>
        <div className={classnames("oo-vr-icon--substrate")}></div>
        <Icon {...this.props} icon={this.icon.name} className={classnames("oo-vr-icon--icon-symbol")}/>
        <DirectionControl {...this.props} handleVRViewControlsClick={this.handleVRViewControlsClick} dir="left"/>
        <DirectionControl {...this.props} handleVRViewControlsClick={this.handleVRViewControlsClick} dir="right"/>
        <DirectionControl {...this.props} handleVRViewControlsClick={this.handleVRViewControlsClick} dir="up"/>
        <DirectionControl {...this.props} handleVRViewControlsClick={this.handleVRViewControlsClick} dir="down"/>
      </div>);
  }
});

module.exports = ViewControls;