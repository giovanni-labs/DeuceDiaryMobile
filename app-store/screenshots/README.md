# App Store Screenshots

## Required: iPhone 6.9" Display (iPhone 15 Pro Max)

**Resolution:** 1290 x 2796 pixels

You need **at minimum 3 screenshots** (Apple requires 3-10). Aim for 5.

### Recommended 5 Screens

1. **Feed** — Show the live deuce feed with group activity
2. **Log a Deuce** — The deuce logging screen with rating/notes
3. **Groups** — Group list or group detail with members
4. **Leaderboard** — Who's dropping the most deuces
5. **Onboarding/Invite** — The invite flow or welcome screen

### How to Capture

1. Run the app in **iPhone 15 Pro Max** simulator:
   ```bash
   npx expo start --ios
   # In Expo Go, press `i` to open iOS simulator
   # Or: xcrun simctl boot "iPhone 15 Pro Max"
   ```

2. Navigate to each screen and take a screenshot:
   - **Simulator:** Cmd+S (saves to Desktop)
   - **CLI:** `xcrun simctl io booted screenshot screen1.png`

3. Ensure screenshots are exactly **1290 x 2796**. Resize if needed:
   ```bash
   sips -z 2796 1290 screen1.png
   ```

4. Save final screenshots here as:
   - `01-feed.png`
   - `02-log-deuce.png`
   - `03-groups.png`
   - `04-leaderboard.png`
   - `05-onboarding.png`

### Tips
- Use realistic-looking data (not "test" or "lorem ipsum")
- Light mode preferred for first submission
- No status bar overlays needed — Apple adds device frames automatically
