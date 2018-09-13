var React = require('react');
var Icon = require('../components/icon');
var classnames = require('classnames');
var _ = require('underscore');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

import { DirectionControlVr } from './directionControlVr';

var ViewControlsVr = createReactClass({
  /**
   * @method ViewControlsVr#handleVrViewControlsClick
   * @public
   * @param {Event} event - event object
   * @param {boolean} isRotated - true - if need to rotate; false - stop rotation
   * @param {string} direction - direction for rotation: "left", "right", "up", "down"
   */
  handleVrViewControlsClick: function(event, isRotated, direction) {
    if (event.type === 'touchend' || !this.props.controller.state.isMobile) {
      event.stopPropagation(); // W3C
      this.props.controller.state.accessibilityControlsEnabled = true;
    }

    this.props.controller.moveVrToDirection(isRotated, direction);
  },

  /**
   * @method ViewControlsVr#_setupIconSymbol
   * @private
   */
  _setupIconSymbol: function() {
    var desktopContent = this.props.skinConfig.buttons.desktopContent;
    this.icon = _.find(desktopContent, function(el) {
      return el.location === 'mainView';
    });
  },

  /**
   * @method ViewControlsVr#_setupBackgroundSymbol
   * @private
   */
  _setupBackgroundSymbol: function() {
    if (this.icon) {
      if (this.icon.name === 'arrowsBlack') {
        this.backgroundIcon = 'circleArrowsBlack';
      } else {
        this.backgroundIcon = 'circleArrowsWhite';
      }
    }
  },

  componentWillMount: function() {
    // if we have vr mode, and the device !== mobile, we need to add control element to the screen of the player.
    // control element is covered with icon from fonts
    this.isMobile = false;
    this.vr = null;
    this.icon = {};
    this.backgroundIcon = '';
    if (this.props.controller) {
      if (this.props.controller.videoVrSource) {
        this.vr = this.props.controller.videoVrSource.vr;
      }
      if (this.props.controller.state) {
        this.isMobile = this.props.controller.state.isMobile;
      }
      if (!(this.props.controller.state.isPlayingAd || this.isMobile)) {
        if (
          !(
            this.props.skinConfig &&
            this.props.skinConfig.buttons &&
            _.isArray(this.props.skinConfig.buttons.desktopContent)
          )
        ) {
          return;
        }

        this._setupIconSymbol();
        this._setupBackgroundSymbol();
      }
    }
  },

  render: function() {
    var isShowing = !!(this.icon && this.icon.name);

    return !isShowing ? null : (
      <div
        className={classnames('oo-vr-icon-container view-controls', {
          'oo-vr-icon-container--hidden': !this.props.controlBarVisible
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
});

ViewControlsVr.propTypes = {
  controller: PropTypes.shape({
    moveVrToDirection: PropTypes.func
  })
};

module.exports = ViewControlsVr;
