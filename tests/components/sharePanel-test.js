jest.dontMock('../../js/components/sharePanel');

describe('SharePanel', function () {
  it('displays social panel in social screen', function () {
    var React = require('react/addons');
    var SharePanel = require('../../js/components/sharePanel');
    var TestUtils = React.addons.TestUtils;

    // Render share panel in document
    var sharePanel = TestUtils.renderIntoDocument(
      <SharePanel />
    );

    var shareTabPanel = TestUtils.findRenderedDOMComponentWithClass(sharePanel, 'shareTabPanel');

    // test share tab
    var shareTab = TestUtils.findRenderedDOMComponentWithClass(sharePanel, 'shareTab');
    expect(React.findDOMNode(shareTab).textContent).toEqual('Share');
    TestUtils.Simulate.click(shareTab);
    expect(React.findDOMNode(shareTabPanel).textContent).toContain('Invest In Social Change');

    // test embed tab
    var embedTab = TestUtils.findRenderedDOMComponentWithClass(sharePanel, 'embedTab');
    expect(React.findDOMNode(embedTab).textContent).toEqual('Embed');
    TestUtils.Simulate.click(embedTab);
    var textArea = TestUtils.findRenderedDOMComponentWithTag(shareTabPanel, 'textarea');
    expect(React.findDOMNode(textArea).value).toContain('//player.ooyala.com/v4/');

    // test email tab
    var emailTab = TestUtils.findRenderedDOMComponentWithClass(sharePanel, 'emailTab');
    expect(React.findDOMNode(emailTab).textContent).toEqual('Email');
    TestUtils.Simulate.click(emailTab);
    expect(sharePanel.refs.sharePanelTo.getDOMNode().defaultValue).toEqual('recipient');
    expect(sharePanel.refs.sharePanelSubject.getDOMNode().defaultValue).toEqual('subject');
    expect(sharePanel.refs.sharePanelMessage.getDOMNode().defaultValue).toContain('Optional Message');
  });
});