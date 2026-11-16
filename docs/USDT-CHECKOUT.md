# Manual USDT checkout

Add-to-cart buttons save catalog IDs and quantities locally and open /cart/. Prices are reloaded from the catalog, never trusted from browser storage. /checkout/ creates a browser-local order reference and payment snapshot. There is no server order ledger or automatic blockchain verification. Customers should save the order details and send the prepared Telegram message; opening Telegram alone does not submit an order.

USDT BEP20 on BNB Smart Chain and USDT TRC20 on TRON are enabled, using the merchant-provided public receivers in src/payment-config.js. The selected network controls the address, QR code, hash format, explorer link, and Telegram receipt. Never add private keys or seed phrases. Listed USD prices use the explicitly agreed fixed merchant rate of 1 USD = 1 USDT; transfer network fees are separate. Quote-only products and sample service packages require support confirmation and cannot proceed to transfer instructions.

Customers create instructions, transfer from their own wallet, paste the transaction hash, then review and send the receipt to @Eljh_Miller. The seller must check the actual transaction, network, USDT token, receiver, amount, confirmations, and whether that transaction has already been used before confirming the order. A syntactically valid hash does not prove payment. Delivery is 30 minutes–1 hour after order and payment confirmation.

Order drafts and optional contact details remain in the customer's browser (last 10 drafts); the Telegram message conveys them only when the customer sends it. Changing a receiver or catalog price invalidates old transfer instructions and directs the customer to support. Existing transaction hashes can still be submitted for review. Cart and checkout are noindex and excluded from public sitemaps.

Verification: npm run build and node --test tests/checkout.test.mjs. Browser QA covers adding products, totals, quantities, resume after reload, BEP20/TRC20 network selection, receipt preparation, and responsive layouts. No payment is sent during tests.
