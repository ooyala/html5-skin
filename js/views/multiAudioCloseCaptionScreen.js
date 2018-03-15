var React = require('react'),
  CloseButton = require('../components/closeButton'),
  Utils = require('../components/utils'),
  CONSTANTS = require('../constants/constants'),
  Icon = require('../components/icon'),
  Watermark = require('../components/watermark'),
  AccessibilityMixin = require('../mixins/accessibilityMixin');

var multiAudioCloseCaptionScreen = React.createClass({
  mixins: [AccessibilityMixin],

  componentDidMount: function() {
    if (this.props.autoFocus) {
      Utils.autoFocusFirstElement(this.domElement);
    }
  },

  /**
   * Handles the keydown event while the screen is active.
   * @private
   * @param {event} event description
   */
  handleKeyDown: function(event) {
    switch (event.key) {
      case CONSTANTS.KEY_VALUES.ESCAPE:
        this.handleClose();
      default:
        break;
    }
  },

  handleClose: function() {
    this.props.controller.toggleMultiAudio();
  },

  render: function() {
    return (
      <div
        onKeyDown={this.handleKeyDown}
        ref={function(e) { this.domElement = e; }.bind(this)}>
        <div className={this.props.screenClassName}>
          {this.props.children}
          <CloseButton {...this.props} closeAction={this.handleClose}/>
        </div>
      </div>
    );
  }
});

multiAudioCloseCaptionScreen.propTypes = {
  element: React.PropTypes.element,
  skinConfig: React.PropTypes.shape({
    discoveryScreen: React.PropTypes.shape({
      panelTitle: React.PropTypes.shape({
        titleFont: React.PropTypes.shape({
          color: React.PropTypes.string,
          fontFamily: React.PropTypes.string
        })
      })
    })
  })
};

multiAudioCloseCaptionScreen.defaultProps = {
  screen: CONSTANTS.SCREEN.SHARE_SCREEN,
  screenClassName: 'oo-content-screen',
  element: null,
  icon: 'share',
  controller: {
    toggleScreen: function(){},
    state: {
      accessibilityControlsEnabled: true
    }
  }
};

module.exports = multiAudioCloseCaptionScreen;
