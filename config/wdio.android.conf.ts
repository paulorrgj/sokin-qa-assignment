process.env.PLATFORM = 'android';

import { shared } from './wdio.shared.conf.js';

/**
 * Android (Appium + UiAutomator2) target for the native app.
 *
 * Requires: Android SDK + an emulator/device, Appium 2 with the uiautomator2
 * driver, and a built .apk pointed to by ANDROID_APP. The framework is fully
 * wired; supply those inputs and `npm run test:android` runs the same specs.
 */
export const config: WebdriverIO.Config = {
  ...shared,
  port: 4723,
  services: ['appium'],
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': process.env.ANDROID_DEVICE ?? 'Pixel_7_API_34',
      'appium:platformVersion': process.env.ANDROID_OS_VERSION ?? '14.0',
      'appium:app': process.env.ANDROID_APP, // absolute path to the .apk under test
      'appium:autoGrantPermissions': true,
      'appium:newCommandTimeout': 240,
    },
  ],
};
