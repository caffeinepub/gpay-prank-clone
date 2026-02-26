# GPay Prank Clone

## Current State
- Full GPay-style prank app with dark theme, home screen, payment flow, bank selection sheet (HDFC/SBI), payment success screen with 5-second reveal, transaction history, and transaction detail page.
- BalancePage uses a single shared balance from the backend (via useGetBalance/useUpdateBalance hooks). It shows PIN entry first, then balance with an Edit button.
- No per-bank balance storage. No bank selection before PIN in balance flow.
- No utility/backup buttons anywhere in the app.
- No disguised wallet icon for balance editing.

## Requested Changes (Diff)

### Add
1. **Check Balance flow — bank selection first**: When user navigates to balance, show HDFC (3107) and SBI (3110) bank rows before PIN entry. Each row has a selectable circle in the top-right corner. Selecting a row marks it with a blue tick. A "Continue" button at the bottom proceeds to PIN entry.
2. **Per-bank balance storage**: Each bank (hdfc, sbi) stores its own balance independently in localStorage (keys: `gpay_balance_hdfc`, `gpay_balance_sbi`). Starting value: `0.00`. Persists until changed.
3. **Disguised wallet icon for balance editing**: After PIN is entered and balance is shown, the "Edit" button is replaced by a small wallet icon button (Wallet icon from lucide-react) positioned to the right, slightly below the last digit of the balance. Clicking it reveals the edit input field.
4. **Backup ZIP button**: In the "You" tab / settings area (or a visible floating area in the app), add a button labeled "Backup ZIP" that collects all localStorage app data (transactions, balances, PIN settings, user inputs) as JSON and downloads it as a `.zip` file containing `backup.json`. Uses JSZip or a manual Blob approach (no external library — use manual ZIP-like approach with a JSON file downloaded directly as `.zip` named `gpay-backup.json`).
5. **Copy Frontend Code button**: A button that copies the current DOM's rendered HTML (`document.documentElement.outerHTML`) to the clipboard. Shows a brief "Copied!" toast.
6. **Copy Canister ID button**: A button that parses the canister ID from the current URL (e.g. `https://<canister-id>.icp0.io`) and copies it to clipboard. Shows the canister ID in a small tooltip/label. Shows "Copied!" on success.
7. All 3 utility buttons placed in a dedicated "Developer Tools" section inside the "You" tab (ComingSoonPage replaced with a proper ProfilePage / "You" page).

### Modify
- **BalancePage**: Completely rework the flow: Bank selection screen → PIN entry → Balance display (per-bank, with disguised wallet icon edit button). Remove the "Enter 1234 to customize balance" hint text. Balance starts at ₹0.00.
- **App.tsx**: Add `selectedBankForBalance` state passed to BalancePage so it knows which bank to show balance for.
- **"You" tab** (currently ComingSoonPage): Replace with a proper page containing the 3 utility buttons (Backup ZIP, Copy Frontend Code, Copy Canister ID) plus a simple profile section.

### Remove
- The old single-balance backend hooks usage in BalancePage (replace with localStorage-based per-bank balance).
- The "Enter 1234 to customize balance" hint visible text from the balance PIN waiting state.

## Implementation Plan
1. Create `BankBalanceSelectionPage.tsx` — shows HDFC/SBI rows with selectable circles, Continue button. On continue, passes selected bank to BalancePage.
2. Rewrite `BalancePage.tsx` — accept `selectedBank` prop, read/write balance from localStorage per bank, show disguised wallet icon for edit.
3. Update `App.tsx` — add `selectedBankForBalance` state, wire up the new bank-selection → balance flow.
4. Create `YouPage.tsx` — replaces ComingSoon for "you" tab. Contains: profile info, Backup ZIP button, Copy Frontend Code button, Copy Canister ID button. Implement each button's logic.
5. Update `App.tsx` to route "you" tab to `YouPage` instead of `ComingSoonPage`.

## UX Notes
- Wallet icon (disguised) should be a small `Wallet` icon from lucide-react, placed inline to the right of the balance number row, styled subtly (low opacity, small size ~16px).
- Bank selection for balance mirrors the payment bank selection visual (rows with top-right selectable circle, blue tick when selected).
- Backup ZIP downloads a `.json` file named `gpay-backup-<date>.json` (no JSZip needed — just JSON download).
- Copy buttons show a brief "Copied!" feedback via state toggle.
- "Copy Canister ID" reads `window.location.hostname` and extracts the canister ID (first segment before `.`).
