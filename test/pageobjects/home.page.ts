import BasePage from './base.page.js';
import { home } from '../selectors/index.js';

class HomePage extends BasePage {
  async open(): Promise<void> {
    await this.openPath('/');
    await this.waitVisible(home.signupLoginNav);
  }

  async goToSignupLogin(): Promise<void> {
    await this.click(home.signupLoginNav);
  }

  async goToProducts(): Promise<void> {
    await this.click(home.productsNav);
  }

  async goToCart(): Promise<void> {
    await this.click(home.cartNav);
  }

  async isLoggedIn(): Promise<boolean> {
    return this.el(home.logoutNav).isExisting();
  }

  async loggedInUserName(): Promise<string> {
    return (await this.el(home.loggedInAs).getText()).trim();
  }
}

export default new HomePage();
