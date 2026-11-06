# Ticket pack #6 - Stores (test matrix)

Type: Positive = expected to work, Negative = expected to be refused, Boundary = at the edge of a limit, Open question = waiting for a client answer. Priority: P1 must pass to release, P2 should pass, P3 nice to have.

## Ticket HC-15: Find nearby branches

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC15-01 | AC1 | Map and list with distance | Allow location; open Stores | Map with nearby branches and a list with address and distance, for example 1.2 km | Positive | P1 |
| TC-HC15-02 | AC2 | Open now status | Look at a branch at 14:00 (hours 08:00 to 22:00) | Shows "Open now" | Positive | P1 |
| TC-HC15-03 | Ans. 12 | Closing soon starts 30 minutes before closing | Look at a branch at 21:30 | Shows "Closing soon" | Boundary | P1 |
| TC-HC15-04 | AC2 | Closed branch status | Look at a branch at 07:59 and at 22:00 | Shows that it is closed | Positive | P2 |
| TC-HC15-05 | AC3 | Location denied | Deny location; open Stores | List of branches without distances | Negative | P1 |
| TC-HC15-06 | AC1 | Tap a pin on the map | Tap a branch pin | That branch is highlighted in the list | Positive | P2 |
| TC-HC15-07 | AC1 | Distance changes when the user moves | Allow location, then change location | Distances update | Positive | P3 |
| TC-HC15-08 | Ans. 12 | Still open at 21:29 | Look at a branch at 21:29 | Shows "Open now", not "Closing soon" | Boundary | P1 |

## Ticket HC-16: Get directions or call a branch

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC16-01 | AC1 | Get Directions opens Google Maps | Tap "Get Directions" on a branch | Google Maps opens with the route to that branch | Positive | P1 |
| TC-HC16-02 | AC2 | Call Store starts a call | Tap "Call Store" on a phone | The phone starts a call to that branch hotline | Positive | P1 |
| TC-HC16-03 | AC1 | Each branch uses its own address | Tap "Get Directions" on 2 different branches | Each route goes to the right branch | Positive | P2 |
| TC-HC16-04 | AC2 | Each branch uses its own hotline | Tap "Call Store" on 2 different branches | Each call goes to the right number | Positive | P2 |
| TC-HC16-05 | AC1 | Directions with location denied | Deny location; tap "Get Directions" | Google Maps still opens with the branch as the destination | Negative | P2 |
| TC-HC16-06 | AC2 | Call button on desktop | Tap "Call Store" on a desktop browser | The hotline number is shown or the call app opens | Positive | P3 |
