# Issues and Improvements Tracker

This is the full list of what I found while exploring `automationexercise.com`, treated as the reference for the mobile app. I grouped the issues by area and gave each one an ID so it can be followed through to a fix.

How I am using the labels:

**Severity:** Critical (a blocker, or affects integrity), High (a major function is broken), Medium (works only partly, or hurts usability), Low (minor or cosmetic).
**Type:** Bug, Validation, UX, Enhancement, Stability.
**Platform:** Both, Mobile, Desktop.

## Summary

| ID | Area | Title | Platform | Severity | Type | Status |
|----|------|-------|----------|----------|------|--------|
| PAY-01 | Checkout and payment | Payment accepts any input and confirms the order | Both | Critical | Validation | Open |
| AUTH-01 | Account and auth | A badly formed email (`paulo@test`) is accepted at signup | Both | High | Validation | Open |
| AUTH-02 | Account and auth | Registration accepts any value in any field | Both | High | Validation | Open |
| AUTH-04 | Account and auth | "Delete Account" runs with no confirmation | Both | High | UX | Open |
| CART-01 | Cart | You cannot change the quantity in the cart | Both | High | Bug | Open |
| CART-03 | Cart | No overall cart total is shown on the cart screen | Both | High | Bug | Open |
| ATC-02 | Add to cart | On mobile, a second tap is needed to add a product | Mobile | High | Bug | Open |
| BRW-01 | Browsing and search | A category filter shows an unrelated product (Kids, Dress shows a non dress) | Both | Medium | Bug | Open |
| BRW-02 | Browsing and search | Prices have no currency or formatting (`Rs. 1500`) | Both | Medium | UX | Open |
| BRW-03 | Browsing and search | The Enter key does not run a search (desktop) | Desktop | Medium | UX | Open |
| AUTH-03 | Account and auth | On mobile, the duplicate email error scrolls out of view | Mobile | Medium | UX | Open |
| AUTH-05 | Account and auth | There is no profile area to view or update account details | Both | Medium | Enhancement | Open |
| ATC-01 | Add to cart | The "Added" popup does not block the page behind it | Both | Medium | UX | Open |
| ATC-03 | Add to cart | On mobile, the "Added" popup appears in the wrong place | Mobile | Medium | UX | Open |
| CART-05 | Cart | Tapping a product image in the cart reloads the cart instead of opening the product | Both | Medium | Bug | Open |
| CART-06 | Cart | There is no maximum quantity, so unlimited units can be added | Both | Medium | Validation | Open |
| STAB-01 | Stability | A "heavy load (queue full)" page and server errors after repeated use | Both | Medium | Stability | Open |
| FORM-01 | Forms (across the app) | Empty required fields show a message but no highlight | Both | Low | UX | Open |
| CART-02 | Cart | Removing a cart item has no confirmation | Both | Low | UX | Open |
| CART-04 | Cart | The line totals (price times quantity) have no currency formatting | Both | Low | UX | Open |
| BRW-04 | Browsing and search | The search button is not aligned with the search bar | Both | Low | UX | Open |

Totals: 1 Critical, 6 High, 9 Medium, 5 Low. That is 21 issues.

## A. Browsing and search

### BRW-01. A category filter shows an unrelated product
**Severity:** Medium. **Type:** Bug. **Platform:** Both.
Steps: go to Filter, then Category, then Kids, then Dress.
Expected: only dresses appear.
Actual: "Sleeves Top and Short - Blue & Pink", which is not a dress, is shown.
Improvement: fix which products belong to which category, and add a check so products only appear under categories that match. This is also worth an automated test on filtered results.

### BRW-02. Prices have no currency or formatting
**Severity:** Medium. **Type:** UX. **Platform:** Both.
Steps: look at the Home or Products screen.
Expected: a clearly formatted price with a currency, for example `₹1,500.00`.
Actual: plain values like `Rs. 1500`, with an unclear currency and no grouping or decimals.
Improvement: show prices formatted for the user's region, with the right currency and proper number formatting. This matters for trust, and even more on a global mobile app.

