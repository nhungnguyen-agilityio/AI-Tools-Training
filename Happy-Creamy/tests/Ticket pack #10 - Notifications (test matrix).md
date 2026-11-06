# Ticket pack #10 - Notifications (test matrix)

Type: Positive = expected to work, Negative = expected to be refused, Boundary = at the edge of a limit, Open question = waiting for a client answer. Priority: P1 must pass to release, P2 should pass, P3 nice to have.

## Ticket HC-25: See the bell icon and my notification list

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC25-01 | AC1 | Bell on every main screen | Sign in; open Home, Menu, Stores and Account on mobile and on desktop | The bell is in the header of each screen | Positive | P1 |
| TC-HC25-02 | AC2 | Badge shows the unread count | Have 3 unread notifications; look at the bell | Badge shows 3 | Positive | P1 |
| TC-HC25-03 | AC3 | No badge when all are read | Read or mark all as read; look at the bell | Bell is shown with no badge | Positive | P1 |
| TC-HC25-04 | AC2 | Badge with 1 and with 10 unread | Have 1 unread, then 10 unread | Badge shows 1, then the count in a readable form (the mock-up shows 9+ above 9) | Boundary | P2 |
| TC-HC25-05 | AC4 | List opens from the bell, newest first | Tap the bell with several notifications | List opens; newest on top; unread items highlighted with a dot | Positive | P1 |
| TC-HC25-06 | AC5 | Item shows icon, message, order number and time | Read one item in the list | Icon, short message, order number and time are all shown | Positive | P2 |
| TC-HC25-07 | AC6 | Empty list | Sign in with a new account; tap the bell | "No notifications yet. Order updates and rating requests will show up here." | Negative | P1 |
| TC-HC25-08 | AC7 | List fills with push off or blocked | Switch push off (or block it); staff change an order status | A new item appears in the list | Positive | P1 |
| TC-HC25-09 | AC4 | Close the list | Open the list, then tap outside it or the bell again | List closes; the screen underneath is unchanged | Positive | P2 |
| TC-HC25-10 | - | Bell is not shown when signed out | Open the app while signed out | Only the sign-in screen; no bell | Negative | P2 |
| TC-HC25-11 | AC4 | List in Vietnamese | Switch to Vietnamese; open the list | Heading, empty message and "Mark all as read" are in Vietnamese (confirm the text with the client) | Positive | P3 |
| TC-HC25-12 | AC4 | Bell button is easy to use | Use keyboard and screen reader on the bell | The button can be focused and reads "Notifications, 3 unread" | Positive | P2 |

## Ticket HC-26: Open a notification and mark notifications as read

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC26-01 | AC1 | Open a status item for an active order | Tap an unread status item for an order that is still active | Item is marked as read; badge goes down by 1; the order opens in Active Orders | Positive | P1 |
| TC-HC26-02 | AC2 | Open a status item for a completed order | Tap a status item for an order that is Completed | Item is marked as read; the order is shown in Order History | Positive | P2 |
| TC-HC26-03 | AC3 | Open a feedback item | Tap the unread feedback item for HC-2048 | Item is marked as read; the feedback form for HC-2048 opens | Positive | P1 |
| TC-HC26-04 | AC4 | Feedback item for an order already rated | Rate HC-2048; tap its feedback item | Item is marked as read; "Feedback sent" is shown; no second form | Negative | P2 |
| TC-HC26-05 | AC5 | Feedback item after the 7-day window | Tap the feedback item on day 8 | Item is marked as read; "The 7-day window to rate this order has ended." | Boundary | P1 |
| TC-HC26-06 | AC6 | Mark all as read | Have 3 unread; tap "Mark all as read" | Badge disappears; no item is highlighted | Positive | P1 |
| TC-HC26-07 | AC6 | Mark all as read with nothing unread | Tap "Mark all as read" again | Nothing changes and there is no error | Positive | P3 |
| TC-HC26-08 | - | Read items stay in the list | Mark all as read; close and open the list | All items are still listed, shown as read | Positive | P2 |
| TC-HC26-09 | - | Read state is kept | Read one item; refresh the page or log out and in | The item is still read; unread items are still unread | Positive | P2 |
| TC-HC26-10 | - | Tap an item for a deleted or unknown order | Tap an item whose order cannot be found (test data) | A clear message or Order History opens; no crash | Negative | P3 |

## Ticket HC-27: Turn push notifications on or off in Account

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC27-01 | AC1 | Switch is on by default | Open Account for a new user | "Push notifications" switch is on | Positive | P1 |
| TC-HC27-02 | AC2 | Switch off stops pushes only | Turn the switch off; staff change an order status | No push; a new bell item still appears | Positive | P1 |
| TC-HC27-03 | AC3 | Switch on again | Turn the switch on; staff change an order status | A push arrives and a bell item appears | Positive | P1 |
| TC-HC27-04 | AC4 | No settings inside the bell list | Open the list; look for any setting or switch | There are none; the switch is only in Account | Negative | P1 |
| TC-HC27-05 | AC5 | iPhone Safari without Home Screen | Open Account on iPhone Safari, site not added to the Home Screen | No permission prompt; no push is sent; the bell list still works | Negative | P2 |
| TC-HC27-06 | - | Switch is remembered | Turn it off; log out and in | The switch is still off | Positive | P2 |
| TC-HC27-07 | - | Browser blocks notifications | Block notifications in the browser; look at the switch | Switch has no effect on pushes (none are sent); the bell list still fills | Positive | P2 |
| TC-HC27-08 | - | Switch has a clear label and state | Use a screen reader on the switch | Reads "Push notifications, switch, on" or "off" | Positive | P3 |
