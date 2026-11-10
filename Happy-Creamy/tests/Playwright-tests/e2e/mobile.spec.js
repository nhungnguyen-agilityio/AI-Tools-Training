// Tests for apps/Mobile-index.html, based on specs/specs-v1.0.md and the test matrix in tests/.
// Test titles start with the matrix ID (TC-HCx-yy).
//   - A normal test runs against the mock-up.
//   - knownGap(): the mock-up does not match the spec or matrix yet. The test states the expected behaviour and is expected to fail;
//     when the mock-up is fixed it "passes unexpectedly" and fails the run, which is the signal to remove the marker.
//   - manual(): cannot be automated on the mock-up (real backend, device, browser permission, real time or data).
//     It is reported as "skipped" with the reason, so it stays visible in the report.
// Sections named "(more cases)" cover the remaining test matrix cases.
// Demo rules of the mock-up: the sign-up code is 123456; the reset code is shown on the screen ("Demo: the code is ...");
// codes last 10 minutes and lock after 5 wrong tries; a saved address has a demo distance field, so any distance can be tested.
const { test } = require('@playwright/test');
const { expect, knownGap, readSummary, bellUnread, registerAccount, loginWith } = require('./helpers');

const URL = '/Mobile-index.html';

// ---------- page helpers ----------
const nav = (page, name) => page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name });
const bell = (page) => page.getByRole('button', { name: /^Notifications/ });
const back = (page) => page.getByRole('button', { name: 'Back', exact: true });
const toast = (page) => page.getByRole('status');
const notifItems = (page) => page.locator('button.card').filter({ hasText: /Order HC-\d+ · / });
// The Account tab also has chips (Active orders, Order history, English, Tiếng Việt); only the feedback options are wanted here.
const NOT_FB = /^(Active orders|Order history|English|Tiếng Việt)$/;
const fbChips = (page) => page.locator('.chip').filter({ hasNotText: NOT_FB });
const pickedChips = (page) => page.locator('.chip.on').filter({ hasNotText: NOT_FB });
const pushBanner = (page) => page.locator('button').filter({ hasText: /HC\s*Happy Creamy\s*now/ });
const sheetAdd = (page) => page.getByRole('button', { name: /^Add to cart/ });
const placeOrder = (page) => page.getByRole('button', { name: /^Place order/ });
const demoNext = (page) => page.getByRole('button', { name: 'Demo: next status' });
const historyCard = (page, id) => page.locator('div.card').filter({ hasText: 'Order ' + id });

// The mock-up reads the clock (opening hours 08:00 to 22:00, pick-up slots). Every test starts at 10:00 unless it sets its own time.
// Tests tagged @clock install their own running clock (to fast-forward timers and expiry), so they skip the fixed time.
test.beforeEach(async ({ page }, testInfo) => { if (!testInfo.title.includes('@clock')) await page.clock.setFixedTime(T10); });

async function open(page) {
  await page.goto(URL);
}
async function signIn(page) {
  await open(page);
  await page.getByRole('button', { name: /Continue with Google/ }).click();
  await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
}

/** Opens a product from the menu, applies options and taps "Add to cart". */
async function addToCart(page, { name, size, tops = [], note, qty = 1 }) {
  await nav(page, 'Menu').click();
  await page.getByRole('button', { name: 'Customize ' + name }).first().click();
  if (size) await page.locator('.opt').filter({ hasText: size }).click();
  for (const t of tops) await page.locator('.row-opt').filter({ hasText: t }).click();
  if (note !== undefined) await page.locator('#note').fill(note);
  for (let i = 1; i < qty; i++) await page.getByRole('button', { name: 'More' }).click();
  await sheetAdd(page).click();
  await expect(sheetAdd(page)).toBeHidden();
}
async function openCart(page) {
  await page.getByRole('button', { name: /^View cart/ }).click();
  await expect(page.getByRole('heading', { name: 'Your order' })).toBeVisible();
}
async function checkoutWith(page, { name = 'Mint Cloud Cup', size = 'Size M', tops = [], qty = 1, type = 'Delivery', address, pay } = {}) {
  await addToCart(page, { name, size, tops, qty });
  await openCart(page);
  if (type) await page.getByRole('button', { name: type, exact: true }).click();
  if (address) await page.locator('.row-opt').filter({ hasText: address }).click();
  if (pay) await page.locator('.row-opt').filter({ hasText: pay }).click();
}
async function place(page, opts) {
  await checkoutWith(page, opts);
  await placeOrder(page).click();
  await expect(page.getByRole('heading', { name: /^Order HC-\d+$/ })).toBeVisible();
}
async function advance(page, times = 1) {
  for (let i = 0; i < times; i++) await demoNext(page).click();
}
async function backFromTracking(page) {
  await page.locator('button[aria-label="Back to menu"]').click();
}
async function orderId(page) {
  return (await page.getByRole('heading', { name: /^Order HC-\d+$/ }).textContent()).replace('Order ', '');
}
async function menuNames(page) {
  return page.evaluate(() => [...new Set([...document.querySelectorAll('button[aria-label^="Customize "]')].map((b) => b.getAttribute('aria-label').slice(10)))].sort());
}
async function openHistory(page) {
  await nav(page, 'Account').click();
  await page.getByRole('button', { name: 'Order history' }).click();
}

const manual = (reason) => test.skip(true, 'Manual: ' + reason);
const T10 = new Date('2026-11-09T10:00:00');
const star = (page, n) => page.getByRole('button', { name: new RegExp('^' + n + ' stars?:') });
const alert = (page) => page.getByRole('alert');

async function atTime(page, iso) { await page.clock.setFixedTime(new Date(iso)); }
const logout = async (page) => { await nav(page, 'Account').click(); await page.getByRole('button', { name: 'Log out' }).click(); };
const goVietnamese = async (page) => { await nav(page, 'Account').click(); await page.getByRole('button', { name: 'Tiếng Việt' }).click(); };

/** Adds a saved address with a demo distance (Account > Saved addresses > Add address), then returns to Account. */
async function addSavedAddress(page, name, line, km) {
  await nav(page, 'Account').click();
  await page.getByRole('button', { name: /^Saved addresses/ }).click();
  await page.getByLabel('Name', { exact: true }).fill(name);
  await page.getByLabel('Address', { exact: true }).fill(line);
  await page.getByLabel(/Distance from the nearest shop/).fill(String(km));
  await page.getByRole('button', { name: 'Add address' }).click();
  await back(page).click();
}
/** Delivery fee shown at checkout for an address with the given demo distance. */
async function feeAt(page, km) {
  await addSavedAddress(page, 'Test', '1 Test Street', km);
  await checkoutWith(page, { address: 'Test' });
  return (await readSummary(page))['Delivery fee'];
}
/** Opens "Forgot password?", asks for a reset code and returns the demo code shown on the screen. */
async function requestReset(page, email) {
  await page.getByRole('button', { name: 'Forgot password?' }).click();
  await page.locator('#email').fill(email);
  await page.getByRole('button', { name: 'Send reset code' }).click();
  return /(\d{6})/.exec(await page.locator('[data-demo-code]').textContent())[1];
}
async function resetWith(page, code, pw) {
  await page.locator('#rcode').fill(code);
  await page.locator('#npw').fill(pw);
  await page.getByRole('button', { name: 'Reset password' }).click();
}
/** A registered account, logged out, on the sign-in screen. */
async function registeredAndLoggedOut(page, email = 'nhung@example.com', pw = 'Kem12345') {
  await registerAccount(page, email, pw);
  await logout(page);
}
// =====================================================================
// HC-1 / HC-2  Authentication (SRS II.1)
// =====================================================================
test.describe('Authentication', () => {
  test('TC-HC2-01 / TC-HC25-10 signed-out user sees only the sign-in screen', async ({ page }) => {
    await open(page);
    await expect(page.getByText('Sign in to start scooping.')).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue with Google/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue with Facebook/ })).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#pw')).toBeVisible();
  });

  test('TC-HC1-01 / TC-HC1-03 sign in with Google shows Home and skips the email code', async ({ page }) => {
    await signIn(page);
    await expect(page.getByText('Sign in to start scooping.')).toBeHidden();
    await expect(page.getByText('Check your email')).toBeHidden();
  });

  test('TC-HC1-02 sign in with Facebook shows Home', async ({ page }) => {
    await open(page);
    await page.getByRole('button', { name: /Continue with Facebook/ }).click();
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC2-02 / TC-HC2-03 email sign-up asks for a 6-digit code, then signs in', async ({ page }) => {
    await open(page);
    await page.getByRole('button', { name: 'New here? Create an account' }).click();
    await page.locator('#email').fill('nhung@example.com');
    await page.locator('#pw').fill('Kem12345');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
    await expect(page.getByText('nhung@example.com').first()).toBeVisible();
    const verify = page.getByRole('button', { name: 'Verify and sign in' });
    await page.locator('#otp').fill('12345');
    await expect(verify).toBeDisabled();
    await page.locator('#otp').fill('123456');
    await expect(verify).toBeEnabled();
    await verify.click();
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC2-05 log in with email and password shows Home', async ({ page }) => {
    await registerAccount(page, 'nhung@example.com', 'Kem12345');
    await nav(page, 'Account').click();
    await page.getByRole('button', { name: 'Log out' }).click();
    await loginWith(page, 'nhung@example.com', 'Kem12345');
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC2-04 a wrong code is refused', async ({ page }) => {
    await open(page);
    await page.getByRole('button', { name: 'New here? Create an account' }).click();
    await page.locator('#email').fill('nhung@example.com');
    await page.locator('#pw').fill('Kem12345');
    await page.getByRole('button', { name: 'Create account' }).click();
    await page.locator('#otp').fill('000000');
    await page.getByRole('button', { name: 'Verify and sign in' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
  });

  test('TC-HC2-06 a wrong password is refused', async ({ page }) => {
    await open(page);
    await page.locator('#email').fill('nhung@example.com');
    await page.locator('#pw').fill('Wrong999');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText('Sign in to start scooping.')).toBeVisible();
  });

  test('TC-HC2-08 a 7-character password is refused', async ({ page }) => {
    await open(page);
    await page.getByRole('button', { name: 'New here? Create an account' }).click();
    await page.locator('#email').fill('nhung@example.com');
    await page.locator('#pw').fill('Kem1234');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByText(/8 characters or more/)).toBeVisible();
  });

  test('TC-HC2-10 / TC-HC2-11 invalid or empty email shows a field error', async ({ page }) => {
    await open(page);
    await page.getByRole('button', { name: 'New here? Create an account' }).click();
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Check your email' })).toBeHidden();
  });
});

