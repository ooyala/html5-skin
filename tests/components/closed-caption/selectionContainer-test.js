jest
.dontMock('../../../js/components/closed-caption/selectionContainer')
.dontMock('../../../js/components/utils')
.dontMock('../../../js/constants/constants')
.dontMock('classnames');

var React = require('react');
var ReactDOM = require('react-dom');
var Enzyme = require('enzyme');
var SelectionContainer = require('../../../js/components/closed-caption/selectionContainer');
var CONSTANTS = require('../../../js/constants/constants');

describe('SelectionContainer', function() {
  var props, children, node, tree, component, element;

  // Using ReactDOM.render instead of test utils in order to allow re-render to simulate props update
  function renderComponent() {
    props.children = children;
    tree = ReactDOM.render(<SelectionContainer {...props} />, node);
    component = TestUtils.findRenderedComponentWithType(tree, SelectionContainer);
    element = ReactDOM.findDOMNode(component);
  }

  beforeEach(function() {
    node = document.createElement('div');
    tree = null;
    component = null;
    element = null;
    children = [
      <span key="a">a</span>,
      <span key="b">b</span>,
      <span key="c">c</span>,
      <span key="d">d</span>
    ];
    props = {
      className: 'className',
      selectionText: 'selectionText',
      title: 'title',
      ariaLabel: 'ariaLabel',
      role: 'role',
      children: children
    };
  });

  it('should render a SelectionContainer', function() {
    renderComponent();
    expect(component).toBeTruthy();
  });

  it('should set ARIA label and role on wrapper element', function() {
    props.ariaLabel = 'ariaLabel';
    props.role = 'role';
    renderComponent();
    var wrapperElement = TestUtils.findRenderedDOMComponentWithClass(tree, 'oo-selection-items-container');
    expect(wrapperElement.getAttribute('aria-label')).toBe(props.ariaLabel);
    expect(wrapperElement.getAttribute('role')).toBe(props.role);
  });

});
