/********************************************************************
  SCRUBBER BAR
*********************************************************************/
var React = require('react'),
    InlineStyle = require('../styles/inlineStyle');

var ScrubberBar = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      startingPlayheadX: 0,
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

      if (!this.isMobile){
        this.getDOMNode().parentNode.addEventListener("mousemove", this.handlePlayheadMouseMove);
        // attach a mouseup listener to the document for usability, otherwise scrubbing
        // breaks if your cursor leaves the player element
        document.addEventListener("mouseup", this.handlePlayheadMouseUp, true);
        this.setState({
          startingPlayheadX: evt.clientX,
          scrubbingPlayheadX: evt.clientX
        });
      }
      else {
        this.getDOMNode().parentNode.addEventListener("touchmove", this.handlePlayheadMouseMove);
        document.addEventListener("touchend", this.handlePlayheadMouseUp, true);
        this.setState({
          startingPlayheadX: evt.changedTouches[0].clientX,
          scrubbingPlayheadX: evt.changedTouches[0].clientX
        });
      }
    }
  },

  handlePlayheadMouseMove: function(evt) {
    evt.preventDefault();
    if (this.props.seeking) {
      this.setState({
        scrubbingPlayheadX: this.isMobile?evt.changedTouches[0].clientX:evt.clientX
      });
    }
  },

  handlePlayheadMouseUp: function(evt) {
    evt.preventDefault();
    // stop propagation to prevent it from bubbling up to the skin and pausing
    evt.stopPropagation(); // W3C
    evt.cancelBubble = true; // IE
    //use the difference in x coordinates of the start and end points of the
    // mouse events to calculate the amount of time to seek
    var newPlayheadX = this.isMobile?evt.changedTouches[0].clientX:evt.clientX;
    var diffX = newPlayheadX - this.state.startingPlayheadX;
    var diffTime = (diffX / this.props.controlBarWidth) * this.props.duration;
    var newPlayheadTime = this.props.currentPlayhead + diffTime;

    if (!this.isMobile){
      this.getDOMNode().parentNode.removeEventListener("mousemove", this.handlePlayheadMouseMove);
      document.removeEventListener("mouseup", this.handlePlayheadMouseUp, true);
    }
    else{
      this.getDOMNode().parentNode.removeEventListener("touchmove", this.handlePlayheadMouseMove);
      document.removeEventListener("touchend", this.handlePlayheadMouseUp, true);
    }
    this.props.controller.seek(newPlayheadTime);
    this.setState({
      currentPlayhead: newPlayheadTime
    });
  },

  handleScrubberBarMouseUp: function(evt) {
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      evt.preventDefault();

      // this method is used to seek when the scrubber bar is clicked. We stop propagation
      // to prevent it from bubbling up to the skin which would pause the player
      evt.stopPropagation(); // W3C
      evt.cancelBubble = true; // IE

      if (this.isMobile){
        evt = evt.nativeEvent;
      }
      var offset = this.isMobile ? evt.changedTouches[0].clientX : evt.clientX - evt.target.getBoundingClientRect().left;
      if (evt.target.className.match(/scrubberBarPadding/))
        offset -= CONSTANTS.UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING;
      var newPlayheadTime = (offset / (this.props.controlBarWidth - (2 * CONSTANTS.UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING))) * this.props.duration;
      this.props.controller.seek(newPlayheadTime);
      this.setState({
        currentPlayhead: newPlayheadTime
      });
    }
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
    InlineStyle.scrubberBarStyle.scrubberBarSetting.left = CONSTANTS.UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING;
    InlineStyle.scrubberBarStyle.scrubberBarSetting.right = 2 * CONSTANTS.UI.DEFAULT_SCRUBBERBAR_LEFT_RIGHT_PADDING;

    InlineStyle.scrubberBarStyle.scrubberBarPadding.bottom = (this.props.controlBarVisible ?
      (controlBarHeight - scrubberPaddingHeight) :  (-1 * scrubberPaddingHeight));
    InlineStyle.scrubberBarStyle.bufferedIndicatorStyle.width = (parseFloat(this.props.buffered) /
      parseFloat(this.props.duration)) * 100 + "%";
    InlineStyle.scrubberBarStyle.playedIndicatorStyle.width = (parseFloat(this.props.currentPlayhead) /
      parseFloat(this.props.duration)) * 100 + "%";
    InlineStyle.scrubberBarStyle.playheadStyle.opacity = (this.props.controlBarVisible ? 1 : 0);

    if (!this.state.transitionedDuringSeek) {
      InlineStyle.scrubberBarStyle.playheadPaddingStyle.left = ((parseFloat(this.props.currentPlayhead) /
        parseFloat(this.props.duration)) * scrubberBarWidth);

        if (this.props.seeking) {
          InlineStyle.scrubberBarStyle.playheadPaddingStyle.left = InlineStyle.scrubberBarStyle.playheadPaddingStyle.left +
            (this.state.scrubbingPlayheadX - this.state.startingPlayheadX);
        }

        InlineStyle.scrubberBarStyle.playheadPaddingStyle.left = Math.max(
          Math.min(InlineStyle.scrubberBarStyle.scrubberBarSetting.width - parseInt(InlineStyle.scrubberBarStyle.playheadStyle.width)/2,
            InlineStyle.scrubberBarStyle.playheadPaddingStyle.left), 0);
    }

    if (this.props.controller.state.screenToShow == CONSTANTS.SCREEN.AD_SCREEN){
      InlineStyle.scrubberBarStyle.playheadStyle.visibility = "hidden";
      InlineStyle.scrubberBarStyle.playedIndicatorStyle.background = "#FF3F80";
    }
    else {
      InlineStyle.scrubberBarStyle.playheadStyle.visibility = "visibile";
      InlineStyle.scrubberBarStyle.playedIndicatorStyle.background = "#4389ff";
    }

    return (
      <div className="scrubberBarPadding" onMouseUp={this.handleScrubberBarMouseUp} onTouchEnd={this.handleScrubberBarMouseUp}
        style={InlineStyle.scrubberBarStyle.scrubberBarPadding}>
        <div className="scrubberBar" style={InlineStyle.scrubberBarStyle.scrubberBarSetting}>
          <div className="bufferedIndicator" style={InlineStyle.scrubberBarStyle.bufferedIndicatorStyle}></div>
          <div className="playedIndicator" style={InlineStyle.scrubberBarStyle.playedIndicatorStyle}></div>
          <div className="playheadPadding" style={InlineStyle.scrubberBarStyle.playheadPaddingStyle}
            onMouseDown={this.handlePlayheadMouseDown} onTouchStart={this.handlePlayheadMouseDown}>
            <div className="playhead" style={InlineStyle.scrubberBarStyle.playheadStyle}></div>
          </div>
        </div>
      </div>
    );
  }
});
module.exports = ScrubberBar;
