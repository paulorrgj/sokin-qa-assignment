process.env.PLATFORM = 'web';

import { shared } from './wdio.shared.conf.js';

const headless = !process.env.HEADED;

/**
 * Runnable proof-of-framework target.
 *
 * Drives the responsive site in Chrome under Pixel-7 mobile emulation. Needs
 * only Node + Chrome (WebdriverIO v9 auto-manages the driver) — no emulator,
 * Appium, or real app required. This exercises the exact same Page Objects and
 * specs that the native targets use; only the selector layer + capabilities
 * differ.
 */
export const config: WebdriverIO.Config = {
  ...shared,
  baseUrl: 'https://automationexercise.com',
  capabilities: [
    {
      browserName: 'chrome',
      // Don't block navigation on slow third-party resources; DOM-ready is
      // enough for our interactions and avoids live-site load hangs.
      'pageLoadStrategy': 'eager',
      'goog:chromeOptions': {
        mobileEmulation: { deviceName: 'Pixel 7' },
        args: [
          ...(headless ? ['--headless=new'] : []),
          '--disable-gpu',
          '--no-sandbox',
          '--disable-dev-shm-usage',
          '--window-size=412,915',
          // The public site serves third-party ad iframes that overlap and
          // intercept clicks. Blackholing the ad hosts keeps the run
          // deterministic and focused on the product under test.
          '--host-resolver-rules=' +
            [
              'MAP *.doubleclick.net 127.0.0.1',
              'MAP *.googlesyndication.com 127.0.0.1',
              'MAP *.googleadservices.com 127.0.0.1',
              'MAP *.google-analytics.com 127.0.0.1',
              'MAP googleads.g.doubleclick.net 127.0.0.1',
            ].join(','),
        ],
      },
    },
  ],
};
