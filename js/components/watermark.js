/**
 * Watermark component
 *
 * @module Watermark
 */
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    ClassNames = require('classnames'),
    Utils = require('./utils');

var Watermark = React.createClass({

  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return null;
  },

  handleMouseUp: function(event) {
    // handle watermark clicked on desktop
    if (!this.isMobile) {
      event.stopPropagation(); // W3C
      event.cancelBubble = true; // IE

      if (this.props.playerState == CONSTANTS.STATE.PLAYING){
        this.props.controller.togglePlayPause();
      }
      this.props.controller.state.accessibilityControlsEnabled = true;
      this.handleWatermarkClick();
    }
    // for mobile, touch is handled in handleTouchEnd
  },

  handleTouchEnd: function(event) {
    event.preventDefault();//to prevent mobile from propagating click to discovery shown on pause
    if (this.props.playerState == CONSTANTS.STATE.PLAYING){
        this.props.controller.togglePlayPause();
    }
    this.handleWatermarkClick();
  },

  handleWatermarkClick: function() {
    window.open(this.props.skinConfig.general.watermark.clickUrl, this.props.skinConfig.general.watermark.target);
  },

  render: function() {
    var watermarkUrl = this.props.skinConfig.general.watermark.imageResource.url;
    var clickUrl = this.props.skinConfig.general.watermark.clickUrl;

    if (!watermarkUrl) {
      return null;
    }
    else {
      var watermarkStyle = {};
      var watermarkImageStyle = {};
      watermarkStyle.opacity = this.props.skinConfig.general.watermark.transparency;
      if (this.props.skinConfig.general.watermark.scalingOption == "height") {
        watermarkStyle.height = this.props.skinConfig.general.watermark.scalingPercentage + '%';
        watermarkImageStyle.height = '100%';
      }
      else if (this.props.skinConfig.general.watermark.scalingOption == "width") {
        watermarkStyle.width = this.props.skinConfig.general.watermark.scalingPercentage + '%';
        watermarkImageStyle.width = '100%';
      }
      else if (this.props.skinConfig.general.watermark.scalingOption == "default") {
        watermarkStyle.width = CONSTANTS.WATERMARK.DEFAULT_SCALING_PERCENTAGE + '%';
        watermarkImageStyle.width = '100%';
      }
      else {
        watermarkStyle.width = 'auto';
      }
    }

    var watermarkClass = ClassNames({
      'oo-watermark-container': true,
      'oo-watermark-top': this.props.skinConfig.general.watermark.position.toLowerCase().indexOf("top") > -1,
      'oo-watermark-bottom': this.props.skinConfig.general.watermark.position.toLowerCase().indexOf("bottom") > -1,
      'oo-watermark-bottom-cb': this.props.controlBarVisible && (this.props.skinConfig.general.watermark.position.toLowerCase().indexOf("bottom") > -1),
      'oo-watermark-left': this.props.skinConfig.general.watermark.position.toLowerCase().indexOf("left") > -1,
      'oo-watermark-right': this.props.skinConfig.general.watermark.position.toLowerCase().indexOf("right") > -1,
      'oo-watermark-center-horizontal': this.props.skinConfig.general.watermark.position.toLowerCase().indexOf("bottomcenter") > -1 ||
        this.props.skinConfig.general.watermark.position.toLowerCase().indexOf("topcenter") > -1,
      'oo-watermark-center-vertical': this.props.skinConfig.general.watermark.position.toLowerCase().indexOf("centerright") > -1 ||
        this.props.skinConfig.general.watermark.position.toLowerCase().indexOf("centerleft") > -1
    });

    var watermarkImage = <img className="oo-watermark-image" style={watermarkImageStyle} src={watermarkUrl}/>;
    var watermarkClickableLayer = <img className="oo-watermark-clickable" style={watermarkImageStyle} src={watermarkUrl}/>;

    if (!this.props.clickableLayer) {
      return (<div className={watermarkClass} ref="watermark-image" style={watermarkStyle}>{watermarkImage}</div>);
    }
    else if (this.props.clickableLayer && clickUrl) {
      return (<div className={watermarkClass} ref="watermark-clickable" style={watermarkStyle}
              onMouseUp={this.handleMouseUp} onTouchEnd={this.handleTouchEnd}>{watermarkClickableLayer}</div>);
    }
    else return null;
  }
});

Watermark.propTypes = {
  clickableLayer: React.PropTypes.bool,
  controlBarVisible: React.PropTypes.bool,
  skinConfig: React.PropTypes.shape({
    general: React.PropTypes.shape({
      watermark: React.PropTypes.shape({
        imageResource: React.PropTypes.shape({
          url: React.PropTypes.string
        }),
        clickUrl: React.PropTypes.string,
        position: React.PropTypes.string,
        target: React.PropTypes.string,
        transparency: React.PropTypes.number,
        scalingOption: React.PropTypes.string,
        scalingPercentage: React.PropTypes.number
      })
    })
  }),
  controller: React.PropTypes.shape({
    togglePlayPause: React.PropTypes.func,
    state: React.PropTypes.shape({
      isMobile: React.PropTypes.bool
    })
  })
};

Watermark.defaultProps = {
  clickableLayer: false,
  controlBarVisible: false,
  skinConfig: {
    general: {
      watermark: {
        imageResource: {
          url: ''
        },
        clickUrl: '',
        position: 'bottomRight',
        target: '_blank',
        transparency: 1,
        scalingOption: 'default',
        scalingPercentage: 10
      }
    }
  },
  controller: {
    togglePlayPause: function(){},
    state: {
      isMobile: false
    }
  }
};

module.exports = Watermark;