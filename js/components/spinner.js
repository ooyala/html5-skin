var Spinner = React.createClass({
  getInitialState: function() {
    return {
      spinnerAngle: 0
    };
  },

  componentDidMount: function() {
    this.rotate();
  },

  rotate: function() {
  	var newAngle = this.state.spinnerAngle % 360 + 10;
    this.setState({spinnerAngle: newAngle});
    this.timer = setTimeout(this.rotate, 30);
  },

  render: function() {
  	var thisSpinnerStyle = spinnerStyle.style;
  	spinnerStyle.WebkitTransform = "translate(-50%, -50%) rotate(" + this.state.spinnerAngle + "deg)";
  	spinnerStyle.MozTransform = "translate(-50%, -50%) rotate(" + this.state.spinnerAngle + "deg)";
  	spinnerStyle.msTransform = "translate(-50%, -50%) rotate(" + this.state.spinnerAngle + "deg)";
  	return (
  	  <div className="loadingScreen" style={startScreenStyle.style}>
        <div className="spinner">
          <img src="http://www.clipro.tv/demo_request/_assets/images/icons/ooyala_ico.png" style={thisSpinnerStyle}></img>
        </div>
      </div>
  	);
  }
});