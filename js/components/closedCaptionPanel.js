/********************************************************************
  CLOSED CAPTION PANEL
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class ClosedCaptionPanel
* @constructor
*/
var React = require('react'),
    CONSTANTS = require('../constants/constants'),
    InlineStyle = require('../styles/inlineStyle'),
    Utils = require('./utils'),
    ccStyle = InlineStyle.closedCaptionScreenStyles;

var ClosedCaptionPanel = React.createClass({
  calculateNumberOfRows: function(clientWidth, clientHeight){
    var switchHeight = parseInt(ccStyle.switchStyle.height) + parseInt(ccStyle.switchStyle.marginTop);
    var CCPreviewPanelHeight = parseInt(ccStyle.CCPreviewPanelStyle.height);
    var captionHeight = 4/3*parseInt(ccStyle.captionStyle.fontSize);
    var innerPanelPaddingHeight = 2*parseInt(ccStyle.innerPanelStyle.padding);

    //height of the panel that should fit the table
    var panelHeight = clientHeight - CCPreviewPanelHeight - captionHeight - innerPanelPaddingHeight - switchHeight;
    //height of a table row
    var tableRowHeight = 2*parseInt(ccStyle.itemSelectedStyle.fontSize) + parseInt(ccStyle.itemStyle.marginTop) + 2*parseInt(ccStyle.itemSelectedStyle.padding);

    var numRows = Math.floor(panelHeight/tableRowHeight);

    return numRows;
  },

/*   Responsive design code for later

   setResponsiveStyle: function(clientWidth){
     var scale = Math.min(1, Math.max(clientWidth/1280, 0.3));

     ccStyle.CCPreviewPanelStyle.bottom = 15 * scale;

     ccStyle.innerPanelStyle.padding = 35 * scale;

     ccStyle.closeButtonStyle.right = ccStyle.innerPanelStyle.padding;
     ccStyle.closeButtonStyle.top = ccStyle.innerPanelStyle.padding;

     ccStyle.captionStyle.fontSize = 32 * scale + "pt";

     ccStyle.switchStyle.marginTop = 35 * scale;
     ccStyle.switchStyle.height = 28 * scale;
     ccStyle.switchStyle.width = 140 * scale;
     ccStyle.switchStyle.fontSize = 20 * scale + "pt";

     ccStyle.CCPreviewPanelStyle.height = 70 * scale;

     ccStyle.CCPreviewTextStyle.fontSize = 24 * scale + "pt";
     ccStyle.CCPreviewTextStyle.marginLeft = ccStyle.innerPanelStyle.padding;

     ccStyle.CCPreviewCaptionStyle.fontSize = 12 * scale + "pt";
     ccStyle.CCPreviewCaptionStyle.marginLeft = ccStyle.innerPanelStyle.padding;
     ccStyle.CCPreviewCaptionStyle.marginTop = 1/4*(parseInt(ccStyle.CCPreviewPanelStyle.height) - 4/3*parseInt(ccStyle.CCPreviewTextStyle.fontSize)-4/3*parseInt(ccStyle.CCPreviewCaptionStyle.fontSize));
     ccStyle.CCPreviewCaptionStyle.marginBottom = ccStyle.CCPreviewCaptionStyle.marginTop;

     this.setResponsiveStyleCCLanguages(clientWidth);
   },

   setResponsiveStyleCCLanguages: function(clientWidth){
     var scale = Math.max(clientWidth/1280, 0.3);

     ccStyle.itemStyle.fontSize = 22 * scale + "pt";
     ccStyle.itemStyle.padding = 3;
     ccStyle.itemStyle.width = 140 * scale;
     ccStyle.itemStyle.marginRight = 140 * scale - 2*parseInt(ccStyle.itemStyle.padding);
     ccStyle.itemStyle.marginTop = 40 * scale - 2*parseInt(ccStyle.itemStyle.padding);

     ccStyle.lastColumnItemStyle.fontSize = ccStyle.itemStyle.fontSize;
     ccStyle.lastColumnItemStyle.padding = ccStyle.itemStyle.padding;
     ccStyle.lastColumnItemStyle.width = ccStyle.itemStyle.width;
     ccStyle.lastColumnItemStyle.marginRight = 0;
     ccStyle.lastColumnItemStyle.marginTop = ccStyle.itemStyle.marginTop;

     ccStyle.itemSelectedStyle.fontSize = ccStyle.itemStyle.fontSize;
     ccStyle.itemSelectedStyle.padding = ccStyle.itemStyle.padding;
     ccStyle.itemSelectedStyle.width = ccStyle.itemStyle.width;
     ccStyle.itemSelectedStyle.marginRight = ccStyle.itemStyle.marginRight;
     ccStyle.itemSelectedStyle.marginTop = ccStyle.itemStyle.marginTop;

     ccStyle.lastColumnItemSelectedStyle.fontSize = ccStyle.lastColumnItemStyle.fontSize;
     ccStyle.lastColumnItemSelectedStyle.padding = ccStyle.lastColumnItemStyle.padding;
     ccStyle.lastColumnItemSelectedStyle.width = ccStyle.itemSelectedStyle.width;
     ccStyle.lastColumnItemSelectedStyle.marginRight = ccStyle.lastColumnItemStyle.marginRight;
     ccStyle.lastColumnItemSelectedStyle.marginTop = ccStyle.lastColumnItemStyle.marginTop;

     ccStyle.closedCaptionChevronLeftButtonContainer.width = 50 * scale;
     ccStyle.closedCaptionChevronRightButtonContainer.width = ccStyle.tableLanguageContainerStyle.marginLeft = ccStyle.tableLanguageContainerStyle.marginRight = ccStyle.closedCaptionChevronLeftButtonContainer.width;
     ccStyle.closedCaptionChevronLeftButton.styles.fontSize = 32 * scale + "pt";
     ccStyle.closedCaptionChevronRightButton.styles.fontSize = ccStyle.closedCaptionChevronLeftButton.styles.fontSize;
    },*/

  render: function(){
    // this.setResponsiveStyle(this.props.clientWidth); //Leave this for later when we use the resizing
    var numRows = this.calculateNumberOfRows(this.props.clientWidth, this.props.clientHeight);
    var ccOptionsString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.CC_OPTIONS, this.props.localizableStrings);
    return (
      <div style = {ccStyle.screenStyle}>
        <div style = {ccStyle.innerPanelStyle}>
          <div style = {ccStyle.captionStyle}>{ccOptionsString}<span className={this.props.skinConfig.icons.cc.fontStyleClass}></span></div>
          <OnOffSwitch {...this.props} />
          <LanguageTabContent {...this.props} numRows = {numRows} />
          <CCPreviewPanel {...this.props} />
        </div>
      </div>
    );
  }
});
module.exports = ClosedCaptionPanel;


