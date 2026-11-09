// Tests for apps/Desktop-index.html, based on specs/specs-v1.0.md and the test matrix in tests/.
// Test titles start with the matrix ID (TC-HCx-yy). Tests wrapped in knownGap() document a mismatch
// between the mock-up and the spec or matrix: they are expected to fail until the mock-up is updated.
// The desktop mock-up is smaller than the mobile one (no product options sheet, no payment screen,
// no tracking page), so the options, payment and tracking cases are covered in mobile.spec.js.
// Sections named "(more cases)" cover the sign-in, password, language, address, opening-hours and refresh cases that
// mobile.spec.js also covers. Cases that need a real backend, device or browser permission are listed there as "Manual".
// Demo rules (same as Mobile): the sign-up code is 123456; the reset code is shown on the screen; codes last 10 minutes and
// lock after 5 wrong tries; a saved address has a demo distance field, so any distance can be tested.
const { test } = require('@playwright/test');
const { expect, knownGap, readSummary, bellUnread, registerAccount, loginWith } = require('./helpers');

const URL = '/Desktop-index.html';
const T10 = new Date('2026-11-09T10:00:00');

// The mock-up reads the clock (opening hours 08:00 to 22:00, pick-up slots). Every test starts at 10:00 unless it sets its own time.
test.beforeEach(async ({ page }, testInfo) => { if (!testInfo.title.includes('@clock')) await page.clock.setFixedTime(T10); });

// ---------- page helpers ----------
const nav = (page, name) => page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name });
const bell = (page) => page.getByRole('button', { name: /^Notifications/ });
const cart = (page) => page.getByRole('complementary', { name: 'Your order' });
const checkoutBtn = (page) => cart(page).getByRole('button', { name: /^Checkout|Can.t place/ });
const panel = (page) => page.getByRole('dialog', { name: 'Notifications' });
const items = (page) => panel(page).locator('.nitem');
const pushBanner = (page) => page.locator('button').filter({ hasText: /HC\s*Happy Creamy\s*now/ });
const fbChips = (page) => page.getByRole('dialog', { name: 'Rate your order' }).locator('.chip');
const notice = (page) => page.getByRole('status');
const historyCard = (page, id) => page.locator('div.card').filter({ hasText: 'Order ' + id });

async function signIn(page) {
  await page.goto(URL);
  await page.getByRole('button', { name: /Continue with Google/ }).click();
  await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
}
async function menuNames(page) {
  return page.evaluate(() => [...document.querySelectorAll('.pcard button[aria-label^="Add "]')].map((b) => b.getAttribute('aria-label').slice(4)).sort());
}
const lineQty = (page, name) => cart(page).locator('div').filter({ hasText: name }).last();

const alert = (page) => page.getByRole('alert');

const register = (page, email = 'nhung@example.com', pw = 'Kem12345') => registerAccount(page, email, pw, URL);
const logout = async (page) => { await nav(page, 'Account').click(); await page.getByRole('button', { name: 'Log out' }).click(); };
const registeredAndLoggedOut = async (page, email, pw) => { await register(page, email, pw); await logout(page); };
const goVietnamese = async (page) => { await nav(page, 'Account').click(); await page.getByRole('button', { name: 'Tiếng Việt' }).click(); };
async function atTime(page, iso) { await page.clock.setFixedTime(new Date(iso)); }

/** Adds a saved address with a demo distance on the Account page, then opens the Menu page with the cart. */
async function addSavedAddress(page, name, line, km) {
  await nav(page, 'Account').click();
  await page.getByLabel('Name', { exact: true }).fill(name);
  await page.getByLabel('Address', { exact: true }).fill(line);
  await page.getByLabel(/Distance from the nearest shop/).fill(String(km));
  await page.getByRole('button', { name: 'Add address' }).click();
  await nav(page, 'Menu').click();
}
async function feeAt(page, km) {
  await addSavedAddress(page, 'Test', '1 Test Street', km);
  await page.locator('.row-opt').filter({ hasText: 'Test' }).click();
  return (await readSummary(page))['Delivery fee'];
}
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
async function signUp(page, email = 'nhung@example.com', pw = 'Kem12345') {
  await page.goto(URL);
  await page.getByRole('button', { name: 'New here? Create an account' }).click();
  await page.locator('#email').fill(email);
  await page.locator('#pw').fill(pw);
  await page.getByRole('button', { name: 'Create account' }).click();
}
async function verify(page, code) {
  await page.locator('#otp').fill(code);
  await page.getByRole('button', { name: 'Verify and sign in' }).click();
}
// =====================================================================
// HC-1 / HC-2  Authentication (SRS II.1)
// =====================================================================
test.describe('Authentication', () => {
  test('TC-HC2-01 / TC-HC25-10 signed-out user sees only the sign-in screen', async ({ page }) => {
    await page.goto(URL);
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue with Google/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Continue with Facebook/ })).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#pw')).toBeVisible();
  });

  test('TC-HC1-01 / TC-HC1-03 sign in with Google shows Home and skips the email code', async ({ page }) => {
    await signIn(page);
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeHidden();
    await expect(page.getByText('Check your email')).toBeHidden();
  });

  test('TC-HC1-02 sign in with Facebook shows Home', async ({ page }) => {
    await page.goto(URL);
    await page.getByRole('button', { name: /Continue with Facebook/ }).click();
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC2-02 / TC-HC2-03 email sign-up asks for a 6-digit code, then signs in', async ({ page }) => {
    await page.goto(URL);
    await page.getByRole('button', { name: 'New here? Create an account' }).click();
    await page.locator('#email').fill('nhung@example.com');
    await page.locator('#pw').fill('Kem12345');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
    const verify = page.getByRole('button', { name: 'Verify and sign in' });
    await page.locator('#otp').fill('12345');
    await expect(verify).toBeDisabled();
    await page.locator('#otp').fill('123456');
    await expect(verify).toBeEnabled();
    await verify.click();
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC2-05 log in with email and password shows Home', async ({ page }) => {
    await registerAccount(page, 'nhung@example.com', 'Kem12345', URL);
    await nav(page, 'Account').click();
    await page.getByRole('button', { name: 'Log out' }).click();
    await loginWith(page, 'nhung@example.com', 'Kem12345');
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC2-04 a wrong code is refused', async ({ page }) => {
    await page.goto(URL);
    await page.getByRole('button', { name: 'New here? Create an account' }).click();
    await page.locator('#email').fill('nhung@example.com');
    await page.locator('#pw').fill('Kem12345');
    await page.getByRole('button', { name: 'Create account' }).click();
    await page.locator('#otp').fill('000000');
    await page.getByRole('button', { name: 'Verify and sign in' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('TC-HC2-08 a 7-character password is refused', async ({ page }) => {
    await page.goto(URL);
    await page.getByRole('button', { name: 'New here? Create an account' }).click();
    await page.locator('#email').fill('nhung@example.com');
    await page.locator('#pw').fill('Kem1234');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByText(/8 characters or more/)).toBeVisible();
  });
});

// =====================================================================
// HC-4 / HC-5  Home (SRS V, Tab 1)
// =====================================================================
test.describe('Home', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); });

  test('TC-HC4-04 / TC-HC4-08 the banner is not clickable', async ({ page }) => {
    const banner = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Coconut Pandan has landed.' }) }).locator('div').first();
    await expect(banner).toHaveCSS('cursor', 'auto');
    await expect(banner.locator('a, button')).toHaveCount(0);
    await banner.click();
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC5-01 four quick icons are shown', async ({ page }) => {
    for (const n of ['Best-Sellers', 'Cups', 'Cones', 'Take-away Tubs']) {
      await expect(page.getByRole('button', { name: n, exact: true })).toBeVisible();
    }
  });

  for (const [id, label] of [['TC-HC5-02', 'Cups'], ['TC-HC5-03', 'Best-Sellers'], ['TC-HC5-04', 'Cones'], ['TC-HC5-05', 'Take-away Tubs']]) {
    test(`${id} the ${label} icon opens the ${label} category`, async ({ page }) => {
      await page.getByRole('button', { name: label, exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Menu', exact: true })).toBeVisible();
      await expect(page.locator('.chip.on:not(.seg)')).toHaveText(label);
    });
  }

  test('TC-HC5-06 Order now opens the full menu on the All tab', async ({ page }) => {
    await page.getByRole('button', { name: 'Order now' }).click();
    await expect(page.getByRole('heading', { name: 'Menu', exact: true })).toBeVisible();
    await expect(page.locator('.chip.on:not(.seg)')).toHaveText('All');
  });

  test('TC-HC4-01 / TC-HC4-03 banner carousel with dots', async ({ page }) => {
    knownGap(test, 'the desktop banner is a single static banner, there is no carousel or dots');
    await expect(page.locator('button.dot')).toHaveCount(3);
  });
});

