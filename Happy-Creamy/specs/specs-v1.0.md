**Sections** [I. Overview](#s1) [II. Auth & permissions](#s2) [III. Menu data model](#s3) [IV. Business rules](#s4) [V. UI & navigation](#s5) [VI. Out of MVP scope](#s6)

SOFTWARE REQUIREMENT SPECIFICATION

# Happy Creamy Web Application

Platform **Responsive web, desktop and mobile**Version **1.0 (MVP)**Updated **5 Nov 2026**

Ice cream ordering for Vietnam, with in-house delivery, store pick-up and four payment methods, in Vietnamese and English.

## I. Overview & third-party integrations

- **Target browsers:** Safari, Chrome, Edge and Firefox on mobile and desktop.
- **Authentication:** Email/Password, Google Sign-In SDK, Facebook Login SDK. Sign-in is mandatory to access the app.
- **Payment methods:** COD, MoMo Wallet API, VietQR (QR Bank Auto), and Visa/Mastercard through the VNPay gateway.
- **Languages:** Vietnamese and English. Users can switch language in the app.
- **Logistics:** in-house fleet. Distance and fee are calculated automatically with the Google Maps API. No third-party dispatch API is used.
- **Currency:** all prices are in VND, whole dong, no decimals.

## II. Authentication & permissions

### 1. Authentication flow

- One-touch social login with Google or Facebook (OAuth 2.0).
- Registration and login with email and password. Password reset is verified by a one-time code (OTP) sent to the user's email.
- Accounts created with email and password must verify their email address with an OTP before their first sign-in. Google and Facebook accounts use the provider's verified identity and skip this step.
- Users who are not signed in are redirected to the sign-in screen from every route.

### 2. Browser permissions

- **Geolocation API (required):** detects the user's address, finds the nearest branch and sets the delivery destination. If permission is denied, the user can type an address instead.
- **Browser push notifications (optional):** real-time order status updates and promotions. iOS Safari only supports web push after the site is added to the Home Screen, so the prompt is shown there only in that case.

## III. Menu data model & product configuration

### 1. Product categories

| Category | Description |
| --- | --- |
| New Arrivals | Seasonal and promotional flavors. |
| Best-Sellers | Top-performing products across all branches. |
| Cups | Ice cream in insulated paper or plastic cups. |
| Cones | Ice cream in crispy waffle cones. |
| Take-away Tubs | Pre-packed 400 ml or 1 litre tubs, shipped with dry ice thermal packaging. |
| Beverages | Milkshakes, floats and smoothies. |

### 2. Product modifiers & options

**Size (required, select 1)**

| Size | Scoops | Price |
| --- | --- | --- |
| S | 1 | Base price |
| M | 2 | +15,000 VND |
| L | 3 | +25,000 VND |

Scoop sizes apply to Cups and Cones. Tubs are sold as 400 ml or 1 litre variants, each with its own price. Beverages use a single size in the MVP. Toppings apply to Cups, Cones and Beverages. Tubs do not take toppings.

**Toppings (optional, select any number)**

| Group | Items | Price each |
| --- | --- | --- |
| Drizzles | Chocolate Sauce, Strawberry Sauce, Caramel Sauce | +5,000 VND |
| Crunchy toppings | Roasted Almonds, Crushed Waffles, Sprinkles, Marshmallows | +7,000 VND |

**Special notes** (text, max 100 characters), for example "Include 2 plastic spoons" or "Less sweet please".

Line total = (base price + size surcharge + toppings) × quantity.

## IV. Business rules & constraints

### 1. Purchasing & payment

- **Minimum order:** delivery orders need at least 30,000 VND of items, before the delivery and packaging fees. Pick-up orders have no minimum.
- **Payment holding window:** MoMo, VietQR and Visa/Mastercard (VNPay) orders wait 10 minutes for the IPN/webhook confirmation. With no confirmation, the order is cancelled automatically. COD orders have no holding window.
- **Insulated packaging fee:** a flat 10,000 VND, charged once per order, when either of these is true:
  - the order is for delivery and the distance is over 3 km, or
  - the order contains at least one Take-away Tub, for delivery or pick-up.

### 2. Internal shipping & logistics

- **In-house dispatch:** store staff or internal shippers fulfil every delivery. The system never calls a third-party dispatch API.
- **Distance:** road distance from the nearest open branch to the delivery address, from the Google Maps Distance Matrix API.

**Delivery fee tiers**

| Distance (d) | Delivery fee |
| --- | --- |
| d \< 2 km | 15,000 VND |
| 2 km ≤ d \< 5 km | 25,000 VND |
| 5 km ≤ d ≤ 10 km | 35,000 VND |
| d > 10 km | Not deliverable |

- **Maximum radius:** 10 km from the nearest open branch, to protect quality. Beyond it the app shows: "Sorry, this address is outside our 10km delivery coverage."
- **Operating hours:** delivery orders can be placed only while the nearest branch is open (for example 08:30 to 21:30). Outside those hours the Delivery option is disabled and shows the next opening time.

### Worked example

Items 85,000 VND, delivery, 4.2 km, no tubs. Delivery fee is 25,000 (2 to 5 km tier). Packaging is 10,000 (over 3 km). Total payable = 85,000 + 10,000 + 25,000 = **120,000 VND**. Try your own numbers:

Items total (VND) Order type Distance (km) [ ] Contains a Take-away Tub

## V. UI structure & navigation logic

Header navigation on desktop, bottom navigation bar on mobile:

```
[ HOME ] | [ MENU ] | [ STORES ] | [ ACCOUNT ]
```

### Tab 1: Home (`/`)

- **Promotional banner:** carousel of new products and seasonal offers.
- **Quick access icons:** Best-Sellers, Cups, Cones, Take-away Tubs. Each opens `/menu` with that category filter applied.
- **Primary call-to-action:** "Order Now" opens `/menu` in its default state.

### Tab 2: Menu & ordering (`/menu`, `/checkout`)

**Product list and detail**

- **Category tabs:** All, New Arrivals, Best-Sellers, Cups, Cones, Take-away Tubs, Beverages. Toppings are not a category; they are options inside a product.
- **Product card:** image, name, base price, and badges (New, Hot, Best-Seller).
- **Customization:** size, toppings and special notes, in a modal or detail page.

**Cart and checkout (`/checkout`)**

- **Order type toggle**
  - **Delivery:** the fee is calculated from the user's geolocation or saved address using the distance tiers in Section IV, and checked against the 10 km limit.
  - **Pick-up:** the user chooses a branch and a scheduled time slot. Slots are 15 minutes long and fall within the branch's opening hours. Delivery fee is 0 VND.
- **Payment methods:** COD, MoMo, VietQR, Visa/Mastercard (VNPay).
- **Total payable** = items total + insulated packaging fee (if applicable) + delivery fee.

### Tab 3: Store locator (`/stores`)

- **Map:** nearby branches on an interactive Google Maps view, positioned with the Browser Geolocation API.
- **Branch list:** address, distance in km, live status (Open Now or Closing Soon), a "Get Directions" button that opens Google Maps, and a "Call Store" hotline link.

### Tab 4: Account & orders (`/account`)

**Order management (`/account/orders`)**

- **Active Orders tab:** status timeline for in-house deliveries and scheduled pick-ups. Store staff update the status and the customer is notified on each change.
- **Order History tab:** all past completed orders.

| Order type | Status flow |
| --- | --- |
| Delivery | Received → Preparing → Out for delivery → Completed |
| Pick-up | Received → Preparing → Ready for pick-up → Completed |
| Online payment | Awaiting payment → Received (or Cancelled after 10 minutes) |

**Account settings:** profile details, saved delivery addresses, password change and logout.

## VI. Out of MVP scope

| Feature | Note |
| --- | --- |
| Customer cancellation and refunds | Not in the MVP. The only cancellation is the automatic cancel of an unpaid online order after 10 minutes (Section IV). |
| Live rider map | Order tracking is a status timeline only (Section V). |