var OnOffSwitch = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return null;
  },

  componentWillMount: function(){
    this.toggleCCStyles();
  },

  handleOnOffSwitch: function(evt){
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      this.props.controller.toggleClosedCaptionEnabled();
      this.toggleCCStyles();
    }
  },

  toggleCCStyles: function(){
    ccStyle.switch.background = this.props.ccOptions.enabled ? ccStyle.switch.onBackground : "grey";
    ccStyle.switchThumb.left = this.props.ccOptions.enabled ? "" : "0";
    ccStyle.switchThumb.right = this.props.ccOptions.enabled ? "0" : "";

    var elementColor = this.props.ccOptions.enabled ? "white" : "grey";
    ccStyle.itemStyle.color = elementColor;
    ccStyle.itemStyle.cursor = this.props.ccOptions.enabled ? "pointer" : "default";
    ccStyle.lastColumnItemStyle.color = elementColor;
    ccStyle.lastColumnItemStyle.cursor = this.props.ccOptions.enabled ? "pointer" : "default";
    ccStyle.CCPreviewTextStyle.color = elementColor;
    ccStyle.CCPreviewCaptionStyle.color = elementColor;
    ccStyle.closedCaptionChevronLeftButtonContainer.color = ccStyle.closedCaptionChevronRightButtonContainer.color = elementColor;

    ccStyle.onStyle.color = elementColor;
    ccStyle.offStyle.color = this.props.ccOptions.enabled ? "grey" : "white";

  },

  render: function(){
    var offString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.OFF, this.props.localizableStrings);
    var onString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.ON, this.props.localizableStrings);
    return (
        <div className="CCSwitch" style={ccStyle.switchStyle} onClick={this.handleOnOffSwitch} onTouchEnd={this.handleOnOffSwitch}>
          <span style={ccStyle.offStyle}>{offString}</span>
          <div style={ccStyle.switchContainer}>
            <span style={ccStyle.switch}></span>
            <span style={ccStyle.switchThumb}></span>
          </div>
          <span style={ccStyle.onStyle}>{onString}</span>
        </div>
    );
  }
});


var CCPreviewPanel = React.createClass({
  render: function(){
    var closedCaptionPreviewTitle = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.CLOSED_CAPTION_PREVIEW, this.props.localizableStrings);
    var closedCaptionSampleText =Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.SAMPLE_TEXT, this.props.localizableStrings);
    return (
      <div style = {ccStyle.CCPreviewPanelStyle}>
        <div style = {ccStyle.CCPreviewCaptionStyle}>{closedCaptionPreviewTitle}</div>
        <div style = {ccStyle.CCPreviewTextStyle}>{closedCaptionSampleText}</div>
      </div>
    );
  }
});

