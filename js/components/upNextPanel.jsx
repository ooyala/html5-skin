import React from 'react';
import PropTypes from 'prop-types';

import CONSTANTS from '../constants/constants';
import Utils from './utils';
import CloseButton from './closeButton';
import CountDownClock from './countDownClock';
import Icon from './icon';

/**
 * The UpNext panel component
 */
class UpNextPanel extends React.Component {
  closeUpNextPanel = () => {
    const { controller } = this.props;
    controller.upNextDismissButtonClicked();
  }

  /**
   * Handle the click on start UpNext element
   * @param {Object} event - the event object
   */
  handleStartUpNextClick = (event) => {
    event.preventDefault();
    const { controller, upNextInfo } = this.props;
    // Use the same way as sending out the click event on discovery content
    const asset = upNextInfo.upNextData;
    const customData = {
      source: CONSTANTS.SCREEN.UP_NEXT_SCREEN,
      countdown: 0,
      autoplay: true,
    };
    const eventData = {
      clickedVideo: asset,
      custom: customData,
      metadata: Utils.getDiscoveryEventData(1, 1, CONSTANTS.UI_TAG.UP_NEXT, asset, customData),
    };
    controller.sendDiscoveryClickEvent(eventData, false);
  }

  render() {
    const {
      currentPlayhead,
      language,
      localizableStrings,
      skinConfig,
      upNextInfo,
    } = this.props;
    const upNextString = Utils.getLocalizedString(
      language,
      CONSTANTS.SKIN_TEXT.UP_NEXT,
      localizableStrings
    );
    const thumbnailStyle = {};
    if (Utils.isValidString(upNextInfo.upNextData.preview_image_url)) {
      thumbnailStyle.backgroundImage = `url('${upNextInfo.upNextData.preview_image_url}')`;
    }

    return (
      <div className="oo-up-next-panel">
        <a // eslint-disable-line
          className="oo-up-next-content"
          onClick={this.handleStartUpNextClick}
          style={thumbnailStyle}
        >
          <Icon {...this.props} icon="play" />
        </a>

        <div className="oo-content-metadata">
          <div className="oo-up-next-title">
            <CountDownClock
              {...this.props}
              timeToShow={skinConfig.upNext.timeToShow}
              currentPlayhead={currentPlayhead}
            />

            <div className="oo-up-next-title-text oo-text-truncate">
              {upNextString}
:
              {' '}
              <span dangerouslySetInnerHTML={Utils.createMarkup(upNextInfo.upNextData.name)} />
            </div>
          </div>

          <div
            className="oo-content-description oo-text-truncate"
            dangerouslySetInnerHTML={Utils.createMarkup(upNextInfo.upNextData.description)}
          />
        </div>

        <CloseButton {...this.props} cssClass="oo-up-next-close-btn" closeAction={this.closeUpNextPanel} />
      </div>
    );
  }
}

UpNextPanel.propTypes = {
  upNextInfo: PropTypes.shape({
    upNextData: PropTypes.shape({
      preview_image_url: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string,
    }),
  }),
  skinConfig: PropTypes.shape({
    upNext: PropTypes.shape({
      timeToShow: PropTypes.number,
    }),
    icons: PropTypes.objectOf(PropTypes.object),
  }),
  controller: PropTypes.shape({}),
};

UpNextPanel.defaultProps = {
  skinConfig: {
    upNext: {
      timeToShow: 10,
    },
    icons: {
      play: { fontStyleClass: 'oo-icon oo-icon-play' },
      dismiss: { fontStyleClass: 'oo-icon oo-icon-close' },
    },
  },
  upNextInfo: {
    upNextData: {},
  },
  controller: {
    upNextDismissButtonClicked() {},
    sendDiscoveryClickEvent() {},
  },
};

module.exports = UpNextPanel;
