const React = require('react');
const ReactDOM = require('react-dom');
const CONSTANTS = require('../../constants/constants');
const Utils = require('../utils');

/**
 *
 * @param ComposedComponent The component to wrap and add video navigation functionality to
 * @returns {class} The enhanced component with auto-hide functionality
 */
const withVideoNavigation = function(ComposedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.onPreviousVideo = this.onPreviousVideo.bind(this);
      this.onNextVideo = this.onNextVideo.bind(this);
      this.onSkipBackward = this.onSkipBackward.bind(this);
      this.onSkipForward = this.onSkipForward.bind(this);
      this.isAtLiveEdge = this.isAtLiveEdge.bind(this);
    }

    //skip controls
    /**
     * Previous Video button click handler.
     * @private
     */
    onPreviousVideo() {
      if (typeof this.props.controller.rewindOrRequestPreviousVideo === 'function') {
        this.props.controller.rewindOrRequestPreviousVideo();
      }
    }

    /**
     * Next Video button click handler.
     * @private
     */
    onNextVideo() {
      if (typeof this.props.controller.requestNextVideo === 'function') {
        this.props.controller.requestNextVideo();
      }
    }

    /**
     * Skip Backward button click handler.
     * @private
     */
    onSkipBackward() {
      if (typeof this.props.a11yControls.seekBy === 'function') {
        const skipTimes = Utils.getSkipTimes(this.props.skinConfig);
        this.props.a11yControls.seekBy(skipTimes.backward, false, true);
      }
    }

    /**
     * Skip Forward button click handler.
     * @private
     */
    onSkipForward() {
      if (typeof this.props.a11yControls.seekBy === 'function') {
        const skipTimes = Utils.getSkipTimes(this.props.skinConfig);
        this.props.a11yControls.seekBy(skipTimes.forward, true, true);
      }
    }

    /**
     * Determines whether or not the current video is at the live edge based on the
     * playhead state and duration.
     * @private
     * @return {Boolean} True if the video is at the live edge, false otherwise.
     * Note: This function always returns false for VOD.
     */
    isAtLiveEdge() {
      const isLiveStream = Utils.getPropertyValue(
        this.props.controller,
        'state.isLiveStream',
        false
      );
      if (isLiveStream) {
        const duration = Utils.getPropertyValue(this.props.controller, 'state.duration', 0);
        const currentPlayhead = Utils.ensureNumber(this.props.currentPlayhead, 0);
        const isLiveNow = Math.abs(currentPlayhead - duration) < 1;
        return isLiveNow;
      }
      return false;
    }
    // end skip controls

    render() {
      return (
        <ComposedComponent
          {...this.props}
          onPreviousVideo={this.onPreviousVideo}
          onNextVideo={this.onNextVideo}
          onSkipBackward={this.onSkipBackward}
          onSkipForward={this.onSkipForward}
          isAtLiveEdge={this.isAtLiveEdge}
        />
      );
    }
  }
};

module.exports = withVideoNavigation;