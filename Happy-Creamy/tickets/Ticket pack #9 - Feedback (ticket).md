# Ticket pack #9 - Feedback

## Ticket 1: Send feedback for a completed order

**User story**
- As a signed-in customer with a completed order, I want to rate it, choose what stood out, and add a comment and photos, so that Happy Creamy knows how my order went.

**Acceptance criteria**
- AC1 Given pick-up order HC-2031 was completed on 29 Oct 2026 at 14:00, When I open Account > Order History on 5 Nov 2026 at 14:00,
  Then I see a "Rate this order" button on HC-2031.
- AC2 Given pick-up order HC-2031 was completed on 29 Oct 2026 at 14:00, When I open Account > Order History on 5 Nov 2026 at 14:01,
  Then I see "The 7-day window to rate this order has ended." and no "Rate this order" button.
- AC3 Given I opened the feedback form for delivery order HC-2048 and have not tapped a star, When I look at "Send feedback",
  Then it is disabled and I see "Choose a star rating to continue.".
- AC4 Given I opened the feedback form for delivery order HC-2048, When I tap the 4th star,
  Then 4 stars are filled, I see "Good" under the stars, and I see 6 options: "Delicious flavor", "Smooth & creamy", "Arrived cold & frozen", "Great packaging", "Fast delivery", "Friendly driver".
- AC5 Given I am rating delivery order HC-2048, When I tap the 2nd star,
  Then I see 6 options: "Melted on arrival", "Too sweet / Too icy", "Wrong item / Missing toppings", "Slow delivery", "Messy packaging", "Unfriendly driver".
- AC6 Given I am rating delivery order HC-2048, When I tap the 3rd star,
  Then I see the same 6 options as for 1 and 2 stars.
- AC7 Given I am rating pick-up order HC-2031, When I tap the 1st star,
  Then I see 3 options ("Too sweet / Too icy", "Wrong item / Missing toppings", "Messy packaging") and I do not see "Melted on arrival", "Slow delivery" or "Unfriendly driver".
- AC8 Given I tapped 5 stars on HC-2048 and selected "Delicious flavor" and "Smooth & creamy", When I tap the 2nd star,
  Then both options are deselected and I see the 6 negative options with none selected.
- AC9 Given I chose 5 stars and typed 499 characters in the comment box, When I type 2 more characters,
  Then only the first is added and the counter shows "500/500".
- AC10 Given I attached 3 photos to the feedback for HC-2048, When I try to add a 4th photo,
  Then I see "You can add up to 3 photos." and still 3 thumbnails.
- AC11 Given I have a JPG photo of 5,242,881 bytes, When I add it,
  Then I see "This photo is larger than 5 MB. Choose a smaller one." and no thumbnail is added.
- AC12 Given I have a PDF file named menu.pdf, When I choose it as a photo,
  Then I see "Use a JPG, PNG or WebP photo." and no thumbnail is added.
- AC13 Given I chose 2 stars, "Slow delivery", the comment "Melted a bit" and 1 photo for HC-2048, When I tap "Send feedback",
  Then I see "Thanks! Your feedback has been sent." and HC-2048 shows "Feedback sent" instead of "Rate this order".
- AC14 Given I already sent feedback for HC-2048, When I open Order History,
  Then I see "Feedback sent" with no way to edit or send a second feedback.

**Scope:** Customers can send one feedback per completed order within 7 days of completion: a required rating from 1 to 5 stars, optional predefined options (6 positive for 4 and 5 stars, 6 negative for 1 to 3 stars), an optional comment of up to 500 characters, and up to 3 optional photos (JPG, PNG or WebP, up to 5 MB each). Available in Vietnamese and English.

**Non-scope:** the notification (ticket 2); export, retention and any management view (Admin web app); editing or deleting feedback; showing feedback to other customers; rating cancelled orders

**Open questions (for the client)**
1. On pick-up orders we hide the 6 options about the delivery trip (Arrived cold & frozen, Fast delivery, Friendly driver, Melted on arrival, Slow delivery, Unfriendly driver). Is that right?
2. Please provide the approved Vietnamese text for the 12 options and the rating labels (Very bad, Bad, Okay, Good, Great).

## Ticket 2: Send a feedback notification

**User story**
- As a customer, I want a notification when my order is completed, so that I remember to rate it.

**Acceptance criteria**
- AC1 Given delivery order HC-2048 is Out for delivery and my language is English, When store staff set the status to Completed,
  Then I get one bell item titled "Order Delivered! 🍦" with the text "How was your ice cream? Leave a quick review to help us serve you better!".
- AC2 Given delivery order HC-2048 is Out for delivery and my language is Vietnamese, When store staff set the status to Completed,
  Then I get one bell item titled "Đơn hàng đã hoàn thành! 🍦" with the text "Bạn thấy kem hôm nay thế nào? Chia sẻ phản hồi ngay để giúp shop nâng cao dịch vụ nhé!".
- AC3 Given push notifications are on in Account and my browser allows them, When HC-2048 becomes Completed,
  Then I also get the same message as a push.
- AC4 Given HC-2048 becomes Completed, When I check the bell list,
  Then I see only the feedback item and no "Completed" status item.
- AC5 Given I am signed in and see the HC-2048 feedback item, When I tap it,
  Then the item is marked as read and the feedback form for HC-2048 opens.
- AC6 Given my session has expired and I received the HC-2048 notification, When I tap the push and sign in,
  Then I land on the feedback form for HC-2048.
- AC7 Given push is off or blocked, When HC-2048 becomes Completed,
  Then I get no push, the bell list has the feedback item, and I see "Rate this order" on HC-2048 in Order History.
- AC8 Given HC-2048 was completed on 29 Oct 2026 at 14:00 and I did not rate it, When it is 5 Nov 2026 at 14:00,
  Then I have received exactly 1 feedback notification for HC-2048.

**Scope:** One feedback notification per completed order, sent when store staff set the status to Completed: a bell item, plus a push when allowed. It opens the feedback form. Vietnamese and English text.

**Non-scope:** the feedback form (ticket 1); second reminders; email or SMS; a notice when the window closes; promotional notifications

**Open questions (for the client)**
1. The English title "Order Delivered!" does not fit pick-up orders. Should pick-up orders use the same title, or "Order Completed!"?