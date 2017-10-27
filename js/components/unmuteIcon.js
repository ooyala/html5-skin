var React = require('react'),
    Icon = require('./icon'),
    ClassNames = require('classnames'),
    CONSTANTS = require('../constants/constants');

var UnmuteIcon = React.createClass({
  getInitialState: function () {
    return {
      expanded: !this.props.controller.state.volumeState.unmuteIconCollapsed
    };
  },

  unmuteClick: function(event) {
    this.props.controller.handleMuteClick();
  },

  //componentWillMount: function() {
  //
  //},

  componentDidMount: function() {
    if (this.state.expanded) {
      clearTimeout(this.timeout);
      var me = this;
      //var expandedUnmutes = document.getElementsByClassName("oo-unmute-expanded");
      //if (expandedUnmutes.length > 0){
      //  var element = expandedUnmutes[0];
      //  element.style.width = window.getComputedStyle(element).width;
      //}
      this.timeout = setTimeout(_.bind(function() {
        me.props.controller.state.volumeState.unmuteIconCollapsed = true;
        me.setState({expanded: false});
      }, this), 5000);
    }
  },

  //componentWillUnmount: function() {
  //
  //},

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
      'oo-unmute': !this.state.expanded,
      'oo-unmute-expanded': this.state.expanded
    });

    //<div className="oo-unmute-inner-wrapper">
    //
    //    </div>

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