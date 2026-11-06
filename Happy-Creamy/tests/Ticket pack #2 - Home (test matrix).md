# Ticket pack #2 - Home (test matrix)

Type: Positive = expected to work, Negative = expected to be refused, Boundary = at the edge of a limit, Open question = waiting for a client answer. Priority: P1 must pass to release, P2 should pass, P3 nice to have.

## Ticket HC-4: See offers on Home

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC4-01 | AC1 | Banner carousel shows on Home | Sign in and open Home | A carousel of new products and offers is shown | Positive | P1 |
| TC-HC4-02 | AC2 | Swipe moves to the next banner | On a phone, swipe left on banner 1 | Banner 2 is shown | Positive | P1 |
| TC-HC4-03 | AC2 | Tap a dot moves to that banner | On desktop, tap the third dot | Banner 3 is shown | Positive | P1 |
| TC-HC4-04 | Ans. 4 | Banner does nothing when tapped (MVP) | Tap a banner on Home | Nothing happens: no new page and no menu opens | Negative | P1 |
| TC-HC4-05 | AC2 | Swipe past the last banner | Swipe left on the last banner | Carousel loops or stops at the end, the same on every device | Boundary | P3 |
| TC-HC4-06 | AC1 | Banner image fails to load | Block one banner image | A placeholder shows; the other banners still work | Negative | P3 |
| TC-HC4-07 | AC1 | Only one banner | Set up a single banner | Banner shows with no dots or arrows | Boundary | P3 |
| TC-HC4-08 | Ans. 4 | Banner does not look clickable | Hover over a banner and tab through the page on desktop | No pointer cursor; a banner is not a link or button | Negative | P2 |

## Ticket HC-5: Jump to the menu from Home

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC5-01 | AC1 | Four quick icons are shown | Open Home | Best-Sellers, Cups, Cones and Take-away Tubs are shown | Positive | P1 |
| TC-HC5-02 | AC2 | Cups icon opens the Cups category | Tap "Cups" | Menu opens with the Cups tab selected | Positive | P1 |
| TC-HC5-03 | AC2 | Best-Sellers icon opens its category | Tap "Best-Sellers" | Menu opens with the Best-Sellers tab selected | Positive | P2 |
| TC-HC5-04 | AC2 | Cones icon opens its category | Tap "Cones" | Menu opens with the Cones tab selected | Positive | P2 |
| TC-HC5-05 | AC2 | Take-away Tubs icon opens its category | Tap "Take-away Tubs" | Menu opens with the Take-away Tubs tab selected | Positive | P2 |
| TC-HC5-06 | AC3 | Order Now opens the full menu | Tap "Order Now" | Menu opens on the All tab | Positive | P1 |
| TC-HC5-07 | - | Back from the menu returns to Home | Open the menu from an icon, then go back | Home is shown again | Positive | P3 |
| TC-HC5-08 | - | Icon labels follow the language | Switch to Vietnamese | The 4 icon labels show in Vietnamese | Positive | P3 |
