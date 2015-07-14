/********************************************************************
  MORE OPTIONS PANEL
*********************************************************************/
/**
* @class MoreOptionsPanel
* @constructor
*/

var MoreOptionsPanel = React.createClass({
  getInitialState: function() {
    return {
    };
  },

  closeMoreOptionsScreen: function() {
    this.props.controller.closeMoreOptionsScreen();
  },

  handleShareClick: function() {
    this.props.controller.toggleShareScreen();
  },

  handleDiscoveryClick: function() {
    this.props.controller.toggleDiscoveryScreen();
  },

  setupMoreOptionsButtonList: function() {
    var optionItemTemplates = {
      "discovery": <div className="discovery" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleDiscoveryClick}>
        <span className="icon icon-topmenu-discovery"></span></div>,
      "bitrateSelector": <div className="bitrateSelector" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="icon icon-topmenu-quality"></span></div>,
      "closedCaption": <div className="closedCaption" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="icon icon-topmenu-cc"></span></div>,
      "share": <div className="share" style={MoreOptionsScreenStyle.buttonStyle}
        onMouseOver={this.highlight} onMouseOut={this.removeHighlight}><span className="icon icon-topmenu-share"
        onClick={this.handleShareClick}></span></div>
    };


    var moreOptionsItems = [];
    var controlBarSetting = this.props.skinConfig.controlBar;
    for (i=0; i < 3; i++) {
      // filter out unrecognized button names
      // if (typeof controlItemTemplates[controlBarSetting.items[i]] === "undefined") {
      //   continue;
      // }
      controlBarItems.push(optionItemTemplates[i]);
    }
    return controlBarItems;
  },

  render: function() {
    
    var panelStyle = MoreOptionsScreenStyle.panelStyle;
    var buttonListStyle = MoreOptionsScreenStyle.buttonListStyle;
    var closeButtonStyle = MoreOptionsScreenStyle.closeButtonStyle;
    return (

      <div style={panelStyle}>
        <div onClick={this.closeMoreOptionsScreen} style={closeButtonStyle}><span className="icon icon-close"></span></div>
        <div style={buttonListStyle}>
          <div className="discovery" style={MoreOptionsScreenStyle.buttonStyle}
            onMouseOver={this.highlight} onMouseOut={this.removeHighlight} onClick={this.handleDiscoveryClick}>
            <span className="icon icon-topmenu-discovery" style={controlBarStyle.iconSetting}></span>
          </div>

          <div className="bitrateSelector" style={MoreOptionsScreenStyle.buttonStyle}
            onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
            <span className="icon icon-topmenu-quality" style={controlBarStyle.iconSetting}></span>
          </div>

          <div className="closedCaption" style={MoreOptionsScreenStyle.buttonStyle}
            onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
            <span className="icon icon-topmenu-cc" style={controlBarStyle.iconSetting}></span>
          </div>

          <div className="share" style={MoreOptionsScreenStyle.buttonStyle}
            onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>
            <span className="icon icon-topmenu-share" onClick={this.handleShareClick} style={controlBarStyle.iconSetting}></span>
          </div>
        </div>
      </div>
    );
  }
});