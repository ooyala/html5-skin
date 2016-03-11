/********************************************************************
  ERROR SCREEN
*********************************************************************/
var React = require('react'),
    ClassNames = require('classnames'),
    CONSTANTS = require('../constants/constants'),
    Utils = require('../components/utils'),
    AccessibilityMixin = require('../mixins/accessibilityMixin');

var ErrorScreen = React.createClass({
  mixins: [AccessibilityMixin],

  render: function() {
    var errorTitle, errorDescription, errorAction;
    if (CONSTANTS.ERROR_MESSAGE.hasOwnProperty(this.props.errorCode.code)){
      errorTitle = Utils.getLocalizedString(this.props.language, CONSTANTS.ERROR_MESSAGE[this.props.errorCode.code].title, this.props.localizableStrings)
      errorDescription = Utils.getLocalizedString(this.props.language, CONSTANTS.ERROR_MESSAGE[this.props.errorCode.code].description, this.props.localizableStrings);
      errorAction = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.ERROR_ACTION, this.props.localizableStrings);
    }
    else {
      errorDescription = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.UNKNOWN_ERROR, this.props.localizableStrings);
      errorTitle = null;
      errorAction = null;
    }

    var errorContentClass = ClassNames({
      'error-content': true,
      'center-block': true
    });

    return (
      <div className="state-screen errorScreen">
        <div className={errorContentClass}>
          <div className="error-title text-uppercase">{errorTitle}</div>
          <div className="error-description">{errorDescription}</div>
          <div className="error-action text-uppercase">{errorAction}</div>
        </div>
      </div>
    );
  }
});

ErrorScreen.defaultProps = {
  controller: {
    state: {
      accessibilityControlsEnabled: true
    }
  }
};

module.exports = ErrorScreen;