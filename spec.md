# Specification

## Summary
**Goal:** Add a bank selection bottom sheet after PIN entry, update the payment success screen with new button states, and add a small spacing gap on the home screen.

**Planned changes:**
- Add ~16px vertical spacing gap between the GPay multicolor logo and the quick action icons grid on the home screen (HomePage.tsx).
- After PIN is validated on PaymentEntryPage, show a bank selection bottom sheet that slides up from the bottom, covering ~1/4 of the screen height, with a dark background matching the app theme.
- The bottom sheet contains two bank rows: HDFC Bank (inline SVG logo — red bracket/frame outer shape with blue square center + "HDFC BANK" text on blue bar with white letters — with account "·· 3107") and SBI Bank (inline SVG blue circular emblem with "·· 3110"), plus small gray helper text "Choose to continue your bank for transaction" below the rows.
- Bottom sheet has a gray "Cancel" pill button (dismisses sheet, returns to payment entry) and a blue (#1a73e8) "Continue" pill button (proceeds to payment success screen).
- Update PaymentSuccessPage Phase 2 (after 5 seconds): show "powered by" in very small uppercase text above a slightly larger GPay/UPI logo mark centered at the bottom, plus a gray "Cancel ✕" pill button and a blue "Continue" pill button.
- After the Phase 2 reveal, swap the Cancel/Continue buttons with an outlined "Screenshot receipt" pill button (left, shows a mock "Screenshot saved" toast) and a solid blue "Continue" pill button (right, navigates to home screen).

**User-visible outcome:** Users experience a realistic bank selection step before seeing the payment success screen, with updated success screen buttons including a mock screenshot action and a continue-to-home option.
