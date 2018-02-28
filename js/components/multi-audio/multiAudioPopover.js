var React = require('react'),
  CONSTANTS = require('../../constants/constants'),
  AccessibleMenu = require('../higher-order/accessibleMenu'),
  CloseButton = require('../closeButton');

var MultiAudioPopover = React.createClass({
  /**
   * close the popover
   */
  handleClose: function() {
    if (typeof this.props.togglePopoverAction === 'function') {
      this.props.togglePopoverAction();
    }
  },

  /**
   * Call setCurrentAudio from controller
   * @param {String} id - id of the audio track to activate
   */
  handleMultiAudioClick: function(id) {
    //change audio only if try to set not current audio track
    if (typeof this.props.controller.setCurrentAudio === 'function') {
      this.props.controller.setCurrentAudio(id);
    }
  },

  render: function() {
    var multiAudio = [];
    if (this.props.controller &&
      this.props.controller.state &&
      !!this.props.controller.state.multiAudio &&
      Array.isArray(this.props.controller.state.multiAudio.tracks) ) {
      multiAudio = this.props.controller.state.multiAudio.tracks;
    }
    return (
      <ul className="oo-popover-horizontal" role="menu">
        <li role="presentation">
          <CloseButton
            {...this.props}
            role={CONSTANTS.ARIA_ROLES.MENU_ITEM}
            closeAction={this.handleClose} />
        </li>
        {multiAudio.map(function(audio){
          var color = "white";
          if (audio.enabled) {
            color = "blue";
          }

          return (
            <li>
              <span
                className="oo-multiaudio-element"
                onClick={this.handleMultiAudioClick.bind(this, audio.id)}
                style={{color:color}}
              >
                {audio.label}
              </span>
            </li>
          );
        }, this)}
      </ul>
    );
  }
});

// Extend with AccessibleMenu features
MultiAudioPopover = AccessibleMenu(MultiAudioPopover);

MultiAudioPopover.propTypes = {
  controller: React.PropTypes.shape({
    state: React.PropTypes.shape({
      currentAudioId: React.PropTypes.string,
      setCurrentAudio: React.PropTypes.func,
      multiAudio: React.PropTypes.object
    })
  }),
  togglePopoverAction: React.PropTypes.func.isRequired
};


module.exports = MultiAudioPopover;
