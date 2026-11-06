# Ticket pack #8 - Account (test matrix)

Type: Positive = expected to work, Negative = expected to be refused, Boundary = at the edge of a limit, Open question = waiting for a client answer. Priority: P1 must pass to release, P2 should pass, P3 nice to have.

## Ticket HC-20: Manage my profile and saved addresses

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC20-01 | AC1 | Name and email are shown | Sign in; open Account | Name and email are shown | Positive | P1 |
| TC-HC20-02 | AC2 | Add a saved address | Add "Office, Bitexco Tower, District 1" | Appears in the list and can be picked at checkout | Positive | P1 |
| TC-HC20-03 | AC3 | Delete a saved address | Delete the saved address | Gone from the list and from checkout | Positive | P1 |
| TC-HC20-04 | AC2 | Several saved addresses | Add 3 addresses | All 3 are listed and can be chosen | Positive | P2 |
| TC-HC20-05 | AC2 | Empty address | Save an address with nothing typed | Error is shown; nothing is saved | Negative | P2 |
| TC-HC20-06 | AC1 | Google user profile | Sign in with Google; open Account | Name and email from Google are shown | Positive | P3 |
| TC-HC20-07 | Ans. 15 | Saved address outside 10 km | Save an address 11.8 km from any branch | Address is saved; at checkout a warning shows and Delivery cannot be placed to it | Positive | P2 |

## Ticket HC-21: Change password and log out

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC21-01 | AC1 | Change password | Change from Kem12345 to Kem54321 | Login works with Kem54321 and not with Kem12345 | Positive | P1 |
| TC-HC21-02 | AC2 | Log out | Tap "Log out" | Sign-in screen is shown | Positive | P1 |
| TC-HC21-03 | AC1 | Wrong current password | Enter a wrong current password | Error is shown; password is not changed | Negative | P1 |
| TC-HC21-04 | AC1 | New password with 7 characters | New password Kem5432 | Refused: needs 8 characters or more | Boundary | P2 |
| TC-HC21-05 | AC1 | New password with 8 characters | New password Kem54321 | Accepted | Boundary | P2 |
| TC-HC21-06 | AC2 | Back button after logout | Log out, then press the browser Back button | Account data is not shown; sign-in screen stays | Negative | P1 |
| TC-HC21-07 | Ans. 16 | Google or Facebook user has no Change password | Sign in with Google; open Account | "Change password" is not shown | Negative | P2 |
| TC-HC21-08 | Ans. 17 | New password equals the old one | Enter Kem12345 as both current and new password | Refused with an error; password is not changed | Negative | P3 |

## Ticket HC-22: Switch language

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC22-01 | AC1 | English to Vietnamese | Switch from English to Vietnamese | All screens show Vietnamese | Positive | P1 |
| TC-HC22-02 | AC2 | Language is remembered | Switch to Vietnamese, close the app, open it again | Still in Vietnamese | Positive | P1 |
| TC-HC22-03 | AC1 | Vietnamese to English | Switch back to English | All screens show English | Positive | P2 |
| TC-HC22-04 | AC1 | Error messages follow the language | Trigger a sign-in error in Vietnamese | Error text is in Vietnamese | Positive | P2 |
| TC-HC22-05 | AC1 | Product names stay as set | Switch language on the menu | Product names and prices (for example 25,000đ) keep their format | Positive | P3 |
| TC-HC22-06 | Ans. 18 | New user starts in Vietnamese | Open the app for the first time with an English browser and with a Vietnamese browser | Both start in Vietnamese | Positive | P1 |
