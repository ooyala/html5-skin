/********************************************************************
  DISCOVERY SCREEN
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class PlayingScreen
* @constructor
*/
var DiscoveryPanel = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    var tabStyle  = {display: "inline-block", width: "100px", "height": "50px", color: "#afafaf",
      "lineHeight": "50px", borderRight: "1px solid #afafaf", textAlign: "center", backgroundColor: "#3a3a3a"};

      var lastTabStyle  = {display: "inline-block", width: "100px", "height": "50px", color: "#afafaf",
        "lineHeight": "50px", textAlign: "center", backgroundColor: "#444444"};

    return (
      <div style={{position: "absolute", "top": "50%", bottom: "32px", backgroundColor: "#444444",
        left: 0, right: 0, display: "flex", flexDirection: "column"}}>
      </div>
    );
  }
});