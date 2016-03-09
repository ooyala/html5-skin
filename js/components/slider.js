var React = require('react'),
ReactDOM = require('react-dom'),
Utils = require('./utils');

var Slider = React.createClass({

  componentDidMount: function() {
    this.handleSliderColoring();
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.value != this.props.value) {
      this.handleSliderColoring();
    }
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
        };
        input.oninput();
      }
    }
  },

  changeValue: function(event) {
    if (event.type == 'change' && !Utils.isIE()){
      this.props.onChange(event);
    }
    else if (Utils.isIE()){
      this.props.onChange(event);
    }
  },

  render: function() {
    return (
      <input type="range" className={this.props.className} min={this.props.minValue} max={this.props.maxValue} value={this.props.value}
           step={this.props.step} onChange={this.changeValue} onClick={this.changeValue} onMouseMove={this.changeValue}/>
    );
  }
});
module.exports = Slider;