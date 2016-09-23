/**
 * Panel component for multi-audio selection
 *
 * @module MultiAudioPanel
 */
var React = require('react'),
    ScrollArea = require('react-scrollbar/dist/no-css'),
    ClassNames = require('classnames'),
    Icon = require('../components/icon');

var MultiAudioPanel = React.createClass({
  getInitialState: function() {
    return {
      selected: this.props.multiAudioOptions.selectedAudioTrack ? this.props.multiAudioOptions.selectedAudioTrack : null
    };
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return (nextProps.multiAudioOptions.selectedAudioTrack != this.props.multiAudioOptions.selectedAudioTrack ||
    nextState.selected != this.state.selected);
  },

  handleMultiAudioClick: function(selectedAudioTrackId, event) {
    event.preventDefault();
    var id = selectedAudioTrackId.toString();
    this.props.controller.sendMultiAudioChangeEvent(id);
    this.setState({
      selected: id
    });
    this.props.togglePopoverAction();
  },

  render: function() {
    var availableAudioTracks  = this.props.multiAudioOptions.availableAudioTracks;
    var audioTrackButtons = [];

    //available audio tracks
    if(availableAudioTracks) {
      for (var i=0; i < availableAudioTracks.length; i++) {
        var audioBtn = ClassNames({
          'oo-list-btn': true,
          'oo-selected': this.state.selected == availableAudioTracks[i].id
        });
        var btnLabel = availableAudioTracks[i].label.replace("program_audio", "").trim(); //bitmovin lib adds extra text with html5 platform
        audioTrackButtons.push(<li key={i}><a className={audioBtn} key={i} onClick={this.handleMultiAudioClick.bind(this, availableAudioTracks[i].id)}>{btnLabel}</a></li>);
      }
    }

    var audioScreenClass = ClassNames({
      'oo-content-panel': !this.props.popover,
      'oo-list-panel': !this.props.popover,
      'oo-list-popover': this.props.popover,
      'oo-mobile-fullscreen': !this.props.popover && this.props.controller.state.isMobile && (this.props.controller.state.fullscreen || this.props.controller.state.isFullWindow)
    });

    return (
      <div className={audioScreenClass}>
        <ScrollArea
          className="oo-list-screen-content"
          speed={this.props.popover ? 0.6 : 1}
          horizontal={this.props.popover ? false : true}>
          <ul>
            {audioTrackButtons}
          </ul>
        </ScrollArea>
      </div>
    );
  }
});

MultiAudioPanel.propTypes = {
  multiAudioOptions: React.PropTypes.shape({
    availableAudioTracks: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      lang: React.PropTypes.string,
      label: React.PropTypes.string
    }))
  }),
  togglePopoverAction: React.PropTypes.func,
  controller: React.PropTypes.shape({
    sendMultiAudioChangeEvent: React.PropTypes.func
  })
};

MultiAudioPanel.defaultProps = {
  popover: false,
  skinConfig: {
    icons: {
      setting:{fontStyleClass:'oo-icon oo-icon-system-settings'}
    }
  },
  multiAudioOptions: {
    availableAudioTracks: []
  },
  togglePopoverAction: function(){},
  controller: {
    sendMultiAudioChangeEvent: function(a){}
  }
};

module.exports = MultiAudioPanel;