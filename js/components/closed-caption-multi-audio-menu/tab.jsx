import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import CustomScrollArea from '../customScrollArea';
import Icon from '../icon';
import AccessibleButton from '../accessibleButton';
import AccessibleMenu from '../higher-order/accessibleMenu';
import CONSTANTS from '../../constants/constants';

/**
 * Manage tab
 */
class TabProto extends React.Component {
  /**
   * Handle click on tab
   * @param {number} id - the tab id
   */
  handleClick(id) {
    const { handleClick } = this.props;
    if (typeof handleClick === 'function') {
      handleClick(id);
    }
  }

  render() {
    const {
      tabClassName,
      header,
      itemsList,
      skinConfig,
    } = this.props;

    return (
      <div className={classnames('oo-cc-ma-menu__coll', tabClassName)}>
        <div className="oo-cc-ma-menu__header">{header}</div>
        <CustomScrollArea
          className="oo-cc-ma-menu__scrollarea"
          speed={1}
          horizontal={false}
        >
          <ul
            className="oo-cc-ma-menu__list"
            role={CONSTANTS.ARIA_ROLES.MENU}
          >
            {itemsList.map((item, index) => {
              const { id } = item;
              return (
                <li
                  key={id}
                  role={CONSTANTS.ARIA_ROLES.PRESENTATION}
                  className={classnames('oo-cc-ma-menu__element', {
                    'oo-cc-ma-menu__element--active': item.enabled,
                  })}
                >
                  <AccessibleButton
                    key={item.id}
                    className="oo-multi-audio-btn"
                    focusId={CONSTANTS.FOCUS_IDS.MULTI_AUDIO + index}
                    role={CONSTANTS.ARIA_ROLES.MENU_ITEM_RADIO}
                    ariaLabel={item.label}
                    ariaChecked={item.enabled}
                    onClick={() => this.handleClick(id)}
                  >
                    <Icon
                      skinConfig={skinConfig}
                      icon="selected"
                      className={classnames({ 'oo-icon-hidden': !item.enabled })}
                    />
                    <span className="oo-cc-ma-menu__name" title={item.label}>
                      {item.label}
                    </span>
                  </AccessibleButton>
                </li>
              );
            })
            }
          </ul>
        </CustomScrollArea>
      </div>
    );
  }
}

const Tab = AccessibleMenu(TabProto, { useRovingTabindex: false });

TabProto.defaultProps = {
  tabClassName: '',
  header: '',
  skinConfig: {
    responsive: {
      breakpoints: {
        xs: { id: 'xs' },
        sm: { id: 'sm' },
        md: { id: 'md' },
        lg: { id: 'lg' },
      },
    },
  },
  handleClick: () => {},
};

TabProto.propTypes = {
  tabClassName: PropTypes.string,
  header: PropTypes.string,
  itemsList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      enabled: PropTypes.bool.isRequired,
    })
  ).isRequired,
  skinConfig: PropTypes.shape({}),
  handleClick: PropTypes.func,
};

module.exports = Tab;
