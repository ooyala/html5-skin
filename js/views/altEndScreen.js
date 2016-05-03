/********************************************************************
  Alt END SCREEN
*********************************************************************/
var React = require('react'),
    ClassNames = require('classnames'),
    CountDownClock = require('../components/countDownClock'),
    CONSTANTS = require('../constants/constants'),
    Utils = require('../components/utils'),
    Icon = require('../components/icon');

var AltEndScreen = React.createClass({

  getInitialState: function() {
    return {
      autoplay: true
    }
  },

  handleDiscoveryCountDownClick: function(event) {
    event.preventDefault();
    if (!this.state.autoplay) {
      this.handleStartUpNextClick(event);
    }
    else {
      this.refs.CountDownClock.handleClick(event);
      this.setState({autoplay: !this.state.autoplay});
    }
  },

  autoplayClick: function(event) {
    event.preventDefault();
    if (!this.state.autoplay) {
      this.handleStartUpNextClick(event);
    }
    else {
      this.setState({autoplay: !this.state.autoplay});
      this.refs.CountDownClock.handleClick(event);
    }
  },

  handleStartUpNextClick: function(event) {
    event.preventDefault();
    // Use the same way as sending out the click event on discovery content
    var eventData = {
      "clickedVideo": this.props.upNextInfo.upNextData,
      "custom": {
        "source": CONSTANTS.SCREEN.UP_NEXT_SCREEN,
        "countdown": 0,
        "autoplay": true
      }
    };
    this.props.controller.sendDiscoveryClickEvent(eventData, false);
  },

  replay: function(event) {
    event.preventDefault();
    this.props.controller.togglePlayPause();
  },

  handleEmailClick: function(event) {
    event.preventDefault();
    var emailBody = Utils.getLocalizedString(this.props.language, CONSTANTS.SKIN_TEXT.EMAIL_BODY, this.props.localizableStrings);
    var mailToUrl = "mailto:";
    mailToUrl += "?subject=" + encodeURIComponent(this.props.contentTree.title);
    mailToUrl += "&body=" + encodeURIComponent(emailBody + location.href);
    //location.href = mailToUrl; //same window
    window.open(mailToUrl, "_blank", "height=315,width=780"); //new window
  },

  handleFacebookClick: function() {
    var facebookUrl = "http://www.facebook.com/sharer.php";
    facebookUrl += "?u=" + encodeURIComponent(location.href);
    window.open(facebookUrl, "facebook window", "height=315,width=780");
  },

  handleTwitterClick: function() {
    var twitterUrl = "https://twitter.com/intent/tweet";
    twitterUrl += "?text=" + encodeURIComponent(this.props.contentTree.title+": ");
    twitterUrl += "&url=" + encodeURIComponent(location.href);
    window.open(twitterUrl, "twitter window", "height=300,width=750");
  },

  render: function() {

    var autoplayClass = ClassNames({
      "oo-alt-autoplay-indicator": true,
      "off": !this.state.autoplay
    });

    var autoplayText = ClassNames({
      "oo-alt-autoplay-text": true,
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
            <div className="oo-alt-prev-replay" onClick={this.replay}>
              <Icon {...this.props} icon="replay"/>
              <span className="oo-alt-prev-replay-text">WATCH AGAIN</span>
            </div>
            <img src={this.props.contentTree.promo_image}/>
          </div>
          <div className="oo-alt-prev-twitter" onClick={this.handleTwitterClick}><span className="oo-alt-prev-buttontext">TWEET</span></div>
          <div className="oo-alt-prev-facebook" onClick={this.handleFacebookClick}><span className="oo-alt-prev-buttontext">SHARE</span></div>
          <div className="oo-alt-prev-link" onClick={this.handleEmailClick}> </div>
        </div>

        <div className="oo-alt-autoplay">
          AUTOPLAY
          <div className="oo-alt-autoplay-switch" onClick={this.autoplayClick}>
            <div className={autoplayClass}></div>
          </div>
        </div>
        <div>
          <span className={autoplayText}> </span>
        </div>

        <div className="oo-alt-next-panel">
        <a onClick={this.handleDiscoveryCountDownClick}>
          <div className="oo-alt-next-countdown">
            <CountDownClock {...this.props} timeToShow="10"
              ref="CountDownClock" />
          </div>
          <div className="oo-alt-next-info">
              <div>UP NEXT:</div>
              <span>{this.props.upNextInfo.upNextData.name}</span>
          </div>
        </a>
        </div>
      </div>
    );
  }
});
module.exports = AltEndScreen;