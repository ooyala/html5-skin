var React = require('react'),
    VideoQualityPanel = require('../components/videoQualityPanel');

var VideoQualityPopover = React.createClass({

  render: function() {
    return (
      <VideoQualityPanel
        {...this.props}
        popover={true}/>
    );
  }
});
module.exports = VideoQualityPopover;