process.env.PLATFORM = 'ios';

import { shared } from './wdio.shared.conf.js';

/**
 * iOS (Appium + XCUITest) target for the native app.
 *
 * Requires: macOS + Xcode with a simulator (or a provisioned real device),
 * Appium 2 with the xcuitest driver, and a built .app/.ipa pointed to by
 * IOS_APP. Same specs, same Page Objects — only capabilities change.
 */
export const config: WebdriverIO.Config = {
  ...shared,
  port: 4723,
  services: ['appium'],
  capabilities: [
    {
      platformName: 'iOS',
      'appium:automationName': 'XCUITest',
      'appium:deviceName': process.env.IOS_DEVICE ?? 'iPhone 15',
      'appium:platformVersion': process.env.IOS_OS_VERSION ?? '17.5',
      'appium:app': process.env.IOS_APP, // absolute path to the .app/.ipa under test
      'appium:newCommandTimeout': 240,
    },
  ],
};
