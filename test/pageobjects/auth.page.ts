import BasePage from './base.page.js';
import { auth } from '../selectors/index.js';
import type { NewUser } from '../data/users.js';

class AuthPage extends BasePage {
  async open(): Promise<void> {
    await this.openPath('/login');
    await this.waitVisible(auth.loginEmail);
  }

  // ----- Login -----
  async login(email: string, password: string): Promise<void> {
    await this.el(auth.loginEmail).setValue(email);
    await this.el(auth.loginPassword).setValue(password);
    await this.click(auth.loginButton);
  }

  async loginErrorText(): Promise<string> {
    await this.waitVisible(auth.loginError);
    return (await this.el(auth.loginError).getText()).trim();
  }

  // ----- Signup -----
  async startSignup(name: string, email: string): Promise<void> {
    await this.el(auth.signupName).setValue(name);
    await this.el(auth.signupEmail).setValue(email);
    await this.click(auth.signupButton);
  }

  async signupErrorText(): Promise<string> {
    await this.waitVisible(auth.signupError);
    return (await this.el(auth.signupError).getText()).trim();
  }

  async fillAccountDetails(user: NewUser): Promise<void> {
    await this.waitVisible(auth.password);
    await this.click(auth.titleMr);
    await this.el(auth.password).setValue(user.password);
    await this.selectByValue(auth.days, user.birthDay);
    await this.selectByValue(auth.months, user.birthMonth);
    await this.selectByValue(auth.years, user.birthYear);
    await this.el(auth.firstName).setValue(user.firstName);
    await this.el(auth.lastName).setValue(user.lastName);
    await this.el(auth.address).setValue(user.address);
    await this.selectByValue(auth.country, user.country);
    await this.el(auth.state).setValue(user.state);
    await this.el(auth.city).setValue(user.city);
    await this.el(auth.zipcode).setValue(user.zipcode);
    await this.el(auth.mobile).setValue(user.mobile);
    await this.click(auth.createAccount);
  }

  async accountCreatedText(): Promise<string> {
    await this.waitVisible(auth.accountCreated);
    return (await this.el(auth.accountCreated).getText()).trim();
  }

  async continueAfterCreate(): Promise<void> {
    await this.click(auth.continueAfterCreate);
  }

  private async selectByValue(locator: typeof auth.days, value: string): Promise<void> {
    await this.el(locator).selectByAttribute('value', value);
  }
}

export default new AuthPage();
