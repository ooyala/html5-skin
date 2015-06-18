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
      
    };
  },

  

  render: function() {
    var panelStyle = upNextPanelStyle.panelStyle;
    var upNextInfoStyle = upNextPanelStyle.upNextInfo;
    var upNextTitleStyle = upNextPanelStyle.upNextTitle;
    var contentNameStyle = upNextPanelStyle.contentName;
    var contentBlockStyle = upNextPanelStyle.contentBlock;
        
    return (
      <div style={panelStyle}>
        <div style={upNextInfoStyle}>
          <div style={upNextTitleStyle}>Up Next</div>
          <div style={contentNameStyle}>Content Name</div>
        </div>
        <div style={contentBlockStyle}>
          <CountDownClock {...this.props} />
        </div>
      </div>
    );
  }
});