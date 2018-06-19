var React = require('react'),
    CONSTANTS = require('../../constants/constants'),
    DataSelector = require('../dataSelector');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

var FontTypeTab = createReactClass({
  getInitialState: function() {
    return {
      selectedFontType: this.props.closedCaptionOptions.fontType,
      availableFontTypes: [
        'Monospaced Serif',
        'Proportional Serif',
        'Monospaced Sans-Serif',
        'Proportional Sans-Serif',
        'Casual',
        'Cursive',
        'Small Capitals'
      ]
    };
  },

  changeFontType: function(fontType) {
    if (!this.props.closedCaptionOptions.enabled) {
      this.props.controller.toggleClosedCaptionEnabled();
    }
    this.props.controller.onClosedCaptionChange('fontType', fontType);
    this.setState({
      selectedFontType: fontType
    });
  },

  render: function() {
    return (
      <div className="oo-font-type-tab">
        <DataSelector
          {...this.props}
          ariaLabel={CONSTANTS.ARIA_LABELS.FONT_TYPE_MENU}
          viewSize={this.props.responsiveView}
          dataItemsPerPage={this.props.dataItemsPerPage}
          selectedData={this.state.selectedFontType}
          enabled={this.props.closedCaptionOptions.enabled}
          availableDataItems={this.state.availableFontTypes}
          onDataChange={this.changeFontType}
        />
      </div>
    );
  }
});

FontTypeTab.propTypes = {
  dataItemsPerPage: PropTypes.objectOf(PropTypes.number)
};

FontTypeTab.defaultProps = {
  dataItemsPerPage: {
    xs: 1,
    sm: 4,
    md: 8,
    lg: 8
  },
  responsiveView: 'md'
};

module.exports = FontTypeTab;
