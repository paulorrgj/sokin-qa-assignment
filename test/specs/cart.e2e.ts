import { expect } from '@wdio/globals';
import ProductsPage from '../pageobjects/products.page.js';
import CartPage from '../pageobjects/cart.page.js';

/**
 * Directly backs Product Discovery Q2: "Add multiple products and refresh —
 * what happens to the cart?". This documents the *current* web behaviour as an
 * executable assertion so any regression (or a different behaviour on the
 * native app) is caught automatically.
 */
describe('Cart persistence', () => {
  it('keeps all added items after a page refresh', async () => {
    await ProductsPage.open();
    await ProductsPage.addProductsToCart(2);

    await CartPage.open();
    expect(await CartPage.itemCount()).toBe(2);

    await browser.refresh();
    expect(await CartPage.itemCount()).toBe(2);
  });
});
