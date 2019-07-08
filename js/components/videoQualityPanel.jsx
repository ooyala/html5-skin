import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import MenuPanel from './menuPanel';
import Utils from './utils';
import CONSTANTS from '../constants/constants';
import MACROS from '../constants/macros';

/**
 * Panel component for video quality selection
 */
class VideoQualityPanel extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      selectedValue: Utils.getPropertyValue(
        this.props,
        'videoQualityOptions.selectedBitrate.id',
        CONSTANTS.QUALITY_SELECTION.AUTO_QUALITY
      ),
    };
  }

  /**
   * Handle click on menu item
   * @param {string} itemValue the item value
   */
  onMenuItemClick = (itemValue) => {
    const { controller } = this.props;
    controller.sendVideoQualityChangeEvent({
      id: itemValue,
    });
    this.setState({
      selectedValue: itemValue,
    });
  }

  /**
   * Build list of buttons for various bitrates
   * @returns {Array} array of react components
   */
  getBitrateButtons = () => {
    const bitrateButtons = [];
    const { skinConfig, videoQualityOptions } = this.props;
    const { availableBitrates } = videoQualityOptions;
    let label = '';
    let availableResolution = null;
    let availableBitrate = null;
    const qualityTextFormat = skinConfig.controlBar
      && skinConfig.controlBar.qualitySelection
      && skinConfig.controlBar.qualitySelection.format
      ? skinConfig.controlBar.qualitySelection.format
      : CONSTANTS.QUALITY_SELECTION.FORMAT.BITRATE;
    const showResolution = qualityTextFormat.indexOf(CONSTANTS.QUALITY_SELECTION.FORMAT.RESOLUTION) >= 0;
    const showBitrate = qualityTextFormat.indexOf(CONSTANTS.QUALITY_SELECTION.FORMAT.BITRATE) >= 0;
    let qualityText = null;
    let ariaLabel = null;
    const resolutions = {};

    if (showResolution) {
      // Group into buckets so we can assign quality tiers
      availableBitrates.forEach((bitrate) => {
        if (typeof bitrate.height === 'number') {
          if (!resolutions[bitrate.height]) {
            resolutions[bitrate.height] = [];
          }
          resolutions[bitrate.height].push(bitrate);
        }
      });
      // sort by ascending bitrate
      Object.keys(resolutions).forEach((res) => {
        resolutions[res].sort((current, next) => current.bitrate - next.bitrate);
      });
    }

    // available bitrates
    const bitratePrecision = 1000;
    const three = 3;
    availableBitrates.forEach((bitrate) => {
      if (bitrate.id === CONSTANTS.QUALITY_SELECTION.AUTO_QUALITY) {
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

        if (typeof bitrate.height === 'number') {
          availableResolution = bitrate.height;
        }

        if (typeof bitrate.bitrate === 'number') {
          let suffix = 'kbps';
          availableBitrate = Math.round(bitrate.bitrate / bitratePrecision);
          if (availableBitrate >= bitratePrecision) {
            availableBitrate = Math.round(availableBitrate / 10) / 100;
            suffix = 'mbps';
          }
          availableBitrate += ` ${suffix}`;
        } else {
          availableBitrate = bitrate.bitrate;
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
              } else if (sameResolutionLength >= three) {
                tiering = CONSTANTS.RESOLUTION_TIER.THREE;
              }
              if (tiering) {
                // We want to use top 3 resolutions if we are using 3 resolution tiers
                const resolutionIndex = resolutions[availableResolution].indexOf(bitrate);
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
          default:
            /** do nothing */
        }

        if (label) {
          bitrateButtons.push({
            value: bitrate.id,
            label,
            ariaLabel,
          });
        }
      }
    });
    return bitrateButtons;
  }

  render() {
    const menuItems = this.getBitrateButtons();
    const {
      language,
      isPopover,
      skinConfig,
      onClose,
      localizableStrings,
    } = this.props;

    const title = Utils.getLocalizedString(
      language,
      isPopover ? CONSTANTS.SKIN_TEXT.VIDEO_QUALITY : '',
      localizableStrings
    );

    const className = classNames({
      'oo-content-panel oo-quality-panel': !isPopover,
      'oo-quality-popover': isPopover,
    });

    const { selectedValue } = this.state;

    return (
      <MenuPanel
        ref={this.ref}
        className={className}
        contentClassName="oo-quality-screen-content"
        buttonClassName="oo-quality-btn"
        title={title}
        selectedValue={selectedValue}
        isPopover={isPopover}
        skinConfig={skinConfig}
        menuItems={menuItems}
        onMenuItemClick={this.onMenuItemClick}
        onClose={onClose}
      />
    );
  }
}

VideoQualityPanel.propTypes = {
  isPopover: PropTypes.bool,
  language: PropTypes.string.isRequired,
  localizableStrings: PropTypes.shape({}).isRequired,
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

VideoQualityPanel.defaultProps = {
  isPopover: false,
  onClose: () => {},
  videoQualityOptions: {},
  skinConfig: {},
  controller: {},
};

module.exports = VideoQualityPanel;
