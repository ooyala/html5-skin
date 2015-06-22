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
  componentDidMount: function() {
    // this.state.radius = this.getDOMNode().clientHeight * 0.4;
    // this.state.width = this.getDOMNode().clientWidth * 0.6 * 0.8;
  },
  
  render: function() {
    var panelStyle = upNextPanelStyle.panelStyle;
    var upNextInfoStyle = upNextPanelStyle.upNextInfo;
    var upNextTitleStyle = upNextPanelStyle.upNextTitle;
    var contentNameStyle = upNextPanelStyle.contentName;
    var contentBlockStyle = upNextPanelStyle.contentBlock;
    var countDownClockStyle = upNextPanelStyle.countDownClock;
    var contentBlockImageContainerStyle = upNextPanelStyle.contentBlockImageContainer;
    var contentBlockImageStyle = upNextPanelStyle.contentBlockImage;
    var contentName = this.props.upNextData.name;

    // This is for turning off the old discovery panel.
    // TODO: Remove the following line when we drop the old discovery panel in mjolnir side.
    document.getElementsByClassName("discovery_toaster")[0].style.display="none"; 
    return (
      <div style={panelStyle}>
        <div style={upNextInfoStyle}>
          <div style={upNextTitleStyle}>Up Next</div>
          <div style={contentNameStyle}>{contentName}</div>
        </div>
        <div style={contentBlockStyle}>
          <div style={contentBlockImageContainerStyle}>
             <img style={contentBlockImageStyle} src={this.props.upNextData.preview_image_url}></img>
          </div>
          
          <UpNextClockBlock {...this.props} />
        </div>
      </div>
    );
  }
});