# Feedback Ticket Pack

## HC-1 Send feedback for a completed order

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
  Then 4 stars are filled, I see "Good" under the stars, and I see 4 options: "Friendly Staff", "Good Product/Service", "Fast Delivery", "Cold and Fresh".
- AC5 Given I am rating delivery order HC-2048 and I tap the 2nd star, When the "What stood out?" list appears,
  Then I see 6 options: "Unfriendly Staff", "Poor Product Quality", "Slow Delivery", "Melted on Arrival", "Wrong Item", "Order Not Complete".
- AC6 Given I am rating pick-up order HC-2031 and I tap the 1st star, When the "What stood out?" list appears,
  Then I see 4 options and I do not see "Slow Delivery" or "Melted on Arrival".
- AC7 Given I tapped 5 stars on HC-2048 and selected "Friendly Staff" and "Good Product/Service", When I tap the 2nd star,
  Then both options are deselected and I see the 6 problem options with none selected.
- AC8 Given I chose 5 stars and typed 499 characters in the comment box, When I type 2 more characters,
  Then only the first is added and the counter shows "500/500".
- AC9 Given I attached 3 photos to the feedback for HC-2048, When I try to add a 4th photo,
  Then I see "You can add up to 3 photos." and still 3 thumbnails.
- AC10 Given I have a JPG photo of 5,242,881 bytes, When I add it,
  Then I see "This photo is larger than 5 MB. Choose a smaller one." and no thumbnail is added.
- AC11 Given I have a PDF file named menu.pdf, When I choose it as a photo,
  Then I see "Use a JPG, PNG or WebP photo." and no thumbnail is added.
- AC12 Given I chose 2 stars, "Slow Delivery", the comment "Melted a bit" and 1 photo for HC-2048, When I tap "Send feedback",
  Then I see "Thanks! Your feedback has been sent." and HC-2048 shows "Feedback sent" instead of "Rate this order".
- AC13 Given I already sent feedback for HC-2048, When I open Order History,
  Then I see "Feedback sent" with no way to edit or send a second feedback.

**Scope:** Customers can send one feedback per completed order within 7 days of completion: a required rating from 1 to 5 stars, optional predefined options that depend on the rating and order type, an optional comment of up to 500 characters, and up to 3 optional photos (JPG, PNG or WebP, up to 5 MB each). Available in Vietnamese and English.

**Non-scope:** the push notification (ticket 2); export, retention and any management view (handled in the Admin web app); editing or deleting feedback; showing feedback to other customers; rating cancelled orders

**Open questions (for the client)**
1. Please confirm the photo limits: 3 photos, 5 MB each, JPG, PNG or WebP. You asked for photos but gave no limits.
2. Please provide the approved Vietnamese text for the 10 options and the rating labels (Very bad, Bad, Okay, Good, Great).

## HC-2 Send a feedback push notification

**User story**
- As a customer who allowed notifications, I want a notification when my order is completed, so that I remember to rate it.

**Acceptance criteria**
- AC1 Given I allowed browser notifications and delivery order HC-2048 has the status Out for delivery, When store staff set the status to Completed,
  Then I receive one notification titled "How was your order?" with the text "Tell us about order HC-2048. It takes a minute.".
- AC2 Given I allowed browser notifications and pick-up order HC-2031 has the status Ready for pick-up, When store staff set the status to Completed,
  Then I receive one notification titled "How was your order?" with the text "Tell us about order HC-2031. It takes a minute.".
- AC3 Given I am signed in and received the HC-2048 notification, When I tap it,
  Then the app opens the feedback form for HC-2048.
- AC4 Given my session has expired and I received the HC-2048 notification, When I tap it and sign in,
  Then I land on the feedback form for HC-2048.
- AC5 Given I blocked browser notifications, When HC-2048 becomes Completed,
  Then I receive no notification and I see a "Rate this order" button on HC-2048 in Order History.
- AC6 Given HC-2048 was completed on 29 Oct 2026 at 14:00 and I did not rate it, When it is 5 Nov 2026 at 14:00,
  Then I have received exactly 1 notification for HC-2048.

**Scope:** One push notification per completed order, sent when store staff set the status to Completed, that opens the feedback form. Available in Vietnamese and English.

**Non-scope:** the feedback form (ticket 1); second reminders; email or SMS reminders; a notice when the window closes; promotional notifications; an in-app reminder banner

**Open questions (for the client)**
1. Please provide the approved Vietnamese wording for the notification title and text.