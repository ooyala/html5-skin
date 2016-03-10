var React = require('react'),
ReactDOM = require('react-dom'),
Utils = require('./utils');

var Slider = React.createClass({

  componentDidMount: function() {
    this.handleSliderColoring();
  },

  handleSliderColoring: function(){
    if (!Utils.isEdge()){
      var input = this.refs[this.props.itemRef];
      var style = window.getComputedStyle(input, null);

      var colorBeforeThumb = style.getPropertyValue("border-left-color");
      var colorAfterThumb = style.getPropertyValue("border-right-color");

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
    }
  },

  changeValue: function(event) {
    if ((event.type == 'change' && !Utils.isIE()) || Utils.isIE()){
      this.props.onChange(event);
      this.handleSliderColoring();
    }
  },

  render: function() {
    return (
      <input type="range" className={this.props.className} min={this.props.minValue} max={this.props.maxValue} 
           value={this.props.value} step={this.props.step} ref={this.props.itemRef}
           onChange={this.changeValue} onClick={this.changeValue} onMouseMove={this.changeValue}/>
    );
  }
});
module.exports = Slider;