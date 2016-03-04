/********************************************************************
  CLOSED CAPTION SCREEN
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class ClosedCaptionScreen
* @constructor
*/
var React = require('react'),
    ReactDOM = require('react-dom'),
    ClosedCaptionPanel = require('../components/closedCaptionPanel'),
    CloseButton = require('../components/closeButton'),
    ResizeMixin = require('../mixins/resizeMixin'),
    AccessibilityMixin = require('../mixins/accessibilityMixin'),
    Icon = require('../components/icon');

var ClosedCaptionScreen = React.createClass({
  mixins: [ResizeMixin, AccessibilityMixin],

  propTypes: {
    skinConfig: React.PropTypes.shape({
      icons: React.PropTypes.shape({
        dismiss: React.PropTypes.shape({
          fontStyleClass: React.PropTypes.string
        })
      })
    })
  },

  getDefaultProps: function () {
    return {
      skinConfig: {
        icons: {
          dismiss:{fontStyleClass:'icon icon-close'}
        }
      },
      controller: {
        toggleClosedCaptionScreen: function(){},
        state: {
          accessibilityControlsEnabled: true
        }
      }
    };
  },

  getInitialState: function() {
    return {
      clientWidth: null,
      clientHeight: null
    };
  },

  handleResize: function() {
    this.setState({
      clientWidth: ReactDOM.findDOMNode(this).clientWidth,
      clientHeight: ReactDOM.findDOMNode(this).clientHeight
    });
  },

  componentDidMount: function() {
    this.setState({
      clientWidth: ReactDOM.findDOMNode(this).clientWidth,
      clientHeight: ReactDOM.findDOMNode(this).clientHeight
    });
  },

  handleClose: function() {
    this.props.controller.toggleClosedCaptionScreen();
  },

  render: function() {
    return (
      <div className="state-screen closedCaptionsScreen">
        <ClosedCaptionPanel {...this.props} closedCaptionOptions={this.props.closedCaptionOptions} languagesPerPage={{small:1, medium:4, large:15}} />
        <CloseButton closeAction={this.handleClose}
          fontStyleClass={this.props.skinConfig.icons.dismiss.fontStyleClass}
          fontString={this.props.skinConfig.icons.dismiss.fontString}
          fontFamilyName={this.props.skinConfig.icons.dismiss.fontFamilyName}/>
      </div>
    );
  }
});
module.exports = ClosedCaptionScreen;