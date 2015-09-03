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
    if(this.isMounted()) {
  	  var newAngle = this.state.spinnerAngle % 360 + 10;
      this.setState({spinnerAngle: newAngle});
      this.timer = setTimeout(this.rotate, 30);
    }
  },

  render: function() {
    var mSpinnerStyle = spinnerStyle.style;
    mSpinnerStyle.WebkitTransform = "translate(-50%, -50%) rotate(" + this.state.spinnerAngle + "deg)";
    mSpinnerStyle.MozTransform = "translate(-50%, -50%) rotate(" + this.state.spinnerAngle + "deg)";
    mSpinnerStyle.msTransform = "translate(-50%, -50%) rotate(" + this.state.spinnerAngle + "deg)";
    mSpinnerStyle.transform = "translate(-50%, -50%) rotate(" + this.state.spinnerAngle + "deg)";
    return (
      <div className="loadingScreen" style={startScreenStyle.style}>
        <div className="spinner">
          <img src="http://www.clipro.tv/demo_request/_assets/images/icons/ooyala_ico.png" style={mSpinnerStyle}></img>
        </div>
      </div>
    );
  }
});