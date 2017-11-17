/**
 * Panel component for video quality selection
 *
 * @module VideoQualityPanel
 */
var React = require('react'),
    ScrollArea = require('react-scrollbar/dist/no-css'),
    ClassNames = require('classnames'),
    AccessibleMenu = require('../components/higher-order/accessibleMenu'),
    AccessibleButton = require('../components/accessibleButton'),
    Icon = require('../components/icon'),
    Utils = require('../components/utils'),
    MACROS = require('../constants/macros'),
    CONSTANTS = require('../constants/constants');

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
    this.props.closeAction({
      restoreToggleButtonFocus: true
    });
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
      <li className="oo-auto-li" key='auto-li' role="presentation">
        <AccessibleButton
          className={autoQualityBtn}
          key="auto"
          focusId={CONSTANTS.FOCUS_IDS.AUTO_QUALITY}
          role={CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO}
          ariaLabel={CONSTANTS.ARIA_LABELS.AUTO_QUALITY}
          ariaChecked={isSelected}
          onClick={this.handleVideoQualityClick.bind(this, 'auto')}>
          <span className="oo-quality-auto-icon" style={selectedBitrateStyle}>
            <Icon {...this.props} icon="auto" />
          </span>
          <span className="oo-quality-auto-label" style={selectedBitrateStyle}>
            {CONSTANTS.SKIN_TEXT.AUTO_QUALITY}
          </span>
        </AccessibleButton>
      </li>
    );
  },

  render: function() {
    var availableBitrates  = this.props.videoQualityOptions.availableBitrates;
    var bitrateButtons = [];
    var isSelected = false;
    var label = '';
    var suffix = '';
    var resolutionAvailable = false;

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
        label = '';
        suffix = '';
        resolutionAvailable = false;

        if (typeof availableBitrates[i].height === 'number') {
          resolutionAvailable = true;
          label += availableBitrates[i].height + 'p (';
          suffix = ')';
        }

        if (typeof availableBitrates[i].bitrate === 'number') {
          label += Math.round(availableBitrates[i].bitrate/1000) + ' kbps';
        } else {
          label += availableBitrates[i].bitrate;
        }

        label += suffix;

        var ariaLabel = resolutionAvailable ? label : CONSTANTS.ARIA_LABELS.QUALITY_LEVEL.replace(MACROS.LEVEL, i).replace(MACROS.QUALITY, label);
        bitrateButtons.push(
          <li key={i} role="presentation">
            <AccessibleButton
              key={i}
              className={qualityBtn}
              style={selectedBitrateStyle}
              focusId={CONSTANTS.FOCUS_IDS.QUALITY_LEVEL + i}
              role={CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO}
              ariaLabel={ariaLabel}
              ariaChecked={isSelected}
              onClick={this.handleVideoQualityClick.bind(this, availableBitrates[i].id)}>
              {label}
            </AccessibleButton>
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
      <div className={qualityScreenClass}>
        <ScrollArea
          className="oo-quality-screen-content"
          speed={this.props.popover ? 0.6 : 1}
          horizontal={!this.props.popover}>
          <ul
            ref={function(e) { this.menuDomElement = e; }.bind(this)}
            role="menu">
            {bitrateButtons}
          </ul>
        </ScrollArea>
      </div>
    );
  }
});

// Extend with AccessibleMenu features
VideoQualityPanel = AccessibleMenu(VideoQualityPanel);

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
  closeAction: React.PropTypes.func,
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
  closeAction: function() {},
  controller: {
    sendVideoQualityChangeEvent: function(a){}
  }
};

module.exports = VideoQualityPanel;
