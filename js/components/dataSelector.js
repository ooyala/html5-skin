var React = require('react'),
    ClassNames = require('classnames'),
    AccessibleButton = require('./accessibleButton'),
    AccessibleMenu = require('./higher-order/accessibleMenu'),
    Icon = require('./icon'),
    CONSTANTS = require('../constants/constants');

var DataSelector = React.createClass({

  getInitialState: function() {
    this.leftChevronBtn = null;
    this.rightChevronBtn = null;

    return {
      currentPage: 1,
      autoFocusFirst: false,
      autoFocusLast: false
    };
  },

  handleDataSelection: function(dataItem) {
    this.props.onDataChange(dataItem);
  },

  handleLeftChevronClick: function(event) {
    event.preventDefault();
    var autoFocusLast = this.checkAndResetAutoFocus(this.leftChevronBtn);

    this.setState({
      currentPage: this.state.currentPage - 1,
      autoFocusFirst: false,
      autoFocusLast: autoFocusLast
    });
  },

  handleRightChevronClick: function(event) {
    event.preventDefault();
    var autoFocusFirst = this.checkAndResetAutoFocus(this.rightChevronBtn)

    this.setState({
      currentPage: this.state.currentPage + 1,
      autoFocusFirst: autoFocusFirst,
      autoFocusLast: false
    });
  },

  /**
   * Determines whether the given chevron button was triggered with a keyboard, which would
   * require us to use autofocus when rendering the new page that we're swithing to. Note that
   * calling this function will reset the button's triggered with keyboard state.
   * @private
   * @param {AccessibleButton} chevronBtn Either the right or left chevron button of this component.
   * @return {Boolean} True if button state suggests that auto focus is required, false otherwise.
   */
  checkAndResetAutoFocus: function(chevronBtn) {
    var autoFocus = false;

    if (chevronBtn && typeof chevronBtn.wasTriggeredWithKeyboard === 'function') {
      autoFocus = chevronBtn.wasTriggeredWithKeyboard();
      chevronBtn.wasTriggeredWithKeyboard(false);
    }
    return autoFocus;
  },

  componentWillReceiveProps: function(nextProps) {
    //If we are changing view sizes, adjust the currentPage number to reflect the new number of items per page.
    if (nextProps.responsiveView != this.props.viewSize) {
      var currentViewSize = this.props.viewSize;
      var nextViewSize = nextProps.responsiveView;
      var firstDataIndex = this.state.currentPage * this.props.dataItemsPerPage[currentViewSize] - this.props.dataItemsPerPage[currentViewSize];
      var newCurrentPage = Math.floor(firstDataIndex/nextProps.dataItemsPerPage[nextViewSize]) + 1;
      this.setState({
        currentPage: newCurrentPage
      });
    }
  },

  setClassname: function(item) {
    return ClassNames({
      'oo-item': true,
      'oo-item-selected': this.props.selectedData == item && this.props.enabled,
      'oo-disabled': !this.props.enabled
    });
  },

  render: function() {
    //pagination
    var currentViewSize = this.props.viewSize;
    var dataItemsPerPage = this.props.dataItemsPerPage[currentViewSize];
    var startAt = dataItemsPerPage * (this.state.currentPage - 1);
    var endAt = dataItemsPerPage * this.state.currentPage;
    var dataItems = this.props.availableDataItems.slice(startAt, endAt);

    //Build data content blocks
    var dataContentBlocks = [];
    for (var i = 0; i < dataItems.length; i++) {
      //accent color
      var isSelected = this.props.selectedData === dataItems[i];
      var selectedItemStyle = {};
      if (isSelected && this.props.enabled && this.props.skinConfig.general.accentColor) {
        selectedItemStyle = {backgroundColor: this.props.skinConfig.general.accentColor};
      }

      var autoFocusFirst = this.state.autoFocusFirst && i === 0;
      var autoFocusLast = this.state.autoFocusLast && i === dataItems.length - 1;

      dataContentBlocks.push(
        <AccessibleButton
          key={i}
          autoFocus={autoFocusFirst || autoFocusLast}
          className={this.setClassname(dataItems[i])}
          style={selectedItemStyle}
          ariaLabel={dataItems[i]}
          ariaChecked={isSelected}
          role={CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO}
          onClick={this.handleDataSelection.bind(this, dataItems[i])}>
          <span className="oo-data">{dataItems[i]}</span>
        </AccessibleButton>
      );
    }

    var leftChevron = ClassNames({
      'oo-left-button': true,
      'oo-hidden': !this.props.enabled || this.state.currentPage <= 1
    });
    var rightChevron = ClassNames({
      'oo-right-button': true,
      'oo-hidden': !this.props.enabled || endAt >= this.props.availableDataItems.length
    });

    return(
      <div
        className="oo-data-selector"
        aria-label={this.props.ariaLabel}
        role={CONSTANTS.ARIA_ROLES.MENU}>

        <AccessibleButton
          ref={function(e) {this.leftChevronBtn = e}.bind(this)}
          className={leftChevron}
          ariaLabel={CONSTANTS.ARIA_LABELS.PREVIOUS_OPTIONS}
          role={CONSTANTS.ARIA_ROLES.MENU_ITEM}
          onClick={this.handleLeftChevronClick}>
          <Icon
            {...this.props}
            icon="left"
          />
        </AccessibleButton>

        <div className="oo-data-panel oo-flexcontainer">
          {dataContentBlocks}
        </div>

        <AccessibleButton
          ref={function(e) {this.rightChevronBtn = e}.bind(this)}
          className={rightChevron}
          ariaLabel={CONSTANTS.ARIA_LABELS.MORE_OPTIONS}
          role={CONSTANTS.ARIA_ROLES.MENU_ITEM}
          onClick={this.handleRightChevronClick}>
          <Icon
            {...this.props}
            icon="right"
          />
        </AccessibleButton>

      </div>
    );
  }
});

DataSelector = AccessibleMenu(DataSelector, { useRovingTabindex: true });

module.exports = DataSelector;
