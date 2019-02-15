import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import DirectionControlVr from './directionControlVr';
import Icon from './icon';

/**
 * Controls for managing VR
 */
class ViewControlsVr extends React.Component {
  /**
   * @method ViewControlsVr#handleVrViewControlsClick
   * @public
   * @param {Event} event - event object
   * @param {boolean} isRotated - true - if need to rotate; false - stop rotation
   * @param {string} direction - direction for rotation: "left", "right", "up", "down"
   */
  handleVrViewControlsClick = (event, isRotated, direction) => {
    const { controller } = this.props;
    if (event.type === 'touchend' || !controller.state.isMobile) {
      event.stopPropagation(); // W3C
      controller.state.accessibilityControlsEnabled = true;
    }

    controller.moveVrToDirection(isRotated, direction);
  }

  /**
   * @method ViewControlsVr#setupIconSymbol
   * @private
   */
  setupIconSymbol = () => {
    const { skinConfig } = this.props;
    this.icon = skinConfig.buttons.desktopContent.find(el => el.location === 'mainView');
  }

  /**
   * @method ViewControlsVr#setupBackgroundSymbol
   * @private
   */
  setupBackgroundSymbol = () => {
    if (this.icon) {
      if (this.icon.name === 'arrowsBlack') {
        this.backgroundIcon = 'circleArrowsBlack';
      } else {
        this.backgroundIcon = 'circleArrowsWhite';
      }
    }
  }

  componentWillMount = () => {
    // if we have vr mode, and the device !== mobile, we need to add control element to the screen of the player.
    // control element is covered with icon from fonts
    this.isMobile = false;
    this.vr = null;
    this.icon = {};
    this.backgroundIcon = '';
    const { controller, skinConfig } = this.props;
    if (controller) {
      if (controller.videoVrSource) {
        this.vr = controller.videoVrSource.vr;
      }
      if (controller.state) {
        this.isMobile = controller.state.isMobile;
      }
      if (controller.state && !(controller.state.isPlayingAd || this.isMobile)) {
        if (
          !(
            skinConfig
            && skinConfig.buttons
            && Array.isArray(skinConfig.buttons.desktopContent)
          )
        ) {
          return;
        }

        this.setupIconSymbol();
        this.setupBackgroundSymbol();
      }
    }
  }

  render() {
    const isShowing = !!(this.icon && this.icon.name);
    const { controlBarVisible } = this.props;
    return !isShowing ? null : (
      <div
        className={classnames('oo-vr-icon-container view-controls', {
          'oo-vr-icon-container--hidden': !controlBarVisible,
        })}
      >
        <Icon {...this.props} icon={this.backgroundIcon} className={classnames('oo-vr-icon--substrate')} />
        <Icon {...this.props} icon={this.icon.name} className={classnames('oo-vr-icon--icon-symbol')} />
        <DirectionControlVr
          {...this.props}
          handleVrViewControlsClick={this.handleVrViewControlsClick}
          dir="left"
        />
        <DirectionControlVr
          {...this.props}
          handleVrViewControlsClick={this.handleVrViewControlsClick}
          dir="right"
        />
        <DirectionControlVr
          {...this.props}
          handleVrViewControlsClick={this.handleVrViewControlsClick}
          dir="up"
        />
        <DirectionControlVr
          {...this.props}
          handleVrViewControlsClick={this.handleVrViewControlsClick}
          dir="down"
        />
        <DirectionControlVr
          {...this.props}
          handleVrViewControlsClick={this.handleVrViewControlsClick}
          dir="init"
        />
      </div>
    );
  }
}

ViewControlsVr.propTypes = {
  controller: PropTypes.shape({
    moveVrToDirection: PropTypes.func,
  }),
};

ViewControlsVr.defaultProps = {
  controller: {
    moveVrToDirection: () => {},
  },
};

module.exports = ViewControlsVr;
