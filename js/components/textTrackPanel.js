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
      <div className="text-track-container">
        <div className="text-track-window">
          <div className="text-track-background">
            <div className="text-track">
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
    cueText: React.PropTypes.string
  })
};

TextTrackPanel.defaultProps = {
  closedCaptionOptions: {
    cueText: null
  }
};

module.exports = TextTrackPanel;