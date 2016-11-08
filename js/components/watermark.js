/**
 * Watermark component
 *
 * @module Watermark
 */
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    ClassNames = require('classnames');

var Watermark = React.createClass({

  handleWatermarkClick: function() {
    if (this.props.playerState == CONSTANTS.STATE.PLAYING){
        this.props.controller.togglePlayPause();
    }
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
      if (this.props.skinConfig.general.watermark.scalingOption == 'height') {
        watermarkStyle.height = this.props.skinConfig.general.watermark.scalingPercentage + '%';
        watermarkImageStyle.height = '100%';
      }
      else if (this.props.skinConfig.general.watermark.scalingOption == 'width') {
        watermarkStyle.width = this.props.skinConfig.general.watermark.scalingPercentage + '%';
        watermarkImageStyle.width = '100%';
      }
      else if (this.props.skinConfig.general.watermark.scalingOption == 'default') {
        watermarkStyle.width = CONSTANTS.WATERMARK.DEFAULT_SCALING_PERCENTAGE + '%';
        watermarkImageStyle.width = '100%';
      }
      else {
        watermarkStyle.width = 'auto';
      }
    }

    var watermarkPosition = this.props.skinConfig.general.watermark.position.toLowerCase();

    //the position from db passed with the metadata uses 'right' instead of 'centerRight', etc.
    if (watermarkPosition == 'left' || watermarkPosition == 'right') {
      watermarkPosition = 'center' + watermarkPosition;
    }
    if (watermarkPosition == 'bottom' || watermarkPosition == 'top') {
      watermarkPosition = watermarkPosition + 'center';
    }

    var watermarkClass = ClassNames({
      'oo-watermark-container': true,
      'oo-watermark-top': watermarkPosition.indexOf('top') > -1,
      'oo-watermark-bottom': watermarkPosition.indexOf('bottom') > -1,
      'oo-watermark-bottom-cb': this.props.controlBarVisible && watermarkPosition.indexOf('bottom') > -1,
      'oo-watermark-left': watermarkPosition.indexOf('left') > -1,
      'oo-watermark-right': watermarkPosition.indexOf('right') > -1,
      'oo-watermark-center-horizontal': watermarkPosition.indexOf('bottomcenter') > -1 || watermarkPosition.indexOf('topcenter') > -1,
      'oo-watermark-center-vertical': watermarkPosition.indexOf('centerright') > -1 || watermarkPosition.indexOf('centerleft') > -1
    });

  var watermarkImageClass = ClassNames({
    'oo-blur': this.props.nonClickable,
    'oo-watermark': true
  });

    var watermarkImage = <img className={watermarkImageClass} style={watermarkImageStyle} src={watermarkUrl} ref='watermarkImage'/>;
    if (this.props.nonClickable || !clickUrl)
      return (<div className={watermarkClass} ref='watermark' style={watermarkStyle}>{watermarkImage}</div>);
    else
      return (<a className={watermarkClass} ref='watermark' style={watermarkStyle} href={this.props.skinConfig.general.watermark.clickUrl}
            target={this.props.skinConfig.general.watermark.target} onClick={this.handleWatermarkClick}>{watermarkImage}</a>);
  }
});

Watermark.propTypes = {
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
        scalingPercentage: React.PropTypes.number,
        nonClickable: React.PropTypes.bool
      })
    })
  }),
  controller: React.PropTypes.shape({
    togglePlayPause: React.PropTypes.func,
  })
};

Watermark.defaultProps = {
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
        scalingPercentage: 10,
        nonClickable: false
      }
    }
  },
  controller: {
    togglePlayPause: function(){},
  }
};

module.exports = Watermark;