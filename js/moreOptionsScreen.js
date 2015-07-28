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

    // Make sure component resize correctly after switch to fullscreen/inline screen
    window.addEventListener('resize', this.handleResize);
  },

  handleResize: function(e) {
    if (this.isMounted()) {
      this.setState({controlBarWidth: this.getDOMNode().clientWidth});
    }
  },

  render: function() {
    //Fill in all the dynamic style values we need
    var controlBarHeight = 32;
    return (
      <div onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar} onMouseUp={this.handlePlayerMouseUp} style={{height: "100%", width: "100%"}}>
        <MoreOptionsPanel {...this.props} />
        
        <ScrubberBar 
          {...this.props} 
          controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} 
          controlBarHeight={controlBarHeight} />
        
        <ControlBar 
          {...this.props} 
          controlBarVisible={this.state.controlBarVisible}
          controlBarWidth={this.state.controlBarWidth} 
          controlBarHeight={controlBarHeight}
          playerState={this.props.playerState} />
      </div>
    );
  }
});