// =====================================================================
// HC-6 / HC-7  Menu (SRS III, V Tab 2)
// =====================================================================
test.describe('Menu', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); await nav(page, 'Menu').click(); });

  test('TC-HC6-01 seven category tabs', async ({ page }) => {
    const labels = await page.locator('.chip:not(.seg)').allTextContents();
    expect(labels).toEqual(['All', 'New Arrivals', 'Best-Sellers', 'Cups', 'Cones', 'Take-away Tubs', 'Beverages']);
  });

  test('TC-HC6-02 / TC-HC6-08 product card shows name, price format and badge', async ({ page }) => {
    const card = page.locator('.pcard').filter({ has: page.getByRole('button', { name: 'Add Mint Cloud Cup' }) });
    await expect(card.getByText('Mint Cloud Cup')).toBeVisible();
    await expect(card.getByText('25,000đ')).toBeVisible();
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

  test('TC-HC6-11 a sold-out product is greyed out and cannot be added', async ({ page }) => {
    knownGap(test, 'no sold-out state per branch');
    await expect(page.getByText('Sold out').first()).toBeVisible();
  });

  test('TC-HC7-01 size, toppings and notes can be chosen for a product', async ({ page }) => {
    knownGap(test, 'Add puts the base-price product straight in the cart; there is no size, topping or note screen');
    await page.getByRole('button', { name: 'Add Mint Cloud Cup' }).click();
    await expect(page.getByText('Special notes')).toBeVisible();
  });

  test('TC-HC8-02 adding a product updates the order panel and the cart count', async ({ page }) => {
    await expect(page.getByText('3 in cart')).toBeVisible();
    await page.getByRole('button', { name: 'Add Matcha Mochi Cone' }).click();
    await expect(page.getByText('4 in cart')).toBeVisible();
    await expect(cart(page).getByText('Matcha Mochi Cone')).toBeVisible();
    expect((await readSummary(page)).Items).toBe('157,000đ');
  });
});

