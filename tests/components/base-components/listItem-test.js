jest.dontMock("../../../js/components/base-components/listItem");
jest.dontMock("../../../js/constants/constants");

var React = require("react");
var TestUtils = require("react-addons-test-utils");
var ListItem = require("../../../js/components/base-components/listItem");

describe("ListItem component", function() {
  var clickedId = null;

  var selectedProps = {
    selected: true,
    name: "List Item 1",
    id: "1",
    skinConfig: {},
    responsiveView: "xs"
  };

  var commonProps = {
    selected: false,
    name: "List Item 1",
    id: "1",
    skinConfig: {},
    responsiveView: "xs",
    handleSelect: function(id) {
      clickedId = id;
    }
  }

  it("should render list item component", function() {
    var DOM = TestUtils.renderIntoDocument(<ListItem {...commonProps} />);
    var component = TestUtils.findRenderedComponentWithType(DOM, ListItem);

    expect(component).toBeTruthy();
  });

  it("should render list item component with correct name", function() {
    var DOM = TestUtils.renderIntoDocument(<ListItem {...commonProps} />);
    var component = TestUtils.findRenderedDOMComponentWithClass(DOM, "text");

    expect(component.textContent).toEqual(commonProps.name);
  });

  it("should render selected list item component with correct class", function() {
    var DOM = TestUtils.renderIntoDocument(<ListItem {...selectedProps} />);
    var component = TestUtils.findRenderedDOMComponentWithClass(DOM, "oo-list-item");

    expect(component.className).toEqual("oo-list-item select");
  });

  it("should render selected list item component with correct class", function() {
    var DOM = TestUtils.renderIntoDocument(<ListItem {...commonProps} />);
    var component = TestUtils.findRenderedDOMComponentWithClass(DOM, "oo-list-item");

    expect(component.className).toEqual("oo-list-item");
  });

  it("should call method on click", function() {
    var DOM = TestUtils.renderIntoDocument(<ListItem {...commonProps} />);
    var domNode = TestUtils.findRenderedDOMComponentWithClass(DOM, "oo-list-item");

    TestUtils.Simulate.click(domNode);

    expect(clickedId).toBe("1");
  });
})