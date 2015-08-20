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
  
  highlight: function(evt) {
    evt.target.style.color = "rgba(255, 255, 255, 1.0)";
  },

  removeHighlight: function(evt) {
    evt.target.style.color = "rgba(255, 255, 255, 0.6)";
  },

  render: function() {
    return (
      <div className="MoreOptionsScreen" onMouseOver={this.showControlBar} onMouseOut={this.hideControlBar} 
        onMouseUp={this.handlePlayerMouseUp} style={{height: "100%", width: "100%"}}>
        
        <MoreOptionsPanel {...this.props} 
          controlBarWidth={this.state.controlBarWidth}/>
        
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