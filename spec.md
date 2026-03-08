# GPay Prank Clone

## Current State
- Full GPay-style prank app with dark theme, QR scanner, payment flow, bank selection, PIN system, balance check, transaction history, payment processing animations
- Profile picture in HomePage top-left: circular button w/ border, shows uploaded image or User icon fallback
- BottomNavigation "You" tab uses a generic `<User>` icon (not the profile picture)
- Payment success tone: gain values of 0.6 / 0.525
- Payment success tick: already a blue circle (#4285F4 via oklch) with white SVG path — this is correct but needs to be confirmed as solid blue circle with white checkmark (matches request)

## Requested Changes (Diff)

### Add
- Profile picture shown in BottomNavigation "You" tab (circular image, same style as real GPay — as seen in the uploaded screenshot where the bottom "You" tab shows the user's actual profile photo)

### Modify
- Profile pic icon in the search bar area (top of HomePage): make it match the GPay style from the reference image — the profile circle appears in the top-right of the search bar row (inside or right-aligned to the search bar), not in the top-left header. Currently it's top-left in a separate row. Move to top-right end of search bar row.
- Payment success tone: increase volume by 30% — multiply all gain values by 1.3 (0.6 → 0.78, 0.525 → 0.6825)
- Payment success tick: ensure it is a solid blue circle with a white checkmark inside (confirm/enforce blue #1a73e8 background, white tick SVG stroke)
- BottomNavigation "You" tab: replace generic User icon with the user's profile picture (circular, same image stored in localStorage), fallback to User icon if no photo uploaded

### Remove
- Nothing removed

## Implementation Plan
1. In `HomePage.tsx`: Move the profile picture button from the top-left header row to the right end of the search bar (inside the search bar row, replacing or sitting next to the QR icon), matching the GPay reference image layout
2. In `BottomNavigation.tsx`: Accept an optional `profilePic` prop; render a circular `<img>` in the "You" tab when a profile pic is set, otherwise keep the `<User>` icon. Read profilePic from localStorage in `App.tsx` and pass down.
3. In `App.tsx`: Read `gpay_profile_picture` from localStorage and pass to `BottomNavigation`; also listen for storage events or re-read when needed.
4. In `PaymentSuccessPage.tsx`: Increase gain values by 30% (0.6 → 0.78, 0.525 → 0.6825). Confirm tick circle is `background: "#1a73e8"` (blue) with white SVG stroke.
