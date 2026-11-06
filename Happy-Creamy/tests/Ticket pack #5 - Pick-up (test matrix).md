# Ticket pack #5 - Pick-up (test matrix)

Type: Positive = expected to work, Negative = expected to be refused, Boundary = at the edge of a limit, Open question = waiting for a client answer. Priority: P1 must pass to release, P2 should pass, P3 nice to have.

## Ticket HC-13: Choose a branch and a time slot

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC13-01 | AC1 | Choose a branch and a slot | Pick Pick-up at checkout | A branch list and time slots are shown | Positive | P1 |
| TC-HC13-02 | AC2 | Slots are 15 minutes apart | Open checkout at 09:10 | Slots 09:45, 10:00, 10:15 and so on | Positive | P1 |
| TC-HC13-03 | AC2 | No slot before opening | Open checkout at 07:00 (branch opens at 08:00) | First slot is 08:00; no slot before it | Boundary | P1 |
| TC-HC13-04 | AC2 | No slot after closing | Open checkout at 20:00 (branch closes at 22:00) | No slot starts after 22:00 | Boundary | P1 |
| TC-HC13-05 | AC3 | No delivery fee | Choose Pick-up | Delivery fee is 0đ | Positive | P1 |
| TC-HC13-06 | - | No minimum order for pick-up | Items 22,000đ, pick-up | Order can be placed | Positive | P2 |
| TC-HC13-07 | AC1 | Changing the branch updates slots | Switch to a branch with different hours | Slot list changes to that branch hours | Positive | P2 |
| TC-HC13-08 | AC1 | Branch is closed | Choose a branch that is closed all day | No slots; a message explains why | Negative | P2 |
| TC-HC13-09 | AC1 | No slot chosen | Leave the slot empty and tap "Place order" | Cannot place the order; asks for a slot | Negative | P2 |
| TC-HC13-10 | Ans. 10 | Slots less than 30 minutes away are not offered | Open checkout at 11:20 | Earlier slots and 11:30, 11:45 are hidden or disabled; first slot is 11:50 or later | Negative | P2 |
| TC-HC13-11 | Ans. 10 | First slot is at least 30 minutes away | Open checkout at 10:00 | First slot is 10:30; 10:15 is not offered | Boundary | P1 |
| TC-HC13-12 | Ans. 10 | A slot 29 minutes away is not offered | Open checkout at 10:01 | 10:30 is not offered; first slot is 10:45 | Boundary | P1 |
| TC-HC13-13 | Ans. 10 | Cannot book for another day | Look for tomorrow in the slot picker | Only today slots are offered; there is no date choice | Negative | P1 |

## Ticket HC-14: Pick up my ready order

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC14-01 | AC1 | Ready for pick-up status | Staff set a Preparing order to Ready for pick-up | Order shows "Ready for pick-up" | Positive | P1 |
| TC-HC14-02 | AC2 | Notification when ready | Allow notifications; staff set Ready for pick-up | A notification arrives | Positive | P1 |
| TC-HC14-03 | AC3 | Completed moves to history | Staff set the order to Completed | Order moves to Order History | Positive | P1 |
| TC-HC14-04 | AC2 | Notifications blocked | Block notifications; staff set Ready for pick-up | No notification; status still updates in the app | Negative | P2 |
| TC-HC14-05 | AC1 | Not ready before staff act | Order is Preparing | Order does not show Ready for pick-up | Negative | P2 |
| TC-HC14-06 | AC1 | Status is kept after refresh | Refresh the page when the order is Ready | Status still shows Ready for pick-up | Positive | P2 |
| TC-HC14-07 | Ans. 11 | Late customer | Leave an order at Ready for pick-up for several hours | Order stays Ready for pick-up; the app does not cancel it or change the status | Positive | P3 |
