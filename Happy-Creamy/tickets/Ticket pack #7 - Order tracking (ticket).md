# Ticket pack #7 - Order tracking

## Ticket 1: Follow an active order

**User story**
- As a customer, I want to see where my order is, so that I know when it arrives.

**Acceptance criteria**
- AC1 Given I placed a delivery order, When I open Account > Active Orders,
  Then I see Received, Preparing, Out for delivery, Completed, with the current step marked.
- AC2 Given I placed a pick-up order, When I open Active Orders,
  Then I see Received, Preparing, Ready for pick-up, Completed.
- AC3 Given I placed a MoMo order and have not paid, When I open Active Orders,
  Then I see "Awaiting payment".
- AC4 Given I have no active order, When I open Active Orders,
  Then I see "No orders on the way" and a button to browse the menu.

**Scope:** Status timeline for delivery and pick-up.

**Non-scope:** live rider map; cancelling or refunding an order

## Ticket 2: Get notified when my order changes

**User story**
- As a customer, I want a notification when my order status changes, so that I do not need to keep checking.

**Acceptance criteria**
- AC1 Given push notifications are on in Account and my browser allows them, When store staff change my order's status to Received, Preparing, Out for delivery or Ready for pick-up,
  Then I get a push and a new item appears in the bell list for each change.
- AC2 Given push notifications are off in Account or my browser blocks them, When my order's status changes,
  Then I get no push, the bell list still gets the item and the timeline still updates.
- AC3 Given my order is unpaid after 10 minutes, When it is cancelled,
  Then I get "We didn't get your payment in 10 minutes, so we cancelled order HC-2048." in the bell list.
- AC4 Given my order is Out for delivery, When store staff set it to Completed,
  Then I get only the feedback notification and no status notification.
- AC5 Given I use iPhone Safari and have not added the site to the Home Screen, When I open the app,
  Then I am not asked for notification permission.

**Scope:** Order status notifications: a bell item for every status change, and a push when the customer allows it.

**Non-scope:** email or SMS (not in the MVP); promotions; the bell list and the Account switch (Notifications pack); the feedback notification (Feedback pack)

## Ticket 3: See my order history

**User story**
- As a customer, I want to see my past orders, so that I remember what I ordered.

**Acceptance criteria**
- AC1 Given I have completed orders, When I open Account > Order History,
  Then I see each order with its number, date, type and total.
- AC2 Given I have no past orders, When I open Order History,
  Then I see an empty list.
- AC3 Given I placed an online order and did not pay within 10 minutes, When I open Order History,
  Then the cancelled order is not listed.

**Scope:** List of completed orders.

**Non-scope:** reorder button; invoices; rating an order (Feedback ticket pack)