var React = require('react'),
    ClassNames = require('classnames'),
    Icon = require('../icon');

var LanguageTab = React.createClass({
  getInitialState: function() {
    return {
      selectedLanguage: this.props.closedCaptionOptions.language,
      currentPage: 1
    };
  },

  componentWillReceiveProps: function(nextProps) {
    //If we are changing view sizes, adjust the currentPage number to reflect the new number of items per page.
    if (nextProps.responsiveView != this.props.responsiveView) {
      var currentViewSize = this.props.responsiveView;
      var nextViewSize = nextProps.responsiveView;
      var firstLanguageIndex = this.state.currentPage * this.props.languagesPerPage[currentViewSize] - this.props.languagesPerPage[currentViewSize];
      var newCurrentPage = Math.floor(firstLanguageIndex/nextProps.languagesPerPage[nextViewSize]) + 1;
      this.setState({
        currentPage: newCurrentPage
      });
    }
  },

  changeLanguage: function(language){
    if (this.props.closedCaptionOptions.enabled){
      this.props.controller.onClosedCaptionLanguageChange(language);
      this.setState({
        selectedLanguage: language
      });
    }
  },

  handleLeftChevronClick: function(event){
    event.preventDefault();
    this.setState({
      currentPage: this.state.currentPage - 1
    });
  },

  handleRightChevronClick: function(event){
    event.preventDefault();
    this.setState({
      currentPage: this.state.currentPage + 1
    });
  },

  setClassname: function(item){
    return ClassNames({
      'oo-item': true,
      'oo-item-selected': this.props.closedCaptionOptions.language == item && this.props.closedCaptionOptions.enabled,
      'oo-disabled': !this.props.closedCaptionOptions.enabled
    });
  },

  render: function(){
    var availableLanguages = this.props.closedCaptionOptions.availableLanguages; //getting list of languages

    //pagination
    var currentViewSize = this.props.responsiveView;
    var languagesPerPage = this.props.languagesPerPage[currentViewSize];
    var startAt = languagesPerPage * (this.state.currentPage - 1);
    var endAt = languagesPerPage * this.state.currentPage;
    var languagePage = availableLanguages.languages.slice(startAt,endAt);

    //if there is only one element, do not show it at all
    if (availableLanguages.languages.length > 1) {
      //Build language content blocks
      var languageContentBlocks = [];
      for (var i = 0; i < languagePage.length; i++) {
        languageContentBlocks.push(
          <a className={this.setClassname(languagePage[i])} onClick={this.changeLanguage.bind(this, languagePage[i])} key={i}>
            <span className="oo-language">{availableLanguages.locale[languagePage[i]]}</span>
          </a>
        );
      }
    }

    var leftChevron = ClassNames({
      'oo-left-button': true,
      'oo-hidden': !this.props.closedCaptionOptions.enabled || this.state.currentPage <= 1
    });
    var rightChevron = ClassNames({
      'oo-right-button': true,
      'oo-hidden': !this.props.closedCaptionOptions.enabled || endAt >= availableLanguages.languages.length
    });

    return(
      <div className="oo-language-container">
        <div className="oo-language-panel oo-flexcontainer">
          {languageContentBlocks}
        </div>

        <a className={leftChevron} ref="leftChevron" onClick={this.handleLeftChevronClick}>
          <Icon {...this.props} icon="left"/>
        </a>
        <a className={rightChevron} ref="rightChevron" onClick={this.handleRightChevronClick}>
          <Icon {...this.props} icon="right"/>
        </a>
      </div>
    );
  }
});

LanguageTab.propTypes = {
  languagesPerPage: React.PropTypes.objectOf(React.PropTypes.number)
};

LanguageTab.defaultProps = {
  languagesPerPage: {
    xs: 1,
    sm: 4,
    md: 4,
    lg: 15
  },
  responsiveView: 'md'
};

module.exports = LanguageTab;