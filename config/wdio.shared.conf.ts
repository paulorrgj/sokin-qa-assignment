import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Cross-platform base config. The platform-specific files (web / android / ios)
 * spread this and only add `capabilities` + the runner/service they need, so
 * everything except the device layer is defined exactly once.
 */
export const shared: Omit<WebdriverIO.Config, 'capabilities'> = {
  runner: 'local',
  tsConfigPath: path.resolve(here, '../tsconfig.json'),

  specs: [path.resolve(here, '../test/specs/**/*.e2e.ts')],
  maxInstances: 1,

  logLevel: 'warn',
  bail: 0,
  waitforTimeout: 15000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,

  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 120000,
  },

  /**
   * Test isolation: clear web session state before each test so specs never
   * depend on the order they run in (e.g. a prior registration leaving the user
   * logged in). On native, app state is reset via Appium capabilities instead.
   */
  beforeTest: async function () {
    if (process.env.PLATFORM === 'web') {
      try {
        await browser.deleteAllCookies();
      } catch {
        /* no active document yet on the very first test */
      }
    }
  },
};
