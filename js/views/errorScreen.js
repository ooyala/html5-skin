/** ******************************************************************
  ERROR SCREEN
*********************************************************************/
var React = require('react');
var ClassNames = require('classnames');
var CONSTANTS = require('../constants/constants');
var Utils = require('../components/utils');
var AccessibilityMixin = require('../mixins/accessibilityMixin');

var ErrorScreen = React.createClass({
  mixins: [AccessibilityMixin],

  render: function() {
    var errorTitle;
    var errorDescription;
    var errorAction;
    if (CONSTANTS.ERROR_MESSAGE.hasOwnProperty(this.props.errorCode.code)) {
      var errorAction = CONSTANTS.SKIN_TEXT.ERROR_ACTION;
      if (CONSTANTS.ERROR_MESSAGE[this.props.errorCode.code].action) {
        errorAction = CONSTANTS.ERROR_MESSAGE[this.props.errorCode.code].action;
      }

      errorTitle = Utils.getLocalizedString(
        this.props.language,
        CONSTANTS.ERROR_MESSAGE[this.props.errorCode.code].title,
        this.props.localizableStrings
      );

      errorDescription = Utils.getLocalizedString(
        this.props.language,
        CONSTANTS.ERROR_MESSAGE[this.props.errorCode.code].description,
        this.props.localizableStrings
      );

      // / TODO - need to make countdown functionality display for all languages
      var startTime = this.props.errorCode.flight_start_time;
      if (
        this.props.errorCode.code === CONSTANTS.ERROR_CODE.FUTURE &&
        this.props.language === CONSTANTS.LANGUAGE.ENGLISH &&
        startTime !== null &&
        !isNaN(startTime)
      ) {
        errorDescription =
          'This video will be available in ' + Utils.getStartCountdown(startTime * 1000 - Date.now());
      }
      errorAction = Utils.getLocalizedString(this.props.language, errorAction, this.props.localizableStrings);
    } else {
      errorDescription = Utils.getLocalizedString(
        this.props.language,
        CONSTANTS.SKIN_TEXT.UNKNOWN_ERROR,
        this.props.localizableStrings
      );
      errorTitle = null;
      errorAction = null;
    }

    var errorContentClass = ClassNames({
      'oo-error-content': true,
      'oo-center-block': true
    });

    return (
      <div className="oo-state-screen oo-error-screen">
        <div className={errorContentClass}>
          <div className="oo-error-title oo-text-uppercase">{errorTitle}</div>
          <div className="oo-error-description">{errorDescription}</div>
          <div className="oo-error-action oo-text-uppercase">{errorAction}</div>
        </div>
      </div>
    );
  }
});

ErrorScreen.propTypes = {
  controller: React.PropTypes.shape({
    state: React.PropTypes.shape({
      accessibilityControlsEnabled: React.PropTypes.bool.isRequired
    }).isRequired
  }).isRequired,
  errorCode: React.PropTypes.shape({
    code: React.PropTypes.string
  }).isRequired,
  language: React.PropTypes.string,
  localizableStrings: React.PropTypes.object
};

ErrorScreen.defaultProps = {
  controller: {
    state: {
      accessibilityControlsEnabled: true
    }
  }
};

module.exports = ErrorScreen;