// =====================================================================
// HC-4 / HC-5  Home (SRS V, Tab 1)
// =====================================================================
test.describe('Home', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); });

  test('TC-HC4-01 banner carousel with three banners and dots', async ({ page }) => {
    await expect(page.locator('.promo')).toBeVisible();
    await expect(page.locator('button.dot')).toHaveCount(3);
    await expect(page.getByRole('heading', { name: 'Coconut Pandan has landed' })).toBeVisible();
  });

  test('TC-HC4-03 tapping the third dot shows banner 3', async ({ page }) => {
    await page.getByRole('button', { name: 'Slide 3' }).click();
    await expect(page.getByRole('heading', { name: 'Cold at your door' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Slide 3' })).toHaveClass(/\bon\b/);
  });

  test('TC-HC4-04 / TC-HC4-08 the banner is not clickable', async ({ page }) => {
    const promo = page.locator('.promo');
    await expect(promo).toHaveCSS('cursor', 'auto');
    await expect(promo.locator('a, button')).toHaveCount(0);
    await promo.click();
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Menu', exact: true })).toBeHidden();
  });

  test('TC-HC5-01 four quick icons are shown', async ({ page }) => {
    for (const n of ['Best-Sellers', 'Cups', 'Cones', 'Take-away Tubs']) {
      await expect(page.getByRole('button', { name: n, exact: true })).toBeVisible();
    }
  });

  for (const [id, label] of [['TC-HC5-02', 'Cups'], ['TC-HC5-03', 'Best-Sellers'], ['TC-HC5-04', 'Cones'], ['TC-HC5-05', 'Take-away Tubs']]) {
    test(`${id} the ${label} icon opens the ${label} category`, async ({ page }) => {
      await page.getByRole('button', { name: label, exact: true }).first().click();
      await expect(page.getByRole('heading', { name: 'Menu', exact: true })).toBeVisible();
      await expect(page.locator('.chip.on')).toHaveText(label);
    });
  }

  test('TC-HC5-06 Order now opens the full menu on the All tab', async ({ page }) => {
    await page.getByRole('button', { name: 'Order now' }).click();
    await expect(page.getByRole('heading', { name: 'Menu', exact: true })).toBeVisible();
    await expect(page.locator('.chip.on')).toHaveText('All');
  });

  test('TC-HC4-02 swiping left moves to the next banner', async ({ page }) => {
    knownGap(test, 'the carousel has dots only, no swipe gesture');
    const box = await page.locator('.promo').boundingBox();
    await page.locator('.promo').dispatchEvent('touchstart', { touches: [{ clientX: box.x + 300, clientY: box.y + 60 }] });
    await page.locator('.promo').dispatchEvent('touchend', { changedTouches: [{ clientX: box.x + 40, clientY: box.y + 60 }] });
    await expect(page.getByRole('heading', { name: 'Tubs packed in dry ice' })).toBeVisible();
  });
});

// =====================================================================
// HC-6 / HC-7 / HC-8  Menu, customization, add to cart (SRS III, V Tab 2)
// =====================================================================
test.describe('Menu', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); await nav(page, 'Menu').click(); });

  test('TC-HC6-01 seven category tabs', async ({ page }) => {
    const labels = await page.locator('.chip').allTextContents();
    expect(labels).toEqual(['All', 'New Arrivals', 'Best-Sellers', 'Cups', 'Cones', 'Take-away Tubs', 'Beverages']);
  });

  test('TC-HC6-02 / TC-HC6-08 product card shows name, price format and badge', async ({ page }) => {
    const card = page.locator('div.card').filter({ has: page.getByRole('button', { name: 'Customize Mint Cloud Cup' }) });
    await expect(card.getByText('Mint Cloud Cup')).toBeVisible();
    await expect(card.getByText('from 25,000đ')).toBeVisible();
    await expect(card.locator('.bd')).toHaveText('New');
    await expect(card.locator('svg').first()).toBeVisible();
  });

  const filters = [
    ['TC-HC6-03', 'Cups', ['Choco Hazelnut Cup', 'Coconut Pandan Cup', 'Mint Cloud Cup']],
    ['TC-HC6-04', 'Cones', ['Mango Sunrise Cone', 'Matcha Mochi Cone', 'Vanilla Bean Cone']],
    ['TC-HC6-05', 'Take-away Tubs', ['Choco Hazelnut Tub', 'Mint Cloud Tub']],
    ['TC-HC6-06', 'Beverages', ['Lagoon Milkshake', 'Mango Float']],
    ['TC-HC6-07', 'New Arrivals', ['Coconut Pandan Cup', 'Mint Cloud Cup']],
    ['TC-HC6-07', 'Best-Sellers', ['Choco Hazelnut Cup', 'Choco Hazelnut Tub', 'Vanilla Bean Cone']]
  ];
  for (const [id, tab, expected] of filters) {
    test(`${id} ${tab} tab lists only matching products`, async ({ page }) => {
      await page.getByRole('button', { name: tab, exact: true }).click();
      expect(await menuNames(page)).toEqual(expected);
    });
  }

  test('TC-HC6-09 tapping a card opens its options sheet', async ({ page }) => {
    await page.getByRole('button', { name: 'Customize Mint Cloud Cup' }).first().click();
    await expect(page.getByRole('heading', { name: 'Mint Cloud Cup' })).toBeVisible();
    await expect(page.getByText('Special notes')).toBeVisible();
  });

  test('TC-HC6-11 a sold-out product is greyed out and cannot be added', async ({ page }) => {
    knownGap(test, 'no sold-out state per branch');
    await expect(page.getByText('Sold out').first()).toBeVisible();
  });

  test('TC-HC7-01 price adds size and toppings (52,000đ)', async ({ page }) => {
    await page.getByRole('button', { name: 'Customize Mint Cloud Cup' }).first().click();
    await page.locator('.opt').filter({ hasText: 'Size M' }).click();
    await page.locator('.row-opt').filter({ hasText: 'Chocolate Sauce' }).click();
    await page.locator('.row-opt').filter({ hasText: 'Roasted Almonds' }).click();
    await expect(sheetAdd(page)).toContainText('52,000đ');
  });

  test('TC-HC7-02 / TC-HC7-08 tub has 400 ml and 1 litre sizes and no toppings', async ({ page }) => {
    await page.getByRole('button', { name: 'Customize Mint Cloud Tub' }).first().click();
    await expect(page.locator('.opt').filter({ hasText: '400 ml' })).toContainText('79,000đ');
    await expect(page.locator('.opt').filter({ hasText: '1 litre' })).toContainText('169,000đ');
    await expect(page.getByRole('heading', { name: 'Drizzles' })).toBeHidden();
    await expect(page.getByRole('heading', { name: 'Crunchy toppings' })).toBeHidden();
    await page.locator('.opt').filter({ hasText: '1 litre' }).click();
    await expect(sheetAdd(page)).toContainText('169,000đ');
  });

  test('TC-HC7-03 a beverage has no size choice but has toppings', async ({ page }) => {
    await page.getByRole('button', { name: 'Customize Lagoon Milkshake' }).first().click();
    await expect(page.locator('.opt')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Drizzles' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Crunchy toppings' })).toBeVisible();
  });

  test('TC-HC7-04 note stops at 100 characters', async ({ page }) => {
    await page.getByRole('button', { name: 'Customize Mint Cloud Cup' }).first().click();
    await page.locator('#note').fill('a'.repeat(101));
    await expect(page.locator('#note')).toHaveValue('a'.repeat(100));
    await expect(page.getByText('100/100')).toBeVisible();
  });

  test('TC-HC7-05 note with 99 characters keeps all of them', async ({ page }) => {
    await page.getByRole('button', { name: 'Customize Mint Cloud Cup' }).first().click();
    await page.locator('#note').fill('b'.repeat(99));
    await expect(page.locator('#note')).toHaveValue('b'.repeat(99));
    await expect(page.getByText('99/100')).toBeVisible();
  });

  test('TC-HC7-06 / TC-HC7-07 price updates live and returns to base', async ({ page }) => {
    await page.getByRole('button', { name: 'Customize Mint Cloud Cup' }).first().click();
    await expect(sheetAdd(page)).toContainText('25,000đ');
    await page.locator('.opt').filter({ hasText: 'Size L' }).click();
    await expect(sheetAdd(page)).toContainText('50,000đ');
    const sauce = page.locator('.row-opt').filter({ hasText: 'Caramel Sauce' });
    await sauce.click();
    await expect(sheetAdd(page)).toContainText('55,000đ');
    await sauce.click();
    await expect(sheetAdd(page)).toContainText('50,000đ');
  });

  test('TC-HC7-09 note keeps special and Vietnamese characters', async ({ page }) => {
    await addToCart(page, { name: 'Mint Cloud Cup', note: 'Ít đường, no nuts!' });
    await openCart(page);
    await expect(page.getByText('“Ít đường, no nuts!”')).toBeVisible();
  });

  test('TC-HC8-01 quantity multiplies the price', async ({ page }) => {
    await page.getByRole('button', { name: 'Customize Mint Cloud Cup' }).first().click();
    await page.locator('.opt').filter({ hasText: 'Size M' }).click();
    await page.locator('.row-opt').filter({ hasText: 'Chocolate Sauce' }).click();
    await page.locator('.row-opt').filter({ hasText: 'Roasted Almonds' }).click();
    await page.getByRole('button', { name: 'More' }).click();
    await expect(sheetAdd(page)).toContainText('104,000đ');
  });

  test('TC-HC8-02 / TC-HC8-05 add to cart shows a message and the cart bar adds up', async ({ page }) => {
    await addToCart(page, { name: 'Mint Cloud Cup' });
    await expect(toast(page)).toHaveText('Added to cart');
    await expect(page.getByRole('button', { name: /^View cart/ })).toContainText('1 items');
    await addToCart(page, { name: 'Matcha Mochi Cone' });
    const bar = page.getByRole('button', { name: /^View cart/ });
    await expect(bar).toContainText('2 items');
    await expect(bar).toContainText('53,000đ');
  });

  test('TC-HC8-03 / TC-HC8-06 / TC-HC8-07 different options make separate lines', async ({ page }) => {
    await addToCart(page, { name: 'Mint Cloud Cup', size: 'Size M' });
    await addToCart(page, { name: 'Mint Cloud Cup', size: 'Size L' });
    await addToCart(page, { name: 'Mint Cloud Cup', size: 'Size L', tops: ['Chocolate Sauce'] });
    await addToCart(page, { name: 'Mint Cloud Cup', size: 'Size L', note: 'Less sweet please' });
    await openCart(page);
    await expect(page.getByRole('button', { name: 'More' })).toHaveCount(4);
  });

  test('TC-HC8-04 quantity cannot go below 1', async ({ page }) => {
    await page.getByRole('button', { name: 'Customize Mint Cloud Cup' }).first().click();
    await page.getByRole('button', { name: 'Fewer' }).click();
    await expect(page.getByRole('button', { name: 'Fewer' }).locator('xpath=following-sibling::span')).toHaveText('1');
  });

  test('TC-HC8-08 the same product and options merge into one line', async ({ page }) => {
    knownGap(test, 'adding the same configuration twice creates two lines');
    for (let i = 0; i < 2; i++) {
      await addToCart(page, { name: 'Mint Cloud Cup', size: 'Size M', tops: ['Chocolate Sauce', 'Roasted Almonds'] });
    }
    await openCart(page);
    await expect(page.getByRole('button', { name: 'More' })).toHaveCount(1);
    await expect(page.getByText('104,000đ').first()).toBeVisible();
  });

  test('TC-HC8-09 very high quantity (99) keeps the total correct', async ({ page }) => {
    await page.getByRole('button', { name: 'Customize Mint Cloud Cup' }).first().click();
    for (let i = 1; i < 99; i++) await page.getByRole('button', { name: 'More' }).click();
    await expect(sheetAdd(page)).toContainText('2,475,000đ');
  });
});

