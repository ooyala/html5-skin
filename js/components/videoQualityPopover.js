var React = require('react'),
    ScrollArea = require('react-scrollbar/dist/no-css'),
    VideoQualityPanel = require('../components/videoQualityPanel');

var VideoQualityPopover = React.createClass({

  render: function() {
    return (
      // ScrollArea used to make scrollbars consistent across platforms/browsers
      <ScrollArea
        speed={0.6}
        className="oo-quality-popover"
        horizontal={false}
      >
        <VideoQualityPanel {...this.props} />
      </ScrollArea>
    );
  }
});
module.exports = VideoQualityPopover;