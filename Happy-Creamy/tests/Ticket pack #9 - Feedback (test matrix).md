# Ticket pack #9 - Feedback (test matrix)

Type: Positive = expected to work, Negative = expected to be refused, Boundary = at the edge of a limit, Open question = waiting for a client answer. Priority: P1 must pass to release, P2 should pass, P3 nice to have.

## Ticket HC-23: Send feedback for a completed order

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC23-01 | AC1 | Button still shown on the last minute | Pick-up HC-2031 completed 29 Oct 2026 14:00; open Order History on 5 Nov 2026 14:00 | "Rate this order" button is shown | Boundary | P1 |
| TC-HC23-02 | AC2 | Window ends after 7 days | Same order; open Order History on 5 Nov 2026 14:01 | "The 7-day window to rate this order has ended." and no button | Boundary | P1 |
| TC-HC23-03 | AC3 | Send is disabled without stars | Open the form for delivery order HC-2048; tap no star | "Send feedback" is disabled; "Choose a star rating to continue." | Negative | P1 |
| TC-HC23-04 | AC4 | Four stars on a delivery order | Tap the 4th star on delivery order HC-2048 | 4 stars filled; "Good"; 6 options: Delicious flavor, Smooth & creamy, Arrived cold & frozen, Great packaging, Fast delivery, Friendly driver | Positive | P1 |
| TC-HC23-05 | AC4 | Rating labels | Tap stars 1, 2, 3 and 5 | Labels Very bad, Bad, Okay and Great for stars 1, 2, 3 and 5 | Positive | P2 |
| TC-HC23-06 | AC5 | Two stars on a delivery order | Tap the 2nd star on HC-2048 | 6 options: Melted on arrival, Too sweet / Too icy, Wrong item / Missing toppings, Slow delivery, Messy packaging, Unfriendly driver | Positive | P1 |
| TC-HC23-07 | Open | Options on a pick-up order | Tap 1 star and 5 stars on pick-up order HC-2031 | Planned: delivery-trip options are hidden (Melted on arrival, Slow delivery, Unfriendly driver; Arrived cold & frozen, Fast delivery, Friendly driver). Blocked until the client confirms this | Open question | P2 |
| TC-HC23-08 | AC7 | Changing the rating clears options | 5 stars with Delicious flavor and Great packaging picked, then tap the 2nd star | Both options deselected; 6 problem options shown, none selected | Positive | P1 |
| TC-HC23-09 | AC7 | Moving from 3 to 4 stars swaps the list | Tap 3 stars, pick Slow delivery, then tap 4 stars | List changes to the 6 positive options; Slow delivery is cleared | Positive | P2 |
| TC-HC23-10 | AC8 | Comment stops at 500 characters | Type 499 characters, then 2 more | Only 1 more is added; counter "500/500" | Boundary | P1 |
| TC-HC23-11 | AC8 | Comment is optional | Send with 4 stars and no comment | Feedback is sent | Positive | P2 |
| TC-HC23-12 | AC9 | Fourth photo is refused | Attach 3 photos, try to add a 4th | "You can add up to 3 photos." and still 3 thumbnails | Boundary | P1 |
| TC-HC23-13 | AC9 | Three photos are accepted | Attach 3 valid photos | 3 thumbnails shown | Positive | P1 |
| TC-HC23-14 | AC10 | Photo just over 5 MB | JPG of 5,242,881 bytes | "This photo is larger than 5 MB. Choose a smaller one."; no thumbnail | Boundary | P1 |
| TC-HC23-15 | AC10 | Photo at exactly 5 MB | JPG of 5,242,880 bytes | Photo is accepted | Boundary | P1 |
| TC-HC23-16 | AC11 | PDF as a photo | Choose menu.pdf | "Use a JPG, PNG or WebP photo."; no thumbnail | Negative | P1 |
| TC-HC23-17 | AC11 | PNG and WebP are accepted | Add one PNG and one WebP | Both are accepted | Positive | P2 |
| TC-HC23-18 | AC12 | Send full feedback | 2 stars, Slow delivery, comment "Melted a bit", 1 photo on HC-2048 | "Thanks! Your feedback has been sent."; HC-2048 shows "Feedback sent" | Positive | P1 |
| TC-HC23-19 | AC12 | Send with stars only | Choose 5 stars and tap "Send feedback" | Feedback is sent with no options, comment or photo | Positive | P1 |
| TC-HC23-20 | AC13 | No second feedback | Open Order History after sending for HC-2048 | "Feedback sent"; no way to edit or send again | Negative | P1 |
| TC-HC23-21 | - | Cancelled order cannot be rated | Open Order History with a cancelled order | No "Rate this order" button | Negative | P2 |
| TC-HC23-22 | AC12 | Network fails on send | Turn off the network and tap "Send feedback" | Error is shown; stars, comment and photos are kept | Negative | P2 |
| TC-HC23-23 | AC9 | Remove a photo | Remove one of 3 photos | 2 thumbnails left; a new photo can be added | Positive | P3 |
| TC-HC23-24 | Ans. 19 | Three stars show the problem options | Tap the 3rd star on HC-2048 | "Okay" and the same 6 problem options as 1 and 2 stars | Positive | P1 |
| TC-HC23-25 | Ans. 20 | Mixed photo formats at the limit | Add a 5 MB JPG, a 5 MB PNG and a 5 MB WebP | All 3 are accepted | Positive | P2 |
| TC-HC23-26 | Ans. 21 | Vietnamese text | Switch to Vietnamese; open the form | Blocked until the client gives the approved Vietnamese text for the 12 options and the 5 rating labels (English text was given) | Open question | P3 |

