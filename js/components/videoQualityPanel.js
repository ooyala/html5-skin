/**
 * Panel component for video quality selection
 *
 * @module VideoQualityPanel
 */
var React = require('react'),
    ClassNames = require('classnames'),
    Icon = require('../components/icon');

var VideoQualityPanel = React.createClass({
  getInitialState: function() {
    return {
      selected: this.props.videoQualityOptions.selectedBitrate ? this.props.videoQualityOptions.selectedBitrate.id : 'auto'
    };
  },

  handleVideoQualityClick: function(selectedBitrateId, event) {
    event.preventDefault();
    var eventData = {
      "id": selectedBitrateId
    };
    this.props.controller.sendVideoQualityChangeEvent(eventData);
    this.setState({
      selected: selectedBitrateId
    });
    this.props.togglePopoverAction();
  },

  addAutoButton: function(bitrateButtons) {
    var autoQualityBtn = ClassNames({
      'oo-quality-auto-btn': true,
      'oo-selected': this.state.selected == 'auto'
    });

    //add auto btn to beginning of array
    bitrateButtons.unshift(
      <li className="oo-auto-li" key='auto-li'>
        <a className={autoQualityBtn} key='auto' onClick={this.handleVideoQualityClick.bind(this, 'auto')}>
          <div className="oo-quality-auto-icon">
            <Icon {...this.props} icon="auto"/>
          </div>
          <div className="oo-quality-auto-label">Auto</div>
        </a>
      </li>
    );
  },

  render: function() {
    var availableBitrates  = this.props.videoQualityOptions.availableBitrates;

    var bitrateButtons = [];

    //available bitrates
    for (var i = 0; i < availableBitrates.length; i++) {
      var qualityBtn = ClassNames({
        'oo-quality-btn': true,
        'oo-selected': this.state.selected == availableBitrates[i].id
      });

      if (availableBitrates[i].id == 'auto'){
        this.addAutoButton(bitrateButtons);
      }
      else {
        var label = Math.round(availableBitrates[i].bitrate/1000) + ' kbps';
        bitrateButtons.push(<li key={i}><a className={qualityBtn} key={i} onClick={this.handleVideoQualityClick.bind(this, availableBitrates[i].id)}>{label}</a></li>);
      }
    }

    return (
      <div className="oo-quality-panel">
        <ul>
          {bitrateButtons}
        </ul>
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
      quality:{fontStyleClass:'oo-icon oo-icon-topmenu-quality'}
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