var LanguageTabContent = React.createClass({
  getInitialState: function() {
    this.isMobile = this.props.controller.state.isMobile;
    return {
      selectedLanguage: this.props.ccOptions.language,
      scrollLeftDistance: 0
    };
  },

  componentDidUpdate: function(){
    var oldChevronRightVisibility = ccStyle.closedCaptionChevronRightButtonContainer.visibility;
    var oldChevronLeftVisibility = ccStyle.closedCaptionChevronLeftButtonContainer.visibility;

    //right chevron button is visible if (scrollLeftDistance + table container) are less than table width
    ccStyle.closedCaptionChevronRightButtonContainer.visibility = (Math.ceil(this.refs.tableLanguageContainer.getDOMNode().clientWidth + this.state.scrollLeftDistance) < this.refs.tableLanguage.getDOMNode().clientWidth) ? "visible" : "hidden";
    //left chevron button is visible if scrollLeftDistance is > 0 and table does not fit into the container
    ccStyle.closedCaptionChevronLeftButtonContainer.visibility = (this.state.scrollLeftDistance > 0 && this.refs.tableLanguageContainer.getDOMNode().clientWidth < this.refs.tableLanguage.getDOMNode().clientWidth) ? "visible" : "hidden";
    this.refs.tableLanguageContainer.getDOMNode().scrollLeft = this.state.scrollLeftDistance;

    if (oldChevronRightVisibility != ccStyle.closedCaptionChevronRightButtonContainer.visibility ||
      oldChevronLeftVisibility != ccStyle.closedCaptionChevronLeftButtonContainer.visibility){
      this.forceUpdate();//to update the screen if chevron buttons changed visibility
    }
  },

  calculateScrollDistance: function(){
    var colWidth = parseInt(ccStyle.itemStyle.width) + parseInt(ccStyle.itemStyle.marginRight) + 2*parseInt(ccStyle.itemStyle.padding);
    var numCols =  Math.floor((this.refs.tableLanguageContainer.getDOMNode().clientWidth + parseInt(ccStyle.itemStyle.marginRight)) / (colWidth));
    var scrollDistance = numCols * colWidth;

    return scrollDistance;
  },

  changeLanguage: function(language, evt){
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      if (this.props.ccOptions.enabled){
        this.props.controller.onClosedCaptionLanguageChange(language);
      }
    }
  },

  handleLeftChevronClick: function(evt){
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      if (this.props.ccOptions.enabled){
        this.refs.tableLanguageContainer.getDOMNode().scrollLeft += -1*this.calculateScrollDistance();
        this.setState({scrollLeftDistance: this.refs.tableLanguageContainer.getDOMNode().scrollLeft});
      }
    }
  },

  handleRightChevronClick: function(evt){
    if (evt.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      if (this.props.ccOptions.enabled){
        this.refs.tableLanguageContainer.getDOMNode().scrollLeft += this.calculateScrollDistance();
        this.setState({scrollLeftDistance: this.refs.tableLanguageContainer.getDOMNode().scrollLeft});
      }
    }
  },

  setStyle: function(item, j, colnum){
    var style;
    if (this.props.ccOptions.language == item && this.props.ccOptions.enabled){
      if (j == colnum){
        style = ccStyle.lastColumnItemSelectedStyle;
      }
      else {
        style = ccStyle.itemSelectedStyle;
      }
    }
    else {
      if (j == colnum){
        style = ccStyle.lastColumnItemStyle;
      }
      else {
        style = ccStyle.itemStyle;
      }
    }

    return style;
  },


  render: function(){
    var table = [];
    var availableLanguages = this.props.ccOptions.availableLanguages; //getting list of languages

    if (availableLanguages.languages.length > 1){//if there is only one element, do not show it at all
      var languageCodes = availableLanguages.languages; // getting an array of all the codes
      var maxNumberOfRows = 5; // per specs

      //number of columns and rows in a table to display
      var rows = Math.min(maxNumberOfRows,(this.props.numRows > 0) ? this.props.numRows : 1);
      var columns = Math.floor(languageCodes.length/rows) + 1;

      table = new Array(rows); //creating an array for easier rendering (have to do this to fill the table by columns)
      for (var i = 0; i < table.length; i++){
        table[i] = new Array(columns);
      }

      for (var j = 0; j < languageCodes.length; j++){//putting elements into that array
        var rownum = j%rows;
        var colnum = Math.floor(j/rows);
        table[rownum][colnum] = languageCodes[j];
      }
    }

    return(
      <div className="ClosedCaptionsPanel" style={ccStyle.positionRelativeStyle}>
        <div className="CCLeft" style={ccStyle.closedCaptionChevronLeftButtonContainer} onClick={this.handleLeftChevronClick} onTouchEnd={this.handleLeftChevronClick}>
          <span className={this.props.skinConfig.icons.left.fontStyleClass} style={ccStyle.closedCaptionChevronLeftButton.style} aria-hidden="true"></span>
        </div>
        <div className="CCRight" style={ccStyle.closedCaptionChevronRightButtonContainer} onClick={this.handleRightChevronClick} onTouchEnd={this.handleRightChevronClick}>
          <span className={this.props.skinConfig.icons.right.fontStyleClass} style={ccStyle.closedCaptionChevronRightButton.style} aria-hidden="true"></span>
        </div>
        <div style = {ccStyle.tableLanguageContainerStyle} ref="tableLanguageContainer">
          <table ref = "tableLanguage" style = {ccStyle.tableLanguageStyle}>
            {
              table.map(function(row,i){
                return (
                  <tr key = {i}>
                    {row.map(function(item, j){
                      return (
                        <td className={availableLanguages.locale[item]} key = {j} onClick={this.changeLanguage.bind(this, item)} onTouchEnd={this.changeLanguage.bind(this, item)} style = {ccStyle.tdLanguageStyle}>
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