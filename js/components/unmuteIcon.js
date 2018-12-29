const React = require('react');


const ClassNames = require('classnames');

const createReactClass = require('create-react-class');
const PropTypes = require('prop-types');
const CONSTANTS = require('../constants/constants');
const Icon = require('./icon');

const UnmuteIcon = createReactClass({
  getInitialState() {
    return {
      collapseTime: 2000,
    };
  },

  unmuteClick(event) {
    // Clicking on this button shouldn't trigger clicks on parent components
    event.stopPropagation();
    this.props.controller.handleMuteClick();
  },

  onMouseUp(event) {
    // The AdScreen currently uses the mouseup event to handle ad clickthroughs,
    // otherwise stopping propagation on the click event should've been enough
    event.stopPropagation();
  },

  componentDidMount() {
    const expanded = !this.props.controller.state.volumeState.unmuteIconCollapsed;
    if (expanded) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(
        () => {
          this.props.controller.state.volumeState.unmuteIconCollapsed = true;
          this.setState({});
        },
        this.state.collapseTime
      );
    }
  },

  componentWillUnmount() {
    clearTimeout(this.timeout);
  },

  render() {
    let volumeIcon; let
      volumeAriaLabel;
    if (this.props.controller.state.volumeState.muted) {
      volumeIcon = 'volumeOff';
      volumeAriaLabel = CONSTANTS.ARIA_LABELS.UNMUTE;
    } else {
      volumeIcon = 'volume';
      volumeAriaLabel = CONSTANTS.ARIA_LABELS.MUTE;
    }

    const expanded = !this.props.controller.state.volumeState.unmuteIconCollapsed;

    const myClass = ClassNames({
      'oo-unmute': true,
      'oo-expanded': expanded,
    });

    return (
      <button
        className={myClass}
        onClick={this.unmuteClick}
        onMouseUp={this.onMouseUp}
        type="button"
        tabIndex="0"
        aria-label={volumeAriaLabel}
      >
        <div className="oo-unmute-icon-wrapper">
          <Icon {...this.props} icon={volumeIcon} ref="volumeIcon" />
        </div>

        {expanded ? <div className="oo-unmute-message">{CONSTANTS.SKIN_TEXT.SELECT_TO_UNMUTE}</div> : null}
      </button>
    );
  },
});

UnmuteIcon.propTypes = {
  controller: PropTypes.shape({
    state: PropTypes.shape({
      volumeState: PropTypes.shape({
        muted: PropTypes.bool,
        unmuteIconCollapsed: PropTypes.bool,
      }),
    }),
  }),
};

module.exports = UnmuteIcon;
