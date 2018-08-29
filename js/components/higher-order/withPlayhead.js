const React = require('react');
const ReactDOM = require('react-dom');
const CONSTANTS = require('../../constants/constants');
const Utils = require('../utils');

/**
 *
 * @param ComposedComponent The component to wrap and add video navigation functionality to
 * @returns {class} The enhanced component with auto-hide functionality
 */
const withPlayhead = function(ComposedComponent) {
  return class extends React.Component {
    constructor(props) {
      super(props);

      this.getTotalTime = this.getTotalTime.bind(this);
      this.getPlayheadTime = this.getPlayheadTime.bind(this);
    }

    /**
     *
     * @returns {number}
     */
    getTotalTime() {
      let totalTime = 0;
      if (
        this.props.duration === null ||
        typeof this.props.duration === 'undefined' ||
        this.props.duration === ''
      ) {
        totalTime = Utils.formatSeconds(0);
      } else {
        totalTime = Utils.formatSeconds(this.props.duration);
      }
      return totalTime;
    }

    getPlayheadTime() {
      let playheadTime = isFinite(parseInt(this.props.currentPlayhead)) ?
        Utils.formatSeconds(parseInt(this.props.currentPlayhead))
        :
        null;
      var isLiveStream = this.props.isLiveStream;
      var timeShift = this.props.currentPlayhead - this.props.duration;
      // checking timeShift < 1 seconds (not === 0) as processing of the click after we rewinded and then went live may take some time
      var isLiveNow = Math.abs(timeShift) < 1;
      playheadTime = isLiveStream ?
        (isLiveNow ? null : Utils.formatSeconds(timeShift))
        :
        playheadTime;
      return playheadTime;
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          getTotalTime={this.getTotalTime}
          getPlayheadTime={this.getPlayheadTime}
        />
      );
    }
  }
};

module.exports = withPlayhead;