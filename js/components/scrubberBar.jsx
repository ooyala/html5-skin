import React from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import ThumbnailContainer from './thumbnailContainer';
import Utils from './utils';
import MACROS from '../constants/macros';
import CONSTANTS from '../constants/constants';
import Marker from './markers/marker';
import MarkerIcon from './markers/markerIcon';

/**
 * Scrubbler bar implementation
 */
class ScrubberBar extends React.Component {
  state = {
    scrubberBarWidth: 0,
    playheadWidth: 0,
    scrubbingPlayheadX: 0,
    hoveringX: 0,
  };

  constructor(props) {
    super(props);
    this.lastScrubX = null;
    const { controller } = this.props;
    this.isMobile = controller.state.isMobile;
    this.touchInitiated = false;
    this.targetPlayhead = 0;
    this.root = null;
    this.scrubberBar = null;
    this.playhead = null;
  }

  componentDidMount() {
    this.handleResize();
  }

  /**
   * Reflect in the state if we've got seeking
   * @param {Object} nextProps - the next props react object
   */
  componentWillReceiveProps(nextProps) {
    const { componentWidth } = this.props;
    if (nextProps.componentWidth !== componentWidth) {
      this.handleResize();
    }
  }

  componentDidUpdate(prevProps) {
    const { forceResize } = this.props;
    if (forceResize && !prevProps.forceResize) {
      this.handleResize();
    }
  }

  /**
   * Remove event listeners for mobile devices
   */
  componentWillUnmount() {
    if (!this.isMobile) {
      this.root.parentNode.removeEventListener('mousemove', this.handlePlayheadMouseMove);
      document.removeEventListener('mouseup', this.handlePlayheadMouseUp, true);
    } else {
      this.root.parentNode.removeEventListener('touchmove', this.handlePlayheadMouseMove);
      document.removeEventListener('touchend', this.handlePlayheadMouseUp, true);
    }
  }

  /**
   * Get multiplier parameter for specified UI breakpoint
   * @param {string} responsiveView breakpoint value
   * @returns {number} the mutiplier value
   */
  getResponsiveUIMultiple = (responsiveView) => {
    const { skinConfig } = this.props;
    return skinConfig.responsive.breakpoints[responsiveView].multiplier;
  }

  handleResize = () => {
    this.setState({
      scrubberBarWidth: this.scrubberBar.clientWidth,
      playheadWidth: this.playhead.clientWidth,
    });
  }

  /**
   * Proceed mouse down on playhead (1st step of drag&drop)
   * @param {Object} event - the event object
   */
  handlePlayheadMouseDown = (event) => {
    const { controller } = this.props;
    if (controller.state.screenToShow === CONSTANTS.SCREEN.AD_SCREEN) {
      event.preventDefault();
      return;
    }
    controller.startHideControlBarTimer();
    if (event.target.className.match('playhead') && event.type !== 'mousedown') {
      this.touchInitiated = true;
    }
    if (
      (this.touchInitiated && event.type !== 'mousedown')
      || (!this.touchInitiated && event.type === 'mousedown')
    ) {
      // since mobile would fire both click and touched events,
      // we need to make sure only one actually does the work

      event.preventDefault();
      const currentEvent = this.touchInitiated ? event.touches[0] : event;

      // we enter the scrubbing state to prevent constantly seeking while dragging
      // the playhead icon
      controller.beginSeeking();
      controller.renderSkin();

      if (!this.lastScrubX) {
        this.lastScrubX = currentEvent.clientX;
      }

      if (!this.touchInitiated) {
        this.root.parentNode.addEventListener('mousemove', this.handlePlayheadMouseMove);
        // attach a mouseup listener to the document for usability, otherwise scrubbing
        // breaks if your cursor leaves the player element
        document.addEventListener('mouseup', this.handlePlayheadMouseUp, true);
      } else {
        this.root.parentNode.addEventListener('touchmove', this.handlePlayheadMouseMove);
        document.addEventListener('touchend', this.handlePlayheadMouseUp, true);
      }
    }
  }

