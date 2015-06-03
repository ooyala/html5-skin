/********************************************************************
  SHARING SCREEN
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class PlayingScreen
* @constructor
*/
var SharePanel = React.createClass({
  getInitialState: function() {
    return {};
  },

  render: function() {
    var tabStyle  = {display: "inline-block", width: "100px", "height": "50px", color: "#afafaf",
      "lineHeight": "50px", borderRight: "1px solid #afafaf", textAlign: "center", backgroundColor: "#3a3a3a"};

      var lastTabStyle  = {display: "inline-block", width: "100px", "height": "50px", color: "#afafaf",
        "lineHeight": "50px", textAlign: "center", backgroundColor: "#444444"};

    return (
      <div style={{position: "absolute", "top": 0, bottom: "32px", backgroundColor: "#444444",
        left: 0, right: 0, display: "flex", flexDirection: "column"}}>
        <div style={{borderBottom: "1px solid #afafaf"}}>
          <span style={tabStyle}>Share</span>
          <span style={lastTabStyle}>Embed</span>
        </div>
        <div style={{backgroundColor: "#3a3a3a", bottom: 0, flex: 1, color: "white", padding: "20px"}}>
          Title done goes here<br/>
          <div style={{display: "inline-block", height: "25px", width: "25px", backgroundColor: "aqua"}}>t</div>
          <div style={{display: "inline-block", height: "25px", width: "25px", backgroundColor: "blue"}}>f</div>
          <div style={{display: "inline-block", height: "25px", width: "25px", backgroundColor: "red"}}>g+</div><br/>
          <input style={{color:"black"}} type='text' value="HUR HUR HUR"/><br/>
          <input type='checkbox'/> Start at <input style={{color:"black"}} type='text' value="00:00"/><br/>
        </div>
      </div>
    );
  }
});