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
    Utils = require('./utils');

var ClosedCaptionPanel = React.createClass({
  calculateNumberOfRows: function(clientWidth, clientHeight){
    var switchHeight = parseInt(InlineStyle.closedCaptionScreenStyles.switchStyle.height) + parseInt(InlineStyle.closedCaptionScreenStyles.switchStyle.marginTop);
    var CCPreviewPanelHeight = parseInt(InlineStyle.closedCaptionScreenStyles.CCPreviewPanelStyle.height);
    var captionHeight = 4/3*parseInt(InlineStyle.closedCaptionScreenStyles.captionStyle.fontSize);
    var innerPanelPaddingHeight = 2*parseInt(InlineStyle.closedCaptionScreenStyles.innerPanelStyle.padding);

    //height of the panel that should fit the table
    var panelHeight = clientHeight - CCPreviewPanelHeight - captionHeight - innerPanelPaddingHeight - switchHeight;
    //height of a table row
    var tableRowHeight = 2*parseInt(InlineStyle.closedCaptionScreenStyles.itemSelectedStyle.fontSize) + parseInt(InlineStyle.closedCaptionScreenStyles.itemStyle.marginTop) + 2*parseInt(InlineStyle.closedCaptionScreenStyles.itemSelectedStyle.padding);

    var numRows = Math.floor(panelHeight/tableRowHeight);

    return numRows;
  },

  // Responsive design code for later

  // setResponsiveStyle: function(clientWidth){
  //   var scale = Math.min(1, Math.max(clientWidth/1280, 0.3));

  //   InlineStyle.closedCaptionScreenStyles.CCPreviewPanelStyle.bottom = 15 * scale;

  //   InlineStyle.closedCaptionScreenStyles.innerPanelStyle.padding = 35 * scale;

  //   InlineStyle.closedCaptionScreenStyles.closeButtonStyle.right = InlineStyle.closedCaptionScreenStyles.innerPanelStyle.padding;
  //   InlineStyle.closedCaptionScreenStyles.closeButtonStyle.top = InlineStyle.closedCaptionScreenStyles.innerPanelStyle.padding;

  //   InlineStyle.closedCaptionScreenStyles.captionStyle.fontSize = 32 * scale + "pt";

  //   InlineStyle.closedCaptionScreenStyles.switchStyle.marginTop = 35 * scale;
  //   InlineStyle.closedCaptionScreenStyles.switchStyle.height = 28 * scale;
  //   InlineStyle.closedCaptionScreenStyles.switchStyle.width = 140 * scale;
  //   InlineStyle.closedCaptionScreenStyles.switchStyle.fontSize = 20 * scale + "pt";

  //   InlineStyle.closedCaptionScreenStyles.CCPreviewPanelStyle.height = 70 * scale;

  //   InlineStyle.closedCaptionScreenStyles.CCPreviewTextStyle.fontSize = 24 * scale + "pt";
  //   InlineStyle.closedCaptionScreenStyles.CCPreviewTextStyle.marginLeft = InlineStyle.closedCaptionScreenStyles.innerPanelStyle.padding;

  //   InlineStyle.closedCaptionScreenStyles.CCPreviewCaptionStyle.fontSize = 12 * scale + "pt";
  //   InlineStyle.closedCaptionScreenStyles.CCPreviewCaptionStyle.marginLeft = InlineStyle.closedCaptionScreenStyles.innerPanelStyle.padding;
  //   InlineStyle.closedCaptionScreenStyles.CCPreviewCaptionStyle.marginTop = 1/4*(parseInt(InlineStyle.closedCaptionScreenStyles.CCPreviewPanelStyle.height) - 4/3*parseInt(InlineStyle.closedCaptionScreenStyles.CCPreviewTextStyle.fontSize)-4/3*parseInt(InlineStyle.closedCaptionScreenStyles.CCPreviewCaptionStyle.fontSize));
  //   InlineStyle.closedCaptionScreenStyles.CCPreviewCaptionStyle.marginBottom = InlineStyle.closedCaptionScreenStyles.CCPreviewCaptionStyle.marginTop;

  //   this.setResponsiveStyleCCLanguages(clientWidth);
  // },

  // setResponsiveStyleCCLanguages: function(clientWidth){
  //   var scale = Math.max(clientWidth/1280, 0.3);

  //   InlineStyle.closedCaptionScreenStyles.itemStyle.fontSize = 22 * scale + "pt";
  //   InlineStyle.closedCaptionScreenStyles.itemStyle.padding = 3;
  //   InlineStyle.closedCaptionScreenStyles.itemStyle.width = 140 * scale;
  //   InlineStyle.closedCaptionScreenStyles.itemStyle.marginRight = 140 * scale - 2*parseInt(InlineStyle.closedCaptionScreenStyles.itemStyle.padding);
  //   InlineStyle.closedCaptionScreenStyles.itemStyle.marginTop = 40 * scale - 2*parseInt(InlineStyle.closedCaptionScreenStyles.itemStyle.padding);

  //   InlineStyle.closedCaptionScreenStyles.lastColumnItemStyle.fontSize = InlineStyle.closedCaptionScreenStyles.itemStyle.fontSize;
  //   InlineStyle.closedCaptionScreenStyles.lastColumnItemStyle.padding = InlineStyle.closedCaptionScreenStyles.itemStyle.padding;
  //   InlineStyle.closedCaptionScreenStyles.lastColumnItemStyle.width = InlineStyle.closedCaptionScreenStyles.itemStyle.width;
  //   InlineStyle.closedCaptionScreenStyles.lastColumnItemStyle.marginRight = 0;
  //   InlineStyle.closedCaptionScreenStyles.lastColumnItemStyle.marginTop = InlineStyle.closedCaptionScreenStyles.itemStyle.marginTop;

  //   InlineStyle.closedCaptionScreenStyles.itemSelectedStyle.fontSize = InlineStyle.closedCaptionScreenStyles.itemStyle.fontSize;
  //   InlineStyle.closedCaptionScreenStyles.itemSelectedStyle.padding = InlineStyle.closedCaptionScreenStyles.itemStyle.padding;
  //   InlineStyle.closedCaptionScreenStyles.itemSelectedStyle.width = InlineStyle.closedCaptionScreenStyles.itemStyle.width;
  //   InlineStyle.closedCaptionScreenStyles.itemSelectedStyle.marginRight = InlineStyle.closedCaptionScreenStyles.itemStyle.marginRight;
  //   InlineStyle.closedCaptionScreenStyles.itemSelectedStyle.marginTop = InlineStyle.closedCaptionScreenStyles.itemStyle.marginTop;

  //   InlineStyle.closedCaptionScreenStyles.lastColumnItemSelectedStyle.fontSize = InlineStyle.closedCaptionScreenStyles.lastColumnItemStyle.fontSize;
  //   InlineStyle.closedCaptionScreenStyles.lastColumnItemSelectedStyle.padding = InlineStyle.closedCaptionScreenStyles.lastColumnItemStyle.padding;
  //   InlineStyle.closedCaptionScreenStyles.lastColumnItemSelectedStyle.width = InlineStyle.closedCaptionScreenStyles.itemSelectedStyle.width;
  //   InlineStyle.closedCaptionScreenStyles.lastColumnItemSelectedStyle.marginRight = InlineStyle.closedCaptionScreenStyles.lastColumnItemStyle.marginRight;
  //   InlineStyle.closedCaptionScreenStyles.lastColumnItemSelectedStyle.marginTop = InlineStyle.closedCaptionScreenStyles.lastColumnItemStyle.marginTop;

  //   InlineStyle.closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer.width = 50 * scale;
  //   InlineStyle.closedCaptionScreenStyles.closedCaptionChevronRightButtonContainer.width = InlineStyle.closedCaptionScreenStyles.tableLanguageContainerStyle.marginLeft = InlineStyle.closedCaptionScreenStyles.tableLanguageContainerStyle.marginRight = InlineStyle.closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer.width;
  //   InlineStyle.closedCaptionScreenStyles.closedCaptionChevronLeftButton.styles.fontSize = 32 * scale + "pt";
  //   InlineStyle.closedCaptionScreenStyles.closedCaptionChevronRightButton.styles.fontSize = InlineStyle.closedCaptionScreenStyles.closedCaptionChevronLeftButton.styles.fontSize;
  //  },

  render: function(){
    // this.setResponsiveStyle(this.props.clientWidth); //Leave this for later when we use the resizing
    var numRows = this.calculateNumberOfRows(this.props.clientWidth, this.props.clientHeight);
    var ccOptionsString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.CC_OPTIONS, this.props.localizableStrings);
    return (
      <div style = {InlineStyle.closedCaptionScreenStyles.screenStyle}>
        <div style = {InlineStyle.closedCaptionScreenStyles.innerPanelStyle}>
          <div style = {InlineStyle.closedCaptionScreenStyles.captionStyle}>{ccOptionsString}<span className={this.props.skinConfig.icons.cc.fontStyleClass}></span></div>
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
    InlineStyle.closedCaptionScreenStyles.switch.background = this.props.ccOptions.enabled ? InlineStyle.closedCaptionScreenStyles.switch.onBackground : "grey";
    InlineStyle.closedCaptionScreenStyles.switchThumb.left = this.props.ccOptions.enabled ? "" : "0";
    InlineStyle.closedCaptionScreenStyles.switchThumb.right = this.props.ccOptions.enabled ? "0" : "";

    var elementColor = this.props.ccOptions.enabled ? "white" : "grey";
    InlineStyle.closedCaptionScreenStyles.itemStyle.color = elementColor;
    InlineStyle.closedCaptionScreenStyles.itemStyle.cursor = this.props.ccOptions.enabled ? "pointer" : "default";
    InlineStyle.closedCaptionScreenStyles.lastColumnItemStyle.color = elementColor;
    InlineStyle.closedCaptionScreenStyles.lastColumnItemStyle.cursor = this.props.ccOptions.enabled ? "pointer" : "default";
    InlineStyle.closedCaptionScreenStyles.CCPreviewTextStyle.color = elementColor;
    InlineStyle.closedCaptionScreenStyles.CCPreviewCaptionStyle.color = elementColor;
    InlineStyle.closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer.color = InlineStyle.closedCaptionScreenStyles.closedCaptionChevronRightButtonContainer.color = elementColor;

    InlineStyle.closedCaptionScreenStyles.onStyle.color = elementColor;
    InlineStyle.closedCaptionScreenStyles.offStyle.color = this.props.ccOptions.enabled ? "grey" : "white";

  },

  render: function(){
    var offString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.OFF, this.props.localizableStrings);
    var onString = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.ON, this.props.localizableStrings);
    return (
        <div className="CCSwitch" style={InlineStyle.closedCaptionScreenStyles.switchStyle} onClick={this.handleOnOffSwitch} onTouchEnd={this.handleOnOffSwitch}>
          <span style={InlineStyle.closedCaptionScreenStyles.offStyle}>{offString}</span>
          <div style={InlineStyle.closedCaptionScreenStyles.switchContainer}>
            <span style={InlineStyle.closedCaptionScreenStyles.switch}></span>
            <span style={InlineStyle.closedCaptionScreenStyles.switchThumb}></span>
          </div>
          <span style={InlineStyle.closedCaptionScreenStyles.onStyle}>{onString}</span>
        </div>
    );
  }
});


