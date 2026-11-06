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
- AC5 Given I signed up by email with nhung@example.com, When I sign in with Google using nhung@example.com,
  Then I am signed in to the same account, with the same orders and saved addresses.

**Scope:** Sign in with Google and Facebook. One account per email: a Google or Facebook sign-in with an email that already has an account opens that account.

**Non-scope:** email and password sign-in (ticket 2); linking accounts that use different emails

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
- AC7 Given I received the 6-digit code 10 minutes ago and did not use it, When I enter it,
  Then I see that the code expired and I can ask for a new code.
- AC8 Given I entered 4 wrong codes, When I enter a 5th wrong code,
  Then I can no longer try this code and I am asked to request a new one.

**Scope:** Sign up with an email code check (valid 10 minutes, 5 tries), log in, and sending signed-out users to the sign-in screen. Password: 8 characters or more.

**Non-scope:** Google and Facebook (ticket 1); password reset (ticket 3); phone number login

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
- AC5 Given I received the reset code 10 minutes ago and did not use it, When I enter it,
  Then I see that the code expired and I can ask for a new code.
- AC6 Given I entered 4 wrong reset codes, When I enter a 5th wrong code,
  Then I can no longer try this code and I am asked to request a new one.

**Scope:** Reset a password with an email code (valid 10 minutes, 5 tries).

**Non-scope:** changing the password while signed in (Account pack); resetting Google or Facebook accounts