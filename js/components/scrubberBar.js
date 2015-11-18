/********************************************************************
  SCRUBBER BAR
*********************************************************************/
var React = require('react'),
    CONSTANTS = require('../constants/constants');

var ScrubberBar = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    this.lastClickTime = 0;
    this.lastScrubX = null;
    this.playheadLeft = 0;
    this.scrubberBarWidth = 0;
    this.scrubberBarHeight = 0;
    this.scrubberBarContainerHeight = CONSTANTS.UI.defaultScrubberBarPaddingHeight;
    this.playheadWidth = 0;
    return {
      scrubbingPlayheadX: 0,
      currentPlayhead: 0,
      transitionedDuringSeek: false
    };
  },

  componentWillMount: function() {
    if (this.props.seeking) {
      this.setState({transitionedDuringSeek: true});
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.transitionedDuringSeek && !nextProps.seeking) {
      this.setState({transitionedDuringSeek: false});
    }
  },

  componentDidMount: function() {
    this.scrubberBarWidth = this.getDOMNode().querySelector(".scrubberBar").clientWidth;
    this.scrubberBarHeight = this.getDOMNode().querySelector(".scrubberBar").clientHeight;
    this.playheadWidth = this.getDOMNode().querySelector(".playhead").clientWidth;
  },

  handlePlayheadMouseDown: function(evt) {
    this.props.controller.startHideControlBarTimer();
    if (evt.type == 'touchstart' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      evt.preventDefault();
      if (this.isMobile){
        evt = evt.nativeEvent;
      }

      // we enter the scrubbing state to prevent constantly seeking while dragging
      // the playhead icon
      this.props.controller.beginSeeking();
      this.props.controller.renderSkin();

      if (!this.lastScrubX) {
        this.lastScrubX = evt.clientX;
      }

      if (!this.isMobile){
        this.getDOMNode().parentNode.addEventListener("mousemove", this.handlePlayheadMouseMove);
        // attach a mouseup listener to the document for usability, otherwise scrubbing
        // breaks if your cursor leaves the player element
        document.addEventListener("mouseup", this.handlePlayheadMouseUp, true);
      }
      else {
        this.getDOMNode().parentNode.addEventListener("touchmove", this.handlePlayheadMouseMove);
        document.addEventListener("touchend", this.handlePlayheadMouseUp, true);
      }
    }
  },

  handlePlayheadMouseMove: function(evt) {
    this.props.controller.startHideControlBarTimer();
    evt.preventDefault();
    if (this.props.seeking) {
      var deltaX = evt.clientX - this.lastScrubX;
      var scrubbingPlayheadX = this.state.scrubbingPlayheadX + deltaX;
      this.props.controller.updateSeekingPlayhead((scrubbingPlayheadX / this.scrubberBarWidth) * this.props.duration);
      this.setState({
        scrubbingPlayheadX: scrubbingPlayheadX
      });
      this.lastScrubX = evt.clientX;
    }
  },

  handlePlayheadMouseUp: function(evt) {
    this.props.controller.startHideControlBarTimer();
    evt.preventDefault();
    // stop propagation to prevent it from bubbling up to the skin and pausing
    evt.stopPropagation(); // W3C
    evt.cancelBubble = true; // IE

    this.lastScrubX = null;
    if (!this.isMobile){
      this.getDOMNode().parentNode.removeEventListener("mousemove", this.handlePlayheadMouseMove);
      document.removeEventListener("mouseup", this.handlePlayheadMouseUp, true);
    }
    else{
      this.getDOMNode().parentNode.removeEventListener("touchmove", this.handlePlayheadMouseMove);
      document.removeEventListener("touchend", this.handlePlayheadMouseUp, true);
    }
    var newPlayheadTime =
      (this.state.scrubbingPlayheadX /
        (this.props.controlBarWidth - (2 * CONSTANTS.UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING)))
      * this.props.duration;
    this.props.controller.seek(newPlayheadTime);
    this.setState({
      currentPlayhead: newPlayheadTime
    });
  },

  handleScrubberBarMouseDown: function(evt) {
    if (evt.target.className.match("playhead")) { return; }
    this.playheadLeft = evt.nativeEvent.offsetX;
    this.setState({
      scrubbingPlayheadX: evt.nativeEvent.offsetX
    });
    this.handlePlayheadMouseDown(evt);
  },

  render: function() {
    var controlBarHeight = CONSTANTS.UI.defaultControlBarHeight;
    // Liusha: Uncomment the following code when we need to support resizing control bar with threshold and scaling.
    // if (this.props.controlBarWidth > 1280) {
    //   controlBarHeight = this.props.skinConfig.controlBar.height * this.props.controlBarWidth / 1280;
    // } else if (this.props.controlBarWidth < 560) {
    //   controlBarHeight = this.props.skinConfig.controlBar.height * this.props.controlBarWidth / 560;
    // } else {
    //   controlBarHeight = this.props.skinConfig.controlBar.height;
    // }
    var scrubberPaddingHeight = this.scrubberBarContainerHeight;
    var scrubberBarHeight = this.scrubberBarHeight;

    var bufferedIndicatorStyle = {width: (parseFloat(this.props.buffered) /
      parseFloat(this.props.duration)) * 100 + "%"};
    var playedIndicatorStyle = {width: Math.min((parseFloat(this.props.currentPlayhead) /
      parseFloat(this.props.duration)) * 100, 100) + "%"};
    var playheadStyle = {};
    var playheadPaddingStyle = {};

    if (!this.state.transitionedDuringSeek) {
        if (!this.props.seeking) {
          playheadPaddingStyle.left = ((parseFloat(this.props.currentPlayhead) /
            parseFloat(this.props.duration)) * this.scrubberBarWidth);
        } else if (this.state.scrubbingPlayheadX) {
          playheadPaddingStyle.left = this.state.scrubbingPlayheadX;
        }

        playheadPaddingStyle.left = Math.max(
          Math.min(this.scrubberBarWidth - parseInt(this.playheadWidth)/2,
            playheadPaddingStyle.left), 0);
    }

    var scrubberBarMouseUp = this.handleScrubberBarMouseUp;
    var playheadMouseDown = this.handlePlayheadMouseDown;
    var scrubberBarMouseDown = this.handleScrubberBarMouseDown;

    if (this.props.controller.state.screenToShow == CONSTANTS.SCREEN.AD_SCREEN){
      playheadStyle.visibility = "hidden";
      playedIndicatorStyle.backgroundColor = "#FF3F80";
      scrubberBarMouseUp = null;
      playheadMouseDown = null;
    }
    else {
      playheadStyle.visibility = "visible";
      playedIndicatorStyle.backgroundColor = "#4389ff";
    }

    var scrubberBarContainerStyle = {
      bottom: (this.props.controlBarVisible ?
        (controlBarHeight - scrubberPaddingHeight) :  (-1 * scrubberPaddingHeight))
    };

    return (
      <div className="scrubberBarContainer" style={scrubberBarContainerStyle}>
        <div className="scrubberBarPadding" onMouseDown={scrubberBarMouseDown} onTouchStart={scrubberBarMouseDown}>
          <div ref="scrubberBar" className="scrubberBar">
            <div className="bufferedIndicator" style={bufferedIndicatorStyle}></div>
            <div className="playedIndicator" style={playedIndicatorStyle}></div>
            <div className="playheadPadding" style={playheadPaddingStyle}
              onMouseDown={playheadMouseDown} onTouchStart={playheadMouseDown}>
              <div className="playhead"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = ScrubberBar;
