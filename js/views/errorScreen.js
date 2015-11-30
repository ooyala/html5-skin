/********************************************************************
  ERROR SCREEN
*********************************************************************/
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    InlineStyle = require('../styles/inlineStyle'),
    Utils = require('../components/utils');

var ErrorScreen = React.createClass({
  componentDidMount: function () {
    this.props.controller.state.accessibilityControlsEnabled = false;
  },

  render: function() {
    var errorTitle, errorDescription, errorAction;
    if (CONSTANTS.ERROR_MESSAGE.hasOwnProperty(this.props.errorCode.code)){
      errorTitle = Utils.getLocalizedString(this.props.language, CONSTANTS.ERROR_MESSAGE[this.props.errorCode.code].title, this.props.localizableStrings)
      errorDescription = Utils.getLocalizedString(this.props.language, CONSTANTS.ERROR_MESSAGE[this.props.errorCode.code].description, this.props.localizableStrings);
      errorAction = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.ERROR_ACTION, this.props.localizableStrings);
      InlineStyle.errorScreenStyle.contentStyle.textAlign = "left";
    }
    else {
      errorTitle = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.UNKNOWN_ERROR, this.props.localizableStrings);
      errorDescription = null;
      errorAction = null;
      InlineStyle.errorScreenStyle.contentStyle.textAlign = "center";
    }

    var screenStyle = this.props.style;

    return (
      <div className="errorScreen" style={screenStyle.style}>
        <div style={screenStyle.contentStyle}>
          <div className="errorTitle" style={screenStyle.titleStyle}>{errorTitle}</div>
          <div className="errorDescription" style={screenStyle.descriptionStyle}>{errorDescription}</div>
          <div className="errorAction" style={screenStyle.actionStyle}>{errorAction}</div>
        </div>
      </div>
    );
  }
});
module.exports = ErrorScreen;