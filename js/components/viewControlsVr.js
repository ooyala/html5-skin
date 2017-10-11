var React = require('react');
var DirectionControlVr = require('./directionControlVr');
var Icon = require('../components/icon');
var classnames = require('classnames');
var _ = require('underscore');

var ViewControlsVr = React.createClass({
  /**
   *
   * @param e - event
   * @param isRotated {boolean} true - if need to rotate; false - stop rotation
   * @param direction {string} direction for rotation: "left", "right", "up", "down"
   */
  handleVrViewControlsClick: function(e, isRotated, direction) {
    if (e.type === "touchend" || !this.props.controller.state.isMobile) {
      e.stopPropagation(); // W3C
      e.cancelBubble = true; // IE
      this.props.controller.state.accessibilityControlsEnabled = true;
    }
    this.props.controller.moveVrToDirection(isRotated, direction);
  },

  componentWillMount: function () {
    this.isMobile = false;
    this.vr = null;
    this.icon = {};

    if (this.props.controller) {
      if (this.props.controller.videoVrSource) {
        this.vr = this.props.controller.videoVrSource.vr;
      }

      if (this.props.controller.state) {
        this.isMobile = this.props.controller.state.isMobile;
      }


      if (!this.props.controller.state.isPlayingAd) {
        if (!this.isMobile) {
          var desktopContent = this.props.skinConfig.buttons.desktopContent;
          this.icon = _.find(desktopContent, function (el) {
            return el.location === "mainView";
          });
        }
      }
    }
  },

  render: function () {
    var isShow = !!(this.icon && this.icon.name);

    return !isShow ? null :
      (<div className={classnames("oo-vr-icon-container view-controls", {"oo-vr-icon-container--hidden": !this.props.controlBarVisible})}>
        <div className={classnames("oo-vr-icon--substrate")}></div>
        <Icon {...this.props} icon={this.icon.name} className={classnames("oo-vr-icon--icon-symbol")}/>
        <DirectionControlVr {...this.props} handleVrViewControlsClick = {this.handleVrViewControlsClick} dir = "left"/>
        <DirectionControlVr {...this.props} handleVrViewControlsClick = {this.handleVrViewControlsClick} dir = "right"/>
        <DirectionControlVr {...this.props} handleVrViewControlsClick = {this.handleVrViewControlsClick} dir = "up"/>
        <DirectionControlVr {...this.props} handleVrViewControlsClick = {this.handleVrViewControlsClick} dir = "down"/>
      </div>);
  }
});

ViewControlsVr.propTypes = {
  controller: React.PropTypes.shape({
    moveVrToDirection: React.PropTypes.func
  })
};

module.exports = ViewControlsVr;