// =====================================================================
// HC-9 / HC-10 / HC-11  Cart, delivery fee, order total (SRS IV)
// =====================================================================
test.describe('Cart and checkout totals', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); });

  test('TC-HC9-01 cart lists items with options and line totals', async ({ page }) => {
    await addToCart(page, { name: 'Mint Cloud Cup', size: 'Size M', qty: 2 });
    await openCart(page);
    await expect(page.getByText('Mint Cloud Cup').first()).toBeVisible();
    await expect(page.getByText('Size M').first()).toBeVisible();
    await expect(page.getByText('80,000đ').first()).toBeVisible();
  });

  test('TC-HC9-02 / TC-HC9-05 plus and minus change quantity and total', async ({ page }) => {
    await addToCart(page, { name: 'Mint Cloud Cup' });
    await addToCart(page, { name: 'Matcha Mochi Cone' });
    await openCart(page);
    await page.getByRole('button', { name: 'More' }).first().click();
    expect((await readSummary(page)).Items).toBe('78,000đ');
    await page.getByRole('button', { name: 'Fewer' }).first().click();
    expect((await readSummary(page)).Items).toBe('53,000đ');
    await page.getByRole('button', { name: 'Fewer' }).first().click();
    expect((await readSummary(page)).Items).toBe('28,000đ');
  });

  test('TC-HC9-03 / TC-HC9-04 minus on quantity 1 removes the item; empty cart cannot be placed', async ({ page }) => {
    await addToCart(page, { name: 'Mint Cloud Cup' });
    await openCart(page);
    await page.getByRole('button', { name: 'Fewer' }).click();
    await expect(page.getByText('Your cart is empty')).toBeVisible();
    await expect(placeOrder(page)).toHaveCount(0);
  });

  test('TC-HC9-06 many taps on plus keep quantity and total correct', async ({ page }) => {
    await addToCart(page, { name: 'Mint Cloud Cup' });
    await openCart(page);
    for (let i = 0; i < 20; i++) await page.getByRole('button', { name: 'More' }).click();
    expect((await readSummary(page)).Items).toBe('525,000đ');
  });

  test('TC-HC9-08 the cart survives a page refresh', async ({ page }) => {
    await addToCart(page, { name: 'Mint Cloud Cup' });
    await page.reload();
    await expect(page.getByText('Sign in to start scooping.')).toBeHidden();
    await nav(page, 'Menu').click(); // the open tab is not kept, and the cart bar only shows on Menu
    await expect(page.getByRole('button', { name: /^View cart/ })).toBeVisible();
  });

  test('TC-HC10-01 / TC-HC10-14 fee under 2 km is 15,000đ and changes with the address', async ({ page }) => {
    await checkoutWith(page, { address: 'Home' });
    expect((await readSummary(page))['Delivery fee']).toBe('15,000đ');
    await page.locator('.row-opt').filter({ hasText: 'Office' }).click();
    expect((await readSummary(page))['Delivery fee']).toBe('25,000đ');
  });

  test('TC-HC10-13 pick a saved address (Office, Bitexco Tower)', async ({ page }) => {
    await checkoutWith(page, { address: 'Office' });
    const office = page.locator('.row-opt.on').filter({ hasText: 'Office' });
    await expect(office).toContainText('Bitexco Tower, District 1');
    await expect(office).toContainText('4.2 km');
  });

  test('TC-HC10-08 an address 11.8 km away is outside coverage and blocks the order', async ({ page }) => {
    await checkoutWith(page, { address: 'Parents' });
    await expect(page.getByRole('alert')).toHaveText('Sorry, this address is outside our 10km delivery coverage.');
    await expect(page.getByRole('button', { name: /Can.t place this order yet/ })).toBeDisabled();
  });

  test('TC-HC11-01 delivery total with packaging and fee (85,000 + 10,000 + 25,000 = 120,000đ)', async ({ page }) => {
    await addToCart(page, { name: 'Mint Cloud Cup', size: 'Size M' });
    await addToCart(page, { name: 'Mango Sunrise Cone', size: 'Size M', tops: ['Chocolate Sauce'] });
    await openCart(page);
    await page.locator('.row-opt').filter({ hasText: 'Office' }).click();
    expect(await readSummary(page)).toMatchObject({ Items: '85,000đ', 'Insulated packaging': '10,000đ', 'Delivery fee': '25,000đ', Total: '120,000đ' });
    await expect(page.getByText('85,000đ + 10,000đ + 25,000đ = 120,000đ')).toBeVisible();
  });

  test('TC-HC11-02 pick-up with a tub (79,000 + 10,000 + 0 = 89,000đ)', async ({ page }) => {
    await checkoutWith(page, { name: 'Mint Cloud Tub', size: '400 ml', type: 'Pick-up' });
    expect(await readSummary(page)).toMatchObject({ Items: '79,000đ', 'Insulated packaging': '10,000đ', 'Delivery fee': '0đ', Total: '89,000đ' });
  });

  test('TC-HC11-03 / TC-HC11-06 delivery under the minimum is blocked; fees do not count', async ({ page }) => {
    await checkoutWith(page, { size: 'Size S', address: 'Office' });
    await expect(page.getByRole('alert')).toHaveText('Delivery orders start at 30,000đ. Add 5,000đ more to continue.');
    await expect(page.getByRole('button', { name: /Can.t place this order yet/ })).toBeDisabled();
    expect((await readSummary(page)).Total).toBe('60,000đ');
  });

  test('TC-HC11-04 delivery exactly at the 30,000đ minimum can be placed', async ({ page }) => {
    await checkoutWith(page, { size: 'Size S', tops: ['Chocolate Sauce'], address: 'Home' });
    expect((await readSummary(page)).Items).toBe('30,000đ');
    await expect(page.getByRole('alert')).toHaveCount(0);
    await expect(placeOrder(page)).toBeEnabled();
  });

  test('TC-HC11-07 / TC-HC13-06 pick-up has no minimum', async ({ page }) => {
    await checkoutWith(page, { name: 'Vanilla Bean Cone', size: 'Size S', type: 'Pick-up' });
    expect((await readSummary(page)).Items).toBe('22,000đ');
    await expect(placeOrder(page)).toBeEnabled();
    await placeOrder(page).click();
    await expect(page.getByRole('heading', { name: /^Order HC-\d+$/ })).toBeVisible();
  });

  test('TC-HC11-08 no packaging fee on a short delivery without a tub (1.4 km)', async ({ page }) => {
    await checkoutWith(page, { address: 'Home' });
    expect((await readSummary(page))['Insulated packaging']).toBeUndefined();
    await expect(page.getByText('Insulated packaging')).toHaveCount(0);
  });

  test('TC-HC11-09 packaging fee is added over 3 km (4.2 km)', async ({ page }) => {
    await checkoutWith(page, { address: 'Office' });
    expect((await readSummary(page))['Insulated packaging']).toBe('10,000đ');
    await expect(page.getByText('Dry-ice packaging for deliveries over 3 km.')).toBeVisible();
  });

  test('TC-HC11-10 packaging is charged once for several tubs', async ({ page }) => {
    await addToCart(page, { name: 'Mint Cloud Tub', size: '400 ml' });
    await addToCart(page, { name: 'Choco Hazelnut Tub', size: '400 ml' });
    await openCart(page);
    await page.getByRole('button', { name: 'Pick-up', exact: true }).click();
    expect(await readSummary(page)).toMatchObject({ 'Insulated packaging': '10,000đ', Total: '174,000đ' });
  });

  test('TC-HC11-11 / TC-HC11-13 a tub on a delivery adds packaging once', async ({ page }) => {
    await checkoutWith(page, { name: 'Mint Cloud Tub', size: '400 ml', address: 'Home' });
    expect(await readSummary(page)).toMatchObject({ 'Insulated packaging': '10,000đ', 'Delivery fee': '15,000đ', Total: '104,000đ' });
    await page.locator('.row-opt').filter({ hasText: 'Office' }).click();
    expect(await readSummary(page)).toMatchObject({ 'Insulated packaging': '10,000đ', Total: '114,000đ' });
  });

  test('TC-HC11-12 cups only on pick-up: no packaging and no delivery fee', async ({ page }) => {
    await checkoutWith(page, { qty: 2, type: 'Pick-up' });
    await expect(page.getByText('Insulated packaging')).toHaveCount(0);
    expect((await readSummary(page))['Delivery fee']).toBe('0đ');
  });

  test('TC-HC11-14 money format uses a thousands separator and đ', async ({ page }) => {
    await checkoutWith(page, { address: 'Office' });
    for (const v of Object.values(await readSummary(page))) expect(v).toMatch(/^\d{1,3}(,\d{3})*đ$/);
  });

  test('TC-HC10-10 a typed address is accepted', async ({ page }) => {
    knownGap(test, 'checkout offers saved addresses only, there is no address field');
    await checkoutWith(page);
    await expect(page.getByLabel(/address/i)).toBeVisible();
  });

  test('TC-HC10-09 delivery is disabled when the nearest branch is closed', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-11-05T23:00:00'));
    await checkoutWith(page, { type: null });
    await expect(page.getByRole('button', { name: 'Delivery', exact: true })).toBeDisabled();
    await expect(page.getByRole('alert')).toContainText('Next opening: 08:00');
  });
});

// =====================================================================
// HC-12  Payment (SRS IV.1) and HC-13 / HC-14 Pick-up (SRS V)
// =====================================================================
test.describe('Payment and pick-up', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); });

  test('TC-HC12-01 four payment methods', async ({ page }) => {
    await checkoutWith(page);
    for (const m of ['Cash on delivery', 'MoMo wallet', 'Bank QR (VietQR)', 'Visa / Mastercard']) {
      await expect(page.locator('.row-opt').filter({ hasText: m })).toBeVisible();
    }
    await expect(page.locator('.row-opt').filter({ hasText: 'VNPay' })).toBeVisible();
  });

  test('TC-HC12-02 / TC-HC17-09 cash on delivery starts at Received with no countdown', async ({ page }) => {
    await place(page, { pay: 'Cash on delivery' });
    await expect(page.getByText(/Pay .* within 10 minutes/)).toBeHidden();
    await expect(page.locator('.now')).toContainText('Received');
  });

  for (const [id, method] of [['TC-HC12-03', 'MoMo wallet'], ['TC-HC12-07', 'Bank QR (VietQR)'], ['TC-HC12-08', 'Visa / Mastercard']]) {
    test(`${id} ${method} shows a 10:00 countdown`, async ({ page }) => {
      await place(page, { pay: method });
      await expect(page.getByText('10:00').or(page.getByText('09:59'))).toBeVisible();
      await expect(page.getByText(/within 10 minutes or this order is cancelled automatically/)).toBeVisible();
    });
  }

  test('TC-HC12-04 / TC-HC12-06 paying in time moves the order to Received', async ({ page }) => {
    await place(page, { pay: 'MoMo wallet' });
    await page.getByRole('button', { name: 'Demo: payment received' }).click();
    await expect(page.locator('.now')).toContainText('Received');
    await expect(page.getByText('Awaiting payment')).toBeHidden();
  });

  test('TC-HC12-05 / TC-HC12-12 no payment for 10 minutes cancels the order for good @clock', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-11-09T10:00:00') });
    await page.reload(); // already signed in by beforeEach and kept in storage; reload so the app runs on the new clock
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
    await place(page, { pay: 'MoMo wallet' });
    await page.clock.runFor('10:02');
    await expect(page.getByText('Order cancelled', { exact: true }).first()).toBeVisible();
    await expect(page.getByText("We didn't get your payment in 10 minutes, so we cancelled this order.")).toBeVisible();
    await expect(page.getByRole('button', { name: 'Demo: payment received' })).toHaveCount(0);
  });

  test('TC-HC12-09 a declined card keeps the order unpaid', async ({ page }) => {
    knownGap(test, 'no card-decline flow in the mock-up');
    await place(page, { pay: 'Visa / Mastercard' });
    await expect(page.getByRole('alert')).toContainText(/declined/i);
  });

  test('TC-HC12-10 the countdown continues after leaving the payment screen @clock', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-11-09T10:00:00') });
    await page.reload(); // already signed in by beforeEach and kept in storage; reload so the app runs on the new clock
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
    await place(page, { pay: 'MoMo wallet' });
    await page.clock.runFor('02:00');
    await backFromTracking(page);
    await nav(page, 'Account').click();
    await page.getByRole('button', { name: /Track this order/ }).click();
    await expect(page.getByText(/^0[78]:[0-5]\d$/)).toBeVisible();
  });

  test('TC-HC13-01 / TC-HC13-05 pick-up shows branches, 15-minute slots and no delivery fee', async ({ page }) => {
    await checkoutWith(page, { type: 'Pick-up' });
    await expect(page.getByRole('heading', { name: 'Pick up at' })).toBeVisible();
    await expect(page.locator('.row-opt').filter({ hasText: 'Happy Creamy Nguyen Hue' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pick-up time' })).toBeVisible();
    expect((await readSummary(page))['Delivery fee']).toBe('0đ');
  });

  test('TC-HC13-02 slots are 15 minutes apart; TC-HC13-13 only today is offered', async ({ page }) => {
    await checkoutWith(page, { type: 'Pick-up' });
    const slots = await page.locator('.chip').allTextContents();
    const mins = slots.filter((t) => /^\d\d:\d\d$/.test(t)).map((t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3)));
    expect(mins.length).toBeGreaterThan(1);
    mins.slice(1).forEach((m, i) => expect(m - mins[i]).toBe(15));
    await expect(page.getByText('Slots are 15 minutes long.')).toBeVisible();
    await expect(page.getByText(/tomorrow/i)).toHaveCount(0);
  });

  test('TC-HC13-07 choosing a branch and a slot marks them selected', async ({ page }) => {
    await checkoutWith(page, { type: 'Pick-up' });
    await page.locator('.row-opt').filter({ hasText: 'Thao Dien' }).click();
    await expect(page.locator('.row-opt.on').filter({ hasText: 'Thao Dien' })).toHaveCount(1);
    await page.getByRole('button', { name: '11:00', exact: true }).click();
    await expect(page.getByRole('button', { name: '11:00', exact: true })).toHaveClass(/\bon\b/);
  });

  test('TC-HC13-10 / TC-HC13-11 slots are at least 30 minutes away', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2026-11-05T10:01:00'));
    await checkoutWith(page, { type: 'Pick-up' });
    await expect(page.getByRole('button', { name: '10:30', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: '10:45', exact: true })).toBeVisible();
  });

  test('TC-HC14-01 / TC-HC14-03 / TC-HC14-05 pick-up status flow, then Order History', async ({ page }) => {
    await place(page, { type: 'Pick-up' });
    await expect(page.locator('.now')).toContainText('Received');
    await advance(page);
    await expect(page.locator('.now')).toContainText('Preparing');
    await expect(page.locator('.now')).not.toContainText('Ready for pick-up');
    await advance(page);
    await expect(page.locator('.now')).toContainText('Ready for pick-up');
    await advance(page);
    await expect(page.locator('.done').last()).toContainText('Completed');
    await backFromTracking(page);
    await openHistory(page);
    await expect(page.getByText('Pick-up · Completed · Today')).toBeVisible();
  });
});

