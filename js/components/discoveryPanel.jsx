import React from 'react';
import ReactDOM from 'react-dom';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';

import Utils from './utils';
import CONSTANTS from '../constants/constants';
import CountDownClock from './countDownClock';
import DiscoverItem from './discoverItem';
import Icon from './icon';

/**
 * Panel component for Discovery Screen
 */
class DiscoveryPanel extends React.Component {
  constructor(props) {
    super(props);
    const { forceCountDownTimer, skinConfig } = this.props;
    this.state = {
      showDiscoveryCountDown:
        skinConfig.discoveryScreen.showCountDownTimerOnEndScreen || forceCountDownTimer,
      currentPage: 1,
      componentHeight: null,
      shownAssets: -1,
    };
  }

  componentDidMount() {
    this.detectHeight();
  }

  componentWillReceiveProps(nextProps) {
    const { componentWidth } = this.props;
    if (nextProps.componentWidth !== componentWidth) {
      this.handleResize(nextProps);
    }
  }

  /**
   * If we are changing view sizes, adjust the currentPage number to reflect the new number of items per page
   * @param {Object} nextProps - next props object
   */
  handleResize = (nextProps) => {
    const { videosPerPage, responsiveView } = this.props;
    const { currentPage } = this.state;
    const currentViewSize = responsiveView;
    const nextViewSize = nextProps.responsiveView;
    const firstDiscoverIndex = currentPage * videosPerPage[currentViewSize]
      - videosPerPage[currentViewSize];
    const newCurrentPage = Math.floor(firstDiscoverIndex / nextProps.videosPerPage[nextViewSize]) + 1;
    this.setState({
      currentPage: newCurrentPage,
    });
    this.detectHeight();
  }

  /**
   * Handle click on left button
   * @param {Object} event - the click event object
   */
  handleLeftButtonClick = (event) => {
    event.preventDefault();
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage - 1 });
  }

  /**
   * Handle click on right button
   * @param {Object} event - the click event
   */
  handleRightButtonClick = (event) => {
    event.preventDefault();
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage + 1 });
  }

  /**
   * Handle click on the item of the discovery list
   * @param {number} index - the index of the item clicked
   */
  handleDiscoveryContentClick = (index) => {
    const {
      controller,
      discoveryData,
      responsiveView,
      videosPerPage,
    } = this.props;
    const currentViewSize = responsiveView;
    const videosPerPageInView = videosPerPage[currentViewSize];
    const assetPosition = (index % videosPerPageInView) + 1;
    const asset = discoveryData.relatedVideos[index];
    const customData = {
      source: CONSTANTS.SCREEN.DISCOVERY_SCREEN,
      autoplay: false,
    };
    const eventData = {
      clickedVideo: asset,
      custom: customData,
      metadata: Utils.getDiscoveryEventData(
        assetPosition,
        videosPerPageInView,
        CONSTANTS.UI_TAG.DISCOVERY,
        asset,
        customData,
      ),
    };
    // TODO: figure out countdown value
    // eventData.custom.countdown = 0;
    controller.sendDiscoveryClickEvent(eventData, false);
  }

  /**
   * Define if countdown timer should be shown
   * @returns {boolean} the decision
   */
  shouldShowCountdownTimer = () => {
    const { showDiscoveryCountDown } = this.state;
    const { playerState } = this.props;
    return showDiscoveryCountDown && playerState === CONSTANTS.STATE.END;
  }

  /**
   * Handle click on counter
   * @param {Object} event - the click event object
   */
  handleDiscoveryCountDownClick = (event) => {
    event.preventDefault();
    this.setState({ showDiscoveryCountDown: false });
    this.refs.CountDownClock.handleClick(event); // eslint-disable-line
  }

  // detect height of component
  detectHeight = () => {
    const discoveryPanel = ReactDOM.findDOMNode(this.refs.discoveryPanel); // eslint-disable-line
    this.setState({
      componentHeight: discoveryPanel.getBoundingClientRect().height,
    });
  }

  render() {
    const {
      componentWidth,
      controller,
      skinConfig,
      discoveryData,
      responsiveView,
      videosPerPage,
    } = this.props;
    const { relatedVideos } = discoveryData;

    // if no discovery data render message
    if (relatedVideos.length < 1) {
      // TODO: get msg if no discovery related videos
    }

    // pagination
    const currentViewSize = responsiveView;
    const videosPerPageView = videosPerPage[currentViewSize];
    const { componentHeight, currentPage, showDiscoveryCountDown } = this.state;
    const startAt = videosPerPageView * (currentPage - 1);
    const endAt = videosPerPageView * currentPage;
    const relatedVideoPage = relatedVideos.slice(startAt, endAt);
    let position = 1;
    // Send impression events for each discovery asset shown
    for (let index = startAt; index < endAt; index += 1) {
      if (index > this.state.shownAssets && index < relatedVideos.length) { // eslint-disable-line
        controller.sendDiscoveryDisplayEvent(
          position,
          videosPerPageView,
          CONSTANTS.UI_TAG.DISCOVERY,
          relatedVideos[index],
          {},
        );
        this.state.shownAssets += 1;
        position += 1;
      }
    }
    // discovery content
    const discoveryContentName = ClassNames({
      'oo-discovery-content-name': true,
      'oo-hidden': !skinConfig.discoveryScreen.contentTitle.show,
    });
    const discoveryCountDownWrapperStyle = ClassNames({
      'oo-discovery-count-down-wrapper-style': true,
      'oo-hidden': !showDiscoveryCountDown,
    });
    const widthThreshold = 420;
    const heightThresholdXs = 175;
    const heightThresholdSm = 320;
    const discoveryToaster = ClassNames({
      'oo-discovery-toaster-container-style': true,
      'oo-flexcontainer': true,
      'oo-scale-size':
        (responsiveView === skinConfig.responsive.breakpoints.xs.id
          && (componentWidth <= widthThreshold || componentHeight <= heightThresholdXs))
        || (responsiveView === skinConfig.responsive.breakpoints.sm.id
          && (componentWidth <= widthThreshold || componentHeight <= heightThresholdSm)),
    });
    const leftButtonClass = ClassNames({
      'oo-left-button': true,
      'oo-hidden': currentPage <= 1,
    });
    const rightButtonClass = ClassNames({
      'oo-right-button': true,
      'oo-hidden': endAt >= relatedVideos.length,
    });
    const countDownClock = this.shouldShowCountdownTimer() ? (
      <div className={discoveryCountDownWrapperStyle}>
        <a // eslint-disable-line
          className="oo-discovery-count-down-icon-style"
          onClick={this.handleDiscoveryCountDownClick}
        >
          <CountDownClock
            {...this.props}
            timeToShow={skinConfig.discoveryScreen.countDownTime}
            ref="CountDownClock" // eslint-disable-line
          />
          <Icon {...this.props} icon="pause" />
        </a>
      </div>
    ) : null;

    // Build discovery content blocks
    const discoveryContentBlocks = [];
    for (let index = 0; index < relatedVideoPage.length; index += 1) {
      discoveryContentBlocks.push(
        <DiscoverItem
          {...this.props}
          key={index}
          src={relatedVideoPage[index].preview_image_url}
          contentTitle={relatedVideoPage[index].name}
          contentTitleClassName={discoveryContentName}
          onClickAction={() => {
            this.handleDiscoveryContentClick(videosPerPageView * (currentPage - 1) + index);
          }}
        >
          {countDownClock && index === 0 && currentPage <= 1 ? countDownClock : null}
        </DiscoverItem>
      );
    }

    return (
      <div
        className="oo-content-panel oo-discovery-panel"
        ref="discoveryPanel" // eslint-disable-line
      >
        <div
          className={discoveryToaster}
          ref="DiscoveryToasterContainer" // eslint-disable-line
        >
          {discoveryContentBlocks}
        </div>

        <a // eslint-disable-line
          className={leftButtonClass}
          ref="ChevronLeftButton" // eslint-disable-line
          onClick={this.handleLeftButtonClick}
        >
          <Icon {...this.props} icon="left" />
        </a>
        <a // eslint-disable-line
          className={rightButtonClass}
          ref="ChevronRightButton" // eslint-disable-line
          onClick={this.handleRightButtonClick}
        >
          <Icon {...this.props} icon="right" />
        </a>
      </div>
    );
  }
}

