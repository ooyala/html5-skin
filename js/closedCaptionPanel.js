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
    var panelHeight = clientHeight - controlBarHeight; //calculating the height of the panel where table with languages goes
    panelHeight -= 4/3*closedCaptionScreenStyles.captionStyle.fontSize;
    panelHeight -= 2*closedCaptionScreenStyles.innerPanelStyle.padding;
    panelHeight -= closedCaptionScreenStyles.switchStyle.height;
    panelHeight -= closedCaptionScreenStyles.switchStyle.marginTop;
    panelHeight -= 1*closedCaptionScreenStyles.itemStyle.marginTop + 2*closedCaptionScreenStyles.itemSelectedStyle.padding;
    panelHeight -= closedCaptionScreenStyles.CCPreviewPanelStyle.height;

    //number of table rows that can fit into the panel
    var numRows = Math.floor(panelHeight/(4/3*closedCaptionScreenStyles.itemSelectedStyle.fontSize+1*closedCaptionScreenStyles.itemStyle.marginTop + 2*closedCaptionScreenStyles.itemSelectedStyle.padding));
    return numRows;
  },

  //Responsive design code for later

  // setResponsiveStyle: function(clientWidth, controlBarHeight){
  //   var scale = Math.min(1, Math.max(clientWidth/1280, 0.3));

  //   closedCaptionScreenStyles.CCPreviewPanelStyle.bottom = controlBarHeight;

  //   closedCaptionScreenStyles.innerPanelStyle.padding = 35 * scale;

  //   closedCaptionScreenStyles.captionStyle.fontSize = 32 * scale;

  //   closedCaptionScreenStyles.switchStyle.marginTop = 35 * scale;
  //   closedCaptionScreenStyles.switchStyle.height = 28 * scale;
  //   closedCaptionScreenStyles.switchStyle.width = 140 * scale;
  //   closedCaptionScreenStyles.switchStyle.fontSize = 20 * scale;

  //   closedCaptionScreenStyles.CCPreviewPanelStyle.height = 70 * scale;

  //   closedCaptionScreenStyles.CCPreviewTextStyle.fontSize = 24 * scale;
  //   closedCaptionScreenStyles.CCPreviewTextStyle.marginLeft = closedCaptionScreenStyles.innerPanelStyle.padding;

  //   closedCaptionScreenStyles.CCPreviewCaptionStyle.fontSize = 12 * scale;
  //   closedCaptionScreenStyles.CCPreviewCaptionStyle.marginLeft = closedCaptionScreenStyles.innerPanelStyle.padding;
  //   closedCaptionScreenStyles.CCPreviewCaptionStyle.marginTop = 1/3*(closedCaptionScreenStyles.CCPreviewPanelStyle.height - 4/3*closedCaptionScreenStyles.CCPreviewTextStyle.fontSize-4/3*closedCaptionScreenStyles.CCPreviewCaptionStyle.fontSize);
  //   closedCaptionScreenStyles.CCPreviewCaptionStyle.marginBottom = closedCaptionScreenStyles.CCPreviewCaptionStyle.marginTop;

  //   this.setResponsiveStyleCCLanguages(clientWidth);
  // },

  // setResponsiveStyleCCLanguages: function(clientWidth){
  //   var scale = Math.max(clientWidth/1280, 0.3);

  //   closedCaptionScreenStyles.itemStyle.fontSize = 22 * scale;
  //   closedCaptionScreenStyles.itemStyle.padding = 3;
  //   closedCaptionScreenStyles.itemStyle.marginRight = 140 * scale - 2*closedCaptionScreenStyles.itemStyle.padding;
  //   closedCaptionScreenStyles.itemStyle.marginTop = 40 * scale - 2*closedCaptionScreenStyles.itemStyle.padding;

  //   closedCaptionScreenStyles.lastColItemStyle.fontSize = closedCaptionScreenStyles.itemStyle.fontSize;
  //   closedCaptionScreenStyles.lastColItemStyle.padding = closedCaptionScreenStyles.itemStyle.padding;
  //   closedCaptionScreenStyles.lastColItemStyle.marginRight = 0;
  //   closedCaptionScreenStyles.lastColItemStyle.marginTop = closedCaptionScreenStyles.itemStyle.marginTop;

  //   closedCaptionScreenStyles.itemSelectedStyle.fontSize = closedCaptionScreenStyles.itemStyle.fontSize;
  //   closedCaptionScreenStyles.itemSelectedStyle.padding = closedCaptionScreenStyles.itemStyle.padding;
  //   closedCaptionScreenStyles.itemSelectedStyle.marginRight = closedCaptionScreenStyles.itemStyle.marginRight;
  //   closedCaptionScreenStyles.itemSelectedStyle.marginTop = closedCaptionScreenStyles.itemStyle.marginTop;

  //   closedCaptionScreenStyles.lastColItemSelectedStyle.fontSize = closedCaptionScreenStyles.lastColItemStyle.fontSize;
  //   closedCaptionScreenStyles.lastColItemSelectedStyle.padding = closedCaptionScreenStyles.lastColItemStyle.padding;
  //   closedCaptionScreenStyles.lastColItemSelectedStyle.marginRight = closedCaptionScreenStyles.lastColItemStyle.marginRight;
  //   closedCaptionScreenStyles.lastColItemSelectedStyle.marginTop = closedCaptionScreenStyles.lastColItemStyle.marginTop;

  //   closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer.width = 50 * scale;
  //   closedCaptionScreenStyles.closedCaptionChevronRightButtonContainer.width = closedCaptionScreenStyles.tableLanguageStyle.marginLeft = closedCaptionScreenStyles.tableLanguageStyle.marginRight = closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer.width;
  //   closedCaptionScreenStyles.closedCaptionChevronLeftButton.style.fontSize = 32 * scale;
  //   closedCaptionScreenStyles.closedCaptionChevronRightButton.style.fontSize = closedCaptionScreenStyles.closedCaptionChevronLeftButton.style.fontSize;
  //  },

  render: function(){
    var controlBarHeight = 60;

    //this.setResponsiveStyle(this.props.clientWidth, controlBarHeight); //Leave this for later when we use the resizing
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

    closedCaptionScreenStyles.closedCaptionChevronRightButtonContainer.visibility = (this.refs.tableLanguageContainer.getDOMNode().clientWidth + this.state.scrollLeftDistance + 1 < this.refs.tableLanguage.getDOMNode().clientWidth)?"visible":"hidden";
    closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer.visibility = (this.state.scrollLeftDistance > 0 && this.refs.tableLanguageContainer.getDOMNode().clientWidth < this.refs.tableLanguage.getDOMNode().clientWidth) ? "visible" : "hidden";
    this.refs.tableLanguageContainer.getDOMNode().scrollLeft = this.state.scrollLeftDistance;

    if (oldChevronRightVisibility != closedCaptionScreenStyles.closedCaptionChevronRightButtonContainer.visibility || oldChevronLeftVisibility != closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer.visibility){
      this.forceUpdate();//to update the screen if chevron buttons changed visibility
    }
  },

  changeLanguage: function(language){
    this.props.controller.onClosedCaptionLanguageChange(language);
  },

  handleLeftChevronClick: function(){
    this.refs.tableLanguageContainer.getDOMNode().scrollLeft += -1*this.refs.tableLanguageContainer.getDOMNode().clientWidth*0.9; //0.9 so that the chopped off words have a chance to be shown fully
    this.setState({scrollLeftDistance: this.refs.tableLanguageContainer.getDOMNode().scrollLeft});
  },

  handleRightChevronClick: function(){
    this.refs.tableLanguageContainer.getDOMNode().scrollLeft += this.refs.tableLanguageContainer.getDOMNode().clientWidth*0.9;
    this.setState({scrollLeftDistance: this.refs.tableLanguageContainer.getDOMNode().scrollLeft});
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
      <div style={{position: "relative"}}>
        <div style={closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer} onClick={this.props.ccOptions.enabled ? this.handleLeftChevronClick : null}>
          <span className={closedCaptionScreenStyles.closedCaptionChevronLeftButton.icon} style={closedCaptionScreenStyles.closedCaptionChevronLeftButton.style} aria-hidden="true"></span>
        </div>
        <div style={closedCaptionScreenStyles.closedCaptionChevronRightButtonContainer} onClick={this.props.ccOptions.enabled ? this.handleRightChevronClick : null}>
          <span className={closedCaptionScreenStyles.closedCaptionChevronRightButton.icon} style={closedCaptionScreenStyles.closedCaptionChevronRightButton.style} aria-hidden="true"></span>
        </div>
        <div style = {closedCaptionScreenStyles.tableLanguageStyle} ref="tableLanguageContainer">
          <table ref = "tableLanguage">
            {
              table.map(function(row,i){
                return (
                  <tr key = {i}>
                    {row.map(function(item, j){
                      return (
                        <td key = {j} onClick = {this.props.ccOptions.enabled ? this.changeLanguage.bind(this, item) : null}>
                          <div style = {(this.props.ccOptions.language == item && this.props.ccOptions.enabled) ? ((j == colnum) ? closedCaptionScreenStyles.lastColItemSelectedStyle : closedCaptionScreenStyles.itemSelectedStyle) : ((j == colnum) ? closedCaptionScreenStyles.lastColItemStyle : closedCaptionScreenStyles.itemStyle)} 
                          ><div>{availableLanguages.locale[item]}</div></div>
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