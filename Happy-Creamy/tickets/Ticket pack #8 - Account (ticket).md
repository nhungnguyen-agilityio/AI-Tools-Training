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

**Scope:** Password change and log out.

**Non-scope:** forgot password (Authentication pack)

**Open questions (for the client)**
1. Google and Facebook users have no password here. Do they see "Change password"?

## Ticket 3: Switch language

**User story**
- As a customer, I want to use the app in Vietnamese or English, so that I understand every screen.

**Acceptance criteria**
- AC1 Given the app is in English, When I switch to Vietnamese,
  Then all screens show Vietnamese.
- AC2 Given I switched to Vietnamese and closed the app, When I open it again,
  Then it is still in Vietnamese.

**Scope:** Language switch between Vietnamese and English.

**Non-scope:** other languages; translating product names added later

**Open questions (for the client)**
1. What language does a new user get first: the browser language, or Vietnamese?
