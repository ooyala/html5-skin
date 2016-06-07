var React = require('react'),
    ClassNames = require('classnames'),
    SelectionContainer = require('./selectionContainer');

var TextEnhancementsTab = React.createClass({
  getInitialState: function() {
    return {
      selectedTextEnhancement: this.props.closedCaptionOptions.textEnhancement
    };
  },

  changeTextEnhancement: function(textEnhancement) {
    if (this.props.closedCaptionOptions.enabled){
      this.props.controller.onClosedCaptionTextEnhancementChange(textEnhancement);
      this.setState({
        selectedTextEnhancement: textEnhancement
      });
    }
  },

  setClassname: function(item, elementType) {
    return ClassNames({
      'oo-text-enhancement-letter': elementType == "letter",
      'oo-text-enhancement-label': elementType == "label",
      'oo-text-enhancement-selected': this.props.closedCaptionOptions.textEnhancement == item && this.props.closedCaptionOptions.enabled,
      'oo-text-enhancement-label-selected': this.props.closedCaptionOptions.textEnhancement == item && this.props.closedCaptionOptions.enabled && elementType == "label",
      'oo-disabled': !this.props.closedCaptionOptions.enabled
    });
  },

  render: function() {
    var textEnhancements = ["Uniform", "Depressed", "Raised", "Shadow"];
    var textEnhancementItems = [];
    for(var i = 0; i < textEnhancements.length; i++) {
      textEnhancementItems.push(
        <a className="oo-text-enhancements-container" onClick={this.changeTextEnhancement.bind(this, textEnhancements[i])} key={i}>
          <div className={this.setClassname(textEnhancements[i], "letter") + " oo-text-enhancement-letter-" + textEnhancements[i]}>A</div>
          <div className={this.setClassname(textEnhancements[i], "label")}>{textEnhancements[i]}</div>
        </a>
      );
    }

    return (
      <div className="oo-text-enhancements-tab">
        <div className="oo-text-enhancements-inner-wrapper">
          <SelectionContainer
            title="Text Enhancement"
            selectionText={this.props.closedCaptionOptions.textEnhancement}
            >
            {textEnhancementItems}
          </SelectionContainer>
        </div>
      </div>
    );
  }
});

module.exports = TextEnhancementsTab;