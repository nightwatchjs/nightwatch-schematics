import { NightwatchBrowser } from 'nightwatch';

module.exports = {
  before: (browser: NightwatchBrowser) => {
    browser.url(browser.launch_url);
  },

  after: (browser: NightwatchBrowser) => {
    browser.end();
  },

  'should check heading contains text End-to-End Testing': (browser: NightwatchBrowser) => {
    browser.assert.containsText('.hero-section h1', 'End-to-End Testing');
  },
};