### BRW-03. The Enter key does not run a search (desktop)
**Severity:** Medium. **Type:** UX. **Platform:** Desktop.
Steps: on Products, type "T-Shirt" in the search box and press Enter.
Expected: the search runs when I press Enter.
Actual: nothing happens. Only clicking the search button works.
Improvement: make the search run on Enter. On mobile, the keyboard's search or go key should also trigger it.

### BRW-04. The search button is not aligned with the bar
**Severity:** Low. **Type:** UX. **Platform:** Both.
Expected: the search button lines up with the input.
Actual: the button is offset from the search bar.
Improvement: fix the alignment so the button sits neatly with the input.

## B. Account and authentication

### AUTH-01. A badly formed email is accepted at signup
**Severity:** High. **Type:** Validation. **Platform:** Both.
Steps: go to Signup and Login, then New User Signup, enter `paulo@test`, and tap Signup.
Expected: an email with no real domain is rejected, with a clear message.
Actual: the account is created.
Improvement: check the email format properly, both in the app and on the server, and ideally confirm it by sending a verification email. This keeps out junk and unreachable accounts.

### AUTH-02. Registration accepts any value in any field
**Severity:** High. **Type:** Validation. **Platform:** Both.
Steps: fill in the registration form with random values for Password, Address, Phone, Zip, and so on.
Expected: each field is checked appropriately (password rules, numbers for phone and zip, sensible lengths).
Actual: any input is accepted.
Improvement: add proper rules per field, enforced on the server too. This protects data quality and the later shipping and payment steps.

### AUTH-03. On mobile, the duplicate email error scrolls out of view
**Severity:** Medium. **Type:** UX. **Platform:** Mobile.
Steps: on a phone, go to New User Signup, enter an email that already exists, and tap Signup.
Expected: the message "Email Address already exist!" is visible.
Actual: the page jumps to the top, so the error, which sits lower, is off screen. The user has to scroll to find it.
Improvement: scroll to the error or show it next to the field. This also relates to Discovery Q1.

### AUTH-04. "Delete Account" runs with no confirmation
**Severity:** High. **Type:** UX (an action that cannot be undone). **Platform:** Both.
Steps: while logged in, click Delete Account.
Expected: a confirmation step before something permanent.
Actual: the account is deleted right away.
Improvement: add a confirmation step, and ideally ask for the password again, before anything permanent.

### AUTH-05. There is no profile area
**Severity:** Medium. **Type:** Enhancement. **Platform:** Both.
Expected: a place to view and update profile details such as name, address, and password.
Actual: there is no profile or account management area.
Improvement: add a profile screen for viewing and editing the user's details.

## C. Forms and validation (across the app)

### FORM-01. Empty required fields are not highlighted
**Severity:** Low. **Type:** UX. **Platform:** Both.
Steps: submit any form with a required field left empty.
Expected: the empty field is highlighted, for example with a red border, alongside a message.
Actual: only a message appears, with no highlight, so it is not obvious which field needs attention.
Improvement: apply a clear error style (red border, helper text, and focus) to empty or invalid required fields everywhere in the app.

## D. Adding to the cart

### ATC-02. On mobile, a second tap is needed to add a product
**Severity:** High. **Type:** Bug. **Platform:** Mobile.
Steps: on a phone, go to Products and tap Add to Cart on a product.
Expected: one tap adds the product.
Actual: an orange slider appears first, and I have to tap Add to Cart again to actually add it.
Improvement: remove the in between hover style state on touch devices so the first tap adds the product. This is friction on the most important action.

### ATC-01. The "Added" popup does not block the page behind it
**Severity:** Medium. **Type:** UX. **Platform:** Both.
Steps: add a product to the cart.
Expected: the confirmation either blocks the page until dismissed, or is clearly a non blocking notice by design.
Actual: the page behind the popup can still be scrolled and tapped without closing it.
Improvement: decide whether this is a blocking popup or a light notification, and make it consistent. Either block the page behind it, or replace it with a small toast plus a cart badge.

### ATC-03. On mobile, the "Added" popup appears in the wrong place
**Severity:** Medium. **Type:** UX. **Platform:** Mobile.
Steps: on a phone, add a product to the cart.
Expected: a clearly visible, centred confirmation.
Actual: the popup appears toward the top of the screen rather than centred.
Improvement: fix the popup's position so it is centred and clearly visible on phone screens.

