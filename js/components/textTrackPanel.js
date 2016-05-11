/**
 * Display component for video text tracks
 *
 * @module TextTrackPanel
 */
var React = require('react');

var TextTrackPanel = React.createClass({

  render: function() {
    if (!this.props.closedCaptionOptions.cueText) {
      return null;
    }

    return (
      <div className="oo-text-track-container">
        <div className={"oo-text-track-window oo-text-track-window-color-" + this.props.closedCaptionOptions.windowColor}>
          <div className={"oo-text-track-background oo-text-track-background-color-" + this.props.closedCaptionOptions.backgroundColor}>
            <div className={"oo-text-track oo-text-track-text-color-" + this.props.closedCaptionOptions.textColor}>
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
    textColor: React.PropTypes.string
  })
};

TextTrackPanel.defaultProps = {
  closedCaptionOptions: {
    cueText: null,
    windowColor: null,
    backgroundColor: null,
    textColor: null
  }
};

module.exports = TextTrackPanel;