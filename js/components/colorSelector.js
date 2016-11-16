var React = require('react'),
    ClassNames = require('classnames');

var ColorSelector = React.createClass({
  setClassname: function(item){
    return ClassNames({
      'oo-item': true,
      'oo-item-selected': this.props.selectedColor == item && this.props.enabled,
      'oo-disabled': !this.props.enabled
    });
  },

  handleColorSelection: function(color) {
    this.props.onColorChange(color);
  },

  render: function() {
    var colorItems = [];

    var activeColorStyle = {};
    var selectedColorStyle =  "solid ";
    selectedColorStyle += this.props.skinConfig.controlBar.iconStyle.active.color ? 
                           this.props.skinConfig.controlBar.iconStyle.active.color : 
                           this.props.skinConfig.general.accentColor;

    var activeColorStyle = { border: selectedColorStyle};

    for (var i = 0; i < this.props.colors.length; i++) {
      if( this.setClassname(this.props.colors[i]) === 'oo-item oo-item-selected') { 
        var selectedColorStyle =  "solid ";
        selectedColorStyle += this.props.skinConfig.controlBar.iconStyle.active.color ? 
                           this.props.skinConfig.controlBar.iconStyle.active.color : 
                           this.props.skinConfig.general.accentColor;

        activeColorStyle = { border: selectedColorStyle};
      }
      else {
        activeColorStyle = {};
      }
      colorItems.push(
        <div className={this.setClassname(this.props.colors[i])} key={i} style={activeColorStyle}>
          <a className={"oo-color-item oo-color-item-" + this.props.colors[i]} onClick={this.handleColorSelection.bind(this, this.props.colors[i])}></a>
        </div>
      );
    }

    return (
      <div className="oo-color-selector">
        {colorItems}
      </div>
    );
  }
});

module.exports = ColorSelector;
