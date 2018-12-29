/**
 * Panel component for video quality selection
 *
 * @module VideoQualityPanel
 */
const React = require('react');
const classNames = require('classnames');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const MenuPanel = require('./menuPanel');
const Utils = require('../components/utils');
const CONSTANTS = require('../constants/constants');
const MACROS = require('../constants/macros');

const VideoQualityPanel = createReactClass({

  ref: React.createRef(),

  getInitialState() {
    const selectedValue = Utils.getPropertyValue(
      this.props,
      'videoQualityOptions.selectedBitrate.id',
      CONSTANTS.QUALITY_SELECTION.AUTO_QUALITY
    );

    return {
      selectedValue,
    };
  },

  onMenuItemClick(itemValue) {
    this.props.controller.sendVideoQualityChangeEvent({
      id: itemValue,
    });
    this.setState({
      selectedValue: itemValue,
    });
  },

  getBitrateButtons() {
    const bitrateButtons = [];
    const availableBitrates = this.props.videoQualityOptions.availableBitrates;
    let label = '';
    let availableResolution = null;
    let availableBitrate = null;
    const qualityTextFormat = this.props.skinConfig.controlBar
      && this.props.skinConfig.controlBar.qualitySelection
      && this.props.skinConfig.controlBar.qualitySelection.format
      ? this.props.skinConfig.controlBar.qualitySelection.format
      : CONSTANTS.QUALITY_SELECTION.FORMAT.BITRATE;
    const showResolution = qualityTextFormat.indexOf(CONSTANTS.QUALITY_SELECTION.FORMAT.RESOLUTION) >= 0;
    const showBitrate = qualityTextFormat.indexOf(CONSTANTS.QUALITY_SELECTION.FORMAT.BITRATE) >= 0;
    let qualityText = null;
    let ariaLabel = null;
    let i = 0;
    const resolutions = {};
    const buttonCount = 0;

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
      for (const res in resolutions) {
        if (resolutions.hasOwnProperty(res)) {
          resolutions[res].sort((a, b) => a.bitrate - b.bitrate);
        }
      }
    }

    // available bitrates
    for (i = 0; i < availableBitrates.length; i++) {
      if (availableBitrates[i].id === CONSTANTS.QUALITY_SELECTION.AUTO_QUALITY) {
        bitrateButtons.unshift({
          value: CONSTANTS.QUALITY_SELECTION.AUTO_QUALITY,
          label: CONSTANTS.SKIN_TEXT.AUTO_QUALITY,
          ariaLabel: CONSTANTS.ARIA_LABELS.AUTO_QUALITY,
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
          let suffix = 'kbps';
          availableBitrate = Math.round(availableBitrates[i].bitrate / 1000);
          if (availableBitrate >= 1000) {
            availableBitrate = Math.round(availableBitrate / 10) / 100;
            suffix = 'mbps';
          }
          availableBitrate += ` ${suffix}`;
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
              const sameResolutionLength = resolutions[availableResolution].length;
              let tiering = null;
              if (sameResolutionLength === 2) {
                tiering = CONSTANTS.RESOLUTION_TIER.TWO;
              } else if (sameResolutionLength >= 3) {
                tiering = CONSTANTS.RESOLUTION_TIER.THREE;
              }
              if (tiering) {
                // We want to use top 3 resolutions if we are using 3 resolution tiers
                const resolutionIndex = resolutions[availableResolution].indexOf(availableBitrates[i]);
                const extraResolutionLength = resolutions[availableResolution].length - tiering.length;
                const trueResolutionIndex = resolutionIndex - extraResolutionLength;
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
            label,
            ariaLabel,
          });
        }
      }
    }
    return bitrateButtons;
  },

  render() {
    const menuItems = this.getBitrateButtons();

    const title = Utils.getLocalizedString(
      this.props.language,
      this.props.isPopover ? CONSTANTS.SKIN_TEXT.VIDEO_QUALITY : '',
      this.props.localizableStrings
    );

    const className = classNames({
      'oo-content-panel oo-quality-panel': !this.props.isPopover,
      'oo-quality-popover': this.props.isPopover,
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
        onClose={this.props.onClose}
      />
    );
  },
});

VideoQualityPanel.propTypes = {
  isPopover: PropTypes.bool,
  language: PropTypes.string.isRequired,
  localizableStrings: PropTypes.object.isRequired,
  onClose: PropTypes.func,
  videoQualityOptions: PropTypes.shape({
    selectedBitrate: PropTypes.shape({
      id: PropTypes.string,
    }).isRequired,
    availableBitrates: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        bitrate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
      })
    ).isRequired,
  }),
  skinConfig: PropTypes.shape({
    general: PropTypes.shape({
      accentColor: PropTypes.string,
    }),
    controlBar: PropTypes.shape({
      qualitySelection: PropTypes.shape({
        format: PropTypes.string.isRequired,
      }),
    }),
  }),
  controller: PropTypes.shape({
    sendVideoQualityChangeEvent: PropTypes.func,
  }),
};

module.exports = VideoQualityPanel;
