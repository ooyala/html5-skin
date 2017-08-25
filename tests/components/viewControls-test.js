jest.dontMock('../../js/components/viewControls')
	.dontMock('../../js/components/icon');

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var viewControls = require('../../js/components/viewControls');
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
			<viewControls {...mockProps}/>
		);
	});

	it('create buttons in a viewControls', function () {
		var styles = {
			position: 'absolute',
			display: 'block',
			top: '10%',
			left: '10%',
			background: 'black',
			opacity: 0.3
		};

		var DOM = TestUtils.renderIntoDocument(
			<div style={styles}>
				<DirectionControl dir="left"/>
				<DirectionControl dir="right"/>
				<DirectionControl dir="up"/>
				<DirectionControl dir="down"/>
			</div>
		)
	})
});