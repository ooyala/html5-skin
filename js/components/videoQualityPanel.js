/**
 * Panel component for video quality selection
 *
 * @module VideoQualityPanel
 */
var React = require('react');
var MenuPanel = require('./menuPanel');
var classNames = require('classnames');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');
var Utils = require('../components/utils');
var CONSTANTS = require('../constants/constants');
var MACROS = require('../constants/macros');

var VideoQualityPanel = createReactClass({

  ref: React.createRef(),

  getInitialState: function() {
    var selectedValue = Utils.getPropertyValue(
      this.props,
      'videoQualityOptions.selectedBitrate.id',
      CONSTANTS.QUALITY_SELECTION.AUTO_QUALITY
    );

    return {
      selectedValue: selectedValue
    };
  },

  onMenuItemClick: function(itemValue) {
    this.props.controller.sendVideoQualityChangeEvent({
      id: itemValue
    });
    this.setState({
      selectedValue: itemValue
    });
  },

  getBitrateButtons: function() {
    var bitrateButtons = [];
    var availableBitrates = this.props.videoQualityOptions.availableBitrates;
    var label = '';
    var availableResolution = null;
    var availableBitrate = null;
    var qualityTextFormat =
      this.props.skinConfig.controlBar &&
      this.props.skinConfig.controlBar.qualitySelection &&
      this.props.skinConfig.controlBar.qualitySelection.format
        ? this.props.skinConfig.controlBar.qualitySelection.format
        : CONSTANTS.QUALITY_SELECTION.FORMAT.BITRATE;
    var showResolution = qualityTextFormat.indexOf(CONSTANTS.QUALITY_SELECTION.FORMAT.RESOLUTION) >= 0;
    var showBitrate = qualityTextFormat.indexOf(CONSTANTS.QUALITY_SELECTION.FORMAT.BITRATE) >= 0;
    var qualityText = null;
    var ariaLabel = null;
    var i = 0;
    var resolutions = {};
    var buttonCount = 0;

    if (showResolution) {
      // Group into buckets so we can assign quality tiers
      for (i = 0; i < availableBitrates.length; i++) {
        if (typeof availableBitrates[i].height === 'number') {
          if (!resolutions[availableBitrates[i].height]) {
            resolutions[availableBitrates[i].height] = [];
          }
          resolutions[availableBitrates[i].height].push(availableBitrates[i]);
        }
      }
      // sort by ascending bitrate
      for (var res in resolutions) {
        if (resolutions.hasOwnProperty(res)) {
          resolutions[res].sort(function(a, b) {
            return a.bitrate - b.bitrate;
          });
        }
      }
    }

    // available bitrates
    for (i = 0; i < availableBitrates.length; i++) {

      if (availableBitrates[i].id === CONSTANTS.QUALITY_SELECTION.AUTO_QUALITY) {
        bitrateButtons.unshift({
          value: CONSTANTS.QUALITY_SELECTION.AUTO_QUALITY,
          label: CONSTANTS.SKIN_TEXT.AUTO_QUALITY,
          ariaLabel: CONSTANTS.ARIA_LABELS.AUTO_QUALITY
        });
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
          var suffix = 'kbps';
          availableBitrate = Math.round(availableBitrates[i].bitrate / 1000);
          if (availableBitrate >= 1000) {
            availableBitrate = Math.round(availableBitrate / 10) / 100;
            suffix = 'mbps';
          }
          availableBitrate += ' ' + suffix;
        } else {
          availableBitrate = availableBitrates[i].bitrate;
        }

        if (showResolution && showBitrate && typeof availableResolution === 'number' && availableBitrate) {
          qualityText = CONSTANTS.QUALITY_SELECTION.TEXT.RESOLUTION_BITRATE;
        } else if (showBitrate && availableBitrate) {
          qualityText = CONSTANTS.QUALITY_SELECTION.TEXT.BITRATE_ONLY;
        } else if (showResolution && typeof availableResolution === 'number') {
          qualityText = CONSTANTS.QUALITY_SELECTION.TEXT.RESOLUTION_ONLY;
        }

        switch (qualityText) {
          case CONSTANTS.QUALITY_SELECTION.TEXT.RESOLUTION_BITRATE:
            label = qualityText
              .replace(MACROS.BITRATE, availableBitrate)
              .replace(MACROS.RESOLUTION, availableResolution);
            ariaLabel = label;
            break;
          case CONSTANTS.QUALITY_SELECTION.TEXT.RESOLUTION_ONLY:
            if (resolutions[availableResolution] && resolutions[availableResolution].length > 1) {
              var sameResolutionLength = resolutions[availableResolution].length;
              var tiering = null;
              if (sameResolutionLength === 2) {
                tiering = CONSTANTS.RESOLUTION_TIER.TWO;
              } else if (sameResolutionLength >= 3) {
                tiering = CONSTANTS.RESOLUTION_TIER.THREE;
              }
              if (tiering) {
                // We want to use top 3 resolutions if we are using 3 resolution tiers
                var resolutionIndex = resolutions[availableResolution].indexOf(availableBitrates[i]);
                var extraResolutionLength = resolutions[availableResolution].length - tiering.length;
                var trueResolutionIndex = resolutionIndex - extraResolutionLength;
                if (trueResolutionIndex >= 0 && trueResolutionIndex < tiering.length) {
                  qualityText = CONSTANTS.QUALITY_SELECTION.TEXT.TIERED_RESOLUTION_ONLY;
                  label = qualityText
                    .replace(MACROS.RESOLUTION, availableResolution)
                    .replace(MACROS.RESOLUTION_TIER, tiering[trueResolutionIndex]);
                }
              }
            } else {
              label = qualityText.replace(MACROS.RESOLUTION, availableResolution);
            }
            ariaLabel = label;
            break;
          case CONSTANTS.QUALITY_SELECTION.TEXT.BITRATE_ONLY:
            label = qualityText.replace(MACROS.BITRATE, availableBitrate);
            ariaLabel = label;
            break;
        }

        if (label) {
          bitrateButtons.push({
            value: availableBitrates[i].id,
            label: label,
            ariaLabel: ariaLabel
          });
        }
      }
    }
    return bitrateButtons;
  },

  render: function() {
    var menuItems = this.getBitrateButtons();

    var title = Utils.getLocalizedString(
      this.props.language,
      this.props.isPopover ? CONSTANTS.SKIN_TEXT.VIDEO_QUALITY : '',
      this.props.localizableStrings
    );

    var className = classNames({
      'oo-content-panel oo-quality-panel': !this.props.isPopover,
      'oo-quality-popover': this.props.isPopover
    });

    return (
      <MenuPanel
        ref={this.ref}
        className={className}
        contentClassName="oo-quality-screen-content"
        buttonClassName="oo-quality-btn"
        title={title}
        selectedValue={this.state.selectedValue}
        isPopover={this.props.isPopover}
        skinConfig={this.props.skinConfig}
        menuItems={menuItems}
        onMenuItemClick={this.onMenuItemClick}
        onClose={this.props.onClose} />
    );
  }
});

VideoQualityPanel.propTypes = {
  isPopover: PropTypes.bool,
  language: PropTypes.string.isRequired,
  localizableStrings: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  videoQualityOptions: PropTypes.shape({
    selectedBitrate: PropTypes.shape({
      id: PropTypes.string
    }).isRequired,
    availableBitrates: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        bitrate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string
      })
    ).isRequired
  }),
  skinConfig: PropTypes.shape({
    general: PropTypes.shape({
      accentColor: PropTypes.string
    }),
    controlBar: PropTypes.shape({
      qualitySelection: PropTypes.shape({
        format: PropTypes.string.isRequired
      })
    })
  }),
  controller: PropTypes.shape({
    sendVideoQualityChangeEvent: PropTypes.func
  })
};

module.exports = VideoQualityPanel;
