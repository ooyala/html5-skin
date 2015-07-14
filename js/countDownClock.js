/********************************************************************
  COUNT DOWN CLOCK
*********************************************************************/
/**
* 
*
* @class CountDownClock
* @constructor
*/

var CountDownClock = React.createClass({
  getInitialState: function() {
    // canvas, interval, and context are changing based on time instead of user interaction
    this.canvas = null;
    this.context = null;      
    this.interval = null;
    return {
      clockRadius: 16,
      clockContainerWidth: 38,
      counterInterval: 0.05,
      fraction: 0, // fraction = 2 / (skinConfig.upNextScreen.timeToShow) so "fraction * pi" is how much we want to fill the circle for each second
      remainSeconds: (this.props.duration - this.props.currentPlayhead),
      timeToShow: this.props.timeToShow
    };
  },

  componentWillReceiveProps: function(props) {
    this.setState({remainSeconds: (this.props.duration - this.props.currentPlayhead)});
    if (this.state.timeToShow > 1) {
      // time to show is based on seconds
      this.setState({fraction: (2 / this.state.timeToShow)});
    } else {
      // time to show is based on percetage of duration
      this.setState({fraction: (2 / ((1 - timeToShow) * this.props.duration))});
    }
  },

  componentDidMount: function() {
    this.setupCountDownTimer();
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  setupCountDownTimer: function() {
    this.setupCanvas();
    this.drawBackground();
    this.drawTimer();
    this.startTimer();
  },

  setupCanvas: function() {
    this.canvas = this.getDOMNode();
    this.context = this.canvas.getContext("2d");
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.font = "bold 12px Arial";
  },

  drawBackground: function() {
    this.context.beginPath();
    this.context.globalAlpha = 1;
    this.context.fillStyle = 'gray';
    this.context.arc(this.state.clockContainerWidth / 2, this.state.clockRadius, this.state.clockRadius, 0, Math.PI * 2, false);
    this.context.arc(this.state.clockContainerWidth / 2, this.state.clockRadius, this.state.clockRadius / 1.2, Math.PI * 2, 0, true);
    this.context.fill();
  },

  drawTimer: function() {
    var decimals;
    var percent = this.state.fraction * this.state.remainSeconds + 1.5;
    this.context.fillStyle = 'white';
    if(this.props.showText) {
      this.context.fillText(this.state.remainSeconds.toFixed(decimals), this.state.clockContainerWidth / 2, this.state.clockRadius, 100);
    }
    this.context.beginPath();
    this.context.arc(this.state.clockContainerWidth / 2, this.state.clockRadius, this.state.clockRadius, Math.PI * 1.5, Math.PI * percent, false);
    this.context.arc(this.state.clockContainerWidth / 2, this.state.clockRadius, this.state.clockRadius / 1.2, Math.PI * percent, Math.PI * 1.5, true);
    this.context.fill();  
  },

  startTimer: function() {
    this.interval = setInterval(this.tick, this.state.counterInterval * 1000);
  },

  tick: function() {
    if (this.state.remainSeconds < 1 || this.props.playerState === STATE.END) {
      this.setState({remainSeconds: 0});
      clearInterval(this.interval);
      //this.startUpNext();
    } 
    else if (this.props.playerState === STATE.PLAYING || this.props.state.screenToShow === SCREEN.DISCOVERY_SCREEN) {
      this.setState({remainSeconds: this.state.remainSeconds - this.state.counterInterval});
      this.updateCanvas();
    }
  },

  updateCanvas: function() {
    this.clearCanvas();
    this.drawTimer();
  },

  clearCanvas: function() {
    this.context = this.canvas.getContext("2d");
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
  },

  startUpNext: function() {
    console.log("startUpNext");
    var eventData = {
      "clickedVideo" : this.props.upNextInfo.upNextData,
      "custom" : {"source": SCREEN.UP_NEXT_SCREEN}
    };
    this.props.controller.sendDiscoveryClickEvent(eventData);
  },

  render: function() {
      return React.createElement("canvas", {
        "className": "alice-countdown-clock",
        height: "38px",
        width: "38px",
        style: this.props.countDownStyle
    });
  }
});