DiscoveryPanel.propTypes = {
  responsiveView: PropTypes.string,
  videosPerPage: PropTypes.objectOf(PropTypes.number),
  discoveryData: PropTypes.shape({
    relatedVideos: PropTypes.arrayOf(
      PropTypes.shape({
        preview_image_url: PropTypes.string,
        name: PropTypes.string,
      })
    ),
  }),
  skinConfig: PropTypes.shape({
    discoveryScreen: PropTypes.shape({
      showCountDownTimerOnEndScreen: PropTypes.bool,
      countDownTime: PropTypes.number,
      contentTitle: PropTypes.shape({
        show: PropTypes.bool,
      }),
    }),
    icons: PropTypes.objectOf(PropTypes.object),
  }),
  controller: PropTypes.shape({
    sendDiscoveryClickEvent: PropTypes.func,
    sendDiscoveryDisplayEvent: PropTypes.func,
  }),
};

DiscoveryPanel.defaultProps = {
  videosPerPage: {
    xs: 2,
    sm: 4,
    md: 6,
    lg: 8,
  },
  skinConfig: {
    discoveryScreen: {
      showCountDownTimerOnEndScreen: true,
      countDownTime: 10,
      contentTitle: {
        show: true,
      },
    },
    icons: {
      pause: { fontStyleClass: 'oo-icon oo-icon-pause' },
      discovery: { fontStyleClass: 'oo-icon oo-icon-topmenu-discovery' },
      left: { fontStyleClass: 'oo-icon oo-icon-left' },
      right: { fontStyleClass: 'oo-icon oo-icon-right' },
    },
    responsive: {
      breakpoints: {
        xs: { id: 'xs' },
        sm: { id: 'sm' },
        md: { id: 'md' },
        lg: { id: 'lg' },
      },
    },
  },
  discoveryData: {
    relatedVideos: [],
  },
  controller: {
    sendDiscoveryClickEvent: () => {},
    sendDiscoveryDisplayEvent: () => {},
  },
  responsiveView: 'md',
};

module.exports = DiscoveryPanel;
