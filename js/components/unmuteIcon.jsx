import React from 'react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';

import CONSTANTS from '../constants/constants';
import Icon from './icon';

/**
 * The unmute icon component
 */
class UnmuteIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseTime: 2000,
    };
  }

  componentDidMount() {
    const { controller } = this.props;
    const { collapseTime } = this.state;
    const expanded = !controller.state.volumeState.unmuteIconCollapsed;
    if (expanded) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(
        () => {
          controller.state.volumeState.unmuteIconCollapsed = true;
          this.setState({});
        },
        collapseTime,
      );
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  /**
   * The AdScreen currently uses the mouseup event to handle ad clickthroughs,
   * otherwise stopping propagation on the click event should've been enough
   * @param {Object} event - the mouseUp event object
   */
  static onMouseUp(event) {
    event.stopPropagation();
  }

  /**
   * Clicking on this button shouldn't trigger clicks on parent components
   * @param {Object} event - the click event object
   */
  unmuteClick = (event) => {
    event.stopPropagation();
    const { controller } = this.props;
    controller.handleMuteClick();
  }

  render() {
    const { controller } = this.props;
    let volumeIcon;
    let volumeAriaLabel;
    if (controller.state.volumeState.muted) {
      volumeIcon = 'volumeOff';
      volumeAriaLabel = CONSTANTS.ARIA_LABELS.UNMUTE;
    } else {
      volumeIcon = 'volume';
      volumeAriaLabel = CONSTANTS.ARIA_LABELS.MUTE;
    }

    const expanded = !controller.state.volumeState.unmuteIconCollapsed;

    const myClass = ClassNames({
      'oo-unmute': true,
      'oo-expanded': expanded,
    });

    return (
      <button
        className={myClass}
        onClick={this.unmuteClick}
        onMouseUp={this.constructor.onMouseUp}
        type="button"
        tabIndex="0"
        aria-label={volumeAriaLabel}
      >
        <div className="oo-unmute-icon-wrapper">
          <Icon
            {...this.props}
            icon={volumeIcon}
          />
        </div>

        {expanded ? <div className="oo-unmute-message">{CONSTANTS.SKIN_TEXT.SELECT_TO_UNMUTE}</div> : null}
      </button>
    );
  }
}

UnmuteIcon.propTypes = {
  controller: PropTypes.shape({
    state: PropTypes.shape({
      volumeState: PropTypes.shape({
        muted: PropTypes.bool,
        unmuteIconCollapsed: PropTypes.bool,
      }),
    }),
  }).isRequired,
};

module.exports = UnmuteIcon;
