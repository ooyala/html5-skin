jest
.dontMock('../../js/components/castPanel')
.dontMock('classnames');

var React = require('react');
var Enzyme = require('enzyme');
var CastPanel = require('../../js/components/castPanel');

describe('CastPanel', function(){
    
    function renderComponent(className) {
        return Enzyme.mount(
            <CastPanel
                device="Test Panel"
                connected={false}
                className={className}
            />
        );
    };

    it('Should render a cast panel', function(){
        const panel = renderComponent();
        expect(panel).toBeTruthy();
    });

    it('Should render a cast panel with a given className', function(){
        const panel = renderComponent('my-class-test');
        expect(panel.getDOMNode().classList.contains('my-class-test')).toBe(true);
    });
});

