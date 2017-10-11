/**
 * Panel component for video quality selection
 *
 * @module VideoQualityPanel
 */
var React = require('react'),
    ScrollArea = require('react-scrollbar/dist/no-css'),
    ClassNames = require('classnames'),
    Icon = require('../components/icon')
    CONSTANTS = require('../constants/constants');

var VideoQualityPanel = React.createClass({

  getInitialState: function() {
    return {
      selected: this.props.videoQualityOptions.selectedBitrate ? this.props.videoQualityOptions.selectedBitrate.id : 'auto'
    };
  },

  handleVideoQualityClick: function(selectedBitrateId, event) {
    event.preventDefault();
    var eventData = {
      "id": selectedBitrateId
    };
    this.props.controller.sendVideoQualityChangeEvent(eventData);
    this.setState({
      selected: selectedBitrateId
    });
    this.props.closeAction({
      restoreToggleButtonFocus: true
    });
  },

  /**
   * Keydown event handler. Implements arrow key navigation for menu items.
   * TODO:
   * Export this logic to a generic higher order component so that this is reusable
   * by other menu components.
   * @private
   * @param {event} event The keyboard event object.
   */
  handleVideoQualityKeyDown: function(event) {
    if (!event.target || !event.target.hasAttribute('data-focus-id')) {
      return;
    }
    switch (event.key) {
      case CONSTANTS.KEY_VALUES.ARROW_UP:
      case CONSTANTS.KEY_VALUES.ARROW_LEFT:
        event.preventDefault();
        this.focusOnMenuItemSibling(event.target, false);
        break;
      case CONSTANTS.KEY_VALUES.ARROW_DOWN:
      case CONSTANTS.KEY_VALUES.ARROW_RIGHT:
        event.preventDefault();
        this.focusOnMenuItemSibling(event.target, true);
        break;
      default:
        break;
    }
  },

  /**
   * Finds the previous or next sibling of the given menu item and gives it focus.
   * @private
   * @param {Element} menuItem The menuItem element whose sibling we want to focus on.
   * @param {Boolean} useNextSibling Choses the sibling next to menuItem when true and the previous one when false.
   */
  focusOnMenuItemSibling: function(menuItem, useNextSibling) {
    var menuItemsList = [];
    if (this.menuDomElement) {
      menuItemsList = this.menuDomElement.querySelectorAll('[data-focus-id]');
    }
    if (!menuItemsList.length) {
      return;
    }
    // Since these elements aren't actually next to each other in the DOM, their position
    // relative to one another is implied from their tab order
    var siblingIndex = this.getMenuItemSiblingIndex(menuItemsList, menuItem, useNextSibling);
    var menuItem = menuItemsList[siblingIndex];

    if (menuItem && typeof menuItem.focus === 'function') {
      menuItem.focus();
    }
  },

  /**
   * Gets the index of the previous or next menu item on the list relative to
   * the given menu item. The returned index will loop around so that the previous sibling of
   * the first element is the last element, and the next sibling of the last element is
   * the first element.
   * @private
   * @param {NodeList} menuItemList An ordered list of elements that comprise a menu.
   * @param {Element} menuItem The menu item whose sibling we want to find.
   * @param {Boolean} useNextSibling Choses the sibling next to menuItem when true and the previous one when false.
   * @return {Number} The index where the sibling menu items is located in the list, -1 if menuItem is absent from the list.
   */
  getMenuItemSiblingIndex: function (menuItemList, menuItem, useNextSibling) {
    if (!menuItemList || !menuItemList.length) {
      return -1;
    }
    var menuItemIndex = Array.prototype.indexOf.call(menuItemList, menuItem);
    var siblingIndex = useNextSibling ? menuItemIndex + 1 : menuItemIndex - 1;
    // Note that the code below will have the intended result even if
    // menuItemIndex is -1
    if (siblingIndex < 0) {
      siblingIndex = menuItemList.length - 1;
    }
    if (siblingIndex >= menuItemList.length) {
      siblingIndex = 0;
    }
    return siblingIndex;
  },

  addAutoButton: function(bitrateButtons) {
    var isSelected = this.state.selected === 'auto';
    var autoQualityBtn = ClassNames({
      'oo-quality-auto-btn': true,
      'oo-selected': isSelected
    });
    var selectedBitrateStyle = {color: (this.props.skinConfig.general.accentColor && this.state.selected == 'auto') ? this.props.skinConfig.general.accentColor : null};

    //add auto btn to beginning of array
    bitrateButtons.unshift(
      <li className="oo-auto-li" key='auto-li'>
        <button
          className={autoQualityBtn}
          key="auto"
          data-focus-id="auto"
          tabIndex="0"
          role="menuitemradio"
          aria-label={CONSTANTS.ARIA_LABELS.AUTO_QUALITY}
          aria-checked={isSelected}
          onClick={this.handleVideoQualityClick.bind(this, 'auto')}>
          <span className="oo-quality-auto-icon" style={selectedBitrateStyle}>
            <Icon {...this.props} icon="auto" />
          </span>
          <span className="oo-quality-auto-label" style={selectedBitrateStyle}>
            {CONSTANTS.SKIN_TEXT.AUTO_QUALITY}
          </span>
        </button>
      </li>
    );
  },

  render: function() {
    var availableBitrates  = this.props.videoQualityOptions.availableBitrates;
    var bitrateButtons = [];
    var isSelected = false;
    var label = '';

    //available bitrates
    for (var i = 0; i < availableBitrates.length; i++) {
      isSelected = this.state.selected === availableBitrates[i].id;

      var qualityBtn = ClassNames({
        'oo-quality-btn': true,
        'oo-selected': isSelected
      });
      var selectedBitrateStyle = {color: (this.props.skinConfig.general.accentColor && this.state.selected == availableBitrates[i].id) ? this.props.skinConfig.general.accentColor : null};

      if (availableBitrates[i].id == 'auto') {
        this.addAutoButton(bitrateButtons);
      } else {
        if (typeof availableBitrates[i].bitrate === 'number') {
          label = Math.round(availableBitrates[i].bitrate/1000) + ' kbps';
        } else {
          label = availableBitrates[i].bitrate;
        }
        bitrateButtons.push(
          <li key={i}>
            <button
              key={i}
              className={qualityBtn}
              style={selectedBitrateStyle}
              data-focus-id={'quality' + i}
              tabIndex="0"
              role="menuitemradio"
              aria-label={label}
              aria-checked={isSelected}
              onClick={this.handleVideoQualityClick.bind(this, availableBitrates[i].id)}>
              {label}
            </button>
          </li>
        );
      }
    }

    var qualityScreenClass = ClassNames({
      'oo-content-panel': !this.props.popover,
      'oo-quality-panel': !this.props.popover,
      'oo-quality-popover': this.props.popover,
      'oo-mobile-fullscreen': !this.props.popover && this.props.controller.state.isMobile && (this.props.controller.state.fullscreen || this.props.controller.state.isFullWindow)
    });

    return (
      <div
        className={qualityScreenClass}
        onKeyDown={this.handleVideoQualityKeyDown}>
        <ScrollArea
          className="oo-quality-screen-content"
          speed={this.props.popover ? 0.6 : 1}
          horizontal={!this.props.popover}>
          <ul
            ref={function(e) { this.menuDomElement = e; }.bind(this)}
            role="menu">
            {bitrateButtons}
          </ul>
        </ScrollArea>
      </div>
    );
  }
});

VideoQualityPanel.propTypes = {
  videoQualityOptions: React.PropTypes.shape({
    availableBitrates: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: React.PropTypes.string,
      bitrate: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      ]),
      label: React.PropTypes.string
    }))
  }),
  closeAction: React.PropTypes.func,
  controller: React.PropTypes.shape({
    sendVideoQualityChangeEvent: React.PropTypes.func
  })
};

VideoQualityPanel.defaultProps = {
  popover: false,
  skinConfig: {
    icons: {
      quality:{fontStyleClass:'oo-icon oo-icon-topmenu-quality'}
    }
  },
  videoQualityOptions: {
    availableBitrates: []
  },
  closeAction: function() {},
  controller: {
    sendVideoQualityChangeEvent: function(a){}
  }
};

module.exports = VideoQualityPanel;
