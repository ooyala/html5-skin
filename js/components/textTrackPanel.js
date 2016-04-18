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
        <div className="oo-text-track-window">
          <div className="oo-text-track-background">
            <div className="oo-text-track">
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