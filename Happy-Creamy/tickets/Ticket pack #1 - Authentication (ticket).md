# Ticket pack #1 - Authentication

## Ticket 1: Sign in using Google or Facebook

**User story**
- As a customer, I want to sign in with my Google or Facebook account, so that I can start ordering without a new password.

**Acceptance criteria**
- AC1 Given I am signed out and on the sign-in screen, When I tap "Continue with Google" and approve,
  Then I am signed in and see Home.
- AC2 Given I am signed out and on the sign-in screen, When I tap "Continue with Facebook" and approve,
  Then I am signed in and see Home.
- AC3 Given it is my first time signing in with Google, When I approve,
  Then I am not asked for an email code.
- AC4 Given the Google window is open, When I close it without approving,
  Then I stay signed out on the sign-in screen.

**Scope:** Sign in with Google and Facebook.

**Non-scope:** email and password sign-in (ticket 2); linking two accounts

**Open questions (for the client)**
1. If a customer signs up by email and later uses Google with the same email, is it one account or two?

## Ticket 2: Sign up and sign in using email and password

**User story**
- As a customer, I want to sign up and sign in with my email and a password, so that I have my own account.

**Acceptance criteria**
- AC1 Given I am signed out, When I open any page, for example /menu,
  Then I am sent to the sign-in screen.
- AC2 Given I chose "Create an account" and entered nhung@example.com with a password of 8 characters or more, When I tap "Create account",
  Then a 6-digit code is sent to my email and I cannot sign in until I enter it.
- AC3 Given I received the 6-digit code, When I enter the correct code,
  Then I am signed in and see Home.
- AC4 Given I enter a wrong code, When I tap "Verify and sign in",
  Then I see an error and stay on the code screen.
- AC5 Given my email is verified, When I log in with the right email and password,
  Then I see Home.
- AC6 Given my email is verified, When I log in with a wrong password,
  Then I see an error and stay on the sign-in screen.

**Scope:** Sign up with an email code check, log in, and sending signed-out users to the sign-in screen.

**Non-scope:** Google and Facebook (ticket 1); password reset (ticket 3); phone number login

**Open questions (for the client)**
1. How long is the email code valid, and how many wrong tries are allowed? What are the password rules?

## Ticket 3: Forgot password

**User story**
- As a customer who forgot my password, I want to reset it with a code sent to my email, so that I can get back into my account.

**Acceptance criteria**
- AC1 Given I am on the sign-in screen, When I tap "Forgot password" and enter nhung@example.com,
  Then a 6-digit code is sent to that email.
- AC2 Given I received the code, When I enter it and a new password of 8 characters or more,
  Then my password is changed and I can log in with it.
- AC3 Given I enter a wrong code, When I tap to continue,
  Then I see an error and my password is not changed.
- AC4 Given my password was just reset, When I log in with the old password,
  Then I see an error and I stay signed out.

**Scope:** Reset a password with an email code.

**Non-scope:** changing the password while signed in (Account pack); resetting Google or Facebook accounts
