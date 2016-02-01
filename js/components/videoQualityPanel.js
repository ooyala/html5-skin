/**
 * Panel component for video quality selection
 *
 * @module VideoQualityPanel
 */
var React = require('react'),
    ClassNames = require('classnames');

var VideoQualityPanel = React.createClass({
  getInitialState: function() {
    return {
      selected: this.props.videoQualityOptions.selectedBitrate ? this.props.videoQualityOptions.selectedBitrate.id : 'auto'
    };
  },

  handleVideoQualityClick: function(selectedBitrateId) {
    var eventData = {
      "id": selectedBitrateId
    };
    this.props.controller.sendVideoQualityChangeEvent(eventData);
    this.setState({
      selected: selectedBitrateId
    });
    this.props.togglePopoverAction();
  },

  render: function() {
    var availableBitrates  = this.props.videoQualityOptions.availableBitrates;

    var bitrateButtons = [];

    //auto btn
    var autoQualityBtn = ClassNames({
      'quality-btn': true,
      'selected': this.state.selected == 'auto'
    });
    bitrateButtons.push(
      <button className={autoQualityBtn} key='auto' onClick={this.handleVideoQualityClick.bind(this, 'auto')}>Auto</button>
    );

    //available bitrates
    for (var i = 0; i < availableBitrates.length; i++) {
      var qualityBtn = ClassNames({
        'quality-btn': true,
        'selected': this.state.selected == availableBitrates[i].id
      });

      bitrateButtons.push(<button className={qualityBtn} key={i} onClick={this.handleVideoQualityClick.bind(this, availableBitrates[i].id)}>{availableBitrates[i].label}</button>);
    }

    return (
      <div className="quality-panel">
        {bitrateButtons}
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
  togglePopoverAction: React.PropTypes.func,
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
  togglePopoverAction: function(){},
  controller: {
    sendVideoQualityChangeEvent: function(a){}
  }
};

module.exports = VideoQualityPanel;