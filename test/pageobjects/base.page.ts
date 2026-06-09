import type { ChainablePromiseElement } from 'webdriverio';
import { platform } from '../support/platform.js';
import type { Locator } from '../selectors/index.js';

/**
 * Base for all Page Objects.
 *
 * Resolves a cross-platform `Locator` to a live element for the active platform,
 * so every Page Object and spec is written once and runs on web / Android / iOS.
 */
export default abstract class BasePage {
  /** Single element for the active platform. */
  protected el(locator: Locator) {
    return $(locator[platform()]);
  }

  /** Element collection for the active platform. */
  protected els(locator: Locator) {
    return $$(locator[platform()]);
  }

  /**
   * Resilient click. Waits for the element, centers it, then clicks. If a third
   * party overlay (e.g. an ad iframe on this public site) intercepts the native
   * click, we fall back to a DOM click so the test reflects user intent rather
   * than ad noise. On native this is a plain tap.
   */
  protected async click(locator: Locator): Promise<void> {
    await this.clickElement(this.el(locator));
  }

  protected async clickElement(el: ChainablePromiseElement): Promise<void> {
    await el.waitForDisplayed({ timeout: 15000 });
    try {
      await el.scrollIntoView({ block: 'center' });
    } catch {
      /* scrollIntoView is best-effort on some viewports */
    }
    try {
      await el.click();
    } catch {
      if (platform() === 'web') {
        const node = await el;
        await browser.execute((n: HTMLElement) => n.click(), node as unknown as HTMLElement);
      } else {
        throw new Error('Native tap was intercepted and cannot fall back to a DOM click.');
      }
    }
  }

  /**
   * Navigate to a route. On web this is a URL; on native the app is already
   * launched and in-app navigation is driven by Page Object actions, so this
   * is a no-op there (kept so specs read identically across platforms).
   */
  protected async openPath(path: string): Promise<void> {
    if (platform() === 'web') {
      await browser.url(path);
    }
  }

  protected async waitVisible(locator: Locator, timeout = 15000): Promise<void> {
    await this.el(locator).waitForDisplayed({ timeout });
  }
}
