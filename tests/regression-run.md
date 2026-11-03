# Regression run – 2026-11-03 – Nhung Nguyen

| # | Case | Expected | Result | Notes |
|---|------|----------|--------|-------|
| 1 | 3 nights Standard, 2 guests | 1,620,000 VND + note | Fail | LS-202 not built; got 1,800,000, no note |
| 2 | 4 nights Deluxe, 1 guest | 3,240,000 VND + note | Fail | LS-202 not built; got 3,600,000, no note |
| 3 | 10 nights Standard, 2 guests | 5,400,000 VND + note | Fail | LS-202 not built; got 6,000,000, no note |
| 4 | 1 night Standard, 2 guests | 600,000 VND, no note | Pass | |
| 5 | 2 nights Standard, 2 guests | 1,200,000 VND, no note | Pass | |
| 6 | 2 nights Deluxe, 2 guests | 1,800,000 VND, no note | Pass | |
| 7 | 3 nights Deluxe, 2 guests | 2,430,000 VND + note | Fail | LS-202 not built; got 2,700,000, no note |
| 8 | 30 nights Deluxe, 2 guests | 24,300,000 VND + note | Fail | LS-202 not built; got 27,000,000, no note |
| 9 | 2 → 3 nights Standard, 2 guests | 1,200,000 → 1,620,000 VND, note appears | Fail | LS-202 not built; got 1,200,000 → 1,800,000, no note |
| 10 | 3 → 2 nights Standard, 2 guests | 1,620,000 → 1,200,000 VND, note disappears | Fail | LS-202 not built; got 1,800,000 → 1,200,000, no note |
| 11 | 3 nights, Standard → Deluxe, 2 guests | 1,620,000 → 2,430,000 VND, note stays | Fail | LS-202 not built; got 1,800,000 → 2,700,000, no note |
| 12 | 3 nights Standard, 1 guest | 1,620,000 VND + note | Fail | LS-202 not built; got 1,800,000, no note |
| 13 | 3 nights Deluxe, 6 guests | 2,430,000 VND + note | Fail | LS-202 not built; got 2,700,000, no note |
| 14 | 3 nights Standard (Nov 29 → Dec 2), 2 guests | 1,620,000 VND + note | Fail | LS-202 not built; got 1,800,000, no note |
| 15 | 3 nights Deluxe (Dec 30 → Jan 2), 2 guests | 2,430,000 VND + note | Fail | LS-202 not built; got 2,700,000, no note |
| 16 | 2 nights Standard (Feb 27 → Mar 1, 2027), 2 guests | 1,200,000 VND, no note | Pass | |
| 17 | Check-in today, 3 nights Standard, 2 guests | 1,620,000 VND + note | Fail | LS-202 not built; got 1,800,000, no note |
| 18 | Check-out same day as check-in | Error R3, no price | Pass | |
| 19 | Check-out before check-in | Error R3, no price | Pass | |
| 20 | Check-in yesterday, 3 nights Standard | Error R2, no price | Fail | No past-date check; got 1,800,000 |
| 21 | 0 guests | Error R1 | Pass | |
| 22 | 7 guests | Error R1 | Pass | |
| 23 | 2.5 guests | Error R1 | Fail | 2.5 accepted; got 1,800,000 |
| 24 | Blank guests | Error R1 | Pass | |
| 25 | No room type | Validation error, no price | Fail | No validation; got "Total NaN VND" |

## Exploratory hour
Charter: Explore the guests field with unusual numeric input (1e1, +2, 2.0, 007, -1, huge values, pasted text) to discover R1 gaps beyond the decimal and blank cases already covered.
- 1e1 -> error message, correct
- +2 -> 1 night - 600,000 VND, correct
- 2.0 -> 1 night - 600,000 VND, correct
- 007 -> error message, correct
- -1 -> error message, correct
- 1,000,000 -> error message, correct
- Text -> cannot input, correct

Charter: Explore the date fields with keyboard typing, partial dates, a cleared field, and extreme years (0001, 9999) to discover invalid-date handling that gives NaN nights, a wrong price, or no error.
- Check-in: 0001, Check-out: 9999 -> A price, incorrect. The check-in day should be later than the current day.

Bugs filed today: <LS-204 #21>