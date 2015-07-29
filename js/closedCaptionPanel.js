/********************************************************************
  CLOSED CAPTION PANEL
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class ClosedCaptionPanel
* @constructor
*/


var ClosedCaptionPanel = React.createClass({

  calculateNumberOfRows: function(clientWidth, clientHeight, controlBarHeight){
    var switchHeight = 1*closedCaptionScreenStyles.switchStyle.height + 1*closedCaptionScreenStyles.switchStyle.marginTop;
    var CCPreviewPanelHeight = 1*closedCaptionScreenStyles.CCPreviewPanelStyle.height;
    var captionHeight = 4/3*parseInt(closedCaptionScreenStyles.captionStyle.fontSize);
    var innerPanelPaddingHeight = 2*closedCaptionScreenStyles.innerPanelStyle.padding;
    var scrubberBarHeight = 1*scrubberBarStyle.scrubberBarSetting.height + (1*scrubberBarStyle.playheadStyle.height - 1*scrubberBarStyle.scrubberBarSetting.height)/2;

    //height of the panel that should fit the table
    var panelHeight = clientHeight - controlBarHeight - scrubberBarHeight - CCPreviewPanelHeight - captionHeight - innerPanelPaddingHeight - switchHeight;
    //height of a table row
    var tabelRowHeight = 4/3*parseInt(closedCaptionScreenStyles.itemSelectedStyle.fontSize) + 1*closedCaptionScreenStyles.itemStyle.marginTop + 2*closedCaptionScreenStyles.itemSelectedStyle.padding;

    var numRows = Math.floor(panelHeight/tabelRowHeight);

    console.log("xenia", captionHeight);
    return numRows;
  },

  // Responsive design code for later

  // setResponsiveStyle: function(clientWidth, controlBarHeight){
  //   var scale = Math.min(1, Math.max(clientWidth/1280, 0.3));

  //   var scrubberBarHeight = 1*scrubberBarStyle.scrubberBarSetting.height + (1*scrubberBarStyle.playheadStyle.height - 1*scrubberBarStyle.scrubberBarSetting.height)/2;

  //   closedCaptionScreenStyles.CCPreviewPanelStyle.bottom = controlBarHeight + scrubberBarHeight;
  //   console.log("xenia bottom",closedCaptionScreenStyles.CCPreviewPanelStyle.bottom);

  //   closedCaptionScreenStyles.innerPanelStyle.padding = 35 * scale;

  //   closedCaptionScreenStyles.captionStyle.fontSize = 32 * scale + "pt";

  //   closedCaptionScreenStyles.switchStyle.marginTop = 35 * scale;
  //   closedCaptionScreenStyles.switchStyle.height = 28 * scale;
  //   closedCaptionScreenStyles.switchStyle.width = 140 * scale;
  //   closedCaptionScreenStyles.switchStyle.fontSize = 20 * scale + "pt";

  //   closedCaptionScreenStyles.CCPreviewPanelStyle.height = 70 * scale;

  //   closedCaptionScreenStyles.CCPreviewTextStyle.fontSize = 24 * scale + "pt";
  //   closedCaptionScreenStyles.CCPreviewTextStyle.marginLeft = closedCaptionScreenStyles.innerPanelStyle.padding;

  //   closedCaptionScreenStyles.CCPreviewCaptionStyle.fontSize = 12 * scale + "pt";
  //   closedCaptionScreenStyles.CCPreviewCaptionStyle.marginLeft = closedCaptionScreenStyles.innerPanelStyle.padding;
  //   closedCaptionScreenStyles.CCPreviewCaptionStyle.marginTop = 1/4*(closedCaptionScreenStyles.CCPreviewPanelStyle.height - 4/3*parseInt(closedCaptionScreenStyles.CCPreviewTextStyle.fontSize)-4/3*parseInt(closedCaptionScreenStyles.CCPreviewCaptionStyle.fontSize));
  //   closedCaptionScreenStyles.CCPreviewCaptionStyle.marginBottom = closedCaptionScreenStyles.CCPreviewCaptionStyle.marginTop;

  //   this.setResponsiveStyleCCLanguages(clientWidth);
  // },

  // setResponsiveStyleCCLanguages: function(clientWidth){
  //   var scale = Math.max(clientWidth/1280, 0.3);

  //   closedCaptionScreenStyles.itemStyle.fontSize = 22 * scale + "pt";
  //   closedCaptionScreenStyles.itemStyle.padding = 3;
  //   closedCaptionScreenStyles.itemStyle.width = 140 * scale;
  //   closedCaptionScreenStyles.itemStyle.marginRight = 140 * scale - 2*closedCaptionScreenStyles.itemStyle.padding;
  //   closedCaptionScreenStyles.itemStyle.marginTop = 40 * scale - 2*closedCaptionScreenStyles.itemStyle.padding;

  //   closedCaptionScreenStyles.lastColItemStyle.fontSize = closedCaptionScreenStyles.itemStyle.fontSize;
  //   closedCaptionScreenStyles.lastColItemStyle.padding = closedCaptionScreenStyles.itemStyle.padding;
  //   closedCaptionScreenStyles.lastColItemStyle.width = closedCaptionScreenStyles.itemStyle.width;
  //   closedCaptionScreenStyles.lastColItemStyle.marginRight = 0;
  //   closedCaptionScreenStyles.lastColItemStyle.marginTop = closedCaptionScreenStyles.itemStyle.marginTop;

  //   closedCaptionScreenStyles.itemSelectedStyle.fontSize = closedCaptionScreenStyles.itemStyle.fontSize;
  //   closedCaptionScreenStyles.itemSelectedStyle.padding = closedCaptionScreenStyles.itemStyle.padding;
  //   closedCaptionScreenStyles.itemSelectedStyle.width = closedCaptionScreenStyles.itemStyle.width;
  //   closedCaptionScreenStyles.itemSelectedStyle.marginRight = closedCaptionScreenStyles.itemStyle.marginRight;
  //   closedCaptionScreenStyles.itemSelectedStyle.marginTop = closedCaptionScreenStyles.itemStyle.marginTop;

  //   closedCaptionScreenStyles.lastColItemSelectedStyle.fontSize = closedCaptionScreenStyles.lastColItemStyle.fontSize;
  //   closedCaptionScreenStyles.lastColItemSelectedStyle.padding = closedCaptionScreenStyles.lastColItemStyle.padding;
  //   closedCaptionScreenStyles.lastColItemSelectedStyle.width = closedCaptionScreenStyles.itemSelectedStyle.width;
  //   closedCaptionScreenStyles.lastColItemSelectedStyle.marginRight = closedCaptionScreenStyles.lastColItemStyle.marginRight;
  //   closedCaptionScreenStyles.lastColItemSelectedStyle.marginTop = closedCaptionScreenStyles.lastColItemStyle.marginTop;

  //   closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer.width = 50 * scale;
  //   closedCaptionScreenStyles.closedCaptionChevronRightButtonContainer.width = closedCaptionScreenStyles.tableLanguageContainerStyle.marginLeft = closedCaptionScreenStyles.tableLanguageContainerStyle.marginRight = closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer.width;
  //   closedCaptionScreenStyles.closedCaptionChevronLeftButton.style.fontSize = 32 * scale + "pt";
  //   closedCaptionScreenStyles.closedCaptionChevronRightButton.style.fontSize = closedCaptionScreenStyles.closedCaptionChevronLeftButton.style.fontSize;
  //  },

  render: function(){
    var controlBarHeight = 60;

    // this.setResponsiveStyle(this.props.clientWidth, controlBarHeight); //Leave this for later when we use the resizing
    var numRows = this.calculateNumberOfRows(this.props.clientWidth, this.props.clientHeight, controlBarHeight);

    return (
      <div style = {closedCaptionScreenStyles.screenStyle}>
        <div style = {closedCaptionScreenStyles.innerPanelStyle}>
          <div style = {closedCaptionScreenStyles.captionStyle}>CC Options <span className="icon icon-topmenu-cc"></span></div>
          <OnOffSwitch {...this.props} />
          <LanguageTabContent {...this.props} numRows = {numRows} />
          <CCPreviewPanel {...this.props} />
        </div>
      </div>
    );
  }
});

