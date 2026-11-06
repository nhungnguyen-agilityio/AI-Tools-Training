# Ticket pack #4 - Order (test matrix)

Type: Positive = expected to work, Negative = expected to be refused, Boundary = at the edge of a limit, Open question = waiting for a client answer. Priority: P1 must pass to release, P2 should pass, P3 nice to have.

## Ticket HC-9: Review my cart

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC9-01 | AC1 | Cart lists items with options and totals | Cart has Mint Cloud Cup x2; open the cart | Each item with its options and line total | Positive | P1 |
| TC-HC9-02 | AC2 | Plus and minus change quantity and total | Tap "+" then "-" | Quantity and total change each time | Positive | P1 |
| TC-HC9-03 | AC3 | Minus on quantity 1 removes the item | Tap "-" when quantity is 1 | Item is removed from the cart | Positive | P1 |
| TC-HC9-04 | AC4 | Empty cart state | Remove all items and open the cart | Empty message is shown; "Place order" cannot be used | Positive | P1 |
| TC-HC9-05 | AC2 | Totals update after removing an item | Remove one of two items | Cart total drops by that line total | Positive | P2 |
| TC-HC9-06 | AC2 | Many taps on plus | Tap "+" 20 times fast | Quantity and total stay correct | Boundary | P3 |
| TC-HC9-07 | Ans. 7 | Cart is kept on the account | Add 2 items, log out, log in on another device | The same 2 items are in the cart | Positive | P1 |
| TC-HC9-08 | Ans. 7 | Cart after a page refresh | Refresh the page with items in the cart | Items are still in the cart | Positive | P3 |

## Ticket HC-10: Deliver to my address

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC10-01 | AC1 | Fee under 2 km | Address 1.4 km from the nearest branch | Delivery fee 15,000đ | Positive | P1 |
| TC-HC10-02 | AC1 | Fee just under 2 km | Address 1.99 km away | Delivery fee 15,000đ | Boundary | P1 |
| TC-HC10-03 | AC2 | Fee at exactly 2 km | Address 2.0 km away | Delivery fee 25,000đ | Boundary | P1 |
| TC-HC10-04 | AC2 | Fee just under 5 km | Address 4.99 km away | Delivery fee 25,000đ | Boundary | P1 |
| TC-HC10-05 | AC3 | Fee at exactly 5 km | Address 5.0 km away | Delivery fee 35,000đ | Boundary | P1 |
| TC-HC10-06 | AC3 | Fee at exactly 10 km | Address 10.0 km away | Delivery fee 35,000đ; order can be placed | Boundary | P1 |
| TC-HC10-07 | AC4 | Just over 10 km | Address 10.01 km away | Not deliverable; order cannot be placed | Boundary | P1 |
| TC-HC10-08 | AC4 | Far outside coverage | Address 11.8 km away | "Sorry, this address is outside our 10km delivery coverage."; order cannot be placed | Negative | P1 |
| TC-HC10-09 | AC5 | Branch is closed | Open checkout when the nearest branch is closed | Delivery is disabled and the next opening time is shown | Negative | P1 |
| TC-HC10-10 | AC6 | Location denied, type the address | Deny location access; type an address | Address is accepted and the fee is calculated | Positive | P1 |
| TC-HC10-11 | - | Distance is by road | Pick an address with a long road detour | Fee follows road distance, not straight-line distance | Positive | P2 |
| TC-HC10-12 | - | Nearest branch is used | Pick an address closer to branch B than branch A | Fee is based on branch B | Positive | P2 |
| TC-HC10-13 | - | Pick a saved address | Choose "Office, Bitexco Tower, District 1" at checkout | Address and fee are filled in | Positive | P2 |
| TC-HC10-14 | AC1 | Changing the address updates the fee | Switch from a 1.4 km address to a 5 km address | Fee changes from 15,000đ to 35,000đ | Positive | P2 |
| TC-HC10-15 | AC6 | Empty address | Leave the address empty | Cannot continue; field error is shown | Negative | P3 |
| TC-HC10-16 | Ans. 8 | Delivery just before opening | Open checkout at 07:59 (hours are 08:00 to 22:00) | Delivery is disabled; next opening time 08:00 is shown | Boundary | P1 |
| TC-HC10-17 | Ans. 8 | Delivery at opening time | Open checkout at 08:00 | Delivery is available | Boundary | P1 |
| TC-HC10-18 | Ans. 8 | Delivery one minute before closing | Place a delivery order at 21:59 | Order is placed; there is no cut-off before closing | Boundary | P1 |
| TC-HC10-19 | Ans. 8 | Delivery at closing time | Open checkout at 22:00 | Delivery is disabled; next opening time 08:00 is shown | Boundary | P1 |

