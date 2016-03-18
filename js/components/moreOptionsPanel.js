/********************************************************************
 MORE OPTIONS PANEL
 *********************************************************************/
/**
 * @class MoreOptionsPanel
 * @constructor
 */
var React = require('react'),
    Utils = require('./utils'),
    CONSTANTS = require('../constants/constants'),
    ClassNames = require('classnames'),
    Icon = require('../components/icon');

var MoreOptionsPanel = React.createClass({
  getInitialState: function() {
    return {
      animate: false
    };
  },

  componentDidMount: function () {
    this.setState({
      animate: true
    });
  },

  handleShareClick: function () {
    this.props.controller.toggleShareScreen();
  },

  handleQualityClick: function() {
    this.props.controller.toggleScreen(CONSTANTS.SCREEN.VIDEO_QUALITY_SCREEN);
  },

  handleDiscoveryClick: function () {
    this.props.controller.toggleDiscoveryScreen();
  },

  handleClosedCaptionClick: function () {
    this.props.controller.toggleClosedCaptionScreen();
  },

  highlight: function (evt) {
    var color = this.props.skinConfig.moreOptionsScreen.iconStyle.active.color;
    var opacity = this.props.skinConfig.moreOptionsScreen.iconStyle.active.opacity;
    Utils.highlight(evt.target, opacity, color);
  },

  removeHighlight: function (evt) {
    var color = this.props.skinConfig.moreOptionsScreen.iconStyle.inactive.color;
    var opacity = this.props.skinConfig.moreOptionsScreen.iconStyle.inactive.opacity;
    Utils.removeHighlight(evt.target, opacity, color);
  },

  buildMoreOptionsButtonList: function () {
    var fullscreenClass = (this.props.fullscreen) ?
      this.props.skinConfig.icons.compress.fontStyleClass : this.props.skinConfig.icons.expand.fontStyleClass;
    var iconSetting = this.props.skinConfig.moreOptionsScreen.iconStyle.inactive;

    var optionsItemsTemplates = {
      "quality": <button className="quality controlBarItem" onClick={this.handleQualityClick} key="quality">
        <Icon {...this.props} icon="quality"
         onMouseOver={this.highlight} onMouseOut={this.removeHighlight}/>
      </button>,

      "discovery": <button className="discovery controlBarItem" onClick={this.handleDiscoveryClick} key="discovery">
        <Icon {...this.props} icon="discovery"
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}/>
      </button>,

      "closedCaption": <button className="closedCaption controlBarItem" onClick={this.handleClosedCaptionClick} key="closedCaption">
        <Icon {...this.props} icon="cc"
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}/>
      </button>,

      "share": <button className="share controlBarItem" onClick={this.handleShareClick} key="share">
        <Icon {...this.props} icon="share"
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}/>
      </button>,

      "settings": <div className="settings" key="settings">
        <Icon {...this.props} icon="setting"
          onMouseOver={this.highlight} onMouseOut={this.removeHighlight}/>
      </div>
    };

    var items = this.props.controller.state.moreOptionsItems;
    var moreOptionsItems = [];
    
    for (var i = 0; i < items.length; i++) {
      moreOptionsItems.push(optionsItemsTemplates[items[i].name]);
    }

    return moreOptionsItems;
  },

  render: function () {
    var moreOptionsItemsClass = ClassNames({
      'moreOptionsItems': true,
      'animate-more-options': this.state.animate
    });

    //inline style for config/skin.json elements only
    var buttonStyle = {
      fontSize: this.props.skinConfig.moreOptionsScreen.iconSize + "px",
      color: this.props.skinConfig.moreOptionsScreen.color
    };

    var moreOptionsItems = this.buildMoreOptionsButtonList();

    return (
      <div>
        <div className="moreOptionsPanel">
          <div className={moreOptionsItemsClass} style={buttonStyle}>
            {moreOptionsItems}
          </div>
        </div>
      </div>
    );
  }
});

MoreOptionsPanel.defaultProps = {
  skinConfig: {
    responsive: {
      breakpoints: {
        xs: {id: 'xs'},
        sm: {id: 'sm'},
        md: {id: 'md'},
        lg: {id: 'lg'}
      }
    }
  },
  responsiveView: 'md'
};

module.exports = MoreOptionsPanel;