  /**
   * Proceed mouse move on playhead (2nd step of drag&drop)
   * @param {Object} event - the event object
   */
  handlePlayheadMouseMove = (event) => {
    const {
      controller,
      currentPlayhead,
      duration,
      seeking,
    } = this.props;
    const { scrubberBarWidth } = this.state;
    controller.startHideControlBarTimer();
    event.preventDefault();
    if (seeking && duration > 0) {
      const currentEvent = this.touchInitiated ? event.touches[0] : event;

      const deltaX = currentEvent.clientX - this.lastScrubX;
      const scrubbingPlayheadX = currentPlayhead * scrubberBarWidth / duration + deltaX;
      this.targetPlayhead = scrubbingPlayheadX / scrubberBarWidth * duration;
      controller.updateSeekingPlayhead(
        scrubbingPlayheadX / scrubberBarWidth * duration
      );
      this.setState({
        scrubbingPlayheadX,
      });
      this.lastScrubX = currentEvent.clientX;
    }
  }

  /**
   * Proceed mouse up on playhead (3rd step of drag&drop)
   * @param {Object} event - the event object
   */
  handlePlayheadMouseUp = (event) => {
    const { controller } = this.props;
    const { targetPlayhead } = this;
    controller.startHideControlBarTimer();
    event.preventDefault();
    // stop propagation to prevent it from bubbling up to the skin and pausing
    event.stopPropagation();

    // Remove keyboard focus when clicking on scrubber bar
    if (this.scrubberBar) {
      this.scrubberBar.blur();
    }

    this.lastScrubX = null;
    if (!this.touchInitiated) {
      this.root.parentNode.removeEventListener('mousemove', this.handlePlayheadMouseMove);
      document.removeEventListener('mouseup', this.handlePlayheadMouseUp, true);
    } else {
      this.root.parentNode.removeEventListener('touchmove', this.handlePlayheadMouseMove);
      document.removeEventListener('touchend', this.handlePlayheadMouseUp, true);
    }
    controller.seek(targetPlayhead);
    this.setState({ scrubbingPlayheadX: 0 });
    this.touchInitiated = false;
  }

  /**
   * Proceed keyboard click
   * @param {Object} event - the event object
   */
  handleScrubberBarKeyDown = (event) => {
    const { controller } = this.props;
    switch (event.key) {
      case CONSTANTS.KEY_VALUES.ARROW_UP:
      case CONSTANTS.KEY_VALUES.ARROW_RIGHT:
        event.preventDefault();
        controller.accessibilityControls.seekBy(CONSTANTS.A11Y_CTRLS.SEEK_DELTA, true);
        break;
      case CONSTANTS.KEY_VALUES.ARROW_DOWN:
      case CONSTANTS.KEY_VALUES.ARROW_LEFT:
        event.preventDefault();
        controller.accessibilityControls.seekBy(CONSTANTS.A11Y_CTRLS.SEEK_DELTA, false);
        break;
      default:
        break;
    }
  }

  /**
   * Proceed mouse down on scrubber bar (1st step of drag&drop)
   * @param {Object} event - the event object
   */
  handleScrubberBarMouseDown = (event) => {
    const { controller, duration } = this.props;
    if (controller.state.screenToShow === CONSTANTS.SCREEN.AD_SCREEN) {
      event.preventDefault();
      return;
    }
    if (event.target.className.match('oo-playhead')) {
      return;
    }
    if (this.touchInitiated && event.type === 'mousedown') {
      return;
    }
    let offsetX = 0;
    this.touchInitiated = event.type === 'touchstart';
    if (this.touchInitiated) {
      offsetX = event.targetTouches[0].pageX - event.target.getBoundingClientRect().left;
    } else {
      offsetX = event.nativeEvent.offsetX === undefined
        ? event.nativeEvent.layerX
        : event.nativeEvent.offsetX;
    }

    if (event.target.className.match('oo-marker')) {
      offsetX += event.target.offsetLeft;
    }

    this.setState({
      scrubbingPlayheadX: offsetX,
    });
    const { scrubberBarWidth } = this.state;
    this.targetPlayhead = offsetX / scrubberBarWidth * duration;
    this.handlePlayheadMouseDown(event);
  }

  /**
   * Proceed mouse move on scrubber (2nd step of drag&drop)
   * @param {Object} event - the event object
   */
  handleScrubberBarMouseMove = (event) => {
    this.handleScrubberBarMouseOver(event);
  }

