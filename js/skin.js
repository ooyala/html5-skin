/********************************************************************
  RENDERER PLACEHOLDER
*********************************************************************/
var Skin = React.createClass({
  getInitialState: function() {
    return {
      screenToShow : null
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

  render: function() {
    switch (this.state.screenToShow) {
      case STATE.START:
        return (
          <StartScreen {...this.props} contentTree={this.state.contentTree} style={startScreenStyle}/>
        );
      case STATE.PLAYING:
        return (
          <PlayingScreen {...this.props} ref="playScreen" />
        );
      default:
        return false;
    }
  }
});
