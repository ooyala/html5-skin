var React = require('react'),
    ClassNames = require('classnames');

var ColorSelector = React.createClass({

  setClassname: function(item){
    return ClassNames({
      'oo-item': true,
      'oo-item-selected': this.props.selectedColor == item && this.props.closedCaptionOptions.enabled,
      'oo-disabled': !this.props.closedCaptionOptions.enabled
    });
  },

  render: function() {
    var colorItems = [];
    for (var i = 0; i < this.props.colors.length; i++) {
      colorItems.push(
        <div className={this.setClassname(this.props.colors[i])}>
          <div className={"oo-color-item oo-color-item-" + this.props.colors[i]} onClick={this.props.onColorChange.bind(this, this.props.colors[i])} key={i}></div>
        </div>
      );
    }

    return(
      <span className="oo-color-selector">
        {colorItems}
      </span>
    );
  }
});

module.exports = ColorSelector;