// =====================================================================
// HC-15 / HC-16  Stores (SRS V, Tab 3)
// =====================================================================
test.describe('Stores', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); await nav(page, 'Stores').click(); });

  test('TC-HC15-01 map and branch list with address and distance', async ({ page }) => {
    await expect(page.getByRole('img', { name: /Map showing three Happy Creamy shops/ })).toBeVisible();
    await expect(page.getByText('Happy Creamy Nguyen Hue')).toBeVisible();
    await expect(page.getByText('12 Nguyen Hue, District 1')).toBeVisible();
    await expect(page.getByText('1.2 km')).toBeVisible();
    await expect(page.getByText('Open daily 08:00 to 22:00')).toHaveCount(3);
  });

  test('TC-HC15-02 / TC-HC15-03 live status shows Open now and Closing soon', async ({ page }) => {
    await expect(page.locator('.bd', { hasText: 'Open now' })).toHaveCount(3);
    await page.clock.setFixedTime(new Date('2026-11-09T21:45:00'));
    await nav(page, 'Home').click();
    await nav(page, 'Stores').click();
    await expect(page.locator('.bd', { hasText: 'Closing soon' })).toHaveCount(3);
  });

  test('TC-HC15-06 tapping a branch highlights it', async ({ page }) => {
    const second = page.locator('div.card').filter({ hasText: 'Happy Creamy Thao Dien' });
    await second.getByRole('button').first().click();
    await expect(second).toHaveClass(/\bsel\b/);
    await expect(page.locator('div.card.sel')).toHaveCount(1);
  });

  test('TC-HC16-01 Get directions opens Google Maps', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Get directions' }).first()).toHaveAttribute('href', /google\.com\/maps/);
  });

  test('TC-HC16-02 Call store is a phone link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Call store' }).first()).toHaveAttribute('href', /^tel:/);
  });

  test('TC-HC16-03 each branch uses its own address for directions', async ({ page }) => {
    knownGap(test, 'every branch links to the same generic Google Maps URL');
    const hrefs = await page.getByRole('link', { name: 'Get directions' }).evaluateAll((a) => a.map((x) => x.getAttribute('href')));
    expect(new Set(hrefs).size).toBe(3);
  });

  test('TC-HC16-04 each branch uses its own hotline', async ({ page }) => {
    knownGap(test, 'Call store links are "tel:" with no number');
    const hrefs = await page.getByRole('link', { name: 'Call store' }).evaluateAll((a) => a.map((x) => x.getAttribute('href')));
    for (const h of hrefs) expect(h).toMatch(/^tel:\+?\d{6,}/);
    expect(new Set(hrefs).size).toBe(3);
  });
});

// =====================================================================
// HC-17 / HC-19  Order tracking and history (SRS V, Tab 4)
// =====================================================================
test.describe('Order tracking and history', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); });

  test('TC-HC17-04 no active order shows an empty state with a button to the menu', async ({ page }) => {
    await nav(page, 'Account').click();
    await expect(page.getByText('No orders on the way')).toBeVisible();
    await page.getByRole('button', { name: 'Browse the menu' }).click();
    await expect(page.getByRole('heading', { name: 'Menu', exact: true })).toBeVisible();
  });

  test('TC-HC17-01 / TC-HC17-05 delivery timeline and moving steps', async ({ page }) => {
    await place(page, {});
    for (const l of ['Received', 'Preparing', 'Out for delivery', 'Completed']) {
      await expect(page.getByText(l, { exact: true }).first()).toBeVisible();
    }
    await expect(page.locator('.now')).toContainText('Received');
    await advance(page);
    await expect(page.locator('.now')).toContainText('Preparing');
    await expect(page.locator('.done')).toHaveCount(1);
    await advance(page);
    await expect(page.locator('.now')).toContainText('Out for delivery');
  });

  test('TC-HC17-02 pick-up timeline', async ({ page }) => {
    await place(page, { type: 'Pick-up' });
    for (const l of ['Received', 'Preparing', 'Ready for pick-up', 'Completed']) {
      await expect(page.getByText(l, { exact: true }).first()).toBeVisible();
    }
    await expect(page.getByText('Out for delivery')).toHaveCount(0);
  });

  test('TC-HC17-03 an unpaid online order shows Awaiting payment in Active orders', async ({ page }) => {
    await place(page, { pay: 'MoMo wallet' });
    await backFromTracking(page);
    await nav(page, 'Account').click();
    await expect(page.locator('.bd', { hasText: 'Awaiting payment' })).toBeVisible();
  });

  test('TC-HC17-08 a completed order leaves Active orders and shows in Order History', async ({ page }) => {
    await place(page, {});
    await advance(page, 3);
    await backFromTracking(page);
    await nav(page, 'Account').click();
    await expect(page.getByText('No orders on the way')).toBeVisible();
    await page.getByRole('button', { name: 'Order history' }).click();
    await expect(page.getByText('Delivery · Completed · Today')).toBeVisible();
  });

  test('TC-HC17-07 several active orders are listed together', async ({ page }) => {
    knownGap(test, 'only one active order is supported');
    await place(page, {});
    await backFromTracking(page);
    await place(page, { type: 'Pick-up' });
    await backFromTracking(page);
    await nav(page, 'Account').click();
    await expect(page.getByRole('button', { name: /Track this order/ })).toHaveCount(2);
  });

  test('TC-HC17-06 / TC-HC19-06 a cancelled unpaid order leaves Active orders and is hidden from history @clock', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-11-09T10:00:00') });
    await page.reload(); // already signed in by beforeEach and kept in storage; reload so the app runs on the new clock
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
    await place(page, { pay: 'MoMo wallet' });
    await page.clock.runFor('10:02');
    await backFromTracking(page);
    await nav(page, 'Account').click();
    await expect(page.getByText('No orders on the way')).toBeVisible();
    await page.getByRole('button', { name: 'Order history' }).click();
    await expect(page.getByText(/Cancelled/)).toHaveCount(0);
  });

  test('TC-HC19-01 / TC-HC19-03 history shows number, date, type and total', async ({ page }) => {
    await openHistory(page);
    await expect(historyCard(page, 'HC-2031')).toContainText('84,000đ');
    await expect(historyCard(page, 'HC-2031')).toContainText('Delivery · Completed · 3 Nov');
    await expect(historyCard(page, 'HC-2012')).toContainText('Pick-up · Completed · 30 Oct');
    await expect(historyCard(page, 'HC-1987')).toContainText('169,000đ');
  });
});

// =====================================================================
// HC-20 / HC-21 / HC-22  Account (SRS V Tab 4, II)
// =====================================================================
test.describe('Account', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); await nav(page, 'Account').click(); });

  test('TC-HC20-01 name and email are shown', async ({ page }) => {
    await expect(page.getByText('Nhung Nguyen').first()).toBeVisible();
    await expect(page.getByText('nhung@example.com')).toBeVisible();
  });

  test('TC-HC21-02 log out returns to the sign-in screen', async ({ page }) => {
    await page.getByRole('button', { name: 'Log out' }).click();
    await expect(page.getByText('Sign in to start scooping.')).toBeVisible();
  });

  const addrRow = (page) => page.getByRole('button', { name: /^Saved addresses/ });
  const addAddress = async (page, name, line, km) => {
    await addrRow(page).click();
    await page.getByLabel('Name', { exact: true }).fill(name);
    await page.getByLabel('Address', { exact: true }).fill(line);
    await page.getByLabel(/Distance from the nearest shop/).fill(String(km));
    await page.getByRole('button', { name: 'Add address' }).click();
  };

  test('TC-HC20-02 an added saved address is listed and can be picked at checkout', async ({ page }) => {
    await nav(page, 'Account').click();
    await addAddress(page, 'Gym', '1 Le Duan, District 1', 3.5);
    await expect(page.getByText('1 Le Duan, District 1')).toBeVisible();
    await back(page).click();
    await expect(addrRow(page)).toContainText('4 saved');
    await checkoutWith(page, { address: 'Gym' });
    await expect(page.locator('.row-opt.on').filter({ hasText: 'Gym' })).toHaveCount(1);
  });

  test('TC-HC20-03 a deleted saved address is gone from the list and from checkout', async ({ page }) => {
    await nav(page, 'Account').click();
    await addrRow(page).click();
    await page.getByRole('button', { name: 'Delete Parents' }).click();
    await expect(page.getByText('Vung Tau Road, Dong Nai')).toHaveCount(0);
    await back(page).click();
    await checkoutWith(page);
    await expect(page.locator('.row-opt').filter({ hasText: 'Parents' })).toHaveCount(0);
  });

  test('TC-HC21-01 change password: the new one logs in, the old one does not', async ({ page }) => {
    await registerAccount(page, 'nhung@example.com', 'Kem12345');
    await nav(page, 'Account').click();
    await page.getByRole('button', { name: 'Change password' }).click();
    await page.getByLabel('Current password').fill('Kem12345');
    await page.getByLabel('New password').fill('Kem54321');
    await page.getByRole('button', { name: 'Save password' }).click();
    await expect(toast(page)).toHaveText('Password changed.');
    await page.getByRole('button', { name: 'Log out' }).click();
    await loginWith(page, 'nhung@example.com', 'Kem12345');
    await expect(page.getByRole('alert')).toBeVisible();
    await loginWith(page, 'nhung@example.com', 'Kem54321');
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC21-07 a Google or Facebook user has no Change password', async ({ page }) => {
    await expect(page.getByText('Password', { exact: true })).toHaveCount(0);
  });

  test('TC-HC22-01 switching to Vietnamese shows Vietnamese', async ({ page }) => {
    await page.getByRole('button', { name: 'Tiếng Việt' }).click();
    await expect(page.getByRole('heading', { name: 'Tài khoản' })).toBeVisible();
    await expect(nav(page, 'Thực đơn')).toBeVisible();
  });

  test('TC-HC22-06 a new user starts in Vietnamese', async ({ page }) => {
    knownGap(test, 'the mock-up starts in English so that the other tests can run in English; the spec says new users start in Vietnamese');
    await expect(page.getByRole('heading', { name: 'Tài khoản' })).toBeVisible();
  });
});

