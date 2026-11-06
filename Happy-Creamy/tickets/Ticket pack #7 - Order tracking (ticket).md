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
- AC1 Given I allowed browser notifications, When store staff change my order's status,
  Then I get a notification for each change.
- AC2 Given I blocked browser notifications, When my order's status changes,
  Then I get no notification and the timeline still updates.
- AC3 Given I use iPhone Safari and have not added the site to the Home Screen, When I open the app,
  Then I am not asked for notification permission.

**Scope:** Push notification on each status change (optional for the customer).

**Non-scope:** email or SMS; promotions; the feedback notification (Feedback ticket pack)

**Open questions (for the client)**
1. If notifications are blocked, should the customer get another message (email or SMS) when the status changes?

## Ticket 3: See my order history

**User story**
- As a customer, I want to see my past orders, so that I remember what I ordered.

**Acceptance criteria**
- AC1 Given I have completed orders, When I open Account > Order History,
  Then I see each order with its number, date, type and total.
- AC2 Given I have no past orders, When I open Order History,
  Then I see an empty list.

**Scope:** List of completed orders.

**Non-scope:** reorder button; invoices; rating an order (Feedback ticket pack)