var CCPreviewPanel = React.createClass({
  render: function(){
    var closedCaptionPreviewTitle = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.CLOSED_CAPTION_PREVIEW, this.props.localizableStrings);
    var closedCaptionSampleText =Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.SAMPLE_TEXT, this.props.localizableStrings);
    return (
      <div style = {InlineStyle.closedCaptionScreenStyles.CCPreviewPanelStyle}>
        <div style = {InlineStyle.closedCaptionScreenStyles.CCPreviewCaptionStyle}>{closedCaptionPreviewTitle}</div>
        <div style = {InlineStyle.closedCaptionScreenStyles.CCPreviewTextStyle}>{closedCaptionSampleText}</div>
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
    var oldChevronRightVisibility = InlineStyle.closedCaptionScreenStyles.closedCaptionChevronRightButtonContainer.visibility;
    var oldChevronLeftVisibility = InlineStyle.closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer.visibility;

    //right chevron button is visible if (scrollLeftDistance + table container) are less than table width
    InlineStyle.closedCaptionScreenStyles.closedCaptionChevronRightButtonContainer.visibility = (Math.ceil(this.refs.tableLanguageContainer.getDOMNode().clientWidth + this.state.scrollLeftDistance) < this.refs.tableLanguage.getDOMNode().clientWidth) ? "visible" : "hidden";
    //left chevron button is visible if scrollLeftDistance is > 0 and table does not fit into the container
    InlineStyle.closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer.visibility = (this.state.scrollLeftDistance > 0 && this.refs.tableLanguageContainer.getDOMNode().clientWidth < this.refs.tableLanguage.getDOMNode().clientWidth) ? "visible" : "hidden";
    this.refs.tableLanguageContainer.getDOMNode().scrollLeft = this.state.scrollLeftDistance;

    if (oldChevronRightVisibility != InlineStyle.closedCaptionScreenStyles.closedCaptionChevronRightButtonContainer.visibility ||
      oldChevronLeftVisibility != InlineStyle.closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer.visibility){
      this.forceUpdate();//to update the screen if chevron buttons changed visibility
    }
  },

  calculateScrollDistance: function(){
    var colWidth = parseInt(InlineStyle.closedCaptionScreenStyles.itemStyle.width) + parseInt(InlineStyle.closedCaptionScreenStyles.itemStyle.marginRight) + 2*parseInt(InlineStyle.closedCaptionScreenStyles.itemStyle.padding);
    var numCols =  Math.floor((this.refs.tableLanguageContainer.getDOMNode().clientWidth + parseInt(InlineStyle.closedCaptionScreenStyles.itemStyle.marginRight)) / (colWidth));
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
        style = InlineStyle.closedCaptionScreenStyles.lastColumnItemSelectedStyle;
      }
      else {
        style = InlineStyle.closedCaptionScreenStyles.itemSelectedStyle;
      }
    }
    else {
      if (j == colnum){
        style = InlineStyle.closedCaptionScreenStyles.lastColumnItemStyle;
      }
      else {
        style = InlineStyle.closedCaptionScreenStyles.itemStyle;
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
      <div className="ClosedCaptionsPanel" style={InlineStyle.closedCaptionScreenStyles.positionRelativeStyle}>
        <div className="CCLeft" style={InlineStyle.closedCaptionScreenStyles.closedCaptionChevronLeftButtonContainer} onClick={this.handleLeftChevronClick} onTouchEnd={this.handleLeftChevronClick}>
          <span className={this.props.skinConfig.icons.left.fontStyleClass} style={InlineStyle.closedCaptionScreenStyles.closedCaptionChevronLeftButton.style} aria-hidden="true"></span>
        </div>
        <div className="CCRight" style={InlineStyle.closedCaptionScreenStyles.closedCaptionChevronRightButtonContainer} onClick={this.handleRightChevronClick} onTouchEnd={this.handleRightChevronClick}>
          <span className={this.props.skinConfig.icons.right.fontStyleClass} style={InlineStyle.closedCaptionScreenStyles.closedCaptionChevronRightButton.style} aria-hidden="true"></span>
        </div>
        <div style = {InlineStyle.closedCaptionScreenStyles.tableLanguageContainerStyle} ref="tableLanguageContainer">
          <table ref = "tableLanguage" style = {InlineStyle.closedCaptionScreenStyles.tableLanguageStyle}>
            {
              table.map(function(row,i){
                return (
                  <tr key = {i}>
                    {row.map(function(item, j){
                      return (
                        <td className={availableLanguages.locale[item]} key = {j} onClick={this.changeLanguage.bind(this, item)} onTouchEnd={this.changeLanguage.bind(this, item)} style = {InlineStyle.closedCaptionScreenStyles.tdLanguageStyle}>
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