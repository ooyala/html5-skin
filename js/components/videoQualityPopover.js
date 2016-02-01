var React = require('react'),
    VideoQualityPanel = require('../components/videoQualityPanel');

var VideoQualityPopover = React.createClass({

  render: function() {
    return (
      <div className="quality-popover">
        <VideoQualityPanel {...this.props} />
      </div>
    );
  }
});
module.exports = VideoQualityPopover;