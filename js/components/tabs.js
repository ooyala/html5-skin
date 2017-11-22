// taken from https://github.com/pedronauck/react-simpletabs

var React = require('react'),
    AccessibleButton = require('./accessibleButton'),
    CONSTANTS = require('../constants/constants'),
    Utils = require('./utils'),
    ClassNames = require('classnames'),
    Icon = require('./icon');

var Tabs = React.createClass({
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
    this.menuButtons = {};
    this.autoFocusTabPanel = false;

    return {
      tabActive: this.props.tabActive
    };
  },

  componentDidMount: function() {
    var index = this.state.tabActive;
    var selectedPanel = this.refs['tab-panel'];
    var selectedMenu = this.refs[("tab-menu-" + index)];

    if (this.props.onMount) {
      this.props.onMount(index, selectedPanel, selectedMenu);
    }
  },

  componentWillReceiveProps: function(newProps) {
    if(newProps.tabActive && newProps.tabActive !== this.props.tabActive){
      this.setState({tabActive: newProps.tabActive});
    }
  },

  componentDidUpdate: function() {
    if (this.autoFocusTabPanel) {
      this.autoFocusTabPanel = false;
      Utils.autoFocusFirstElement(this.refs['tab-panel'], 'oo-hidden');
    }
  },

  setActive: function(index, e) {
    e.preventDefault();

    var onAfterChange = this.props.onAfterChange;
    var onBeforeChange = this.props.onBeforeChange;
    var selectedPanel = this.refs['tab-panel'];
    var selectedTabMenu = this.refs[("tab-menu-" + index)];

    if (onBeforeChange) {
      var cancel = onBeforeChange(index, selectedPanel, selectedTabMenu);
      if(cancel === false){ return }
    }

    // Set a flag to auto focus on the first tab panel element on the next render
    // if the menu button was triggered with the keyboard
    var menuButton = this.menuButtons[index];
    if (menuButton) {
      this.autoFocusTabPanel = menuButton.wasTriggeredWithKeyboard();
      menuButton.wasTriggeredWithKeyboard(false);
    }

    this.setState({ tabActive: index }, function()  {
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

    var menuItems = this.props.children
      .map(function(panel)  {return typeof panel === 'function' ? panel() : panel;})
      .filter(function(panel)  {return panel;})
      .map(function(panel, index)  {
        var ref = ("tab-menu-" + (index + 1));
        var title = panel.props.title;
        var activeTabStyle = {};
        var isSelected = this.state.tabActive === index + 1;

        var classes = ClassNames(
          'tabs-menu-item',
          'tabs-menu-item-' + index, {
            'is-active': isSelected
          }
        );

        //accent color
        if (isSelected && this.props.skinConfig.general.accentColor) {
          var activeMenuColor =  "solid ";
          activeMenuColor += this.props.skinConfig.general.accentColor;
          activeTabStyle = {borderBottom: activeMenuColor};
        }

        return (
          <li ref={ref} key={index} className={classes} role={CONSTANTS.ARIA_ROLES.PRESENTATION}>
            <AccessibleButton
              ref={function(e) { this.menuButtons[index + 1] = e }.bind(this)}
              style={activeTabStyle}
              className="tabs-menu-item-btn"
              ariaLabel={title}
              ariaChecked={isSelected}
              role={CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO}
              onClick={this.setActive.bind(this, index + 1)}
              onMouseOver={this.highlight}
              onMouseOut={this.removeHighlight}
              onFocus={this.onMenuItemFocus}>
              {title}
            </AccessibleButton>
          </li>
        );
      }.bind(this));

    return (
      <nav
        className='tabs-navigation'
        ref={function(e) { this.tabsNavigationElement = e }.bind(this)}>
        <ul className='tabs-menu' role={CONSTANTS.ARIA_ROLES.MENU}>{menuItems}</ul>
      </nav>
    );
  },

  getSelectedPanel: function() {
    var index = this.state.tabActive - 1;
    var panel = this.props.children[index];

    return (
      <article ref='tab-panel' className='tab-panel'>
        {panel}
      </article>
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
    if (
      !this.tabsNavigationElement ||
      !menuItem ||
      typeof menuItem.clientWidth === 'undefined'
    ) {
      return;
    }
    // Element is at a position that starts before the current navigation's scroll
    // position. This will cause the element to be cut-off, so we set the scroll position
    // to the value of the element's offset.
    if (menuItem.offsetLeft < this.tabsNavigationElement.scrollLeft) {
      this.tabsNavigationElement.scrollLeft = menuItem.offsetLeft;
    } else {
      var menuItemRightEdge = menuItem.offsetLeft + menuItem.clientWidth;
      var maxVisiblePoint = this.tabsNavigationElement.scrollLeft + this.tabsNavigationElement.clientWidth;
      // Element overflows from the currently visible navigation area. Adjust the
      // navigation's scroll value so that the whole menu item fits inside the visible area.
      if (menuItemRightEdge > maxVisiblePoint) {
        this.tabsNavigationElement.scrollLeft += menuItemRightEdge - maxVisiblePoint;
      }
    }
  },

  render: function() {
    var className = ClassNames('tabs', this.props.className);

    var leftScrollButton = ClassNames({
      'oo-left-tab-button': true,
      'oo-left-tab-button-active': this.props.showScrollButtons
    });
    var rightScrollButton = ClassNames({
      'oo-right-tab-button': true,
      'oo-right-tab-button-active': this.props.showScrollButtons
    });

    return (
      <div className={className}>
        {this.getMenuItems()}
        {this.getSelectedPanel()}
        <a className={leftScrollButton}
          ref="leftChevron"
          role={CONSTANTS.ARIA_ROLES.PRESENTATION}
          onClick={this.handleLeftChevronClick}>
          <Icon
            {...this.props}
            icon="left"
          />
        </a>
        <a className={rightScrollButton}
          ref="rightChevron"
          role={CONSTANTS.ARIA_ROLES.PRESENTATION}
          onClick={this.handleRightChevronClick}>
          <Icon
            {...this.props}
            icon="right"
          />
        </a>
      </div>
    );
  }
});

Tabs.propTypes = {
  className: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.string,
    React.PropTypes.object
  ]),
  tabActive: React.PropTypes.number,
  onMount: React.PropTypes.func,
  onBeforeChange: React.PropTypes.func,
  onAfterChange: React.PropTypes.func,
  children: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.element
  ]).isRequired
};

Tabs.defaultProps = {
  tabActive: 1
};

module.exports = Tabs;


Tabs.Panel = React.createClass({
  displayName: 'Panel',
  propTypes: {
    title: React.PropTypes.string.isRequired,
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.element
    ]).isRequired
  },

  render: function() {
    return (
      <span>{this.props.children}</span>
    );
  }
});
