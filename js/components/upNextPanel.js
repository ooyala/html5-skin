/** ******************************************************************
  UP NEXT PANEL
*********************************************************************/
/**
 * The screen used while the video is playing.
 *
 * @class UpNextPanel
 * @constructor
 */
var React = require('react'),
    CONSTANTS = require('./../constants/constants'),
    Utils = require('./utils'),
    CloseButton = require('./closeButton'),
    CountDownClock = require('./countDownClock'),
    Icon = require('../components/icon');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

var UpNextPanel = createReactClass({
  closeUpNextPanel: function() {
    this.props.controller.upNextDismissButtonClicked();
  },

  handleStartUpNextClick: function(event) {
    event.preventDefault();
    // Use the same way as sending out the click event on discovery content
    var eventData = {
      clickedVideo: this.props.upNextInfo.upNextData,
      custom: {
        source: CONSTANTS.SCREEN.UP_NEXT_SCREEN,
        countdown: 0,
        autoplay: true
      }
    };
    this.props.controller.sendDiscoveryClickEvent(eventData, false);
  },

  render: function() {
    var upNextString = Utils.getLocalizedString(
      this.props.language,
      CONSTANTS.SKIN_TEXT.UP_NEXT,
      this.props.localizableStrings
    );
    var thumbnailStyle = {};
    if (Utils.isValidString(this.props.upNextInfo.upNextData.preview_image_url)) {
      thumbnailStyle.backgroundImage = 'url(\'' + this.props.upNextInfo.upNextData.preview_image_url + '\')';
    }

    return (
      <div className="oo-up-next-panel">
        <a className="oo-up-next-content" onClick={this.handleStartUpNextClick} style={thumbnailStyle}>
          <Icon {...this.props} icon="play" />
        </a>

        <div className="oo-content-metadata">
          <div className="oo-up-next-title">
            <CountDownClock
              {...this.props}
              timeToShow={this.props.skinConfig.upNext.timeToShow}
              currentPlayhead={this.props.currentPlayhead}
            />

            <div className="oo-up-next-title-text oo-text-truncate">
              {upNextString}:{' '}
              <span dangerouslySetInnerHTML={Utils.createMarkup(this.props.upNextInfo.upNextData.name)} />
            </div>
          </div>

          <div
            className="oo-content-description oo-text-truncate"
            dangerouslySetInnerHTML={Utils.createMarkup(this.props.upNextInfo.upNextData.description)}
          />
        </div>

        <CloseButton {...this.props} cssClass="oo-up-next-close-btn" closeAction={this.closeUpNextPanel} />
      </div>
    );
  }
});

UpNextPanel.propTypes = {
  upNextInfo: PropTypes.shape({
    upNextData: PropTypes.shape({
      preview_image_url: PropTypes.string,
      name: PropTypes.string,
      description: PropTypes.string
    })
  }),
  skinConfig: PropTypes.shape({
    upNext: PropTypes.shape({
      timeToShow: PropTypes.number
    }),
    icons: PropTypes.objectOf(PropTypes.object)
  })
};

UpNextPanel.defaultProps = {
  skinConfig: {
    upNext: {
      timeToShow: 10
    },
    icons: {
      play: { fontStyleClass: 'oo-icon oo-icon-play' },
      dismiss: { fontStyleClass: 'oo-icon oo-icon-close' }
    }
  },
  upNextInfo: {
    upNextData: {}
  },
  controller: {
    upNextDismissButtonClicked: function() {},
    sendDiscoveryClickEvent: function(a, b) {}
  }
};

module.exports = UpNextPanel;
