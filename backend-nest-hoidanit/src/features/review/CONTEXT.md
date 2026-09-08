# Feature: Review

Reviews support public storefront submissions. New guest reviews store `reviewer_name`, `reviewer_email`, and `reviewer_phone`; email and phone remain private and are not included in `ReviewResponse`. Legacy seeded or authenticated reviews can continue to reference nullable `user_id` and `order_id` values.

## Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/products/:id/reviews` | List reviews for a product | No |
| POST | `/products/:id/reviews` | Submit name, email, phone, rating, comment, and up to 3 image URLs | No |
| POST | `/uploads/review-image` | Upload one JPEG, PNG, or WebP review image | No |
| PATCH | `/reviews/:id` | Update a legacy authenticated review | Yes |
| DELETE | `/reviews/:id` | Delete a legacy authenticated review | Yes |
| DELETE | `/admin/reviews/:id` | Admin delete any review | Admin |
| GET | `/admin/reviews` | List reviews with status/rating/product/search filters | Admin |
| PATCH | `/admin/reviews/:id/status` | Approve, hide, or return a review to pending | Admin |

The public response exposes only reviewer name. Contact data is retained for administration and never returned from the public endpoint.

Existing reviews are migrated as `approved`. New reviews start as `pending`, and the public product endpoint only returns `approved` reviews.