## Ticket HC-24: Send a feedback notification

| ID | AC | Scenario | Test data and steps | Expected result | Type | Priority |
|---|---|---|---|---|---|---|
| TC-HC24-01 | AC1 | Delivery order completed (English) | Language English; HC-2048 goes from Out for delivery to Completed | One bell item titled "Order Delivered! 🍦" with the text "How was your ice cream? Leave a quick review to help us serve you better!" | Positive | P1 |
| TC-HC24-02 | AC1 | Pick-up order completed | HC-2031 goes from Ready for pick-up to Completed | The same feedback item, created once (title question is open) | Positive | P1 |
| TC-HC24-03 | AC5 | Tap opens the form | Signed in; tap the HC-2048 feedback item in the bell list | Item is marked as read and the feedback form for HC-2048 opens | Positive | P1 |
| TC-HC24-04 | AC6 | Tap the push after the session expired | Session expired; tap the push and sign in | Lands on the feedback form for HC-2048 | Positive | P1 |
| TC-HC24-05 | AC7 | Push blocked: bell item and button remain | Block notifications; HC-2048 becomes Completed | No push; the bell list has the feedback item; "Rate this order" shows in Order History | Negative | P1 |
| TC-HC24-06 | AC8 | Only one notification | HC-2048 completed 29 Oct 2026 14:00 and not rated; check on 5 Nov 2026 14:00 | Exactly 1 feedback item received for HC-2048 | Boundary | P1 |
| TC-HC24-07 | AC1 | No feedback item before Completed | Move an order through Received, Preparing, Out for delivery | No "Order Delivered!" item; only the status items | Negative | P2 |
| TC-HC24-08 | AC1 | Two orders, two notifications | Complete HC-2048 and HC-2031 | Two notifications, each with its own order number | Positive | P2 |
| TC-HC24-09 | AC1 | Cancelled order | An unpaid order is cancelled by timeout | No feedback notification | Negative | P2 |
| TC-HC24-10 | AC3 | Tap after the 7-day window | Tap the notification on day 8 | "The 7-day window to rate this order has ended." | Negative | P2 |
| TC-HC24-11 | AC3 | Tap for an order already rated | Rate HC-2048, then tap its notification | Shows "Feedback sent"; no second form | Negative | P2 |
| TC-HC24-12 | AC4 | Only the feedback item at Completed | The order becomes Completed; open the bell list | One feedback item; no separate "Completed" status item | Negative | P1 |
| TC-HC24-13 | Ans. 23 | Vietnamese notification | Language Vietnamese; HC-2048 becomes Completed | Title "Đơn hàng đã hoàn thành! 🍦", text "Bạn thấy kem hôm nay thế nào? Chia sẻ phản hồi ngay để giúp shop nâng cao dịch vụ nhé!" | Positive | P1 |
| TC-HC24-14 | AC3 | Push also sent when allowed | Push on in Account and allowed in the browser; HC-2048 becomes Completed | The same title and text arrive as a push as well as a bell item | Positive | P1 |
| TC-HC24-15 | AC2 | English title for a pick-up order | Complete a pick-up order; read the English title | Blocked: the English title says "Delivered"; confirm that pick-up orders use it or need a different title | Open question | P3 |