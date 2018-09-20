jest.dontMock('../../js/mixins/responsiveManagerMixin');
jest.dontMock('../../js/components/utils');

const React = require('react');
const Enzyme = require('enzyme');
const debounce = require('lodash.debounce');
const createReactClass = require('create-react-class');
const responsiveManagerMixin = require('../../js/mixins/responsiveManagerMixin');

let Foo = createReactClass({
  mixins: [responsiveManagerMixin],
  render: function() {
    return (
      <div>{this.props.children}</div>
    );
  }
});

describe('responsiveManagerMixin', function() {
  let props =  {
    controller: {
      state: {
        mainVideoContainer: {
          width: function() { return 160; }
        }
      }
    },
    skinConfig: {
      responsive: {
        breakpoints: 'xs'
      }
    }
  };

  let wrapper, component;
  const renderComponent = () => {
    wrapper = Enzyme.mount(<Foo {...props} />);
    component = wrapper.instance();
  };

  it('returns correct values for component sizes', function() {

    Element.prototype.getBoundingClientRect = function () { return {width: 600, height: 400} };
    renderComponent();

    let states = responsiveManagerMixin.getInitialState();
    expect(states.componentWidth).toBe(null);
    expect(states.componentHeight).toBe(null);
    component.generateResponsiveData();
    expect(component.state.componentWidth).toBe(600);
    expect(component.state.componentHeight).toBe(400);

    Element.prototype.getBoundingClientRect = function () { return {width: 16} };
    component.generateResponsiveData();
    expect(component.state.componentWidth).toBe(16);
    expect(component.state.componentHeight).toBe(9);

    Element.prototype.getBoundingClientRect = function () { return {width: 0} };
    component.generateResponsiveData();
    expect(component.state.componentWidth).toBe(0);
    expect(component.state.componentHeight).toBe(90);
  });
});