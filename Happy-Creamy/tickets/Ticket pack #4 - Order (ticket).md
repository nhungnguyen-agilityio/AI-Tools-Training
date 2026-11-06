# Ticket pack #4 - Order

## Ticket 1: Review my cart

**User story**
- As a customer, I want to review and change my cart, so that I order the right things.

**Acceptance criteria**
- AC1 Given my cart has Mint Cloud Cup ×2, When I open the cart,
  Then I see each item with its options and line total.
- AC2 Given I am in the cart, When I tap + or − on an item,
  Then the quantity and the total change.
- AC3 Given an item has quantity 1, When I tap −,
  Then the item is removed.
- AC4 Given my cart is empty, When I open the cart,
  Then I see that it is empty and I cannot place an order.
- AC5 Given I have items in my cart, When I log out and log in again, on this or another device,
  Then my cart still has the same items.

**Scope:** Cart screen: change quantity, remove items, empty cart. The cart is kept on the account.

**Non-scope:** coupons and vouchers; saving the cart for later

## Ticket 2: Deliver to my address

**User story**
- As a customer, I want my order delivered to my address with a clear fee, so that I know the cost before I order.

**Acceptance criteria**
- AC1 Given I chose Delivery and my address is 1.4 km from the nearest branch, When I look at the fee,
  Then the delivery fee is 15,000đ.
- AC2 Given my address is exactly 2 km away, When I look at the fee,
  Then it is 25,000đ.
- AC3 Given my address is exactly 5 km away, When I look at the fee,
  Then it is 35,000đ.
- AC4 Given my address is 11.8 km away, When I look at the screen,
  Then I see "Sorry, this address is outside our 10km delivery coverage." and I cannot place the order.
- AC5 Given the nearest branch is closed (before 08:00 or from 22:00), When I open checkout,
  Then Delivery is disabled and I see the next opening time.
- AC6 Given I denied location access, When I open checkout,
  Then I can type my address myself.

**Scope:** Delivery address (location, saved or typed), road distance, 3 fee tiers, the 10 km limit, and delivery only in opening hours (every branch 08:00 to 22:00). In-house delivery only.

**Non-scope:** the order total (ticket 3); live rider map; third-party delivery apps

## Ticket 3: See the order total

**User story**
- As a customer, I want to see the full total before I order, so that there are no surprises.

**Acceptance criteria**
- AC1 Given items are 85,000đ, delivery, 4.2 km away, no tub, When I look at the total,
  Then it shows 85,000 + 10,000 packaging + 25,000 delivery = 120,000đ.
- AC2 Given my cart has a Take-away Tub and I chose Pick-up, When I look at the total,
  Then it shows items + 10,000 packaging + 0 delivery fee.
- AC3 Given I chose Delivery and my items are 25,000đ, When I look at the "Place order" button,
  Then I see "Delivery orders start at 30,000đ. Add 5,000đ more to continue." and I cannot place the order.
- AC4 Given I chose Pick-up and my items are 22,000đ, When I tap "Place order",
  Then the order is placed, because pick-up has no minimum.

**Scope:** Total = items + packaging fee + delivery fee; packaging 10,000đ once per order (delivery over 3 km, or any Take-away Tub); 30,000đ minimum for delivery.

**Non-scope:** choosing the address or branch (ticket 2, Pick-up pack); paying (ticket 4)

## Ticket 4: Pay for my order

**User story**
- As a customer, I want to pay with cash, MoMo, bank QR or card, so that I can use the way I prefer.

**Acceptance criteria**
- AC1 Given I am at checkout, When I look at payment,
  Then I see 4 choices: Cash on delivery, MoMo, Bank QR (VietQR), Visa/Mastercard (VNPay).
- AC2 Given I chose Cash on delivery, When I place the order,
  Then the order is Received at once and I pay at delivery or pick-up.
- AC3 Given I chose MoMo, When I place the order,
  Then I see a payment screen with a 10:00 countdown.
- AC4 Given I paid within 10 minutes, When the payment is confirmed,
  Then the order moves to Received.
- AC5 Given 10 minutes pass with no payment, When the countdown reaches 00:00,
  Then the order is cancelled and I see "We didn't get your payment in 10 minutes, so we cancelled this order.".
- AC6 Given my order was cancelled after 10 minutes, When my payment arrives afterwards,
  Then the order stays cancelled and store staff refund me by hand.

**Scope:** 4 payment methods, the 10-minute wait for online payments, and automatic cancel when unpaid. A late payment does not reopen the order.

**Non-scope:** refunds; cancelling an order by the customer; saving cards