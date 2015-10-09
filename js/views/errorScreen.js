/********************************************************************
  ERROR SCREEN
*********************************************************************/
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    InlineStyle = require('../styles/inlineStyle');

var ErrorScreen = React.createClass({
  componentDidMount: function () {
    this.props.controller.state.accessibilityControlsEnabled = false;
  },

  render: function() {
    var errorTitle, errorDescription, errorAction;
    if (CONSTANTS.ERROR_MESSAGE.hasOwnProperty(this.props.errorCode.code)){
      errorTitle = CONSTANTS.ERROR_MESSAGE[this.props.errorCode.code].title;
      errorDescription = CONSTANTS.ERROR_MESSAGE[this.props.errorCode.code].description;
      errorAction = CONSTANTS.SKIN_TEXT.ERROR_ACTION;
      InlineStyle.errorScreenStyle.contentStyle.textAlign = "left";
    }
    else {
      errorTitle = CONSTANTS.SKIN_TEXT.UNKNOWN_ERROR;
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