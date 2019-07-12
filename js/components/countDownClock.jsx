import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import Utils from './utils';
import CONSTANTS from '../constants/constants';

/**
 * Count down clock
 */
class CountDownClock extends React.Component {
  constructor(props) {
    super(props);
    // canvas, interval, and context are changing based on time instead of user interaction
    this.canvas = null;
    this.context = null;
    this.interval = null;
    let tmpFraction = 0;
    let tmpRemainSeconds = 0;
    const {
      controller,
      currentPlayhead,
      duration,
      timeToShow,
    } = this.props;
    const upNextTimeToShow = Number.parseInt(controller.state.upNextInfo.timeToShow, 0);

    if (controller.state.screenToShow === CONSTANTS.SCREEN.DISCOVERY_SCREEN) {
      tmpFraction = 2 / timeToShow;
      tmpRemainSeconds = timeToShow;
    } else {
      tmpFraction = 2 / upNextTimeToShow;
      tmpRemainSeconds = duration - currentPlayhead;
    }

    this.state = {
      counterInterval: 0.05,
      fraction: tmpFraction, // fraction = 2 / (skinConfig.upNext.timeToShow) so "fraction * pi" is how much
      // we want to fill the circle for each second
      remainSeconds: tmpRemainSeconds,
      hideClock: false,
    };
  }

  componentWillMount() {
    this.updateClockSize();
  }

