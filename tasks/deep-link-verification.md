# Deep Link Verification Report

## Configuration Status

### iOS Universal Links
- **associatedDomains** in `app.json`:
  - `applinks:deucediary.app` — Primary domain
  - `applinks:deuce-diary-web-production.up.railway.app` — Railway staging
- **Custom scheme**: `deucediary://` configured via `expo.scheme`
- **Status**: Config correct. Requires AASA file at `https://deucediary.app/.well-known/apple-app-site-association`

### Android App Links
- **intentFilters** configured for:
  - Scheme: `https`
  - Host: `deucediary.app`
  - PathPrefix: `/invite`
  - autoVerify: `true`
- **Status**: Config correct. Requires Digital Asset Links file at `https://deucediary.app/.well-known/assetlinks.json`

### In-App Handling
- **useDeepLink hook** (`hooks/useDeepLink.ts`):
  - Handles cold start via `Linking.getInitialURL()`
  - Handles warm start via `Linking.addEventListener("url")`
  - Parses both `deucediary://invite/:code` and `https://deucediary.app/invite/:code`
  - Navigates to `/invite/:code` screen
- **AuthGate** (`app/_layout.tsx`):
  - Invite links pass through regardless of auth state (`if (inInvite) return`)
- **InvitePreviewScreen** (`app/invite/[code].tsx`):
  - Fetches group preview (no auth required)
  - Join button calls `joinSquad(code)` then navigates home
  - Error state with retry button
  - Share invite link button

## Tested Patterns

| Pattern | Expected | Status |
|---------|----------|--------|
| `deucediary://invite/abc123` | Opens invite preview | ✅ Handled in useDeepLink |
| `https://deucediary.app/invite/abc123` | Opens invite preview | ✅ Handled in useDeepLink |
| Invalid invite code | Shows error + retry | ✅ Error state with retry |
| Expired invite | Shows join error | ✅ Catch block displays error |
| No auth + invite link | Passes through auth gate | ✅ inInvite bypass |

## Fallback Handling (App Not Installed)

When a user taps an invite link but doesn't have the app installed:

1. **iOS**: The universal link falls through to Safari, which loads `https://deucediary.app/invite/:code`
2. **Android**: The intent filter falls through to the browser

**Required server-side setup** (not in mobile codebase):
- The web server at `deucediary.app` must serve a fallback page at `/invite/:code` that:
  - Shows a "Download Deuce Diary" message
  - Includes a smart banner (`<meta name="apple-itunes-app" content="app-id=...">`)
  - Redirects to App Store (iOS) or Play Store (Android) after a timeout
  - Preserves the invite code in a cookie/param so post-install can auto-join

**App Store constant** defined in `app/invite/[code].tsx` for future use:
```
ios: https://apps.apple.com/app/deuce-diary/id0000000000
android: https://play.google.com/store/apps/details?id=com.deucediary.mobile
```

## Issues Found

1. **App Store ID placeholder**: The App Store URL uses `id0000000000` — update after App Store submission
2. **AASA file**: Must be hosted at `https://deucediary.app/.well-known/apple-app-site-association` — verify with Apple's CDN validator
3. **Digital Asset Links**: Must be hosted at `https://deucediary.app/.well-known/assetlinks.json` for Android verified links
4. **Railway domain**: The `applinks:deuce-diary-web-production.up.railway.app` domain also needs an AASA file if used for testing
