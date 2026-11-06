# Ticket pack #1 - Authentication (test matrix)

Type: Positive = expected to work, Negative = expected to be refused, Boundary = at the edge of a limit, Open question = waiting for a client answer. Priority: P1 must pass to release, P2 should pass, P3 nice to have.

## Ticket HC-1: Sign in using Google or Facebook

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC1-01 | AC1 | Sign in with Google | On the sign-in screen tap "Continue with Google", choose an account, approve | Signed in and Home is shown | Positive | P1 |
| TC-HC1-02 | AC2 | Sign in with Facebook | Tap "Continue with Facebook", approve | Signed in and Home is shown | Positive | P1 |
| TC-HC1-03 | AC3 | First Google sign-in skips the email code | Use a Google account that has never signed in; approve | No code screen; Home is shown | Positive | P2 |
| TC-HC1-04 | - | Returning Google user keeps the same account | Sign in with Google, log out, sign in with Google again | Same account; earlier order history is still there | Positive | P2 |
| TC-HC1-05 | AC4 | Close the Google window without approving | Tap "Continue with Google", close the window | Still on the sign-in screen; user can try again | Negative | P2 |
| TC-HC1-06 | AC4 | Close the Facebook window without approving | Tap "Continue with Facebook", close the window | Still on the sign-in screen; user can try again | Negative | P3 |
| TC-HC1-07 | - | Network lost during Google sign-in | Turn off the network after tapping "Continue with Google" | A clear error message; user stays signed out | Negative | P3 |
| TC-HC1-08 | Ans. 1 | Google sign-in with an email already used for email sign-up | Sign up by email with nhung@example.com and verify; log out; sign in with Google using nhung@example.com | Signed in to the same account; order history and saved addresses are still there | Positive | P1 |

## Ticket HC-2: Sign up and sign in using email and password

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC2-01 | AC1 | Signed-out user is sent to sign-in | Open /menu while signed out | The sign-in screen is shown | Positive | P1 |
| TC-HC2-02 | AC2 | Sign up sends a 6-digit code | Create account with nhung@example.com and password Kem12345 | A 6-digit code is sent; user cannot sign in until it is entered | Positive | P1 |
| TC-HC2-03 | AC3 | Correct code signs the user in | Enter the code from the email | Signed in; Home is shown | Positive | P1 |
| TC-HC2-04 | AC4 | Wrong code is refused | Enter 000000 when the real code is different | Error is shown; user stays on the code screen | Negative | P1 |
| TC-HC2-05 | AC5 | Log in with the right password | Log in with the verified email and password Kem12345 | Home is shown | Positive | P1 |
| TC-HC2-06 | AC6 | Log in with a wrong password | Log in with the verified email and password Wrong999 | Error is shown; user stays on the sign-in screen | Negative | P1 |
| TC-HC2-07 | AC2 | Password with 8 characters is accepted | Password Kem12345 (8 characters) | Account is created | Boundary | P1 |
| TC-HC2-08 | AC2 | Password with 7 characters is refused | Password Kem1234 (7 characters) | Error says the password needs 8 characters or more | Boundary | P1 |
| TC-HC2-09 | AC2 | Email already registered | Sign up again with nhung@example.com | Error says the email is already in use | Negative | P2 |
| TC-HC2-10 | AC2 | Email format is wrong | Enter nhung@ or nhung.example.com | Error on the email field; no code is sent | Negative | P2 |
| TC-HC2-11 | AC2 | Empty fields | Tap "Create account" with nothing typed | Required-field errors; no code is sent | Negative | P3 |
| TC-HC2-12 | AC5 | Log in before verifying the email | Sign up, skip the code, then log in | User is asked to verify the email first | Negative | P2 |
| TC-HC2-13 | Ans. 2 | Code still valid at 9:59 | Enter the correct code 9 minutes 59 seconds after it was sent | Code is accepted; signed in | Boundary | P1 |
| TC-HC2-14 | Ans. 2 | Code expired at 10:01 | Enter the correct code 10 minutes 1 second after it was sent | Error says the code expired; user can ask for a new code | Boundary | P1 |
| TC-HC2-15 | Ans. 2 | Fifth wrong try locks the code | Enter 5 wrong codes in a row, then the correct code | Correct code is refused until a new code is requested | Boundary | P1 |
| TC-HC2-16 | Ans. 2 | Correct code on the fifth try | Enter 4 wrong codes, then the correct code | Code is accepted; signed in | Boundary | P2 |

## Ticket HC-3: Forgot password

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC3-01 | AC1 | Request a reset code | Tap "Forgot password", enter nhung@example.com | A 6-digit code is sent to that email | Positive | P1 |
| TC-HC3-02 | AC2 | Reset with a correct code | Enter the code and new password Kem54321 | Password is changed; login with Kem54321 works | Positive | P1 |
| TC-HC3-03 | AC3 | Reset with a wrong code | Enter 000000 and a new password | Error is shown; password is not changed | Negative | P1 |
| TC-HC3-04 | AC4 | Old password no longer works | After the reset, log in with the old password | Error is shown; user stays signed out | Negative | P1 |
| TC-HC3-05 | AC2 | New password with 7 characters is refused | New password Kem5432 (7 characters) | Error says the password needs 8 characters or more | Boundary | P2 |
| TC-HC3-06 | AC2 | New password with 8 characters is accepted | New password Kem54321 (8 characters) | Password is changed | Boundary | P2 |
| TC-HC3-07 | AC1 | Email is not registered | Enter nobody@example.com | Same neutral message as a real email; no account details leak | Negative | P2 |
| TC-HC3-08 | AC2 | Reset code cannot be used twice | Reuse the same code after a successful reset | Error is shown; password is not changed again | Negative | P3 |
| TC-HC3-09 | Ans. 3 | Reset code expires after 10 minutes | Use the correct code 10 minutes 1 second after it was sent | Error says the code expired; password is not changed | Boundary | P1 |
| TC-HC3-10 | Ans. 3 | Reset code locks after 5 wrong tries | Enter 5 wrong codes, then the correct code | Correct code is refused until a new code is requested; password is not changed | Boundary | P1 |
