/********************************************************************
  ERROR SCREEN
*********************************************************************/

var ErrorScreen = React.createClass({

  render: function() {
    var errorTitle, errorDescription, errorAction;
    if (ERROR_MESSAGE.hasOwnProperty(this.props.errorCode.code)){
      errorTitle = ERROR_MESSAGE[this.props.errorCode.code].title;
      errorDescription = ERROR_MESSAGE[this.props.errorCode.code].description;
      errorAction = SKIN_TEXT.ERROR_ACTION;
      errorScreenStyle.contentStyle.textAlign = "left";
    }
    else {
      errorTitle = SKIN_TEXT.UNKNOWN_ERROR;
      errorDescription = null;
      errorAction = null;
      errorScreenStyle.contentStyle.textAlign = "center";
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