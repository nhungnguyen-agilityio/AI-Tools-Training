QA · HAPPY CREAMY

# Feedback Test Matrix

Feature **Order feedback**Based on **Feedback Feature Spec 1.0** and **Feedback Ticket Pack**Prepared **6 Nov 2026**

Test cases for the two tickets: sending feedback (rating, options, comment and photos) and the feedback push notification. Export and retention are handled in the Admin web app and are not covered here. Cases tagged "Spec gap" test behavior the spec does not define yet; their expected result is to be confirmed.

## Coverage

Priority: P1 must pass before release, P2 should pass, P3 nice to cover. Types: Positive, Negative, Boundary, Non-functional, Spec gap.

## Test data

| Item | Details | Used for |
| --- | --- | --- |
| HC-2048 | Delivery order, Completed 29 Oct 2026 at 14:00, branch Happy Creamy Nguyen Hue. | Form, options for delivery, notification |
| HC-2031 | Pick-up order, Completed 29 Oct 2026 at 14:00. | Window boundary, options for pick-up |
| HC-2040 | Delivery order, status Out for delivery. | Not eligible yet |
| HC-2044 | Online-payment order cancelled after 10 minutes without payment. | Cancelled order |
| Customers | Customer A (Nhung) owns the orders above. Customer B owns a separate completed order. | Ownership checks |
| Clock | Test environment clock set to 30 Oct 2026, 5 Nov 2026 at 14:00, and 5 Nov 2026 at 14:01. | 7-day window |
| Photo files | photo-2mb.jpg (2 MB); photo-5mb-exact.png (5,242,880 bytes); photo-5mb-plus1.jpg (5,242,881 bytes); photo.webp; menu.pdf; fake.jpg (a PDF renamed); iphone.heic. | Photo size, type and count |
| Notification state | Browser notifications allowed, and blocked. iPhone with Safari, not added to the Home Screen. | Reminder notification |

## Options shown by rating and order type

| Rating | Delivery | Pick-up | Which options |
| --- | --- | --- | --- |
| 1 star | 6 | 4 | Problem options. Pick-up hides Slow Delivery and Melted on Arrival. |
| 2 stars | 6 | 4 | Same as 1 star. |
| 3 stars | 10 | 7 | Praise and problem options. Pick-up hides Fast Delivery, Slow Delivery and Melted on Arrival. |
| 4 stars | 4 | 3 | Praise options. Pick-up hides Fast Delivery. |
| 5 stars | 4 | 3 | Same as 4 stars. |

Praise: Friendly Staff, Good Product/Service, Fast Delivery, Cold and Fresh. Problem: Unfriendly Staff, Poor Product Quality, Slow Delivery, Melted on Arrival, Wrong Item, Order Not Complete.

## Boundary values

| Rule | Just inside | Just outside |
| --- | --- | --- |
| 7-day window | 5 Nov 2026 14:00 (completed 29 Oct 14:00) | 5 Nov 2026 14:01 |
| Comment length | 499 and 500 characters | 501 characters, and a 600-character paste |
| Photo count | 2 and 3 photos | 4th photo |
| Photo size | 5,242,880 bytes | 5,242,881 bytes |
| Rating | 1 star and 5 stars | No star chosen |

## Environment matrix

| Browser | Desktop | Mobile |
| --- | --- | --- |
| Chrome | Full pass: form, photos, push. | Full pass. Check the photo picker offers camera and gallery. |
| Edge | Full pass. | Smoke test: form, photos. |
| Firefox | Full pass. | Smoke test: form, photos. |
| Safari | Full pass. | iPhone: push only after Add to Home Screen (SRS II.2). Check HEIC photo behavior. |

## Test cases

Area Priority Type

This matrix lists what to test. Record pass or fail results in your test management tool. Export and 12-month retention are tested with the Admin web app.