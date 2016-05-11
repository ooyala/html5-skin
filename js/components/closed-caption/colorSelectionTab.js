var React = require('react'),
    ClassNames = require('classnames'),
    ScrollArea = require('react-scrollbar/dist/no-css');

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

  setTextColorClassname: function(item){
    return ClassNames({
      'oo-item': true,
      'oo-item-selected': this.props.closedCaptionOptions.textColor == item && this.props.closedCaptionOptions.enabled,
      'oo-disabled': !this.props.closedCaptionOptions.enabled
    });
  },

  setWindowColorClassname: function(item){
    return ClassNames({
      'oo-item': true,
      'oo-item-selected': this.props.closedCaptionOptions.windowColor == item && this.props.closedCaptionOptions.enabled,
      'oo-disabled': !this.props.closedCaptionOptions.enabled
    });
  },

  setBackgroundColorClassname: function(item){
    return ClassNames({
      'oo-item': true,
      'oo-item-selected': this.props.closedCaptionOptions.backgroundColor == item && this.props.closedCaptionOptions.enabled,
      'oo-disabled': !this.props.closedCaptionOptions.enabled
    });
  },

  render: function(){

    var textColors = ["White", "Blue", "Magenta", "Green", "Yellow", "Red", "Cyan", "Black"];
    var windowColors = ["White", "Blue", "Magenta", "Green", "Yellow", "Red", "Cyan", "Black", "Transparent"];
    var backgroundColors = ["White", "Blue", "Magenta", "Green", "Yellow", "Red", "Cyan", "Black", "Transparent"];

    var textColorItems = [];
    for (var i = 0; i < textColors.length; i++) {
      textColorItems.push(
        <div className={this.setTextColorClassname(textColors[i])}>
          <div className={"oo-color-item oo-color-item-" + textColors[i]} onClick={this.changeTextColor.bind(this, textColors[i])} key={i}></div>
        </div>
      );
    }
    var windowColorItems = [];
    for (var i = 0; i < windowColors.length; i++) {
      windowColorItems.push(
        <div className={this.setWindowColorClassname(windowColors[i])}>
          <div className={"oo-color-item oo-color-item-" + windowColors[i]} onClick={this.changeWindowColor.bind(this, windowColors[i])} key={i}></div>
        </div>
      );
    }
    var backgroundColorItems = [];
    for (var i = 0; i < backgroundColors.length; i++) {
      backgroundColorItems.push(
        <div className={this.setBackgroundColorClassname(backgroundColors[i])}>
          <div className={"oo-color-item oo-color-item-" + backgroundColors[i]} onClick={this.changeBackgroundColor.bind(this, backgroundColors[i])} key={i}></div>
        </div>
      );
    }

    return(
      <div className="oo-color-selection-container">
        <div className="oo-color-selection-panel">
          <div className="oo-color-selection-title">
            Text Color: <span className="oo-color-selection-text">{this.props.closedCaptionOptions.textColor}</span>
          </div>
          <div className="oo-color-items-container">
            {textColorItems}
          </div>
        </div>

        <div className="oo-color-selection-panel">
          <div className="oo-color-selection-title">
            Window Color: <span className="oo-color-selection-text">{this.props.closedCaptionOptions.windowColor}</span>
          </div>
          <div className="oo-color-items-container">
            {windowColorItems}
          </div>
        </div>

        <div className="oo-color-selection-panel">
          <div className="oo-color-selection-title">
            Background Color: <span className="oo-color-selection-text">{this.props.closedCaptionOptions.backgroundColor}</span>
          </div>
          <div className="oo-color-items-container">
            {backgroundColorItems}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ColorSelectionTab;