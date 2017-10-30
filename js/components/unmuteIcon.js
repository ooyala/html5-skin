var React = require('react'),
    Icon = require('./icon'),
    ClassNames = require('classnames'),
    CONSTANTS = require('../constants/constants');

var UnmuteIcon = React.createClass({
  getInitialState: function () {
    return {
      collapseTime: 2000,
      expanded: !this.props.controller.state.volumeState.unmuteIconCollapsed
    };
  },

  unmuteClick: function(event) {
    this.props.controller.handleMuteClick();
  },

  componentDidMount: function() {
    if (this.state.expanded) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(function() {
        this.props.controller.state.volumeState.unmuteIconCollapsed = true;
        this.setState({expanded: false});
      }.bind(this), this.state.collapseTime);
    }
  },

  componentWillUnmount: function() {
    clearTimeout(this.timeout);
  },

  render: function() {
    var volumeIcon, volumeAriaLabel;
    if (this.props.controller.state.volumeState.muted) {
      volumeIcon = "volumeOff";
      volumeAriaLabel = CONSTANTS.ARIA_LABELS.UNMUTE;
    } else {
      volumeIcon = "volume";
      volumeAriaLabel = CONSTANTS.ARIA_LABELS.MUTE;
    }

    var myClass = ClassNames({
      'oo-unmute': true,
      'oo-expanded': this.state.expanded
    });

    return (
      <button className={myClass}
        onClick={this.unmuteClick}
        type="button"
        tabIndex="0"
        aria-label={volumeAriaLabel}
        >

        <div className="oo-unmute-icon-wrapper">
            <Icon {...this.props} icon={volumeIcon} ref="volumeIcon"/>
          </div>

        {this.state.expanded ? <div className="oo-unmute-message">SELECT TO UNMUTE</div> : null}

      </button>
    );
  }
});

module.exports = UnmuteIcon;