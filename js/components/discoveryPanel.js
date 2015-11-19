/**
 * Panel component for Discovery Screen
 *
 * @module DiscoveryPanel
 */
var React = require('react'),
    ClassNames = require('classnames'),
    CONSTANTS = require('../constants/constants'),
    Utils = require('./utils'),
    CountDownClock = require('./countDownClock');

var DiscoveryPanel = React.createClass({
  propTypes: {
    discoveryData: React.PropTypes.shape({
      relatedVideos: React.PropTypes.arrayOf(React.PropTypes.shape({
        preview_image_url: React.PropTypes.string,
        name: React.PropTypes.string
      }))
    }),
    skinConfig: React.PropTypes.shape({
      discoveryScreen: React.PropTypes.shape({
        showCountDownTimerOnEndScreen: React.PropTypes.bool,
        countDownTime: React.PropTypes.number,
        contentTitle: React.PropTypes.shape({
          show: React.PropTypes.bool
        })
      }),
      icons: React.PropTypes.objectOf(React.PropTypes.object)
    }),
    controller: React.PropTypes.shape({
      sendDiscoveryClickEvent: React.PropTypes.func
    })
  },

  getDefaultProps: function () {
    return {
      skinConfig: {
        discoveryScreen: {
          showCountDownTimerOnEndScreen: true,
          countDownTime: 10,
          contentTitle: {
            show: true
          }
        },
        icons: {
          pause:{fontStyleClass:'icon icon-pause'},
          discovery:{fontStyleClass:'icon icon-topmenu-discovery'},
          left:{fontStyleClass:'icon icon-left'},
          right:{fontStyleClass:'icon icon-right'}

        }
      },
      discoveryData: {
        relatedVideos: []
      },
      controller: {
        sendDiscoveryClickEvent: function(a,b){}
      }
    };
  },

  getInitialState: function() {
    return {
      showDiscoveryCountDown: this.props.skinConfig.discoveryScreen.showCountDownTimerOnEndScreen
    };
  },

  handleLeftButtonClick: function(event) {
    event.preventDefault();
  },

  handleRightButtonClick: function(event) {
    event.preventDefault();
  },

  handleDiscoveryContentClick: function(index) {
    var eventData = {
      "clickedVideo": this.props.discoveryData.relatedVideos[index],
      "custom": this.props.discoveryData.custom
    };
    // TODO: figure out countdown value
    // eventData.custom.countdown = 0;
    this.props.controller.sendDiscoveryClickEvent(eventData, false);
  },

  shouldShowCountdownTimer: function() {
    return this.state.showDiscoveryCountDown && this.props.playerState === CONSTANTS.STATE.END;
  },

  handleDiscoveryCountDownClick: function(event) {
    event.preventDefault();
    this.setState({showDiscoveryCountDown: false});
    this.refs.CountDownClock.handleClick(event);
  },

  render: function() {
    var relatedVideos = this.props.discoveryData.relatedVideos;

    // if no discovery data render message
    if (relatedVideos.length < 1) {
      // TODO: get msg if no discovery related videos
    }

    var panelTitle = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.DISCOVER, this.props.localizableStrings);
    var discoveryContentName = ClassNames({
      'discoveryContentName': true,
      'hidden': !this.props.skinConfig.discoveryScreen.contentTitle.show
    });
    var discoveryCountDownWrapperStyle = ClassNames({
      'discoveryCountDownWrapperStyle': true,
      'hidden': !this.state.showDiscoveryCountDown
    });
    var countDownClock = (
      <div className={discoveryCountDownWrapperStyle} >
        <a className="discoveryCountDownIconStyle" onClick={this.handleDiscoveryCountDownClick}>
          <CountDownClock {...this.props} timeToShow={this.props.skinConfig.discoveryScreen.countDownTime} ref="CountDownClock" />
          <span className={this.props.skinConfig.icons.pause.fontStyleClass}></span>
        </a>
      </div>
    );

    // Build discovery content blocks
    var discoveryContentBlocks = [];
    for (var i = 0; i < relatedVideos.length; i++) {
      discoveryContentBlocks.push(
        <div className="discoveryImageWrapperStyle" key={i}>
          <a onClick={this.handleDiscoveryContentClick.bind(this, i)}>
            <img className="imageStyle" src={relatedVideos[i].preview_image_url} />
            <span className={discoveryContentName}>{relatedVideos[i].name}</span>
          </a>
          {(this.shouldShowCountdownTimer() && i === 0) ? countDownClock : ''}
        </div>
      );
    }

    return (
      <div className="discovery-panel">
        <div className="discovery-panel-title">
          {panelTitle}
          <span className={this.props.skinConfig.icons.discovery.fontStyleClass}></span>
        </div>

        <div className="discoveryToasterContainerStyle flexcontainer" id="DiscoveryToasterContainer" ref="DiscoveryToasterContainer">
          {discoveryContentBlocks}
        </div>

        <a className="leftButton" ref="ChevronLeftButton" onClick={this.handleLeftButtonClick}>
          <span className={this.props.skinConfig.icons.left.fontStyleClass} aria-hidden="true"></span>
        </a>
        <a className="rightButton" ref="ChevronRightButton" onClick={this.handleRightButtonClick}>
          <span className={this.props.skinConfig.icons.right.fontStyleClass}  aria-hidden="true"></span>
        </a>
      </div>
    );
  }
});
module.exports = DiscoveryPanel;