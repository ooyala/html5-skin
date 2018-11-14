var React = require('react'),
    Icon = require('./icon'),
    ClassNames = require('classnames'),
    CONSTANTS = require('../constants/constants');
var createReactClass = require('create-react-class');
var PropTypes = require('prop-types');

var UnmuteIcon = createReactClass({
  getInitialState: function() {
    return {
      collapseTime: 2000
    };
  },

  unmuteClick: function(event) {
    event.stopPropagation();
    this.props.controller.handleMuteClick();
  },

  onMouseUp: function(event) {
    event.stopPropagation();
  },

  componentDidMount: function() {
    var expanded = !this.props.controller.state.volumeState.unmuteIconCollapsed;
    if (expanded) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(
        function() {
          this.props.controller.state.volumeState.unmuteIconCollapsed = true;
          this.setState({});
        }.bind(this),
        this.state.collapseTime
      );
    }
  },

  componentWillUnmount: function() {
    clearTimeout(this.timeout);
  },

  render: function() {
    var volumeIcon, volumeAriaLabel;
    if (this.props.controller.state.volumeState.muted) {
      volumeIcon = 'volumeOff';
      volumeAriaLabel = CONSTANTS.ARIA_LABELS.UNMUTE;
    } else {
      volumeIcon = 'volume';
      volumeAriaLabel = CONSTANTS.ARIA_LABELS.MUTE;
    }

    var expanded = !this.props.controller.state.volumeState.unmuteIconCollapsed;

    var myClass = ClassNames({
      'oo-unmute': true,
      'oo-expanded': expanded
    });

    return (
      <button
        className={myClass}
        onClick={this.unmuteClick}
        onMouseUp={this.onMouseUp}
        type="button"
        tabIndex="0"
        aria-label={volumeAriaLabel}
      >
        <div className="oo-unmute-icon-wrapper">
          <Icon {...this.props} icon={volumeIcon} ref="volumeIcon" />
        </div>

        {expanded ? <div className="oo-unmute-message">{CONSTANTS.SKIN_TEXT.SELECT_TO_UNMUTE}</div> : null}
      </button>
    );
  }
});

UnmuteIcon.propTypes = {
  controller: PropTypes.shape({
    state: PropTypes.shape({
      volumeState: PropTypes.shape({
        muted: PropTypes.bool,
        unmuteIconCollapsed: PropTypes.bool
      })
    })
  })
};

module.exports = UnmuteIcon;
