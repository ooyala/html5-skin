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
    var availableResolution = null;
    var availableBitrate = null;
    var wideFormat = false;
    var qualityTextFormat = this.props.skinConfig.controlBar && this.props.skinConfig.controlBar.qualitySelection ?
                            this.props.skinConfig.controlBar.qualitySelection.format : CONSTANTS.QUALITY_SELECTION.FORMAT.BITRATE;
    var showResolution = qualityTextFormat.indexOf(CONSTANTS.QUALITY_SELECTION.FORMAT.RESOLUTION) >= 0;
    var showBitrate = qualityTextFormat.indexOf(CONSTANTS.QUALITY_SELECTION.FORMAT.BITRATE) >= 0;
    var qualityText = null;
    var ariaLabel = null;

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
        label = null;
        availableResolution = null;
        availableBitrate = null;
        qualityText = null;
        ariaLabel = null;

        if (typeof availableBitrates[i].height === 'number') {
          availableResolution = availableBitrates[i].height;
        }

        if (typeof availableBitrates[i].bitrate === 'number') {
          availableBitrate = Math.round(availableBitrates[i].bitrate/1000) + ' kbps';
        } else {
          availableBitrate = availableBitrates[i].bitrate;
        }

        if (showResolution && showBitrate) {
          if (typeof availableResolution === 'number' && availableBitrate) {
            qualityText = CONSTANTS.QUALITY_SELECTION.TEXT.RESOLUTION_BITRATE;
          } else if (availableBitrate) {
            qualityText = CONSTANTS.QUALITY_SELECTION.TEXT.BITRATE_ONLY;
          } else if (typeof availableResolution === 'number') {
            qualityText = CONSTANTS.QUALITY_SELECTION.TEXT.RESOLUTION_ONLY;
          }
        } else if (showResolution && typeof availableResolution === 'number') {
          qualityText = CONSTANTS.QUALITY_SELECTION.TEXT.RESOLUTION_ONLY;
        } else if (showBitrate && availableBitrate) {
          qualityText = CONSTANTS.QUALITY_SELECTION.TEXT.BITRATE_ONLY;
        }

        switch(qualityText) {
          case CONSTANTS.QUALITY_SELECTION.TEXT.RESOLUTION_BITRATE:
            wideFormat = true;
            label = qualityText.replace(MACROS.BITRATE, availableBitrate).replace(MACROS.RESOLUTION, availableResolution);
            ariaLabel = label;
            break;
          case CONSTANTS.QUALITY_SELECTION.TEXT.RESOLUTION_ONLY:
            label = qualityText.replace(MACROS.RESOLUTION, availableResolution);
            ariaLabel = label;
            break;
          case CONSTANTS.QUALITY_SELECTION.TEXT.BITRATE_ONLY:
            label = qualityText.replace(MACROS.BITRATE, availableBitrate);
            ariaLabel = CONSTANTS.ARIA_LABELS.QUALITY_LEVEL.replace(MACROS.LEVEL, i).replace(MACROS.BITRATE, availableBitrate);
            break;
        }

        if (label) {
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
    }

    var qualityScreenClass = ClassNames({
      'oo-content-panel': !this.props.popover,
      'oo-quality-panel': !this.props.popover,
      'oo-quality-popover': this.props.popover,
      'oo-mobile-fullscreen': !this.props.popover && this.props.controller.state.isMobile && (this.props.controller.state.fullscreen || this.props.controller.state.isFullWindow)
    });

    var screenContentClass = ClassNames({
      'oo-quality-screen-content': true,
      'oo-quality-screen-content-wide': wideFormat
    });

    return (
      <div className={qualityScreenClass}>
        <ScrollArea
          className={screenContentClass}
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
