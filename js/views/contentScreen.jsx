import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import CloseButton from '../components/closeButton';
import Icon from '../components/icon';
import Watermark from '../components/watermark';
import Utils from '../components/utils';
import CONSTANTS from '../constants/constants';
/* eslint-disable react/destructuring-assignment */

/**
 * A wrapper over discovery, volume, CC etc. extended options screens
 */
class ContentScreen extends React.Component {
  componentDidMount() {
    this.props.controller.state.accessibilityControlsEnabled = false;
    if (this.props.autoFocus) {
      Utils.autoFocusFirstElement(this.domElement);
    }
  }

  /**
   * Keep in self properties DOM element where we're rendered in
   * @param {Object} ref - DOM element
   */
  storeRef = (ref) => {
    this.domElement = ref;
  }

  /**
   * Handles the keydown event while the screen is active.
   * @private
   * @param {event} event description
   */
  handleKeyDown = (event) => {
    if (event.key === CONSTANTS.KEY_VALUES.ESCAPE) {
      this.handleClose();
    }
  }

  /**
   * Proceed close content screen
   */
  handleClose = () => {
    switch (this.props.screen) {
      case CONSTANTS.SCREEN.DISCOVERY_SCREEN:
        this.props.controller.toggleDiscoveryScreen();
        break;
      case CONSTANTS.SCREEN.MULTI_AUDIO_SCREEN:
        this.props.controller.toggleMultiAudioScreen();
        break;
      default:
        this.props.controller.toggleScreen(this.props.screen);
    }
  }

  /**
   * manage accessibility
   */
  componentDidUnmount() {
    this.props.controller.state.accessibilityControlsEnabled = true;
  }

  render() {
    // overlay only for the closed captions screen. Needs to be different than the other screens because of closed caption preview.
    const closedCaptionOverlay = this.props.screen === CONSTANTS.SCREEN.CLOSED_CAPTION_SCREEN ? (
      <div className="oo-closed-caption-overlay" />
    ) : null;

    const titleBarStyle = {};
    if (this.props.screen === CONSTANTS.SCREEN.DISCOVERY_SCREEN) {
      titleBarStyle.fontFamily = Utils.getPropertyValue(
        this.props.skinConfig,
        'discoveryScreen.panelTitle.titleFont.fontFamily'
      );
      titleBarStyle.color = Utils.getPropertyValue(
        this.props.skinConfig,
        'discoveryScreen.panelTitle.titleFont.color'
      );
    }

    // localized title bar, show nothing if no title text
    const titleBar = this.props.titleText ? (
      <div className="oo-content-screen-title" style={titleBarStyle}>
        {Utils.getLocalizedString(this.props.language, this.props.titleText, this.props.localizableStrings)}
        {this.props.icon
          && <Icon {...this.props} icon={this.props.icon} />
        }
        {this.props.element}
      </div>
    ) : null;

    return (
      <div
        onKeyDown={this.handleKeyDown}
        ref={this.storeRef}
        role="presentation"
      >
        <Watermark {...this.props} controlBarVisible={false} nonClickable />
        <div className={classNames('oo-content-screen', this.props.screenClassName)}>
          {closedCaptionOverlay}
          <div className={this.props.titleBarClassName}>{titleBar}</div>
          {this.props.children}
          <CloseButton {...this.props} closeAction={this.handleClose} />
        </div>
      </div>
    );
  }
}

ContentScreen.propTypes = {
  controller: PropTypes.shape({
    toggleScreen: PropTypes.func,
    state: PropTypes.shape({
      accessibilityControlsEnabled: PropTypes.bool,
    }),
  }),
  element: PropTypes.element,
  icon: PropTypes.string,
  screen: PropTypes.string,
  skinConfig: PropTypes.shape({
    discoveryScreen: PropTypes.shape({
      panelTitle: PropTypes.shape({
        titleFont: PropTypes.shape({
          color: PropTypes.string,
          fontFamily: PropTypes.string,
        }),
      }),
    }),
  }).isRequired,
  titleBarClassName: PropTypes.string,
  titleText: PropTypes.string,
};

ContentScreen.defaultProps = {
  screen: CONSTANTS.SCREEN.SHARE_SCREEN,
  titleBarClassName: 'oo-content-screen-title-bar',
  titleText: '',
  element: null,
  icon: null,
  controller: {
    toggleScreen() {},
    state: {
      accessibilityControlsEnabled: true,
    },
  },
};

module.exports = ContentScreen;
