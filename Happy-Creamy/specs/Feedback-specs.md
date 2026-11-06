# Feedback Feature Spec

Parent spec **Happy Creamy SRS 1.0 (MVP)**Version **1.0**Updated **5 Nov 2026**

Customers rate a completed order from 1 to 5 stars, choose predefined reasons, and add an optional comment and photos. Feedback goes to store management only.

## At a glance

| Topic | Rule |
| --- | --- |
| Who | A signed-in customer who placed the order. |
| About | One completed order, delivery or pick-up. The order gives us the branch and order type. |
| Where | Account > Order History, and the Completed order screen. The form is at `/account/orders/:orderId/feedback`. |
| When | Within 7 days (7 × 24 hours) of the order becoming Completed. |
| Limits | One feedback per order. It cannot be edited or deleted after sending. |
| Languages | Vietnamese and English. |

## How it works

1. Store staff set the order to **Completed**. If the customer allowed browser notifications, they get one push notification that opens the form.
2. The order shows **Rate this order** in Order History for 7 days. Cancelled orders, including unpaid online orders cancelled after 10 minutes, cannot be rated.
3. The customer picks a star rating, optionally selects reasons, writes a comment and adds photos, then taps **Send feedback**.
4. The order then shows **Feedback sent**. After 7 days without feedback it shows "The 7-day window to rate this order has ended."

## Feedback form

| Field | Required | Rules |
| --- | --- | --- |
| Star rating | Required | 1 to 5 stars. "Send feedback" stays disabled until a star is chosen. |
| Predefined options | Optional | Any number can be selected. The list depends on the rating and order type (next section). |
| Comment | Optional | Up to 500 characters. No moderation. |
| Photos | Optional | Up to 3 photos, JPG, PNG or WebP, 5 MB each. |

## Predefined options

The list is fixed in the MVP and set by the client. Labels exist in Vietnamese and English.

| Rating | Options shown |
| --- | --- |
| 1 or 2 stars | Unfriendly Staff, Poor Product Quality, Slow Delivery\*, Melted on Arrival\*, Wrong Item, Order Not Complete |
| 3 stars | All 10 options |
| 4 or 5 stars | Friendly Staff, Good Product/Service, Fast Delivery\*, Cold and Fresh |

- \* Delivery only. These options are hidden on pick-up orders.
- If the customer changes the rating, selected options that are not in the new list are deselected.
- "Staff" options cover both the counter team and the delivery rider.

## Data, access and export

- **Visibility:** store management only. Other customers never see it, and the customer sees only "Feedback sent". The customer's name is visible to management only.
- **Retention:** feedback and photos are deleted 12 months after submission.
- **Export:** the MVP only collects feedback. Management receives a CSV export with the order ID, order type, branch, rating, options, comment, photo links, customer name and submission time. There is no back-office screen, no alert to staff and no reply to the customer.

## Out of scope

Public display of feedback; editing or deleting feedback; alerts and replies; a back-office screen; comment moderation; separate ratings for product, service and delivery; feedback without an order; anonymous feedback.

Exact on-screen wording and acceptance criteria are in the Feedback Ticket Pack.