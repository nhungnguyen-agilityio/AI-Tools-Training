# Ticket pack #3 - Menu

## Ticket 1: Browse the menu by category

**User story**
- As a customer, I want to browse products by category, so that I can find what I want.

**Acceptance criteria**
- AC1 Given I open the menu, When I look at the tabs,
  Then I see All, New Arrivals, Best-Sellers, Cups, Cones, Take-away Tubs, Beverages.
- AC2 Given I am on the All tab, When I look at a product card,
  Then I see its picture, name, base price and badge (New, Hot or Best-Seller).
- AC3 Given I am on the All tab, When I tap "Cups",
  Then I see only cups.
- AC4 Given a product is sold out at my branch, When I look at its card,
  Then the card is greyed out with a "Sold out" badge and I cannot add it to the cart.
- AC5 Given a product is sold out at one branch only, When I switch to a branch that still has it,
  Then the card is normal and I can add it.

**Scope:** Product list, 7 category tabs and product cards. Sold-out products are shown greyed with "Sold out", per branch.

**Non-scope:** search; favorites; managing products and prices (Admin web app)

## Ticket 2: Customize a product

**User story**
- As a customer, I want to choose size, toppings and a note, so that my ice cream is made my way.

**Acceptance criteria**
- AC1 Given I picked Mint Cloud Cup (25,000đ), When I choose Size M (+15,000đ), Chocolate Sauce (+5,000đ) and Roasted Almonds (+7,000đ),
  Then the price shows 25,000 + 15,000 + 5,000 + 7,000 = 52,000đ.
- AC2 Given I picked Mint Cloud Tub, When I open its options,
  Then I can choose 400 ml (79,000đ) or 1 litre (169,000đ) and I see no toppings.
- AC3 Given I picked a beverage, When I open its options,
  Then I see no size choice and I can add toppings.
- AC4 Given I am typing a special note, When I reach 100 characters,
  Then I cannot type more and the counter shows "100/100".

**Scope:** Size, toppings and special note, with the price updating as I choose.

**Non-scope:** adding to the cart (ticket 3); custom flavors

## Ticket 3: Add a product to the cart

**User story**
- As a customer, I want to add my ice cream to the cart, so that I can order several items together.

**Acceptance criteria**
- AC1 Given the price is 52,000đ, When I set the quantity to 2,
  Then the line total is 104,000đ.
- AC2 Given I finished choosing options, When I tap "Add to cart",
  Then I see "Added to cart" and the cart bar shows the item count and subtotal.
- AC3 Given I already added Mint Cloud Cup Size M with no toppings, When I add the same product, size and toppings again,
  Then the cart has 1 line with quantity 2.
- AC4 Given I already added Mint Cloud Cup Size M, When I add Mint Cloud Cup Size L,
  Then the cart has 2 separate lines.

**Scope:** Quantity, "Add to cart" and the cart bar.

**Non-scope:** the cart screen and checkout (Order pack)