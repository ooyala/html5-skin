/********************************************************************
  SCRUBBER BAR
*********************************************************************/

var ScrubberBar = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      startingPlayheadX: 0,
      scrubbingPlayheadX: 0,
      currentPlayhead: 0
    };
  },

  handlePlayheadMouseDown: function(evt) {
    // we enter the scrubbing state to prevent constantly seeking while dragging
    // the playhead icon
    evt.stopPropagation();
    this.props.controller.beginSeeking();
    this.props.controller.renderSkin();
    if (!this.isMobile){
      this.getDOMNode().parentNode.addEventListener("mousemove", this.handlePlayheadMouseMove);
      // attach a mouseup listener to the document for usability, otherwise scrubbing
      // breaks if your cursor leaves the player element
      document.addEventListener("mouseup", this.handlePlayheadMouseUp, true);
      this.setState({
        startingPlayheadX: evt.screenX,
        scrubbingPlayheadX: evt.screenX
      });
    }
    else {
      this.getDOMNode().parentNode.addEventListener("touchmove", this.handlePlayheadMouseMove);
      document.addEventListener("touchend", this.handlePlayheadMouseUp, true);
      this.setState({
        startingPlayheadX: evt.pageX
      });
    }
  },

  handlePlayheadMouseMove: function(evt) {
    evt.stopPropagation();
    if (this.props.seeking) {
      if (!this.isMobile){
        this.setState({
          scrubbingPlayheadX: evt.screenX
        });
      }
      else {
        this.setState({
          scrubbingPlayheadX: evt.pageX
        });
      }
    }
  },

  handlePlayheadMouseUp: function(evt) {
    // stop propagation to prevent it from bubbling up to the skin and pausing
    evt.stopPropagation();
    //use the difference in x coordinates of the start and end points of the
    // mouse events to calculate the amount of time to seek
    var newPlayheadX = this.isMobile?evt.pageX:evt.screenX;
    var diffX = newPlayheadX - this.state.startingPlayheadX;
    var diffTime = (diffX / this.props.controlBarWidth) * this.props.duration;
    var newPlayheadTime = this.props.currentPlayhead + diffTime;
    if (!this.isMobile){
      this.getDOMNode().parentNode.removeEventListener("mousemove", this.handlePlayheadMouseMove);
      document.removeEventListener("mouseup", this.handlePlayheadMouseUp, true);
    }
    else {
      // console.log("xenia in mobile handlePlayheadMouseUp");
      this.getDOMNode().parentNode.removeEventListener("touchmove", this.handlePlayheadMouseMove);
      document.removeEventListener("touchend", this.handlePlayheadMouseUp, true);
    }

    this.props.controller.seek(newPlayheadTime);
  },

  handleScrubberBarMouseUp: function(evt) {
    // this method is used to seek when the scrubber bar is clicked. We stop propagation
    // to prevent it from bubbling up to the skin which would pause the player
    evt.stopPropagation();
    var offset = evt.clientX - evt.target.getBoundingClientRect().left;
    var newPlayheadTime = (offset / this.props.controlBarWidth) * this.props.duration;
    this.props.controller.seek(newPlayheadTime);
    this.setState({
      currentPlayhead: newPlayheadTime
    });
  },

  render: function() {
    var controlBarHeight = 60;
        // console.log("xenia currentPlayhead", this.props.currentPlayhead);
        // console.log("xenia seeking", this.props.seeking);
    // Liusha: Uncomment the following code when we need to support resizing control bar with threshold and scaling.
    // if (this.props.controlBarWidth > 1280) {
    //   controlBarHeight = this.props.skinConfig.controlBar.height * this.props.controlBarWidth / 1280;
    // } else if (this.props.controlBarWidth < 560) {
    //   controlBarHeight = this.props.skinConfig.controlBar.height * this.props.controlBarWidth / 560;
    // } else {
    //   controlBarHeight = this.props.skinConfig.controlBar.height;
    // }

    scrubberBarStyle.scrubberBarSetting.bottom = (this.props.controlBarVisible ?
      controlBarHeight : 0);
    scrubberBarStyle.bufferedIndicatorStyle.width = (parseFloat(this.props.buffered) /
      parseFloat(this.props.duration)) * 100 + "%";
    scrubberBarStyle.playedIndicatorStyle.width = (parseFloat(this.props.currentPlayhead) /
      parseFloat(this.props.duration)) * 100 + "%";
    scrubberBarStyle.playheadStyle.left = ((parseFloat(this.props.currentPlayhead) /
      parseFloat(this.props.duration)) * this.props.controlBarWidth);
    scrubberBarStyle.playheadStyle.opacity = (this.props.controlBarVisible ? 1 : 0);

    // if we're scrubbing, use the coordinates from the latest mouse events
    if (this.props.seeking) {
      scrubberBarStyle.playheadStyle.left = scrubberBarStyle.playheadStyle.left +
        (this.state.scrubbingPlayheadX - this.state.startingPlayheadX);
    }
    //prevent the playhead from moving beyond the player element
    scrubberBarStyle.playheadStyle.left = Math.max(Math.min(this.props.controlBarWidth - parseInt(scrubberBarStyle.playheadStyle.width),
      scrubberBarStyle.playheadStyle.left), 0);

    return (
      <div className="scrubberBar" style={scrubberBarStyle.scrubberBarSetting}
        onMouseUp={this.handleScrubberBarMouseUp}>
        <div className="bufferedIndicator" style={scrubberBarStyle.bufferedIndicatorStyle}></div>
        <div className="playedIndicator" style={scrubberBarStyle.playedIndicatorStyle}></div>
        <div className="playhead" style={scrubberBarStyle.playheadStyle}
          onMouseDown={this.handlePlayheadMouseDown} onTouchStart={this.handlePlayheadMouseDown}></div>
      </div>
    );
  }
});