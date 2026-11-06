# Ticket pack #5 - Pick-up

## Ticket 1: Choose a branch and a time slot

**User story**
- As a customer, I want to pick a branch and a time, so that my order is ready when I arrive.

**Acceptance criteria**
- AC1 Given I chose Pick-up, When I open checkout,
  Then I can choose a branch and a time slot.
- AC2 Given it is 10:12 and the branch is open from 08:00 to 22:00, When I look at the slots,
  Then I see today only, in 15-minute steps starting at 10:45 (at least 30 minutes from now), and none after closing.
- AC3 Given I chose Pick-up, When I look at the total,
  Then the delivery fee is 0đ.

**Scope:** Branch choice, 15-minute slots for today only (first slot at least 30 minutes away), no delivery fee, no minimum order.

**Non-scope:** the order total (Order pack); changing the slot after ordering

## Ticket 2: Pick up my ready order

**User story**
- As a customer, I want to know when my order is ready, so that I can collect it.

**Acceptance criteria**
- AC1 Given my pick-up order is Preparing, When store staff set it to Ready for pick-up,
  Then my order shows "Ready for pick-up".
- AC2 Given I allowed notifications, When the order becomes Ready for pick-up,
  Then I get a notification.
- AC3 Given my order is Ready for pick-up, When staff hand it over and set it to Completed,
  Then my order moves to Order History.
- AC4 Given my order is Ready for pick-up and I arrive late, When I check my order,
  Then it stays Ready for pick-up until staff set it to Completed.

**Scope:** Pick-up status steps: Received, Preparing, Ready for pick-up, Completed.

**Non-scope:** how staff change the status (Admin web app); cancelling a pick-up order