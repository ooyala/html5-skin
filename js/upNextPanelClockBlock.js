/********************************************************************
  UP NEXT CLOCK BLOCK
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class UpNextPanel
* @constructor
*/

var UpNextClockBlock = React.createClass({
  getInitialState: function() {
    return {
      countDownState: "counting"
    };
  },


  componentDidMount: function() {
    this.state.radius = this.getDOMNode().clientHeight * 0.5;
    this.state.width = this.getDOMNode().clientWidth;
  },
  
  handleUpNextPanelClick: function(event) {
    console.log("up next panel clicked");
    event.stopPropagation(); // W3C
    event.cancelBubble = true; // IE
    this.state.countDownState = "finished";
  },

  handleUpNextPanelMouseEnter: function () {
    console.log("up next panel mouse enter");

  },

  handleUpNextPanelMouseLeave: function () {
    console.log("up next panel mouse leave");

  },

  onCountDownFinished: function(event) {
    console.log("onCountDownFinished is called");
    this.state.countDownState = "finished";
  },

  render: function() {
    var countDownClockStyle = upNextPanelStyle.countDownClock;
    var pauseImageUrl = "http://d1rblce2amsnpu.cloudfront.net/assets/music/white_pause-b6bd94be23376d52a6602b68cdf4715f.png";
    var playImageUrl = "http://d1rblce2amsnpu.cloudfront.net/assets/music/white_play-b6bd94be23376d52a6602b68cdf4715f.png";
    var playPauseImageStyle = upNextPanelStyle.playPauseImage;
    if (this.state.countDownState === "counting") {
      return (
        <div style={countDownClockStyle} onClick={this.handleUpNextPanelClick} onMouseEnter={this.handleUpNextPanelMouseEnter} onMouseLeave={this.handleUpNextPanelMouseLeave}>
          <CountDownClock {...this.props} 
            radius={this.state.radius}
            width={this.state.width}
            countDownState={this.state.countDownState} />
        </div>
      );
    } 
    else if (this.state.countDownState === "paused") {
      return (
        <div style={countDownClockStyle} onClick={this.handleUpNextPanelClick}>
          <CountDownClock {...this.props} 
            radius={this.state.radius}
            width={this.state.width} 
            countDownState={this.state.countDownState}/>
          <img style={playPauseImageStyle} src={pauseImageUrl}></img>
        </div>
      );
    }
    else if (this.state.countDownState === "finished") {
      return (
        <div style={countDownClockStyle} onClick={this.handleUpNextPanelClick}>
          <CountDownClock {...this.props} 
            radius={this.state.radius}
            width={this.state.width}
            countDownState={this.state.countDownState} />
          <img style={playPauseImageStyle} src={playImageUrl}></img>
        </div>
      );
    }
    
  }
});