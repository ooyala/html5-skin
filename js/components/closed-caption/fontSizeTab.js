var React = require('react'),
    ClassNames = require('classnames'),
    SelectionContainer = require('./selectionContainer');

var FontSizeTab = React.createClass({
  getInitialState: function() {
    return {
      selectedFontSize: this.props.closedCaptionOptions.fontSize
    };
  },

  changeFontSize: function(fontSize) {
    if (this.props.closedCaptionOptions.enabled){
      this.props.controller.onClosedCaptionFontSizeChange(fontSize);
      this.setState({
        selectedFontSize: fontSize
      });
    }
  },

  setClassname: function(item, elementType) {
    return ClassNames({
      'oo-font-size-letter': elementType == "letter",
      'oo-font-size-label': elementType == "label",
      'oo-font-size-selected': this.props.closedCaptionOptions.fontSize == item && this.props.closedCaptionOptions.enabled,
      'oo-font-size-label-selected': this.props.closedCaptionOptions.fontSize == item && this.props.closedCaptionOptions.enabled && elementType == "label",
      'oo-disabled': !this.props.closedCaptionOptions.enabled
    });
  },

  render: function() {
    var fontSizes = ["Small", "Medium", "Large", "Extra Large"];
    var fontItems = [];
    for(var i = 0; i < fontSizes.length; i++) {
      fontItems.push(
        <a className="oo-font-size-container" onClick={this.changeFontSize.bind(this, fontSizes[i])} key={i}>
          <div className={this.setClassname(fontSizes[i], "letter") + " oo-font-size-letter-" + fontSizes[i].replace(" ", "-")}>A</div>
          <div className={this.setClassname(fontSizes[i], "label")}>{fontSizes[i]}</div>
        </a>
      );
    }

    return (
      <div className="oo-font-size-tab">
        <div className="oo-font-size-inner-wrapper">
          <SelectionContainer
            title="Font size"
            selectionText={this.props.closedCaptionOptions.fontSize}
            >
            {fontItems}
          </SelectionContainer>
        </div>
      </div>
    );
  }
});

module.exports = FontSizeTab;