// =====================================================================
// HC-9 / HC-10 / HC-11 / HC-12 / HC-13  Cart, fees, total, payment, pick-up (SRS IV, V)
// =====================================================================
test.describe('Cart and checkout totals', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); await nav(page, 'Menu').click(); });

  test('TC-HC9-01 cart lists items with line totals', async ({ page }) => {
    await expect(cart(page).getByText('Mint Cloud Cup')).toBeVisible();
    await expect(cart(page).getByText('50,000đ')).toBeVisible();
    await expect(cart(page).getByText('Mint Cloud Tub')).toBeVisible();
    await expect(cart(page).getByText('79,000đ').first()).toBeVisible();
  });

  test('TC-HC9-02 plus and minus change quantity and total', async ({ page }) => {
    await cart(page).getByRole('button', { name: 'More' }).first().click();
    expect((await readSummary(page)).Items).toBe('154,000đ');
    await cart(page).getByRole('button', { name: 'Fewer' }).first().click();
    expect((await readSummary(page)).Items).toBe('129,000đ');
  });

  test('TC-HC9-03 / TC-HC9-05 minus on quantity 1 removes the item and the total drops', async ({ page }) => {
    await cart(page).getByRole('button', { name: 'Fewer' }).last().click();
    await expect(cart(page).getByText('Mint Cloud Tub')).toHaveCount(0);
    expect((await readSummary(page)).Items).toBe('50,000đ');
  });

  test('TC-HC9-04 empty cart shows a message and cannot be checked out', async ({ page }) => {
    await cart(page).getByRole('button', { name: 'Fewer' }).last().click();
    await cart(page).getByRole('button', { name: 'Fewer' }).first().click();
    await cart(page).getByRole('button', { name: 'Fewer' }).first().click();
    await expect(page.getByText('Nothing here yet. Add a scoop from the menu.')).toBeVisible();
    await expect(checkoutBtn(page)).toBeDisabled();
  });

  test('TC-HC9-08 the cart survives a page refresh', async ({ page }) => {
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeHidden();
    await expect(page.getByText('3 in cart')).toBeVisible();
  });

  test('TC-HC10-01 / TC-HC10-14 fee under 2 km is 15,000đ and changes with the address', async ({ page }) => {
    await page.locator('.row-opt').filter({ hasText: 'Home' }).click();
    expect((await readSummary(page))['Delivery fee']).toBe('15,000đ');
    await page.locator('.row-opt').filter({ hasText: 'Office' }).click();
    expect((await readSummary(page))['Delivery fee']).toBe('25,000đ');
  });

  test('TC-HC10-13 a saved address is preselected with its distance', async ({ page }) => {
    const office = page.locator('.row-opt.on').filter({ hasText: 'Office' });
    await expect(office).toContainText('Bitexco Tower, D1');
    await expect(office).toContainText('4.2 km');
  });

  test('TC-HC10-08 an address 11.8 km away is outside coverage and blocks the order', async ({ page }) => {
    await page.locator('.row-opt').filter({ hasText: 'Parents' }).click();
    await expect(page.getByRole('alert')).toHaveText('Sorry, this address is outside our 10km delivery coverage.');
    await expect(checkoutBtn(page)).toBeDisabled();
  });

  test('TC-HC11-01 / TC-HC11-11 default order: items + packaging + fee = total', async ({ page }) => {
    expect(await readSummary(page)).toMatchObject({ Items: '129,000đ', 'Insulated packaging': '10,000đ', 'Delivery fee': '25,000đ', Total: '164,000đ' });
    await expect(page.getByText('129,000đ + 10,000đ + 25,000đ = 164,000đ')).toBeVisible();
    await expect(checkoutBtn(page)).toHaveText('Checkout · 164,000đ');
  });

  test('TC-HC11-02 pick-up with a tub adds packaging and no delivery fee', async ({ page }) => {
    await cart(page).getByRole('button', { name: 'Pick-up', exact: true }).click();
    expect(await readSummary(page)).toMatchObject({ Items: '129,000đ', 'Insulated packaging': '10,000đ', 'Delivery fee': '0đ', Total: '139,000đ' });
  });

  test('TC-HC11-03 / TC-HC11-06 delivery under the minimum is blocked; fees do not count', async ({ page }) => {
    await cart(page).getByRole('button', { name: 'Fewer' }).last().click();
    await cart(page).getByRole('button', { name: 'Fewer' }).first().click();
    expect((await readSummary(page)).Items).toBe('25,000đ');
    await expect(page.getByRole('alert')).toHaveText('Delivery orders start at 30,000đ. Add 5,000đ more to continue.');
    await expect(checkoutBtn(page)).toBeDisabled();
  });

  test('TC-HC11-07 / TC-HC13-06 pick-up has no minimum', async ({ page }) => {
    await cart(page).getByRole('button', { name: 'Fewer' }).last().click();
    await cart(page).getByRole('button', { name: 'Fewer' }).first().click();
    await cart(page).getByRole('button', { name: 'Pick-up', exact: true }).click();
    expect((await readSummary(page)).Items).toBe('25,000đ');
    await expect(page.getByRole('alert')).toHaveCount(0);
    await expect(checkoutBtn(page)).toBeEnabled();
  });

  test('TC-HC11-08 / TC-HC11-12 no packaging fee for cups only on a short delivery or pick-up', async ({ page }) => {
    await cart(page).getByRole('button', { name: 'Fewer' }).last().click();
    await page.locator('.row-opt').filter({ hasText: 'Home' }).click();
    expect((await readSummary(page))['Insulated packaging']).toBe('0đ');
    await cart(page).getByRole('button', { name: 'Pick-up', exact: true }).click();
    expect(await readSummary(page)).toMatchObject({ 'Insulated packaging': '0đ', 'Delivery fee': '0đ', Total: '50,000đ' });
  });

  test('TC-HC11-09 packaging fee is added over 3 km even without a tub', async ({ page }) => {
    await cart(page).getByRole('button', { name: 'Fewer' }).last().click();
    expect(await readSummary(page)).toMatchObject({ Items: '50,000đ', 'Insulated packaging': '10,000đ', 'Delivery fee': '25,000đ', Total: '85,000đ' });
  });

  test('TC-HC11-13 a tub on a long delivery adds packaging once, not twice', async ({ page }) => {
    await cart(page).getByRole('button', { name: 'More' }).last().click();
    expect((await readSummary(page))['Insulated packaging']).toBe('10,000đ');
  });

  test('TC-HC11-14 money format uses a thousands separator and đ', async ({ page }) => {
    for (const v of Object.values(await readSummary(page))) expect(v).toMatch(/^\d{1,3}(,\d{3})*đ$/);
  });

  test('TC-HC12-01 four payment methods at checkout', async ({ page }) => {
    knownGap(test, 'the desktop cart has no payment method selection');
    for (const m of ['Cash on delivery', 'MoMo', 'VietQR', 'Visa']) await expect(page.getByText(m).first()).toBeVisible();
  });

  test('TC-HC13-01 / TC-HC13-02 pick-up shows 15-minute slots and a branch', async ({ page }) => {
    await cart(page).getByRole('button', { name: 'Pick-up', exact: true }).click();
    await expect(cart(page).getByText(/Pick up at Happy Creamy Nguyen Hue, 15-minute slots/)).toBeVisible();
    const slots = (await cart(page).locator('.chip:not(.seg)').allTextContents()).map((t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3)));
    expect(slots.length).toBeGreaterThan(1);
    slots.slice(1).forEach((m, i) => expect(m - slots[i]).toBe(15));
  });

  test('TC-HC13-07 choosing a slot marks it selected', async ({ page }) => {
    await cart(page).getByRole('button', { name: 'Pick-up', exact: true }).click();
    await cart(page).getByRole('button', { name: '11:00', exact: true }).click();
    await expect(cart(page).getByRole('button', { name: '11:00', exact: true })).toHaveClass(/\bon\b/);
  });

  test('TC-HC13-01 pick-up lets the user choose a branch', async ({ page }) => {
    knownGap(test, 'the branch is fixed text ("Happy Creamy Nguyen Hue"), there is no branch list');
    await cart(page).getByRole('button', { name: 'Pick-up', exact: true }).click();
    await expect(cart(page).locator('.row-opt').filter({ hasText: 'Thao Dien' })).toBeVisible();
  });
});

