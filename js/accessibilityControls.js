/********************************************************************
  ACCESSIBILITY CONTROLS
*********************************************************************/

var AccessibilityControls = React.createClass({
  getInitialState: function() {
    return {
      fastMultiple: 1,
      fastLast: null
    };
  },

  componentDidMount: function () {
    window.addEventListener('keydown', this.handleKey);
  },

   componentWillUnmount: function() {
    window.removeEventListener('keydown', this.handleKey);
  },

  handleKey: function(e) {
    var now;
    var newPlayheadTime;
    var newVolume;

    if (e.keyCode === 32){
      this.props.controller.togglePlayPause();
    }

    if ((e.keyCode === 40 && this.props.volume > 0) || (e.keyCode === 38 && this.props.volume < 1)){
      if (e.keyCode === 40){
        newVolume = (this.props.volume * 10 - 1)/10;
      }
      else {
        newVolume = (this.props.volume * 10 + 1)/10;
      }
      
      this.props.controlBar.setVolume(newVolume);
    }

    if (e.keyCode === 39 || e.keyCode === 37){
      var shift = 1;
      var fastMultipleIncrease = 1.1;
      now = Date.now();
      if (this.state.fastLast && now - this.state.fastLast < 500){
        //increasing the multiple to go faster if key is pressed often
        if (this.state.fastMultiple < 300){
          this.state.fastMultiple = this.state.fastMultiple * fastMultipleIncrease;
        }
      }
      else {
        this.state.fastMultiple = 1;
      }
      this.state.fastLast = now;
      if (e.keyCode === 39){
        newPlayheadTime = this.props.currentPlayhead + shift * this.state.fastMultiple;
      }
      if (e.keyCode === 37){
        newPlayheadTime = this.props.currentPlayhead - shift * this.state.fastMultiple;
      }
      this.props.controller.seek(newPlayheadTime);
    }
  },
  render: function() {
    
    return (
      <div style={{height:'0', width:'0'}}></div>
    );
  }
});