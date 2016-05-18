var React = require('react'),
    ClassNames = require('classnames'),
    SelectionContainer = require('./selectionContainer'),
    Slider = require('../slider');

var CaptionOpacityTab = React.createClass({

  changeTextOpacity: function(event) {
    if (this.props.closedCaptionOptions.enabled && event.type == "change"){
      var value = event.target.value;
      this.props.controller.onClosedCaptionTextOpacityChange(value);
    }
  },

  changeBackgroundOpacity: function(event) {
    if (this.props.closedCaptionOptions.enabled && event.type == "change"){
      var value = event.target.value;
      this.props.controller.onClosedCaptionBackgroundOpacityChange(value);
    }
  },

  changeWindowOpacity: function(event) {
    if (this.props.closedCaptionOptions.enabled && event.type == "change"){
      var value = event.target.value;
      this.props.controller.onClosedCaptionWindowOpacityChange(value);
    }
  },

  percentString: function(number) {
    if (number == 0) return "Transparent";
    return (number * 100).toString() + "%"
  },

  render: function(){
    return(
      <div className="oo-caption-opacity-tab">
        <SelectionContainer
          title="Text Opacity"
          selectionText={this.percentString(this.props.closedCaptionOptions.textOpacity)}
          >
          <Slider
            value={parseFloat(this.props.closedCaptionOptions.textOpacity)}
            onChange={this.changeTextOpacity}
            className={"oo-slider oo-slider-caption-opacity"}
            itemRef={"textOpacitySlider"}
            minValue={"0"}
            maxValue={"1"}
            step={"0.1"}
          />
        </SelectionContainer>

        <SelectionContainer
          title="Background Opacity"
          selectionText={this.percentString(this.props.closedCaptionOptions.backgroundOpacity)}
          >
          <Slider
            value={parseFloat(this.props.closedCaptionOptions.backgroundOpacity)}
            onChange={this.changeBackgroundOpacity}
            className={"oo-slider oo-slider-caption-opacity"}
            itemRef={"backgroundOpacitySlider"}
            minValue={"0"}
            maxValue={"1"}
            step={"0.1"}
          />
        </SelectionContainer>

        <SelectionContainer
          title="Window Opacity"
          selectionText={this.percentString(this.props.closedCaptionOptions.windowOpacity)}
          >
          <Slider
            value={parseFloat(this.props.closedCaptionOptions.windowOpacity)}
            onChange={this.changeWindowOpacity}
            className={"oo-slider oo-slider-caption-opacity"}
            itemRef={"windowOpacitySlider"}
            minValue={"0"}
            maxValue={"1"}
            step={"0.1"}
          />
        </SelectionContainer>
      </div>
    );
  }
});

module.exports = CaptionOpacityTab;