// =====================================================================
// HC-23  Feedback (Feedback spec, SRS V)
// =====================================================================
test.describe('Feedback', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); await openHistory(page); });

  const openForm = async (page, id) => {
    await historyCard(page, id).getByRole('button', { name: 'Rate this order' }).click();
    await expect(page.getByRole('heading', { name: 'Rate your order' })).toBeVisible();
  };
  const send = (page) => page.getByRole('button', { name: 'Send feedback' });
  const star = (page, n) => page.getByRole('button', { name: new RegExp('^' + n + ' stars?:') });

  test('TC-HC23-01 / TC-HC23-02 rating window: button inside 7 days, message after', async ({ page }) => {
    await expect(historyCard(page, 'HC-2012').getByRole('button', { name: 'Rate this order' })).toBeVisible();
    await expect(historyCard(page, 'HC-2012')).toContainText('1 day left to rate');
    await expect(historyCard(page, 'HC-1987').getByRole('button', { name: 'Rate this order' })).toHaveCount(0);
    await expect(historyCard(page, 'HC-1987')).toContainText('The 7-day window to rate this order has ended.');
  });

  test('TC-HC23-03 Send is disabled without a star rating', async ({ page }) => {
    await openForm(page, 'HC-2031');
    await expect(send(page)).toBeDisabled();
    await expect(page.getByText('Choose a star rating to continue.')).toBeVisible();
  });

  test('TC-HC23-05 rating labels for stars 1 to 5', async ({ page }) => {
    await openForm(page, 'HC-2031');
    const expected = { 1: 'Very bad', 2: 'Bad', 3: 'Okay', 4: 'Good', 5: 'Great' };
    for (const [n, label] of Object.entries(expected)) {
      await star(page, n).click();
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test('TC-HC23-04 four stars: 4 filled, "Good", six positive options', async ({ page }) => {
    await openForm(page, 'HC-2031');
    await star(page, 4).click();
    await expect(page.locator('.star.on')).toHaveCount(4);
    expect(await fbChips(page).allTextContents()).toEqual(['Delicious flavor', 'Smooth & creamy', 'Arrived cold & frozen', 'Great packaging', 'Fast delivery', 'Friendly driver']);
  });

  test('TC-HC23-06 two stars: six problem options with the matrix names', async ({ page }) => {
    await openForm(page, 'HC-2031');
    await star(page, 2).click();
    expect(await fbChips(page).allTextContents()).toEqual(['Melted on arrival', 'Too sweet / Too icy', 'Wrong item / Missing toppings', 'Slow delivery', 'Messy packaging', 'Unfriendly driver']);
  });

  test('TC-HC23-06 two stars on a delivery order show six problem options (count)', async ({ page }) => {
    await openForm(page, 'HC-2031');
    await star(page, 2).click();
    await expect(fbChips(page)).toHaveCount(6);
  });

  test('TC-HC23-24 three stars show the problem options only', async ({ page }) => {
    await openForm(page, 'HC-2031');
    await star(page, 3).click();
    await expect(fbChips(page)).toHaveCount(6);
  });

  test('TC-HC23-08 changing the rating clears the picked options', async ({ page }) => {
    await openForm(page, 'HC-2031');
    await star(page, 5).click();
    await fbChips(page).nth(0).click();
    await fbChips(page).nth(1).click();
    await expect(pickedChips(page)).toHaveCount(2);
    await star(page, 2).click();
    await expect(fbChips(page)).toHaveCount(6);
    await expect(pickedChips(page)).toHaveCount(0);
  });

  test('TC-HC23-07 pick-up order hides the delivery-trip options', async ({ page }) => {
    await openForm(page, 'HC-2012');
    await star(page, 1).click();
    for (const hidden of ['Slow delivery', 'Melted on arrival']) await expect(page.getByRole('button', { name: hidden })).toHaveCount(0);
    await star(page, 5).click();
    await expect(page.getByRole('button', { name: 'Fast delivery' })).toHaveCount(0);
  });

  test('TC-HC23-10 comment stops at 500 characters', async ({ page }) => {
    await openForm(page, 'HC-2031');
    await page.locator('#fbc').fill('c'.repeat(499));
    await page.locator('#fbc').pressSequentially('dd');
    await expect(page.locator('#fbc')).toHaveValue('c'.repeat(499) + 'd');
    await expect(page.getByText('500/500')).toBeVisible();
  });

  test('TC-HC23-11 / TC-HC23-19 send with stars only (comment optional)', async ({ page }) => {
    await openForm(page, 'HC-2031');
    await star(page, 5).click();
    await send(page).click();
    await expect(toast(page)).toHaveText('Thanks! Your feedback has been sent.');
    await expect(historyCard(page, 'HC-2031').getByText('Feedback sent')).toBeVisible();
  });

  test('TC-HC23-12 / TC-HC23-13 / TC-HC23-23 up to 3 photos, a 4th is refused, photos can be removed', async ({ page }) => {
    await openForm(page, 'HC-2031');
    const add = page.getByRole('button', { name: 'Add photo' });
    for (let i = 0; i < 3; i++) await add.click();
    await expect(page.locator('.ph')).toHaveCount(3);
    await add.click();
    await expect(page.getByRole('alert')).toHaveText('You can add up to 3 photos.');
    await expect(page.locator('.ph')).toHaveCount(3);
    await page.getByRole('button', { name: 'Remove photo 1' }).click();
    await expect(page.locator('.ph')).toHaveCount(2);
    await add.click();
    await expect(page.locator('.ph')).toHaveCount(3);
  });

  test('TC-HC23-14 a photo over 5 MB is refused with no thumbnail', async ({ page }) => {
    await openForm(page, 'HC-2031');
    await page.getByRole('button', { name: 'Demo: try a 6 MB file' }).click();
    await expect(page.getByRole('alert')).toHaveText('This photo is larger than 5 MB. Choose a smaller one.');
    await expect(page.locator('.ph')).toHaveCount(0);
    await expect(page.getByText('JPG, PNG or WebP, up to 5 MB each.')).toBeVisible();
  });

  test('TC-HC23-16 a PDF is refused as a photo', async ({ page }) => {
    knownGap(test, 'photos are simulated; there is no file picker or type check');
    await openForm(page, 'HC-2031');
    await expect(page.locator('input[type=file]')).toHaveCount(1);
    await page.locator('input[type=file]').setInputFiles({ name: 'menu.pdf', mimeType: 'application/pdf', buffer: Buffer.from('x') });
    await expect(page.getByRole('alert')).toHaveText('Use a JPG, PNG or WebP photo.');
  });

  test('TC-HC23-18 / TC-HC23-20 full feedback is sent once and cannot be sent again', async ({ page }) => {
    await openForm(page, 'HC-2031');
    await star(page, 2).click();
    await page.getByRole('button', { name: 'Slow Delivery' }).click();
    await page.locator('#fbc').fill('Melted a bit');
    await page.getByRole('button', { name: 'Add photo' }).click();
    await send(page).click();
    await expect(toast(page)).toHaveText('Thanks! Your feedback has been sent.');
    await expect(historyCard(page, 'HC-2031').getByText('Feedback sent')).toBeVisible();
    await expect(historyCard(page, 'HC-2031').getByRole('button', { name: 'Rate this order' })).toHaveCount(0);
  });

  test('TC-HC23-22 a network failure on send keeps the form and shows an error', async ({ page }) => {
    knownGap(test, 'sending is simulated; there is no network call to fail');
    await openForm(page, 'HC-2031');
    await star(page, 4).click();
    await page.context().setOffline(true);
    await send(page).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });
});

// =====================================================================
// HC-18 / HC-24 / HC-25 / HC-26 / HC-27  Notifications
// =====================================================================
test.describe('Notifications', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); });

  test('TC-HC25-01 the bell is in the header of Home, Menu, Stores and Account', async ({ page }) => {
    for (const tab of ['Home', 'Menu', 'Stores', 'Account']) {
      await nav(page, tab).click();
      await expect(bell(page)).toBeVisible();
    }
  });

  test('TC-HC25-02 / TC-HC25-12 badge shows the unread count and the bell reads it', async ({ page }) => {
    const n = await bellUnread(page);
    expect(n).toBeGreaterThan(0);
    await expect(page.locator('.badge')).toHaveText(String(n));
    await expect(bell(page)).toHaveAttribute('aria-label', `Notifications, ${n} unread`);
    await bell(page).focus();
    await expect(bell(page)).toBeFocused();
  });

  test('TC-HC25-05 / TC-HC25-06 list opens newest first with unread dots, icon, message, order number and time', async ({ page }) => {
    await bell(page).click();
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeVisible();
    const items = notifItems(page);
    await expect(items).toHaveCount(3);
    await expect(items.first()).toContainText('HC-2031');
    await expect(items.first()).toContainText('2 days ago');
    await expect(items.first()).toContainText('Order Delivered! 🍦');
    await expect(items.first()).toContainText('How was your ice cream? Leave a quick review to help us serve you better!');
    await expect(items.first().locator('svg').first()).toBeVisible();
    await expect(items.first().locator('.sr')).toHaveText('Unread');
    await expect(items.last().locator('.sr')).toHaveCount(0);
  });

  test('TC-HC25-09 the list closes with Back and the screen underneath is unchanged', async ({ page }) => {
    await nav(page, 'Menu').click();
    await bell(page).click();
    await back(page).click();
    await expect(page.getByRole('heading', { name: 'Notifications' })).toBeHidden();
    await expect(page.getByRole('heading', { name: 'Menu', exact: true })).toBeVisible();
  });

  test('TC-HC26-06 / TC-HC26-07 / TC-HC26-08 mark all as read clears the badge; items stay listed', async ({ page }) => {
    await bell(page).click();
    await page.getByRole('button', { name: 'Mark all as read' }).click();
    await expect(page.locator('.card.unread')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Mark all as read' })).toHaveCount(0);
    await expect(notifItems(page)).toHaveCount(3);
    await back(page).click();
    await expect(page.locator('.badge')).toHaveCount(0);
    await expect(bell(page)).toHaveAttribute('aria-label', 'Notifications');
  });

  test('TC-HC24-03 / TC-HC26-03 tapping a feedback item marks it read and opens the form', async ({ page }) => {
    const before = await bellUnread(page);
    await bell(page).click();
    await notifItems(page).first().click();
    await expect(page.getByRole('heading', { name: 'Rate your order' })).toBeVisible();
    await expect(page.getByText('HC-2031').first()).toBeVisible();
    await back(page).click();
    expect(await bellUnread(page)).toBe(before - 1);
  });

  test('TC-HC26-04 / TC-HC24-11 a feedback item for a rated order shows Feedback sent and no form', async ({ page }) => {
    await openHistory(page);
    await historyCard(page, 'HC-2031').getByRole('button', { name: 'Rate this order' }).click();
    await page.getByRole('button', { name: /^5 stars/ }).click();
    await page.getByRole('button', { name: 'Send feedback' }).click();
    await bell(page).click();
    await notifItems(page).first().click();
    await expect(page.getByRole('heading', { name: 'Rate your order' })).toBeHidden();
    await expect(historyCard(page, 'HC-2031').getByText('Feedback sent')).toBeVisible();
  });

  test('TC-HC26-05 / TC-HC24-10 a feedback item after the 7-day window opens Order History with the window-ended message', async ({ page }) => {
    await bell(page).click();
    await notifItems(page).last().click();
    await expect(page.getByRole('heading', { name: 'Rate your order' })).toBeHidden();
    await expect(page.getByRole('button', { name: 'Order history' })).toHaveClass(/\bon\b/);
    await expect(historyCard(page, 'HC-1987')).toContainText('The 7-day window to rate this order has ended.');
  });

  test('TC-HC18-01 / TC-HC18-08 / TC-HC26-01 a status change adds an unread item; tapping it opens Active orders', async ({ page }) => {
    await place(page, {});
    await advance(page);
    await backFromTracking(page);
    const unread = await bellUnread(page);
    await bell(page).click();
    await expect(notifItems(page).first()).toContainText('Preparing your order');
    await expect(notifItems(page).first()).toHaveClass(/unread/);
    await notifItems(page).first().click();
    await expect(page.getByRole('button', { name: 'Active orders' })).toHaveClass(/\bon\b/);
    await expect(page.getByRole('button', { name: /Track this order/ })).toBeVisible();
    expect(await bellUnread(page)).toBe(unread - 1);
  });

  test('TC-HC18-13 status item texts match the matrix', async ({ page }) => {
    knownGap(test, 'texts are "Order received", "Preparing your order", "Out for delivery" instead of "We got your order HC-…", "Your order HC-… is being prepared.", "… is on its way."');
    await place(page, {});
    await advance(page, 2);
    await backFromTracking(page);
    await bell(page).click();
    const texts = (await notifItems(page).allTextContents()).join('|');
    expect(texts).toMatch(/We got your order HC-\d+\./);
    expect(texts).toMatch(/Your order HC-\d+ is being prepared\./);
    expect(texts).toMatch(/Your order HC-\d+ is on its way\./);
  });

  test('TC-HC24-07 / TC-HC24-12 / TC-HC18-09 no feedback item before Completed; at Completed only the feedback item', async ({ page }) => {
    await place(page, {});
    const id = await orderId(page);
    await advance(page, 2);
    await backFromTracking(page);
    await bell(page).click();
    const mine = () => notifItems(page).filter({ hasText: id });
    await expect(mine()).toHaveCount(3);
    await expect(mine().filter({ hasText: 'Order Delivered!' })).toHaveCount(0);
    await back(page).click();
    await nav(page, 'Account').click();
    await page.getByRole('button', { name: /Track this order/ }).click();
    await advance(page);
    await backFromTracking(page);
    await bell(page).click();
    await expect(mine()).toHaveCount(4);
    await expect(notifItems(page).first()).toContainText('Order Delivered! 🍦');
    await expect(notifItems(page).first()).toContainText('How was your ice cream? Leave a quick review to help us serve you better!');
    await expect(mine().filter({ hasText: 'Order Delivered!' })).toHaveCount(1);
    await expect(mine().filter({ hasText: /Completed/ })).toHaveCount(0);
  });

  test('TC-HC24-14 / TC-HC27-03 a push banner shows when push is on and opens the feedback form', async ({ page }) => {
    await place(page, {});
    await advance(page, 3);
    await expect(pushBanner(page)).toBeVisible();
    await expect(pushBanner(page)).toContainText('Order Delivered! 🍦');
    await pushBanner(page).click();
    await expect(page.getByRole('heading', { name: 'Rate your order' })).toBeVisible();
  });

  test('TC-HC27-01 / TC-HC27-08 the push switch is on by default and has a clear name and state', async ({ page }) => {
    await nav(page, 'Account').click();
    const sw = page.getByRole('switch', { name: 'Push notifications' });
    await expect(sw).toBeVisible();
    await expect(sw).toBeChecked();
  });

  test('TC-HC27-02 / TC-HC25-08 / TC-HC18-11 push off: no banner, but the bell list still gets the item', async ({ page }) => {
    await nav(page, 'Account').click();
    await page.getByRole('switch', { name: 'Push notifications' }).click();
    await expect(page.getByRole('switch', { name: 'Push notifications' })).not.toBeChecked();
    await expect(toast(page)).toHaveText('Push notifications off');
    await place(page, {});
    await expect(pushBanner(page)).toHaveCount(0);
    await advance(page);
    await expect(pushBanner(page)).toHaveCount(0);
    await backFromTracking(page);
    await bell(page).click();
    await expect(notifItems(page)).toHaveCount(5);
    await expect(notifItems(page).first()).toHaveClass(/unread/);
  });

  test('TC-HC27-04 there are no settings inside the bell list', async ({ page }) => {
    await bell(page).click();
    await expect(page.getByRole('switch')).toHaveCount(0);
    await expect(page.getByText(/Push notifications/)).toHaveCount(0);
  });

  test('TC-HC27-06 the switch is remembered after log out and in', async ({ page }) => {
    await nav(page, 'Account').click();
    await page.getByRole('switch', { name: 'Push notifications' }).click();
    await page.getByRole('button', { name: 'Log out' }).click();
    await page.getByRole('button', { name: /Continue with Google/ }).click();
    await nav(page, 'Account').click();
    await expect(page.getByRole('switch', { name: 'Push notifications' })).not.toBeChecked();
  });

  test('TC-HC18-12 / TC-HC24-09 a cancelled unpaid order adds a cancel item and no feedback item @clock', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-11-09T10:00:00') });
    await page.reload(); // already signed in by beforeEach and kept in storage; reload so the app runs on the new clock
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
    await place(page, { pay: 'MoMo wallet' });
    await page.clock.runFor('10:02');
    await backFromTracking(page);
    await bell(page).click();
    await expect(notifItems(page).first()).toContainText(/We didn't get your payment in 10 minutes, so we cancelled order HC-\d+\./);
    await expect(notifItems(page).filter({ hasText: 'Order Delivered!' })).toHaveCount(2); // the 2 seeded delivery items only
  });

  test('TC-HC25-04 the badge stays readable above 9 unread', async ({ page }) => {
    for (let i = 0; i < 2; i++) {
      await place(page, { pay: 'Cash on delivery' });
      await advance(page, 3);
      await backFromTracking(page);
    }
    expect(await bellUnread(page)).toBeGreaterThan(9);
    await expect(page.locator('.badge')).toHaveText('9+');
  });
});