  componentDidMount() {
    this.setupCountDownTimer();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setupCanvas = () => {
    this.context = this.canvas.getContext('2d');
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.font = 'regular 12px Arial';
  }

  setupCountDownTimer = () => {
    this.setupCanvas();
    this.drawBackground();
    this.drawTimer();
    this.startTimer();
  }

  /**
   * Handle click
   * @param {Object} event – the event object
   */
  handleClick = (event) => {
    if (event.type === 'touchend' || !this.isMobile) {
      // since mobile would fire both click and touched events,
      // we need to make sure only one actually does the work
      const { controller } = this.props;
      if (controller.state.screenToShow === CONSTANTS.SCREEN.DISCOVERY_SCREEN) {
        this.setState({ hideClock: true });
        clearInterval(this.interval);
      }
    }
  }

  drawBackground = () => {
    const { beginPath, arc, fill } = this.context;
    const { clockContainerWidth, clockRadius } = this.state;
    beginPath.call(this.context);
    this.context.globalAlpha = 1;
    this.context.fillStyle = 'gray';
    arc.call(
      this.context,
      clockContainerWidth / 2,
      clockRadius,
      clockRadius,
      0,
      Math.PI * 2,
      false,
    );

    arc.call(
      this.context,
      clockContainerWidth / 2,
      clockRadius,
      // eslint-disable-next-line no-magic-numbers
      clockRadius / 1.2,
      Math.PI * 2,
      0,
      true
    );
    fill.call(this.context);
  }

  updateClockSize = () => {
    const CLOCK_WIDTH_DISCOVERY_SCREEN = 75;
    const CLOCK_WIDTH_XS = 25;
    const CLOCK_WIDTH_DEFAULT = 36;
    let clockWidth;
    const { controller, responsiveView, skinConfig } = this.props;
    if (controller.state.screenToShow === CONSTANTS.SCREEN.DISCOVERY_SCREEN) {
      clockWidth = CLOCK_WIDTH_DISCOVERY_SCREEN;
    } else {
      clockWidth = responsiveView === skinConfig.responsive.breakpoints.xs.id
        ? CLOCK_WIDTH_XS
        : CLOCK_WIDTH_DEFAULT;
    }
    this.setState({
      clockRadius: parseInt(clockWidth, 10) / 2,
      clockContainerWidth: parseInt(clockWidth, 10),
    });
  }

  drawTimer = () => {
    let decimals;
    const { controller } = this.props;
    const {
      fraction,
      remainSeconds,
      clockContainerWidth,
      clockRadius,
    } = this.state;
    const {
      fillText,
      beginPath,
      arc,
      fill,
    } = this.context;
    // eslint-disable-next-line no-magic-numbers
    const percent = fraction * remainSeconds + 1.5;
    this.context.fillStyle = 'white';
    if (
      controller.state.screenToShow === CONSTANTS.SCREEN.PLAYING_SCREEN
      || controller.state.screenToShow === CONSTANTS.SCREEN.PAUSE_SCREEN
    ) {
      fillText.call(
        this.context,
        remainSeconds.toFixed(decimals),
        clockContainerWidth / 2,
        clockRadius,
        100,
      );
    }
    beginPath.call(this.context);
    arc.call(
      this.context,
      clockContainerWidth / 2,
      clockRadius,
      clockRadius,
      // eslint-disable-next-line no-magic-numbers
      Math.PI * 1.5,
      Math.PI * percent,
      false,
    );
    arc.call(
      this.context,
      clockContainerWidth / 2,
      clockRadius,
      // eslint-disable-next-line no-magic-numbers
      clockRadius / 1.2,
      Math.PI * percent,
      // eslint-disable-next-line no-magic-numbers
      Math.PI * 1.5,
      true,
    );
    fill.call(this.context);
  }

  startTimer = () => {
    const { counterInterval } = this.state;
    const mSecInSec = 1000;
    this.interval = setInterval(this.tick, counterInterval * mSecInSec);
  }

  tick = () => {
    const {
      controller,
      playerState,
      duration,
      currentPlayhead,
    } = this.props;
    const { remainSeconds, counterInterval } = this.state;
    if (controller.state.screenToShow === CONSTANTS.SCREEN.DISCOVERY_SCREEN) {
      if (remainSeconds < 1) {
        this.setState({ remainSeconds: 0 });
        clearInterval(this.interval);
        this.startDiscoveryVideo();
      } else {
        this.setState({ remainSeconds: remainSeconds - counterInterval });
        this.updateCanvas();
      }
    } else if (
      controller.state.screenToShow === CONSTANTS.SCREEN.PLAYING_SCREEN
      || controller.state.screenToShow === CONSTANTS.SCREEN.PAUSE_SCREEN
    ) {
      if (remainSeconds < 1 || playerState === CONSTANTS.STATE.END) {
        this.setState({ remainSeconds: 0 });
        clearInterval(this.interval);
        this.startUpNextVideo();
      } else {
        this.setState({ remainSeconds: duration - currentPlayhead });
        this.updateCanvas();
      }
    }
  }

  updateCanvas = () => {
    this.clearCanvas();
    this.drawTimer();
  }

  clearCanvas = () => {
    this.context = this.canvas.getContext('2d');
    const { clearRect } = this.context;
    clearRect.call(this.context, 0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
  }

  startDiscoveryVideo = () => {
    const { controller, discoveryData } = this.props;
    const asset = discoveryData.relatedVideos[0];
    const customData = { source: CONSTANTS.SCREEN.UP_NEXT_SCREEN, autoplay: false };
    const eventData = {
      clickedVideo: asset,
      custom: discoveryData.custom,
      metadata: Utils.getDiscoveryEventData(1, 1, CONSTANTS.UI_TAG.UP_NEXT, asset, customData),
    };
    controller.sendDiscoveryClickEvent(eventData, false);
  }

  startUpNextVideo = () => {
    OO.log('startUpNext');
    const { controller, upNextInfo } = this.props;
    const asset = upNextInfo.upNextData;
    const customData = { source: CONSTANTS.SCREEN.UP_NEXT_SCREEN, autoplay: true };
    const eventData = {
      clickedVideo: asset,
      custom: customData,
      metadata: Utils.getDiscoveryEventData(1, 1, CONSTANTS.UI_TAG.UP_NEXT, asset, customData),
    };
    controller.sendDiscoveryClickEvent(eventData, true);
  }

  render() {
    const { controller } = this.props;
    const { hideClock, clockContainerWidth } = this.state;
    const canvasClassName = ClassNames({
      'oo-countdown-clock': true,
      'oo-up-next-count-down': controller.state.screenToShow !== CONSTANTS.SCREEN.DISCOVERY_SCREEN,
      'oo-discovery-count-down':
        controller.state.screenToShow === CONSTANTS.SCREEN.DISCOVERY_SCREEN,
      'oo-hidden': hideClock,
    });

    return (
      <canvas
        className={canvasClassName}
        width={clockContainerWidth}
        height={clockContainerWidth}
        onClick={this.handleClick}
        onTouchEnd={this.handleClick}
        ref={(node) => { this.canvas = node; }}
      />
    );
  }
}

CountDownClock.propTypes = {
  discoveryData: PropTypes.shape({}),
  timeToShow: PropTypes.number,
  currentPlayhead: PropTypes.number,
  controller: PropTypes.shape({}),
  duration: PropTypes.number,
  skinConfig: PropTypes.shape({}),
  upNextInfo: PropTypes.shape({}),
  playerState: PropTypes.string,
  responsiveView: PropTypes.string.isRequired,
};

CountDownClock.defaultProps = {
  timeToShow: 10, // seconds
  currentPlayhead: 0,
  controller: {
    state: {
      screenToShow: '',
      upNextInfo: {
        timeToShow: 10,
      },
    },
  },
  duration: 0,
  playerState: '',
  discoveryData: {},
  skinConfig: {
    responsive: {
      breakpoints: {
        xs: {
          id: 'xs',
        },
      },
    },
  },
  upNextInfo: {},
};

module.exports = CountDownClock;
