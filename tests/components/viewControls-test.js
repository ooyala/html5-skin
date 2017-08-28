// jest.dontMock('../../js/components/viewControls')
// 	.dontMock('../../js/components/icon');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var ViewControls = require('../../js/components/viewControls');
var DirectionControl = require('../../js/components/directionControl');

describe('viewControls', function () {
	var baseMockController, baseMockProps;

	beforeEach(function () {
		baseMockProps = {
			isLiveStream: false,
			controller: baseMockController,
		};
	});

	it('creates a viewControls', function () {
		var mockProps = {
			isLiveStream: false,
			duration: 30
		};

		var DOM = TestUtils.renderIntoDocument(
			<ViewControls {...mockProps}/>
		);
	});

	it('create buttons in a viewControls', function () {

		function handleDirection () {
			console.log('handleDirection');
			return true;
		};

		var styles = {
			position: 'absolute',
			display: 'block',
			top: '10%',
			left: '10%',
			background: 'black',
			opacity: 0.3
		};

		var mockProps = {
			isLiveStream: false,
			duration: 30
		};

		var DOM = TestUtils.renderIntoDocument(
			<ViewControls {...mockProps}/>
		);

		// setTimeout(function () {
		// 	var buttons = TestUtils.scryRenderedDOMComponentsWithClass(DOM, 'direction-control');
		var buttons = DOM.refs[]
			console.log('buttons', buttons);
		// }, 0)

		// TestUtils.Simulate.click(button);
	})
});