// =====================================================================
// Authentication (HC-1, HC-2, HC-3)
// =====================================================================
test.describe('Authentication (more cases)', () => {
  test('TC-HC1-04 a returning Google user keeps the same account', async () => { manual('needs a real Google account and a backend; the mock-up has no accounts'); });
  test('TC-HC1-05 closing the Google window leaves the user signed out', async () => { manual('needs the real Google pop-up'); });
  test('TC-HC1-06 closing the Facebook window leaves the user signed out', async () => { manual('needs the real Facebook pop-up'); });
  test('TC-HC1-07 network lost during Google sign-in shows an error', async () => { manual('the mock-up signs in locally with no network call'); });
  test('TC-HC1-08 Google sign-in with an email already used for sign-up reaches the same account', async () => { manual('needs a backend with real accounts'); });

  const signUp = async (page, email = 'nhung@example.com', pw = 'Kem12345') => {
    await open(page);
    await page.getByRole('button', { name: 'New here? Create an account' }).click();
    await page.locator('#email').fill(email);
    await page.locator('#pw').fill(pw);
    await page.getByRole('button', { name: 'Create account' }).click();
  };
  const verify = async (page, code) => {
    await page.locator('#otp').fill(code);
    await page.getByRole('button', { name: 'Verify and sign in' }).click();
  };

  test('TC-HC2-07 a password of 8 characters is accepted', async ({ page }) => {
    await signUp(page);
    await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
  });

  test('TC-HC2-09 an email that is already registered is refused', async ({ page }) => {
    await registeredAndLoggedOut(page);
    await page.getByRole('button', { name: 'New here? Create an account' }).click();
    await page.locator('#email').fill('nhung@example.com');
    await page.locator('#pw').fill('Kem12345');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(alert(page)).toContainText('already in use');
    await expect(page.getByRole('heading', { name: 'Check your email' })).toBeHidden();
  });

  test('TC-HC2-12 logging in before verifying the email asks to verify first', async ({ page }) => {
    await signUp(page);
    await page.reload();
    await loginWith(page, 'nhung@example.com', 'Kem12345');
    await expect(alert(page)).toContainText('Verify your email first');
    // Home is still drawn behind the sign-in screen, so check the code screen is shown instead.
    await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Verification code' })).toBeVisible();
  });

  test('TC-HC2-13 a code entered at 9:59 is accepted @clock', async ({ page }) => {
    await page.clock.install({ time: T10 });
    await signUp(page);
    await page.clock.runFor('09:59');
    await verify(page, '123456');
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC2-14 a code entered at 10:01 is expired @clock', async ({ page }) => {
    await page.clock.install({ time: T10 });
    await signUp(page);
    await page.clock.runFor('10:01');
    await verify(page, '123456');
    await expect(alert(page)).toContainText('expired');
    await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
    await page.getByRole('button', { name: 'Send a new code' }).click();
    await verify(page, '123456');
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC2-15 the fifth wrong try locks the code', async ({ page }) => {
    await signUp(page);
    for (let i = 0; i < 5; i++) await verify(page, '000000');
    await verify(page, '123456');
    await expect(alert(page)).toContainText('Too many wrong tries');
    await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
    await page.getByRole('button', { name: 'Send a new code' }).click();
    await verify(page, '123456');
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC2-16 the correct code on the fifth try is accepted', async ({ page }) => {
    await signUp(page);
    for (let i = 0; i < 4; i++) await verify(page, '000000');
    await verify(page, '123456');
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC3-01 a reset code can be requested', async ({ page }) => {
    await registeredAndLoggedOut(page);
    const code = await requestReset(page, 'nhung@example.com');
    expect(code).toMatch(/^\d{6}$/);
    await expect(page.locator('[data-note]')).toContainText('we sent a 6-digit code to nhung@example.com');
  });

  test('TC-HC3-02 a reset with the correct code changes the password', async ({ page }) => {
    await registeredAndLoggedOut(page);
    const code = await requestReset(page, 'nhung@example.com');
    await resetWith(page, code, 'Kem54321');
    await expect(page.locator('[data-note]')).toContainText('Password changed');
    await loginWith(page, 'nhung@example.com', 'Kem54321');
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC3-03 a reset with a wrong code is refused and the password stays', async ({ page }) => {
    await registeredAndLoggedOut(page);
    await requestReset(page, 'nhung@example.com');
    await resetWith(page, '000000', 'Kem54321');
    await expect(alert(page)).toContainText('That code is not right');
    await page.getByRole('button', { name: 'Back to log in' }).click();
    await loginWith(page, 'nhung@example.com', 'Kem12345');
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC3-04 the old password no longer works after a reset', async ({ page }) => {
    await registeredAndLoggedOut(page);
    const code = await requestReset(page, 'nhung@example.com');
    await resetWith(page, code, 'Kem54321');
    await loginWith(page, 'nhung@example.com', 'Kem12345');
    await expect(alert(page)).toContainText('Email or password is not right');
    await expect(page.locator('#email')).toBeVisible(); // still on the sign-in screen
  });

  test('TC-HC3-05 a new password of 7 characters is refused', async ({ page }) => {
    await registeredAndLoggedOut(page);
    const code = await requestReset(page, 'nhung@example.com');
    await resetWith(page, code, 'Kem5432');
    await expect(alert(page)).toContainText('8 characters or more');
  });

  test('TC-HC3-06 a new password of 8 characters is accepted', async ({ page }) => {
    await registeredAndLoggedOut(page);
    const code = await requestReset(page, 'nhung@example.com');
    await resetWith(page, code, 'Kem54321');
    await expect(page.locator('[data-note]')).toContainText('Password changed');
  });

  test('TC-HC3-07 an unregistered email gets the same neutral message', async ({ page }) => {
    await open(page);
    await requestReset(page, 'nobody@example.com');
    await expect(page.locator('[data-note]')).toContainText('If this email has an account, we sent a 6-digit code to nobody@example.com');
    await expect(page.getByText(/not registered|no account/i)).toHaveCount(0);
  });

  test('TC-HC3-08 a reset code cannot be used twice', async ({ page }) => {
    await registeredAndLoggedOut(page);
    const code = await requestReset(page, 'nhung@example.com');
    await resetWith(page, code, 'Kem54321');
    await requestReset(page, 'nhung@example.com');
    await resetWith(page, code, 'Kem99999');
    await expect(alert(page)).toContainText('That code is not right');
  });

  test('TC-HC3-09 a reset code expires after 10 minutes @clock', async ({ page }) => {
    await page.clock.install({ time: T10 });
    await registeredAndLoggedOut(page);
    const code = await requestReset(page, 'nhung@example.com');
    await page.clock.runFor('10:01');
    await resetWith(page, code, 'Kem54321');
    await expect(alert(page)).toContainText('expired');
  });

  test('TC-HC3-10 a reset code locks after 5 wrong tries', async ({ page }) => {
    await registeredAndLoggedOut(page);
    const code = await requestReset(page, 'nhung@example.com');
    for (let i = 0; i < 5; i++) await resetWith(page, '000000', 'Kem54321');
    await resetWith(page, code, 'Kem54321');
    await expect(alert(page)).toContainText('Too many wrong tries');
    await page.getByRole('button', { name: 'Back to log in' }).click();
    await loginWith(page, 'nhung@example.com', 'Kem12345');
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });
});

