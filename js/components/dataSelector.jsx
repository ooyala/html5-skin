import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import AccessibleButton from './accessibleButton';
import AccessibleMenu from './higher-order/accessibleMenu';
import Icon from './icon';
import CONSTANTS from '../constants/constants';

/**
 * Data selector component
 */
class DataSelectorProto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
    };
  }

  componentWillMount() {
    this.leftChevronBtn = null;
    this.rightChevronBtn = null;
    this.itemButtons = {};
    this.autoFocus = {
      first: false,
      last: false,
      selected: false,
    };
  }

  /**
   * Returns a callback function that can be used to store the ref of the item button
   * identified by the value of dataItem. This is needed because the buttons are added
   * in a loop and ref is async, so we need to freeze the value of dataItem with the closure.
   * @private
   * @param {String} dataItem The value of the data button whose ref we want to store.
   * @returns {Function} A callback that will store the ref of the corresponding item button.
   */
  getItemButtonRefCallback = dataItem => (component) => {
    this.itemButtons[dataItem] = component;
  }

  /**
   * Set className based on item provided
   * @param {Object} item - item object
   * @returns {Object} of classnames
   */
  setClassname = (item) => {
    const { selectedData, enabled } = this.props;
    return ClassNames({
      'oo-item': true,
      'oo-item-selected': selectedData === item && enabled,
      'oo-disabled': !enabled,
    });
  }

  resetAutoFocus = () => {
    this.autoFocus.first = false;
    this.autoFocus.last = false;
    this.autoFocus.selected = false;
  }

  /**
   * Handle data was selected
   * @param {Object} dataItem - the dataItem
   */
  handleDataSelection = (dataItem) => {
    const { onDataChange } = this.props;
    this.resetAutoFocus();
    this.autoFocus.selected = this.checkAndResetBtnAutoFocus(this.itemButtons[dataItem]);
    onDataChange(dataItem);
  }

  /**
   * Handle left chevron click
   * @param {Object} event – event
   */
  handleLeftChevronClick = (event) => {
    event.preventDefault();
    this.resetAutoFocus();
    this.autoFocus.last = this.checkAndResetBtnAutoFocus(this.leftChevronBtn);
    const { currentPage } = this.state;
    this.setState({
      currentPage: currentPage - 1,
    });
  }

  /**
   * Handle right chevron click
   * @param {Object} event – event
   */
  handleRightChevronClick = (event) => {
    event.preventDefault();
    this.resetAutoFocus();
    this.autoFocus.first = this.checkAndResetBtnAutoFocus(this.rightChevronBtn);
    const { currentPage } = this.state;
    this.setState({
      currentPage: currentPage + 1,
    });
  }

  /**
   * Determines whether the given button was triggered with a keyboard, which might
   * require us to use autofocus after rendering. Note that calling this function will
   * reset the button's triggered with keyboard state.
   * @private
   * @param {AccessibleButton} accessibleButton The button component which we want to check.
   * @returns {Boolean} True if button state suggests that auto focus is required, false otherwise.
   */
  checkAndResetBtnAutoFocus = (accessibleButton) => {
    let autoFocus = false;

    if (accessibleButton && typeof accessibleButton.wasTriggeredWithKeyboard === 'function') {
      autoFocus = accessibleButton.wasTriggeredWithKeyboard();
      accessibleButton.wasTriggeredWithKeyboard(false);
    }
    return autoFocus;
  }

  /**
   * If we are changing view sizes, adjust the currentPage number to reflect the new number of items per page
   * @param {Object} nextProps – next props object
   */
  componentWillReceiveProps = (nextProps) => {
    const { viewSize, dataItemsPerPage } = this.props;
    const { currentPage } = this.state;
    if (nextProps.viewSize !== viewSize) {
      const currentViewSize = viewSize;
      const nextViewSize = nextProps.viewSize;
      const firstDataIndex = currentPage * dataItemsPerPage[currentViewSize]
        - dataItemsPerPage[currentViewSize];
      const newCurrentPage = Math.floor(firstDataIndex / nextProps.dataItemsPerPage[nextViewSize]) + 1;
      this.setState({
        currentPage: newCurrentPage,
      });
    }
  }

  /**
   * Define if item should be auto focused
   * @param {Array} dataItems - array of data items
   * @param {Object} itemIndex - index of item
   * @param {boolean} isSelected - is item selected
   * @returns {boolean} should or not
   */
  shouldAutoFocusItem = (dataItems, itemIndex, isSelected) => {
    const autoFocusFirst = this.autoFocus.first && itemIndex === 0;
    const autoFocusLast = this.autoFocus.last && itemIndex === dataItems.length - 1;
    const autoFocusSelected = this.autoFocus.selected && isSelected;
    const autoFocus = autoFocusFirst || autoFocusLast || autoFocusSelected;
    return autoFocus;
  }

  render() {
    const {
      ariaLabel,
      viewSize,
      dataItemsPerPage,
      availableDataItems,
      selectedData,
      enabled,
      skinConfig,
    } = this.props;
    const { currentPage } = this.state;
    const currentViewSize = viewSize;
    const currentDataItemsPerPage = dataItemsPerPage[currentViewSize];
    const startAt = currentDataItemsPerPage * (currentPage - 1);
    const endAt = currentDataItemsPerPage * currentPage;
    const dataItems = availableDataItems.slice(startAt, endAt);

    // Build data content blocks
    const dataContentBlocks = [];
    dataItems.forEach((currentDataItem, index) => {
      // accent color
      const isSelected = selectedData === currentDataItem;
      let selectedItemStyle = {};
      if (isSelected && enabled && skinConfig.general.accentColor) {
        selectedItemStyle = { backgroundColor: skinConfig.general.accentColor };
      }
      // Determine whether we should auto focus or not
      const autoFocus = this.shouldAutoFocusItem(dataItems, index, isSelected);

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
          onClick={() => this.handleDataSelection(currentDataItem)}
        >
          <span className="oo-data">{currentDataItem}</span>
        </AccessibleButton>
      );
    });

    const leftChevron = ClassNames({
      'oo-left-button': true,
      'oo-hidden': !enabled || currentPage <= 1,
    });
    const rightChevron = ClassNames({
      'oo-right-button': true,
      'oo-hidden': !enabled || endAt >= availableDataItems.length,
    });

    return (
      <div className="oo-data-selector" aria-label={ariaLabel} role={CONSTANTS.ARIA_ROLES.MENU}>
        <AccessibleButton
          ref={(event) => { this.leftChevronBtn = event; }}
          className={leftChevron}
          ariaLabel={CONSTANTS.ARIA_LABELS.PREVIOUS_OPTIONS}
          role={CONSTANTS.ARIA_ROLES.MENU_ITEM}
          onClick={this.handleLeftChevronClick}
        >
          <Icon {...this.props} icon="left" />
        </AccessibleButton>

        <div className="oo-data-panel oo-flexcontainer">{dataContentBlocks}</div>

        <AccessibleButton
          ref={(event) => { this.rightChevronBtn = event; }}
          className={rightChevron}
          ariaLabel={CONSTANTS.ARIA_LABELS.MORE_OPTIONS}
          role={CONSTANTS.ARIA_ROLES.MENU_ITEM}
          onClick={this.handleRightChevronClick}
        >
          <Icon {...this.props} icon="right" />
        </AccessibleButton>
      </div>
    );
  }
}

const DataSelector = AccessibleMenu(DataSelectorProto, { useRovingTabindex: true });

DataSelectorProto.propTypes = {
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

DataSelectorProto.defaultProps = {
  selectedData: '',
  dataItemsPerPage: { sm: 10, md: 10, lg: 10 },
  ariaLabel: PropTypes.string,
  skinConfig: { general: { accentColor: '' } },
};

module.exports = DataSelector;