## Ticket HC-11: See the order total

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC11-01 | AC1 | Delivery total with packaging and fee | Items 85,000đ, delivery 4.2 km, no tub | 85,000 + 10,000 packaging + 25,000 delivery = 120,000đ | Positive | P1 |
| TC-HC11-02 | AC2 | Pick-up with a tub | 1 Take-away Tub 79,000đ, pick-up | 79,000 + 10,000 packaging + 0 delivery = 89,000đ | Positive | P1 |
| TC-HC11-03 | AC3 | Delivery under the minimum | Items 25,000đ, delivery | "Delivery orders start at 30,000đ. Add 5,000đ more to continue."; cannot place order | Negative | P1 |
| TC-HC11-04 | AC3 | Delivery exactly at the minimum | Items 30,000đ, delivery 1.4 km | Order can be placed | Boundary | P1 |
| TC-HC11-05 | AC3 | Delivery just under the minimum | Items 29,000đ, delivery | Message asks for 1,000đ more; cannot place order | Boundary | P1 |
| TC-HC11-06 | AC3 | Minimum counts items only | Items 25,000đ, delivery fee 25,000đ (total 50,000đ) | Still blocked: fees do not count toward the 30,000đ | Negative | P1 |
| TC-HC11-07 | AC4 | Pick-up has no minimum | Items 22,000đ, pick-up, tap "Place order" | Order is placed | Positive | P1 |
| TC-HC11-08 | - | No packaging at exactly 3 km | Delivery 3.0 km, no tub, items 40,000đ | Packaging 0đ; total 40,000 + fee 25,000 = 65,000đ | Boundary | P1 |
| TC-HC11-09 | - | Packaging just over 3 km | Delivery 3.1 km, no tub, items 40,000đ | Packaging 10,000đ; total 40,000 + 10,000 + 25,000 = 75,000đ | Boundary | P1 |
| TC-HC11-10 | - | Packaging once for several tubs | 2 Take-away Tubs, pick-up | Packaging 10,000đ once, not 20,000đ | Positive | P1 |
| TC-HC11-11 | - | Tub on a short delivery | 1 tub, delivery 1.4 km | Packaging 10,000đ is added once | Positive | P2 |
| TC-HC11-12 | - | Cups only on pick-up | 2 cups, pick-up | Packaging 0đ and delivery 0đ | Positive | P2 |
| TC-HC11-13 | - | Tub on a long delivery | 1 tub, delivery 4.2 km | Packaging 10,000đ once, not twice | Positive | P2 |
| TC-HC11-14 | - | Money format | Look at any total | Numbers show with a thousands separator and đ, for example 120,000đ | Positive | P3 |

## Ticket HC-12: Pay for my order

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC12-01 | AC1 | Four payment methods | Open payment at checkout | Cash on delivery, MoMo, Bank QR (VietQR), Visa/Mastercard (VNPay) | Positive | P1 |
| TC-HC12-02 | AC2 | Cash on delivery | Choose Cash on delivery, place order | Order is Received at once; no countdown | Positive | P1 |
| TC-HC12-03 | AC3 | MoMo shows a countdown | Choose MoMo, place order | Payment screen with a 10:00 countdown | Positive | P1 |
| TC-HC12-04 | AC4 | Pay in time | Pay with MoMo within 10 minutes | Payment confirmed; order moves to Received | Positive | P1 |
| TC-HC12-05 | AC5 | No payment for 10 minutes | Wait until the countdown reaches 00:00 | Order is cancelled; "We didn't get your payment in 10 minutes, so we cancelled this order." | Negative | P1 |
| TC-HC12-06 | AC4 | Pay at 9:59 | Confirm payment with 1 second left | Payment is accepted; order is Received | Boundary | P1 |
| TC-HC12-07 | AC3 | Bank QR has the same countdown | Choose Bank QR (VietQR), place order | QR is shown with a 10:00 countdown | Positive | P2 |
| TC-HC12-08 | AC3 | Card payment has the same countdown | Choose Visa/Mastercard (VNPay), place order | VNPay page opens and the 10-minute window applies | Positive | P2 |
| TC-HC12-09 | AC4 | Card payment fails | Use a declined test card | Error is shown; order stays unpaid and can be retried within the window | Negative | P2 |
| TC-HC12-10 | AC3 | Countdown continues after leaving the screen | Leave the payment screen and come back after 2 minutes | Countdown shows about 8:00 left | Positive | P2 |
| TC-HC12-11 | AC2 | Double tap on "Place order" | Tap "Place order" twice quickly | Only one order is created | Negative | P2 |
| TC-HC12-12 | Ans. 9 | Payment arrives after cancellation | Pay at 10:01, after the order was cancelled | Order stays cancelled and never moves to Received; no automatic refund (staff refund by hand outside the app) | Negative | P1 |
