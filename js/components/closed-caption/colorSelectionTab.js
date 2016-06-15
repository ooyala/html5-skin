var React = require('react'),
    SelectionContainer = require('./selectionContainer'),
    ColorSelector = require('../colorSelector');

var ColorSelectionTab = React.createClass({

  getInitialState: function() {
    return {
      selectedTextColor: this.props.closedCaptionOptions.textColor,
      selectedWindowColor: this.props.closedCaptionOptions.windowColor,
      selectedBackgroundColor: this.props.closedCaptionOptions.backgroundColor,
      textColors: ["White", "Blue", "Magenta", "Green", "Yellow", "Red", "Cyan", "Black"],
      windowColors: ["Transparent", "White", "Blue", "Magenta", "Green", "Yellow", "Red", "Cyan", "Black"],
      backgroundColors: ["Transparent", "White", "Blue", "Magenta", "Green", "Yellow", "Red", "Cyan", "Black"]
    };
  },

  changeTextColor: function(color){
    if (this.props.closedCaptionOptions.enabled){
      this.props.controller.onClosedCaptionTextColorChange(color);
      this.setState({
        selectedTextColor: color
      });
    }
  },

  changeWindowColor: function(color){
    if (this.props.closedCaptionOptions.enabled){
      this.props.controller.onClosedCaptionWindowColorChange(color);
      this.setState({
        selectedWindowColor: color
      });
    }
  },

  changeBackgroundColor: function(color){
    if (this.props.closedCaptionOptions.enabled){
      this.props.controller.onClosedCaptionBackgroundColorChange(color);
      this.setState({
        selectedBackgroundColor: color
      });
    }
  },

  render: function(){
    return(
      <div className="oo-color-selection-tab">
        <div className="oo-color-selection-inner-wrapper">
          <SelectionContainer
            className="oo-text-color-selection-container"
            title="Text color"
            selectionText={this.props.closedCaptionOptions.textColor}
            >
            <div className="oo-text-color-items-container">
              <ColorSelector
                colors={this.state.textColors}
                onColorChange={this.changeTextColor}
                selectedColor={this.props.closedCaptionOptions.textColor}
                enabled={this.props.closedCaptionOptions.enabled}
              />
            </div>
          </SelectionContainer>

          <SelectionContainer
            title="Background color"
            selectionText={this.props.closedCaptionOptions.backgroundColor}
            >
            <ColorSelector
              colors={this.state.backgroundColors}
              onColorChange={this.changeBackgroundColor}
              selectedColor={this.props.closedCaptionOptions.backgroundColor}
              enabled={this.props.closedCaptionOptions.enabled}
            />
          </SelectionContainer>

          <SelectionContainer
            title="Window color"
            selectionText={this.props.closedCaptionOptions.windowColor}
            >
            <ColorSelector
              colors={this.state.windowColors}
              onColorChange={this.changeWindowColor}
              selectedColor={this.props.closedCaptionOptions.windowColor}
              enabled={this.props.closedCaptionOptions.enabled}
            />
          </SelectionContainer>
        </div>
      </div>
    );
  }
});

module.exports = ColorSelectionTab;