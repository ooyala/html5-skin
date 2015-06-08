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
    return {
      discoveryToasterLeftOffset: 25,
      discoveryDataStructure: {},
      relatedVideos: {}
    };
  },

  handleLeftButtonClick: function() {
    this.state.discoveryToasterLeftOffset += 400;
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
    console.log("toasterContainerWidth = " + toasterContainerWidth);
    console.log("toasterWidth = " + toasterWidth);
    console.log("discoveryToasterLeftOffset = " + this.state.discoveryToasterLeftOffset);
    this.setState({discoveryToasterLeftOffset: this.state.discoveryToasterLeftOffset});

  },

  render: function() {
    var discoveryData = this.props.discoveryData;
    if (discoveryData !== null)  {
        console.log("get discoveryData!!!!!!!!!!!!!" + discoveryData.relatedVideos);
        // this.buildDiscoveryDataStructureWithData(discoveryData.relatedVideos);
    }
    var panelStyle = discoveryScreenStyle.panelStyle;

    var panelTitleBarStyle = discoveryScreenStyle.panelTitleBarStyle;
    var panelTitleTextStyle = discoveryScreenStyle.panelTitleTextStyle;

    var discoveryToasterContainerStyle = discoveryScreenStyle.discoveryToasterContainerStyle;
    var discoveryToasterStyle = discoveryScreenStyle.discoveryToasterStyle;
    discoveryToasterStyle.left = this.state.discoveryToasterLeftOffset;

    var contentBlockStyle = discoveryScreenStyle.discoveryContentBlockStyle;
    var imageStyle = discoveryScreenStyle.discoveryImageStyle;

    var contentTitleStyle = discoveryScreenStyle.discoveryContentTitleStyle;
    var contentPlaysStyle = discoveryScreenStyle.discoveryContentPlaysStyle;
    

    var chevronLeftButtonContainer = discoveryScreenStyle.discoveryChevronLeftButtonContainer;
    var chevronLeftButtonClass = discoveryScreenStyle.discoveryChevronLeftButton.icon;
    var chevronLeftButtonStyle = discoveryScreenStyle.discoveryChevronLeftButton.style;

    var chevronRightButtonContainer = discoveryScreenStyle.discoveryChevronRightButtonContainer;
    var chevronRightButtonClass = discoveryScreenStyle.discoveryChevronRightButton.icon;
    var chevronRightButtonStyle = discoveryScreenStyle.discoveryChevronRightButton.style;

    return (
      <div style={panelStyle}>

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