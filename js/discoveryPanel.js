/********************************************************************
  DISCOVERY SCREEN
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class PlayingScreen
* @constructor
*/

// http://www.markszulc.com/blog/wp-content/uploads/2012/10/CQOoyala.jpg
// icon-chevron-right
var DiscoveryPanel = React.createClass({
  getInitialState: function() {
    return {
      discoveryToasterLeftOffset: 25
    };
  },

  handleLeftButtonClick: function() {
    this.state.discoveryToasterLeftOffset += 250;
    if (this.state.discoveryToasterLeftOffset > 25) {
      this.state.discoveryToasterLeftOffset = 25;
    }
    this.setState({discoveryToasterLeftOffset: this.state.discoveryToasterLeftOffset});
  },

  handleRightButtonClick: function() {
    var toasterContainerWidth = document.getElementById("discovery_toaster_cintainer").clientWidth;
    var toasterWidth = document.getElementById("discovery_toaster").clientWidth;
    this.state.discoveryToasterLeftOffset -= 250;
    if (this.state.discoveryToasterLeftOffset < toasterContainerWidth - toasterWidth) {
      this.state.discoveryToasterLeftOffset = toasterContainerWidth - toasterWidth;
    }
    this.setState({discoveryToasterLeftOffset: this.state.discoveryToasterLeftOffset});
  },

  render: function() {
    var panelTitleBarStyle = {position: "absolute", backgroundColor: "#444444",
        left: 0, right: 0, height: "20%", width: "100%", display: "inline-block"};
    var panelTitleTextStyle = {position: "absolute", left: "25px", fontSize: "20", color: "white", margin: "1%"};

    var discoveryToasterContainerStyle = {position: "absolute", backgroundColor: "#444444", top: "20%", height: "70%", width: "100%"};

    var chevronLeftButtonContainer = {position: "absolute",  backgroundColor: "transparent", height: "100%", width: "25px", color:"white", left: "0"};
    var chevronRightButtonContainer = {position: "absolute", backgroundColor: "transparent", height: "100%", width: "25px", color:"white", right: "0"};


    var discoveryToasterStyle = {position: "absolute", backgroundColor: "#444444", top: "0", height: "90%", width: "1000px",
        left: this.state.discoveryToasterLeftOffset, right: 0, display: "flex", flexDirection: "row", transition: "0.5s"};

    var contentBlockStyle = {position: "relative", width: "100px", height: "80%", margin: "1%", backgroundColor: "white"};

    var imageStyle = {position: "absolute", width: "100%", height: "70%"};

    var contentTitleStyle = {fontSize: "10"};
    var contentPlaysStyle = {fontSize: "8"};
    

    var chevronLeftButtonClass = discoveryScreenStyle.chevronLeftButton.icon;
    var chevronLeftButtonStyle = discoveryScreenStyle.chevronLeftButton.style;

    var chevronRightButtonClass = discoveryScreenStyle.chevronRightButton.icon;
    var chevronRightButtonStyle = discoveryScreenStyle.chevronRightButton.style;
    return (
      <div style={{position: "absolute", "top": "50%", bottom: "32px", backgroundColor: "#444444",
        left: 0, right: 0, display: "flex", flexDirection: "row"}}>

        <div style={panelTitleBarStyle}>
          <h1 style={panelTitleTextStyle}>DISCOVERY</h1>
        </div>

        <div id="discovery_toaster_cintainer" style={discoveryToasterContainerStyle}>

          <div id="discovery_toaster" style={discoveryToasterStyle}>
            <div style={contentBlockStyle}>
             <img style={imageStyle} src="http://www.markszulc.com/blog/wp-content/uploads/2012/10/CQOoyala.jpg"></img>
             <div style={contentTitleStyle}>Contetn Title</div>
             <div style={contentPlaysStyle}>141 plays</div>
            </div> 
            <div style={contentBlockStyle}>
             <img style={imageStyle} src="http://www.markszulc.com/blog/wp-content/uploads/2012/10/CQOoyala.jpg"></img>
             <div style={contentTitleStyle}>Contetn Title</div>
             <div style={contentPlaysStyle}>141 plays</div>
            </div> 

            <div style={contentBlockStyle}>
             <img style={imageStyle} src="http://www.markszulc.com/blog/wp-content/uploads/2012/10/CQOoyala.jpg"></img>
             <div style={contentTitleStyle}>Contetn Title</div>
             <div style={contentPlaysStyle}>141 plays</div>
            </div> 

            <div style={contentBlockStyle}>
             <img style={imageStyle} src="http://www.markszulc.com/blog/wp-content/uploads/2012/10/CQOoyala.jpg"></img>
             <div style={contentTitleStyle}>Contetn Title</div>
             <div style={contentPlaysStyle}>141 plays</div>
            </div> 

            <div style={contentBlockStyle}>
             <img style={imageStyle} src="http://www.markszulc.com/blog/wp-content/uploads/2012/10/CQOoyala.jpg"></img>
             <div style={contentTitleStyle}>Contetn Title</div>
             <div style={contentPlaysStyle}>141 plays</div>
            </div>  

            <div style={contentBlockStyle}>
             <img style={imageStyle} src="http://www.markszulc.com/blog/wp-content/uploads/2012/10/CQOoyala.jpg"></img>
             <div style={contentTitleStyle}>Contetn Title</div>
             <div style={contentPlaysStyle}>141 plays</div>
            </div> 
            <div style={contentBlockStyle}>
             <img style={imageStyle} src="http://www.markszulc.com/blog/wp-content/uploads/2012/10/CQOoyala.jpg"></img>
             <div style={contentTitleStyle}>Contetn Title</div>
             <div style={contentPlaysStyle}>141 plays</div>
            </div> 

            <div style={contentBlockStyle}>
             <img style={imageStyle} src="http://www.markszulc.com/blog/wp-content/uploads/2012/10/CQOoyala.jpg"></img>
             <div style={contentTitleStyle}>Contetn Title</div>
             <div style={contentPlaysStyle}>141 plays</div>
            </div> 

            <div style={contentBlockStyle}>
             <img style={imageStyle} src="http://www.markszulc.com/blog/wp-content/uploads/2012/10/CQOoyala.jpg"></img>
             <div style={contentTitleStyle}>Contetn Title</div>
             <div style={contentPlaysStyle}>141 plays</div>
            </div> 

            <div style={contentBlockStyle}>
             <img style={imageStyle} src="http://www.markszulc.com/blog/wp-content/uploads/2012/10/CQOoyala.jpg"></img>
             <div style={contentTitleStyle}>Contetn Title</div>
             <div style={contentPlaysStyle}>141 plays</div>
            </div> 


          </div>

          <div style={chevronLeftButtonContainer}>
            <span className={chevronLeftButtonClass} style={chevronLeftButtonStyle} aria-hidden="true" onClick={this.handleLeftButtonClick}></span>
          </div>
          <div style={chevronRightButtonContainer}>
            <span className={chevronRightButtonClass} style={chevronRightButtonStyle} aria-hidden="true" onClick={this.handleRightButtonClick}></span>
          </div>
        </div>
      </div>
    );
  }
});

var discoveryScreenStyle = {
  
  chevronLeftButton: {
    icon: "glyphicon glyphicon-chevron-left",
    style: {
      top: "50%",
      left: "50%",
      fontSize: "18",
      transform: "translate(-50%, -50%)",
      position: "absolute",
      opacity: 1,
      transition: "opacity .25s ease-in-out"
    }
  },

  chevronRightButton: {
    icon: "glyphicon glyphicon-chevron-right",
    style: {
      top: "50%",
      left: "50%",
      fontSize: "18",
      transform: "translate(-50%, -50%)",
      position: "absolute",
      opacity: 1,
      transition: "opacity .25s ease-in-out"
    }
  } 
};