// =====================================================================
// HC-14 / HC-17 / HC-19  Order tracking and history (SRS V, Tab 4)
// =====================================================================
test.describe('Order tracking and history', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); });

  test('TC-HC17-04 no active order shows an empty state with a button to the menu', async ({ page }) => {
    await nav(page, 'Account').click();
    await expect(page.getByText('No orders on the way')).toBeVisible();
    await page.getByRole('button', { name: 'Browse the menu' }).click();
    await expect(page.getByRole('heading', { name: 'Menu', exact: true })).toBeVisible();
  });

  test('TC-HC12-02 / TC-HC17-09 placing an order shows the confirmation and an active order at Received', async ({ page }) => {
    await nav(page, 'Menu').click();
    await checkoutBtn(page).click();
    await expect(page.getByText("Order received. We'll text you when it's on the way.")).toBeVisible();
    await expect(page.getByText('Nothing here yet. Add a scoop from the menu.')).toBeVisible();
    await nav(page, 'Account').click();
    await expect(page.getByText(/^Order HC-\d+$/)).toBeVisible();
    await expect(page.locator('.bd', { hasText: 'Received' })).toBeVisible();
  });

  test('TC-HC17-01 / TC-HC17-05 / TC-HC17-08 delivery status moves step by step, then goes to Order History', async ({ page }) => {
    await nav(page, 'Menu').click();
    await checkoutBtn(page).click();
    await nav(page, 'Account').click();
    const status = page.locator('.bd').filter({ hasText: /^(Received|Preparing|Out for delivery)$/ });
    await expect(status).toHaveText('Received');
    await page.getByRole('button', { name: 'Demo: next status' }).click();
    await expect(status).toHaveText('Preparing');
    await page.getByRole('button', { name: 'Demo: next status' }).click();
    await expect(status).toHaveText('Out for delivery');
    await page.getByRole('button', { name: 'Demo: next status' }).click();
    await expect(page.getByText('No orders on the way')).toBeVisible();
    await page.getByRole('button', { name: 'Order history' }).click();
    await expect(page.getByText('Delivery · Completed · Today')).toBeVisible();
  });

  test('TC-HC17-02 / TC-HC14-01 pick-up status flow reaches Ready for pick-up', async ({ page }) => {
    await nav(page, 'Menu').click();
    await cart(page).getByRole('button', { name: 'Pick-up', exact: true }).click();
    await checkoutBtn(page).click();
    await nav(page, 'Account').click();
    await page.getByRole('button', { name: 'Demo: next status' }).click();
    await page.getByRole('button', { name: 'Demo: next status' }).click();
    await expect(page.locator('.bd', { hasText: 'Ready for pick-up' })).toBeVisible();
    await expect(page.getByText('Out for delivery')).toHaveCount(0);
  });

  test('TC-HC17-03 an unpaid online order shows Awaiting payment', async ({ page }) => {
    knownGap(test, 'the desktop mock-up has no online payment flow');
    await nav(page, 'Account').click();
    await expect(page.getByText('Awaiting payment')).toBeVisible();
  });

  test('TC-HC19-01 / TC-HC19-03 history shows number, date, type and total', async ({ page }) => {
    await nav(page, 'Account').click();
    await page.getByRole('button', { name: 'Order history' }).click();
    await expect(historyCard(page, 'HC-2031')).toContainText('84,000đ');
    await expect(historyCard(page, 'HC-2031')).toContainText('Delivery · Completed · 3 Nov');
    await expect(historyCard(page, 'HC-2012')).toContainText('Pick-up · Completed · 30 Oct');
    await expect(historyCard(page, 'HC-1987')).toContainText('169,000đ');
  });
});

// =====================================================================
// HC-15 / HC-16  Stores (SRS V, Tab 3)
// =====================================================================
test.describe('Stores', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); await nav(page, 'Stores').click(); });

  test('TC-HC15-01 map and branch list with address and distance', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Stores near you' })).toBeVisible();
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

  test('TC-HC16-02 / TC-HC16-06 Call store is a phone link', async ({ page }) => {
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
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
  });

  const fillAddress = async (page, name, line, km) => {
    await page.getByLabel('Name', { exact: true }).fill(name);
    await page.getByLabel('Address', { exact: true }).fill(line);
    await page.getByLabel(/Distance from the nearest shop/).fill(String(km));
    await page.getByRole('button', { name: 'Add address' }).click();
  };

  test('TC-HC20-02 an added saved address is listed and can be picked at checkout', async ({ page }) => {
    await fillAddress(page, 'Gym', '1 Le Duan, District 1', 3.5);
    await expect(page.getByText('1 Le Duan, District 1')).toBeVisible();
    await expect(page.getByText('4 saved')).toBeVisible();
    await nav(page, 'Menu').click();
    await page.locator('.row-opt').filter({ hasText: 'Gym' }).click();
    await expect(page.locator('.row-opt.on').filter({ hasText: 'Gym' })).toHaveCount(1);
  });

  test('TC-HC20-03 a deleted saved address is gone from the list and from checkout', async ({ page }) => {
    await page.getByRole('button', { name: 'Delete Parents' }).click();
    await expect(page.getByText('Vung Tau Road')).toHaveCount(0);
    await nav(page, 'Menu').click();
    await expect(page.locator('.row-opt').filter({ hasText: 'Parents' })).toHaveCount(0);
  });

  test('TC-HC21-01 change password: the new one logs in, the old one does not', async ({ page }) => {
    await registerAccount(page, 'nhung@example.com', 'Kem12345', URL);
    await nav(page, 'Account').click();
    await page.getByLabel('Current password').fill('Kem12345');
    await page.getByLabel('New password').fill('Kem54321');
    await page.getByRole('button', { name: 'Save password' }).click();
    await expect(page.getByText('Password changed.')).toBeVisible();
    await page.getByRole('button', { name: 'Log out' }).click();
    await loginWith(page, 'nhung@example.com', 'Kem12345');
    await expect(page.getByRole('alert')).toBeVisible();
    await loginWith(page, 'nhung@example.com', 'Kem54321');
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC21-07 a Google or Facebook user has no Change password', async ({ page }) => {
    await expect(page.getByText('Change password')).toHaveCount(0);
  });

  test('TC-HC22-01 switching to Vietnamese shows Vietnamese', async ({ page }) => {
    await page.getByRole('button', { name: 'Tiếng Việt' }).click();
    await expect(nav(page, 'Tài khoản')).toBeVisible();
    await expect(nav(page, 'Thực đơn')).toBeVisible();
  });

  test('TC-HC22-06 a new user starts in Vietnamese', async ({ page }) => {
    knownGap(test, 'the mock-up starts in English so that the other tests can run in English; the spec says new users start in Vietnamese');
    await expect(nav(page, 'Tài khoản')).toBeVisible();
  });
});

