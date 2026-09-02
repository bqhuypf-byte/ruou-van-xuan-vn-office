# Feature: Checkout (Client)

`CheckoutPage` creates an order from the current cart and the customer's selected shipping address. The cart passes an applied voucher through the `voucher` query parameter.

Before displaying or submitting the final total, checkout validates the voucher again with `POST /vouchers/validate` using the current item subtotal. Invalid or expired vouchers block order submission, while valid fixed or percentage discounts are shown as a separate line in the order summary and sent to the backend as `voucherCode` for authoritative revalidation.
