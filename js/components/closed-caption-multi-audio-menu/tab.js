var React = require('react');
var Icon = require('../icon');
var classnames = require('classnames');

var Tab = React.createClass({
  handleClick: function(id) {
    if (typeof this.props.handleClick === 'function') {
      this.props.handleClick(id);
    }
  },

  render: function() {
    return (
      <div className="oo-cc-ma-menu__coll">
        <div className="oo-cc-ma-menu__header">{this.props.header}</div>
        <ul className="oo-cc-ma-menu__list">
          {this.props.itemsList.map(function(el, index) {
            return (
              <li
                key={index}
                onClick={this.handleClick.bind(this, el.id)}
                className={classnames('oo-cc-ma-menu__element', {
                  'oo-cc-ma-menu__element--active': el.enabled
                })}
              >
                <Icon
                  skinConfig={this.props.skinConfig}
                  icon="selected"
                  className={classnames({ 'oo-icon-hidden': !el.enabled })}
                />
                <span className="oo-cc-ma-menu__name" title={el.label}>
                  {el.label}
                </span>
              </li>
            );
          }, this)}
        </ul>
      </div>
    );
  }
});

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
