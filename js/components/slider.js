var React = require('react'),
ReactDOM = require('react-dom'),
Utils = require('./utils');

var Slider = React.createClass({

  componentDidMount: function() {
    this.handleSliderColoring();
  },

  componentDidUpdate: function() {
    this.handleSliderColoring();
  },

  handleSliderColoring: function(){
    if (!Utils.isEdge()){
      var inputs = document.querySelectorAll('input[type=range]');
      for (var i = 0; i < inputs.length; i++) {
        input = inputs[i];

        var style = window.getComputedStyle(input, null);

        var colorBeforeThumb = style.getPropertyValue("border-left-color");
        var colorAfterThumb = style.getPropertyValue("border-right-color");

        input.oninput = function () {
          var value = (input.value - input.min)/(input.max - input.min);
          input.style.backgroundImage = [
            '-webkit-gradient(',
              'linear, ',
              'left top, ',
              'right top, ',
              'color-stop(' + value + ', '+ colorBeforeThumb + '), ',
              'color-stop(' + value + ', '+ colorAfterThumb + ')',
            ')'
          ].join('');

          // input.style.backgroundClip = 'content-box';
        };
        input.oninput();
      }
    }
  },

  changeValue: function(event) {
    if (event.type == 'change' && !Utils.isIE()){
      this.props.changeVolumeSlider(event);
    }
    else if (Utils.isIE()){
      this.props.changeVolumeSlider(event);
    }
  },

  render: function() {
    return (
      <input type="range" className={this.props.className} min={this.props.minValue} max={this.props.maxValue} value={this.props.volumeSliderValue}
           step={this.props.step} onChange={this.changeValue} onClick={this.changeValue} onMouseMove={this.changeValue}/>
    );
  }
});
module.exports = Slider;