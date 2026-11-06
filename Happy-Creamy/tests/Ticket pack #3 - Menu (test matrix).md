# Ticket pack #3 - Menu (test matrix)

Type: Positive = expected to work, Negative = expected to be refused, Boundary = at the edge of a limit, Open question = waiting for a client answer. Priority: P1 must pass to release, P2 should pass, P3 nice to have.

## Ticket HC-6: Browse the menu by category

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC6-01 | AC1 | Seven tabs are shown | Open the menu | All, New Arrivals, Best-Sellers, Cups, Cones, Take-away Tubs, Beverages | Positive | P1 |
| TC-HC6-02 | AC2 | Product card shows the required details | Look at any card on the All tab | Picture, name, base price and badge (New, Hot or Best-Seller) | Positive | P1 |
| TC-HC6-03 | AC3 | Cups tab shows only cups | Tap "Cups" | Only cups are listed | Positive | P1 |
| TC-HC6-04 | AC3 | Cones tab shows only cones | Tap "Cones" | Only cones are listed | Positive | P2 |
| TC-HC6-05 | AC3 | Take-away Tubs tab shows only tubs | Tap "Take-away Tubs" | Only tubs are listed | Positive | P2 |
| TC-HC6-06 | AC3 | Beverages tab shows only beverages | Tap "Beverages" | Only beverages are listed | Positive | P2 |
| TC-HC6-07 | AC3 | New Arrivals and Best-Sellers tabs | Tap each tab | Each tab lists only products with that badge or flag | Positive | P2 |
| TC-HC6-08 | AC2 | Price format | Look at the Mint Cloud Cup card | Price shows as 25,000đ | Positive | P2 |
| TC-HC6-09 | - | Tap a card opens its options | Tap Mint Cloud Cup | The options screen for that product opens | Positive | P1 |
| TC-HC6-10 | AC3 | A tab with no products | Open a tab that has no products | A friendly empty message; no blank page | Negative | P3 |
| TC-HC6-11 | Ans. 5 | Sold-out product is greyed out | Mark Mint Cloud Cup sold out in the selected branch | Card is greyed out with "Sold out"; it cannot be added to the cart | Positive | P1 |
| TC-HC6-12 | Ans. 5 | Sold out in one branch only | Mark Mint Cloud Cup sold out in branch A only; order from branch B | Product can be ordered from branch B and shows "Sold out" for branch A | Positive | P2 |

## Ticket HC-7: Customize a product

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC7-01 | AC1 | Price adds size and toppings | Mint Cloud Cup 25,000đ, Size M +15,000đ, Chocolate Sauce +5,000đ, Roasted Almonds +7,000đ | Price shows 25,000 + 15,000 + 5,000 + 7,000 = 52,000đ | Positive | P1 |
| TC-HC7-02 | AC2 | Tub offers two sizes and no toppings | Open Mint Cloud Tub | 400 ml 79,000đ and 1 litre 169,000đ; no toppings shown | Positive | P1 |
| TC-HC7-03 | AC3 | Beverage has no size, but has toppings | Open a beverage | No size choice; toppings can be added | Positive | P1 |
| TC-HC7-04 | AC4 | Note stops at 100 characters | Type 101 characters in the note | Only 100 are kept; counter shows "100/100" | Boundary | P1 |
| TC-HC7-05 | AC4 | Note with 99 characters | Type 99 characters | All 99 are kept; counter shows "99/100" | Boundary | P2 |
| TC-HC7-06 | AC1 | Price updates live | Pick a size, then add a topping, then remove it | Price changes at each step and returns to the earlier value | Positive | P2 |
| TC-HC7-07 | AC1 | No size and no toppings chosen | Open a cup and add nothing | Price is the base price 25,000đ | Positive | P3 |
| TC-HC7-08 | AC2 | Pick the 1 litre tub | Choose 1 litre | Price shows 169,000đ | Positive | P2 |
| TC-HC7-09 | AC4 | Note with special characters | Type "Ít đường, no nuts!" | Note is kept exactly as typed, including Vietnamese letters | Positive | P3 |

## Ticket HC-8: Add a product to the cart

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC8-01 | AC1 | Quantity multiplies the price | Price 52,000đ, set quantity to 2 | Line total is 104,000đ | Positive | P1 |
| TC-HC8-02 | AC2 | Add to cart shows the cart bar | Tap "Add to cart" | "Added to cart" message; cart bar shows item count and subtotal | Positive | P1 |
| TC-HC8-03 | AC3 | Different sizes are separate lines | Add Mint Cloud Cup Size M, then Size L | Cart has 2 separate lines | Positive | P1 |
| TC-HC8-04 | AC1 | Quantity cannot go below 1 | Tap "-" when quantity is 1 | Quantity stays 1 | Boundary | P1 |
| TC-HC8-05 | AC2 | Cart bar adds up several items | Add 2 different products | Count and subtotal include both | Positive | P2 |
| TC-HC8-06 | AC3 | Different toppings are separate lines | Add the same cup with and without Chocolate Sauce | Cart has 2 separate lines | Positive | P2 |
| TC-HC8-07 | AC3 | Different notes are separate lines | Add the same cup with 2 different notes | Cart has 2 separate lines | Positive | P3 |
| TC-HC8-08 | Ans. 6 | Same product and options merge into one line | Add Mint Cloud Cup Size M, Chocolate Sauce, Roasted Almonds twice | One line with quantity 2; line total 2 x 52,000 = 104,000đ | Positive | P1 |
| TC-HC8-09 | AC1 | Very high quantity | Set quantity to 99 | Total is correct and the screen still looks right | Boundary | P3 |