  /**
   * Proceed mouse over event on scrubber
   * @param {Object} event - the event object
   */
  handleScrubberBarMouseOver = (event) => {
    const { controller, skinConfig } = this.props;
    if (!skinConfig.controlBar.scrubberBar.thumbnailPreview) return;
    if (controller.state.screenToShow === CONSTANTS.SCREEN.AD_SCREEN) return;
    if (this.isMobile) {
      return;
    }
    if (event.target.className.match('oo-playhead')) {
      return;
    }
    if (event.target.className.match('oo-text-truncate')) {
      return;
    }
    if (
      event.target.className.match('oo-marker-bubble')
      || event.target.parentElement.className.match('oo-marker-bubble')
    ) {
      return;
    }

    controller.setScrubberBarHoverState(true);
    let { offsetX } = event.nativeEvent;
    if (event.target.className.match('oo-marker')) {
      offsetX += event.target.offsetLeft;
    }
    this.setState({ hoveringX: offsetX });
  }

  handleScrubberBarMouseOut = () => {
    const { controller } = this.props;
    if (!controller.state.thumbnails) return;
    controller.setScrubberBarHoverState(false);
    this.setState({
      hoveringX: 0,
    });
  }

  handleScrubberBarMouseLeave = () => {
    const { controller } = this.props;
    controller.setScrubberBarHoverState(false);
  }

  /**
   * Gets a string that describes the current status of the progress bar in a screen
   * reader friendly format.
   * @returns {string} ariaValueText
   */
  getAriaValueText = () => {
    let ariaValueText;
    const {
      currentPlayhead,
      duration,
      isLiveStream,
    } = this.props;
    const timeDisplayValues = Utils.getTimeDisplayValues(
      currentPlayhead,
      duration,
      isLiveStream,
    );

    if (isLiveStream) {
      if (timeDisplayValues.totalTime) {
        ariaValueText = CONSTANTS.ARIA_LABELS.TIME_DISPLAY_DVR.replace(
          MACROS.CURRENT_TIME,
          timeDisplayValues.currentTime
        );
        ariaValueText = ariaValueText.replace(MACROS.TOTAL_TIME, timeDisplayValues.totalTime);
      } else {
        ariaValueText = CONSTANTS.ARIA_LABELS.TIME_DISPLAY_LIVE;
      }
    } else {
      ariaValueText = CONSTANTS.ARIA_LABELS.TIME_DISPLAY.replace(
        MACROS.CURRENT_TIME,
        timeDisplayValues.currentTime
      );
      ariaValueText = ariaValueText.replace(MACROS.TOTAL_TIME, timeDisplayValues.totalTime);
    }
    return ariaValueText;
  }

  /**
   * getMarkerIcons creates and returns a collection of markerIcon components to be rendered
   *
   * @returns {array} Collection of markerIcon components
   * @memberof ScrubberBar
   */
  getMarkerIcons = () => {
    const {
      controller,
      skinConfig,
      duration,
    } = this.props;

    const { scrubberBarWidth } = this.state;

    const markers = controller.state.markers ? controller.state.markers.list : [];
    const markerTypes = skinConfig.markers && skinConfig.markers.types ? skinConfig.markers.types : [];
    return markers.map((marker, index) => (
      <MarkerIcon
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        level={index}
        data={marker}
        config={markerTypes[marker.type]}
        duration={duration}
        scrubberBarWidth={scrubberBarWidth}
        accentColor={skinConfig.general.accentColor}
        controller={controller}
      />));
  }