var OnOffSwitch = React.createClass({

  componentWillMount: function(){
    this.toggleCCStyles();
  },

  handleOnOffSwitch: function(){
    this.props.controller.toggleClosedCaptionEnabled();
    this.toggleCCStyles();
  },

  toggleCCStyles: function(){
    closedCaptionScreenStyles.switch.background = this.props.ccOptions.enabled ? closedCaptionScreenStyles.switch.onBackground : "grey";
    closedCaptionScreenStyles.switchThumb.left = this.props.ccOptions.enabled ? "" : "0";
    closedCaptionScreenStyles.switchThumb.right = this.props.ccOptions.enabled ? "0" : "";

    var elementColor = this.props.ccOptions.enabled ? "white" : "grey";
    closedCaptionScreenStyles.itemStyle.color = elementColor;
    closedCaptionScreenStyles.lastColItemStyle.color = elementColor;
    closedCaptionScreenStyles.CCPreviewTextStyle.color = elementColor;
    closedCaptionScreenStyles.CCPreviewCaptionStyle.color = elementColor;
    closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer.color = closedCaptionScreenStyles.closedCaptionChevronRightButtonContainer.color = elementColor;

    closedCaptionScreenStyles.onStyle.color = elementColor;
    closedCaptionScreenStyles.offStyle.color = this.props.ccOptions.enabled ? "grey" : "white";

  },

  render: function(){
    return (
        <div style={closedCaptionScreenStyles.switchStyle} onClick = {this.handleOnOffSwitch}>
          <span style={closedCaptionScreenStyles.offStyle}>Off</span>
          <div style={closedCaptionScreenStyles.switchContainer}>
            <span style={closedCaptionScreenStyles.switch}></span>
            <span style={closedCaptionScreenStyles.switchThumb}></span>
          </div>
          <span style={closedCaptionScreenStyles.onStyle}>On</span>
        </div>
    );
  }
});