// =====================================================================
// Home (HC-4, HC-5)
// =====================================================================
test.describe('Home (more cases)', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); });
  test('TC-HC4-05 swiping past the last banner behaves the same on every device', async () => { manual('swipe gestures and device differences are not driven by the mock-up'); });
  test('TC-HC4-06 a banner image that fails to load shows a placeholder', async () => { manual('the mock-up banners are drawn in CSS, not loaded images'); });
  test('TC-HC4-07 a single banner shows no dots or arrows', async () => { manual('the mock-up has a fixed set of banners'); });

  test('TC-HC5-07 going back from the menu returns to Home', async ({ page }) => {
    await page.getByRole('button', { name: 'Cups' }).first().click();
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeHidden();
    await nav(page, 'Home').click();
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC5-08 icon labels follow the language', async ({ page }) => {
    await goVietnamese(page);
    await nav(page, 'Trang chủ').click();
    for (const label of ['Bán chạy', 'Cốc', 'Ốc quế', 'Hộp mang đi']) await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
  });
});

// =====================================================================
// Menu (HC-6, HC-9)
// =====================================================================
test.describe('Menu (more cases)', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); });
  test('TC-HC6-10 a tab with no products shows a friendly message', async () => { manual('every mock-up tab has products'); });

  test('TC-HC6-12 sold out in one branch only', async ({ page }) => {
    knownGap(test, 'the mock-up has no per-branch stock or "Sold out" state');
    await nav(page, 'Menu').click();
    await expect(page.getByText('Sold out').first()).toBeVisible();
  });

  test('TC-HC9-07 the cart is kept on the account across devices', async () => { manual('needs a backend and a second device'); });
});

// =====================================================================
// Delivery fee and distance (HC-10), minimum order (HC-11), double tap (HC-12)
// =====================================================================
test.describe('Delivery (more cases)', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); });

  test('TC-HC10-02 fee just under 2 km is 15,000đ', async ({ page }) => { expect(await feeAt(page, 1.99)).toBe('15,000đ'); });
  test('TC-HC10-03 fee at exactly 2 km is 25,000đ', async ({ page }) => { expect(await feeAt(page, 2.0)).toBe('25,000đ'); });
  test('TC-HC10-04 fee just under 5 km is 25,000đ', async ({ page }) => { expect(await feeAt(page, 4.99)).toBe('25,000đ'); });
  test('TC-HC10-05 fee at exactly 5 km is 35,000đ', async ({ page }) => { expect(await feeAt(page, 5.0)).toBe('35,000đ'); });

  test('TC-HC10-06 fee at exactly 10 km is 35,000đ and the order can be placed', async ({ page }) => {
    expect(await feeAt(page, 10.0)).toBe('35,000đ');
    await expect(placeOrder(page)).toBeEnabled();
  });

  test('TC-HC10-07 just over 10 km (10.01) cannot be ordered to', async ({ page }) => {
    await addSavedAddress(page, 'Test', '1 Test Street', 10.01);
    await checkoutWith(page, { address: 'Test' });
    await expect(alert(page)).toHaveText('Sorry, this address is outside our 10km delivery coverage.');
    await expect(page.getByRole('button', { name: /Can.t place this order yet/ })).toBeDisabled();
  });

  test('TC-HC10-11 the fee follows the road distance', async () => { manual('needs a map service for road distance'); });
  test('TC-HC10-12 the nearest branch sets the fee', async () => { manual('needs a map service and real branch positions'); });

  test('TC-HC10-15 with no address the order cannot continue', async ({ page }) => {
    await nav(page, 'Account').click();
    await page.getByRole('button', { name: /^Saved addresses/ }).click();
    for (const name of ['Home', 'Office', 'Parents']) await page.getByRole('button', { name: 'Delete ' + name }).click();
    await back(page).click();
    await checkoutWith(page, { type: null });
    await expect(alert(page)).toContainText('Add a delivery address');
    await expect(page.getByRole('button', { name: /Can.t place this order yet/ })).toBeDisabled();
  });

  test('TC-HC10-16 delivery is disabled at 07:59 and the next opening time is shown', async ({ page }) => {
    await atTime(page, '2026-11-09T07:59:00');
    await checkoutWith(page, { type: null });
    await expect(page.getByRole('button', { name: 'Delivery', exact: true })).toBeDisabled();
    await expect(alert(page)).toContainText('Next opening: 08:00');
  });

  test('TC-HC10-17 delivery is available at 08:00', async ({ page }) => {
    await atTime(page, '2026-11-09T08:00:00');
    await checkoutWith(page, { type: null });
    await expect(page.getByRole('button', { name: 'Delivery', exact: true })).toBeEnabled();
    await expect(placeOrder(page)).toBeEnabled();
  });

  test('TC-HC10-18 a delivery order at 21:59 can be placed', async ({ page }) => {
    await atTime(page, '2026-11-09T21:59:00');
    await place(page, {});
  });

  test('TC-HC10-19 delivery is disabled at 22:00 and the next opening time is shown', async ({ page }) => {
    await atTime(page, '2026-11-09T22:00:00');
    await checkoutWith(page, { type: null });
    await expect(page.getByRole('button', { name: 'Delivery', exact: true })).toBeDisabled();
    await expect(alert(page)).toContainText('Next opening: 08:00');
  });

  test('TC-HC11-05 an item total of 29,000đ for delivery asks for 1,000đ more', async () => { manual('no mock-up cart reaches exactly 29,000đ with the fixed prices'); });

  test('TC-HC12-11 a double tap on "Place order" creates one order', async ({ page }) => {
    await nav(page, 'Account').click();
    const before = await page.getByRole('button', { name: /Track this order/ }).count();
    await checkoutWith(page);
    await placeOrder(page).dblclick();
    await expect(page.getByRole('heading', { name: /^Order HC-\d+$/ })).toBeVisible();
    await backFromTracking(page);
    await nav(page, 'Account').click();
    await expect(page.getByRole('button', { name: /Track this order/ })).toHaveCount(before + 1);
  });
});

// =====================================================================
// Pick-up (HC-13, HC-14)
// =====================================================================
test.describe('Pick-up (more cases)', () => {
  const pickup = async (page, iso) => {
    await atTime(page, iso);
    await signIn(page);
    await checkoutWith(page, { type: 'Pick-up' });
  };
  const slotBtn = (page, t) => page.getByRole('button', { name: t, exact: true });

  test('TC-HC13-03 there is no slot before opening (07:00): the first slot is 08:00', async ({ page }) => {
    await pickup(page, '2026-11-09T07:00:00');
    await expect(slotBtn(page, '08:00')).toBeVisible();
    for (const t of ['07:30', '07:45']) await expect(slotBtn(page, t)).toHaveCount(0);
  });

  test('TC-HC13-04 there is no slot after closing (20:00)', async ({ page }) => {
    await pickup(page, '2026-11-09T20:00:00');
    await expect(slotBtn(page, '20:30')).toBeVisible();
    await expect(slotBtn(page, '22:15')).toHaveCount(0);
  });

  test('TC-HC13-08 with the shop closed there are no slots and a message explains why', async ({ page }) => {
    await pickup(page, '2026-11-09T23:00:00');
    await expect(alert(page)).toContainText('No pick-up slots are left today');
    await expect(page.getByRole('button', { name: /Can.t place this order yet/ })).toBeDisabled();
  });

  test('TC-HC13-09 an empty slot blocks placing the order', async () => { manual('the mock-up always has a slot selected; closed hours are covered by TC-HC13-08'); });

  test('TC-HC13-12 a slot 29 minutes away is not offered', async ({ page }) => {
    await pickup(page, '2026-11-09T10:01:00');
    await expect(slotBtn(page, '10:30')).toHaveCount(0);
    await expect(slotBtn(page, '10:45')).toBeVisible();
  });

  test('TC-HC14-02 a notification arrives when the order is ready', async () => { manual('real browser push needs a service worker and permission'); });
  test('TC-HC14-04 with notifications blocked the status still updates', async () => { manual('browser permission cannot be driven here'); });

  test('TC-HC14-06 the status is kept after a refresh', async ({ page }) => {
    await signIn(page);
    await place(page, { type: 'Pick-up' });
    await advance(page, 2);
    await page.reload();
    await nav(page, 'Account').click();
    await expect(page.locator('.bd', { hasText: 'Ready for pick-up' })).toBeVisible();
  });

  test('TC-HC14-07 a late customer keeps the Ready for pick-up status', async () => { manual('needs real time over several hours and staff action'); });
});

// =====================================================================
// Stores (HC-15, HC-16)
// =====================================================================
test.describe('Stores (more cases)', () => {
  const stores = async (page, iso) => {
    await atTime(page, iso);
    await signIn(page);
    await nav(page, 'Stores').click();
  };
  test('TC-HC15-04 a branch shows as closed at 07:59 and at 22:00', async ({ page }) => {
    await stores(page, '2026-11-09T07:59:00');
    await expect(page.locator('.bd', { hasText: 'Closed' })).toHaveCount(3);
    await atTime(page, '2026-11-09T22:00:00');
    await nav(page, 'Home').click();
    await nav(page, 'Stores').click();
    await expect(page.locator('.bd', { hasText: 'Closed' })).toHaveCount(3);
  });
  test('TC-HC15-05 with location denied the list shows no distances', async () => { manual('geolocation permission is not simulated in the mock-up'); });
  test('TC-HC15-07 distances update when the user moves', async () => { manual('geolocation is not used by the mock-up'); });
  test('TC-HC15-08 a branch still shows "Open now" at 21:29', async ({ page }) => {
    await stores(page, '2026-11-09T21:29:00');
    await expect(page.locator('.bd', { hasText: 'Open now' })).toHaveCount(3);
    await expect(page.locator('.bd', { hasText: 'Closing soon' })).toHaveCount(0);
  });
  test('TC-HC16-05 directions still open with location denied', async () => { manual('Google Maps and location permission cannot be driven here'); });
});

// =====================================================================
// Order status notifications (HC-18)
// =====================================================================
test.describe('Order status notifications (more cases)', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); });

  test('TC-HC18-02 each status change adds one bell item and the badge goes up by 3', async ({ page }) => {
    const before = await bellUnread(page);
    await place(page, {});
    const id = await orderId(page);
    await advance(page, 2);
    await backFromTracking(page);
    expect(await bellUnread(page)).toBe(before + 3);
    await bell(page).click();
    await expect(notifItems(page).filter({ hasText: id })).toHaveCount(3);
  });

  test('TC-HC18-03 with push off the bell list still fills', async ({ page }) => {
    await nav(page, 'Account').click();
    await page.getByRole('switch').click();
    await expect(page.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    await place(page, {});
    const id = await orderId(page);
    await advance(page);
    await backFromTracking(page);
    await bell(page).click();
    await expect(notifItems(page).filter({ hasText: id })).toHaveCount(2);
  });

  test('TC-HC18-04 iPhone Safari outside the Home Screen shows no permission prompt', async () => { manual('needs a real iPhone'); });
  test('TC-HC18-05 iPhone Safari added to the Home Screen can show the prompt', async () => { manual('needs a real iPhone'); });
  test('TC-HC18-06 the permission is asked once', async () => { manual('browser permission prompt cannot be driven here'); });
  test('TC-HC18-07 refusing the prompt leaves the app working', async () => { manual('browser permission prompt cannot be driven here'); });
  test('TC-HC18-10 no email or SMS is sent when push is blocked', async () => { manual('needs the real notification backend'); });
});

