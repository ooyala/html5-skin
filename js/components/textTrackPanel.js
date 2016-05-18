/**
 * Display component for video text tracks
 *
 * @module TextTrackPanel
 */
var React = require('react');

var TextTrackPanel = React.createClass({

  colorMap: {
    "White": "255,255,255",
    "Blue": "0,0,255",
    "Magenta": "255,0,255",
    "Green": "0,255,0",
    "Yellow": "255,255,0",
    "Red": "255,0,0",
    "Cyan": "0,255,255",
    "Black": "0,0,0",
    "Transparent": "0,0,0"
  },

  fontTypeMap: {
    "Helvetica": "Arial, Helvetica, sans-serif",
    "Georgia": "Georgia, serif",
    "Comic Sans": "Comic Sans MS, cursive, sans-serif",
    "Impact": "Impact, Charcoal, sans-serif",
    "Times New Roman": "Times New Roman, Times, serif",
    "Tahoma": "Tahoma, Geneva, sans-serif",
    "Verdana": "Verdana, Geneva, sans-serif",
    "Courier New": "Courier New, Courier, monospace",
    "Lucida Console": "Lucida Console, Monaco, monospace"
  },

  fontSizeMap: {
    "Small": "16px",
    "Medium": "26px",
    "Large": "44px",
    "Extra Large": "64px"
  },

  setWindowBackgroundStyle: function(color, opacity) {
    if (color == "Transparent") opacity = 0;
    return {
      backgroundColor: "rgba(" + this.colorMap[color] + "," + opacity + ")"
    }
  },

  setTextStyle: function(color, opacity, fontType, fontSize) {
    return {
      color: "rgba(" + this.colorMap[color] + "," + opacity + ")",
      fontFamily: this.fontTypeMap[fontType],
      fontSize: this.fontSizeMap[fontSize]
    }
  },

  render: function() {
    if (!this.props.closedCaptionOptions.cueText) {
      return null;
    }

    return (
      <div className="oo-text-track-container">
        <div
          className={"oo-text-track-window"}
          style={
            this.setWindowBackgroundStyle(
              this.props.closedCaptionOptions.windowColor,
              this.props.closedCaptionOptions.windowOpacity
            )
          }
          >
          <div
            className={"oo-text-track-background"}
            style={
              this.setWindowBackgroundStyle(
                this.props.closedCaptionOptions.backgroundColor,
                this.props.closedCaptionOptions.backgroundOpacity
              )
            }
            >
            <div
              className={"oo-text-track"}
              style={
                this.setTextStyle(
                  this.props.closedCaptionOptions.textColor,
                  this.props.closedCaptionOptions.textOpacity,
                  this.props.closedCaptionOptions.fontType,
                  this.props.closedCaptionOptions.fontSize
                )
              }
              >
              {this.props.closedCaptionOptions.cueText}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

TextTrackPanel.propTypes = {
  closedCaptionOptions: React.PropTypes.shape({
    cueText: React.PropTypes.string,
    windowColor: React.PropTypes.string,
    backgroundColor: React.PropTypes.string,
    textColor: React.PropTypes.string,
    fontType: React.PropTypes.string
  })
};

TextTrackPanel.defaultProps = {
  closedCaptionOptions: {
    cueText: null,
    windowColor: null,
    backgroundColor: null,
    textColor: null,
    fontType: null
  }
};

module.exports = TextTrackPanel;