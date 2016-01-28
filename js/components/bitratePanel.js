/**
 * Panel component for Bitrate selection
 *
 * @module BitratePanel
 */
var React = require('react');

var BitratePanel = React.createClass({
  handleBitrateClick: function(bitrate) {
    var eventData = {
      "selectedBitrate": bitrate
    };
    this.props.controller.sendBitrateChangeEvent(eventData);
  },

  render: function() {
    //var availableBitrates  = this.props.bitrateData.availableBitrates;

    return (
      <div className="bitrate-panel">
        <div className="bitrate-panel-title">
          Video Quality
          <span className={this.props.skinConfig.icons.quality.fontStyleClass}></span>
        </div>
      </div>
    );
  }
});

BitratePanel.propTypes = {
  bitrateData: React.PropTypes.shape({
    availableBitrates: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      bitrate: React.PropTypes.number,
      label: React.PropTypes.string
    }))
  }),
  controller: React.PropTypes.shape({
    sendBitrateChangeEvent: React.PropTypes.func
  })
};

BitratePanel.defaultProps = {
  skinConfig: {
    icons: {
      quality:{fontStyleClass:'icon icon-topmenu-quality'}
    }
  },
  bitrateData: {
    availableBitrates: []
  },
  controller: {
    sendBitrateChangeEvent: function(a){}
  }
};

module.exports = BitratePanel;