// =====================================================================
// HC-23  Feedback (Feedback spec)
// =====================================================================
test.describe('Feedback', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await nav(page, 'Account').click();
    await page.getByRole('button', { name: 'Order history' }).click();
  });

  const openForm = async (page, id) => {
    await historyCard(page, id).getByRole('button', { name: 'Rate this order' }).click();
    await expect(page.getByRole('dialog', { name: 'Rate your order' })).toBeVisible();
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
      await expect(page.getByRole('dialog').getByText(label, { exact: true })).toBeVisible();
    }
  });

  test('TC-HC23-04 four stars: 4 filled, six positive options', async ({ page }) => {
    await openForm(page, 'HC-2031');
    await star(page, 4).click();
    await expect(page.locator('.star.on')).toHaveCount(4);
    expect(await fbChips(page).allTextContents()).toEqual(['Delicious flavor', 'Smooth & creamy', 'Arrived cold & frozen', 'Great packaging', 'Fast delivery', 'Friendly driver']);
  });

  test('TC-HC23-06 two stars on a delivery order show six problem options', async ({ page }) => {
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
    await expect(page.getByRole('dialog').locator('.chip.on')).toHaveCount(2);
    await star(page, 2).click();
    await expect(fbChips(page)).toHaveCount(6);
    await expect(page.getByRole('dialog').locator('.chip.on')).toHaveCount(0);
  });

  test('TC-HC23-07 pick-up order hides the delivery-trip options', async ({ page }) => {
    await openForm(page, 'HC-2012');
    await star(page, 1).click();
    for (const hidden of ['Slow Delivery', 'Melted on Arrival']) await expect(page.getByRole('button', { name: hidden })).toHaveCount(0);
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
    await expect(notice(page)).toHaveText('Thanks! Your feedback has been sent.');
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
  });

  test('TC-HC23-14 a photo over 5 MB is refused with no thumbnail', async ({ page }) => {
    await openForm(page, 'HC-2031');
    await page.getByRole('button', { name: 'Demo: try a 6 MB file' }).click();
    await expect(page.getByRole('alert')).toHaveText('This photo is larger than 5 MB. Choose a smaller one.');
    await expect(page.locator('.ph')).toHaveCount(0);
  });

  test('TC-HC23-18 / TC-HC23-20 full feedback is sent once and cannot be sent again', async ({ page }) => {
    await openForm(page, 'HC-2031');
    await star(page, 2).click();
    await page.getByRole('button', { name: 'Slow Delivery' }).click();
    await page.locator('#fbc').fill('Melted a bit');
    await page.getByRole('button', { name: 'Add photo' }).click();
    await send(page).click();
    await expect(notice(page)).toHaveText('Thanks! Your feedback has been sent.');
    await expect(historyCard(page, 'HC-2031').getByText('Feedback sent')).toBeVisible();
    await expect(historyCard(page, 'HC-2031').getByRole('button', { name: 'Rate this order' })).toHaveCount(0);
  });

  test('TC-HC23-16 a PDF is refused as a photo', async ({ page }) => {
    knownGap(test, 'photos are simulated; there is no file picker or type check');
    await openForm(page, 'HC-2031');
    await expect(page.locator('input[type=file]')).toHaveCount(1);
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
    await expect(panel(page)).toBeVisible();
    await expect(items(page)).toHaveCount(3);
    const first = items(page).first();
    await expect(first).toContainText('HC-2031');
    await expect(first).toContainText('2 days ago');
    await expect(first).toContainText('Order Delivered! 🍦');
    await expect(first).toContainText('How was your ice cream? Leave a quick review to help us serve you better!');
    await expect(first.locator('svg').first()).toBeVisible();
    await expect(first.locator('.sr')).toHaveText('Unread');
    await expect(items(page).last().locator('.sr')).toHaveCount(0);
  });

  test('TC-HC25-09 the list closes when the bell is pressed again or when tapping outside', async ({ page }) => {
    await bell(page).click();
    await expect(panel(page)).toBeVisible();
    await bell(page).click({ force: true });
    await expect(panel(page)).toBeHidden();
    await bell(page).click();
    await page.getByRole('button', { name: 'Close notifications' }).click({ position: { x: 20, y: 400 } });
    await expect(panel(page)).toBeHidden();
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC26-06 / TC-HC26-07 / TC-HC26-08 mark all as read clears the badge; items stay listed', async ({ page }) => {
    await bell(page).click();
    await panel(page).getByRole('button', { name: 'Mark all as read' }).click();
    await expect(panel(page).locator('.nitem.unread')).toHaveCount(0);
    await expect(panel(page).getByRole('button', { name: 'Mark all as read' })).toHaveCount(0);
    await expect(items(page)).toHaveCount(3);
    await expect(page.locator('.badge')).toHaveCount(0);
    await expect(bell(page)).toHaveAttribute('aria-label', 'Notifications');
  });

  test('TC-HC24-03 / TC-HC26-03 tapping a feedback item marks it read and opens the form', async ({ page }) => {
    const before = await bellUnread(page);
    await bell(page).click();
    await items(page).first().click();
    await expect(page.getByRole('dialog', { name: 'Rate your order' })).toBeVisible();
    await expect(page.getByRole('dialog', { name: 'Rate your order' }).getByText('Order HC-2031')).toBeVisible();
    expect(await bellUnread(page)).toBe(before - 1);
  });

  test('TC-HC26-04 / TC-HC24-11 a feedback item for a rated order shows the notice and no form', async ({ page }) => {
    await bell(page).click();
    await items(page).first().click();
    await page.getByRole('button', { name: /^5 stars/ }).click();
    await page.getByRole('button', { name: 'Send feedback' }).click();
    await bell(page).click();
    await items(page).first().click();
    await expect(page.getByRole('dialog', { name: 'Rate your order' })).toBeHidden();
    await expect(notice(page)).toHaveText('Feedback for HC-2031 was already sent.');
    await expect(historyCard(page, 'HC-2031').getByText('Feedback sent')).toBeVisible();
  });

  test('TC-HC26-05 / TC-HC24-10 a feedback item after the 7-day window says the window ended', async ({ page }) => {
    await bell(page).click();
    await items(page).last().click();
    await expect(page.getByRole('dialog', { name: 'Rate your order' })).toBeHidden();
    await expect(notice(page)).toHaveText('The 7-day window to rate HC-1987 has ended.');
  });

  test('TC-HC18-01 / TC-HC18-08 / TC-HC26-01 a status change adds an unread item; tapping it opens Active orders', async ({ page }) => {
    await nav(page, 'Menu').click();
    await checkoutBtn(page).click();
    await nav(page, 'Account').click();
    await page.getByRole('button', { name: 'Demo: next status' }).click();
    const unread = await bellUnread(page);
    await bell(page).click();
    await expect(items(page).first()).toContainText('Preparing your order');
    await expect(items(page).first()).toHaveClass(/unread/);
    await items(page).first().click();
    await expect(panel(page)).toBeHidden();
    await expect(page.getByRole('button', { name: 'Active orders' })).toHaveClass(/\bon\b/);
    await expect(page.getByText(/^Order HC-\d+$/)).toBeVisible();
    expect(await bellUnread(page)).toBe(unread - 1);
  });

  test('TC-HC18-13 status item texts match the matrix', async ({ page }) => {
    knownGap(test, 'texts are "Order received", "Preparing your order", "Out for delivery" instead of "We got your order HC-…", "Your order HC-… is being prepared.", "… is on its way."');
    await nav(page, 'Menu').click();
    await checkoutBtn(page).click();
    await bell(page).click();
    await expect(items(page).first()).toContainText(/We got your order HC-\d+\./);
  });

  test('TC-HC24-07 / TC-HC24-12 / TC-HC18-09 at Completed only the feedback item is added', async ({ page }) => {
    await nav(page, 'Menu').click();
    await checkoutBtn(page).click();
    await nav(page, 'Account').click();
    const next = page.getByRole('button', { name: 'Demo: next status' });
    await next.click();
    await next.click();
    await bell(page).click();
    await expect(items(page).filter({ hasText: 'Order Delivered!' })).toHaveCount(2); // seeded items only
    await bell(page).click({ force: true });
    await next.click();
    await bell(page).click();
    await expect(items(page).first()).toContainText('Order Delivered! 🍦');
    await expect(items(page).first()).toContainText('How was your ice cream? Leave a quick review to help us serve you better!');
    await expect(items(page).filter({ hasText: 'Order Delivered!' })).toHaveCount(3);
    await expect(items(page).filter({ hasText: /Order Completed|\bCompleted\b/ })).toHaveCount(1); // the seeded pick-up item only
  });

  test('TC-HC24-14 / TC-HC27-03 a push banner shows when push is on and opens the feedback form', async ({ page }) => {
    await nav(page, 'Menu').click();
    await checkoutBtn(page).click();
    await nav(page, 'Account').click();
    const next = page.getByRole('button', { name: 'Demo: next status' });
    await next.click(); await next.click(); await next.click();
    await expect(pushBanner(page)).toBeVisible();
    await expect(pushBanner(page)).toContainText('Order Delivered! 🍦');
    await pushBanner(page).click();
    await expect(page.getByRole('dialog', { name: 'Rate your order' })).toBeVisible();
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
    await nav(page, 'Menu').click();
    await checkoutBtn(page).click();
    await expect(pushBanner(page)).toHaveCount(0);
    await bell(page).click();
    await expect(items(page)).toHaveCount(4);
    await expect(items(page).first()).toHaveClass(/unread/);
  });

  test('TC-HC27-04 there are no settings inside the bell list', async ({ page }) => {
    await bell(page).click();
    await expect(panel(page).getByRole('switch')).toHaveCount(0);
    await expect(panel(page).getByText(/Push notifications/)).toHaveCount(0);
  });

  test('TC-HC27-06 the switch is remembered after log out and in', async ({ page }) => {
    await nav(page, 'Account').click();
    await page.getByRole('switch', { name: 'Push notifications' }).click();
    await page.getByRole('button', { name: 'Log out' }).click();
    await page.getByRole('button', { name: /Continue with Google/ }).click();
    await nav(page, 'Account').click();
    await expect(page.getByRole('switch', { name: 'Push notifications' })).not.toBeChecked();
  });

  test('TC-HC25-04 the badge stays readable above 9 unread', async ({ page }) => {
    for (let i = 0; i < 2; i++) {
      await nav(page, 'Menu').click();
      await page.getByRole('button', { name: 'Add Mint Cloud Cup' }).click();
      await checkoutBtn(page).click();
      await nav(page, 'Account').click();
      const next = page.getByRole('button', { name: 'Demo: next status' });
      await next.click(); await next.click(); await next.click();
    }
    expect(await bellUnread(page)).toBeGreaterThan(9);
    await expect(page.locator('.badge')).toHaveText('9+');
  });
});

