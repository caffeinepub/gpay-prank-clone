# GPay Prank Clone

## Current State
- Home page has a row of 4 quick-send buttons: Send, Request, Pay Bills, History (grid-cols-4)
- QuickActions component shows 6 service icons in a grid below contact circles
- GPay logo sits above the quick-send buttons with some spacing
- PaymentProcessingOverlay shows a spinning ₹ symbol with orbiting blue lines for 2.5s
- No payment processing animation triggered after bank selection + continue (only after PIN+bank)

## Requested Changes (Diff)

### Add
- QR Code Scanner quick-send button: add as a new icon to the LEFT of the Send icon (making it the first button in the row), styled identically (blue circle, white icon, white label "Scan QR")
- Pay Bills icon moved to just below QR Code Scanner icon (second row position, below Scan QR)
- Extra vertical spacing (mt-6 or equivalent ~24px gap) between the GPay logo and the quick-send button row
- New payment processing overlay animation (2–2.05s total):
  - Phase 1 (0–1s): Google Blue (#4285F4) circular spinner (arc segments ~20px diameter stroke) rotating clockwise smoothly on a semi-transparent #121212 overlay
  - Phase 2 (1–2.05s): success — bright emerald green checkmark (#00C851, lighter variant) pulsing with cyan/white confetti bursts scattering radially, bounce easing

### Modify
- Quick-send button row: change from 4 columns to 5 columns (Scan QR, Send, Request, Pay Bills, History), or arrange as 2 rows of buttons if 5 doesn't fit well on mobile
- PaymentProcessingOverlay: replace current ₹ spin animation with the new two-phase spinner → success checkmark + confetti animation described above
- Trigger: the new overlay fires AFTER the user taps "Continue" in the bank selection sheet (same trigger point as now)

### Remove
- Nothing removed

## Implementation Plan
1. In `HomePage.tsx`: add extra top margin (mt-6 or ~24px) between `<GPayLogo />` and the quick-send buttons div
2. In `HomePage.tsx`: add "Scan QR" as first button in the quick-send grid (navigates to 'scan'), restructure row to show 5 items — use grid-cols-5 or wrap into 2 rows of 3/2 or 3/2
3. Move "Pay Bills" to below the "Scan QR" position (second row if using 2 rows, or keep in grid naturally as 3rd item if grid-cols-5)
4. Replace `PaymentProcessingOverlay.tsx` entirely with the new two-phase animation:
   - Phase 1: full-screen #121212 semi-transparent overlay, centered Google Blue circular arc spinner (stroke-dasharray rotating arc, ~20px stroke-width, ~60px radius)
   - Phase 2: spinner fades out, green checkmark (#00C851 lighter) draws in with scale/pulse bounce, then cyan+white confetti particles burst radially (10-16 particles, CSS or JS animation, random angles, bounce easing)
   - Total duration: 2–2.05s, then calls onComplete
5. Validate: no TypeScript errors, build passes

## UX Notes
- Quick-send buttons: if 5 icons don't fit cleanly in one row on a 375px screen (w-14 icons + labels), use 2 rows: row 1 = [Scan QR, Send, Request], row 2 = [Pay Bills, History] centered, or grid-cols-5 with smaller icon size (w-12)
- Confetti particles: 12–16 particles, each a small dot or short line, random initial direction (0–360°), travel ~60–100px, fade out, bounce ease; pure CSS keyframe animations with different delays/angles per particle
- The overlay background should be rgba(18,18,18,0.97) or #121212 with high opacity so it covers the app fully
