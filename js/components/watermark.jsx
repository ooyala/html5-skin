import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';

import Utils from './utils';
import CONSTANTS from '../constants/constants';

/**
 * Watermark component
 */
class Watermark extends React.Component {
  handleWatermarkClick = () => {
    const { controller, playerState } = this.props;
    if (playerState !== CONSTANTS.STATE.PLAYING) {
      return;
    }
    controller.togglePlayPause();
  }

  render() {
    const {
      controlBarVisible,
      nonClickable,
      skinConfig,
    } = this.props;
    const watermarkUrl = Utils.getPropertyValue(skinConfig, 'general.watermark.imageResource.url');
    const clickUrl = Utils.getPropertyValue(skinConfig, 'general.watermark.clickUrl');
    let watermarkPosition = Utils.getPropertyValue(skinConfig, 'general.watermark.position');

    const watermarkTarget = Utils.getPropertyValue(skinConfig, 'general.watermark.target', '_blank');
    const watermarkTransparency = Utils.getPropertyValue(
      skinConfig,
      'general.watermark.transparency',
      1
    );
    const watermarkScalingOption = Utils.getPropertyValue(
      skinConfig,
      'general.watermark.scalingOption',
      'default'
    );
    const watermarkScalingPercentage = Utils.getPropertyValue(
      skinConfig,
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
      'oo-watermark-bottom-cb': controlBarVisible && watermarkPosition.indexOf('bottom') > -1,
      'oo-watermark-left': watermarkPosition.indexOf('left') > -1,
      'oo-watermark-right': watermarkPosition.indexOf('right') > -1,
      'oo-watermark-center-horizontal':
        watermarkPosition.indexOf('bottomcenter') > -1 || watermarkPosition.indexOf('topcenter') > -1,
      'oo-watermark-center-vertical':
        watermarkPosition.indexOf('centerright') > -1 || watermarkPosition.indexOf('centerleft') > -1,
    });

    const watermarkImageClass = ClassNames({
      'oo-blur': nonClickable,
      'oo-watermark': true,
    });

    const watermarkImage = (
      <img
        className={watermarkImageClass}
        style={watermarkImageStyle}
        src={watermarkUrl}
        ref="watermarkImage" // eslint-disable-line
        alt="watermark"
      />
    );
    if (nonClickable || !clickUrl) {
      return (
        <div
          className={watermarkClass}
          ref="watermark" // eslint-disable-line
          style={watermarkStyle}
        >
          {watermarkImage}
        </div>
      );
    }
    return (
      <a
        className={watermarkClass}
        ref="watermark" // eslint-disable-line
        style={watermarkStyle}
        href={skinConfig.general.watermark.clickUrl}
        target={watermarkTarget}
        onClick={this.handleWatermarkClick}
      >
        {watermarkImage}
      </a>
    );
  }
}

Watermark.propTypes = {
  nonClickable: PropTypes.bool,
  playerState: PropTypes.string,
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
  nonClickable: true,
  playerState: CONSTANTS.STATE.PAUSE,
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
