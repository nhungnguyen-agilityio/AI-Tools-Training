# Ticket pack #8 - Account

## Ticket 1: Manage my profile and saved addresses

**User story**
- As a customer, I want to keep my details and addresses, so that checkout is faster.

**Acceptance criteria**
- AC1 Given I am signed in, When I open Account,
  Then I see my name and email.
- AC2 Given I open Saved addresses, When I add "Office, Bitexco Tower, District 1",
  Then it appears in my list and I can pick it at checkout.
- AC3 Given I have a saved address, When I delete it,
  Then it no longer shows at checkout.
- AC4 Given I add a saved address 12 km from every branch, When I save it,
  Then it is saved and shows a warning that it is outside our 10 km area; at checkout I cannot place a delivery order to it.

**Scope:** Profile details and saved delivery addresses.

**Non-scope:** deleting the account; payment cards

## Ticket 2: Change password and log out

**User story**
- As a customer, I want to change my password and log out, so that my account stays safe.

**Acceptance criteria**
- AC1 Given I signed up with email, When I change my password,
  Then I can log in with the new password and not the old one.
- AC2 Given I am signed in, When I tap "Log out",
  Then I am sent to the sign-in screen.
- AC3 Given I signed in with Google or Facebook, When I open Account,
  Then I do not see "Change password".
- AC4 Given I signed up with email, When I change my password to the same password,
  Then I see an error and the password does not change.

**Scope:** Password change and log out.

**Non-scope:** forgot password (Authentication pack)

## Ticket 3: Switch language

**User story**
- As a customer, I want to use the app in Vietnamese or English, so that I understand every screen.

**Acceptance criteria**
- AC1 Given the app is in English, When I switch to Vietnamese,
  Then all screens show Vietnamese.
- AC2 Given I switched to Vietnamese and closed the app, When I open it again,
  Then it is still in Vietnamese.
- AC3 Given I am a new user, When I sign in for the first time,
  Then the app is in Vietnamese.

**Scope:** Language switch between Vietnamese and English.

**Non-scope:** other languages; translating product names added later