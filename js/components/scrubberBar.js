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
    document.addEventListener("mouseup", this.handlePlayheadMouseUp, true);
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
    evt.stopPropagation();
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

    if (this.state.scrubbing) {
      scrubberBarStyle.playheadStyle.left = scrubberBarStyle.playheadStyle.left +
        (this.state.scrubbingPlayheadX - this.state.startingPlayheadX);
    }
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