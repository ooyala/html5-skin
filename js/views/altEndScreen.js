/********************************************************************
  Alt END SCREEN
*********************************************************************/
var React = require('react'),
    ClassNames = require('classnames'),
    CountDownClock = require('../components/countDownClock'),
    Icon = require('../components/icon');

var AltEndScreen = React.createClass({

  getInitialState: function() {
    return {
      autoplay: true
    }
  },

  handleDiscoveryCountDownClick: function(event) {
    event.preventDefault();
    this.refs.CountDownClock.handleClick(event);
  },

  autoplayClick: function() {
    this.setState({autoplay: !this.state.autoplay});
  },

  render: function() {

    var autoplayClass = ClassNames({
      "oo-alt-autoplay-indicator": true,
      "off": !this.state.autoplay
    });

    return (
      <div className="oo-state-screen oo-alt-end-screen"
        style={{backgroundImage: "url('"+this.props.upNextInfo.upNextData.preview_image_url+"')"}}>
        <div className="oo-alt-previous">
          <div className="oo-alt-prev-promo">
            <div className="oo-alt-prev-title">
              {this.props.contentTree.title}
            </div>
            <div className="oo-alt-prev-replay">
              WATCH AGAIN
            </div>
            <img src={this.props.contentTree.promo_image}/>
          </div>
          <div className="oo-alt-prev-twitter">TWEET</div>
          <div className="oo-alt-prev-facebook">SHARE</div>
          <div className="oo-alt-prev-link">LINK</div>
        </div>

        <div className="oo-alt-autoplay">
          AUTOPLAY
          <div className="oo-alt-autoplay-switch" onClick={this.autoplayClick}>
            <div className={autoplayClass}></div>
          </div>
        </div>

        <div className="oo-alt-next-panel">
          <div className="oo-alt-next-countdown">
            <a onClick={this.handleDiscoveryCountDownClick}>
            <CountDownClock {...this.props} timeToShow="10"
              ref="CountDownClock" />
            </a>
          </div>
          <div className="oo-alt-next-info">
            <div>UP NEXT:</div>
            <span>{this.props.upNextInfo.upNextData.name}</span>
          </div>

        </div>
      </div>
    );
  }
});
module.exports = AltEndScreen;