// =====================================================================
// Authentication (HC-2, HC-3)
// =====================================================================
test.describe('Authentication (more cases)', () => {
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
  });

  test('TC-HC2-12 logging in before verifying the email asks to verify first', async ({ page }) => {
    await signUp(page);
    await page.reload();
    await loginWith(page, 'nhung@example.com', 'Kem12345');
    await expect(alert(page)).toContainText('Verify your email first');
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
  });

  test('TC-HC2-16 the correct code on the fifth try is accepted', async ({ page }) => {
    await signUp(page);
    for (let i = 0; i < 4; i++) await verify(page, '000000');
    await verify(page, '123456');
    await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
  });

  test('TC-HC3-01 a reset code can be requested', async ({ page }) => {
    await registeredAndLoggedOut(page);
    expect(await requestReset(page, 'nhung@example.com')).toMatch(/^\d{6}$/);
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
    await page.goto(URL);
    await requestReset(page, 'nobody@example.com');
    await expect(page.locator('[data-note]')).toContainText('If this email has an account, we sent a 6-digit code to nobody@example.com');
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
  });
});

// =====================================================================
// Language (HC-22) and Home (HC-5)
// =====================================================================
test.describe('Language (more cases)', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); });

  test('TC-HC5-08 icon labels follow the language', async ({ page }) => {
    await goVietnamese(page);
    await nav(page, 'Trang chủ').click();
    for (const label of ['Bán chạy', 'Cốc', 'Ốc quế', 'Hộp mang đi']) await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
  });
  test('TC-HC22-02 the language is remembered after reopening', async ({ page }) => {
    await goVietnamese(page);
    await page.reload();
    await expect(nav(page, 'Trang chủ')).toBeVisible();
  });
  test('TC-HC22-03 switching from Vietnamese back to English shows English', async ({ page }) => {
    await goVietnamese(page);
    await page.getByRole('button', { name: 'English' }).click();
    await expect(nav(page, 'Home')).toBeVisible();
  });
  test('TC-HC22-04 error messages follow the language', async ({ page }) => {
    await goVietnamese(page);
    await page.getByRole('button', { name: 'Đăng xuất' }).click();
    await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
    await expect(alert(page)).toHaveText('Vui lòng nhập địa chỉ email.');
  });
  test('TC-HC22-05 product names and prices keep their format after a language switch', async ({ page }) => {
    await goVietnamese(page);
    await nav(page, 'Thực đơn').click();
    await expect(page.getByText('Mint Cloud Cup').first()).toBeVisible();
    await expect(page.getByText('25,000đ').first()).toBeVisible();
  });
});

