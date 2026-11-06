# Ticket pack #7 - Order tracking (test matrix)

Type: Positive = expected to work, Negative = expected to be refused, Boundary = at the edge of a limit, Open question = waiting for a client answer. Priority: P1 must pass to release, P2 should pass, P3 nice to have.

## Ticket HC-17: Follow an active order

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC17-01 | AC1 | Delivery timeline | Place a delivery order; open Account > Active Orders | Received, Preparing, Out for delivery, Completed; current step marked | Positive | P1 |
| TC-HC17-02 | AC2 | Pick-up timeline | Place a pick-up order; open Active Orders | Received, Preparing, Ready for pick-up, Completed | Positive | P1 |
| TC-HC17-03 | AC3 | Unpaid online order | Place a MoMo order and do not pay | Shows "Awaiting payment" | Positive | P1 |
| TC-HC17-04 | AC4 | No active order | Open Active Orders with none | "No orders on the way" and a button to browse the menu | Positive | P1 |
| TC-HC17-05 | - | Step moves when staff change status | Staff set Received to Preparing | Marked step moves to Preparing | Positive | P1 |
| TC-HC17-06 | AC3 | Unpaid order times out | Wait 10 minutes without paying | Order leaves Active Orders as cancelled | Positive | P2 |
| TC-HC17-07 | - | Several active orders | Place a delivery and a pick-up order | Both are listed, each with its own timeline | Positive | P2 |
| TC-HC17-08 | - | Completed order leaves Active Orders | Staff set the order to Completed | Order disappears from Active Orders and shows in Order History | Positive | P2 |
| TC-HC17-09 | AC1 | Cash on delivery starts at Received | Place a COD order | Timeline starts at Received | Positive | P2 |

## Ticket HC-18: Get notified when my order changes

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC18-01 | AC1 | Notification for each change before Completed | Allow notifications; staff change the status to Preparing | A notification arrives | Positive | P1 |
| TC-HC18-02 | AC1 | One notification per change | Staff change the status 3 times: Received, Preparing, Out for delivery | 3 notifications, one per change | Positive | P2 |
| TC-HC18-03 | AC2 | Notifications blocked | Block notifications; staff change the status | No notification; timeline still updates | Negative | P1 |
| TC-HC18-04 | AC3 | iPhone Safari without Home Screen | Open the app on iPhone Safari, not added to Home Screen | No permission prompt is shown | Negative | P1 |
| TC-HC18-05 | AC3 | iPhone Safari added to Home Screen | Add the site to the Home Screen; open it | Permission prompt can be shown | Positive | P2 |
| TC-HC18-06 | AC1 | First visit asks once | Open the app on a supported browser | Permission is asked once; not again after a choice | Positive | P2 |
| TC-HC18-07 | AC2 | User refuses the prompt | Tap "Block" on the prompt | App works normally with no error | Negative | P2 |
| TC-HC18-08 | - | Tap a notification | Tap a status notification | Opens the app on that order (confirm the target with the client) | Positive | P3 |
| TC-HC18-09 | Ans. 22 | Only the feedback notification at Completed | Allow notifications; staff set the order to Completed | The customer gets the feedback notification only, not a status notification | Negative | P1 |
| TC-HC18-10 | Ans. 13 | No email or SMS when blocked | Block notifications; status changes | No email and no SMS is sent; the timeline still updates | Negative | P2 |

## Ticket HC-19: See my order history

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC19-01 | AC1 | Completed orders are listed | Open Account > Order History with completed orders | Each order shows number, date, type and total | Positive | P1 |
| TC-HC19-02 | AC2 | No past orders | Open Order History with none | An empty list is shown | Positive | P1 |
| TC-HC19-03 | AC1 | Order type is clear | Look at one delivery and one pick-up order | Type shows correctly for each | Positive | P2 |
| TC-HC19-04 | AC1 | Total matches checkout | Compare with the total paid | Same amount, including packaging and delivery fee | Positive | P2 |
| TC-HC19-05 | AC1 | Only my own orders | Sign in as another customer | Only that customer orders are listed | Negative | P1 |
| TC-HC19-06 | Ans. 14 | Unpaid cancelled orders are hidden | An order was cancelled after 10 minutes without payment; open Order History | The cancelled order is not listed | Negative | P2 |
