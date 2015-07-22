/********************************************************************
  MORE OPTIONS SCREEN
*********************************************************************/
/**
* The screen used while the more options menu is showing.
*
* @class MoreOptionsScreen
* @constructor
*/
var MoreOptionsScreen = React.createClass({
  getInitialState: function() {
    return {
      controlBarVisible: true,
      controlBarWidth: 0
    };
  },

  componentDidMount: function () {
    this.setState({controlBarWidth: this.getDOMNode().clientWidth});
  },

  render: function() {
    return (
      <div onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar} 
        onMouseUp={this.handlePlayerMouseUp} style={{height: "100%", width: "100%"}}>
        
        <MoreOptionsPanel {...this.props} />
        
        <ScrubberBar 
          {...this.props} 
          controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} />
        
        <ControlBar 
          {...this.props} 
          controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} 
          playerState={this.props.playerState} />
      </div>
    );
  }
});