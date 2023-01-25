describe('Sample Example', function () {
  before((browser) => browser.navigateTo('https://nightwatchjs.org/'));

  it('Sample test nightwatchjs.org', function (browser) {
    browser
      .windowSize('current', 1920, 1080)
      .waitForElementVisible('body')
      .assert.titleContains('Nightwatch')
      .assert.visible('.DocSearch-Button')
      .click('.copy.btn-copy')
      .assert.textContains('.npm-install', 'Code copied')
      .assert.textContains('.brand-message', 'End-to-End Testing');
  });

  after((browser) => browser.end());
});
