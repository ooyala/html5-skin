import React from 'react';
import PropTypes from 'prop-types';
import CONSTANTS from '../../constants/constants';
import DataSelector from '../dataSelector';

/**
 * Manage font type screen
  */
class FontTypeTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFontType: props.closedCaptionOptions.fontType,
      availableFontTypes: [
        'Monospaced Serif',
        'Proportional Serif',
        'Monospaced Sans-Serif',
        'Proportional Sans-Serif',
        'Casual',
        'Cursive',
        'Small Capitals',
      ],
    };
  }

  /**
   * handle user selected new font type
   * @param {string} fontType - selected font type
   */
  changeFontType = (fontType) => {
    const { controller, closedCaptionOptions } = this.props;
    if (!closedCaptionOptions.enabled) {
      controller.toggleClosedCaptionEnabled();
    }
    controller.onClosedCaptionChange('fontType', fontType);
    this.setState({
      selectedFontType: fontType,
    });
  }

  render() {
    const {
      responsiveView,
      dataItemsPerPage,
      closedCaptionOptions,
    } = this.props;
    const { selectedFontType, availableFontTypes } = this.state;
    return (
      <div className="oo-font-type-tab">
        <DataSelector
          {...this.props}
          ariaLabel={CONSTANTS.ARIA_LABELS.FONT_TYPE_MENU}
          viewSize={responsiveView}
          dataItemsPerPage={dataItemsPerPage}
          selectedData={selectedFontType}
          enabled={closedCaptionOptions.enabled}
          availableDataItems={availableFontTypes}
          onDataChange={this.changeFontType}
        />
      </div>
    );
  }
}

FontTypeTab.propTypes = {
  dataItemsPerPage: PropTypes.objectOf(PropTypes.number),
  responsiveView: PropTypes.string,
};

FontTypeTab.defaultProps = {
  dataItemsPerPage: {
    xs: 1,
    sm: 4,
    md: 8,
    lg: 8,
  },
  responsiveView: 'md',
};

module.exports = FontTypeTab;
