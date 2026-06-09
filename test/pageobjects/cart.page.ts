import BasePage from './base.page.js';
import { cart } from '../selectors/index.js';

class CartPage extends BasePage {
  async open(): Promise<void> {
    await this.openPath('/view_cart');
  }

  async itemCount(): Promise<number> {
    // The cart table only renders when it has items.
    if (!(await this.el(cart.table).isExisting())) {
      return 0;
    }
    return this.els(cart.rows).length;
  }

  async isEmpty(): Promise<boolean> {
    return (await this.itemCount()) === 0;
  }
}

export default new CartPage();
