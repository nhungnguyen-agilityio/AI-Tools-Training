# Lantern Stay — Sign-in Approach Decision

**Date:** 2026-10-28 · **Author:** <Nhung Nguyen> · AI-drafted, human-edited

## Recommendation
- Launch with Google sign-in plus an email + password fallback
- Add Zalo login in phase 2 once local bookings justify it.

## Comparison

| Criterion | Email + password | Google sign-in | Zalo login |
|---|---|---|---|
| Guest experience | Slowest: create password, verify email, reset when forgotten. Works for everyone. | One tap for anyone signed in to Google; email arrives verified. | One tap for Zalo users on phone; unfamiliar to most foreigners. |
| Setup effort (small team) | Highest: hashing, verification and reset emails, rate limiting, lockout. | Low: standard OIDC, free; basic scopes (openid, email, profile) need no security review, maybe a 2–3 day brand check. | Medium: OAuth v4 + PKCE via Zalo Developer Console; docs mostly in Vietnamese; no official Python SDK. |
| Ongoing cost | Transactional email service + support time for lockouts and resets. | Free. | Free to log in (to confirm); upkeep when Zalo changes its API. |
| Privacy/security risk | Highest: we store password hashes; credential stuffing; a breach is ours to report under Vietnam's PDP rules. | Low: no passwords stored; we keep only name and email. Depends on Google uptime and policy. | Low on our side; profile returns id, name, picture — no email confirmed, so we must still collect one. Zalo's 2025 data-consent terms drew criticism. |
| Use among Vietnamese guests | Universal fallback. | Common (31% used Gmail in a week; Android phones carry Google accounts). | Near-universal: 98% used Zalo in a week; 79.2M monthly users. |
| Use among foreign tourists | Universal fallback. | Very common for Western guests; weak for mainland China (Google blocked). | Rare; travel guides call it "not necessary" for short trips. |

## Why this recommendation
- **Fits the guest mix.** Google reaches most foreign tourists and many Vietnamese guests; email + password catches everyone else.
- **Least risk for a small team.** Google sign-in stores no passwords, and it gives a verified email, which booking confirmations need.
- **Cheap to build.** Standard OIDC with a maintained library (e.g., Authlib for FastAPI), with no review fee.
- **Zalo can wait.** Zalo is the strongest option for Vietnamese guests. However, it adds little for foreign guests and returns no confirmed email, so it does not replace the email step.

## Reasons against
- **Local guests get a weaker experience.** 98% of surveyed Vietnamese used Zalo in a week vs 31% for Gmail; leaving Zalo out may cost local bookings.
- **The fallback keeps most of the password risk.** We still build hashing, resets & lockout, and still own breach reporting under Decree 356.
- **Two methods, double the testing.** One person with two sign-in paths (Google and email) needs account-linking rules.
- **Google gaps.** Mainland Chinese guests often cannot reach Google; an outage or policy change blocks sign-in.
- **A login may not be needed at all.** A 12-room homestay could take bookings as a guest checkout with an emailed booking link, which skips all three options.

## Assumptions and open questions

### Assumptions
- Guests must sign in to book; the guest mix is roughly half foreign, half Vietnamese.
- The team is 1–2 developers on FastAPI, with no in-house security specialist.
- Lantern Stay counts as a small enterprise under Decree 356 (under 100,000 people's data, no sensitive data).
- Survey figures (Q&Me, N=100, Hanoi and HCMC) stand in for all Vietnamese guests.

### Open questions
- Does the client need accounts at all, or would guest checkout do?
- Is Zalo login free, and does it need app review? Zalo's own docs did not load; confirm in the Developer Console.
- Can Zalo return a phone number or email with extra permission?
- What share of guests come from mainland China?

## Sources
- [Q&Me — Vietnam mobile app popularity, Mar 2026 (N=100)](https://cdn.qandme.net/1773712237_Vietnam_mobile_app_popularity_2026_-_13032026.pdf)
- [Tuoi Tre — Zalo users and terms of service](https://news.tuoitre.vn/vietnams-80-million-user-messaging-giant-zalo-puts-spotlight-on-parent-vngs-business-103251229150347905.htm)
- [RedAI Zalo SDK auth guide — profile fields](https://unpkg.com/@warriorteam/redai-zalo-sdk@1.11.1/docs/AUTHENTICATION.md)
- [Unipile — Google OAuth verification](https://www.unipile.com/integrating-google-oauth-2-0-user-authentication-into-your-app/)
- [China Briefing — Decree 356 summary](https://www.china-briefing.com/china-outbound-news/vietnam-personal-data-protection-regulation-decree-356)
