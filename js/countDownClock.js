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
    return {
      canvas: null,
      radius: 50,
      fraction: 0,
      seconds: this.props.seconds,
      context: null
    };
  },

  componentWillReceiveProps: function(props) {
    // this.seconds = this.props.seconds;
    this.state.radius = this.props.radius;
    // this.clearTimer();
    // return this.setupCountDownTimer();
  },

  componentDidMount: function() {
    this.setupCountDownTimer();
  },

  setupCountDownTimer: function() {
    // this.setupScale();

    this.setupCanvas();
    this.drawBackground();
    this.drawTimer();
    this.startTimer();
  },

  setupScale: function() {
    this.tickPeriod = this.state.seconds * 1.8;
  },

  setupCanvas: function() {
    this.canvas = this.getDOMNode();
    this.state.context = this.canvas.getContext("2d");
    this.state.context.textAlign = 'center';
    this.state.context.textBaseline = 'middle';
    this.state.context.font = "bold " + (this.state.radius / 2) + "px Arial";
  },

  drawBackground: function() {
    this.state.context.beginPath();
    this.state.context.globalAlpha = 1;
    this.state.context.fillStyle = 'red';
    this.state.context.arc(this.state.radius, this.state.radius, this.state.radius, 0, Math.PI * 2, false);
    this.state.context.arc(this.state.radius, this.state.radius, this.state.radius / 1.2, Math.PI * 2, 0, true);
    return this.state.context.fill();
  },

  drawTimer: function() {
     var decimals, percent, ref;
      percent = 0.4 * this.state.seconds + 1.5;
    console.log("draw timer with percentage" + percent);

    this.state.context.fillStyle = 'white';

    this.state.context.fillText(this.state.seconds.toFixed(decimals), this.state.radius, this.state.radius);
    this.state.context.beginPath();
    this.state.context.arc(this.state.radius, this.state.radius, this.state.radius, Math.PI * 1.5, Math.PI * percent, false);
    this.state.context.arc(this.state.radius, this.state.radius, this.state.radius / 1.2, Math.PI * percent, Math.PI * 1.5, true);
    return this.state.context.fill();  
  },

  startTimer: function() {
    this.interval = setInterval(this.tick, 50);
  },

  tick: function() {
     this.state.seconds -= 0.05;
    if (this.state.seconds <= 0) {
      this.state.seconds = 0;
      clearInterval(this.interval);
    }
    console.log("tick tick ..." + this.state.seconds);
    this.updateCanvas();
  },

  updateCanvas: function() {
    this.clearTimer();
    this.drawTimer();
  },


  clearTimer: function() {
    this.state.context = this.canvas.getContext("2d");
    this.state.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
  },

  render: function() {
      return React.createElement("canvas", {
        "className": "react-countdown-clock"
    });
  }
});