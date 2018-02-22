var React = require('react'),
  CONSTANTS = require('../../constants/constants'),
  AccessibleMenu = require('../higher-order/accessibleMenu'),
  CloseButton = require('../closeButton');

var MultiAudioPopover = React.createClass({
  /**
   * close the popover
   */
  handleClose: function() {
    this.props.togglePopoverAction({
      restoreToggleButtonFocus: true
    });
  },

  /**
   * Call setCurrentAudio from controller
   * @param {String} id - id of the audio track to activate
   */
  handleMultiAudioClick: function(id) {
    //change audio only if try to set not current audio track
    if (this.props.controller && this.props.controller.state.currentAudioId !== id) {
      if (typeof this.props.controller.setCurrentAudio === 'function') {
        this.props.controller.setCurrentAudio(id);
      }
    }
  },

  render: function() {
    var multiAudio = [];
    if (this.props.controller && this.props.controller.state && !!this.props.controller.state.multiAudio) {
      multiAudio = this.props.controller.state.multiAudio.multiAudio;
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
          return (
            <li>
              <span
                className="oo-multiaudio-element"
                onClick={this.handleMultiAudioClick.bind(this, audio.id)}
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

module.exports = MultiAudioPopover;
