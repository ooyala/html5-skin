/********************************************************************
  UP NEXT PANEL
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class UpNextPanel
* @constructor
*/

var UpNextPanel = React.createClass({
  getInitialState: function() {
    return {
      radius: 0
    };
  },


  componentDidMount: function () {
    this.state.radius = this.getDOMNode().clientHeight * 0.4;
  },
  

  render: function() {
    var panelStyle = upNextPanelStyle.panelStyle;
    var upNextInfoStyle = upNextPanelStyle.upNextInfo;
    var upNextTitleStyle = upNextPanelStyle.upNextTitle;
    var contentNameStyle = upNextPanelStyle.contentName;
    var contentBlockStyle = upNextPanelStyle.contentBlock;
    var countDownClock = upNextPanelStyle.countDownClock;
    var seconds = 5;
    return (
      <div style={panelStyle}>
        <div style={upNextInfoStyle}>
          <div style={upNextTitleStyle}>Up Next</div>
          <div style={contentNameStyle}>Content Name</div>
        </div>
        <div style={contentBlockStyle}>
          <div style={countDownClock}>
            <CountDownClock {...this.props} 
            radius={this.state.radius}
            seconds={seconds}/>
          </div>
        </div>
      </div>
    );
  }
});