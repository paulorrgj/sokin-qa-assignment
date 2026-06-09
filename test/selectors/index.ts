import type { Platform } from '../support/platform.js';

/**
 * A locator for every supported platform.
 *
 * - `web`     -> CSS selector / WDIO selector against the responsive site
 *                (real, runnable today via mobile-emulated Chrome).
 * - `android` -> Appium UiAutomator2 selector. We default to accessibility ids
 *                (`~id`) because they are the most stable, shared contract
 *                between native iOS and Android and the cheapest for devs to add.
 * - `ios`     -> Appium XCUITest selector, also accessibility-id based.
 *
 * The native ids below are the contract I would agree with engineering
 * (accessibilityIdentifier / contentDescription). They are intentionally
 * declared up-front so specs and Page Objects are already wired for native;
 * only this map changes when the real app build lands.
 */
export type Locator = Record<Platform, string>;

const acc = (id: string): Pick<Locator, 'android' | 'ios'> => ({
  android: `~${id}`,
  ios: `~${id}`,
});

export const home = {
  signupLoginNav: { web: 'a[href="/login"]', ...acc('nav-signup-login') },
  productsNav: { web: 'a[href="/products"]', ...acc('nav-products') },
  cartNav: { web: 'a[href="/view_cart"]', ...acc('nav-cart') },
  loggedInAs: { web: 'a:has(i.fa-user)', ...acc('nav-logged-in-as') },
  logoutNav: { web: 'a[href="/logout"]', ...acc('nav-logout') },
} satisfies Record<string, Locator>;

export const auth = {
  // Login form
  loginEmail: { web: 'input[data-qa="login-email"]', ...acc('login-email') },
  loginPassword: { web: 'input[data-qa="login-password"]', ...acc('login-password') },
  loginButton: { web: 'button[data-qa="login-button"]', ...acc('login-submit') },
  loginError: { web: '.login-form p[style*="color"]', ...acc('login-error') },
  // Signup (step 1)
  signupName: { web: 'input[data-qa="signup-name"]', ...acc('signup-name') },
  signupEmail: { web: 'input[data-qa="signup-email"]', ...acc('signup-email') },
  signupButton: { web: 'button[data-qa="signup-button"]', ...acc('signup-submit') },
  signupError: { web: '.signup-form p[style*="color"]', ...acc('signup-error') },
  // Account details (step 2)
  titleMr: { web: '#id_gender1', ...acc('signup-title-mr') },
  password: { web: '#password', ...acc('signup-password') },
  days: { web: '#days', ...acc('signup-days') },
  months: { web: '#months', ...acc('signup-months') },
  years: { web: '#years', ...acc('signup-years') },
  firstName: { web: '#first_name', ...acc('signup-first-name') },
  lastName: { web: '#last_name', ...acc('signup-last-name') },
  address: { web: '#address1', ...acc('signup-address') },
  country: { web: '#country', ...acc('signup-country') },
  state: { web: '#state', ...acc('signup-state') },
  city: { web: '#city', ...acc('signup-city') },
  zipcode: { web: '#zipcode', ...acc('signup-zipcode') },
  mobile: { web: '#mobile_number', ...acc('signup-mobile') },
  createAccount: { web: 'button[data-qa="create-account"]', ...acc('signup-create-account') },
  accountCreated: { web: 'h2[data-qa="account-created"]', ...acc('account-created') },
  continueAfterCreate: { web: 'a[data-qa="continue-button"]', ...acc('account-created-continue') },
} satisfies Record<string, Locator>;

export const products = {
  searchInput: { web: '#search_product', ...acc('products-search-input') },
  searchButton: { web: '#submit_search', ...acc('products-search-submit') },
  productCard: { web: '.features_items .product-image-wrapper', ...acc('product-card') },
  // First in-flow "Add to cart" of each card (not the hover overlay one).
  firstAddToCart: { web: '.features_items .productinfo a.add-to-cart', ...acc('product-add-to-cart') },
  modal: { web: '#cartModal', ...acc('add-to-cart-modal') },
  modalViewCart: { web: '#cartModal a[href="/view_cart"]', ...acc('add-to-cart-modal-view-cart') },
  modalContinue: { web: '#cartModal button.close-modal', ...acc('add-to-cart-modal-continue') },
} satisfies Record<string, Locator>;

export const cart = {
  table: { web: '#cart_info_table', ...acc('cart-table') },
  rows: { web: '#cart_info_table tbody tr', ...acc('cart-row') },
  emptyMessage: { web: '#empty_cart', ...acc('cart-empty') },
  proceedToCheckout: { web: '.check_out', ...acc('cart-checkout') },
} satisfies Record<string, Locator>;
