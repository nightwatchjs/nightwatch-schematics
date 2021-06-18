import { NightwatchBrowser } from 'nightwatch';

module.exports = {
  before: (browser: NightwatchBrowser) => {
    browser.url(browser.launch_url);
  },

  after: (browser: NightwatchBrowser) => {
    browser.end();
  },

  'should check heading contains text Nightwatch.js': (browser: NightwatchBrowser) => {
    browser.assert.containsText('#top-section h1', 'Nightwatch.js');
  },
};