var CCPreviewPanel = React.createClass({
  render: function(){
    return (
      <div style = {closedCaptionScreenStyles.CCPreviewPanelStyle}>
        <div style = {closedCaptionScreenStyles.CCPreviewCaptionStyle}>CLOSED CAPTION PREVIEW</div>
        <div style = {closedCaptionScreenStyles.CCPreviewTextStyle}>Sample Text</div>
      </div>
    );
  }
});

var LanguageTabContent = React.createClass({
  getInitialState: function() {
    return {
      selectedLanguage: this.props.ccOptions.language,
      scrollLeftDistance: 0
    };
  },

  componentDidUpdate: function(){
    var oldChevronRightVisibility = closedCaptionScreenStyles.closedCaptionChevronRightButtonContainer.visibility;
    var oldChevronLeftVisibility = closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer.visibility;

    //right chevron button is visible if (scrollLeftDistance + table container) are less than table width
    closedCaptionScreenStyles.closedCaptionChevronRightButtonContainer.visibility = (Math.ceil(this.refs.tableLanguageContainer.getDOMNode().clientWidth + this.state.scrollLeftDistance) < this.refs.tableLanguage.getDOMNode().clientWidth) ? "visible" : "hidden";
    //left chevron button is visible if scrollLeftDistance is > 0 and table does not fit into the container
    closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer.visibility = (this.state.scrollLeftDistance > 0 && this.refs.tableLanguageContainer.getDOMNode().clientWidth < this.refs.tableLanguage.getDOMNode().clientWidth) ? "visible" : "hidden";
    this.refs.tableLanguageContainer.getDOMNode().scrollLeft = this.state.scrollLeftDistance;

    if (oldChevronRightVisibility != closedCaptionScreenStyles.closedCaptionChevronRightButtonContainer.visibility || 
      oldChevronLeftVisibility != closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer.visibility){
      this.forceUpdate();//to update the screen if chevron buttons changed visibility
    }
  },

  calculateScrollDistance: function(){
    var colWidth = 1*closedCaptionScreenStyles.itemStyle.width + 1*closedCaptionScreenStyles.itemStyle.marginRight + 2*closedCaptionScreenStyles.itemStyle.padding;
    var numCols =  Math.floor((this.refs.tableLanguageContainer.getDOMNode().clientWidth + 1*closedCaptionScreenStyles.itemStyle.marginRight) / (colWidth));
    var scrollDistance = numCols * colWidth;

    return scrollDistance;
  },

  changeLanguage: function(language){
    this.props.controller.onClosedCaptionLanguageChange(language);
  },

  handleLeftChevronClick: function(){
    this.refs.tableLanguageContainer.getDOMNode().scrollLeft += -1*this.calculateScrollDistance();
    this.setState({scrollLeftDistance: this.refs.tableLanguageContainer.getDOMNode().scrollLeft});
  },

  handleRightChevronClick: function(){
    this.refs.tableLanguageContainer.getDOMNode().scrollLeft += 1*this.calculateScrollDistance();
    this.setState({scrollLeftDistance: this.refs.tableLanguageContainer.getDOMNode().scrollLeft});
  },

  setStyle: function(item, j, colnum){
    var style;
    if (this.props.ccOptions.language == item && this.props.ccOptions.enabled){
      if (j == colnum){
        style = closedCaptionScreenStyles.lastColItemSelectedStyle;
      }
      else {
        style = closedCaptionScreenStyles.itemSelectedStyle;
      }
    }
    else {
      if (j == colnum){
        style = closedCaptionScreenStyles.lastColItemStyle;
      }
      else {
        style = closedCaptionScreenStyles.itemStyle;
      }
    }

    return style;
  },


  render: function(){
    var availableLanguages = this.props.ccOptions.availableLanguages; //getting list of languages

    var languageCodes = availableLanguages.languages; // getting an array of all the codes
    var maxNumberOfRows = 5; // per specs

    //number of columns and rows in a table to display
    var rows = Math.min(maxNumberOfRows,(this.props.numRows > 0) ? this.props.numRows : 1);
    var columns = Math.floor(languageCodes.length/rows) + 1;

    var table = new Array(rows); //creating an array for easier rendering (have to do this to fill the table by columns)
    for (var i = 0; i < table.length; i++){
      table[i] = new Array(columns);
    }

    for (var j = 0; j < languageCodes.length; j++){//putting elements into that array
      var rownum = j%rows;
      var colnum = Math.floor(j/rows);
      table[rownum][colnum] = languageCodes[j];
    }

    return(
      <div style={closedCaptionScreenStyles.positionRelativeStyle}>
        <div style={closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer} onClick={this.props.ccOptions.enabled ? this.handleLeftChevronClick : null}>
          <span className={closedCaptionScreenStyles.closedCaptionChevronLeftButton.icon} style={closedCaptionScreenStyles.closedCaptionChevronLeftButton.style} aria-hidden="true"></span>
        </div>
        <div style={closedCaptionScreenStyles.closedCaptionChevronRightButtonContainer} onClick={this.props.ccOptions.enabled ? this.handleRightChevronClick : null}>
          <span className={closedCaptionScreenStyles.closedCaptionChevronRightButton.icon} style={closedCaptionScreenStyles.closedCaptionChevronRightButton.style} aria-hidden="true"></span>
        </div>
        <div style = {closedCaptionScreenStyles.tableLanguageContainerStyle} ref="tableLanguageContainer">
          <table ref = "tableLanguage" style = {closedCaptionScreenStyles.tableLanguageStyle}>
            {
              table.map(function(row,i){
                return (
                  <tr key = {i}>
                    {row.map(function(item, j){
                      return (
                        <td key = {j} onClick = {this.props.ccOptions.enabled ? this.changeLanguage.bind(this, item) : null} style = {closedCaptionScreenStyles.tdLanguageStyle}>
                          <div style = {this.setStyle(item, j, colnum)}>{availableLanguages.locale[item]}</div>
                        </td>
                      );
                    },this)}
                  </tr>
                );
              },this)
            }
          </table>
        </div>
      </div>
    );
  }
});