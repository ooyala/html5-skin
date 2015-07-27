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
    this.countDownStyle = null;
    var tmpFraction = 0;
    var tmpRemainSeconds = 0;
    if(this.props.controller.state.screenToShow === SCREEN.UP_NEXT_SCREEN) {
      this.countDownStyle = upNextPanelStyle.upNextCountDownStyle; 
      tmpRemainSeconds = this.props.duration - this.props.currentPlayhead;
      if (this.props.timeToShow > 1) {
        // time to show is based on seconds
        tmpFraction = 2 / this.props.timeToShow;
      } else {
        // time to show is based on percetage of duration
        tmpFraction = (2 / ((1 - this.props.timeToShow) * this.props.duration));
      }
    }
    else if(this.props.controller.state.screenToShow === SCREEN.DISCOVERY_SCREEN) {
      this.countDownStyle = discoveryScreenStyle.discoveryCountDownStyle;
      tmpFraction = 2 / this.props.timeToShow;
      tmpRemainSeconds = this.props.timeToShow;
    }
    var tmpClockRadius = 16;
    var tmpClockContainerWidth = 38;
    if(this.countDownStyle) {
      tmpClockRadius = parseInt(this.countDownStyle.width, 10)/2;
      tmpClockContainerWidth = parseInt(this.countDownStyle.width, 10);
    }
    return {
      clockRadius: tmpClockRadius,
      clockContainerWidth: tmpClockContainerWidth,
      counterInterval: 0.05,
      fraction: tmpFraction, // fraction = 2 / (skinConfig.upNextScreen.timeToShow) so "fraction * pi" is how much we want to fill the circle for each second
      remainSeconds: tmpRemainSeconds,
      timeToShow: this.props.timeToShow,
      showDiscoveryCountDown: true
    };
  },

  handleClick: function(event) {
    if(this.props.controller.state.screenToShow === SCREEN.DISCOVERY_SCREEN) {
      this.countDownStyle.display = "none";
      clearInterval(this.interval);
      this.setState({showDiscoveryCountDown: false});
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
    this.context.font = "regular 12px Arial";
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
    if(this.props.controller.state.screenToShow === SCREEN.UP_NEXT_SCREEN) {
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
    if(this.props.controller.state.screenToShow === SCREEN.DISCOVERY_SCREEN) {
      if(this.state.remainSeconds < 1) {
        this.setState({remainSeconds: 0});
        clearInterval(this.interval);
        this.startDiscoveryVideo();
      }
      else {
        this.setState({remainSeconds: this.state.remainSeconds-(this.state.counterInterval)});
        this.updateCanvas();
      }
    }
    else if(this.props.controller.state.screenToShow === SCREEN.UP_NEXT_SCREEN) {
      if (this.state.remainSeconds < 1 || this.props.playerState === STATE.END) {
        this.setState({remainSeconds: 0});
        clearInterval(this.interval);
        this.startUpNextVideo();
      } 
      else if (this.props.playerState === STATE.PLAYING) {
        this.setState({remainSeconds: this.state.remainSeconds - this.state.counterInterval});
        this.updateCanvas();
      }
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

  startDiscoveryVideo: function() {
    var eventData = {
          "clickedVideo" : this.props.discoveryData.relatedVideos[0],
          "custom" : this.props.discoveryData.custom
        };
    this.props.controller.sendDiscoveryClickEvent(eventData);
  },

  startUpNextVideo: function() {
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
        height: this.state.clockContainerWidth,
        width: this.state.clockContainerWidth,
        style: this.countDownStyle,
        onClick: this.handleClick
    });
  }
});