// =====================================================================
// Delivery fee, hours and pick-up slots (HC-10, HC-12, HC-13)
// =====================================================================
test.describe('Delivery and pick-up (more cases)', () => {
  test.beforeEach(async ({ page }) => { await signIn(page); });
  const slotBtn = (page, t) => cart(page).getByRole('button', { name: t, exact: true });

  test('TC-HC10-02 fee just under 2 km is 15,000đ', async ({ page }) => { expect(await feeAt(page, 1.99)).toBe('15,000đ'); });
  test('TC-HC10-03 fee at exactly 2 km is 25,000đ', async ({ page }) => { expect(await feeAt(page, 2.0)).toBe('25,000đ'); });
  test('TC-HC10-04 fee just under 5 km is 25,000đ', async ({ page }) => { expect(await feeAt(page, 4.99)).toBe('25,000đ'); });
  test('TC-HC10-05 fee at exactly 5 km is 35,000đ', async ({ page }) => { expect(await feeAt(page, 5.0)).toBe('35,000đ'); });
  test('TC-HC10-06 fee at exactly 10 km is 35,000đ and the order can be placed', async ({ page }) => {
    expect(await feeAt(page, 10.0)).toBe('35,000đ');
    await expect(checkoutBtn(page)).toBeEnabled();
  });
  test('TC-HC10-07 just over 10 km (10.01) cannot be ordered to', async ({ page }) => {
    await feeAt(page, 10.01);
    await expect(alert(page)).toHaveText('Sorry, this address is outside our 10km delivery coverage.');
    await expect(checkoutBtn(page)).toBeDisabled();
  });

  test('TC-HC10-15 with no address the order cannot continue', async ({ page }) => {
    await nav(page, 'Account').click();
    for (const name of ['Home', 'Office', 'Parents']) await page.getByRole('button', { name: 'Delete ' + name }).click();
    await nav(page, 'Menu').click();
    await expect(alert(page)).toContainText('Add a delivery address');
    await expect(checkoutBtn(page)).toBeDisabled();
  });

  for (const [id, iso, closed] of [['TC-HC10-16', '2026-11-09T07:59:00', true], ['TC-HC10-17', '2026-11-09T08:00:00', false], ['TC-HC10-19', '2026-11-09T22:00:00', true]]) {
    test(`${id} delivery at ${iso.slice(11, 16)} is ${closed ? 'disabled and the next opening time is shown' : 'available'}`, async ({ page }) => {
      await atTime(page, iso);
      await nav(page, 'Menu').click();
      const delivery = cart(page).getByRole('button', { name: 'Delivery', exact: true });
      if (closed) {
        await expect(delivery).toBeDisabled();
        await expect(alert(page)).toContainText('Next opening: 08:00');
      } else {
        await expect(delivery).toBeEnabled();
        await expect(checkoutBtn(page)).toBeEnabled();
      }
    });
  }

  test('TC-HC10-18 a delivery order at 21:59 can be placed', async ({ page }) => {
    await atTime(page, '2026-11-09T21:59:00');
    await nav(page, 'Menu').click();
    await checkoutBtn(page).click();
    await expect(page.getByText("Order received. We'll text you when it's on the way.")).toBeVisible();
  });

  test('TC-HC12-11 a double tap on Checkout creates one order', async ({ page }) => {
    await nav(page, 'Menu').click();
    await checkoutBtn(page).dblclick();
    await nav(page, 'Account').click();
    await expect(page.getByText(/^Order HC-\d+$/)).toHaveText('Order HC-2049');
  });

  const pickup = async (page, iso) => {
    await atTime(page, iso);
    await nav(page, 'Menu').click();
    await cart(page).getByRole('button', { name: 'Pick-up', exact: true }).click();
  };
  test('TC-HC13-03 there is no slot before opening (07:00): the first slot is 08:00', async ({ page }) => {
    await pickup(page, '2026-11-09T07:00:00');
    await expect(slotBtn(page, '08:00')).toBeVisible();
    await expect(slotBtn(page, '07:30')).toHaveCount(0);
  });
  test('TC-HC13-04 there is no slot after closing (20:00)', async ({ page }) => {
    await pickup(page, '2026-11-09T20:00:00');
    await expect(slotBtn(page, '20:30')).toBeVisible();
    await expect(slotBtn(page, '22:15')).toHaveCount(0);
  });
  test('TC-HC13-08 with the shop closed there are no slots and a message explains why', async ({ page }) => {
    await pickup(page, '2026-11-09T23:00:00');
    await expect(alert(page)).toContainText('No pick-up slots are left today');
    await expect(checkoutBtn(page)).toBeDisabled();
  });
  test('TC-HC13-12 a slot 29 minutes away is not offered', async ({ page }) => {
    await pickup(page, '2026-11-09T10:01:00');
    await expect(slotBtn(page, '10:30')).toHaveCount(0);
    await expect(slotBtn(page, '10:45')).toBeVisible();
  });

  test('TC-HC14-06 the status is kept after a refresh', async ({ page }) => {
    await nav(page, 'Menu').click();
    await cart(page).getByRole('button', { name: 'Pick-up', exact: true }).click();
    await checkoutBtn(page).click();
    await nav(page, 'Account').click();
    await page.getByRole('button', { name: 'Demo: next status' }).click();
    await page.getByRole('button', { name: 'Demo: next status' }).click();
    await page.reload();
    await nav(page, 'Account').click();
    await expect(page.locator('.bd', { hasText: 'Ready for pick-up' })).toBeVisible();
  });
});

