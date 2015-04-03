/********************************************************************
  RENDERER PLACEHOLDER
*********************************************************************/
var Skin = React.createClass({
  getInitialState: function() {
    return {screen: "null"};
  },

  switchComponent: function(screen, args) {
    var newState = args || {};
    newState.screen = screen;
    this.setState(newState);
  },

  render: function() {
    switch (this.state.screen) {
      case STATE.START:
        return (
          <StartScreen {...this.props} contentTree={this.state.contentTree} />
        );
      case STATE.PLAYING:
        return (
          <PlayingScreen {...this.props} />
        );
      case STATE.PAUSE:
        return (
          <PauseScreen {...this.props} />
        );
      default:
        return false;
    }
  }
});
