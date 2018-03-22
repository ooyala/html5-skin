jest.dontMock("../../../js/components/base-components/listWithChoice");
jest.dontMock("../../../js/components/base-components/listItem");
jest.dontMock("../../../js/constants/constants");

var React = require("react");
var TestUtils = require("react-addons-test-utils");
var ListItem = require("../../../js/components/base-components/listItem");
var ListWithChoice = require("../../../js/components/base-components/listWithChoice");

describe("ListItem component", function() {
  var clickedId = null;

  var props = {
    header: "List",
    list: [
      {
        name: "List Item 1",
        id: "1",
        selected: true
      },
      {
        name: "List Item 2",
        id: "2",
        selected: false
      }
    ],
    skinConfig: {},
    responsiveView: ""
  };

  it("should render list component", function() {
    var component = TestUtils.renderIntoDocument(<ListWithChoice {...props} />);

    expect(component).toBeTruthy();
  });

  it("should render list component with correct header", function() {
    var component = TestUtils.renderIntoDocument(<ListWithChoice {...props} />);
    var header = TestUtils.findRenderedDOMComponentWithClass(
      component,
      "oo-list-header"
    );

    expect(header.textContent).toEqual(props.header);
  });

  it("should render list component with correct number of items", function() {
    var component = TestUtils.renderIntoDocument(<ListWithChoice {...props} />);
    var listItems = TestUtils.scryRenderedComponentsWithType(
      component,
      ListItem
    );

    expect(listItems.length).toBe(2);
  });
});
