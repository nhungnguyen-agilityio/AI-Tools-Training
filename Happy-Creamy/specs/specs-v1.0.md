**Sections** [I. Overview](#s1) [II. Auth & permissions](#s2) [III. Menu data model](#s3) [IV. Business rules](#s4) [V. UI & navigation](#s5) [VI. Out of MVP scope](#s6)

SOFTWARE REQUIREMENT SPECIFICATION

# Happy Creamy Web Application

Platform **Responsive web, desktop and mobile**Version **1.0 (MVP)**Updated **6 Nov 2026**

Ice cream ordering for Vietnam, with in-house delivery, store pick-up and four payment methods, in Vietnamese and English.

## I. Overview & third-party integrations

- **Target browsers:** Safari, Chrome, Edge and Firefox on mobile and desktop.
- **Authentication:** Email/Password, Google Sign-In SDK, Facebook Login SDK. Sign-in is mandatory to access the app.
- **Payment methods:** COD, MoMo Wallet API, VietQR (QR Bank Auto), and Visa/Mastercard through the VNPay gateway.
- **Languages:** Vietnamese and English. Users can switch language in the app.
- **Logistics:** in-house fleet. Distance and fee are calculated automatically with the Google Maps API. No third-party dispatch API is used.
- **Currency:** all prices are in VND, whole dong, no decimals.
- **Notifications:** browser push notifications plus an in-app notification list opened from a bell icon. No email or SMS is sent.
- **Order feedback:** customers rate completed orders with stars, predefined options, a comment and photos.

## II. Authentication & permissions

### 1. Authentication flow

- One-touch social login with Google or Facebook (OAuth 2.0).
- Registration and login with email and password. Password reset is verified by a one-time code (OTP) sent to the user's email.
- Accounts created with email and password must verify their email address with an OTP before their first sign-in. Google and Facebook accounts use the provider's verified identity and skip this step.
- **OTP rules:** every OTP (sign-up and password reset) is valid for 10 minutes and allows 5 wrong tries. After the 5th wrong try the code is locked and the user must request a new one.
- **One account per email:** if a customer signed up with email and later signs in with Google or Facebook using the same email address, they enter the same account. Order history and saved addresses are kept.
- Users who are not signed in are redirected to the sign-in screen from every route.

### 2. Browser permissions

- **Geolocation API (required):** detects the user's address, finds the nearest branch and sets the delivery destination. If permission is denied, the user can type an address instead.
- **Browser push notifications (optional):** real-time order status updates and the request to rate a completed order. Promotional notifications are not in the MVP. iOS Safari only supports web push after the site is added to the Home Screen, so the prompt is shown there only in that case. If push is blocked or switched off, nothing else is sent (no email or SMS), and the in-app notification list still fills (Section V).

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

**Sold-out products:** a product can be marked sold out per branch. A sold-out card is greyed out with the label "Sold out" and cannot be added to the cart.

## IV. Business rules & constraints

### 1. Purchasing & payment

- **Minimum order:** delivery orders need at least 30,000 VND of items, before the delivery and packaging fees. Pick-up orders have no minimum.
- **Payment holding window:** MoMo, VietQR and Visa/Mastercard (VNPay) orders wait 10 minutes for the IPN/webhook confirmation. With no confirmation, the order is cancelled automatically. COD orders have no holding window. If a payment arrives after the order was cancelled, the order stays cancelled and store staff refund the customer by hand (refunds are not handled in the app).
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
- **Operating hours:** all branches open 08:00 to 22:00. Delivery orders can be placed only while the nearest branch is open, with no cut-off before closing. Outside those hours the Delivery option is disabled and shows the next opening time.

### Worked example

Items 85,000 VND, delivery, 4.2 km, no tubs. Delivery fee is 25,000 (2 to 5 km tier). Packaging is 10,000 (over 3 km). Total payable = 85,000 + 10,000 + 25,000 = **120,000 VND**. Try your own numbers:

Items total (VND) Order type Distance (km) [ ] Contains a Take-away Tub

## V. UI structure & navigation logic

Header navigation on desktop, bottom navigation bar on mobile:

```
[ HOME ] | [ MENU ] | [ STORES ] | [ ACCOUNT ]          (bell icon in the header)
```

### Tab 1: Home (`/`)

- **Promotional banner:** carousel of new products and seasonal offers. In the MVP banners are display only; tapping a banner does nothing.
- **Quick access icons:** Best-Sellers, Cups, Cones, Take-away Tubs. Each opens `/menu` with that category filter applied.
- **Primary call-to-action:** "Order Now" opens `/menu` in its default state.

### Tab 2: Menu & ordering (`/menu`, `/checkout`)

**Product list and detail**

- **Category tabs:** All, New Arrivals, Best-Sellers, Cups, Cones, Take-away Tubs, Beverages. Toppings are not a category; they are options inside a product.
- **Product card:** image, name, base price, and badges (New, Hot, Best-Seller). Sold-out products are greyed out (Section III).
- **Customization:** size, toppings and special notes, in a modal or detail page.

**Cart and checkout (`/checkout`)**

- **Cart:** kept on the customer's account, so it is still there after logout or on another device. Adding the same product with the same size, toppings and note again increases the quantity of the existing line. Any difference creates a separate line.
- **Order type toggle**
  - **Delivery:** the fee is calculated from the user's geolocation or saved address using the distance tiers in Section IV, and checked against the 10 km limit.
  - **Pick-up:** the user chooses a branch and a scheduled time slot. Slots are 15 minutes long and fall within the branch's opening hours. Pick-up can be booked for today only, and the first slot is at least 30 minutes from now. Delivery fee is 0 VND. A ready order has no time limit in the app.
- **Payment methods:** COD, MoMo, VietQR, Visa/Mastercard (VNPay).
- **Total payable** = items total + insulated packaging fee (if applicable) + delivery fee.

### Tab 3: Store locator (`/stores`)

- **Map:** nearby branches on an interactive Google Maps view, positioned with the Browser Geolocation API.
- **Branch list:** address, distance in km, live status (Open Now, or Closing Soon in the last 30 minutes before closing), a "Get Directions" button that opens Google Maps, and a "Call Store" hotline link.

### Tab 4: Account & orders (`/account`)

**Order management (`/account/orders`)**

- **Active Orders tab:** status timeline for in-house deliveries and scheduled pick-ups. Store staff update the status and the customer is notified on each change (see Notifications below).
- **Order History tab:** all past completed orders, each with a "Rate this order" button or a "Feedback sent" label. Orders cancelled for non-payment are not listed.

| Order type | Status flow |
| --- | --- |
| Delivery | Received → Preparing → Out for delivery → Completed |
| Pick-up | Received → Preparing → Ready for pick-up → Completed |
| Online payment | Awaiting payment → Received (or Cancelled after 10 minutes) |

**Account settings**

- **Profile and saved addresses:** name, email and saved delivery addresses. An address outside the 10 km delivery area can be saved; at checkout a warning shows and Delivery cannot be placed to it.
- **Notifications:** a switch for browser push notifications. It turns push on or off only; the in-app list is not affected.
- **Language:** Vietnamese or English. A new user starts in Vietnamese.
- **Password change and logout:** the new password cannot be the same as the current one. Customers who signed in with Google or Facebook have no password here, so "Change password" is hidden for them.

### Notifications (bell icon)

- **Bell icon:** shown in the header of the main screens (Home, Menu, Stores, Account), on desktop and mobile. A badge shows the number of unread notifications and disappears when there are none.
- **Notification list (`/notifications`):** opens from the bell. Newest first, unread items highlighted. Each item shows an icon, a short message, the order number and the time. If there are none, an empty message is shown.
- **Opening an item:** marks it as read and opens the order in Active Orders (or in Order History once the order is completed), or the feedback form for a feedback request. "Mark all as read" clears the badge.
- **When one is created:** on each order status change except Completed (see the table). When an order becomes Completed the customer gets the feedback request only, not a status notification. The list fills even when browser push is blocked or switched off.

| Event | Message (English) |
| --- | --- |
| Payment confirmed or COD placed (Received) | We got your order HC-2048. |
| Preparing | Your order HC-2048 is being prepared. |
| Out for delivery | Your order HC-2048 is on its way. |
| Ready for pick-up | Your order HC-2031 is ready for pick-up. |
| Cancelled (no payment in 10 minutes) | We didn't get your payment in 10 minutes, so we cancelled order HC-2048. |
| Completed (feedback request) | Order Delivered! 🍦 How was your ice cream? Leave a quick review to help us serve you better! |

Vietnamese feedback request: Đơn hàng đã hoàn thành! 🍦 Bạn thấy kem hôm nay thế nào? Chia sẻ phản hồi ngay để giúp shop nâng cao dịch vụ nhé! Order numbers such as HC-2048 are samples.

### Order feedback

- **Who and when:** a signed-in customer can rate a completed order from Order History or from the feedback notification, within 7 days of completion. One feedback per order. It cannot be edited or deleted. Cancelled orders cannot be rated.
- **Rating (required):** 1 to 5 stars. Labels: Very bad, Bad, Okay, Good, Great.
- **Predefined options (optional, select any):** the list depends on the rating. Changing the rating clears the selected options.
- **Comment (optional):** up to 500 characters.
- **Photos (optional):** up to 3 photos, 5 MB each, JPG, PNG or WebP.
- **Pick-up orders:** options about the delivery trip (marked below) are hidden.
- Feedback export and review are handled in the separate Admin web app.

| Shown at | Options | Delivery only |
| --- | --- | --- |
| 4 and 5 stars | Delicious flavor, Smooth & creamy, Arrived cold & frozen, Great packaging, Fast delivery, Friendly driver | Arrived cold & frozen, Fast delivery, Friendly driver |
| 1, 2 and 3 stars | Melted on arrival, Too sweet / Too icy, Wrong item / Missing toppings, Slow delivery, Messy packaging, Unfriendly driver | Melted on arrival, Slow delivery, Unfriendly driver |

## VI. Out of MVP scope

| Feature | Note |
| --- | --- |
| Customer cancellation and refunds | Not in the MVP. The only cancellation is the automatic cancel of an unpaid online order after 10 minutes (Section IV). |
| Live rider map | Order tracking is a status timeline only (Section V). |
| Email and SMS notifications | Only browser push and the in-app list (Section V). |
| Promotional notifications | Push is for order status and the feedback request only. |
| Clickable banners | Banners are display only in the MVP (Section V). |
| Editing feedback, public reviews, feedback export | Feedback cannot be edited or shown to other customers. Export and management are in the Admin web app. |