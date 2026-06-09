/**
 * Single source of truth for the platform under test.
 *
 * Each wdio.<platform>.conf.ts sets process.env.PLATFORM before the session
 * starts. Page Objects and the selector layer read it to resolve the correct
 * locator for the active platform, so specs stay 100% platform-agnostic.
 */
export type Platform = 'web' | 'android' | 'ios';

export const platform = (): Platform => {
  const p = (process.env.PLATFORM as Platform) ?? 'web';
  if (!['web', 'android', 'ios'].includes(p)) {
    throw new Error(`Unsupported PLATFORM "${p}". Expected web | android | ios.`);
  }
  return p;
};

export const isNative = (): boolean => platform() !== 'web';
