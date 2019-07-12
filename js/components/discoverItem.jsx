import React from 'react';
import PropTypes from 'prop-types';
import CONSTANTS from '../constants/constants';
import Utils from './utils';

/**
 * The item in the list of discovery items
 */
class DiscoverItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { imgError: false };
  }

  componentWillMount() {
    const { src } = this.props;
    const img = new window.Image();
    img.src = src;

    img.onerror = () => {
      this.setState({ imgError: true });
    };
  }

  /**
   * @param {Object} event – the event object
   */
  handleKeyUp = (event) => {
    const { onClickAction } = this.props;
    if (event.keyCode === CONSTANTS.KEYCODES.SPACE_KEY) {
      event.stopPropagation();
      onClickAction();
    }
  }

  render() {
    const {
      contentTitle,
      contentTitleClassName,
      children,
      onClickAction,
      skinConfig,
      src,
    } = this.props;
    const { imgError } = this.state;
    if (imgError) {
      return null;
    }

    const thumbnailStyle = {
      backgroundImage: `url('${src}')`,
    };

    const itemTitleStyle = {
      color: Utils.getPropertyValue(skinConfig, 'discoveryScreen.contentTitle.font.color'),
      fontFamily: Utils.getPropertyValue(
        skinConfig,
        'discoveryScreen.contentTitle.font.fontFamily'
      ),
    };

    return (
      <div className="oo-discovery-image-wrapper-style">
        <div className="oo-discovery-wrapper">
          <div
            onClick={onClickAction}
            onKeyUp={this.handleKeyUp}
            role="button"
            tabIndex={0}
          >
            <div className="oo-image-style" style={thumbnailStyle} />
          </div>
          {children}
        </div>
        <div
          className={contentTitleClassName}
          style={itemTitleStyle}
          dangerouslySetInnerHTML={Utils.createMarkup(contentTitle)}
        />
      </div>
    );
  }
}

DiscoverItem.propTypes = {
  contentTitle: PropTypes.string,
  contentTitleClassName: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onClickAction: PropTypes.func,
  src: PropTypes.string.isRequired,
  skinConfig: PropTypes.shape({
    discoveryScreen: PropTypes.shape({
      contentTitle: PropTypes.shape({
        font: PropTypes.shape({
          color: PropTypes.string,
          fontFamily: PropTypes.string,
        }),
      }),
    }),
  }),
};

DiscoverItem.defaultProps = {
  contentTitle: '',
  contentTitleClassName: '',
  children: [],
  onClickAction: () => {},
  skinConfig: { discoveryScreen: { contentTitle: { font: {} } } },
};

module.exports = DiscoverItem;
