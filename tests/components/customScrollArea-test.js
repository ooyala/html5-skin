jest
.dontMock('react-scrollbar/dist/no-css')
.dontMock('../../js/components/customScrollArea')
.dontMock('../../js/constants/constants')
.dontMock('classnames');

const React = require('react');
const ReactDOM = require('react-dom');
const Enzyme = require('enzyme');
const CustomScrollArea = require('../../js/components/customScrollArea');
const ScrollArea = require('react-scrollbar/dist/no-css').default;
const CONSTANTS = require('../../js/constants/constants');

describe('CustomScrollArea', function() {
  let wrapper, component, props;

  // Workaround for jsdom not supporting offset properties
  // See: https://github.com/jsdom/jsdom/issues/135
  Object.defineProperties(window.HTMLElement.prototype, {
    offsetLeft: {
      get: function() { return parseFloat(window.getComputedStyle(this).marginLeft) || 0; }
    },
    offsetTop: {
      get: function() { return parseFloat(window.getComputedStyle(this).marginTop) || 0; }
    },
    offsetHeight: {
      get: function() { return parseFloat(window.getComputedStyle(this).height) || 0; }
    },
    offsetWidth: {
      get: function() { return parseFloat(window.getComputedStyle(this).width) || 0; }
    }
  });

  const renderComponent = (children) => {
    wrapper = Enzyme.mount(
      <CustomScrollArea {...props} >
        {children}
      </CustomScrollArea>
    );
    component = wrapper.instance();
  };

  beforeEach(function() {
    wrapper = null;
    component = null;
    props = {
      className: 'className',
      vertical: true,
      style: {
        width: '50px',
        height: '50px'
      },
      contentStyle: {
        width: '50px',
        height: '50px'
      }
    };
  });

  it('should render a CustomScrollArea', function() {
    renderComponent();
    expect(component).toBeTruthy();
  });

  it('should set stopScrollPropagation prop to true when content is scrollable', function() {
    props.style.height = '50px';
    props.contentStyle.height = '100px';
    renderComponent();
    expect(wrapper.find(ScrollArea).props().stopScrollPropagation).toBe(true);
  });

  it('should set stopScrollPropagation prop to false when content is NOT scrollable', function() {
    props.style.height = '150px';
    props.contentStyle.height = '100px';
    renderComponent();
    expect(wrapper.find(ScrollArea).props().stopScrollPropagation).toBe(false);
  });

  it('should prevent default on touchmove when content is scrollable', function() {
    let defaultPrevented = false;
    props.style.height = '50px';
    props.contentStyle.height = '100px';
    renderComponent();

    component.onTouchMove({
      currentTarget: component.domNode,
      preventDefault: () => defaultPrevented = true
    })
    expect(defaultPrevented).toBe(true);
  });

  it('should NOT prevent default on touchmove when content is NOT scrollable', function() {
    let defaultPrevented = false;
    props.style.height = '150px';
    props.contentStyle.height = '100px';
    renderComponent();

    component.onTouchMove({
      currentTarget: component.domNode,
      preventDefault: () => defaultPrevented = true
    })
    expect(defaultPrevented).toBe(false);
  });

  it('should remove touchmove event listener when component is unmounted', function() {
    renderComponent();
    const spy = jest.spyOn(component.domNode, 'removeEventListener');
    wrapper.unmount();
    expect(spy.mock.calls.length).toBe(1);
    expect(spy.mock.calls[0]).toEqual(expect.arrayContaining(['touchmove']));
    spy.mockRestore();
  });

});
