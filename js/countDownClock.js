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
      seconds: 5,
      context: null,
      counterInterval: 0.05
    };
  },

  componentWillReceiveProps: function(props) {
    this.state.radius = this.props.radius;
  },

  componentDidMount: function() {
    this.setupCountDownTimer();
  },

  setupCountDownTimer: function() {
    this.setupCanvas();
    this.drawBackground();
    this.drawTimer();
    this.startTimer();
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
    this.state.context.arc(this.props.width / 2, this.state.radius, this.state.radius, 0, Math.PI * 2, false);
    this.state.context.arc(this.props.width / 2, this.state.radius, this.state.radius / 1.2, Math.PI * 2, 0, true);
    this.state.context.fill();
  },

  drawTimer: function() {
    var decimals;
    var percent = 0.4 * this.state.seconds + 1.5;

    this.state.context.fillStyle = 'white';

    this.state.context.fillText(this.state.seconds.toFixed(decimals), this.props.width / 2, this.state.radius);
    this.state.context.beginPath();
    this.state.context.arc(this.props.width / 2, this.state.radius, this.state.radius, Math.PI * 1.5, Math.PI * percent, false);
    this.state.context.arc(this.props.width / 2, this.state.radius, this.state.radius / 1.2, Math.PI * percent, Math.PI * 1.5, true);
    this.state.context.fill();  
  },

  startTimer: function() {
    this.interval = setInterval(this.tick, this.state.counterInterval * 1000);
  },

  tick: function() {
    this.state.seconds -= this.state.counterInterval; // update every 50 ms
    if (this.state.seconds <= 0) {
      this.state.seconds = 0;
      clearInterval(this.interval);
    }
    this.updateCanvas();
  },

  updateCanvas: function() {
    this.clearCanvas();
    this.drawTimer();
  },


  clearCanvas: function() {
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