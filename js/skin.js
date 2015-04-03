/********************************************************************
  RENDERER PLACEHOLDER
*********************************************************************/
var Skin = React.createClass({
  getInitialState: function() {
    return {screen: "null"};
  },

  switchComponent: function(newState, args) {
    this.setState({screen: newState, args: args});
  },

  render: function() {
    switch (this.state.screen) {
      case STATE.START:
        return (
          <StartScreen data={this.props.data} controller={this.props.controller} contentTree={this.state.args} />
        );
      case STATE.PLAYING:
        return (
          <PlayingScreen data={this.props.data} controller={this.props.controller} />
        );
      case STATE.PAUSE:
        return (
          <PauseScreen data={this.props.data} controller={this.props.controller} />
        );
      default:
        return false;
    }
  }
});
