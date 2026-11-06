# Ticket pack #10 - Notifications

## Ticket 1: See the bell icon and my notification list

**User story**
- As a customer, I want a bell icon with a list of my notifications, so that I can see my order updates and rating requests in one place.

**Acceptance criteria**
- AC1 Given I am signed in, When I open Home, Menu, Stores or Account,
  Then I see the bell icon in the header.
- AC2 Given I have 3 unread notifications, When I look at the bell,
  Then I see a badge with 3.
- AC3 Given I have no unread notifications, When I look at the bell,
  Then I see the bell and no badge.
- AC4 Given I have notifications, When I tap the bell,
  Then the notification list opens, newest first, with unread items highlighted.
- AC5 Given I look at an item in the list, When I read it,
  Then I see an icon, a short message, the order number and the time.
- AC6 Given I have no notifications, When I tap the bell,
  Then I see "No notifications yet. Order updates and rating requests will show up here.".
- AC7 Given push is off or blocked, When my order status changes,
  Then the new item still appears in the list.

**Scope:** Bell icon with unread badge in the header of the main screens, and the notification list. Vietnamese and English.

**Non-scope:** the Account switch (ticket 3); deleting notifications; email or SMS

## Ticket 2: Open a notification and mark notifications as read

**User story**
- As a customer, I want to open a notification and mark them as read, so that I can go to my order and clear the unread count.

**Acceptance criteria**
- AC1 Given I have an unread status notification for my active order, When I tap it,
  Then it is marked as read, the badge goes down by 1, and I see the order in Active Orders.
- AC2 Given I have an unread status notification for a completed order, When I tap it,
  Then it is marked as read and I see the order in Order History.
- AC3 Given I have an unread feedback notification for HC-2048, When I tap it,
  Then it is marked as read and the feedback form for HC-2048 opens.
- AC4 Given I already sent feedback for HC-2048, When I tap its feedback notification,
  Then it is marked as read and I see that feedback was sent.
- AC5 Given HC-2048 was completed more than 7 days ago, When I tap its feedback notification,
  Then it is marked as read and I am told the 7-day window has ended.
- AC6 Given I have 3 unread notifications, When I tap "Mark all as read",
  Then the badge disappears and no item is highlighted.

**Scope:** Opening an item, read and unread state, and "Mark all as read".

**Non-scope:** the list itself (ticket 1); deleting notifications

## Ticket 3: Turn push notifications on or off in Account

**User story**
- As a customer, I want to switch push notifications on or off in Account, so that I decide whether my phone alerts me.

**Acceptance criteria**
- AC1 Given I am signed in, When I open Account,
  Then I see a "Push notifications" switch, on by default.
- AC2 Given the switch is on, When I turn it off,
  Then I get no more pushes, and the bell list still gets new items.
- AC3 Given the switch is off, When I turn it on,
  Then I get pushes again for new notifications.
- AC4 Given I open the bell list, When I look for settings,
  Then I see no settings there; they are only in Account.
- AC5 Given I use iPhone Safari and have not added the site to the Home Screen, When I open Account,
  Then the switch does not ask for permission and no push is sent.

**Scope:** One Push notifications switch in Account. It controls push only, not the bell list.

**Non-scope:** settings per notification type; quiet hours; email or SMS
