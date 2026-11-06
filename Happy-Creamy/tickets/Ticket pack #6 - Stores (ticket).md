# Ticket pack #6 - Stores

## Ticket 1: Find nearby branches

**User story**
- As a customer, I want to see branches near me, so that I know where to order from.

**Acceptance criteria**
- AC1 Given I allowed location access, When I open Stores,
  Then I see a map with nearby branches and a list with each address and distance, for example 1.2 km.
- AC2 Given a branch closes at 22:00, When I check its status at 21:25 and at 21:35,
  Then I see "Open now" at 21:25 and "Closing soon" at 21:35.
- AC3 Given I denied location access, When I open Stores,
  Then I still see the list of branches without distances.

**Scope:** Map, branch list, distance and live status ("Closing soon" in the last 30 minutes). Branches show "Open daily 08:00 to 22:00".

**Non-scope:** choosing a branch for an order (Pick-up pack); branch photos and reviews

## Ticket 2: Get directions or call a branch

**User story**
- As a customer, I want to get directions or call a branch, so that I can reach it easily.

**Acceptance criteria**
- AC1 Given I am looking at a branch, When I tap "Get Directions",
  Then Google Maps opens with the route to that branch.
- AC2 Given I am looking at a branch, When I tap "Call Store",
  Then my phone starts a call to that branch's hotline.

**Scope:** Directions button and call button.

**Non-scope:** in-app navigation