  render() {
    const {
      audioOnly,
      buffered,
      controller,
      currentPlayhead,
      duration,
      skinConfig,
    } = this.props;
    const scrubberBarStyle = {
      backgroundColor: skinConfig.controlBar.scrubberBar.backgroundColor,
    };
    const hundred = 100;
    const bufferedIndicatorStyle = {
      width: `${Math.min(parseFloat(buffered) / parseFloat(duration) * hundred, hundred)}%`,
      backgroundColor: skinConfig.controlBar.scrubberBar.bufferedColor,
    };
    const playedIndicatorStyle = {
      width:
        `${Math.min(parseFloat(currentPlayhead) / parseFloat(duration) * hundred, hundred)}%`,
      backgroundColor: skinConfig.controlBar.scrubberBar.playedColor
        ? skinConfig.controlBar.scrubberBar.playedColor
        : skinConfig.general.accentColor,
    };
    const playheadStyle = {
      backgroundColor: skinConfig.controlBar.scrubberBar.playedColor
        ? skinConfig.controlBar.scrubberBar.playedColor
        : skinConfig.general.accentColor,
    };

    const {
      hoveringX,
      scrubbingPlayheadX,
      scrubberBarWidth,
      playheadWidth,
    } = this.state;

    let padding = parseFloat(currentPlayhead)
      / parseFloat(duration)
      * scrubberBarWidth;

    padding = Math.max(
      Math.min(
        scrubberBarWidth - Number.parseInt(playheadWidth, 0) / 2,
        padding
      ),
      0
    );

    if (Number.isNaN(padding)) {
      padding = 0;
    }
    const playheadPaddingStyle = {};
    playheadPaddingStyle.left = controller.state.readDirection === 'rtl'
      ? scrubberBarWidth - padding
      : padding;

    let playheadMouseDown = this.handlePlayheadMouseDown;
    const scrubberBarMouseDown = this.handleScrubberBarMouseDown;
    const scrubberBarMouseOver = this.handleScrubberBarMouseOver;
    const scrubberBarMouseOut = this.handleScrubberBarMouseOut;
    const scrubberBarMouseMove = this.handleScrubberBarMouseMove;
    let playedIndicatorClassName = 'oo-played-indicator';
    let playheadClassName = 'oo-playhead';

    if (controller.state.screenToShow === CONSTANTS.SCREEN.AD_SCREEN) {
      playheadClassName += ' oo-ad-playhead';
      playedIndicatorClassName += ' oo-played-ad-indicator';
      playheadMouseDown = null;

      scrubberBarStyle.backgroundColor = skinConfig.controlBar.adScrubberBar.backgroundColor;
      bufferedIndicatorStyle.backgroundColor = skinConfig.controlBar.adScrubberBar.bufferedColor;
      playedIndicatorStyle.backgroundColor = skinConfig.controlBar.adScrubberBar.playedColor;
    }

    let hoverTime = 0;
    let hoverPosition = 0;
    let hoveredIndicatorStyle = null;
    let hovering = false;

    let thumbnailsContainer = null;

    if (
      controller.state.thumbnails
      && (scrubbingPlayheadX || this.lastScrubX || hoveringX)
    ) {
      const vrViewingDirection = Utils.getPropertyValue(
        controller,
        'state.vrViewingDirection',
        { yaw: 0, roll: 0, pitch: 0 },
      );
      const fullscreen = Utils.getPropertyValue(controller, 'state.fullscreen', false);
      const videoVr = Utils.getPropertyValue(controller, 'state.videoVr', false);
      const isCarousel = !!scrubbingPlayheadX;

      if (scrubbingPlayheadX) {
        hoverPosition = scrubbingPlayheadX;
        hoverTime = scrubbingPlayheadX / scrubberBarWidth * duration;
        playheadClassName += ' oo-playhead-scrubbing';
      } else if (this.lastScrubX) {
        // to show thumbnail when clicking on playhead
        hoverPosition = currentPlayhead * scrubberBarWidth / duration;
        hoverTime = currentPlayhead;
        playheadClassName += ' oo-playhead-scrubbing';
      } else if (hoveringX) {
        hoverPosition = hoveringX;
        hoverTime = hoveringX / scrubberBarWidth * duration;
        hoveredIndicatorStyle = {
          width: `${Math.min(parseFloat(hoverTime) / parseFloat(duration) * hundred, hundred)}%`,
          backgroundColor: skinConfig.controlBar.scrubberBar.playedColor
            ? skinConfig.controlBar.scrubberBar.playedColor
            : skinConfig.general.accentColor,
        };
        hovering = true;
        playheadClassName += ' oo-playhead-hovering';
      }

      thumbnailsContainer = (
        <ThumbnailContainer
          isCarousel={isCarousel}
          thumbnails={controller.state.thumbnails}
          duration={duration}
          hoverPosition={hoverPosition}
          hoverTime={hoverTime > 0 ? hoverTime : 0}
          scrubberBarWidth={scrubberBarWidth}
          videoVr={videoVr}
          fullscreen={fullscreen}
          vrViewingDirection={vrViewingDirection}
        />
      );
    }

    const scrubberBarClass = ClassNames({
      'oo-scrubber-bar': true,
      'oo-scrubber-bar-hover': hovering,
      'oo-scrubber-bar-video': !audioOnly,
    });

    const ariaValueText = this.getAriaValueText();

    // Markers
    const markers = controller.state.markers ? controller.state.markers.list : [];
    const markersType = skinConfig.markers && skinConfig.markers.types ? skinConfig.markers.types : {};
    const markerList = markers.map((marker, index) => (
      <Marker
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        duration={duration}
        scrubberBarWidth={scrubberBarWidth}
        data={marker}
        config={markersType[marker.type]}
        accentColor={skinConfig.general.accentColor}
      />
    ));

    const markerIcons = this.getMarkerIcons();

    return (
      <div // eslint-disable-line
        className="oo-scrubber-bar-container"
        onMouseOver={scrubberBarMouseOver}
        onMouseOut={scrubberBarMouseOut}
        onMouseLeave={this.handleScrubberBarMouseLeave}
        onMouseMove={scrubberBarMouseMove}
        ref={(node) => { this.root = node; }}
      >
        {!!controller.state.markers && controller.state.markers.list.length > 0 && (
          <div className="oo-marker-container">
            {markerIcons}
          </div>
        )}
        {thumbnailsContainer}
        <div // eslint-disable-line
          className="oo-scrubber-bar-padding"
          onMouseDown={scrubberBarMouseDown}
          onTouchStart={scrubberBarMouseDown}
        >
          <div
            ref={(node) => { this.scrubberBar = node; }}
            className={scrubberBarClass}
            style={scrubberBarStyle}
            role="slider"
            aria-label={CONSTANTS.ARIA_LABELS.SEEK_SLIDER}
            aria-valuemin="0"
            aria-valuemax={duration}
            aria-valuenow={Utils.ensureNumber(currentPlayhead, 0).toFixed(
              2
            )}
            aria-valuetext={ariaValueText}
            data-focus-id={CONSTANTS.FOCUS_IDS.SCRUBBER_BAR}
            tabIndex="0"
            onKeyDown={this.handleScrubberBarKeyDown}
          >
            <div className="oo-buffered-indicator" style={bufferedIndicatorStyle} />
            <div className="oo-hovered-indicator" style={hoveredIndicatorStyle} />
            <div className={playedIndicatorClassName} style={playedIndicatorStyle} />
            {markerList}
            <div // eslint-disable-line
              className="oo-playhead-padding"
              style={playheadPaddingStyle}
              onMouseDown={playheadMouseDown}
              onTouchStart={playheadMouseDown}
            >
              <div
                ref={(node) => { this.playhead = node; }}
                className={playheadClassName}
                style={playheadStyle}
                data-testid="playhead"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ScrubberBar.propTypes = {
  audioOnly: PropTypes.bool,
  buffered: PropTypes.number,
  controller: PropTypes.shape({}).isRequired,
  duration: PropTypes.number,
  forceResize: PropTypes.bool,
  isLiveStream: PropTypes.bool,
  currentPlayhead: PropTypes.number,
  seeking: PropTypes.bool,
  skinConfig: PropTypes.shape({}),
  componentWidth: PropTypes.number,
};

ScrubberBar.defaultProps = {
  audioOnly: false,
  buffered: 0,
  componentWidth: 0,
  currentPlayhead: 0,
  duration: 0,
  forceResize: false,
  isLiveStream: false,
  seeking: false,
  skinConfig: {
    controlBar: {
      scrubberBar: {
        backgroundColor: 'rgba(5,175,175,1)',
        bufferedColor: 'rgba(127,5,127,1)',
        playedColor: 'rgba(67,137,5,1)',
      },
      adScrubberBar: {
        backgroundColor: 'rgba(175,175,5,1)',
        bufferedColor: 'rgba(127,5,127,1)',
        playedColor: 'rgba(5,63,128,1)',
      },
    },
  },
};

module.exports = ScrubberBar;
