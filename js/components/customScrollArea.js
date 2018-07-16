const React = require('react');
const ReactDOM = require('react-dom');
const ScrollArea = require('react-scrollbar/dist/no-css').default;

/**
 * Extends the react-scrollbar component with the ability to prevent the full page
 * from scrolling while the scroll area is being scrolled. The original component
 * supports this partially through the stopScrollPropagation prop, but this currently
 * doesn't work with touch devices, hence the need for this custom component.
 */
class CustomScrollArea extends React.Component {

  constructor(props) {
    super(props);
    this.scrollArea = React.createRef();
    this.onTouchMove = this.onTouchMove.bind(this);
  }

  componentDidMount() {
    this.domNode = ReactDOM.findDOMNode(this.scrollArea.current);

    if (this.domNode) {
      this.domNode.addEventListener('touchmove', this.onTouchMove);
    }
  }

  componentWillUnmount() {
    if (this.domNode) {
      this.domNode.removeEventListener('touchmove', this.onTouchMove);
    }
  }

  onTouchMove(event) {
    // Avoid preventing default on child elements otherwise the scroll area
    // itself will not scroll
    if (this.domNode === event.currentTarget) {
      event.preventDefault();
    }
  }

  render() {
    return (
      <ScrollArea
        {...this.props}
        ref={this.scrollArea}
        stopScrollPropagation={true}>
        {this.props.children}
      </ScrollArea>
    );
  }
}

module.exports = CustomScrollArea;