// =====================================================================
// Stores (HC-15)
// =====================================================================
test.describe('Stores (more cases)', () => {
  const stores = async (page, iso) => { await atTime(page, iso); await signIn(page); await nav(page, 'Stores').click(); };
  test('TC-HC15-04 a branch shows as closed at 07:59 and at 22:00', async ({ page }) => {
    await stores(page, '2026-11-09T07:59:00');
    await expect(page.locator('.bd', { hasText: 'Closed' })).toHaveCount(3);
    await atTime(page, '2026-11-09T22:00:00');
    await nav(page, 'Home').click();
    await nav(page, 'Stores').click();
    await expect(page.locator('.bd', { hasText: 'Closed' })).toHaveCount(3);
  });
  test('TC-HC15-08 a branch still shows "Open now" at 21:29', async ({ page }) => {
    await stores(page, '2026-11-09T21:29:00');
    await expect(page.locator('.bd', { hasText: 'Open now' })).toHaveCount(3);
    await expect(page.locator('.bd', { hasText: 'Closing soon' })).toHaveCount(0);
  });
});

// =====================================================================
// Order history (HC-19), Account (HC-20, HC-21), Notifications (HC-25, HC-26)
// =====================================================================
test.describe('Account and history (more cases)', () => {
  test('TC-HC19-02 an empty history shows an empty list', async ({ page }) => {
    await register(page);
    await nav(page, 'Account').click();
    await page.getByRole('button', { name: 'Order history' }).click();
    await expect(page.getByText('No past orders yet.')).toBeVisible();
  });

  test('TC-HC19-04 the history total matches the total paid at checkout', async ({ page }) => {
    await signIn(page);
    await nav(page, 'Menu').click();
    const total = (await readSummary(page)).Total;
    await checkoutBtn(page).click();
    await nav(page, 'Account').click();
    const next = page.getByRole('button', { name: 'Demo: next status' });
    await next.click(); await next.click(); await next.click();
    await page.getByRole('button', { name: 'Order history' }).click();
    await expect(page.locator('div.card').filter({ hasText: /Order HC-2049/ })).toContainText(total);
  });

  test('TC-HC20-04 several saved addresses are listed and can be chosen', async ({ page }) => {
    await signIn(page);
    await addSavedAddress(page, 'Gym', '1 Le Duan, District 1', 3.5);
    for (const name of ['Home', 'Office', 'Parents', 'Gym']) await expect(page.locator('.row-opt').filter({ hasText: name })).toHaveCount(1);
  });

  test('TC-HC20-05 saving an empty address shows an error', async ({ page }) => {
    await signIn(page);
    await nav(page, 'Account').click();
    await page.getByRole('button', { name: 'Add address' }).click();
    await expect(alert(page)).toHaveText('Enter an address.');
    await expect(page.getByRole('button', { name: /^Delete / })).toHaveCount(3);
  });

  test('TC-HC20-07 a saved address over 10 km warns at checkout and cannot be ordered to', async ({ page }) => {
    await signIn(page);
    await nav(page, 'Menu').click();
    await page.locator('.row-opt').filter({ hasText: 'Parents' }).click();
    await expect(alert(page)).toHaveText('Sorry, this address is outside our 10km delivery coverage.');
    await expect(checkoutBtn(page)).toBeDisabled();
  });

  const changePassword = async (page, current, next) => {
    await register(page);
    await nav(page, 'Account').click();
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
    await expect(page.getByText('Password changed.')).toBeVisible();
  });
  test('TC-HC21-08 a new password equal to the old one is refused', async ({ page }) => {
    await changePassword(page, 'Kem12345', 'Kem12345');
    await expect(alert(page)).toContainText('different');
  });

  test('TC-HC25-03 no badge when everything is read', async ({ page }) => {
    await signIn(page);
    await bell(page).click();
    await panel(page).getByRole('button', { name: 'Mark all as read' }).click();
    await expect(page.locator('.badge')).toHaveCount(0);
  });

  test('TC-HC25-07 a new account sees the empty list message', async ({ page }) => {
    await register(page);
    await bell(page).click();
    await expect(page.getByText('No notifications yet. Order updates and rating requests will show up here.')).toBeVisible();
  });

  test('TC-HC25-11 the list in Vietnamese', async ({ page }) => {
    await signIn(page);
    await goVietnamese(page);
    await page.getByRole('button', { name: /^Thông báo/ }).click();
    await expect(page.getByRole('button', { name: 'Đánh dấu tất cả đã đọc' })).toBeVisible();
  });

  test('TC-HC24-13 the feedback notification in Vietnamese', async ({ page }) => {
    await signIn(page);
    await goVietnamese(page);
    await page.getByRole('button', { name: /^Thông báo/ }).click();
    await expect(items(page).first()).toContainText('Đơn hàng đã hoàn thành! 🍦');
    await expect(items(page).first()).toContainText('Bạn thấy kem hôm nay thế nào? Chia sẻ phản hồi ngay để giúp shop nâng cao dịch vụ nhé!');
  });

  test('TC-HC26-09 the read state is kept after a refresh', async ({ page }) => {
    await signIn(page);
    await bell(page).click();
    await panel(page).getByRole('button', { name: 'Mark all as read' }).click();
    await page.reload();
    await expect(page.locator('.badge')).toHaveCount(0);
  });
});
