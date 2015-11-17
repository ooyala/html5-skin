/********************************************************************
  SCRUBBER BAR
*********************************************************************/
var React = require('react'),
    InlineStyle = require('../styles/inlineStyle');

var ScrubberBar = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    this.lastClickTime = 0;
    this.lastScrubX = null;
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
      this.setState({
        scrubbingPlayheadX: InlineStyle.scrubberBarStyle.playheadPaddingStyle.left + deltaX
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
    InlineStyle.scrubberBarStyle.playheadPaddingStyle.left = evt.nativeEvent.offsetX;
    this.setState({
      scrubbingPlayheadX: evt.nativeEvent.offsetX
    });
    this.handlePlayheadMouseDown(evt);
  },

  render: function() {
    var controlBarHeight = InlineStyle.controlBarStyle.controlBarSetting.height;
    // Liusha: Uncomment the following code when we need to support resizing control bar with threshold and scaling.
    // if (this.props.controlBarWidth > 1280) {
    //   controlBarHeight = this.props.skinConfig.controlBar.height * this.props.controlBarWidth / 1280;
    // } else if (this.props.controlBarWidth < 560) {
    //   controlBarHeight = this.props.skinConfig.controlBar.height * this.props.controlBarWidth / 560;
    // } else {
    //   controlBarHeight = this.props.skinConfig.controlBar.height;
    // }
    var scrubberPaddingHeight = parseInt(InlineStyle.scrubberBarStyle.scrubberBarPadding.height);
    var scrubberBarHeight = parseInt(InlineStyle.scrubberBarStyle.scrubberBarSetting.height);
    var scrubberBarWidth = this.props.controlBarWidth - (2 * CONSTANTS.UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING);
    InlineStyle.scrubberBarStyle.scrubberBarSetting.width = scrubberBarWidth;
    //InlineStyle.scrubberBarStyle.scrubberBarSetting.left = CONSTANTS.UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING;
    //InlineStyle.scrubberBarStyle.scrubberBarSetting.right = CONSTANTS.UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING;

    InlineStyle.scrubberBarStyle.scrubberBarPadding.bottom = (this.props.controlBarVisible ?
      (controlBarHeight - scrubberPaddingHeight) :  (-1 * scrubberPaddingHeight));
    InlineStyle.scrubberBarStyle.bufferedIndicatorStyle.width = (parseFloat(this.props.buffered) /
      parseFloat(this.props.duration)) * 100 + "%";
    InlineStyle.scrubberBarStyle.playedIndicatorStyle.width = Math.min((parseFloat(this.props.currentPlayhead) /
      parseFloat(this.props.duration)) * 100, 100) + "%";
    InlineStyle.scrubberBarStyle.playheadStyle.opacity = (this.props.controlBarVisible ? 1 : 0);

    if (!this.state.transitionedDuringSeek) {
        if (!this.props.seeking) {
          InlineStyle.scrubberBarStyle.playheadPaddingStyle.left = ((parseFloat(this.props.currentPlayhead) /
            parseFloat(this.props.duration)) * scrubberBarWidth);
        } else if (this.state.scrubbingPlayheadX) {
          InlineStyle.scrubberBarStyle.playheadPaddingStyle.left = this.state.scrubbingPlayheadX;
        }

        InlineStyle.scrubberBarStyle.playheadPaddingStyle.left = Math.max(
          Math.min(InlineStyle.scrubberBarStyle.scrubberBarSetting.width - parseInt(InlineStyle.scrubberBarStyle.playheadStyle.width)/2,
            InlineStyle.scrubberBarStyle.playheadPaddingStyle.left), 0);
    }

    var scrubberBarMouseUp = this.handleScrubberBarMouseUp;
    var playheadMouseDown = this.handlePlayheadMouseDown;
    var scrubberBarMouseDown = this.handleScrubberBarMouseDown;

    if (this.props.controller.state.screenToShow == CONSTANTS.SCREEN.AD_SCREEN){
      InlineStyle.scrubberBarStyle.playheadStyle.visibility = "hidden";
      InlineStyle.scrubberBarStyle.playedIndicatorStyle.background = "#FF3F80";
      scrubberBarMouseUp = null;
      playheadMouseDown = null;
    }
    else {
      InlineStyle.scrubberBarStyle.playheadStyle.visibility = "visible";
      InlineStyle.scrubberBarStyle.playedIndicatorStyle.background = "#4389ff";
    }

    return (
      <div className="scrubberBarContainer" style={InlineStyle.scrubberBarStyle.scrubberBarPadding}>
        <div className="scrubberBarPadding" onMouseDown={scrubberBarMouseDown} onTouchStart={scrubberBarMouseDown}
          style={{"height": "100%", "left": CONSTANTS.UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING,
            "right": CONSTANTS.UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING, "position": "absolute"}}>
          <div className="scrubberBar" style={InlineStyle.scrubberBarStyle.scrubberBarSetting}>
            <div className="bufferedIndicator" style={InlineStyle.scrubberBarStyle.bufferedIndicatorStyle}></div>
            <div className="playedIndicator" style={InlineStyle.scrubberBarStyle.playedIndicatorStyle}></div>
            <div className="playheadPadding" style={InlineStyle.scrubberBarStyle.playheadPaddingStyle}
              onMouseDown={playheadMouseDown} onTouchStart={playheadMouseDown}>
              <div className="playhead" style={InlineStyle.scrubberBarStyle.playheadStyle}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = ScrubberBar;
