var React = require('react');
var classNames = require('classnames');
var ControlButton = require('./controlButton');
var Icon = require('./icon');

var Toolbar = React.createClass({

  onPreviousVideo: function() {
    if (typeof this.props.controller.previousVideo === 'function') {
      this.props.controller.previousVideo();
    }
  },

  onNextVideo: function() {
    if (typeof this.props.controller.nextVideo === 'function') {
      this.props.controller.nextVideo();
    }
  },

  onSkipBack: function() {
    if (typeof this.props.a11yControls.seekBy === 'function') {
      this.props.a11yControls.seekBy(30, false, true);
    }
  },

  onSkipForward: function() {
    if (typeof this.props.a11yControls.seekBy === 'function') {
      this.props.a11yControls.seekBy(30, true, true);
    }
  },

  render: function() {
    var className = classNames('oo-toolbar', {
      'oo-inactive': this.props.inactive
    });

    return (
      <div className={className}>

        <ControlButton
          {...this.props}
          icon="nextVideo"
          onClick={this.onPreviousVideo}>
        </ControlButton>

        <ControlButton
          {...this.props}
          className="oo-center-button"
          icon="replay"
          onClick={this.onSkipBack}>
          <span className="oo-btn-counter">30</span>
        </ControlButton>

        <ControlButton
          {...this.props}
          className="oo-center-button"
          icon="replay"
          onClick={this.onSkipForward}>
          <span className="oo-btn-counter">30</span>
        </ControlButton>

        <ControlButton
          {...this.props}
          icon="nextVideo"
          onClick={this.onNextVideo}>
        </ControlButton>

      </div>
    );
  }

});

Toolbar.propTypes = {
  language: React.PropTypes.string,
  localizableStrings: React.PropTypes.object,
  responsiveView: React.PropTypes.bool.isRequired,
  skinConfig: React.PropTypes.object.isRequired,
  controller: React.PropTypes.shape({
    state: React.PropTypes.shape({
      isMobile: React.PropTypes.bool.isRequired
    }),
    previousVideo: React.PropTypes.func.isRequired,
    nextVideo: React.PropTypes.func.isRequired,
  }),
  a11yControls: React.PropTypes.shape({
    seekBy: React.PropTypes.func.isRequired
  })
};

module.exports = Toolbar;
