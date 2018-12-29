// taken from https://github.com/pedronauck/react-simpletabs

const React = require('react');

const ClassNames = require('classnames');
const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const AccessibleButton = require('./accessibleButton');

const AccessibleMenu = require('./higher-order/accessibleMenu');

const CONSTANTS = require('../constants/constants');

const Utils = require('./utils');


const Icon = require('./icon');

let Tabs = createReactClass({
  highlight(evt) {
    if (this.props.skinConfig.general.accentColor) {
      evt.target.style.color = this.props.skinConfig.general.accentColor;
    }
  },

  removeHighlight(evt) {
    if (this.props.skinConfig.general.accentColor) {
      evt.target.style.color = '';
    }
  },

  getInitialState() {
    return {
      tabActive: this.props.tabActive,
    };
  },

  componentDidMount() {
    const index = this.state.tabActive;
    const selectedPanel = this.refs['tab-panel'];
    const selectedMenu = this.refs[`tab-menu-${index}`];

    if (this.props.onMount) {
      this.props.onMount(index, selectedPanel, selectedMenu);
    }
  },

  componentWillReceiveProps(newProps) {
    if (newProps.tabActive && newProps.tabActive !== this.props.tabActive) {
      this.setState({ tabActive: newProps.tabActive });
    }
  },

  setActive(index, e) {
    e.preventDefault();

    const onAfterChange = this.props.onAfterChange;
    const onBeforeChange = this.props.onBeforeChange;
    const selectedPanel = this.refs['tab-panel'];
    const selectedTabMenu = this.refs[`tab-menu-${index}`];

    if (onBeforeChange) {
      const cancel = onBeforeChange(index, selectedPanel, selectedTabMenu);
      if (cancel === false) {
        return;
      }
    }

    this.setState({ tabActive: index }, () => {
      if (onAfterChange) {
        onAfterChange(index, selectedPanel, selectedTabMenu);
      }
    });
  },

  getMenuItems() {
    if (!this.props.children) {
      throw new Error('Tabs must contain at least one Tabs.Panel');
    }

    if (!Array.isArray(this.props.children)) {
      this.props.children = [this.props.children];
    }

    const menuItems = this.props.children
      .map(panel => (typeof panel === 'function' ? panel() : panel))
      .filter(panel => panel)
      .map(
        (panel, index) => {
          const tabIndex = index + 1;
          const ref = `tab-menu-${tabIndex}`;
          const title = panel.props.title;
          let activeTabStyle = {};
          const isSelected = this.state.tabActive === tabIndex;

          const classes = ClassNames('tabs-menu-item', `tabs-menu-item-${index}`, {
            'is-active': isSelected,
          });

          // accent color
          if (isSelected && this.props.skinConfig.general.accentColor) {
            let activeMenuColor = 'solid ';
            activeMenuColor += this.props.skinConfig.general.accentColor;
            activeTabStyle = { borderBottom: activeMenuColor };
          }

          return (
            <li ref={ref} key={index} className={classes} role={CONSTANTS.ARIA_ROLES.PRESENTATION}>
              <AccessibleButton
                style={activeTabStyle}
                className="tabs-menu-item-btn"
                ariaLabel={title}
                ariaSelected={isSelected}
                role={CONSTANTS.ARIA_ROLES.TAB}
                onClick={this.setActive.bind(this, tabIndex)}
                onMouseOver={this.highlight}
                onMouseOut={this.removeHighlight}
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
        ref={function(e) {
          this.tabsNavigationElement = e;
        }.bind(this)}
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
  },

  getSelectedPanel() {
    const index = this.state.tabActive - 1;
    const panel = this.props.children[index];

    return (
      <div ref="tab-panel" className="tab-panel" role={CONSTANTS.ARIA_ROLES.TAB_PANEL}>
        {panel}
      </div>
    );
  },

  handleLeftChevronClick(event) {
    event.preventDefault();
    if (this.tabsNavigationElement) {
      this.tabsNavigationElement.scrollLeft -= 30;
    }
  },

  handleRightChevronClick(event) {
    event.preventDefault();
    if (this.tabsNavigationElement) {
      this.tabsNavigationElement.scrollLeft += 30;
    }
  },

  onMenuItemFocus(event) {
    if (event.currentTarget) {
      this.scrollIntoViewIfNeeded(event.currentTarget);
    }
  },

  /**
   * Ensures that the given menu item is completely visible inside the tabs navigation.
   * Adjusts the tabs navigation's scroll position when this is not the case.
   * @private
   * @param {HTMLElement} menuItem The menu item which we want to make sure is visible.
   */
  scrollIntoViewIfNeeded(menuItem) {
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
      const tabsNavigationElementClientWidth = this.tabsNavigationElement.clientWidth || this.tabsNavigationElement.getBoundingClientRect().width;
      const maxVisiblePoint = this.tabsNavigationElement.scrollLeft + tabsNavigationElementClientWidth;
      // Element overflows from the currently visible navigation area. Adjust the
      // navigation's scroll value so that the whole menu item fits inside the visible area.
      if (menuItemRightEdge > maxVisiblePoint) {
        this.tabsNavigationElement.scrollLeft += menuItemRightEdge - maxVisiblePoint;
      }
    }
  },

  render() {
    const className = ClassNames('tabs', this.props.className);

    const leftScrollButton = ClassNames({
      'oo-left-tab-button': true,
      'oo-left-tab-button-active': this.props.showScrollButtons,
    });
    const rightScrollButton = ClassNames({
      'oo-right-tab-button': true,
      'oo-right-tab-button-active': this.props.showScrollButtons,
    });

    return (
      <div className={className}>
        {this.getMenuItems()}
        {this.getSelectedPanel()}
        <a
          className={leftScrollButton}
          ref="leftChevron"
          role={CONSTANTS.ARIA_ROLES.PRESENTATION}
          onClick={this.handleLeftChevronClick}
        >
          <Icon {...this.props} icon="left" />
        </a>
        <a
          className={rightScrollButton}
          ref="rightChevron"
          role={CONSTANTS.ARIA_ROLES.PRESENTATION}
          onClick={this.handleRightChevronClick}
        >
          <Icon {...this.props} icon="right" />
        </a>
      </div>
    );
  },
});

Tabs = AccessibleMenu(Tabs, { selector: '.tabs-menu', useRovingTabindex: true });

Tabs.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.object,
  ]),
  tabActive: PropTypes.number,
  onMount: PropTypes.func,
  onBeforeChange: PropTypes.func,
  onAfterChange: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,
};

Tabs.defaultProps = {
  tabActive: 1,
};

module.exports = Tabs;

Tabs.Panel = createReactClass({
  displayName: 'Panel',
  propTypes: {
    title: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]).isRequired,
  },

  render() {
    return <span>{this.props.children}</span>;
  },
});
