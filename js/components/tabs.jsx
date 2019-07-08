import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import AccessibleButton from './accessibleButton';
import AccessibleMenu from './higher-order/accessibleMenu';
import CONSTANTS from '../constants/constants';
import Icon from './icon';

/**
 * Tabs implementation
 * @see https://github.com/pedronauck/react-simpletabs
 */
class TabsProto extends React.Component {
  constructor(props) {
    super(props);
    const { tabActive } = this.props;
    this.state = { tabActive };
  }

  /**
   * Change the state if active tab changed
   * @param {Object} newProps - new props object
   */
  componentWillReceiveProps(newProps) {
    const { tabActive } = this.props;
    if (newProps.tabActive && newProps.tabActive !== tabActive) {
      this.setState({ tabActive: newProps.tabActive });
    }
  }

  /**
   * Provide the panel selected currently
   * @returns {Object} React Component object
   */
  getSelectedPanel = () => {
    const { tabActive } = this.state;
    const { children } = this.props;
    const index = tabActive - 1;
    const panel = children[index];

    return (
      <div
        className="tab-panel"
        role={CONSTANTS.ARIA_ROLES.TAB_PANEL}
      >
        {panel}
      </div>
    );
  }

  /**
   * Provide the list of tab items
   * @returns {Array} the array of React components
   */
  getMenuItems = () => {
    const { children, skinConfig } = this.props;
    if (!children) {
      throw new Error('Tabs must contain at least one Tabs.Panel');
    }

    const menuItems = children
      .map(panel => (typeof panel === 'function' ? panel() : panel))
      .filter(panel => panel)
      .map(
        (panel, index) => {
          const tabIndex = index + 1;
          const { title } = panel.props;
          let activeTabStyle = {};
          const { tabActive } = this.state;
          const isSelected = tabActive === tabIndex;

          const classes = ClassNames('tabs-menu-item', `tabs-menu-item-${index}`, {
            'is-active': isSelected,
          });

          // accent color
          if (isSelected && skinConfig.general.accentColor) {
            let activeMenuColor = 'solid ';
            activeMenuColor += skinConfig.general.accentColor;
            activeTabStyle = { borderBottom: activeMenuColor };
          }

          return (
            <li
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className={classes}
              role={CONSTANTS.ARIA_ROLES.PRESENTATION}
            >
              <AccessibleButton
                style={activeTabStyle}
                className="tabs-menu-item-btn"
                ariaLabel={title}
                ariaSelected={isSelected}
                role={CONSTANTS.ARIA_ROLES.TAB}
                onClick={event => this.setActive(tabIndex, event)}
                onMouseOver={this.highlight}
                onMouseOut={this.removeHighlight}
                onBlur={this.removeHighlight}
                onFocus={this.onMenuItemFocus}
              >
                {title}
              </AccessibleButton>
            </li>
          );
        }
      );

    return (
      <div
        className="tabs-navigation"
        ref={(element) => {
          this.tabsNavigationElement = element;
        }}
        tabIndex="-1"
      >
        <ul
          className="tabs-menu"
          role={CONSTANTS.ARIA_ROLES.TAB_LIST}
          aria-label={CONSTANTS.ARIA_LABELS.CAPTION_OPTIONS}
        >
          {menuItems}
        </ul>
      </div>
    );
  }

  /**
   * Add config color to event target
   * @param {Object} event - the event object
   */
  highlight = (event) => {
    const { skinConfig } = this.props;
    if (skinConfig.general.accentColor) {
      event.target.style.color = skinConfig.general.accentColor;
    }
  }

  /**
   * Remove highlight accent from event target
   * @param {Object} event - the event object
   */
  removeHighlight = (event) => {
    const { skinConfig } = this.props;
    if (skinConfig.general.accentColor) {
      event.target.style.color = '';
    }
  }

