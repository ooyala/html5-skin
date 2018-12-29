/**
 * Watermark component
 *
 * @module Watermark
 */
const React = require('react');


const ClassNames = require('classnames');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const Utils = require('../components/utils');
const CONSTANTS = require('../constants/constants');

const Watermark = createReactClass({
  handleWatermarkClick() {
    if (this.props.playerState === CONSTANTS.STATE.PLAYING) {
      this.props.controller.togglePlayPause();
    }
  },

  render() {
    const watermarkUrl = Utils.getPropertyValue(this.props.skinConfig, 'general.watermark.imageResource.url');
    const clickUrl = Utils.getPropertyValue(this.props.skinConfig, 'general.watermark.clickUrl');
    let watermarkPosition = Utils.getPropertyValue(this.props.skinConfig, 'general.watermark.position');

    const watermarkTarget = Utils.getPropertyValue(this.props.skinConfig, 'general.watermark.target', '_blank');
    const watermarkTransparency = Utils.getPropertyValue(
      this.props.skinConfig,
      'general.watermark.transparency',
      1
    );
    const watermarkScalingOption = Utils.getPropertyValue(
      this.props.skinConfig,
      'general.watermark.scalingOption',
      'default'
    );
    const watermarkScalingPercentage = Utils.getPropertyValue(
      this.props.skinConfig,
      'general.watermark.scalingPercentage'
    );

    if (!watermarkUrl || !watermarkPosition) {
      return null;
    }
    const watermarkStyle = {};
    const watermarkImageStyle = {};
    watermarkStyle.opacity = watermarkTransparency;
    if (watermarkScalingOption === 'height') {
      watermarkStyle.height = `${watermarkScalingPercentage}%`;
      watermarkImageStyle.height = '100%';
    } else if (watermarkScalingOption === 'width') {
      watermarkStyle.width = `${watermarkScalingPercentage}%`;
      watermarkImageStyle.width = '100%';
    } else if (watermarkScalingOption === 'default') {
      watermarkStyle.width = `${CONSTANTS.WATERMARK.DEFAULT_SCALING_PERCENTAGE}%`;
      watermarkImageStyle.width = '100%';
    } else {
      watermarkStyle.width = 'auto';
    }


    watermarkPosition = watermarkPosition.toLowerCase();

    // the position from db passed with the metadata uses 'right' instead of 'centerRight', etc.
    if (watermarkPosition === 'left' || watermarkPosition === 'right') {
      watermarkPosition = `center${watermarkPosition}`;
    }
    if (watermarkPosition === 'bottom' || watermarkPosition === 'top') {
      watermarkPosition += 'center';
    }

    const watermarkClass = ClassNames({
      'oo-watermark-container': true,
      'oo-watermark-no-clickURL': !clickUrl,
      'oo-watermark-top': watermarkPosition.indexOf('top') > -1,
      'oo-watermark-bottom': watermarkPosition.indexOf('bottom') > -1,
      'oo-watermark-bottom-cb': this.props.controlBarVisible && watermarkPosition.indexOf('bottom') > -1,
      'oo-watermark-left': watermarkPosition.indexOf('left') > -1,
      'oo-watermark-right': watermarkPosition.indexOf('right') > -1,
      'oo-watermark-center-horizontal':
        watermarkPosition.indexOf('bottomcenter') > -1 || watermarkPosition.indexOf('topcenter') > -1,
      'oo-watermark-center-vertical':
        watermarkPosition.indexOf('centerright') > -1 || watermarkPosition.indexOf('centerleft') > -1,
    });

    const watermarkImageClass = ClassNames({
      'oo-blur': this.props.nonClickable,
      'oo-watermark': true,
    });

    const watermarkImage = (
      <img
        className={watermarkImageClass}
        style={watermarkImageStyle}
        src={watermarkUrl}
        ref="watermarkImage"
      />
    );
    if (this.props.nonClickable || !clickUrl) {
      return (
        <div className={watermarkClass} ref="watermark" style={watermarkStyle}>
          {watermarkImage}
        </div>
      );
    }
    return (
      <a
        className={watermarkClass}
        ref="watermark"
        style={watermarkStyle}
        href={this.props.skinConfig.general.watermark.clickUrl}
        target={watermarkTarget}
        onClick={this.handleWatermarkClick}
      >
        {watermarkImage}
      </a>
    );
  },
});

Watermark.propTypes = {
  controlBarVisible: PropTypes.bool,
  skinConfig: PropTypes.shape({
    general: PropTypes.shape({
      watermark: PropTypes.shape({
        imageResource: PropTypes.shape({
          url: PropTypes.string,
        }),
        clickUrl: PropTypes.string,
        position: PropTypes.string,
        target: PropTypes.string,
        transparency: PropTypes.number,
        scalingOption: PropTypes.string,
        scalingPercentage: PropTypes.number,
        nonClickable: PropTypes.bool,
      }),
    }),
  }),
  controller: PropTypes.shape({
    togglePlayPause: PropTypes.func,
  }),
};

Watermark.defaultProps = {
  controlBarVisible: false,
  skinConfig: {
    general: {
      watermark: {
        imageResource: {
          url: '',
        },
        clickUrl: '',
        position: 'bottomRight',
        target: '_blank',
        transparency: 1,
        scalingOption: 'default',
        scalingPercentage: 10,
        nonClickable: false,
      },
    },
  },
  controller: {
    togglePlayPause() {},
  },
};

module.exports = Watermark;
