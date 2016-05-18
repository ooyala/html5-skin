var React = require('react'),
    DataSelector = require('../dataSelector');

var FontTypeTab = React.createClass({
  getInitialState: function() {
    return {
      selectedFontType: this.props.closedCaptionOptions.fontType
    };
  },

  changeFontType: function(fontType){
    if (this.props.closedCaptionOptions.enabled){
      this.props.controller.onClosedCaptionFontTypeChange(fontType);
      this.setState({
        selectedFontType: fontType
      });
    }
  },

  render: function(){
    var availableFontTypes = ["Helvetica", "Georgia", "Comic Sans", "Impact", "Times New Roman", "Tahoma", "Verdana", "Courier New", "Lucida Console"];

    return(
      <div className="oo-font-type-tab">
        <DataSelector
          {...this.props}
          viewSize={this.props.responsiveView}
          dataItemsPerPage={this.props.dataItemsPerPage}
          selectedData={this.state.selectedFontType}
          enabled={this.props.closedCaptionOptions.enabled}
          availableDataItems={availableFontTypes}
          onDataChange={this.changeFontType}
        />
      </div>
    );
  }
});

FontTypeTab.propTypes = {
  dataItemsPerPage: React.PropTypes.objectOf(React.PropTypes.number)
};

FontTypeTab.defaultProps = {
  dataItemsPerPage: {
    xs: 1,
    sm: 4,
    md: 4,
    lg: 15
  },
  responsiveView: 'md'
};

module.exports = FontTypeTab;