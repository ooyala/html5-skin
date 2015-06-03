/********************************************************************
  RENDERER PLACEHOLDER
*********************************************************************/
var Skin = React.createClass({
  getInitialState: function() {
    return {
      screenToShow : null,
      currentPlayhead: 0
    };
  },

  switchComponent: function(args) {
    var newState = args || {};
    this.setState(newState);

    if (this.refs.playScreen) {
      this.refs.playScreen.setState({
        playerState: this.state.playerState
      });
    }
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    return nextState.screenToShow != this.state.screenToShow;
  },

  updatePlayhead: function(newPlayhead, newDuration, newBuffered) {
    this.setState({
      currentPlayhead: newPlayhead,
      duration: newDuration,
      buffered: newBuffered
    });
    this.forceUpdate();
  },

  render: function() {
    return (
      <ShareScreen {...this.props} contentTree={this.state.contentTree}
      currentPlayhead={this.state.currentPlayhead}
      duration={this.state.duration}
      buffered={this.state.buffered}
      ref="shareScreen" />
    );
    switch (this.state.screenToShow) {
      case STATE.START:
        return (
          <StartScreen {...this.props} contentTree={this.state.contentTree} style={startScreenStyle}/>
        );
      case STATE.PLAYING:
        return (
          <PlayingScreen {...this.props} contentTree={this.state.contentTree}
          currentPlayhead={this.state.currentPlayhead}
          duration={this.state.duration}
          buffered={this.state.buffered}
          ref="playScreen" />
        );
      case STATE.SHARE_SCREEN:
        return (
          <ShareScreen {...this.props} contentTree={this.state.contentTree}
          currentPlayhead={this.state.currentPlayhead}
          duration={this.state.duration}
          buffered={this.state.buffered}
          ref="shareScreen" />
        );
      default:
        return false;
    }
  }
});
