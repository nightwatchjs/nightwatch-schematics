import { NightwatchBrowser } from 'nightwatch';

describe('workspace-project App', () => {
  // @ts-ignore
  before((browser: NightwatchBrowser) => {
    browser.url(browser.launch_url);
  });

  it('should check heading contains text Nightwatch.js', (browser: NightwatchBrowser) => {
    browser.assert.containsText('#top-section h1', 'Nightwatch.js');
  });

  // @ts-ignore
  after((browser: NightwatchBrowser) => browser.end());
});
