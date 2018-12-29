const React = require('react');

const ClassNames = require('classnames');

const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const AccessibleButton = require('./accessibleButton');

const AccessibleMenu = require('./higher-order/accessibleMenu');

const Icon = require('./icon');

const CONSTANTS = require('../constants/constants');

let DataSelector = createReactClass({
  getInitialState() {
    return {
      currentPage: 1,
    };
  },

  componentWillMount() {
    this.leftChevronBtn = null;
    this.rightChevronBtn = null;
    this.itemButtons = {};
    this.autoFocus = {
      first: false,
      last: false,
      selected: false,
    };
  },

  resetAutoFocus() {
    this.autoFocus.first = false;
    this.autoFocus.last = false;
    this.autoFocus.selected = false;
  },

  handleDataSelection(dataItem) {
    this.resetAutoFocus();
    this.autoFocus.selected = this.checkAndResetBtnAutoFocus(this.itemButtons[dataItem]);
    this.props.onDataChange(dataItem);
  },

  handleLeftChevronClick(event) {
    event.preventDefault();
    this.resetAutoFocus();
    this.autoFocus.last = this.checkAndResetBtnAutoFocus(this.leftChevronBtn);

    this.setState({
      currentPage: this.state.currentPage - 1,
    });
  },

  handleRightChevronClick(event) {
    event.preventDefault();
    this.resetAutoFocus();
    this.autoFocus.first = this.checkAndResetBtnAutoFocus(this.rightChevronBtn);

    this.setState({
      currentPage: this.state.currentPage + 1,
    });
  },

  /**
   * Determines whether the given button was triggered with a keyboard, which might
   * require us to use autofocus after rendering. Note that calling this function will
   * reset the button's triggered with keyboard state.
   * @private
   * @param {AccessibleButton} accessibleButton The button component which we want to check.
   * @returns {Boolean} True if button state suggests that auto focus is required, false otherwise.
   */
  checkAndResetBtnAutoFocus(accessibleButton) {
    let autoFocus = false;

    if (accessibleButton && typeof accessibleButton.wasTriggeredWithKeyboard === 'function') {
      autoFocus = accessibleButton.wasTriggeredWithKeyboard();
      accessibleButton.wasTriggeredWithKeyboard(false);
    }
    return autoFocus;
  },

  componentWillReceiveProps(nextProps) {
    // If we are changing view sizes, adjust the currentPage number to reflect the new number of items per page.
    if (nextProps.viewSize !== this.props.viewSize) {
      const currentViewSize = this.props.viewSize;
      const nextViewSize = nextProps.viewSize;
      const firstDataIndex = this.state.currentPage * this.props.dataItemsPerPage[currentViewSize]
        - this.props.dataItemsPerPage[currentViewSize];
      const newCurrentPage = Math.floor(firstDataIndex / nextProps.dataItemsPerPage[nextViewSize]) + 1;
      this.setState({
        currentPage: newCurrentPage,
      });
    }
  },

  setClassname(item) {
    return ClassNames({
      'oo-item': true,
      'oo-item-selected': this.props.selectedData === item && this.props.enabled,
      'oo-disabled': !this.props.enabled,
    });
  },

  shouldAutoFocusItem(dataItems, itemIndex, isSelected) {
    const autoFocusFirst = this.autoFocus.first && itemIndex === 0;
    const autoFocusLast = this.autoFocus.last && itemIndex === dataItems.length - 1;
    const autoFocusSelected = this.autoFocus.selected && isSelected;
    const autoFocus = autoFocusFirst || autoFocusLast || autoFocusSelected;
    return autoFocus;
  },

  /**
   * Returns a callback function that can be used to store the ref of the item button
   * identified by the value of dataItem. This is needed because the buttons are added
   * in a loop and ref is async, so we need to freeze the value of dataItem with the closure.
   * @private
   * @param {String} dataItem The value of the data button whose ref we want to store.
   * @returns {Function} A callback that will store the ref of the corresponding item button.
   */
  getItemButtonRefCallback(dataItem) {
    const refCallback = function(component) {
      this.itemButtons[dataItem] = component;
    };
    return refCallback.bind(this);
  },

  render() {
    // pagination
    const currentViewSize = this.props.viewSize;
    const dataItemsPerPage = this.props.dataItemsPerPage[currentViewSize];
    const startAt = dataItemsPerPage * (this.state.currentPage - 1);
    const endAt = dataItemsPerPage * this.state.currentPage;
    const dataItems = this.props.availableDataItems.slice(startAt, endAt);

    // Build data content blocks
    const dataContentBlocks = [];
    for (let i = 0; i < dataItems.length; i++) {
      const currentDataItem = dataItems[i];
      // accent color
      const isSelected = this.props.selectedData === currentDataItem;
      let selectedItemStyle = {};
      if (isSelected && this.props.enabled && this.props.skinConfig.general.accentColor) {
        selectedItemStyle = { backgroundColor: this.props.skinConfig.general.accentColor };
      }
      // Determine whether we should auto focus or not
      const autoFocus = this.shouldAutoFocusItem(dataItems, i, isSelected);

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
          onClick={this.handleDataSelection.bind(this, currentDataItem)}
        >
          <span className="oo-data">{currentDataItem}</span>
        </AccessibleButton>
      );
    }

    const leftChevron = ClassNames({
      'oo-left-button': true,
      'oo-hidden': !this.props.enabled || this.state.currentPage <= 1,
    });
    const rightChevron = ClassNames({
      'oo-right-button': true,
      'oo-hidden': !this.props.enabled || endAt >= this.props.availableDataItems.length,
    });

    return (
      <div className="oo-data-selector" aria-label={this.props.ariaLabel} role={CONSTANTS.ARIA_ROLES.MENU}>
        <AccessibleButton
          ref={function(e) {
            this.leftChevronBtn = e;
          }.bind(this)}
          className={leftChevron}
          ariaLabel={CONSTANTS.ARIA_LABELS.PREVIOUS_OPTIONS}
          role={CONSTANTS.ARIA_ROLES.MENU_ITEM}
          onClick={this.handleLeftChevronClick}
        >
          <Icon {...this.props} icon="left" />
        </AccessibleButton>

        <div className="oo-data-panel oo-flexcontainer">{dataContentBlocks}</div>

        <AccessibleButton
          ref={function(e) {
            this.rightChevronBtn = e;
          }.bind(this)}
          className={rightChevron}
          ariaLabel={CONSTANTS.ARIA_LABELS.MORE_OPTIONS}
          role={CONSTANTS.ARIA_ROLES.MENU_ITEM}
          onClick={this.handleRightChevronClick}
        >
          <Icon {...this.props} icon="right" />
        </AccessibleButton>
      </div>
    );
  },
});

DataSelector = AccessibleMenu(DataSelector, { useRovingTabindex: true });

DataSelector.propTypes = {
  enabled: PropTypes.bool.isRequired,
  selectedData: PropTypes.string,
  availableDataItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  dataItemsPerPage: PropTypes.objectOf(PropTypes.number),
  viewSize: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string,
  onDataChange: PropTypes.func.isRequired,
  skinConfig: PropTypes.shape({
    general: PropTypes.shape({
      accentColor: PropTypes.string,
    }),
  }),
};

module.exports = DataSelector;
