// Shared helpers for the Happy Creamy mock-up tests.
const { expect } = require('@playwright/test');

/** Marks a test that is expected to fail because the mock-up does not match the spec or test matrix yet.
 *  The test is reported as passed while the gap exists. When the mock-up is fixed, the test starts
 *  "passing unexpectedly" and fails the run, which is the signal to remove this marker. */
function knownGap(test, reason) {
  test.fail(true, 'Mock-up gap: ' + reason);
}

/** Reads the cost summary rows (Items, Insulated packaging, Delivery fee, Total) from the page. */
async function readSummary(page) {
  return page.evaluate(() => {
    const keys = ['Items', 'Insulated packaging', 'Delivery fee', 'Delivery fee (pick-up)', 'Total'];
    const out = {};
    document.querySelectorAll('div').forEach((d) => {
      const k = d.children;
      if (k.length === 2 && k[0].tagName === 'SPAN' && k[1].tagName === 'SPAN') {
        const label = k[0].textContent.trim();
        if (keys.includes(label)) out[label.startsWith('Delivery fee') ? 'Delivery fee' : label] = k[1].textContent.trim();
      }
    });
    return out;
  });
}

/** Reads the unread count from the bell's accessible name, for example "Notifications, 3 unread". */
async function bellUnread(page) {
  const label = await page.getByRole('button', { name: /^Notifications/ }).first().getAttribute('aria-label');
  const m = /(\d+) unread/.exec(label || '');
  return m ? Number(m[1]) : 0;
}

/** Signs up with email, verifies with the demo code 123456 and lands on Home (Mobile-index.html by default, or pass the Desktop url). */
async function registerAccount(page, email = 'nhung@example.com', pw = 'Kem12345', url = '/Mobile-index.html') {
  await page.goto(url);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole('button', { name: 'New here? Create an account' }).click();
  await page.locator('#email').fill(email);
  await page.locator('#pw').fill(pw);
  await page.getByRole('button', { name: 'Create account' }).click();
  await page.locator('#otp').fill('123456');
  await page.getByRole('button', { name: 'Verify and sign in' }).click();
  await expect(page.getByRole('heading', { name: 'Quick picks' })).toBeVisible();
}
/** Logs in with email and password from the sign-in screen. */
async function loginWith(page, email, pw) {
  await page.locator('#email').fill(email);
  await page.locator('#pw').fill(pw);
  await page.getByRole('button', { name: 'Log in' }).click();
}

module.exports = { expect, knownGap, readSummary, bellUnread, registerAccount, loginWith };
