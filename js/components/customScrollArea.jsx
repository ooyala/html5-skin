import React from 'react';
import ReactDOM from 'react-dom';
import ScrollArea from 'react-scrollbar/dist/no-css';

/**
 * Extends the react-scrollbar component with the ability to prevent the full page
 * from scrolling while the scroll area is being scrolled. The original component
 * supports this partially through the stopScrollPropagation prop, but this currently
 * doesn't work with touch devices, hence the need for this custom component.
 */
class CustomScrollArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = { canScroll: false };

    this.storeRef = this.storeRef.bind(this);
    this.composedComponentDidUpdate = this.composedComponentDidUpdate.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
  }

  componentWillUnmount() {
    this.removeDomListeners();
  }

  /**
   * Handles the touchmove event. This is used in order to prevent the whole page
   * from scrolling while attempting to scroll the ScrollArea on touch devices.
   * @private
   * @param {Event} event The touchmove event object
   */
  onTouchMove(event) {
    // Avoid preventing default on child elements otherwise the scroll area
    // itself will not scroll
    const { canScroll } = this.state;
    if (
      canScroll // Only prevent default if area can actually be scrolled
      && this.domNode === event.currentTarget
    ) {
      event.preventDefault();
    }
  }

  /**
   * Removes any event listeners that were added to DOM nodes by this component.
   * @private
   */
  removeDomListeners() {
    if (this.domNode) {
      this.domNode.removeEventListener('touchmove', this.onTouchMove);
    }
  }

  /**
   * React ref callback. Decorates the ScrollArea's componentDidUpdate handler and
   * sets up touchmove event listener.
   * @private
   * @param {Component} ref The ref to the ScrollArea component
   */
  storeRef(ref) {
    this.composedComponent = ref;

    if (this.composedComponent) {
      // Store component's componentDidUpdate handler and replace with decorated handler
      this.composedComponentDidUpdateHandler = this.composedComponent.componentDidUpdate;
      this.composedComponent.componentDidUpdate = this.composedComponentDidUpdate;

      // Make sure to remove any listeners that were previously set
      this.removeDomListeners();
      // Find new DOM node
      this.domNode = ReactDOM.findDOMNode(this.composedComponent); // eslint-disable-line

      if (this.domNode) {
        this.domNode.addEventListener('touchmove', this.onTouchMove);
      }
    }
  }

  /**
   * Handles the componentDidUpdate event for the child ScrollArea component.
   * This is used in order to call the component's canScroll() method and update
   * our state with its value.
   * @private
   */
  composedComponentDidUpdate(...args) {
    // Called original componentDidUpdate handler if it exists
    if (typeof this.composedComponentDidUpdateHandler === 'function') {
      this.composedComponentDidUpdateHandler.apply(this.composedComponent, args);
    }
    if (this.composedComponent) {
      // The goal of getting this value is to allow scrolling freely in cases in
      // which the scroll area's content is not large enough to overflow
      const canScrollComposedElement = this.composedComponent.canScroll(this.composedComponent.state);
      const { canScroll } = this.state;
      // Update state only if it's different from previous
      if (canScroll !== canScrollComposedElement) {
        this.setState({ canScroll: canScrollComposedElement });
      }
    }
  }

  render() {
    const { children } = this.props;
    const { canScroll } = this.state;
    return (
      <ScrollArea
        {...this.props}
        ref={this.storeRef}
        stopScrollPropagation={canScroll}
      >
        {children}
      </ScrollArea>
    );
  }
}

module.exports = CustomScrollArea;