  /**
   * handle menu item focused
   * @param {Object} event - the event object
   */
  onMenuItemFocus = (event) => {
    if (event.currentTarget) {
      this.scrollIntoViewIfNeeded(event.currentTarget);
    }
  }

  /**
   * Set the tab active
   * @param {number} index - the tab index
   * @param {Object} event - the event object
   */
  setActive = (index, event) => {
    event.preventDefault();
    this.setState({ tabActive: index });
  }

  /**
   * Handle left chevron click
   * @param {Objec} event - the event object
   */
  handleLeftChevronClick = (event) => {
    event.preventDefault();
    if (this.tabsNavigationElement) {
      this.tabsNavigationElement.scrollLeft -= 30;
    }
  }

  /**
   * Handle right chevron click
   * @param {Objec} event - the event object
   */
  handleRightChevronClick = (event) => {
    event.preventDefault();
    if (this.tabsNavigationElement) {
      this.tabsNavigationElement.scrollLeft += 30;
    }
  }

  /**
   * Ensures that the given menu item is completely visible inside the tabs navigation.
   * Adjusts the tabs navigation's scroll position when this is not the case.
   * @private
   * @param {HTMLElement} menuItem The menu item which we want to make sure is visible.
   */
  scrollIntoViewIfNeeded = (menuItem) => {
    if (!this.tabsNavigationElement || !menuItem || typeof menuItem.clientWidth === 'undefined') {
      return;
    }
    // Element is at a position that starts before the current navigation's scroll
    // position. This will cause the element to be cut-off, so we set the scroll position
    // to the value of the element's offset.
    if (menuItem.offsetLeft < this.tabsNavigationElement.scrollLeft) {
      this.tabsNavigationElement.scrollLeft = menuItem.offsetLeft;
    } else {
      const menuItemRightEdge = menuItem.offsetLeft + menuItem.clientWidth;
      // getBoundingClientRect().width returns the unrounded clientWidth. However, jsdom won't allow us to set clientWidth,
      // but we can mock getBoundingClientRect.
      const tabsNavigationElementClientWidth = this.tabsNavigationElement.clientWidth
        || this.tabsNavigationElement.getBoundingClientRect().width;
      const maxVisiblePoint = this.tabsNavigationElement.scrollLeft + tabsNavigationElementClientWidth;
      // Element overflows from the currently visible navigation area. Adjust the
      // navigation's scroll value so that the whole menu item fits inside the visible area.
      if (menuItemRightEdge > maxVisiblePoint) {
        this.tabsNavigationElement.scrollLeft += menuItemRightEdge - maxVisiblePoint;
      }
    }
  }

  render() {
    const { className } = this.props;
    const classNames = ClassNames('tabs', className);
    const { showScrollButtons } = this.props;

    const leftScrollButton = ClassNames({
      'oo-left-tab-button': true,
      'oo-left-tab-button-active': showScrollButtons,
    });
    const rightScrollButton = ClassNames({
      'oo-right-tab-button': true,
      'oo-right-tab-button-active': showScrollButtons,
    });

    return (
      <div className={classNames}>
        {this.getMenuItems()}
        {this.getSelectedPanel()}
        <div
          className={leftScrollButton}
          role="presentation"
          onClick={this.handleLeftChevronClick}
        >
          <Icon {...this.props} icon="left" />
        </div>
        <div
          className={rightScrollButton}
          role="presentation"
          onClick={this.handleRightChevronClick}
        >
          <Icon {...this.props} icon="right" />
        </div>
      </div>
    );
  }
}

TabsProto.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.object,
  ]),
  tabActive: PropTypes.number,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,
};

TabsProto.defaultProps = {
  className: '',
  tabActive: 1,
};

const Tabs = AccessibleMenu(TabsProto, { selector: '.tabs-menu', useRovingTabindex: true });

module.exports = Tabs;

Tabs.Panel = (props) => {
  const { children } = props;
  return (
    <span>{children}</span>
  );
};

Tabs.Panel.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,
};