// =====================================================================
// Order history (HC-19)
// =====================================================================
test.describe('Order history (more cases)', () => {
  test('TC-HC19-02 an empty history shows an empty list', async ({ page }) => {
    await registerAccount(page);
    await openHistory(page);
    await expect(page.getByText('No past orders yet.')).toBeVisible();
  });

  test('TC-HC19-04 the history total matches the total paid at checkout', async ({ page }) => {
    await signIn(page);
    await checkoutWith(page, {});
    const total = (await readSummary(page)).Total;
    await placeOrder(page).click();
    const id = await orderId(page);
    await advance(page, 3);
    await backFromTracking(page);
    await openHistory(page);
    await expect(historyCard(page, id)).toContainText(total);
  });

  test('TC-HC19-05 only my own orders are listed', async () => { manual('needs two real customer accounts'); });
});

// =====================================================================
// Account (HC-20, HC-21, HC-22)
// =====================================================================
test.describe('Account (more cases)', () => {
  test('TC-HC20-04 several saved addresses are listed and can be chosen', async ({ page }) => {
    await signIn(page);
    await addSavedAddress(page, 'Gym', '1 Le Duan, District 1', 3.5);
    await checkoutWith(page, { type: null });
    for (const name of ['Home', 'Office', 'Parents', 'Gym']) await expect(page.locator('.row-opt').filter({ hasText: name })).toHaveCount(1);
    await page.locator('.row-opt').filter({ hasText: 'Home' }).click();
    await expect(page.locator('.row-opt.on').filter({ hasText: 'Home' })).toHaveCount(1);
  });

  test('TC-HC20-05 saving an empty address shows an error', async ({ page }) => {
    await signIn(page);
    await nav(page, 'Account').click();
    await page.getByRole('button', { name: /^Saved addresses/ }).click();
    await page.getByRole('button', { name: 'Add address' }).click();
    await expect(alert(page)).toHaveText('Enter an address.');
    await expect(page.getByRole('button', { name: /^Delete / })).toHaveCount(3);
  });

  test('TC-HC20-06 a Google user sees the name and email from Google', async ({ page }) => {
    knownGap(test, 'the mock-up shows a fixed demo profile, not Google data');
    await signIn(page);
    await nav(page, 'Account').click();
    await expect(page.getByText(/@gmail\.com/)).toBeVisible();
  });

  test('TC-HC20-07 a saved address over 10 km warns at checkout and cannot be ordered to', async ({ page }) => {
    await signIn(page);
    await checkoutWith(page, { address: 'Parents' });
    await expect(alert(page)).toHaveText('Sorry, this address is outside our 10km delivery coverage.');
    await expect(page.getByRole('button', { name: /Can.t place this order yet/ })).toBeDisabled();
  });

  const changePassword = async (page, current, next) => {
    await registerAccount(page, 'nhung@example.com', 'Kem12345');
    await nav(page, 'Account').click();
    await page.getByRole('button', { name: 'Change password' }).click();
    await page.getByLabel('Current password').fill(current);
    await page.getByLabel('New password').fill(next);
    await page.getByRole('button', { name: 'Save password' }).click();
  };
  test('TC-HC21-03 a wrong current password is refused', async ({ page }) => {
    await changePassword(page, 'Wrong999', 'Kem54321');
    await expect(alert(page)).toContainText('current password is not right');
  });
  test('TC-HC21-04 a new password of 7 characters is refused', async ({ page }) => {
    await changePassword(page, 'Kem12345', 'Kem5432');
    await expect(alert(page)).toContainText('8 characters or more');
  });
  test('TC-HC21-05 a new password of 8 characters is accepted', async ({ page }) => {
    await changePassword(page, 'Kem12345', 'Kem54321');
    await expect(toast(page)).toHaveText('Password changed.');
  });
  test('TC-HC21-08 a new password equal to the old one is refused', async ({ page }) => {
    await changePassword(page, 'Kem12345', 'Kem12345');
    await expect(alert(page)).toContainText('different');
  });

  test('TC-HC21-06 the Back button after logout does not show account data', async () => { manual('browser history is not used by the mock-up'); });

  test('TC-HC22-02 the language is remembered after reopening', async ({ page }) => {
    await signIn(page);
    await goVietnamese(page);
    await page.reload();
    await expect(nav(page, 'Trang chủ')).toBeVisible();
  });
  test('TC-HC22-03 switching from Vietnamese back to English shows English', async ({ page }) => {
    await signIn(page);
    await goVietnamese(page);
    await page.getByRole('button', { name: 'English' }).click();
    await expect(page.getByRole('heading', { name: 'Account' })).toBeVisible();
    await expect(nav(page, 'Home')).toBeVisible();
  });
  test('TC-HC22-04 error messages follow the language', async ({ page }) => {
    await signIn(page);
    await goVietnamese(page);
    await page.getByRole('button', { name: 'Đăng xuất' }).click();
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await expect(alert(page)).toHaveText('Vui lòng nhập địa chỉ email.');
  });
  test('TC-HC22-05 product names and prices keep their format after a language switch', async ({ page }) => {
    await signIn(page);
    await goVietnamese(page);
    await nav(page, 'Thực đơn').click();
    await expect(page.getByText('Mint Cloud Cup').first()).toBeVisible();
    await expect(page.getByText('25,000đ').first()).toBeVisible();
  });
});

// =====================================================================
// Feedback (HC-23, HC-24)
// =====================================================================
test.describe('Feedback (more cases)', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); await openHistory(page); });
  const openForm = async (page, id) => {
    await historyCard(page, id).getByRole('button', { name: 'Rate this order' }).click();
    await expect(page.getByRole('heading', { name: 'Rate your order' })).toBeVisible();
  };

  test('TC-HC23-09 moving from 3 to 4 stars swaps the option list and clears the pick', async ({ page }) => {
    await openForm(page, 'HC-2031');
    await star(page, 3).click();
    await fbChips(page).filter({ hasText: 'Slow delivery' }).click();
    await expect(pickedChips(page)).toHaveCount(1);
    await star(page, 4).click();
    await expect(fbChips(page)).toHaveCount(6);
    await expect(fbChips(page).filter({ hasText: 'Slow delivery' })).toHaveCount(0);
    await expect(pickedChips(page)).toHaveCount(0);
  });

  const photo = 'photos are simulated by the "Add photo" button; there is no file picker to give a 5 MB file';
  test('TC-HC23-15 a photo of exactly 5 MB is accepted', async () => { manual(photo); });
  test('TC-HC23-17 PNG and WebP photos are accepted', async () => { manual(photo); });
  test('TC-HC23-25 three 5 MB photos in mixed formats are accepted', async () => { manual(photo); });

  test('TC-HC23-21 a cancelled order cannot be rated', async () => { manual('the mock-up has no cancelled order in history to check'); });
  test('TC-HC23-26 Vietnamese feedback text', async () => { manual('open question: waiting for the client Vietnamese text for the 12 options and 5 rating labels'); });

  test('TC-HC24-01 a completed delivery order creates one feedback item with the English text', async ({ page }) => {
    await place(page, {});
    const id = await orderId(page);
    await advance(page, 3);
    await backFromTracking(page);
    await bell(page).click();
    const fb = notifItems(page).filter({ hasText: id }).filter({ hasText: 'Order Delivered!' });
    await expect(fb).toHaveCount(1);
    await expect(fb).toContainText('Order Delivered! 🍦');
    await expect(fb).toContainText('How was your ice cream? Leave a quick review to help us serve you better!');
  });

  test('TC-HC24-02 a completed pick-up order creates the feedback item once', async ({ page }) => {
    await place(page, { type: 'Pick-up' });
    const id = await orderId(page);
    await advance(page, 3);
    await backFromTracking(page);
    await bell(page).click();
    await expect(notifItems(page).filter({ hasText: id }).filter({ hasText: /Order (Delivered|Completed)!/ })).toHaveCount(1);
  });

  test('TC-HC24-04 tapping the push after the session expired lands on the form', async () => { manual('needs a real push and an expired session'); });

  test('TC-HC24-05 with push off the bell item and the Rate button remain', async ({ page }) => {
    await page.getByRole('switch').click();
    await place(page, {});
    const id = await orderId(page);
    await advance(page, 3);
    await backFromTracking(page);
    await bell(page).click();
    await expect(notifItems(page).filter({ hasText: id }).filter({ hasText: 'Order Delivered!' })).toHaveCount(1);
    await back(page).click();
    await openHistory(page);
    await expect(historyCard(page, id).getByRole('button', { name: 'Rate this order' })).toBeVisible();
  });

  test('TC-HC24-06 only one feedback notification is received for an unrated order', async () => { manual('needs a backend and real dates (29 Oct to 5 Nov 2026)'); });

  test('TC-HC24-08 two completed orders create two notifications with their own numbers', async ({ page }) => {
    const ids = [];
    for (let i = 0; i < 2; i++) {
      await place(page, {});
      ids.push(await orderId(page));
      await advance(page, 3);
      await backFromTracking(page);
    }
    await bell(page).click();
    for (const id of ids) await expect(notifItems(page).filter({ hasText: id }).filter({ hasText: 'Order Delivered!' })).toHaveCount(1);
  });

  test('TC-HC24-13 the feedback notification in Vietnamese', async ({ page }) => {
    await page.getByRole('button', { name: 'Tiếng Việt' }).click();
    await page.getByRole('button', { name: /^Thông báo/ }).click();
    await expect(page.getByText('Đơn hàng đã hoàn thành! 🍦').first()).toBeVisible();
    await expect(page.getByText('Bạn thấy kem hôm nay thế nào? Chia sẻ phản hồi ngay để giúp shop nâng cao dịch vụ nhé!').first()).toBeVisible();
  });

  test('TC-HC24-15 the English title for a pick-up order', async () => { manual('open question: confirm with the client whether pick-up uses "Delivered"'); });
});

// =====================================================================
// Notification bell and list (HC-25, HC-26, HC-27)
// =====================================================================
test.describe('Notifications (more cases)', () => {
  test('TC-HC25-03 no badge when everything is read', async ({ page }) => {
    await signIn(page);
    await bell(page).click();
    await page.getByRole('button', { name: 'Mark all as read' }).click();
    await back(page).click();
    await expect(page.locator('.badge')).toHaveCount(0);
    expect(await bellUnread(page)).toBe(0);
  });

  test('TC-HC25-07 a new account sees the empty list message', async ({ page }) => {
    await registerAccount(page);
    await bell(page).click();
    await expect(page.getByText('No notifications yet. Order updates and rating requests will show up here.')).toBeVisible();
  });

  test('TC-HC25-11 the list in Vietnamese', async ({ page }) => {
    await signIn(page);
    await goVietnamese(page);
    await page.getByRole('button', { name: /^Thông báo/ }).click();
    await expect(page.getByRole('heading', { name: 'Thông báo' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' })).toBeVisible();
  });

  test('TC-HC26-02 a status item for a completed order opens Order History and is read', async ({ page }) => {
    await signIn(page);
    await place(page, {});
    const id = await orderId(page);
    await advance(page, 3);
    await backFromTracking(page);
    await bell(page).click();
    const status = () => notifItems(page).filter({ hasText: id }).filter({ hasNotText: 'Order Delivered!' }).first();
    await expect(status()).toHaveClass(/unread/);
    await status().click();
    await expect(page.getByRole('button', { name: 'Order history' })).toHaveClass(/\bon\b/);
    await bell(page).click();
    await expect(status()).not.toHaveClass(/unread/);
  });

  test('TC-HC26-09 the read state is kept after a refresh', async ({ page }) => {
    await signIn(page);
    await bell(page).click();
    await page.getByRole('button', { name: 'Mark all as read' }).click();
    await page.reload();
    expect(await bellUnread(page)).toBe(0);
  });

  test('TC-HC26-10 an item for an unknown order shows a clear message or Order History', async () => { manual('the mock-up cannot create a notification for a missing order'); });

  test('TC-HC27-05 iPhone Safari outside the Home Screen shows no permission prompt', async () => { manual('needs a real iPhone'); });
  test('TC-HC27-07 with the browser blocking notifications the bell list still fills', async () => { manual('browser permission cannot be driven here; the push switch is covered in mobile.spec.js'); });
});
