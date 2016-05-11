var React = require('react'),
    ClassNames = require('classnames'),
    ScrollArea = require('react-scrollbar/dist/no-css'),
    SelectionContainer = require('./selectionContainer'),
    ColorSelector = require('../colorSelector');

var ColorSelectionTab = React.createClass({

  getInitialState: function() {
    return {
      selectedTextColor: this.props.closedCaptionOptions.textColor,
      selectedWindowColor: this.props.closedCaptionOptions.windowColor,
      selectedBackgroundColor: this.props.closedCaptionOptions.backgroundColor
    };
  },

  changeTextColor: function(color){
    if (this.props.closedCaptionOptions.enabled){
      this.props.controller.onClosedCaptionTextColorChange(color);
      this.setState({
        selectedTextColor: color,
      });
    }
  },

  changeWindowColor: function(color){
    if (this.props.closedCaptionOptions.enabled){
      this.props.controller.onClosedCaptionWindowColorChange(color);
      this.setState({
        selectedWindowColor: color,
      });
    }
  },

  changeBackgroundColor: function(color){
    if (this.props.closedCaptionOptions.enabled){
      this.props.controller.onClosedCaptionBackgroundColorChange(color);
      this.setState({
        selectedBackgroundColor: color,
      });
    }
  },

  render: function(){
    var textColors = ["White", "Blue", "Magenta", "Green", "Yellow", "Red", "Cyan", "Black"];
    var windowColors = ["White", "Blue", "Magenta", "Green", "Yellow", "Red", "Cyan", "Black", "Transparent"];
    var backgroundColors = ["White", "Blue", "Magenta", "Green", "Yellow", "Red", "Cyan", "Black", "Transparent"];

    return(
      <div className="oo-color-selection-tab">
        <SelectionContainer
          title="Text Color"
          selectionText={this.props.closedCaptionOptions.textColor}
          >
          <ColorSelector
            {...this.props}
            colors={textColors}
            onColorChange={this.changeTextColor}
            selectedColor={this.props.closedCaptionOptions.textColor}
          />
        </SelectionContainer>

        <SelectionContainer
          title="Window Color"
          selectionText={this.props.closedCaptionOptions.windowColor}
          >
          <ColorSelector
            {...this.props}
            colors={windowColors}
            onColorChange={this.changeWindowColor}
            selectedColor={this.props.closedCaptionOptions.windowColor}
          />
        </SelectionContainer>

        <SelectionContainer
          title="Background Color"
          selectionText={this.props.closedCaptionOptions.backgroundColor}
          >
          <ColorSelector
            {...this.props}
            colors={backgroundColors}
            onColorChange={this.changeBackgroundColor}
            selectedColor={this.props.closedCaptionOptions.backgroundColor}
          />
        </SelectionContainer>
      </div>
    );
  }
});

module.exports = ColorSelectionTab;