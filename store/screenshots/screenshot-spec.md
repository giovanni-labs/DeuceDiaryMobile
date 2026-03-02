# App Store Screenshot Specs — Deuce Diary

> 5 screenshots, iPhone 6.7" (1290x2796px). Each is a device frame on a branded background with headline + subtext overlay.

## Global Style

- **Background:** `#F5EFE0` (cream)
- **Device frame:** iPhone 15 Pro Max mockup, centered, slight shadow
- **Headline font:** SF Pro Display Bold, 72pt, color `#1A1A1A`
- **Subtext font:** SF Pro Display Regular, 36pt, color `#555555`
- **Text position:** Top 25% of canvas, centered above device frame
- **Safe margins:** 80px on all sides (keeps text clear of notch/status bar area in store grid)

---

## Screenshot 1 — "Track Your Throne Time"

| Field | Value |
|-------|-------|
| **Screen to capture** | Home feed (logged-in state) showing 2-3 recent deuce entries with timestamps, streak badge visible in header, at least one reaction emoji on an entry |
| **Headline** | Track Your Throne Time |
| **Subtext** | One tap. Every day. Build your streak. |
| **Notes** | Use a demo account with 7+ day streak so the streak badge looks impressive. Ensure the feed has varied times of day for realism. |

---

## Screenshot 2 — "Squad Streaks"

| Field | Value |
|-------|-------|
| **Screen to capture** | Group detail screen showing squad name, 3-4 members with streak counts, group streak indicator active |
| **Headline** | Squad Streaks |
| **Subtext** | Keep each other accountable. No slackers. |
| **Notes** | Show a squad with an active group streak (fire icon). Members should have varied streak counts (e.g. 14, 7, 3, 21) to show range. |

---

## Screenshot 3 — "Climb the Leaderboard"

| Field | Value |
|-------|-------|
| **Screen to capture** | Leaderboard screen showing ranked list of squad members by deuce count, trophy icon on rank 1, clear rank numbers |
| **Headline** | Climb the Leaderboard |
| **Subtext** | Friendly competition keeps you regular. |
| **Notes** | Show 5+ members with #1 clearly highlighted. Use fun display names. The trophy badge on the leader should be visible. |

---

## Screenshot 4 — "Never Miss a Day"

| Field | Value |
|-------|-------|
| **Screen to capture** | Streak calendar view showing a month with logged days highlighted (green/filled dots), current streak count prominently displayed |
| **Headline** | Never Miss a Day |
| **Subtext** | Your streak is your reputation. Protect it. |
| **Notes** | Show a month where ~25 of 30 days are filled to demonstrate consistency. Current streak number should be large and visible (e.g. "25 days"). |

---

## Screenshot 5 — "Join the Movement"

| Field | Value |
|-------|-------|
| **Screen to capture** | Invite/share screen showing referral link, "Invite Friends" button, squad invite flow, or social sharing options |
| **Headline** | Join the Movement |
| **Subtext** | Bring your friends. Build your squad. |
| **Notes** | Show the invite mechanism clearly. If the screen has a referral code or shareable link, make sure it's visible. A "copy link" or share sheet preview adds authenticity. |

---

## Production Checklist

- [ ] Capture all screens at 3x resolution on iPhone 15 Pro Max simulator (1290x2796)
- [ ] Use consistent demo data across all screenshots (same username, same squad)
- [ ] Composite each capture into the template (cream background + text + device frame)
- [ ] Export as PNG, sRGB color space
- [ ] Verify each file is under 10MB (App Store limit per screenshot)
- [ ] Upload in order 1-5 to App Store Connect

---

## NEEDS KYLE

The following values in `eas.json` → `submit.production.ios` are empty and must be filled before submission:

- **`ascAppId`** (line 37) — The App Store Connect app ID. Found in App Store Connect → App Information → Apple ID.
- **`appleTeamId`** (line 38) — The Apple Developer Team ID. Found in developer.apple.com → Membership → Team ID.

Without these, `eas submit` will fail.
