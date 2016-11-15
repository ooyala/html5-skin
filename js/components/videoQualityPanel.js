/**
 * Panel component for video quality selection
 *
 * @module VideoQualityPanel
 */
var React = require('react'),
    ScrollArea = require('react-scrollbar/dist/no-css'),
    ClassNames = require('classnames'),
    Utils = require('./utils'),
    Icon = require('../components/icon');

var VideoQualityPanel = React.createClass({
  getInitialState: function() {
    return {
      selected: this.props.videoQualityOptions.selectedBitrate ? this.props.videoQualityOptions.selectedBitrate.id : 'auto'
    };
  },

  highlight: function(evt) {
    var color = this.props.skinConfig.controlBar.iconStyle.active.color ?
                this.props.skinConfig.controlBar.iconStyle.active.color :
                this.props.skinConfig.general.accentColor;
    var opacity = this.props.skinConfig.controlBar.iconStyle.active.opacity;
    Utils.highlight(evt.target, opacity, color);
  },

  removeHighlight: function(evt) {
    var color = this.props.skinConfig.controlBar.iconStyle.inactive.color;
    var opacity = this.props.skinConfig.controlBar.iconStyle.inactive.opacity;
    Utils.removeHighlight(evt.target, opacity, color);
  },

  handleVideoQualityClick: function(selectedBitrateId, event) {
    event.preventDefault();
    var eventData = {
      "id": selectedBitrateId
    };
    this.props.controller.sendVideoQualityChangeEvent(eventData);
    this.setState({
      selected: selectedBitrateId
    });
    this.props.togglePopoverAction();
    if (this.props.controller.state.videoQualityOptions.showVideoQualityPopover == false) {
      $("span.oo-icon.oo-icon-bitrate").css("color", this.props.skinConfig.controlBar.iconStyle.inactive.color);
      $("span.oo-icon.oo-icon-bitrate").css("opacity", this.props.skinConfig.controlBar.iconStyle.inactive.opacity);
      $("span.oo-icon.oo-icon-bitrate").css("WebkitFilter", "");
      $("span.oo-icon.oo-icon-bitrate").css("filter", "");
      $("span.oo-icon.oo-icon-bitrate").css("msFilter", "");
    }
  },

  addAutoButton: function(bitrateButtons) {
    var autoQualityBtn = ClassNames({
      'oo-quality-auto-btn': true,
      'oo-selected': this.state.selected == 'auto'
    });

   if (autoQualityBtn === "oo-quality-auto-btn oo-selected") {
        var selectedBitrateStyle = { color: this.props.skinConfig.controlBar.iconStyle.active.color ? 
                                            this.props.skinConfig.controlBar.iconStyle.active.color : 
                                            this.props.skinConfig.general.accentColor };
        //add auto btn to beginning of array
        bitrateButtons.unshift(
          <li className="oo-auto-li" key='auto-li'>
            <a className={autoQualityBtn} key='auto' onClick={this.handleVideoQualityClick.bind(this, 'auto')}>
              <div className="oo-quality-auto-icon" style={selectedBitrateStyle}>
                <Icon {...this.props} icon="auto" />
              </div>
              <div className="oo-quality-auto-label" style={selectedBitrateStyle}>Auto</div>
            </a>
          </li>
        );
    } else {
        //add auto btn to beginning of array
        bitrateButtons.unshift(
          <li className="oo-auto-li" key='auto-li'>
            <a className={autoQualityBtn} key='auto' onClick={this.handleVideoQualityClick.bind(this, 'auto')}>
              <div className="oo-quality-auto-icon" >
                <Icon {...this.props} icon="auto" onMouseOver={this.highlight} onMouseOut={this.removeHighlight}/>
              </div>
              <div className="oo-quality-auto-label" onMouseOver={this.highlight} onMouseOut={this.removeHighlight}>Auto</div>
            </a>
          </li>
        );
    }
  },

  render: function() {
    var availableBitrates  = this.props.videoQualityOptions.availableBitrates;

    var bitrateButtons = [];
    var label;
    var selectedBitrateStyle = { color: this.props.skinConfig.controlBar.iconStyle.active.color ? 
                                        this.props.skinConfig.controlBar.iconStyle.active.color : 
                                        this.props.skinConfig.general.accentColor };

    //available bitrates
    for (var i = 0; i < availableBitrates.length; i++) {
      if (availableBitrates[i].id == 'auto') {
        this.addAutoButton(bitrateButtons);
      }
      else {
        var qualityBtn = ClassNames({
        'oo-quality-btn': true,
        'oo-selected': this.state.selected == availableBitrates[i].id
        });

        if (typeof availableBitrates[i].bitrate === "number") {
          label = Math.round(availableBitrates[i].bitrate/1000) + ' kbps';
        } 
        else {
          label = availableBitrates[i].bitrate;
        }
        if ( qualityBtn === "oo-quality-btn oo-selected") {
          bitrateButtons.push(<li key={i}><a className={qualityBtn} style={selectedBitrateStyle} key={i} onClick={this.handleVideoQualityClick.bind(this, availableBitrates[i].id)}>{label}</a></li>);
        } else {
          bitrateButtons.push(<li key={i}><a className={qualityBtn} onMouseOver={this.highlight} onMouseOut={this.removeHighlight} key={i} onClick={this.handleVideoQualityClick.bind(this, availableBitrates[i].id)}>{label}</a></li>);
        }
      }
    }

    var qualityScreenClass = ClassNames({
      'oo-content-panel': !this.props.popover,
      'oo-quality-panel': !this.props.popover,
      'oo-quality-popover': this.props.popover,
      'oo-mobile-fullscreen': !this.props.popover && this.props.controller.state.isMobile && (this.props.controller.state.fullscreen || this.props.controller.state.isFullWindow)
    });

    return (
      <div className={qualityScreenClass}>
        <ScrollArea
          className="oo-quality-screen-content"
          speed={this.props.popover ? 0.6 : 1}
          horizontal={this.props.popover ? false : true}>
          <ul>
            {bitrateButtons}
          </ul>
        </ScrollArea>
      </div>
    );
  }
});

VideoQualityPanel.propTypes = {
  videoQualityOptions: React.PropTypes.shape({
    availableBitrates: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      bitrate: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      ]),
      label: React.PropTypes.string
    }))
  }),
  togglePopoverAction: React.PropTypes.func,
  controller: React.PropTypes.shape({
    sendVideoQualityChangeEvent: React.PropTypes.func
  })
};

VideoQualityPanel.defaultProps = {
  popover: false,
  skinConfig: {
    icons: {
      quality:{fontStyleClass:'oo-icon oo-icon-topmenu-quality'}
    }
  },
  videoQualityOptions: {
    availableBitrates: []
  },
  togglePopoverAction: function(){},
  controller: {
    sendVideoQualityChangeEvent: function(a){}
  }
};

module.exports = VideoQualityPanel;
