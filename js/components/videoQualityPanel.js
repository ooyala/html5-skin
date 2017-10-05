/**
 * Panel component for video quality selection
 *
 * @module VideoQualityPanel
 */
var React = require('react'),
    ScrollArea = require('react-scrollbar/dist/no-css'),
    ClassNames = require('classnames'),
    Icon = require('../components/icon')
    CONSTANTS = require('../constants/constants');

var VideoQualityPanel = React.createClass({

  componentDidMount: function() {
    if (this.props.autoFocus && this.domElement) {
      var firstButton = this.domElement.querySelector('button');

      if (firstButton && typeof firstButton.focus === 'function') {
        firstButton.focus();
      }
    }
  },

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
    var isSelected = this.state.selected === 'auto';
    var autoQualityBtn = ClassNames({
      'oo-quality-auto-btn': true,
      'oo-selected': isSelected
    });
    var selectedBitrateStyle = {color: (this.props.skinConfig.general.accentColor && this.state.selected == 'auto') ? this.props.skinConfig.general.accentColor : null};

    //add auto btn to beginning of array
    bitrateButtons.unshift(
      <li className="oo-auto-li" key='auto-li'>
        <button
          className={autoQualityBtn}
          key="auto"
          tabIndex="0"
          aria-label={CONSTANTS.ARIA_LABELS.AUTO_QUALITY}
          aria-checked={isSelected}
          onClick={this.handleVideoQualityClick.bind(this, 'auto')}>
          <span className="oo-quality-auto-icon" style={selectedBitrateStyle}>
            <Icon {...this.props} icon="auto" />
          </span>
          <span className="oo-quality-auto-label" style={selectedBitrateStyle}>
            {CONSTANTS.SKIN_TEXT.AUTO_QUALITY}
          </span>
        </button>
      </li>
    );
  },

  render: function() {
    var availableBitrates  = this.props.videoQualityOptions.availableBitrates;
    var bitrateButtons = [];
    var isSelected = false;
    var label = '';

    //available bitrates
    for (var i = 0; i < availableBitrates.length; i++) {
      isSelected = this.state.selected === availableBitrates[i].id;

      var qualityBtn = ClassNames({
        'oo-quality-btn': true,
        'oo-selected': isSelected
      });
      var selectedBitrateStyle = {color: (this.props.skinConfig.general.accentColor && this.state.selected == availableBitrates[i].id) ? this.props.skinConfig.general.accentColor : null};

      if (availableBitrates[i].id == 'auto') {
        this.addAutoButton(bitrateButtons);
      } else {
        if (typeof availableBitrates[i].bitrate === 'number') {
          label = Math.round(availableBitrates[i].bitrate/1000) + ' kbps';
        } else {
          label = availableBitrates[i].bitrate;
        }
        bitrateButtons.push(
          <li key={i}>
            <button
              key={i}
              className={qualityBtn}
              style={selectedBitrateStyle}
              tabIndex="0"
              role="menuitemradio"
              aria-label={label}
              aria-checked={isSelected}
              onClick={this.handleVideoQualityClick.bind(this, availableBitrates[i].id)}>
              {label}
            </button>
          </li>
        );
      }
    }

    var qualityScreenClass = ClassNames({
      'oo-content-panel': !this.props.popover,
      'oo-quality-panel': !this.props.popover,
      'oo-quality-popover': this.props.popover,
      'oo-mobile-fullscreen': !this.props.popover && this.props.controller.state.isMobile && (this.props.controller.state.fullscreen || this.props.controller.state.isFullWindow)
    });

    return (
      <div
        className={qualityScreenClass}
        ref={function(e) { this.domElement = e; }.bind(this)}>
        <ScrollArea
          className="oo-quality-screen-content"
          speed={this.props.popover ? 0.6 : 1}
          horizontal={!this.props.popover}>
          <ul role="menu">
            {bitrateButtons}
          </ul>
        </ScrollArea>
      </div>
    );
  }
});

VideoQualityPanel.propTypes = {
  videoQualityOptions: React.PropTypes.shape({
    availableBitrates: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      bitrate: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      ]),
      label: React.PropTypes.string
    }))
  }),
  togglePopoverAction: React.PropTypes.func,
  controller: React.PropTypes.shape({
    sendVideoQualityChangeEvent: React.PropTypes.func
  })
};

VideoQualityPanel.defaultProps = {
  popover: false,
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
