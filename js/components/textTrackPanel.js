/**
 * Display component for video text tracks
 *
 * @module TextTrackPanel
 */
var React = require('react');

var TextTrackPanel = React.createClass({

  render: function() {
    if (!this.props.text) {
      return null;
    }

    return (
      <div className="text-track-container">
        <div className="text-track-window">
          <div className="text-track-background">
            <div className="text-track">
              {this.props.text}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

TextTrackPanel.propTypes = {
  text: React.PropTypes.string
};

TextTrackPanel.defaultProps = {
  text: null
};

module.exports = TextTrackPanel;