import BasePage from './base.page.js';
import { products } from '../selectors/index.js';

class ProductsPage extends BasePage {
  async open(): Promise<void> {
    await this.openPath('/products');
    await this.waitVisible(products.firstAddToCart);
  }

  async productCount(): Promise<number> {
    return this.els(products.productCard).length;
  }

  /**
   * Add the Nth product (0-based) to the cart and dismiss the confirmation modal.
   * Uses index access on a single cross-platform collection so the same call
   * works for web cards and native list cells.
   */
  async addProductToCart(index: number): Promise<void> {
    const addButtons = await this.els(products.firstAddToCart);
    await this.clickElement(addButtons[index]);
    await this.waitVisible(products.modal);
    await this.click(products.modalContinue);
    await this.el(products.modal).waitForDisplayed({ reverse: true, timeout: 10000 });
  }

  async addProductsToCart(count: number): Promise<void> {
    for (let i = 0; i < count; i++) {
      await this.addProductToCart(i);
    }
  }

  async goToCartFromModal(): Promise<void> {
    await this.click(products.modalViewCart);
  }
}

export default new ProductsPage();
