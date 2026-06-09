import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const here = path.dirname(fileURLToPath(import.meta.url));
const screenshotDir = path.resolve(here, '../screenshots');

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

  /**
   * The runnable proof target drives a public demo site, so a run can be
   * disturbed by third-party flakiness (slow ads/CDN, transient 5xx) that has
   * nothing to do with the product under test. Retrying a failed spec file
   * absorbs that noise without hiding a real, reproducible defect (which fails
   * every attempt). On native this protects against device/emulator hiccups.
   */
  specFileRetries: 2,
  specFileRetriesDeferred: true,

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

  /**
   * On failure, capture a screenshot so a CI run is debuggable after the fact
   * (uploaded as a build artifact) instead of having to reproduce locally.
   */
  afterTest: async function (test, _context, { passed }) {
    if (passed) return;
    try {
      fs.mkdirSync(screenshotDir, { recursive: true });
      const safe = test.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
      await browser.saveScreenshot(path.join(screenshotDir, `FAIL-${safe}-${Date.now()}.png`));
    } catch {
      /* screenshotting is best-effort; never mask the original failure */
    }
  },
};
