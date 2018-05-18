var React = require('react');
var ScrollArea = require('react-scrollbar/dist/no-css');
var Icon = require('../icon');
var AccessibleButton = require('../accessibleButton');
var AccessibleMenu = require('../higher-order/accessibleMenu');
var classnames = require('classnames');
var CONSTANTS = require('../../constants/constants');

var Tab = React.createClass({
  handleClick: function(id) {
    if (typeof this.props.handleClick === 'function') {
      this.props.handleClick(id);
    }
  },

  render: function() {
    return (
      <div className={classnames('oo-cc-ma-menu__coll', this.props.tabClassName)}>
        <div className="oo-cc-ma-menu__header">{this.props.header}</div>
        <ScrollArea
          className="oo-cc-ma-menu__scrollarea"
          speed={1}
          horizontal={false}
        >
          <ul
            className="oo-cc-ma-menu__list"
            role={CONSTANTS.ARIA_ROLES.MENU}
          >
            {this.props.itemsList.map(function(item, index) {
              return (
                <li
                  key={item.id}
                  role={CONSTANTS.ARIA_ROLES.PRESENTATION}
                  className={classnames('oo-cc-ma-menu__element', {
                    'oo-cc-ma-menu__element--active': item.enabled
                  })}
                >
                  <AccessibleButton
                    key={item.id}
                    className={'oo-multi-audio-btn'}
                    focusId={CONSTANTS.FOCUS_IDS.MULTI_AUDIO + index}
                    role={CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO}
                    ariaLabel={item.label}
                    ariaChecked={item.enabled}
                    onClick={this.handleClick.bind(this, item.id)}
                  >
                    <Icon
                      skinConfig={this.props.skinConfig}
                      icon="selected"
                      className={classnames({ 'oo-icon-hidden': !item.enabled })}
                    />
                    <span className="oo-cc-ma-menu__name" title={item.label}>
                      {item.label}
                    </span>
                  </AccessibleButton>
                </li>
              );
            }, this)}
          </ul>
        </ScrollArea>
      </div>
    );
  }
});

Tab = AccessibleMenu(Tab, { useRovingTabindex: true });

Tab.defaultProps = {
  skinConfig: {
    responsive: {
      breakpoints: {
        xs: { id: 'xs' },
        sm: { id: 'sm' },
        md: { id: 'md' },
        lg: { id: 'lg' }
      }
    }
  }
};

Tab.propTypes = {
  tabClassName: React.PropTypes.string,
  header: React.PropTypes.string,
  itemsList: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      label: React.PropTypes.string.isRequired,
      enabled: React.PropTypes.bool.isRequired
    })
  ).isRequired,
  skinConfig: React.PropTypes.object,
  handleClick: React.PropTypes.func
};

module.exports = Tab;
