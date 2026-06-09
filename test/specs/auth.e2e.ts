import { expect } from '@wdio/globals';
import HomePage from '../pageobjects/home.page.js';
import AuthPage from '../pageobjects/auth.page.js';
import { buildUser } from '../data/users.js';

/**
 * Registration is the highest-value flow: it gates everything downstream
 * (cart, checkout, order history). We assert the user-visible outcomes only.
 */
describe('Account registration', () => {
  it('registers a brand-new user end-to-end and signs them in', async () => {
    const user = buildUser();

    await HomePage.open();
    await HomePage.goToSignupLogin();
    await AuthPage.startSignup(user.name, user.email);
    await AuthPage.fillAccountDetails(user);

    expect(await AuthPage.accountCreatedText()).toMatch(/account created/i);

    await AuthPage.continueAfterCreate();

    expect(await HomePage.isLoggedIn()).toBe(true);
    expect(await HomePage.loggedInUserName()).toContain(user.name);
  });
});

describe('Login validation', () => {
  it('rejects invalid credentials with a clear, user-facing error', async () => {
    await AuthPage.open();
    await AuthPage.login('does.not.exist@example.com', 'WrongPassword123');

    expect(await AuthPage.loginErrorText()).toContain('incorrect');
  });
});
