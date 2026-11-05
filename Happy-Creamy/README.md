# Happy Creamy Web Application
 
A responsive ice cream ordering web app for desktop and mobile web in Vietnam. Customers sign in, browse the menu, customize scoops and toppings, then order for in-house delivery or store pick-up.
 
**Spec version:** 1.0 (MVP)
 
## Project documents
 
| Document | What it is | Link |
| --- | --- | --- |
| Software Requirement Specification | The full MVP spec (Sections I to VI) with a fee calculator | https://claude.ai/artifact/54SiVSvyxHbopJJRx88aYm |
| App mock-up | Interactive design in pink and white: a mobile order flow and a desktop menu and cart | https://claude.ai/artifact/GhytdCr54KxzRif8HNaGM1 |
 
The SRS is the source of truth. When this README and the SRS disagree, the SRS wins.
 
## What the app does
 
- **Sign-in is required** for every route. Options: Email/Password, Google, Facebook. Email accounts must verify an email OTP before their first sign-in.
- **Menu:** New Arrivals, Best-Sellers, Cups, Cones, Take-away Tubs (400 ml / 1 L) and Beverages. Sizes S, M and L add to the base price; toppings add per item.
- **Checkout:** Delivery or Pick-up (15-minute slots). Payment by COD, MoMo, VietQR, or Visa/Mastercard through VNPay.
- **Stores:** a map and branch list with live open status, directions and a call link.
- **Account:** active orders shown as a status timeline, order history, saved addresses and settings.
- **Languages:** Vietnamese and English.
## Key business rules
 
All prices are in VND. The full wording is in SRS Section IV.
 
| Rule | Value |
| --- | --- |
| Minimum delivery order | 30,000 VND of items, before fees. Pick-up has no minimum. |
| Delivery radius | 10 km from the nearest open branch |
| Delivery fee | Under 2 km: 15,000. From 2 km up to 5 km: 25,000. From 5 km to 10 km: 35,000. |
| Insulated packaging fee | 10,000 VND, once per order, for delivery over 3 km or any order with a Take-away Tub |
| Online payment window | MoMo, VietQR and card orders are cancelled after 10 minutes without confirmation. COD has no window. |
| Delivery hours | Only while the nearest branch is open (for example 08:30 to 21:30) |
| Fulfilment | In-house fleet only. No third-party dispatch API is used. |
 
**Total payable** = items + packaging fee + delivery fee. For example, 85,000 + 10,000 + 25,000 = 120,000 VND for an 85,000 VND order delivered 4.2 km.
 
**Order statuses**
 
- Delivery: Received, Preparing, Out for delivery, Completed.
- Pick-up: Received, Preparing, Ready for pick-up, Completed.
- Online payment: Awaiting payment, then Received, or Cancelled after 10 minutes.
## Integrations
 
- Google Sign-In SDK and Facebook Login SDK (OAuth 2.0)
- Google Maps API (distance, fees and the store map)
- MoMo Wallet API
- VietQR API
- VNPay (Visa/Mastercard)
- Browser Geolocation and web push notifications
## Out of MVP scope
 
- Customer cancellation and refunds (unpaid online orders still auto-cancel after 10 minutes)
- Live rider map (tracking is a status timeline only)
## Status
 
- The SRS is drafted and answered. The mock-up is built.
- The tech stack has not been chosen. Decide it before writing code.
- Not yet defined in the spec: the minimum lead time for pick-up orders.
## Mock-up notes
 
The mock-up uses made-up sample content: flavor names, prices, shop addresses and the user "Nhung". Real menu data and branch details should replace them. On the mobile frame, press Play and sign in to try the flow. The "Demo: next status" button stands in for store staff updating an order.