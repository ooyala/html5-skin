var React = require('react'),
    ClassNames = require('classnames'),
    AccessibleButton = require('./accessibleButton'),
    AccessibleMenu = require('./higher-order/accessibleMenu'),
    Icon = require('./icon'),
    CONSTANTS = require('../constants/constants');

var DataSelector = React.createClass({

  getInitialState: function() {
    return {
      currentPage: 1
    };
  },

  componentWillMount: function() {
    this.leftChevronBtn = null;
    this.rightChevronBtn = null;
    this.itemButtons = {};
    this.autoFocus = {
      first: false,
      last: false,
      selected: false
    };
  },

  resetAutoFocus: function() {
    this.autoFocus.first = false;
    this.autoFocus.last = false;
    this.autoFocus.selected = false;
  },

  handleDataSelection: function(dataItem) {
    this.resetAutoFocus();
    this.autoFocus.selected = this.checkAndResetBtnAutoFocus(this.itemButtons[dataItem]);
    this.props.onDataChange(dataItem);
  },

  handleLeftChevronClick: function(event) {
    event.preventDefault();
    this.resetAutoFocus();
    this.autoFocus.last = this.checkAndResetBtnAutoFocus(this.leftChevronBtn);

    this.setState({
      currentPage: this.state.currentPage - 1
    });
  },

  handleRightChevronClick: function(event) {
    event.preventDefault();
    this.resetAutoFocus();
    this.autoFocus.first = this.checkAndResetBtnAutoFocus(this.rightChevronBtn);

    this.setState({
      currentPage: this.state.currentPage + 1
    });
  },

  /**
   * Determines whether the given button was triggered with a keyboard, which might
   * require us to use autofocus after rendering. Note that calling this function will
   * reset the button's triggered with keyboard state.
   * @private
   * @param {AccessibleButton} accessibleButton The button component which we want to check.
   * @return {Boolean} True if button state suggests that auto focus is required, false otherwise.
   */
  checkAndResetBtnAutoFocus: function(accessibleButton) {
    var autoFocus = false;

    if (accessibleButton && typeof accessibleButton.wasTriggeredWithKeyboard === 'function') {
      autoFocus = accessibleButton.wasTriggeredWithKeyboard();
      accessibleButton.wasTriggeredWithKeyboard(false);
    }
    return autoFocus;
  },

  componentWillReceiveProps: function(nextProps) {
    // If we are changing view sizes, adjust the currentPage number to reflect the new number of items per page.
    if (nextProps.viewSize !== this.props.viewSize) {
      var currentViewSize = this.props.viewSize;
      var nextViewSize = nextProps.viewSize;
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

  shouldAutoFocusItem: function(dataItems, itemIndex, isSelected) {
    var autoFocusFirst = this.autoFocus.first && itemIndex === 0;
    var autoFocusLast = this.autoFocus.last && itemIndex === dataItems.length - 1;
    var autoFocusSelected = this.autoFocus.selected && isSelected;
    var autoFocus = autoFocusFirst || autoFocusLast || autoFocusSelected;
    return autoFocus;
  },

  /**
   * Returns a callback function that can be used to store the ref of the item button
   * identified by the value of dataItem. This is needed because the buttons are added
   * in a loop and ref is async, so we need to freeze the value of dataItem with the closure.
   * @private
   * @param {String} dataItem The value of the data button whose ref we want to store.
   * @return {Function} A callback that will store the ref of the corresponding item button.
   */
  getItemButtonRefCallback: function(dataItem) {
    var refCallback = function(component) {
      this.itemButtons[dataItem] = component;
    };
    return refCallback.bind(this);
  },

  render: function() {
    // pagination
    var currentViewSize = this.props.viewSize;
    var dataItemsPerPage = this.props.dataItemsPerPage[currentViewSize];
    var startAt = dataItemsPerPage * (this.state.currentPage - 1);
    var endAt = dataItemsPerPage * this.state.currentPage;
    var dataItems = this.props.availableDataItems.slice(startAt, endAt);

    // Build data content blocks
    var dataContentBlocks = [];
    for (var i = 0; i < dataItems.length; i++) {
      var currentDataItem = dataItems[i];
      // accent color
      var isSelected = this.props.selectedData === currentDataItem;
      var selectedItemStyle = {};
      if (isSelected && this.props.enabled && this.props.skinConfig.general.accentColor) {
        selectedItemStyle = {backgroundColor: this.props.skinConfig.general.accentColor};
      }
      // Determine whether we should auto focus or not
      var autoFocus = this.shouldAutoFocusItem(dataItems, i, isSelected);

      dataContentBlocks.push(
        <AccessibleButton
          key={currentDataItem}
          ref={this.getItemButtonRefCallback(currentDataItem)}
          autoFocus={autoFocus}
          className={this.setClassname(currentDataItem)}
          style={selectedItemStyle}
          ariaLabel={currentDataItem}
          ariaChecked={isSelected}
          role={CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO}
          onClick={this.handleDataSelection.bind(this, currentDataItem)}>
          <span className="oo-data">{currentDataItem}</span>
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

    return (
      <div
        className="oo-data-selector"
        aria-label={this.props.ariaLabel}
        role={CONSTANTS.ARIA_ROLES.MENU}>

        <AccessibleButton
          ref={function(e) {this.leftChevronBtn = e;}.bind(this)}
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
          ref={function(e) {this.rightChevronBtn = e;}.bind(this)}
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

DataSelector.propTypes = {
  enabled: React.PropTypes.bool.isRequired,
  selectedData: React.PropTypes.string,
  availableDataItems: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  dataItemsPerPage: React.PropTypes.objectOf(React.PropTypes.number),
  viewSize: React.PropTypes.string.isRequired,
  ariaLabel: React.PropTypes.string,
  onDataChange: React.PropTypes.func.isRequired,
  skinConfig: React.PropTypes.shape({
    general: React.PropTypes.shape({
      accentColor: React.PropTypes.string
    })
  })
};

module.exports = DataSelector;
