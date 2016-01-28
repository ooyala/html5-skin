/**
 * Panel component for video quality selection
 *
 * @module VideoQualityPanel
 */
var React = require('react');

var VideoQualityPanel = React.createClass({
  handleVideoQualityClick: function(bitrate) {
    var eventData = {
      "selectedBitrate": bitrate
    };
    this.props.controller.sendVideoQualityChangeEvent(eventData);
  },

  render: function() {
    //var availableBitrates  = this.props.videoQualityOptions.availableBitrates;

    return (
      <div className="quality-panel">
        Some video quality options here.
      </div>
    );
  }
});

VideoQualityPanel.propTypes = {
  videoQualityOptions: React.PropTypes.shape({
    availableBitrates: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      bitrate: React.PropTypes.number,
      label: React.PropTypes.string
    }))
  }),
  controller: React.PropTypes.shape({
    sendVideoQualityChangeEvent: React.PropTypes.func
  })
};

VideoQualityPanel.defaultProps = {
  skinConfig: {
    icons: {
      quality:{fontStyleClass:'icon icon-topmenu-quality'}
    }
  },
  videoQualityOptions: {
    availableBitrates: []
  },
  controller: {
    sendVideoQualityChangeEvent: function(a){}
  }
};

module.exports = VideoQualityPanel;