## E. Cart

### CART-01. You cannot change the quantity in the cart
**Severity:** High. **Type:** Bug. **Platform:** Both.
Steps: add a product, open the cart, and try to change the quantity.
Expected: the quantity can be edited in the cart.
Actual: the quantity cannot be changed in the cart.
Improvement: make the quantity editable, with the total updating live. This is core cart behaviour.

### CART-03. No overall cart total is shown
**Severity:** High. **Type:** Bug. **Platform:** Both.
Steps: add several products and open the cart.
Expected: a clear overall total (the sum of all the line totals).
Actual: each line shows its own total (price times quantity), but there is no overall total. The user has to go to checkout to find out what they will pay.
Improvement: show a running subtotal and overall total on the cart screen. This is separate from CART-04, which is about the formatting of the existing line totals.

### CART-05. Tapping a product image in the cart reloads the cart
**Severity:** Medium. **Type:** Bug. **Platform:** Both.
Steps: in the cart, tap a product's image.
Expected: it opens that product's page.
Actual: the page reloads and the cart opens again, instead of the product.
Improvement: link the cart product image and title to the correct product page.

### CART-06. There is no maximum quantity
**Severity:** Medium. **Type:** Validation. **Platform:** Both.
Steps: add the same product many times, or set a very large quantity.
Expected: a sensible limit, based on stock or a per order cap.
Actual: unlimited units can be added.
Improvement: set a maximum quantity tied to stock or business rules, with a clear message when the limit is reached.

### CART-02. Removing a cart item has no confirmation
**Severity:** Low. **Type:** UX. **Platform:** Both.
Steps: in the cart, tap the "x" on an item.
Expected: a confirmation, or an undo option.
Actual: the item is removed instantly with no confirmation.
Improvement: add an undo option (my preference) or a confirmation for removals.

### CART-04. The line totals have no currency formatting
**Severity:** Low. **Type:** UX. **Platform:** Both.
Steps: add a product with a quantity above 1, open the cart, and look at the line total (price times quantity).
Expected: a formatted amount, for example `6,300.00` with a currency.
Actual: the line total is a plain number like `6300`.
Improvement: format every amount with the right currency and grouping. Same root cause as BRW-02, and separate from CART-03, which is the missing overall total.

## F. Checkout and payment

### PAY-01. Payment accepts any input and confirms the order
**Severity:** Critical. **Type:** Validation. **Platform:** Both.
Steps: reach the payment screen, type `1` into every field, and submit.
Expected: the card number, expiry, and security code are checked, and invalid details are rejected.
Actual: the order is confirmed with clearly invalid details.
Improvement: check the payment fields properly (format, length, expiry, security code) and connect a real or sandbox payment provider. This is the most important issue, since it directly affects whether orders and payments are real. On mobile, also guard against the same payment being submitted twice on a shaky connection.

## G. Stability and performance

### STAB-01. A "heavy load (queue full)" page after repeated use
**Severity:** Medium. **Type:** Stability. **Platform:** Both.
Steps: browse the site repeatedly during a session.
Expected: the site stays available, or handles being overloaded gracefully with a clear message.
Actual: a "This website is under heavy load (queue full)" page appears, along with server and network errors in the browser tools.
Improvement: I captured the console and network output as evidence. This is most likely the public demo site hitting its own capacity limit, but the way it is shown to users and the errors behind it are still worth noting. On a real app, I would want graceful handling, retries, and a clear message.

## How these connect to the assignment

- For the exploratory report, I promoted the most important issues (such as PAY-01, ATC-02, CART-01, AUTH-03, and AUTH-04) into the main "issues" section with full steps and impact, and pointed to this tracker for the complete list.
- For Discovery Q1 (an email that already exists), AUTH-01 and AUTH-03 are the direct evidence.
- For Discovery Q2 (the cart after a refresh), the behaviour is confirmed by the automated test (the cart persists), with a manual check to match.
- For Discovery Q3 (something confusing while browsing), BRW-02 (unclear prices), BRW-01 (a wrong filter result), and BRW-03 (Enter does not search) are all strong candidates.
