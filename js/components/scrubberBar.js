/********************************************************************
  SCRUBBER BAR
*********************************************************************/

var ScrubberBar = React.createClass({
  getInitialState: function() {
    return {
      startingPlayheadX: 0,
      scrubbingPlayheadX: 0,
      currentPlayhead: 0,
      scrubbing: false
    };
  },

  handlePlayheadMouseDown: function(evt) {
    this.getDOMNode().parentNode.addEventListener("mousemove", this.handlePlayheadMouseMove);
    // attach a mouseup listener to the document for usability, otherwise scrubbing
    // breaks if your cursor leaves the player element
    document.addEventListener("mouseup", this.handlePlayheadMouseUp, true);
    // we enter the scrubbing state to prevent constantly seeking while dragging
    // the playhead icon
    this.setState({
      scrubbing: true,
      startingPlayheadX: evt.screenX
    });
  },

  handlePlayheadMouseMove: function(evt) {
    if (this.state.scrubbing) {
      var scrubberWidth = evt.target.parentNode.clientWidth;
      this.setState({
        scrubbingPlayheadX: evt.screenX
      });
    }
  },

  handlePlayheadMouseUp: function(evt) {
    // stop propagation to prevent it from bubbling up to the skin and pausing
    evt.stopPropagation();
    //use the difference in x coordinates of the start and end points of the
    // mouse events to calculate the amount of time to seek
    var newPlayheadX = evt.screenX;
    var diffX = newPlayheadX - this.state.startingPlayheadX;
    var diffTime = (diffX / this.props.controlBarWidth) * this.props.duration;
    var newPlayheadTime = this.props.currentPlayhead + diffTime;
    this.getDOMNode().parentNode.removeEventListener("mousemove", this.handlePlayheadMouseMove);
    document.removeEventListener("mouseup", this.handlePlayheadMouseUp, true);
    this.props.controller.seek(newPlayheadTime);
    this.setState({
      scrubbing: false,
      currentPlayhead: newPlayheadTime
    });
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
    scrubberBarStyle.scrubberBarSetting.bottom = (this.props.controlBarVisible ?
      this.props.controlBarHeight : 0);
    scrubberBarStyle.scrubberBarSetting.height = (this.props.controlBarVisible ?
      "6px" : "4px");
    scrubberBarStyle.bufferedIndicatorStyle.width = (parseFloat(this.props.buffered) /
      parseFloat(this.props.duration)) * 100 + "%";
    scrubberBarStyle.playedIndicatorStyle.width = (parseFloat(this.props.currentPlayhead) /
      parseFloat(this.props.duration)) * 100 + "%";
    scrubberBarStyle.playheadStyle.left = ((parseFloat(this.props.currentPlayhead) /
      parseFloat(this.props.duration)) * this.props.controlBarWidth);
    scrubberBarStyle.playheadStyle.opacity = (this.props.controlBarVisible ? 1 : 0);

    // if we're scrubbing, use the coordinates from the latest mouse events
    if (this.state.scrubbing) {
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
          onMouseDown={this.handlePlayheadMouseDown}></div>
      </div>
    );
  }
});