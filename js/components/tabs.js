// taken from https://github.com/pedronauck/react-simpletabs

let React = require('react');

let AccessibleButton = require('./accessibleButton');

let AccessibleMenu = require('./higher-order/accessibleMenu');

let CONSTANTS = require('../constants/constants');

let Utils = require('./utils');

let ClassNames = require('classnames');

let Icon = require('./icon');
let createReactClass = require('create-react-class');
let PropTypes = require('prop-types');

let Tabs = createReactClass({
  highlight: function(evt) {
    if (this.props.skinConfig.general.accentColor) {
      evt.target.style.color = this.props.skinConfig.general.accentColor;
    }
  },

  removeHighlight: function(evt) {
    if (this.props.skinConfig.general.accentColor) {
      evt.target.style.color = '';
    }
  },

  getInitialState: function() {
    return {
      tabActive: this.props.tabActive,
    };
  },

  componentDidMount: function() {
    let index = this.state.tabActive;
    let selectedPanel = this.refs['tab-panel'];
    let selectedMenu = this.refs['tab-menu-' + index];

    if (this.props.onMount) {
      this.props.onMount(index, selectedPanel, selectedMenu);
    }
  },

  componentWillReceiveProps: function(newProps) {
    if (newProps.tabActive && newProps.tabActive !== this.props.tabActive) {
      this.setState({ tabActive: newProps.tabActive });
    }
  },

  setActive: function(index, e) {
    e.preventDefault();

    let onAfterChange = this.props.onAfterChange;
    let onBeforeChange = this.props.onBeforeChange;
    let selectedPanel = this.refs['tab-panel'];
    let selectedTabMenu = this.refs['tab-menu-' + index];

    if (onBeforeChange) {
      let cancel = onBeforeChange(index, selectedPanel, selectedTabMenu);
      if (cancel === false) {
        return;
      }
    }

    this.setState({ tabActive: index }, function() {
      if (onAfterChange) {
        onAfterChange(index, selectedPanel, selectedTabMenu);
      }
    });
  },

  getMenuItems: function() {
    if (!this.props.children) {
      throw new Error('Tabs must contain at least one Tabs.Panel');
    }

    if (!Array.isArray(this.props.children)) {
      this.props.children = [this.props.children];
    }

    let menuItems = this.props.children
      .map(function(panel) {
        return typeof panel === 'function' ? panel() : panel;
      })
      .filter(function(panel) {
        return panel;
      })
      .map(
        function(panel, index) {
          let tabIndex = index + 1;
          let ref = 'tab-menu-' + tabIndex;
          let title = panel.props.title;
          let activeTabStyle = {};
          let isSelected = this.state.tabActive === tabIndex;

          let classes = ClassNames('tabs-menu-item', 'tabs-menu-item-' + index, {
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
        }.bind(this)
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

  getSelectedPanel: function() {
    let index = this.state.tabActive - 1;
    let panel = this.props.children[index];

    return (
      <div ref="tab-panel" className="tab-panel" role={CONSTANTS.ARIA_ROLES.TAB_PANEL}>
        {panel}
      </div>
    );
  },

  handleLeftChevronClick: function(event) {
    event.preventDefault();
    if (this.tabsNavigationElement) {
      this.tabsNavigationElement.scrollLeft -= 30;
    }
  },

  handleRightChevronClick: function(event) {
    event.preventDefault();
    if (this.tabsNavigationElement) {
      this.tabsNavigationElement.scrollLeft += 30;
    }
  },

  onMenuItemFocus: function(event) {
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
  scrollIntoViewIfNeeded: function(menuItem) {
    if (!this.tabsNavigationElement || !menuItem || typeof menuItem.clientWidth === 'undefined') {
      return;
    }
    // Element is at a position that starts before the current navigation's scroll
    // position. This will cause the element to be cut-off, so we set the scroll position
    // to the value of the element's offset.
    if (menuItem.offsetLeft < this.tabsNavigationElement.scrollLeft) {
      this.tabsNavigationElement.scrollLeft = menuItem.offsetLeft;
    } else {
      let menuItemRightEdge = menuItem.offsetLeft + menuItem.clientWidth;
      // getBoundingClientRect().width returns the unrounded clientWidth. However, jsdom won't allow us to set clientWidth,
      // but we can mock getBoundingClientRect.
      let tabsNavigationElementClientWidth = this.tabsNavigationElement.clientWidth || this.tabsNavigationElement.getBoundingClientRect().width;
      let maxVisiblePoint = this.tabsNavigationElement.scrollLeft + tabsNavigationElementClientWidth;
      // Element overflows from the currently visible navigation area. Adjust the
      // navigation's scroll value so that the whole menu item fits inside the visible area.
      if (menuItemRightEdge > maxVisiblePoint) {
        this.tabsNavigationElement.scrollLeft += menuItemRightEdge - maxVisiblePoint;
      }
    }
  },

  render: function() {
    let className = ClassNames('tabs', this.props.className);

    let leftScrollButton = ClassNames({
      'oo-left-tab-button': true,
      'oo-left-tab-button-active': this.props.showScrollButtons,
    });
    let rightScrollButton = ClassNames({
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

  render: function() {
    return <span>{this.props.children}</span>;
  },
});
