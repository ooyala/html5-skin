var React = require('react'),
    CloseButton = require('../components/closeButton'),
    Utils = require('../components/utils'),
    CONSTANTS = require('../constants/constants'),
    Icon = require('../components/icon'),
    AccessibilityMixin = require('../mixins/accessibilityMixin');

var ContentScreen = React.createClass({
  mixins: [AccessibilityMixin],

  handleClose: function() {
    switch(this.props.screen) {
      case CONSTANTS.SCREEN.DISCOVERY_SCREEN:
        this.props.controller.toggleDiscoveryScreen();
        break;
      default:
        this.props.controller.toggleScreen(this.props.screen);
    }
  },

  render: function() {
    //localized title bar, show nothing if no title text
    var titleBar = this.props.titleText ? (
      <div className="oo-content-screen-title">
        {Utils.getLocalizedString(this.props.language, this.props.titleText, this.props.localizableStrings)} <Icon {...this.props} icon={this.props.icon}/>
      </div>
    ) :
    null;

    return (
      <div className={this.props.screenClassName}>
        <div className={this.props.titleBarClassName}>
          {titleBar}
          <CloseButton {...this.props} closeAction={this.handleClose}/>
        </div>

        {this.props.children}
      </div>
    );
  }
});

ContentScreen.propTypes = {};

ContentScreen.defaultProps = {
  screen: CONSTANTS.SCREEN.SHARE_SCREEN,
  screenClassName: 'oo-content-screen',
  titleBarClassName: 'oo-content-screen-title-bar',
  titleText: '',
  icon: 'share',
  controller: {
    toggleScreen: function(){},
    state: {
      accessibilityControlsEnabled: true
    }
  }
};

module.exports = ContentScreen;